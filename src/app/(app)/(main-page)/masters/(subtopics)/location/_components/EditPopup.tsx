'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
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
import { Site } from './AddEquipment';

const equipmentDetailsSchema = object({
  location: string().nonempty('Location is required'),
  site: string().nonempty('Site is required'),
  area: string().nonempty('Area is required'),
  status: string().nonempty('Status is required'),
});

type EquipmentDetailsSchemaType = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function EquipmentDetailsForm({ onClose, id }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateRecord, findRecordById, getAllSingleSubtopic,UseMergedDataQuery } = useSubtopic();

  // Fetch the sites asynchronously (this is an example, adjust it to match your actual fetching logic)
  const [sites, setSites] = useState<Site[]>([]);
 
  useEffect(() => {
    const fetchSites = async () => {
      const siteData:any = await getAllSingleSubtopic("site");
      
      setSites(siteData);
    };  

    fetchSites();
  }, []);

  // Get existing data synchronously
  const data = findRecordById(id);

  const methods = useForm<EquipmentDetailsSchemaType>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      location: data?.location || '',
      site: data?.site || '',
      area: data?.area || '',
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

  const onSubmitHandler: SubmitHandler<EquipmentDetailsSchemaType> = async (values) => {
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
          <CardTitle className="text-md">Equipment Details</CardTitle>
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
                <div className="grid gap-4 grid-cols-1">
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="location">Location</Label>
                    <div>
                      <Input id="location" {...methods.register('location')} />
                      {errors.location && (
                        <p className="text-red-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="site">Site</Label>
                    <div>
                      <Controller
                        name="site"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="site">
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                            <SelectContent>
                              {sites?.map((site, index) => (
                                <SelectItem key={index} value={""+site?.id}>
                                  {site?.site}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.site && (
                        <p className="text-red-500 mt-1">{errors.site.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
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
