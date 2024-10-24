'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { z, object, string, TypeOf } from 'zod';
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

const authorityDetailsSchema = object({
  authority: z.string().nonempty('Authority is required'),
  designation: z.string().nonempty('Designation is required'),
  status: z.string().nonempty('Status is required'),
});

type AuthorityDetailsSchemaType = TypeOf<typeof authorityDetailsSchema>;

interface AuthorityDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function AuthorityDetailsForm({ onClose, id }: AuthorityDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateRecord, findRecordById } = useSubtopic();

  // Get existing data synchronously
  const data = findRecordById(id);

  const methods = useForm<AuthorityDetailsSchemaType>({
    resolver: zodResolver(authorityDetailsSchema),
    defaultValues: {
      authority: data?.authority || '',
      designation: data?.designation || '',
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

  const onSubmitHandler: SubmitHandler<AuthorityDetailsSchemaType> = async (values) => {
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
          <CardTitle className="text-md">Authority Details</CardTitle>
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
                    <Label htmlFor="authority">Authority</Label>
                    <div>
                      <Input id="authority" {...methods.register('authority')} />
                      {errors.authority && (
                        <p className="text-red-500 mt-1">{errors.authority.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="designation">Designation</Label>
                    <div>
                      <Input id="designation" {...methods.register('designation')} />
                      {errors.designation && (
                        <p className="text-red-500 mt-1">{errors.designation.message}</p>
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
