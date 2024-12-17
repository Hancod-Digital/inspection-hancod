'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { makeApiCall } from '@/lib/apicaller';
import { UserService } from '@/services/api/user-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { StudentService } from '@/services/api/students-service';
import { useQuery } from '@tanstack/react-query';
import { fetchUserDetails } from '@/services/api/auth-service';
import { getLastTwoDigitsOfCurrentYear } from '@/lib/utils';
import { countryCodes } from '@/lib/constants';



interface UserFormProps {
  onClose: () => void;
  setChanged: any;
  changed: any;
}

const generateFallbackAvatar = (nameOrEmail: string) => {
  return nameOrEmail.charAt(0).toUpperCase();
};

export default function UserForm({ onClose, setChanged, changed }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState('+974');  // Default country code
  const getPhoneValidationSchema = (code: string) => {
     
    const countryInfo = countryCodes.find((country:any) => country.e164_cc === code.replace('+', ''));
  
    if (!countryInfo) {
      return z.string().nonempty("Phone number is required");
    }
  
    const maxLength = countryInfo.example.length;
  
    return z.string()
      .nonempty("Phone number is required")
      .refine
      (
        (value) => value.length == maxLength,
        `Phone number should be ${maxLength} digits for ${countryInfo.name}`
      );
  };

  // Define schema for validation
const userFormSchema = object({
  name: string().nonempty('Name is required'),
  email: string().nonempty('Email is required').email('Invalid email address').transform(val => val.toLowerCase()),
  contact_number: getPhoneValidationSchema(countryCode),
  address: string().nonempty('Address is required'),
  gender: string().nonempty('Gender is required'),
  company: string().nonempty('Company is required'),
  id_no: string().nonempty('ID Number is required'),
  designation: string().max(49).nonempty('Designation is required'),
  model_level: string().nonempty('Model/Level is required'),
  issued_on: string().nonempty('Issued On date is required'),
  valid_untill: string().nonempty('Valid Until date is required'),
  course_duration: string().nonempty('Course duration is required'), // Added field
  image: string().nonempty('Profile image is required'), // Add this field
});
type UserFormInput = TypeOf<typeof userFormSchema>;

  // Update image handling
  // Cropping state
  const [crop, setCrop] = useState<any>({
    unit: '%',
    width: 50,
    aspect: 1.12,
  });
  const [src, setSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Using React Query to fetch user active status with object syntax (v5+)
  const { data: userDetails, isLoading, isError } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
  });

  const userName = userDetails?.name !== '' ? userDetails?.name : userDetails?.email?.split('@')[0];

  const methods = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      image: '', // Add default value
    }
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    register,
    setValue, // Added setValue
    watch,     // Added watch
  } = methods;

  // Watch issued_on and update valid_untill accordingly
  useEffect(() => {
    const issuedOn = watch('issued_on');
    if (issuedOn) {
      const issuedDate = new Date(issuedOn);
      const validUntilDate = new Date(issuedDate);
      validUntilDate.setFullYear(validUntilDate.getFullYear() + 1);

      // Format the date to YYYY-MM-DD
      const formattedValidUntil = validUntilDate.toISOString().split('T')[0];

      setValue('valid_untill', formattedValidUntil, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watch('issued_on'), setValue]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setCroppedFile(null);
      setPreviewUrl(null);
    }
  }, [isSubmitSuccessful, reset]);

  const uploadImage = useCallback(async () => {
    if (!croppedFile) return;
    const formData = new FormData();
    formData.append('file', croppedFile);
    formData.append('filename', `${Date.now()}_${croppedFile.name}`);

    return new Promise((resolve, reject) => {
      makeApiCall(
        () => new UserService().uploadFile(formData, `${Date.now()}_${croppedFile.name}`, 'students'),
        {
          afterSuccess: (data: any) => {
            resolve(data?.fullPath); // Resolve the promise with the full image path
          },
          afterError: (error: any) => {
            reject(error); // Reject the promise with the error
          },
        }
      );
    });
  }, [croppedFile]);

  const onSubmitHandler: SubmitHandler<UserFormInput> = async (values) => {
    setLoading(true);
    try {
      const avatarUrl = croppedFile ? "https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/"+await uploadImage() : '';
     
      const value = {
        name: values.name,
        email: values.email,
        contact_number: values.contact_number,
        address: values.address,
        gender: values.gender,
        company: values.company,
        id_no: values.id_no,
        designation: values.designation,
        model_level: values.model_level,
        issued_on: values.issued_on,
        valid_untill: values.valid_untill,
        course_duration: values.course_duration,
        added_by: userName,
        avatar: avatarUrl
      };
      await makeApiCall(
        async () =>
          new StudentService().addStudent({
            ...value,
            avatar: avatarUrl,
            added_by: userName,
            certificate_no: "QSIS-TRA-" + getLastTwoDigitsOfCurrentYear()
          }),
        {
          afterSuccess: () => {
            toastWithTimeout(ToastVariant.Success, 'Operation successful');
            setChanged(!changed);
            reset();
          },
          afterError: (err: any) => {
            toastWithTimeout(ToastVariant.Success, 'An Error Occurred');
          },
        }
      );
    } catch (error) {
      toastWithTimeout(ToastVariant.Success, 'Failed to upload image');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Handle image selection for cropping
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoadedCrop = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
  };


  const makeClientCrop = async (crop: Crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const cropped = await getCroppedImg(imageRef.current, crop);
      if (cropped) {
        setCroppedFile(cropped);
      }
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<File | null> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width! * scaleX * pixelRatio;
    canvas.height = crop.height! * scaleY * pixelRatio;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
        0,
        0,
        crop.width! * scaleX,
        crop.height! * scaleY
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          resolve(null);
          return;
        }
        const croppedFile = new File([blob], 'cropped_image.jpeg', { type: 'image/jpeg' });
        resolve(croppedFile);
      }, 'image/jpeg');
    });
  };

  const handleCropSave = () => {
    if (croppedFile) {
      const objectUrl = URL.createObjectURL(croppedFile);
      setPreviewUrl(objectUrl);
      setIsCropModalOpen(false);
    }
  };

  // Cleanup the object URL when component unmounts or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fallbackAvatar = generateFallbackAvatar('User');
  
  useEffect(() => {
    if (croppedFile) {
      // When image is cropped, update the form value
      setValue('image', 'image-selected', { 
        shouldValidate: true,
        shouldDirty: true 
      });
    }
  }, [croppedFile, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-0 p-0 hover:bg-white">
        <CardContent>
          <FormProvider {...methods}>
            <CardHeader>
              <CardTitle className="text-md w-full">User Details</CardTitle>
            </CardHeader>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              {/* Profile Image Section */}
              <div className="flex items-center gap-5">
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Avatar className="mb-2 w-[200px] h-[200px]">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    alt="User's avatar"
                    src={previewUrl || '/placeholder.svg'}
                  />
                  <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <label htmlFor="upload" className="text-[#8B1F41] hover:underline cursor-pointer">
                    Upload Image
                  </label>
                  {errors.image && (
                    <p className="text-red-500 text-[13px]">{errors.image.message}</p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* Name and Email */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="name">
                    Name
                  </Label>
                  <div>
                    <Input id="name" {...register('name', { setValueAs: (value) => value?.trim() })} />
                    {errors.name && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="email">
                    Email
                  </Label>
                  <div>
                    <Input id="email" {...register('email')} />
                    {errors.email && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Number and Address */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="contact_number">
                    Contact Number
                  </Label>
                  <div>
                    <section className='flex'>
                      <Select value={countryCode} onValueChange={setCountryCode}>
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
                      id="contact_number"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*" // Allows only numbers 0–9
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Remove non-digit characters
                      }}
                      {...register('contact_number')}
                    />
                    </section>
                    {errors.contact_number && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.contact_number.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="address">
                    Address
                  </Label>
                  <div>
                    <Input id="address" {...register('address')} />
                    {errors.address && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="gender">
                    Gender
                  </Label>
                  <div>
                    <Controller
                      name="gender"
                      control={methods.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {errors.gender && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-md w-full">Company/Other Details</CardTitle>
              </CardHeader>

              <div className="grid grid-cols-2 gap-6 ">
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="company">
                    Company
                  </Label>
                  <div>
                    <Input id="company" {...register('company')} />
                    {errors.company && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.company.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="id_no">
                    Qatar ID/ Employer ID No:
                  </Label>
                  <div>
                    <Input id="id_no" {...register('id_no')} />
                    {errors.id_no && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.id_no.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="designation">
                    Designation / Course
                  </Label>
                  <div>
                    <Input id="designation"  {...register('designation')} />
                    {errors.designation && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.designation.message}</p>
                    )}
                  </div>
                </div>

                {/* Model/Level and Issued On */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="model_level">
                    Model/Level
                  </Label>
                  <div>
                    <Input id="model_level" {...register('model_level')} />
                    {errors.model_level && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.model_level.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="issued_on">
                    Issued On
                  </Label>
                  <div>
                    <Input
                      id="issued_on"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      {...register('issued_on')}
                    />
                    {errors.issued_on && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.issued_on.message}</p>
                    )}
                  </div>
                </div>

                {/* Valid Until */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="valid_untill">
                    Expiry Date
                  </Label>
                  <div>
                    <Input
                      id="valid_untill"
                      type="date"
                      {...register('valid_untill')}
                    // Removed defaultValue as it's now dynamically set
                    />
                    {errors.valid_untill && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.valid_untill.message}</p>
                    )}
                  </div>
                </div>

                {/* Course Duration */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="course_duration">
                    Course Duration
                  </Label>
                  <div className="relative">
                    <Input
                      id="course_duration"
                      {...register('course_duration')}
                      type="tel"
                      placeholder='Days'
                      inputMode="numeric"
                      pattern="[0-9]*" // Allows only numbers 0–9
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Remove non-digit characters
                      }}
                      className="pr-12" // Adds space to the right for the "Days" label
                    />
                    {/* <span className="   flex items-center pr-3 text-gray-500">
                      Days
                    </span> */}
                    {errors.course_duration && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.course_duration.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bottom-0 left-0 p-4 text-black text-sm font-semibold">
                <ul className="list-disc list-inside">
                  <li>Post the details, click on the submit button</li>
                  <li>After posting the details, click on the &apos;User details&apos; tab to display user details.</li>
                  <li>And click on the &apos;Generate QR-Code&apos; button to create a QR code</li>
                </ul>
              </div>


              <div className="flex w-full justify-end pt-20 gap-4">
                <Button type="reset" className="px-10 " onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border "
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Crop Modal */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Adjust the cropping area as needed and apply the crop.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[400px] overflow-auto">
            {src && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => makeClientCrop(c)}
                aspect={1}
              >
                <img src={src} onLoad={onImageLoadedCrop} alt="Crop" />
              </ReactCrop>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCropSave}
              className='hover:bg-secondary hover:text-primary hover:border-primary border'
              disabled={!croppedFile}
            >
              Apply Crop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
