'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { z, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import SafetyChecklist from '@/components/safety-checklist';
import { useSubtopic } from '@/context/SubtopicContext';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import { PlusIcon } from 'lucide-react';

// Define schema for validation
const equipmentDetailsSchema = object({
  inspection_date: string().nonempty('Inspection Date is required'),
  site: string().nonempty('Site is required'),
  authority: string().nonempty('Authority is required'),
  standard: string().nonempty('Standard is required'),
  job_order_no: string().nonempty('Job Order No. is required'),
  equipment_no: string().nonempty('Equipment No. is required'),
  title: string().nonempty('Title is required'),
  test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
  safe_working_load: string().nonempty('Safe Working Load is required'),
  last_test_exam: string().nonempty('Last Test Exam is required'),
  next_test_exam: string().optional(),
  last_thorough_exam: string().nonempty('Last Thorough Exam is required'),
  next_thorough_exam: string().optional(),
  result: string().nonempty('Result is required'),
  type_of_exam: string().nonempty('Type of Exam is required'),
  surveyor: string().nonempty('Surveyor is required'),
  defect_description: string().nonempty('Defect Description is required'),
  test_particulars: string().nonempty('Test Particulars is required'),
  location: string().nonempty('Location is required'),
  owner_name: string().nonempty('Owner Name is required'),
  proof_load: string().nonempty('Proof Load is required'),
  description: string().nonempty('Description is required'),
  equipment_description: string().nonempty('Equipment Description is required'),
  manufacturer: string().nonempty('Manufacturer is required'),
  tested_standard: string().nonempty('Tested Standard is required'),
  approval_status: string().nonempty('Approval Status is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsEditFormProps {
  onClose: () => void;
  id: number; // ID of the equipment record to edit
  setIsLocation: (value: boolean) => void;
  setIsEquipment: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsManufacturer: (value: boolean) => void;
}

export default function EquipmentDetailsEditForm({ onClose, id ,setIsLocation,setIsEquipment,setIsStandard,setIsManufacturer}: EquipmentDetailsEditFormProps) {
  const [loading, setLoading] = useState(false);
  const { getAllSingleSubtopic, findRecordById, updateRecord } = useSubtopic();
  const [testExamChecked, setTestExamChecked] = useState<boolean>(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState<boolean>(false);
  const existingData = id ? findRecordById(id) : null;
  console.log(existingData,"existingData");
  
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      inspection_date: existingData?.inspection_date || '',
      site: String(existingData?.site) || '',
      authority: String(existingData?.authority) || '',
      standard: String(existingData?.standard) || '',
      job_order_no: String(existingData?.job_order_no) || '',
      equipment_no: String(existingData?.equipment_no) || '',
      title: existingData?.title || '',
      test_cert_coc_no: existingData?.test_cert_coc_no || '',
      safe_working_load: existingData?.safe_working_load || '',
      last_test_exam: existingData?.last_test_exam || '',
      next_test_exam: existingData?.next_test_exam || '',
      last_thorough_exam: existingData?.last_thorough_exam || '',
      next_thorough_exam: existingData?.next_thorough_exam || '',
      result: existingData?.result || '',
      type_of_exam: existingData?.type_of_exam || '',
      surveyor: String(existingData?.surveyor) || '',
      defect_description: existingData?.defect_description || '',
      test_particulars: existingData?.test_particulars || '',
      location: String(existingData?.location) || '5',
      owner_name: existingData?.owner_name || '',
      proof_load: String(existingData?.proof_load) || '',
      description: String(existingData?.description) || '',
      equipment_description: String(existingData?.equipment_description) || '',
      manufacturer: String(existingData?.manufacturer) || '',
      tested_standard: String(existingData?.tested_standard) || '',
      approval_status: existingData?.approval_status ? 'Approved' : 'Not Approved',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    register,
    formState: { isSubmitSuccessful, errors },
    watch,
    setValue,
  } = methods;

  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any[]>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any[]>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any[]>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any[]>([]);
  const [ownerOptions, setOwnerOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);

  const [safetyChecklistValues, setSafetyChecklistValues] = useState({
    firstExamination: 'no',
    sixMonthInterval: 'no',
    twelveMonthInterval: 'no',
    correctInstallation: 'no',
    examinationScheme: 'no',
    exceptionalCircumstances: 'no',
    safeToUse: 'no'
  });

  // Fetch existing equipment data
  useEffect(() => {
    const fetchEquipmentData = async () => {
      const data = await findRecordById(id);
      console.log(data,"data");
      
      if (data) { 
        reset({
          inspection_date: data.inspection_date || '',
          site: String(data.site) || '',
          authority: String(data.authority) || '',
          standard: String(data.standard) || '',
          job_order_no: String(data.job_order_no) || '',
          equipment_no: String(data.equipment_no) || '',
          title: data.title || '',
          test_cert_coc_no: data.test_cert_coc_no || '',
          safe_working_load: data.safe_working_load || '',
          last_test_exam: data.last_test_exam || '',
          next_test_exam: data.next_test_exam || '',
          last_thorough_exam: data.last_thorough_exam || '',
          next_thorough_exam: data.next_thorough_exam || '',
          result: data.result || '',
          type_of_exam: data.type_of_exam || '',
          surveyor: String(data.surveyor) || 'sdsd',
          defect_description: data.defect_description || '',
          test_particulars: data.test_particulars || '',
          location: String(data.location) || '5',
          owner_name: String(data.owner_name) || '',
          proof_load: String(data.proof_load) || 'sdsdsd',
          description: String(data.description) || '',
          equipment_description: String(data.equipment_description) || '',
          manufacturer: String(data.manufacturer) || '',
          tested_standard: data.tested_standard || '',
          approval_status: data.approval_status ? 'Approved' : 'Not Approved',
        });

        // Set safety checklist values
        setSafetyChecklistValues({
          firstExamination: data.first_examination ? 'yes' : 'no',
          sixMonthInterval: data.six_month_interval ? 'yes' : 'no',
          twelveMonthInterval: data.twelve_month_interval ? 'yes' : 'no',
          correctInstallation: data.correct_installation ? 'yes' : 'no',
          examinationScheme: data.examination_scheme ? 'yes' : 'no',
          exceptionalCircumstances: data.exceptional_circumstances ? 'yes' : 'no',
          safeToUse: data.safe_to_use ? 'yes' : 'no',
        });

        // Handle "Not Applicable" checkboxes
        setTestExamChecked(!data.next_test_exam || data.next_test_exam === "Not Applicable");
        setThoroughExamChecked(!data.next_thorough_exam || data.next_thorough_exam === "Not Applicable");
      }
    };

    fetchEquipmentData();
  }, [id]);

  // Fetch select options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      const [sites, authorities, jobOrders, equipments, standards, manufacturers, surveyors, owners] = await Promise.all([
        getAllSingleSubtopic("site"),
        getAllSingleSubtopic("authority"),
        getAllSingleSubtopic("job_orders"),
        getAllSingleSubtopic("equipment"),
        getAllSingleSubtopic("standard"),
        getAllSingleSubtopic("manufacturer"),
        getAllSingleSubtopic("surveyor"),
        getAllSingleSubtopic("owner")
      ]); 
      setSiteOptions(sites || []);
      setAuthorityOptions(authorities || []);
      setJobOrderNoOptions(jobOrders || []);
      setEquipmentNoOptions(equipments || []);
      setStandardOptions(standards || []);
      setManufacturerOptions(manufacturers || []);
      setSurveyorOptions(surveyors || []);
      setOwnerOptions(owners || []);
    };

    fetchOptions();
  }, [getAllSingleSubtopic]);

  useEffect(() => {
    const fetchLocations = async () => {
      await makeApiCall(() => new MasterService().getLocationDetails(), {
        afterSuccess: (data: any) => {
          if (data) {
            console.log(data,"data");
            
            setLocationOptions(data);
          }
        }
      });
    };
    fetchLocations();
  }, []);

  // Watch equipment_no and update related fields
  const equipment_no = watch('equipment_no');
 
  useEffect(() => {
    if (equipment_no) {
      const selectedEquipment = equipmentNoOptions.find((item) => item.id == equipment_no);
      if (selectedEquipment) {
        setValue('standard', String(selectedEquipment.standard) || '');
        setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
        setValue('owner_name', String(selectedEquipment.owner_id) || '');
        setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || '');
        setValue('safe_working_load', String(selectedEquipment.safe_working_load) || '');
        setValue('proof_load', String(selectedEquipment.proof_load) || '');
        setValue('description', String(selectedEquipment.description) || '');
        setValue('equipment_description', String(selectedEquipment.description) || '');
        setValue('title', String(selectedEquipment.title) || '');
        setValue('last_test_exam', String(selectedEquipment.last_test_date) || '');
        setValue('next_test_exam', String(selectedEquipment.next_test_date) || '');
        setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || '');
        setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || '');
      }
    }
  }, [equipment_no, equipmentNoOptions, setValue]);

  // Handle "Not Applicable" checkboxes based on equipment data
  useEffect(() => {
    const selectedEquipment = equipmentNoOptions.find((item) => item.id == equipment_no);
    if (selectedEquipment) {
      setTestExamChecked(!selectedEquipment.next_test_date);
      setThoroughExamChecked(!selectedEquipment.next_thorough_date);
    }
  }, [equipment_no, equipmentNoOptions]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const handleSafetyChecklistChange = (name: string, value: string) => {
    setSafetyChecklistValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        first_examination: safetyChecklistValues.firstExamination === "no" ? false : true,
        six_month_interval: safetyChecklistValues.sixMonthInterval === "no" ? false : true,
        twelve_month_interval: safetyChecklistValues.twelveMonthInterval === "no" ? false : true,
        correct_installation: safetyChecklistValues.correctInstallation === "no" ? false : true,
        examination_scheme: safetyChecklistValues.examinationScheme === "no" ? false : true,
        exceptional_circumstances: safetyChecklistValues.exceptionalCircumstances === "no" ? false : true,
        safe_to_use: safetyChecklistValues.safeToUse === "no" ? false : true,
        approval_status: values.approval_status === "Approved" ? true : false,
        next_test_exam: testExamChecked ? "Not Applicable" : values.next_test_exam,
        next_thorough_exam: thoroughExamChecked ? "Not Applicable" : values.next_thorough_exam
      };

      await updateRecord(id, formData);

      toastWithTimeout(ToastVariant.Success, 'Equipment details updated successfully');
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toastWithTimeout(ToastVariant.Error, 'An error occurred while updating the equipment details');
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

                {/* CERTIFICATE For Lifting Gear Title */}
                <h2 className={"text-base font-bold"}>CERTIFICATE For Lifting Gear Single</h2>

                <div className={"grid gap-4 grid-cols-2"}>
                  {/* Inspection Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspection_date" className="mt-3">Inspection Date</Label>
                    <Input id="inspection_date" type="date" {...register('inspection_date')} />
                    {errors.inspection_date && (
                      <p className="text-red-500 text-[12px] ">{errors.inspection_date.message}</p>
                    )}
                  </div>

                  {/* Site */}
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
                            {siteOptions?.map((site: any) => (
                              <SelectItem key={site.id} value={String(site.id)}>
                                {site?.name ?? site?.site}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.site && (
                      <p className="text-red-500 text-[12px] ">{errors.site.message}</p>
                    )}
                  </div>

                  {/* Authority */}
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
                            {authorityOptions?.map((authority: any) => (
                              <SelectItem key={authority.id} value={String(authority.id)}>
                                {authority?.authority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.authority && (
                      <p className="text-red-500 text-[12px] ">{errors.authority.message}</p>
                    )}
                  </div>

                  {/* Type of Exam */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="type_of_exam" className="mt-3">Type of Exam</Label>
                    <Controller
                      name="type_of_exam"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="type_of_exam">
                            <SelectValue placeholder="Select type of exam" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Test">Test</SelectItem>
                            <SelectItem value="Thorough">Thorough</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type_of_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.type_of_exam.message}</p>
                    )}
                  </div>

                  {/* Job Order No. */}
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
                            {jobOrderNoOptions?.map((jobOrder: any) => (
                              <SelectItem key={jobOrder.id} value={String(jobOrder.id)}>
                                {jobOrder?.job_no}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.job_order_no && (
                      <p className="text-red-500 text-[12px] ">{errors.job_order_no.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <div className='relative'>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationOptions?.map((loc: any) => (
                              <SelectItem key={loc.id} value={String(loc.location.id)}>
                                {loc.location.name}
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
                    onClick={()=>setIsLocation(true)}>

                    <PlusIcon className="h-4 w-4" />
                  </Button>
                    {errors.location && (
                      <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
                    )}</div>
                  </div>
                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment Information Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
                    <div className='relative'>
                    <Controller
                      name="equipment_no"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="equipment_no">
                            <SelectValue placeholder="Select equipment no." />
                          </SelectTrigger>
                          <SelectContent>
                            {equipmentNoOptions?.map((equipment: any) => (
                              <SelectItem key={equipment.id} value={String(equipment.id)}>
                                {equipment?.equipment_no}
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
                    onClick={()=>setIsEquipment(true)}>

                    <PlusIcon className="h-4 w-4" />
                  </Button>
                    {errors.equipment_no && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                    )}</div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input 
                      id="title"  
                      {...register('title')} 
                      readOnly
                    />
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>
                </div>
                <section className='grid gap-4 grid-cols-1'>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    <Input 
                      id="equipment_description"  
                      {...register('equipment_description')} 
                      readOnly
                    />
                    {errors.equipment_description && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_description.message}</p>
                    )}
                  </div>
                </section>
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="test_cert_coc_no" className="mt-3">Test Cert/COC No.</Label>
                    <Input 
                      id="test_cert_coc_no"  
                      {...register('test_cert_coc_no')} 
                      readOnly
                    />
                    {errors.test_cert_coc_no && (
                      <p className="text-red-500 text-[12px] ">{errors.test_cert_coc_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
                    <Input 
                      id="safe_working_load"  
                      {...register('safe_working_load')} 
                      readOnly
                    />
                    {errors.safe_working_load && (
                      <p className="text-red-500 text-[12px] ">{errors.safe_working_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="proof_load" className="mt-3">Proof Load:</Label>
                    <Input 
                      id="proof_load"  
                      {...register('proof_load')} 
                      readOnly
                    />
                    {errors.proof_load && (
                      <p className="text-red-500 text-[12px] ">{errors.proof_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="standard" className="mt-3">Standard</Label>
                    <div className='relative'>
                    <Controller
                      name="standard"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="standard">
                            <SelectValue placeholder="Select standard" />
                          </SelectTrigger>
                          <SelectContent>
                            {standardOptions?.map((standard: any) => (
                              <SelectItem key={standard.id} value={String(standard.id)}>
                                {standard.standard}
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
                    onClick={()=>setIsStandard(true)}>

                    <PlusIcon className="h-4 w-4" />
                  </Button>
                    {errors.standard && (
                      <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                    )}</div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">Last Test Exam</Label>
                    <Input
                      id="last_test_exam"
                      type="date"
                      {...register('last_test_exam')}
                      readOnly
                    />
                    {errors.last_test_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam" className="mt-3">Last Thorough Exam</Label>
                    <Input
                      id="last_thorough_exam"
                      type="date"
                      {...register('last_thorough_exam')}
                      readOnly
                    />
                    {errors.last_thorough_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-1 w-full">
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label className='mt-3' htmlFor="next_test_exam">Next Test Exam</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            id="next_test_exam"  
                            type="date" 
                            {...field} 
                            disabled={testExamChecked} 
                            value={testExamChecked ? "" : field.value || ""}
                          />
                        )}
                      />
                      <Checkbox 
                        className='w-6 h-6'  
                        checked={testExamChecked} 
                        onCheckedChange={(checked:any) => setTestExamChecked(checked)} 
                      /> 
                      <span className="text-[13px] w-[33%] ">Not Applicable</span>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.next_test_exam.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor={"next_thorough_exam"}>Next Thorough Exam</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name={"next_thorough_exam"}
                        control={control}
                        render={({ field }) => (
                          <Input 
                            id={"next_thorough_exam"}  
                            type="date" 
                            {...field} 
                            disabled={thoroughExamChecked} 
                            value={thoroughExamChecked ? "" : field.value || ""}
                          />
                        )}
                      />
                      <Checkbox 
                        className={'w-6 h-6'} 
                        checked={thoroughExamChecked} 
                        onCheckedChange={(checked:any) => setThoroughExamChecked(checked!)} 
                      /> 
                      <span className="text-[13px] w-[33%] ">Not Applicable</span>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.next_thorough_exam.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Result Section */}
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
                            <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                            <SelectItem value="Scrap">Scrap</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.result && (
                      <p className="text-red-500 text-[12px] ">{errors.result.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_name" className="mt-3">Owner Name</Label>
                    <Controller
                      name="owner_name"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="owner_name">
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {ownerOptions?.map((owner: any) => (
                              <SelectItem key={owner.id} value={String(owner.id)}>
                                {owner?.owner}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.owner_name && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
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
                            {surveyorOptions?.map((surveyor: any) => (
                              <SelectItem key={surveyor.id} value={String(surveyor.id)}>
                                {surveyor.surveyor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.surveyor && (
                      <p className="text-red-500 text-[12px] ">{errors.surveyor.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="tested_standard" className="mt-3">Tested Standard</Label>
                    <Input 
                      id="tested_standard" 
                      {...register('tested_standard')} 
                    />
                    {errors.tested_standard && (
                      <p className="text-red-500 text-[12px] ">{errors.tested_standard.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <div className='relative'>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="manufacturer">
                            <SelectValue placeholder="Select manufacturer" />
                          </SelectTrigger>
                          <SelectContent>
                            {manufacturerOptions?.map((manufacturer: any) => (
                              <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                                {manufacturer.manufacturer}
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
                    onClick={()=>setIsManufacturer(true)}>

                    <PlusIcon className="h-4 w-4" />
                  </Button>
                    {errors.manufacturer && (
                      <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
                    )}</div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="approval_status" className="mt-3">Approval Status</Label>
                    <Controller
                      name="approval_status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="approval_status">
                            <SelectValue placeholder="Select approval status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Not Approved">Not Approved</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.approval_status && (
                      <p className="text-red-500 text-[12px] ">{errors.approval_status.message}</p>
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
                          <p className="text-red-500 text-[12px] ">{errors.description.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <Label htmlFor="defect_description" className="mt-3">
                      Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect:
                    </Label>
                    <Input 
                      id="defect_description" 
                      {...register('defect_description')} 
                    />
                    {errors.defect_description && (
                      <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <Label htmlFor="test_particulars" className="mt-3">
                      Particulars of any tests carried out as part of the examination
                    </Label>
                    <Input 
                      id="test_particulars" 
                      {...register('test_particulars')} 
                    />
                    {errors.test_particulars && (
                      <p className="text-red-500 text-[12px] ">{errors.test_particulars.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <SafetyChecklist 
                      values={safetyChecklistValues}
                      onChange={handleSafetyChecklistChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button 
                    type="reset" 
                    className="px-10" 
                    onClick={onClose} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border" 
                    type="submit" 
                    disabled={loading}
                  >
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
