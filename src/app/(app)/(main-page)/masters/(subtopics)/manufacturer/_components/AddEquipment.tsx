'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';

const manufacturerDetailsSchema = object({
 
  manufacturer: z.string().nonempty('Manufacturer is required'),
  address: z.string().nonempty('Address is required'),
  status: z.string().nonempty('Status is required')
});

type ManufacturerDetailsInput = z.infer<typeof manufacturerDetailsSchema>;

interface ManufacturerDetailsFormProps {
  onClose: () => void;
}

export default function ManufacturerDetailsForm({ onClose }: ManufacturerDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { addRecord } = useSubtopic();
  const methods = useForm<ManufacturerDetailsInput>({
    resolver: zodResolver(manufacturerDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<ManufacturerDetailsInput> = async(values) => {
    setLoading(true);
    console.log(values);
    await addRecord(values)
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
        <CardContent>
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="space-y-4 pt-10">
                <div className="grid gap-4 grid-cols-1">

                   

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <div>
                      <Input id="manufacturer" {...methods.register('manufacturer')} />
                      {errors.manufacturer && (
                        <p className="text-red-500 mt-1">{errors.manufacturer.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="address" className="mt-3">Address</Label>
                    <div>
                      <Input id="address" {...methods.register('address')} />
                      {errors.address && (
                        <p className="text-red-500 mt-1">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
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
                  <Button className="px-10" type="submit" disabled={loading}>
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
