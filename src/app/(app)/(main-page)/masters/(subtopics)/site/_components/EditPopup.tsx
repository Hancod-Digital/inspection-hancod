'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';

const equipmentDetailsSchema = object({
   site: string().nonempty('Site is required'),
  area: string().nonempty('Area is required'),
  status: z.string().nonempty('Status is required')
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id: number
}

export default function EquipmentDetailsForm({ onClose,id }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateRecord, findRecordById } = useSubtopic();
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async(values) => {
    setLoading(true);
    console.log(values);
   await updateRecord(id,values)
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
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <div>
                      <Input id="site" {...methods.register('site')} />
                      {errors.site && (
                        <p className="text-red-500 mt-1">{errors.site.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="area" className="mt-3">Area</Label>
                    <div>
                      <Input id="area" {...methods.register('area')} />
                      {errors.area && (
                        <p className="text-red-500 mt-1">{errors.area.message}</p>
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
