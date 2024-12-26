'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';

const formSchema = object({
  client_name: string().nonempty('Client name is required'),
  contact_number: string().nonempty('Contact number is required'),
  email: string().nonempty('Email is required'),
  surveyor: string().nonempty('Surveyor name is required'),
  site_contact_person: string(),
  location: string().nonempty('Location is required'),
  equipment_details: string().nonempty('Equipment details is required'),
  job_order_status: string().nonempty('Job order status is required'),
});

type FormInput = TypeOf<typeof formSchema>;

interface SurveyFormProps {
  onClose: () => void;
  id: string;
  setIsState: any
  isState: boolean
}

export default function SurveyForm({ onClose, id,setIsState,isState }: SurveyFormProps) {
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState<FormInput | undefined>(undefined);
  
  const { getSingleJobOrder, getAllSingleSubtopic,editJobOrder } = useSubtopic();

  const methods = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const { handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  const [surveyorOptions, setSurveyorOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const jobOrderData = await getSingleJobOrder(id);
    
      if (jobOrderData && jobOrderData.length > 0) {
        const newValues = {
          ...jobOrderData[0],
          email: String(jobOrderData[0].email),
          surveyor: String(jobOrderData[0].surveyor),
          location: String(jobOrderData[0].location),
          equipment_details: String(jobOrderData[0].equipment_details),
          job_order_status: String(jobOrderData[0].job_order_status),
          client_name: String(jobOrderData[0].client_name),
          contact_number: String(jobOrderData[0].contact_number),
          site_contact_person: jobOrderData[0].site_contact_person ? String(jobOrderData[0].site_contact_person) : ''
        };
        setDefaultValues(newValues);
        methods.reset(newValues); // <-- This ensures the form is updated
      }
  
      const surveyors = await getAllSingleSubtopic("surveyor");
      if (surveyors) setSurveyorOptions(surveyors);
  
      const locations = await getAllSingleSubtopic("location");
      if (locations) setLocationOptions(locations.filter((item:any)=>item.status==="ACTIVE"));
  
      const equipments = await getAllSingleSubtopic("equipment");
      if (equipments) setEquipmentOptions(equipments.filter((item:any)=>item.status==="ACTIVE"));
    };
  
    fetchData();
  }, [getSingleJobOrder, getAllSingleSubtopic, id, methods]);
  

  useEffect(() => {
    if (isSubmitSuccessful) {
      // Reset form if needed
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<FormInput> = async (values) => {
    setLoading(true);
    // Add your form submission logic here
    const updates = {
      ...values,
      surveyor: Number(values.surveyor),
      location: Number(values.location),
      equipment_details: Number(values.equipment_details),
    };
    const data = await editJobOrder(id,updates);
    toastWithTimeout(ToastVariant.Default, 'Job order updated successfully');
    setLoading(false);
    setIsState(!isState)
    onClose()
  };

  // If defaultValues are not yet loaded, return a loading state
  if (defaultValues === undefined) {
    return <p>Loading...</p>;
  }

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
              {/* First: Client Details Section */}
              <div className="space-y-4 py-7">
                <h3 className="text-lg font-semibold">Client Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input 
                      id="client_name" 
                      defaultValue={defaultValues.client_name} 
                      {...methods.register('client_name')} 
                    />
                    {errors.client_name && (
                      <p className="text-red-500">{errors.client_name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      defaultValue={defaultValues.email} 
                      {...methods.register('email')} 
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input 
                      id="contact_number" 
                      defaultValue={defaultValues.contact_number} 
                      {...methods.register('contact_number')} 
                    />
                    {errors.contact_number && (
                      <p className="text-red-500">{errors.contact_number.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Surveyor & Additional Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Surveyor</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="surveyor">Surveyor Name</Label>
                    <Controller
                      name="surveyor"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="surveyor">
                            <SelectValue placeholder="Select surveyor" />
                          </SelectTrigger>
                          <SelectContent>
                            {surveyorOptions.map((surveyor:any) => (
                              <SelectItem key={surveyor.id} value={String(surveyor.id)}>
                                {surveyor.surveyor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.surveyor && (
                      <p className="text-red-500">{errors.surveyor.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="site_contact_person">Site Contact Person</Label>
                    <Input 
                      id="site_contact_person" 
                      defaultValue={defaultValues.site_contact_person} 
                      {...methods.register('site_contact_person')} 
                    />
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="location">Location</Label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationOptions.map((loc) => (
                              <SelectItem key={loc.id} value={String(loc.id)}>
                                {loc.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.location && (
                      <p className="text-red-500">{errors.location.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="equipment_details">Equipment Details</Label>
                    <Input id="equipment_details" {...methods.register('equipment_details')} />
                    {errors.equipment_details && (
                      <p className="text-red-500">{errors.equipment_details.message}</p>
                    )}

                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="job_order_status">Job Order Status</Label>
                    <Controller
                      name="job_order_status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="job_order_status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.job_order_status && (
                      <p className="text-red-500">{errors.job_order_status.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button type="reset" onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button 
                  className='hover:bg-secondary hover:text-primary hover:border-primary border' 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}
