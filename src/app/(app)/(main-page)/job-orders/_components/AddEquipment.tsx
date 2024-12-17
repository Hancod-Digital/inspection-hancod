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
  clientName: string().nonempty('Client name is required'),
  contactNumber: string().nonempty('Contact number is required'),
  email: string().nonempty('Email is required'),
  surveyorName: string().nonempty('Surveyor name is required'),
  siteContactPerson: string().optional(),
  location: string().nonempty('Location is required'),
  equipmentDetails: string().optional(),
  jobOrderStatus: string().nonempty('Job order status is required'),
  
});

type FormInput = TypeOf<typeof formSchema>;

interface SurveyFormProps {
  onClose: () => void;
  setIsState: any
  isState: boolean
}

export default function SurveyForm({ onClose,setIsState,isState }: SurveyFormProps) {
  const [loading, setLoading] = useState(false);
  const [surveyorOptions, setSurveyorOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<any[]>([]);

  const { addJobOrder, getAllSingleSubtopic } = useSubtopic();

  const methods = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    // Fetch surveyors, locations, and equipment options
    const fetchData = async () => {
      const surveyors = await getAllSingleSubtopic("surveyor");
      if (surveyors) setSurveyorOptions(surveyors);

      const locations = await getAllSingleSubtopic("location");
      if (locations) setLocationOptions(locations);

      const equipments = await getAllSingleSubtopic("equipment");
      if (equipments) setEquipmentOptions(equipments);
    };

    fetchData();
  }, [getAllSingleSubtopic]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<FormInput> = async (values) => {
    setLoading(true);

    const payload = {
      client_name: values.clientName,
      contact_number: values.contactNumber,
      email: values.email,
      surveyor: Number(values.surveyorName),
      site_contact_person: values.siteContactPerson || '',
      location: Number(values.location),
      equipment_details: values.equipmentDetails ? Number(values.equipmentDetails) : null,
      job_order_status: values.jobOrderStatus,
    
    };

    await addJobOrder(payload);
    toastWithTimeout(ToastVariant.Default, 'Job order added successfully');
    onClose();
    setIsState(!isState)
    setLoading(false);
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
              {/* Client Details Section */}
              <div className="space-y-4 py-7">
                <h3 className="text-lg font-semibold">Client Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" {...methods.register('clientName')} />
                    {errors.clientName && (
                      <p className="text-red-500">{errors.clientName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...methods.register('email')} />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" {...methods.register('contactNumber')} />
                    {errors.contactNumber && (
                      <p className="text-red-500">{errors.contactNumber.message}</p>
                    )}
                  </div>

                  
                </div>
              </div>

              {/* Surveyor & Other Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Surveyor & Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Surveyor Name */}
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="surveyorName">Surveyor Name</Label>
                    <Controller
                      name="surveyorName"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="surveyorName">
                            <SelectValue placeholder="Select surveyor" />
                          </SelectTrigger>
                          <SelectContent>
                            {surveyorOptions.map((surveyor) => (
                              <SelectItem key={surveyor.id} value={String(surveyor.id)}>
                                {surveyor.surveyor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.surveyorName && (
                      <p className="text-red-500">{errors.surveyorName.message}</p>
                    )}
                  </div>

                  {/* Site Contact Person */}
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="siteContactPerson">Site Contact Person</Label>
                    <Input id="siteContactPerson" {...methods.register('siteContactPerson')} />
                  </div>

                  {/* Location */}
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

                  {/* Equipment Details */}
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="equipmentDetails">Equipment Details</Label>
                    <Controller
                      name="equipmentDetails"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="equipmentDetails">
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipmentOptions.map((eq) => (
                              <SelectItem key={eq.id} value={String(eq.id)}>
                                {eq.equipment_no || eq.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Job Order Status */}
                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="jobOrderStatus">Job Order Status</Label>
                    <Controller
                      name="jobOrderStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="jobOrderStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.jobOrderStatus && (
                      <p className="text-red-500">{errors.jobOrderStatus.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <Button type="reset" onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  className="hover:bg-secondary hover:text-primary hover:border-primary border"
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
