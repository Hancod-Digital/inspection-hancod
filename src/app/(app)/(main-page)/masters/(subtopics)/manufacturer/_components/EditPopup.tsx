'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
import { useSubtopic } from '@/context/SubtopicContext';

const manufacturerDetailsSchema = object({
  manufacturer: z.string().nonempty('Manufacturer is required'),
  address: z.string().nonempty('Address is required'),
  status: z.string().nonempty('Status is required'),
});

type ManufacturerDetailsInput = z.infer<typeof manufacturerDetailsSchema>;

interface ManufacturerDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function ManufacturerDetailsForm({
  onClose,
  id,
}: ManufacturerDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateRecord, findRecordById } = useSubtopic();

  // Get existing data synchronously
  const data = findRecordById(id);

  const methods = useForm<ManufacturerDetailsInput>({
    resolver: zodResolver(manufacturerDetailsSchema),
    defaultValues: {
      manufacturer: data?.manufacturer || '',
      address: data?.address || '',
      status: data?.status || '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  const onSubmitHandler: SubmitHandler<ManufacturerDetailsInput> = async (values) => {
    setLoading(true);
    await updateRecord(id, values);
    setLoading(false);
    onClose(); // Close the form after saving
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-0 p-0 hover:bg-white">
        <CardHeader>
          <CardTitle className="text-md">Manufacturer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <div>
                      <Input id="manufacturer" {...methods.register('manufacturer')} />
                      {errors.manufacturer && (
                        <p className="text-red-500 mt-1">{errors.manufacturer.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="address">Address</Label>
                    <div>
                      <Input id="address" {...methods.register('address')} />
                      {errors.address && (
                        <p className="text-red-500 mt-1">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="status">Status</Label>
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
