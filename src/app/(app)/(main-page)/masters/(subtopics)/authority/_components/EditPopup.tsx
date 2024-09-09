'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { z, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const authorityDetailsSchema = object({
  authority: z.string().nonempty('Authority is required'),
  designation: z.string().nonempty('Designation is required'),
  status: z.string().nonempty('Status is required')});

type AuthorityDetailsInput = TypeOf<typeof authorityDetailsSchema>;

interface AuthorityDetailsFormProps {
  onClose: () => void;
}

export default function AuthorityDetailsForm({ onClose }: AuthorityDetailsFormProps) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<AuthorityDetailsInput>({
    resolver: zodResolver(authorityDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<AuthorityDetailsInput> = (values) => {
    setLoading(true);
    console.log(values);
    // Handle form submission logic here
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
     
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="space-y-4 pt-10">
                <div className="grid gap-4 grid-cols-1">

                  <div className="grid grid-cols-[150px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="authority" className="mt-3">Authority</Label>
                    <div>
                      <Input id="authority" {...methods.register('authority')} />
                      {errors.authority && (
                        <p className="text-red-500 mt-1">{errors.authority.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[150px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="designation" className="mt-3">Designation</Label>
                    <div>
                      <Input id="designation" {...methods.register('designation')} />
                      {errors.designation && (
                        <p className="text-red-500 mt-1">{errors.designation.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[150px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="status" className="mt-3">Status</Label>
                    <div>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-red-500 mt-1">{errors.status.message}</p>
                      )}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button className="px-10" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        
    </motion.div>
  );
}
