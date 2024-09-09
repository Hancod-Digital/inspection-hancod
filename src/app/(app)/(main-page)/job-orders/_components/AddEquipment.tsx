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

// Schema validation using Zod
const jobDetailsSchema = object({
  clientName: string().nonempty('Client name is required'),
  email: string().nonempty('Email is required'),
  contactNumber: string().nonempty('Contact number is required'),
  surveyorName: string().nonempty('Surveyor name is required'),
  location: string().nonempty('Location is required'),
  siteContactPerson: string().nonempty('Site contact person is required'),
  equipmentDetails: string().nonempty('Equipment details are required'),
  jobOrderStatus: string().nonempty('Job order status is required'),
  status: string().nonempty('Status is required'),
  date: string().nonempty('Date is required'),
});

type JobDetailsInput = TypeOf<typeof jobDetailsSchema>;

interface JobDetailsFormProps {
  onClose: () => void;
}

export default function JobDetailsForm({ onClose }: JobDetailsFormProps) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<JobDetailsInput>({
    resolver: zodResolver(jobDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<JobDetailsInput> = (values) => {
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
              <div className="space-y-6">

                {/* Client Details Section */}
                <div className='py-5'>
                  <h2 className="font-semibold">Client Details</h2>

                  {/* Client Name, Email, and Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input id="clientName" {...methods.register('clientName')} />
                      {errors.clientName && (
                        <p className="text-red-500 mt-1">{errors.clientName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" {...methods.register('email')} />
                      {errors.email && (
                        <p className="text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="date">
                              <SelectValue placeholder="21-08-24" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Placeholder values */}
                              <SelectItem value="21-08-24">21-08-24</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.date && (
                        <p className="text-red-500 mt-1">{errors.date.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="mt-4">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" {...methods.register('contactNumber')} />
                    {errors.contactNumber && (
                      <p className="text-red-500 mt-1">{errors.contactNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Surveyor Section */}
                <div>
                  <h2 className="font-semibold">Surveyor</h2>

                  <div className="grid grid-cols-2 gap-4">

                    {/* Surveyor Name */}
                    <div>
                      <Label htmlFor="surveyorName">Surveyor Name</Label>
                      <Controller
                        name="surveyorName"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="surveyorName">
                              <SelectValue placeholder="Select Surveyor" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Placeholder values */}
                              <SelectItem value="Surveyor1">Surveyor1</SelectItem>
                              <SelectItem value="Surveyor2">Surveyor2</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.surveyorName && (
                        <p className="text-red-500 mt-1">{errors.surveyorName.message}</p>
                      )}
                    </div>

                    {/* Site Contact Person */}
                    <div>
                      <Label htmlFor="siteContactPerson">Site Contact Person</Label>
                      <Input id="siteContactPerson" {...methods.register('siteContactPerson')} />
                      {errors.siteContactPerson && (
                        <p className="text-red-500 mt-1">{errors.siteContactPerson.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Location, Equipment Details */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" {...methods.register('location')} />
                      {errors.location && (
                        <p className="text-red-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="equipmentDetails">Equipment Details</Label>
                      <Controller
                        name="equipmentDetails"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="equipmentDetails">
                              <SelectValue placeholder="Select Equipment" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Placeholder values */}
                              <SelectItem value="Equipment1">Equipment1</SelectItem>
                              <SelectItem value="Equipment2">Equipment2</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.equipmentDetails && (
                        <p className="text-red-500 mt-1">{errors.equipmentDetails.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Status, Job Order Status */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-red-500 mt-1">{errors.status.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="jobOrderStatus">Job Order Status</Label>
                      <Controller
                        name="jobOrderStatus"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="jobOrderStatus">
                              <SelectValue placeholder="Select Job Order Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.jobOrderStatus && (
                        <p className="text-red-500 mt-1">{errors.jobOrderStatus.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
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
