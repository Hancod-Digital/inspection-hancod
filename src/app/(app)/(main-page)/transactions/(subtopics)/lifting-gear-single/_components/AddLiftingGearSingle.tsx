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
import { Checkbox } from '@/components/ui/checkbox';
const equipmentDetailsSchema = object({
  inspectionDate: string().nonempty('Inspection Date is required'),
  site: string().nonempty('Site is required'),
  authority: string().nonempty('Authority is required'),
  standard: string().nonempty('Standard is required'),
  job_order_no: string().nonempty('Job Order No. is required'),
  equipment_no: string().nonempty('Equipment No. is required'),
  title: string().nonempty('Title is required'),
  test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
  safe_working_load: string().nonempty('Safe Working Load is required'),
  last_test_exam: string().nonempty('Last Test Exam is required'),
  next_test_exam: string().nonempty('Next Test Exam is required'),
  last_thorough_exam: string().nonempty('Last Thorough Exam is required'),
  next_thorough_exam: string().nonempty('Next Thorough Exam is required'),
  result: string().nonempty('Result is required'),
  area: string().nonempty('Area is required'),
  surveyor: string().nonempty('Surveyor is required'),
  equipment_description: string().nonempty('Equipment Description is required'),
  work_order_no: string().nonempty('Work Order No. is required'),
  owner_name: string().nonempty('Owner Name is required'),
  proof_load: string().nonempty('Proof Load is required'),
  description: string().nonempty('Description Date is required'),
  owner_address: string().nonempty('Owner Address is required'),
  manufacturer: string().nonempty('Manufacturer is required'),
  tested_standard: string().nonempty('Tested Standard is required'),
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
 const [testExamChecked, setTestExamChecked] = useState<any>(false);
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
                    <Label htmlFor="job_order_no" className="mt-3">Job Order No.</Label>
                    <Controller
                      name="job_order_no"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="job_order_no">
                            <SelectValue placeholder="Select job order no." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JobOrder1">Job Order 1</SelectItem>
                            <SelectItem value="JobOrder2">Job Order 2</SelectItem>
                            <SelectItem value="JobOrder3">Job Order 3</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.job_order_no && (
                      <p className="text-red-500 mt-1">{errors.job_order_no.message}</p>
                    )}
                  </div>

                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment Information Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
                    <Controller
                      name="equipment_no"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="equipment_no">
                            <SelectValue placeholder="Select job order no." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JobOrder1">Job Order 1</SelectItem>
                            <SelectItem value="JobOrder2">Job Order 2</SelectItem>
                            <SelectItem value="JobOrder3">Job Order 3</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.equipment_no && (
                      <p className="text-red-500 mt-1">{errors.equipment_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && (
                      <p className="text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  </div>
                  <section className='grid gap-4 grid-cols-1'>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    <Input id="equipment_description" {...register('equipment_description')} />
                    {errors.equipment_description && (
                      <p className="text-red-500 mt-1">{errors.equipment_description.message}</p>
                    )}
                  </div>  
                  </section>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <Label htmlFor="test_cert_coc_no" className="mt-3">Test Cert/COC No.</Label>
                    <Input id="test_cert_coc_no" {...register('test_cert_coc_no')} />
                    {errors.test_cert_coc_no && (
                      <p className="text-red-500 mt-1">{errors.test_cert_coc_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
                    <Input id="safe_working_load" {...register('safe_working_load')} />
                    {errors.safe_working_load && (
                      <p className="text-red-500 mt-1">{errors.safe_working_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="proof_load" className="mt-3">Proof Load:</Label>
                    <Input id="proof_load" {...register('proof_load')} />
                    {errors.proof_load && (
                      <p className="text-red-500 mt-1">{errors.proof_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="standard" className="mt-3">Standard</Label>
                    <Controller
                      name="standard"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="standard">
                            <SelectValue placeholder="Select standard" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard1">Standard 1</SelectItem>
                            <SelectItem value="Standard2">Standard 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.standard && (
                      <p className="text-red-500 mt-1">{errors.standard.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">Last Test Exam</Label>
                    <Input id="last_test_exam" type="date" {...register('last_test_exam')} />
                    {errors.last_test_exam && (
                      <p className="text-red-500 mt-1">{errors.last_test_exam.message}</p>
                    )}
                  </div>
                 
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam" className="mt-3">Last Thorough Exam</Label>
                    <Input id="last_thorough_exam" type="date" {...register('last_thorough_exam')} />
                    {errors.last_thorough_exam && (
                      <p className="text-red-500 mt-1">{errors.last_thorough_exam.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] w-[64.2%]  items-start gap-4">
                      <Label  className='mt-3' htmlFor="next_test_date">Next Test Exam</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="next_test_exam"
                          control={control}
                          render={({ field }) => (
                            <Input id="next_test_date" disabled={testExamChecked} type="date" {...field} />
                          )}
                        />
                        <Checkbox className='w-6 h-6' checked={testExamChecked} onCheckedChange={(checked) => setTestExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                        {errors.next_test_exam && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.next_test_exam.message}
                          </p>
                        )}
                      </div>
                    </div>
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextTestExam" className="mt-3">Next Test Exam</Label>
                    <Input id="nextTestExam" type="date" {...register('nextTestExam')} />
                    {errors.nextTestExam && (
                      <p className="text-red-500 mt-1">{errors.nextTestExam.message}</p>
                    )}
                  </div> */}
                  <div className="grid grid-cols-[200px_1fr] w-[64.2%]  items-start gap-4">
                      <Label className='mt-3' htmlFor="next_thorough_exam">Next Thorough Exam</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="next_thorough_exam"
                          control={control}
                          render={({ field }) => (
                            <Input id="next_thorough_exam" disabled={testExamChecked} type="date" {...field} />
                          )}
                        />
                        <Checkbox className='w-6 h-6' checked={testExamChecked} onCheckedChange={(checked) => setTestExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                        {errors.next_thorough_exam && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.next_thorough_exam.message}
                          </p>
                        )}
                      </div>
                    </div>
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextThoroughExam" className="mt-3">Next Thorough Exam</Label>
                    <Input id="nextThoroughExam" type="date" {...register('nextThoroughExam')} />
                    {errors.nextThoroughExam && (
                      <p className="text-red-500 mt-1">{errors.nextThoroughExam.message}</p>
                    )}
                  </div> */}
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
                    <Label htmlFor="work_order_no" className="mt-3">Work Order No.</Label>
                    <Input id="work_order_no" {...register('work_order_no')} />
                    {errors.work_order_no && (
                      <p className="text-red-500 mt-1">{errors.work_order_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_name" className="mt-3">Owner Name</Label>
                    <Input id="owner_name" {...register('owner_name')} />
                    {errors.owner_name && (
                      <p className="text-red-500 mt-1">{errors.owner_name.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_address" className="mt-3">Owner Address</Label>
                    <Input id="owner_address" {...register('owner_address')} />
                    {errors.owner_address && (
                      <p className="text-red-500 mt-1">{errors.owner_address.message}</p>
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
                    <Label htmlFor="tested_standard" className="mt-3">Tested Standard</Label>
                    <Controller
                      name="tested_standard"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="tested_standard">
                            <SelectValue placeholder="Select tested standard" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard1">Standard 1</SelectItem>
                            <SelectItem value="Standard2">Standard 2</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.tested_standard && (
                      <p className="text-red-500 mt-1">{errors.tested_standard.message}</p>
                    )}
                  </div>


                </div>
                <div className="grid gap-4 grid-cols-1">
                  <Table onFunction={function (): void {
                    throw new Error('Function not implemented.');
                  }} />
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
