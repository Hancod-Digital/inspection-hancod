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
import { flushSync } from 'react-dom'; // Import flushSync for synchronous state updates
import { locationDataRange } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { MasterService } from '@/services/api/masters-service';

// Define the Zod schema for form validation (Area removed)
const equipmentDetailsSchema = object({
  location: string().nonempty('Location is required'),
  site: string().nonempty('Site is required'),
  status: string().nonempty('Status is required'),
});

type EquipmentDetailsSchemaType = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id: number;
  setIsSite: (value: boolean) => void;
}

export default function EquipmentDetailsForm({ onClose, id, setIsSite }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState<any[]>([]); // State for site dropdown options
  const [datas, setData] = useState<any>(null); // State for existing record data

  const { updateRecord, findRecordByIdWithReference, getAllSingleSubtopic,FetchLocationDetails } = useSubtopic();
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datas = await new MasterService().getLocationDetails();
        console.log(datas);
        setData(datas); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  
  const methods = useForm<EquipmentDetailsSchemaType>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      location: datas?.find((item:any)=>item.location?.id==id)?.location?.name || '',
      site: String(datas?.find((item:any)=>item.location?.id==id)?.site?.id) || '',
      status: datas?.find((item:any)=>item.location?.id==id)?.location?.status || '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;
 
 

  // Fetch site dropdown options when the component mounts
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sites = await getAllSingleSubtopic('site');
        setSiteData(sites || []);
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };

    fetchSites();
  }, [getAllSingleSubtopic]);

  // Reset the form and close the modal upon successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  // Handle form submission
  const onSubmitHandler: SubmitHandler<EquipmentDetailsSchemaType> = async (values) => {
    setLoading(true); 
console.log(values);

    // Prepare the updated data
    const updatedData = {
      
      location: values.location,
      site: Number(values.site),
      status: values.status,
    };

    try {
      await updateRecord(id, updatedData);
    } catch (error) {
      console.error('Error updating record:', error);
      // Optionally, handle the error (e.g., show a notification)
    } finally {
      setLoading(false);
      onClose();
    }
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
          <CardTitle className="text-md">Location Details</CardTitle>
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
                  {/* Location Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="location">Location</Label>
                    <div>
                      <Input id="location" {...methods.register('location')} />
                      {errors.location && (
                        <p className="text-red-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Site Dropdown */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="site">Site</Label>
                    <div className="relative">
                      <Controller
                        name="site"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="site">
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                            <SelectContent>
                              {siteData.map((site:any) => (
                                <SelectItem key={site.id} value={String(site.id)}>
                                  {site.site}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Button
                          size="icon"
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsSite(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      {errors.site && (
                        <p className="text-red-500 mt-1">{errors.site.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
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

                {/* Form Actions */}
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
