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
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import FormTable from './FormTable'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import AnnexureTable from './AnnexureTable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const equipmentDetailsSchema = object({
  
  equipmentNo: z.enum(['2', 'Inactive'], 'Status is required'),
  
  title: string().nonempty('Title is required'),
  authority: string().nonempty('Authority is required'),
  placeOfInspection: z.enum(['2', 'Inactive'], 'Status is required'),
  typeOfExam: z.enum(['2', 'Inactive'], 'Status is required'),
  area: z.enum(['2', 'Inactive'], 'Status is required'),
  surveyor: z.enum(['2', 'Inactive'], 'Status is required'),
  requestedByOwner: string().nonempty('Field is required'),
  referenceStandard: z.enum(['2', 'Inactive'], 'Status is required'),
  yearOfManufacture: string().nonempty('Field is required'),
  serialNo: string().nonempty('Field is required'),
  ownerAddress: string().nonempty('Field is required'),
  ownerName: string().nonempty('Field is required'),
  testCertCOCNo: string().nonempty('Field is required'),
  model: string().nonempty('Field is required'),
  manufacturer: z.enum(['2', 'Inactive'], 'Status is required'),
  inspectionDate: string().nonempty('Field is required'),
  lastTestDate: string().nonempty('Field is required'),
  nextTestDate: string().nonempty('Field is required'),
  description: string().nonempty('Field is required'),
  lastThoroughDate: string().nonempty('Field is required'),
  nextThoroughDate: string().nonempty('Field is required'),
  jobOrderNo: z.enum(['2', 'Inactive'], 'Status is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });

  const { reset, handleSubmit, control, register, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = (values) => {
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
              <div className="space-y-4 pt-10">
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipmentNo" className="mt-3">Equipment No.</Label>
                   
                     <div>
                      <Controller
                        name="equipmentNo"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="equipmentNo">
                              <SelectValue placeholder="Select equipmentNo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.equipmentNo && (
                        <p className="text-red-500 mt-1">{errors.equipmentNo.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspectionDate" className="mt-3">Inspection Date</Label>
                    <Input id="inspectionDate" type="date" {...register('inspectionDate')} />
                    {errors.inspectionDate && (
                      <p className="text-red-500 mt-1">{errors.inspectionDate.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && (
                      <p className="text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="authority" className="mt-3">Authority</Label>
                    <Input id="authority" {...register('authority')} />
                    {errors.authority && (
                      <p className="text-red-500 mt-1">{errors.authority.message}</p>
                    )}
                  </div>
                  {/* Other fields with error handling */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="workOrderNo" className="mt-3">Work Order No</Label>
                    <Input id="workOrderNo" {...register('workOrderNo')} />
                    {errors.workOrderNo && (
                      <p className="text-red-500 mt-1">{errors.workOrderNo.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="area" className="mt-3">Area</Label>
                    <div>
                      <Controller
                        name="area"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="area">
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.area && (
                        <p className="text-red-500 mt-1">{errors.area.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="surveyor" className="mt-3">Surveyor</Label>
                    <div>
                      <Controller
                        name="surveyor"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="surveyor">
                              <SelectValue placeholder="Select surveyor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.surveyor && (
                        <p className="text-red-500 mt-1">{errors.surveyor.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="requestedByOwner" className="mt-3">Requested By/Owner</Label>
                    <Input id="requestedByOwner" {...register('requestedByOwner')} />
                    {errors.requestedByOwner && (
                      <p className="text-red-500 mt-1">{errors.requestedByOwner.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="yearOfManufacture" className="mt-3">Year of Manufacture</Label>
                    <Input id="yearOfManufacture" type="date" {...register('yearOfManufacture')} />
                    {errors.yearOfManufacture && (
                      <p className="text-red-500 mt-1">{errors.yearOfManufacture.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="serialNo" className="mt-3">Serial No</Label>
                    <Input id="serialNo" {...register('serialNo')} />
                    {errors.serialNo && (
                      <p className="text-red-500 mt-1">{errors.serialNo.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="ownerAddress" className="mt-3">Owner Address</Label>
                    <Input id="ownerAddress" {...register('ownerAddress')} />
                    {errors.ownerAddress && (
                      <p className="text-red-500 mt-1">{errors.ownerAddress.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="ownerName" className="mt-3">Owner Name</Label>
                    <Input id="ownerName" {...register('ownerName')} />
                    {errors.ownerName && (
                      <p className="text-red-500 mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="testCertCOCNo" className="mt-3">Test Cert/COC No</Label>
                    <Input id="testCertCOCNo" {...register('testCertCOCNo')} />
                    {errors.testCertCOCNo && (
                      <p className="text-red-500 mt-1">{errors.testCertCOCNo.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="model" className="mt-3">Model</Label>
                    <Input id="model" {...register('model')} />
                    {errors.model && (
                      <p className="text-red-500 mt-1">{errors.model.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <div>
                      <Controller
                        name="manufacturer"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="manufacturer">
                              <SelectValue placeholder="Select manufacturer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.manufacturer && (
                        <p className="text-red-500 mt-1">{errors.manufacturer.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="placeOfInspection" className="mt-3">Place of Inspection</Label>
                    <div>
                      <Controller
                        name="placeOfInspection"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="placeOfInspection">
                              <SelectValue placeholder="Select placeOfInspection" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.placeOfInspection && (
                        <p className="text-red-500 mt-1">{errors.placeOfInspection.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="jobOrderNo" className="mt-3">Job Order No</Label>
                    <div>
                      <Controller
                        name="jobOrderNo"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="jobOrderNo">
                              <SelectValue placeholder="Select jobOrderNo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.jobOrderNo && (
                        <p className="text-red-500 mt-1">{errors.jobOrderNo.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="referenceStandard" className="mt-3">Reference Standard</Label>
                    <div>
                      <Controller
                        name="referenceStandard"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="referenceStandard">
                              <SelectValue placeholder="Select referenceStandard" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.referenceStandard && (
                        <p className="text-red-500 mt-1">{errors.referenceStandard.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="typeOfExam" className="mt-3">Type of Exam</Label>
                    <div>
                      <Controller
                        name="typeOfExam"
                        control={control}
                        render={({ field }) => ( 
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="typeOfExam">
                              <SelectValue placeholder="Select typeOfExam" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.typeOfExam && (
                        <p className="text-red-500 mt-1">{errors.typeOfExam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="lastTestDate" className="mt-3">Last Test Date</Label>
                    <Input id="lastTestDate" type="date" {...register('lastTestDate')} />
                    {errors.lastTestDate && (
                      <p className="text-red-500 mt-1">{errors.lastTestDate.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextTestDate" className="mt-3">Next Test Date</Label>
                    <Input id="nextTestDate" type="date" {...register('nextTestDate')} />
                    {errors.nextTestDate && (
                      <p className="text-red-500 mt-1">{errors.nextTestDate.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="lastThoroughDate" className="mt-3">Last Thorough Date</Label>
                    <Input id="lastThoroughDate" type="date" {...register('lastThoroughDate')} />
                    {errors.lastThoroughDate && (
                      <p className="text-red-500 mt-1">{errors.lastThoroughDate.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextThoroughDate" className="mt-3">Next Thorough Date</Label>
                    <Input id="nextThoroughDate" type="date" {...register('nextThoroughDate')} />
                    {errors.nextThoroughDate && (
                      <p className="text-red-500 mt-1">{errors.nextThoroughDate.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid w-full gap-4">
                  
                    
                  <FormTable onFunction={()=>setIsPopupOpen(true)} />
                 
                </div>
                <div className="grid w-full gap-4">
                  
                    
                  <AnnexureTable onFunction={()=>setIsPopupOpen(true)} />
                 
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                      <Label htmlFor="description">Description</Label>
                      <div>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              className="mt-3"
                              {...field}
                            />
                          )}
                        />
                        {errors.description && (
                          <p className="text-red-500 mt-1">{errors.description.message}</p>
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
