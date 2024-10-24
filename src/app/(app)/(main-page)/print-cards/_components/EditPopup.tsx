'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { makeApiCall } from '@/lib/apicaller';
import { UserService } from '@/services/api/user-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { StudentService } from '@/services/api/students-service';

// Define schema for validation
const userFormSchema = object({
  name: string().nonempty('Name is required'),
  email: string().nonempty('Email is required').email('Invalid email address'),
  contact_number: string().nonempty('Contact number is required'),
  address: string().nonempty('Address is required'),
  gender: string().nonempty('Gender is required'),
  company: string().nonempty('Company is required'),
  id_no: string().nonempty('ID Number is required'),
  card_no: string().nonempty('Card Number is required'),
  designation: string().nonempty('Designation is required'),
  model_level: string().nonempty('Model/Level is required'),
  issued_on: string().nonempty('Issued On date is required'),
  valid_untill: string().nonempty('Valid Until date is required'),
  course_duration: string().nonempty('Course duration is required'),
});

type UserFormInput = TypeOf<typeof userFormSchema>;

interface UserFormProps {
  onClose: () => void;
  setChanged: any;
  changed: any;
  userData: UserFormInput & { avatar?: string }; // Added avatar field
  id: number;
}

const generateFallbackAvatar = (nameOrEmail: string) => {
  return nameOrEmail.charAt(0).toUpperCase();
};

export default function EditUserForm({
  onClose,
  setChanged,
  changed,
  userData,
  id,
}: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(userData.avatar || null);
  const [fileBuffer, setFileBuffer] = useState<File | null>(null);

  const methods = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: userData,
  });

  const uploadImage = useCallback(async () => {
    if (!fileBuffer) return;
    const formData = new FormData();
    formData.append('file', fileBuffer);
    formData.append('filename', `${Date.now()}`);

    return new Promise((resolve, reject) => {
      makeApiCall(
        () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
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
  }, [fileBuffer]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    register,
    control,
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<UserFormInput> = async (values) => {
    setLoading(true);
    makeApiCall(
      async () =>
        new StudentService().editStudent(id, {
          ...values,
          avatar: fileBuffer
            ? 'https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/' +
              (await uploadImage())
            : userData.avatar || '',
        }),
      {
        afterSuccess: () => {
          toastWithTimeout(ToastVariant.Success, 'Update successful');
          setChanged(!changed);
          reset();
          onClose();
        },
        afterError: (err: any) => {
        
          toastWithTimeout(ToastVariant.Error, 'An Error Occurred');
        },
      }
    );

    setLoading(false);
  };

  // Handle image upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileBuffer(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedFile(imageUrl);
    }
  };

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

  const fallbackAvatar = generateFallbackAvatar(userData.name || 'User');

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
              <CardTitle className="text-md w-full">Edit User Details</CardTitle>
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
                  onChange={handleUpload}
                  className="hidden"
                />
                <Avatar className="mb-2 w-[200px] h-[200px]">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    alt="User's avatar"
                    src={uploadedFile || '/placeholder.svg'}
                  />
                  <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                </Avatar>
                <a href="#" id="upload_link" className="text-[#8B1F41] hover:underline">
                  Upload Image
                </a>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* Name and Email */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="name">
                    Name
                  </Label>
                  <div>
                    <Input id="name" {...register('name')} />
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
                    <Input id="contact_number" {...register('contact_number')} />
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
                      control={control}
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
                    ID No
                  </Label>
                  <div>
                    <Input id="id_no" {...register('id_no')} />
                    {errors.id_no && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.id_no.message}</p>
                    )}
                  </div>
                </div>

                {/* Card No and Designation */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="card_no">
                    Card No
                  </Label>
                  <div>
                    <Input id="card_no" {...register('card_no')} />
                    {errors.card_no && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.card_no.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="designation">
                    Designation
                  </Label>
                  <div>
                    <Input id="designation" {...register('designation')} />
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
                    <Input id="issued_on" type="date" {...register('issued_on')} />
                    {errors.issued_on && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.issued_on.message}</p>
                    )}
                  </div>
                </div>

                {/* Valid Until */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label className="pt-3" htmlFor="valid_untill">
                    Valid Until
                  </Label>
                  <div>
                    <Input id="valid_untill" type="date" {...register('valid_untill')} />
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
                  <div>
                    <Input id="course_duration" {...register('course_duration')} />
                    {errors.course_duration && (
                      <p className="text-red-500 text-[13px] mt-1">{errors.course_duration.message}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                
              </div>
              <div className="flex justify-end pt-20 gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border " type="submit" variant={'default'} disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}
