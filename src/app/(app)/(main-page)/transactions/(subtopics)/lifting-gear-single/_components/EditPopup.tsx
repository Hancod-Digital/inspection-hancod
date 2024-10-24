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
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import dynamic from 'next/dynamic';
import Table from './AnnexureTable'
import 'react-quill/dist/quill.snow.css';
const equipmentDetailsSchema = object({
  inspectionDate: string().nonempty('Inspection Date is required'),
  site: string().nonempty('Site is required'),
  authority: string().nonempty('Authority is required'),
  jobOrderNo: string().nonempty('Job Order No. is required'),
  equipmentNo: string().nonempty('Equipment No. is required'),
  title: string().nonempty('Title is required'),
  testCertCOCNo: string().nonempty('Test Cert/COC No. is required'),
  safeWorkingLoad: string().nonempty('Safe Working Load is required'),
  lastTestExam: string().nonempty('Last Test Exam is required'),
  nextTestExam: string().nonempty('Next Test Exam is required'),
  lastThoroughExam: string().nonempty('Last Thorough Exam is required'),
  nextThoroughExam: string().nonempty('Next Thorough Exam is required'),
  result: string().nonempty('Result is required'),
  area: string().nonempty('Area is required'),
  surveyor: string().nonempty('Surveyor is required'),
  workOrderNo: string().nonempty('Work Order No. is required'),
  ownerName: string().nonempty('Owner Name is required'),
  description: string().nonempty('Description Date is required'),
  ownerAddress: string().nonempty('Owner Address is required'),
  manufacturer: string().nonempty('Manufacturer is required'),
  testedStandard: string().nonempty('Tested Standard is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);

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

                {/* CERTIFICATE For Lifting Gear Title */}
                <h2 className="text-base font-bold">CERTIFICATE For Lifting Gear</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Certificate For Lifting Gear Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspectionDate" className="mt-3">Inspection Date</Label>
                    <Input id="inspectionDate" type="date" {...register('inspectionDate')} />
                    {errors.inspectionDate && (
                      <p className="text-red-500 mt-1">{errors.inspectionDate.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <Controller
                      name="site"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="site">
                            <SelectValue placeholder="Select site" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Site1">Site 1</SelectItem>
                            <SelectItem value="Site2">Site 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.site && (
                      <p className="text-red-500 mt-1">{errors.site.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="authority" className="mt-3">Authority</Label>
                    <Controller
                      name="authority"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="authority">
                            <SelectValue placeholder="Select authority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Authority1">Authority 1</SelectItem>
                            <SelectItem value="Authority2">Authority 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.authority && (
                      <p className="text-red-500 mt-1">{errors.authority.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="jobOrderNo" className="mt-3">Job Order No.</Label>
                    <Input id="jobOrderNo" {...register('jobOrderNo')} />
                    {errors.jobOrderNo && (
                      <p className="text-red-500 mt-1">{errors.jobOrderNo.message}</p>
                    )}
                  </div>
                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment Information Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipmentNo" className="mt-3">Equipment No.</Label>
                    <Input id="equipmentNo" {...register('equipmentNo')} />
                    {errors.equipmentNo && (
                      <p className="text-red-500 mt-1">{errors.equipmentNo.message}</p>
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
                    <Label htmlFor="testCertCOCNo" className="mt-3">Test Cert/COC No.</Label>
                    <Input id="testCertCOCNo" {...register('testCertCOCNo')} />
                    {errors.testCertCOCNo && (
                      <p className="text-red-500 mt-1">{errors.testCertCOCNo.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safeWorkingLoad" className="mt-3">Safe Working Load</Label>
                    <Input id="safeWorkingLoad" {...register('safeWorkingLoad')} />
                    {errors.safeWorkingLoad && (
                      <p className="text-red-500 mt-1">{errors.safeWorkingLoad.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="lastTestExam" className="mt-3">Last Test Exam</Label>
                    <Input id="lastTestExam" type="date" {...register('lastTestExam')} />
                    {errors.lastTestExam && (
                      <p className="text-red-500 mt-1">{errors.lastTestExam.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextTestExam" className="mt-3">Next Test Exam</Label>
                    <Input id="nextTestExam" type="date" {...register('nextTestExam')} />
                    {errors.nextTestExam && (
                      <p className="text-red-500 mt-1">{errors.nextTestExam.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="lastThoroughExam" className="mt-3">Last Thorough Exam</Label>
                    <Input id="lastThoroughExam" type="date" {...register('lastThoroughExam')} />
                    {errors.lastThoroughExam && (
                      <p className="text-red-500 mt-1">{errors.lastThoroughExam.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextThoroughExam" className="mt-3">Next Thorough Exam</Label>
                    <Input id="nextThoroughExam" type="date" {...register('nextThoroughExam')} />
                    {errors.nextThoroughExam && (
                      <p className="text-red-500 mt-1">{errors.nextThoroughExam.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Information Section */}
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
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="result" className="mt-3">Result</Label>
                    <Controller
                      name="result"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="result">
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.result && (
                      <p className="text-red-500 mt-1">{errors.result.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="area" className="mt-3">Area</Label>
                    <Controller
                      name="area"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="area">
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Area1">Area 1</SelectItem>
                            <SelectItem value="Area2">Area 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.area && (
                      <p className="text-red-500 mt-1">{errors.area.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="surveyor" className="mt-3">Surveyor</Label>
                    <Controller
                      name="surveyor"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="surveyor">
                            <SelectValue placeholder="Select surveyor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Surveyor1">Surveyor 1</SelectItem>
                            <SelectItem value="Surveyor2">Surveyor 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.surveyor && (
                      <p className="text-red-500 mt-1">{errors.surveyor.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="workOrderNo" className="mt-3">Work Order No.</Label>
                    <Input id="workOrderNo" {...register('workOrderNo')} />
                    {errors.workOrderNo && (
                      <p className="text-red-500 mt-1">{errors.workOrderNo.message}</p>
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
                    <Label htmlFor="ownerAddress" className="mt-3">Owner Address</Label>
                    <Input id="ownerAddress" {...register('ownerAddress')} />
                    {errors.ownerAddress && (
                      <p className="text-red-500 mt-1">{errors.ownerAddress.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="manufacturer">
                            <SelectValue placeholder="Select manufacturer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manufacturer1">Manufacturer 1</SelectItem>
                            <SelectItem value="Manufacturer2">Manufacturer 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.manufacturer && (
                      <p className="text-red-500 mt-1">{errors.manufacturer.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="testedStandard" className="mt-3">Tested Standard</Label>
                    <Controller
                      name="testedStandard"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="testedStandard">
                            <SelectValue placeholder="Select testedStandard" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard1">Standard 1</SelectItem>
                            <SelectItem value="Standard2">Standard 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.testedStandard && (
                      <p className="text-red-500 mt-1">{errors.testedStandard.message}</p>
                    )}
                  </div>
                

                </div>
                <div className="grid gap-4 grid-cols-1">
                 <Table onFunction={function (): void {
                    throw new Error('Function not implemented.');
                  } } /> 
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
