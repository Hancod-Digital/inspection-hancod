// components/EquipmentDetailsForm.tsx

'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

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

import FormTable from './FormTable';
import AnnexureTable from './AnnexureTable';
import { useSubtopic } from '@/context/SubtopicContext';

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const equipmentDetailsSchema = object({
  equipmentNo: string().nonempty('Equipment Number is required'),
  title: string().nonempty('Title is required'),
  authority: string().nonempty('Authority is required'),
  placeOfInspection: string().nonempty('Place of inspection is required'),
  typeOfExam: string().nonempty('Type of Exam is required'),
  area: string().nonempty('Area is required'),
  surveyor: string().nonempty('Surveyor is required'),
  requestedByOwner: string().nonempty('Requested By/Owner is required'),
  workOrderNo: string().nonempty('Work Order Number is required'),
  referenceStandard: string().nonempty('Reference Standard is required'),
  yearOfManufacture: string().nonempty('Year of Manufacture is required'),
  serialNo: string().nonempty('Serial No is required'),
  ownerAddress: string().nonempty('Owner Address is required'),
  ownerName: string().nonempty('Owner Name is required'),
  testCertCOCNo: string().nonempty('Test Cert/COC No is required'),
  model: string().nonempty('Model is required'),
  manufacturer: string().nonempty('Manufacturer is required'),
  inspectionDate: string().nonempty('Inspection Date is required'),
  lastTestDate: string().nonempty('Last Test Date is required'),
  nextTestDate: string().nonempty('Next Test Date is required'),
  description: string().nonempty('Description is required'),
  description_of_test:  string().nonempty('Description Of Test is required'),
  lastThoroughDate: string().nonempty('Last Thorough Date is required'),
  nextThoroughDate: string().nonempty('Next Thorough Date is required'),
  jobOrderNo: string().nonempty('Job Order Number is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { addRecord } = useSubtopic();

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });

  const {
    reset,
    handleSubmit,
    control,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose(); // Close the form after successful submission
    }
  }, [isSubmitSuccessful, reset, onClose]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    try {
      await addRecord(values);
    } catch (error) {
      console.error('Error adding record:', error); 
    } finally {
      setLoading(false);
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
                {/* Form Fields */}
                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment No */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipmentNo" className="mt-3">
                      Equipment No.
                    </Label>
                    <Controller
                      name="equipmentNo"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="equipmentNo">
                            <SelectValue placeholder="Select Equipment No." />
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

                  {/* Inspection Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspectionDate" className="mt-3">
                      Inspection Date
                    </Label>
                    <Input id="inspectionDate" type="date" {...register('inspectionDate')} />
                    {errors.inspectionDate && (
                      <p className="text-red-500 mt-1">{errors.inspectionDate.message}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">
                      Title
                    </Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && (
                      <p className="text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Authority */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="authority" className="mt-3">
                      Authority
                    </Label>
                    <Input id="authority" {...register('authority')} />
                    {errors.authority && (
                      <p className="text-red-500 mt-1">{errors.authority.message}</p>
                    )}
                  </div>

                  {/* Work Order No */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="workOrderNo" className="mt-3">
                      Work Order No
                    </Label>
                    <Input id="workOrderNo" {...register('workOrderNo')} />
                    {errors.workOrderNo && (
                      <p className="text-red-500 mt-1">{errors.workOrderNo.message}</p>
                    )}
                  </div>

                  {/* Area */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="area" className="mt-3">
                      Area
                    </Label>
                    <Controller
                      name="area"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="area">
                            <SelectValue placeholder="Select Area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Area1">Area1</SelectItem>
                            <SelectItem value="Area2">Area2</SelectItem>
                            {/* Add more options as needed */}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.area && (
                      <p className="text-red-500 mt-1">{errors.area.message}</p>
                    )}
                  </div>

                  {/* Surveyor */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="surveyor" className="mt-3">
                      Surveyor
                    </Label>
                    <Controller
                      name="surveyor"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="surveyor">
                            <SelectValue placeholder="Select Surveyor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Surveyor1">Surveyor1</SelectItem>
                            <SelectItem value="Surveyor2">Surveyor2</SelectItem>
                            {/* Add more options as needed */}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.surveyor && (
                      <p className="text-red-500 mt-1">{errors.surveyor.message}</p>
                    )}
                  </div>

                  {/* Requested By/Owner */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="requestedByOwner" className="mt-3">
                      Requested By/Owner
                    </Label>
                    <Input id="requestedByOwner" {...register('requestedByOwner')} />
                    {errors.requestedByOwner && (
                      <p className="text-red-500 mt-1">{errors.requestedByOwner.message}</p>
                    )}
                  </div>

                  {/* Year of Manufacture */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="yearOfManufacture" className="mt-3">
                      Year of Manufacture
                    </Label>
                    <Input
                      id="yearOfManufacture"
                      type="number"
                      {...register('yearOfManufacture')}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    {errors.yearOfManufacture && (
                      <p className="text-red-500 mt-1">{errors.yearOfManufacture.message}</p>
                    )}
                  </div>

                  {/* Serial No */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="serialNo" className="mt-3">
                      Serial No
                    </Label>
                    <Input id="serialNo" {...register('serialNo')} />
                    {errors.serialNo && (
                      <p className="text-red-500 mt-1">{errors.serialNo.message}</p>
                    )}
                  </div>

                  {/* Owner Address */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="ownerAddress" className="mt-3">
                      Owner Address
                    </Label>
                    <Input id="ownerAddress" {...register('ownerAddress')} />
                    {errors.ownerAddress && (
                      <p className="text-red-500 mt-1">{errors.ownerAddress.message}</p>
                    )}
                  </div>

                  {/* Owner Name */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="ownerName" className="mt-3">
                      Owner Name
                    </Label>
                    <Input id="ownerName" {...register('ownerName')} />
                    {errors.ownerName && (
                      <p className="text-red-500 mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>

                  {/* Test Cert/COC No */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="testCertCOCNo" className="mt-3">
                      Test Cert/COC No
                    </Label>
                    <Input id="testCertCOCNo" {...register('testCertCOCNo')} />
                    {errors.testCertCOCNo && (
                      <p className="text-red-500 mt-1">{errors.testCertCOCNo.message}</p>
                    )}
                  </div>

                  {/* Model */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="model" className="mt-3">
                      Model
                    </Label>
                    <Input id="model" {...register('model')} />
                    {errors.model && (
                      <p className="text-red-500 mt-1">{errors.model.message}</p>
                    )}
                  </div>

                  {/* Manufacturer */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">
                      Manufacturer
                    </Label>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="manufacturer">
                            <SelectValue placeholder="Select Manufacturer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manufacturer1">Manufacturer1</SelectItem>
                            <SelectItem value="Manufacturer2">Manufacturer2</SelectItem>
                            {/* Add more options as needed */}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.manufacturer && (
                      <p className="text-red-500 mt-1">{errors.manufacturer.message}</p>
                    )}
                  </div>

                  {/* Place of Inspection */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="placeOfInspection" className="mt-3">
                      Place of Inspection
                    </Label>
                    <Controller
                      name="placeOfInspection"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="placeOfInspection">
                            <SelectValue placeholder="Select Place of Inspection" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Place1">Place1</SelectItem>
                            <SelectItem value="Place2">Place2</SelectItem>
                            {/* Add more options as needed */}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.placeOfInspection && (
                      <p className="text-red-500 mt-1">
                        {errors.placeOfInspection.message}
                      </p>
                    )}
                  </div>

                  {/* Job Order No */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="jobOrderNo" className="mt-3">
                      Job Order No
                    </Label>
                    <Input id="jobOrderNo" {...register('jobOrderNo')} />
                    {errors.jobOrderNo && (
                      <p className="text-red-500 mt-1">{errors.jobOrderNo.message}</p>
                    )}
                  </div>

                  {/* Reference Standard */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="referenceStandard" className="mt-3">
                      Reference Standard
                    </Label>
                    <Controller
                      name="referenceStandard"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="referenceStandard">
                            <SelectValue placeholder="Select Reference Standard" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard1">Standard1</SelectItem>
                            <SelectItem value="Standard2">Standard2</SelectItem>
                            {/* Add more options as needed */}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.referenceStandard && (
                      <p className="text-red-500 mt-1">
                        {errors.referenceStandard.message}
                      </p>
                    )}
                  </div>

                  {/* Type of Exam */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="typeOfExam" className="mt-3">
                      Type of Exam
                    </Label>
                    <Controller
                      name="typeOfExam"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="typeOfExam">
                            <SelectValue placeholder="Select Type of Exam" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ExamType1">ExamType1</SelectItem>
                            <SelectItem value="ExamType2">ExamType2</SelectItem>
                            {/* Add more options as needed */}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.typeOfExam && (
                      <p className="text-red-500 mt-1">{errors.typeOfExam.message}</p>
                    )}
                  </div>

                  {/* Last Test Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="lastTestDate" className="mt-3">
                      Last Test Date
                    </Label>
                    <Input id="lastTestDate" type="date" {...register('lastTestDate')} />
                    {errors.lastTestDate && (
                      <p className="text-red-500 mt-1">{errors.lastTestDate.message}</p>
                    )}
                  </div>

                  {/* Next Test Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextTestDate" className="mt-3">
                      Next Test Date
                    </Label>
                    <Input id="nextTestDate" type="date" {...register('nextTestDate')} />
                    {errors.nextTestDate && (
                      <p className="text-red-500 mt-1">{errors.nextTestDate.message}</p>
                    )}
                  </div>

                  {/* Last Thorough Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="lastThoroughDate" className="mt-3">
                      Last Thorough Date
                    </Label>
                    <Input
                      id="lastThoroughDate"
                      type="date"
                      {...register('lastThoroughDate')}
                    />
                    {errors.lastThoroughDate && (
                      <p className="text-red-500 mt-1">
                        {errors.lastThoroughDate.message}
                      </p>
                    )}
                  </div>

                  {/* Next Thorough Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextThoroughDate" className="mt-3">
                      Next Thorough Date
                    </Label>
                    <Input
                      id="nextThoroughDate"
                      type="date"
                      {...register('nextThoroughDate')}
                    />
                    {errors.nextThoroughDate && (
                      <p className="text-red-500 mt-1">
                        {errors.nextThoroughDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* FormTable Component */}
                <div className="grid w-full gap-4">
                  <FormTable onFunction={() => setIsPopupOpen(true)} />
                </div>

                {/* AnnexureTable Component */}
                <div className="grid w-full gap-4">
                  <AnnexureTable onFunction={() => setIsPopupOpen(true)} />
                </div>

                {/* Description with ReactQuill */}
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                      <Label htmlFor="description">Description</Label>
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
                        <p className="text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                      <Label htmlFor="description_of_test">Description</Label>
                      <Controller
                        name="description_of_test"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            className="mt-3"
                            {...field}
                          />
                        )}
                      />
                      {errors.description_of_test && (
                        <p className="text-red-500 mt-1">
                          {errors.description_of_test.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="reset"
                    className="px-10"
                    onClick={onClose}
                    variant="outline"
                  >
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
