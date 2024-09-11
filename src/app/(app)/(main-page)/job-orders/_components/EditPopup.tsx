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

const formSchema = object({
  clientName: string().nonempty('Client name is required'),
  contactNumber: string().nonempty('Contact number is required'),
  email: string().nonempty('Email is required'),
  surveyorName: string().nonempty('Surveyor name is required'),
  siteContactPerson: string(),
  location: string().nonempty('Location is required'),
  equipmentDetails: string(),
  jobOrderStatus: string().nonempty('Job order status is required'),
  date: string().nonempty('Date is required'),
});

type FormInput = TypeOf<typeof formSchema>;

interface SurveyFormProps {
  onClose: () => void;
}

export default function SurveyForm({ onClose }: SurveyFormProps) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<FormInput> = (values) => {
    setLoading(true);
    console.log(values);
    // Handle form submission logic here
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
              {/* First: Client Details Section */}
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

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" {...methods.register('date')} />
                    {errors.date && (
                      <p className="text-red-500">{errors.date.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Second: Surveyor Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Surveyor</h3>

                <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="Surveyor 1">Surveyor 1</SelectItem>
                            <SelectItem value="Surveyor 2">Surveyor 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="siteContactPerson">Site Contact Person</Label>
                    <Input id="siteContactPerson" {...methods.register('siteContactPerson')} />
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
                            <SelectItem value="Location 1">Location 1</SelectItem>
                            <SelectItem value="Location 2">Location 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="equipmentDetails">Equipment Details</Label>
                    <Input id="equipmentDetails" {...methods.register('equipmentDetails')} />
                  </div>

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
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button type="reset" onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
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
