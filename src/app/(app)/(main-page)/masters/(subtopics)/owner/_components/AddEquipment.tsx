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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { useSubtopic } from '@/context/SubtopicContext';

const ownerDetailsSchema = z.object({ 
  owner: z.string().nonempty('Owner is required'),
  address: z.string().nonempty('Address is required'),
  code: z.string().nonempty('Code is required'),
  
  status: z.string().nonempty('Status is required'),

  qpFooter: z.string().nonempty("Description is required"),
  nonQpFooter: z.string().nonempty("Description is required"),
  clientSpecification: z.string().nonempty("Description is required"),


});

type OwnerDetailsInput = z.infer<typeof ownerDetailsSchema>;

interface OwnerDetailsFormProps {
  onClose: () => void;
}

export default function OwnerDetailsForm({ onClose }: OwnerDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { addRecord } = useSubtopic();
  const methods = useForm<OwnerDetailsInput>({
    resolver: zodResolver(ownerDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<OwnerDetailsInput> = async(values) => {
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
                    <Label htmlFor="owner" className="mt-3">Owner</Label>
                    <div>
                      <Input id="owner" {...methods.register('owner')} />
                      {errors.owner && (
                        <p className="text-red-500 mt-1">{errors.owner?.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="address" className="mt-3">Address</Label>
                    <div>
                      <Input id="address" {...methods.register('address')} />
                      {errors.address && (
                        <p className="text-red-500 mt-1">{errors.address?.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="code" className="mt-3">Code</Label>
                    <div>
                      <Input id="code" {...methods.register('code')} />
                      {errors.code && (
                        <p className="text-red-500 mt-1">{errors.code?.message}</p>
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
                        <p className="text-red-500 mt-1">{errors.status?.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 grid-cols-1 pt-5">
                <div className="w-full ">
                <Label htmlFor="qpFooter" >Qp Footer</Label>
                <div>
                <Controller
                      name="qpFooter"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          className='mt-3'
                          {...field}
                        />
                      )}
                    />
                    {errors.qpFooter && (
                      <p className="text-red-500 text-[8px] mt-1">{errors.qpFooter.message}</p>
                    )}
                </div>
              </div>
              
              
              </div>

              <div className="grid gap-4 grid-cols-1 pt-5">
                <div className="w-full ">
                <Label htmlFor="nonQpFooter" >Non-Qp Footer</Label>
                <div>
                <Controller
                      name="nonQpFooter"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          className='mt-3'
                          {...field}
                        />
                      )}
                    />
                    {errors.nonQpFooter && (
                      <p className="text-red-500 text-[8px] mt-1">{errors.nonQpFooter.message}</p>
                    )}
                </div>
              </div>
              
              
              </div>     <div className="grid gap-4 grid-cols-1 pt-5">
                <div className="w-full ">
                <Label htmlFor="clientSpecification" >Client Specification</Label>
                <div>
                <Controller
                      name="clientSpecification"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          className='mt-3'
                          {...field}
                        />
                      )}
                    />
                    {errors.clientSpecification && (
                      <p className="text-red-500 text-[8px] mt-1">{errors.clientSpecification.message}</p>
                    )}
                </div>
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
