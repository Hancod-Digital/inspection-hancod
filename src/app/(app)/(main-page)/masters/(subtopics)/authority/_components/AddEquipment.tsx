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
import { useSubtopic } from '@/context/SubtopicContext';

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
  const { addRecord } = useSubtopic();
  const methods = useForm<AuthorityDetailsInput>({
    resolver: zodResolver(authorityDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<AuthorityDetailsInput> = async(values) => {
    setLoading(true); 
    await addRecord(values,null,"authority")
    setLoading(false);
    onClose()
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-0 p-0 hover:bg-white">
        <CardContent className=''>
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="space-y-4 pt-10">
                <div className="grid gap-4 grid-cols-1">

                  <div className="grid grid-cols-[150px_1fr]  items-start gap-4 w-1/2">
                    <Label htmlFor="authority" className="mt-3">Authority</Label>
                    <div>
                      <Input id="authority" {...methods.register('authority')} />
                      {errors.authority && (
                        <p className="text-red-500 mt-1">{errors.authority.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[150px_1fr]  items-start gap-4 w-1/2">
                    <Label htmlFor="designation" className="mt-3">Designation</Label>
                    <div>
                      <Input id="designation" {...methods.register('designation')} />
                      {errors.designation && (
                        <p className="text-red-500 mt-1">{errors.designation.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[150px_1fr]  items-start gap-4 w-1/2">
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
                            <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
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
                  <Button className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border " type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}
