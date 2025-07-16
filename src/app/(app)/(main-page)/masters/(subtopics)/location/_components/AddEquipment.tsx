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
import { PlusIcon } from 'lucide-react';

// Define TypeScript interfaces for type safety
// export interface Site {
//   id: number;
//   site: string; // Adjust based on your site object structure
//   area:Area
// }

export interface Area {
  id: number;
  
  thumbnail: string; // Adjust based on your area object structure
}

// Define the Zod schema with validation
const equipmentDetailsSchema = object({
  location: string().nonempty('Location is required'),
  // site: string().nonempty('Site is required'),
  // area: string().nonempty('Area is required'),
  status: z.string().nonempty('Status is required')
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  // setIsSite: (value: boolean) => void;
  setIsArea: (value: boolean) => void;
  setIsChanged:any;
  isChanged:any;
}

export default function EquipmentDetailsForm({ onClose ,setIsArea,setIsChanged,isChanged}: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  // const [siteOptions, setSiteOptions] = useState<Site[]>([]); // State for site options
  const [areaOptions, setAreaOptions] = useState<Area[]>([]); // State for area options
  const [isFetchingAreas, setIsFetchingAreas] = useState(false); // Loading state for areas
  const { addRecord, getAllSingleSubtopic } = useSubtopic(); // Ensure getAreasBySite is implemented

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      location: '',
      // site: '',
      // area: '',
      status: ''
    },
  });

  const { reset, handleSubmit, control, watch, setValue, formState: { isSubmitSuccessful, errors } } = methods;

  // const selectedSite = watch('site'); // Watch the 'site' field for changes
   
  // Fetch site options on component mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await getAllSingleSubtopic("site"); // Fetch sites
        if (data) {
        
          // setSiteOptions(data.filter((item:any)=>item.status==="ACTIVE"));

          // console.log("site fetching dynamically");
          
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
        // Optionally, handle the error (e.g., show a notification)
      }
    };
    fetchSites();
  }, [getAllSingleSubtopic,isChanged]);

  // useEffect(() => {
  //   const fetchAreas = async () => {
  //     if (!selectedSite) {
  //       setAreaOptions([]); // Reset areas if no site is selected
  //       return;
  //     }
  //     setIsFetchingAreas(true);
  //     try {
  //       const data = await getAllSingleSubtopic('area');
  
  //       if (data && Array.isArray(data)) {
  //         const filteredAreas = data.filter((area: any) => area.status==="ACTIVE").filter((area: any) => area.id === siteOptions.find(item => item.id == Number(selectedSite))?.area);

           
  //         setAreaOptions(filteredAreas);
  //       } else {
  //         console.warn(`No areas found for Site ID: ${selectedSite}`);
  //         setAreaOptions([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching areas:", error);
  //       setAreaOptions([]);
  //       // Optionally, handle the error (e.g., show a notification)
  //     } finally {
  //       setIsFetchingAreas(false);
  //     }
  //   };
  //   fetchAreas();
  // }, [getAllSingleSubtopic, selectedSite,siteOptions,isChanged]);
  

  

  // Reset form on successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setAreaOptions([]); // Optionally, reset areas after submission
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    
    setLoading(true); 
    try {
      await addRecord(values,null,"location"); // Add new record
    } catch (error) {
      console.error("Error adding record:", error);
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

                  {/* Location Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <div>
                      <Input id="location" type='text' {...methods.register('location')} />
                      {errors.location && (
                        <p className="text-red-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Site Field with dynamic dropdown */}
                  {/* <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <div className="relative">
                      <Controller
                        name="site"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value); // Update form state with selected value
                            }}
                            value={field.value}
                          >
                            <SelectTrigger id="site">
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                            <SelectContent>
                              {siteOptions.length > 0 ? (
                                siteOptions.map((site: Site) => (
                                  <SelectItem key={site.id} value={String(site.id)}>
                                    {site.site} 
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled value="No sites available">
                                  No sites available
                                </SelectItem>
                              )}
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
                  </div> */}

                  {/* Area Field with dynamic dropdown based on selected site */}
                  {/* <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="area" className="mt-3">Area</Label>
                    <div>
                      <Controller
                        name="area"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            disabled={!selectedSite || isFetchingAreas}  
                          >
                            <SelectTrigger id="area">
                              <SelectValue placeholder={isFetchingAreas ? "Loading areas..." : "Select area"} />
                            </SelectTrigger>
                            <SelectContent>
                              {isFetchingAreas ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : areaOptions.length > 0 ? (
                                areaOptions.map((filteredArea: Area) => (
                                  <SelectItem key={filteredArea.id} value={String(filteredArea.id)}>
                                    {filteredArea.thumbnail}  
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled value="No areas available">
                                  No areas available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.area && (
                        <p className="text-red-500 mt-1">{errors.area.message}</p>
                      )}
                    </div>
                  </div> */}

                  {/* Status Field */}
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

                {/* Buttons */}
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
