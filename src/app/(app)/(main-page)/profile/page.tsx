'use client';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthService, fetchUserDetails } from '@/services/api/auth-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateFallbackAvatar } from '../../_components/navbar/Navbar';
import { makeApiCall } from '@/lib/apicaller';
import { UserService } from '@/services/api/user-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { EdgeFunctionService } from '@/services/api/edge-function-service';
import { useRouter } from 'next/navigation';
import { countryCodes } from '@/lib/constants';


// Zod Schema for password validation
const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});


export default function Component() {
  const { data: userDetails, isSuccess } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
  });

  // Set initial country code from userDetails?.code if available, else fallback to '+974'
  const initialCountryCode = userDetails?.code
    ? (userDetails.code.startsWith('+') ? userDetails.code : `+${userDetails.code}`)
    : '+974';

  // Use a state that updates when userDetails changes
  const [countryCode, setCountryCode] = useState(initialCountryCode);

  // Ensure countryCode updates if userDetails changes (e.g., after fetch)
  useEffect(() => {
    if (userDetails?.code) {
      setCountryCode(userDetails.code.startsWith('+') ? userDetails.code : `+${userDetails.code}`);
    }
  }, [userDetails?.code]);

  const [activeTab, setActiveTab] = useState("personal");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<File | null>(null);

  // Zod Schema for validation
  const getPhoneValidationSchema = (code: string) => {
    const countryInfo = countryCodes.find((country:any) => country.e164_cc === code.replace('+', ''));

    if (!countryInfo) {
      return z.string().nonempty("Phone number is required");
    }

    const maxLength = countryInfo.example.length;

    return z.string()
      .nonempty("Phone number is required")
      .refine(
        (value) => value.length == maxLength,
        `Phone number should be ${maxLength} digits for ${countryInfo.name}`
      );
  };

  const schema = z.object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    mobile: getPhoneValidationSchema(countryCode),
  });

  useEffect(() => {
    const uploadLink = document.getElementById('upload_link');
    const fileInput = document.getElementById('upload') as HTMLInputElement;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      fileInput?.click();
    };

    // Add event listener to the link
    if (uploadLink && fileInput) {
      uploadLink.addEventListener('click', handleClick);
    }

    // Clean up the event listener on component unmount or re-render
    return () => {
      if (uploadLink) {
        uploadLink.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const fallbackAvatar = generateFallbackAvatar(userDetails?.name || userDetails?.email?.split('@')[0]);

  // Handle image upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileBuffer(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedFile(imageUrl);
    }
  };

  // Helper function to extract country code and phone number
  const extractPhoneDetails = (fullPhone: any) => {
    // Ensure fullPhone is a string
    if (typeof fullPhone !== 'string') {
      if (fullPhone == null) {
        return { countryCode: initialCountryCode, phoneNumber: '' };
      }
      // Try to convert to string if possible
      try {
        fullPhone = String(fullPhone);
      } catch {
        return { countryCode: initialCountryCode, phoneNumber: '' };
      }
    }
    if (!fullPhone) return { countryCode: initialCountryCode, phoneNumber: '' };
    
    // Supported country codes in descending order of length to ensure proper matching
    const supportedCodes = ['+974', '+91', '+44', '+1'];
    supportedCodes.sort((a, b) => b.length - a.length); // Sort by length (longest first)
    
    for (const code of supportedCodes) {
      if (fullPhone.startsWith(code)) {
        return {
          countryCode: code,
          phoneNumber: fullPhone.substring(code.length)
        };
      }
    }
    
    // Default fallback if no code matches
    return { countryCode: initialCountryCode, phoneNumber: fullPhone };
  };

  // Setup react-hook-form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
    },
  });

  const { register: passwordRegister, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  
  const handleLogout = () => {
    const service = new AuthService();
    makeApiCall(
      () => service.userLogout(),
      {
        toastContent: "Logout Successful",
        afterSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      }
    );
  };

  const onSubmitPassword = async (data: any) => {
    try {
      // Step 1: Verify the new password (using a promise-based approach)
      const verificationResult = await new Promise((resolve, reject) => {
        makeApiCall(
          () => new AuthService().verify_user_password(data.currentPassword),
          {
            afterSuccess: (result: any) => {
              result === false && toastWithTimeout(ToastVariant.Success, "Error: Invalid password");
              resolve(result);  // Resolve the promise with the verification result
            },
            afterError: (error: any) => {
              toastWithTimeout(ToastVariant.Destructive, "Error: Invalid password");
              reject(error);  // Reject the promise with the error
            }
          }
        );
      });

      // Step 2: If verification is successful, change the password
      if (verificationResult) {
        await new Promise((resolve, reject) => {
          makeApiCall(
            () => new AuthService().change_authenticated_password(data.newPassword),
            {
              afterSuccess: (data: any) => {
                toastWithTimeout(ToastVariant.Success, "Password Updated Successfully");
                resetPasswordForm();
                handleLogout();
                resolve(true);  // Resolve the promise after successful password change
              },
              afterError: (err: any) => {
                toastWithTimeout(ToastVariant.Success, "An Error Occurred");
                reject(err);  // Reject the promise with the error
              }
            }
          );
        });
      }
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

  const queryClient = useQueryClient();

  // Effect to handle user details loading and form reset
  useEffect(() => {
    if (isSuccess && userDetails) {
      // Extract country code and phone number
      const { countryCode: extractedCode, phoneNumber } = extractPhoneDetails(userDetails.phone || '');
      
      // Update the country code state, prefer userDetails.code if available
      if (userDetails.code) {
        setCountryCode(userDetails.code.startsWith('+') ? userDetails.code : `+${userDetails.code}`);
      } else {
        setCountryCode(extractedCode);
      }
      
      // Reset form with user details and extracted phone number
      reset({
        name: userDetails.name || "",
        email: userDetails.email || "",
        mobile: phoneNumber || ""
      });
    }
  }, [isSuccess, reset, userDetails]);

  const uploadImage = useCallback(async () => {
    if (!fileBuffer) return;
    const formData = new FormData();
    formData.append('file', fileBuffer);
    formData.append('filename', `${Date.now()}`);

    return new Promise((resolve, reject) => {
      makeApiCall(
        () => new UserService().uploadFile(formData, `${Date.now()}`, 'user'),
        {
          afterSuccess: (data: any) => {
            resolve(data?.fullPath);  // Resolve the promise with the full image path
          },
          afterError: (error: any) => {
            reject(error);  // Reject the promise with the error
          }
        }
      );
    });
  }, [fileBuffer]);

  const onSubmit = async (data: any) => {
    const fullMobileNumber = `${countryCode}${data.mobile}`;  // Combine country code with mobile number
    
    makeApiCall(
      async () => new UserService().updateUser({
        ...data,
        mobile: data.mobile,  // Use the combined number for the API
        code: countryCode,
        avatar: fileBuffer ? await uploadImage() : userDetails?.avatar,
        id: userDetails.id,
      }), {
      afterSuccess: () => {
        toastWithTimeout(ToastVariant.Success, "Profile Updated");
        queryClient.invalidateQueries({ queryKey: ['userDetails'] });
        queryClient.refetchQueries({ queryKey: ['userDetails'] });
      },
      afterError: (err: any) => {
        toastWithTimeout(ToastVariant.Success, "An Error Occurred");
      }
    });
  };

  return (
    <Card className="w-full bg-[#fafbfb] p-0 rounded-none border-0 mx-auto ">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
            <TabsTrigger
              value="personal"
              className={activeTab === "personal" ? "bg-[#8B1F41] text-white" : ""}
            >
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className={activeTab === "password" ? "bg-[#8B1F41] text-white" : ""}
            >
              Change Password
            </TabsTrigger>
          </TabsList>

          {/* Personal Details Form */}
          <TabsContent value="personal" className="space-y-6 bg-white py-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex space-x-8">
                <div className="flex flex-col items-center min-w-[30%]">
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />

                  <Avatar className="mb-2 w-[200px] h-[200px]">
                    <AvatarImage
                      className="object-cover w-full h-full"
                      alt={`${userDetails?.name}'s avatar`}
                      src={uploadedFile || (userDetails?.avatar !== "" ? process.env.NEXT_PUBLIC_IMG_URL + userDetails?.avatar : "/placeholder.svg?height=100&width=100")}
                    />
                    <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                  </Avatar>

                  <a href="#" id="upload_link" className="text-[#8B1F41] hover:underline">Upload Image</a>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="name" className="w-[150px]">Full Name</Label>
                    <Input {...register("name")} id="name" placeholder="Enter your full name" className="flex-1" />
                  </div>
                  {errors?.name && <p className="text-red-500 text-[13px]">{errors?.name?.message as string}</p>}

                  <div className="flex items-center space-x-4">
                    <Label htmlFor="email" className="w-[150px]">Email Address</Label>
                    <Input {...register("email")} id="email" type="email" placeholder="Enter your email address" className="flex-1" />
                  </div>
                  {errors.email && <p className="text-red-500 text-[13px]">{errors.email?.message as string}</p>}

                  <div className="flex items-center space-x-4">
                    <Label htmlFor="mobile" className="w-[150px]">Mobile Number</Label>
                    <div className="flex-1 flex space-x-2">
                      <Select
                        value={countryCode}
                        onValueChange={(value) => {
                          setCountryCode(value);
                          // When country code changes, we need to revalidate the phone number
                          const currentPhone:any = register("mobile");
                          if (currentPhone?.value) {
                            setValue("mobile", currentPhone?.value, { 
                              shouldValidate: true 
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+974">+974</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        {...register("mobile")}
                        id="mobile"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*" // Allows only numbers 0–9
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value.replace(/[^0-9]/g, ""); // Remove non-digit characters
                        }}
                        placeholder="Enter your mobile number"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  {errors.mobile && <p className="text-red-500 text-[13px]">{errors?.mobile?.message as string}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button type='button' variant="outline" className="border-[#8B1F41] text-[#8B1F41]" onClick={()=>router.back()}>Cancel</Button>
                <Button type="submit" className="bg-[#8B1F41] text-white hover:bg-[#6B1732]">Save</Button>
              </div>
            </form>
          </TabsContent>

          {/* Password Change Form */}
          <TabsContent value="password" className="bg-white p-5">
            <div className="space-y-4 max-w-md">
              <h2 className="font-bold text-xl">Change Password</h2>
              <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input {...passwordRegister("currentPassword")} id="currentPassword" type="password" />
                  {passwordErrors.currentPassword && <p className="text-red-500 text-[13px]">{passwordErrors.currentPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input {...passwordRegister("newPassword")} id="newPassword" type="password" />
                  {passwordErrors.newPassword && <p className="text-red-500 text-[13px]">{passwordErrors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input {...passwordRegister("confirmPassword")} id="confirmPassword" type="password" />
                  {passwordErrors.confirmPassword && <p className="text-red-500 text-[13px]">{passwordErrors.confirmPassword.message}</p>}
                </div>

                <div className="flex justify-end mt-4">
                  <Button type="submit" className="bg-[#8B1F41] text-white hover:bg-[#6B1732]">Update Password</Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}