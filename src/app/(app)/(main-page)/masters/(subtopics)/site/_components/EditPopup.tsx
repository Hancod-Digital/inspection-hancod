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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';
import { flushSync } from 'react-dom';
import { siteDataRange } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';

const equipmentDetailsSchema = object({
  site: string().nonempty('Site is required'),
  area: string().nonempty('Area is required'),
  status: z.string().nonempty('Status is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id: number;
  setIsArea: (value: boolean) => void;
}

export default function EquipmentDetailsForm({ onClose, id, setIsArea }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const { updateRecord, findRecordByIdWithReference, getAllSingleSubtopic } = useSubtopic();

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      site: '',
      area: '',
      status: '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  // Fetch existing data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const recordData = await findRecordByIdWithReference(id, siteDataRange);
     
      flushSync(() => {
        setData(recordData);
        reset({
          site: recordData?.site || '',
          area: String(recordData?.area?.id) || "",
          status: recordData?.status || '',
        });
      });
    };

    fetchData();
  }, [id, findRecordByIdWithReference, reset]);

  // Fetch area options when the component mounts
  useEffect(() => {
    const fetchAreaData = async () => {
      const areas = await getAllSingleSubtopic('area');
      setAreaData(areas || []);
    };
    fetchAreaData();
  }, [getAllSingleSubtopic]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);  
    // Prepare the updated data
    const updatedData = {
      ...data,
      site: values.site,
      area: Number(values.area),
      status: values.status,
    };

    await updateRecord(id, updatedData);
    setLoading(false);
    onClose();
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
                    <Label htmlFor="site" className="mt-3">
                      Site
                    </Label>
                    <div>
                      <Input id="site" {...methods.register('site')} />
                      {errors.site && (
                        <p className="text-red-500 mt-1">{errors.site.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="area" className="mt-3">
                      Area
                    </Label>
                    <div className="relative">
                      <Controller
                        name="area"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={String(field.value)}>
                            <SelectTrigger id="area">
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              {areaData?.map((item) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                  {item.thumbnail}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Button
                          size="icon"
                          variant="outline"
                          type="button"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsArea(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      {errors.area && (
                        <p className="text-red-500 mt-1">{errors.area.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
                    <Label htmlFor="status" className="mt-3">
                      Status
                    </Label>
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
