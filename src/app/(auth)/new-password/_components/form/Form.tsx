'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@mui/material';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation'
import { toastWithTimeout, ToastVariant } from '@/components/ui/use-toast';
import { makeApiCall } from '@/lib/apicaller';
import { AuthService } from '@/services/api/auth-service';
 
// Validation schema using Zod
const loginSchema = object({
   
  newPassword: string()
    .nonempty('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

type LoginInput = TypeOf<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);
  
  const onSubmitHandler: SubmitHandler<LoginInput> = async(values) => {
    console.log(values);
    // Handle login logic here
    await new Promise((resolve, reject) => {
      makeApiCall(
        () => new AuthService().change_authenticated_password(values.newPassword), 
        {
          afterSuccess: (data: any) => {
            console.log(data,"data is heree");
            
            toastWithTimeout(ToastVariant.Success, "Password Updated Successfully");
            // resetPasswordForm();
            // handleLogout()
            resolve(true);  // Resolve the promise after successful password change
          },
          afterError: (err: any) => {
            toastWithTimeout(ToastVariant.Error, "An Error Occurred");
            reject(err);  // Reject the promise with the error
          }
        }
      );
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        
       

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            placeholder="Enter your new password"
            type="password"
            fullWidth
            required
            {...register('newPassword')}
            sx={{
              '& .MuiInputBase-input': {
                padding: '0.5rem',
                backgroundColor: 'white',
              },
            }}
            error={!!errors.newPassword}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <Button
          className="w-full bg-primary hover:border hover:border-primary hover:bg-secondary hover:text-primary"
          type="submit"
         >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
