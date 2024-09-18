'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@mui/material';
import { makeApiCall } from '@/lib/apicaller';
import { AuthService } from '@/services/api/auth-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';

// Validation schema using Zod
const loginSchema = object({
  email: string().nonempty('Email is required').email('Email is invalid'),
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

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    console.log(values);
    makeApiCall(
      () => new AuthService().reset_password(values.email),{
        afterSuccess:()=>{
          toastWithTimeout(ToastVariant.Success,"Password reseted")
        },
        afterError: () => {
          toastWithTimeout(ToastVariant.Destructive,"Password Error")
        }
      }
    )
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="your@example.com"
            type="email"
            fullWidth
            required
            className=''
            {...register('email')}
            sx={{
              '& .MuiInputBase-input': {
                padding: '0.5rem',
                backgroundColor: 'white',
              },
            }}
            error={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
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
