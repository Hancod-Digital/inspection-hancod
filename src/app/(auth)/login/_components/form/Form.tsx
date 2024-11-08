'use client'
import { useForm, SubmitHandler, FormProvider,  Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@mui/material';
import { AuthService } from '@/services/api/auth-service';
import { makeApiCall } from '@/lib/apicaller';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

// Validation schema using Zod
const loginSchema = object({
  email: string().nonempty('Email is required').email('Email is invalid'),
  password: string()
    .nonempty('Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  remember: string().optional(), // no validation for remember me checkbox
});

type LoginInput = TypeOf<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
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
  
    const service = new AuthService();
    makeApiCall(
        () =>
            service
                .userLogin(values.email,values.password),
        {   
            toastContent:"Login successful!",
            toast,
          
            afterSuccess: () => {
                router.push('/dashboard')
                router.refresh()       
            },
            
        }
    );
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
        <Controller
          name="email"
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              placeholder="your@example.com"
              type="email"
              fullWidth
              required
              onChange={(e) => field.onChange(e.target.value.toLowerCase())}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '0.5rem',
                  backgroundColor: 'white',
                },
              }}
              error={!!errors.email}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
 

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/forgot-password"><Button type='button' className="p-0 text-primary ml-auto" variant="link">
              Forgot Password
            </Button></a>
          </div>
          <Input
            id="password"
            type="password"
            fullWidth
            required
            {...register('password')}
            sx={{
              '& .MuiInputBase-input': {
                padding: '0.5rem',
                backgroundColor: 'white',
              },
            }}
            error={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center w-full ">
  <Checkbox
    id="remember"
    {...register('remember')}
    className="w-4 h-4 rounded  border-gray-300 mr-2 text-black focus:ring-primary"
  />
  <label htmlFor="remember" className="text-sm text-gray-600">
    Remember me
  </label>
  
</div>


        <Button
          className="w-full bg-primary hover:border hover:border-primary border hover:bg-secondary hover:text-primary"
          type="submit"
         
        >
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
