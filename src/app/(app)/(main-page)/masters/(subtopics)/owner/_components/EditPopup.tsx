'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';
import { useSubtopic } from '@/context/SubtopicContext';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const ownerDetailsSchema = z.object({
  owner: z.string().nonempty('Owner is required'),
  address: z.string().nonempty('Address is required'),
  code: z.string().nonempty('Code is required'),
  status: z.string().nonempty('Status is required'),
  qp_footer: z.string().nonempty('Qp Footer is required'),
  non_qp_footer: z.string().nonempty('Non-Qp Footer is required'),
  client_specification: z.string().nonempty('Client Specification is required'),
});

type OwnerDetailsInput = z.infer<typeof ownerDetailsSchema>;

interface OwnerDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function OwnerDetailsForm({ onClose, id }: OwnerDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateRecord, findRecordById } = useSubtopic();

  // Get existing data synchronously
  const data = findRecordById(id);
console.log(data);

  const methods = useForm<OwnerDetailsInput>({
    resolver: zodResolver(ownerDetailsSchema),
    defaultValues: {
      owner: data?.owner || '',
      address: data?.address || '',
      code: data?.code || '',
      status: data?.status || '',
      qp_footer: data?.qp_footer || '',
      non_qp_footer: data?.non_qp_footer || '',
      client_specification: data?.client_specification || '',
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
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<OwnerDetailsInput> = async (values) => {
    setLoading(true);
    await updateRecord(id, values); // Perform form submission logic
    setLoading(false);
    onClose(); // Close form after save
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
                    <Label htmlFor="owner" className="mt-3">Owner</Label>
                    <div>
                      <Input id="owner" {...methods.register('owner')} />
                      {errors.owner && (
                        <p className="text-red-500 mt-1">{errors.owner.message}</p>
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

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="code" className="mt-3">Code</Label>
                    <div>
                      <Input id="code" {...methods.register('code')} />
                      {errors.code && (
                        <p className="text-red-500 mt-1">{errors.code.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
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

                  {/* ReactQuill Editors */}
                  <div className="grid gap-4 grid-cols-1 pt-5">
                    <div className="w-full">
                      <Label htmlFor="qp_footer">Qp Footer</Label>
                      <div>
                        <Controller
                          name="qp_footer"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              className="mt-3"
                              {...field}
                            />
                          )}
                        />
                        {errors.qp_footer && (
                          <p className="text-red-500 text-[8px] mt-1">{errors.qp_footer.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-1 pt-5">
                    <div className="w-full">
                      <Label htmlFor="non_qp_footer">Non-Qp Footer</Label>
                      <div>
                        <Controller
                          name="non_qp_footer"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              className="mt-3"
                              {...field}
                            />
                          )}
                        />
                        {errors.non_qp_footer && (
                          <p className="text-red-500 text-[8px] mt-1">{errors.non_qp_footer.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-1 pt-5">
                    <div className="w-full">
                      <Label htmlFor="client_specification">Client Specification</Label>
                      <div>
                        <Controller
                          name="client_specification"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              className="mt-3"
                              {...field}
                            />
                          )}
                        />
                        {errors.client_specification && (
                          <p className="text-red-500 text-[8px] mt-1">{errors.client_specification.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
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
