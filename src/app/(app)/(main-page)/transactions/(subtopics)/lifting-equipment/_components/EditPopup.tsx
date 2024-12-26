// components/EditEquipmentDetailsForm.tsx

'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import AnnexuresTable from './AnnexureTable';
import Table from './EditPropertyTable';
import SafetyChecklist from '@/components/safety-checklist';
import { useSubtopic } from '@/context/SubtopicContext';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import { toastWithTimeout, ToastVariant } from '@/components/ui/use-toast';
import { PlusIcon } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const equipmentDetailsSchema = object({
  inspection_date: string().nonempty('Inspection Date is required'),
  site: string().nonempty('Site is required'),
  year_of_manufacture: string().nonempty('Year of Manufacture is required'),
  authority: string().nonempty('Authority is required'),
  standard: string().nonempty('Standard is required'),
  type_of_exam: string().nonempty('Type of Exam is required'),
  description_of_test: string().optional(),
  job_order_no: string().nonempty('Job Order No. is required'),
  test_particulars: string().nonempty('Test Particulars is required'),
  defect_description: string().nonempty('Defect Description is required'),
  equipment_no: string().nonempty('Equipment No. is required'),
  lift_location: string().nonempty('Lift Location is required').optional(),
  title: string().nonempty('Title is required'),
  test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
  safe_working_load: string().nonempty('Safe Working Load is required'),
  last_test_exam: string().nonempty('Last Test Exam is required'),
  next_test_exam: string().optional(),
  last_thorough_exam: string().nonempty('Last Thorough Exam is required'),
  next_thorough_exam: string().optional(),
  model_no: string().nonempty('Model No. is required'),
  registration_no: string().nonempty('Registration No. is required'),
  result: string().nonempty('Result is required'),
  surveyor: string().nonempty('Surveyor is required'), 
  result_description: string().optional(),
  owner_name: string().nonempty('Owner Name is required'),
  description: string().nonempty('Description is required').optional(),
  equipment_description: string().nonempty('Equipment Description is required'),
  manufacturer: string().nonempty('Manufacturer is required'),
  tested_standard: string().nonempty('Tested Standard is required'),
  approval_status: string().nonempty('Approval Status is required'),
  location: string().nonempty('Location is required'),
  serial_no: string().nonempty('Serial No. is required'),
 
  owner_id: string().nonempty('Owner ID is required')
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EditEquipmentDetailsFormProps {
  onClose: () => void;
  id: number;
  setIsLocation: (value: boolean) => void;
  setIsEquipment: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsOwner: (value: boolean) => void;
  setIsManufacturer: (value: boolean) => void;
}

export default function EditEquipmentDetailsForm({
  onClose,
  id,
  setIsLocation,
  setIsEquipment,
  setIsStandard,
  setIsOwner,
  setIsManufacturer,
}: EditEquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { getAllSingleSubtopic, updateRecord, findRecordById } = useSubtopic();
  const [testExamChecked, setTestExamChecked] = useState(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState(false);
  
  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any[]>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any[]>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any[]>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any>([]);
  const [ownerOptions, setOwnerOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [data, setData] = useState<{ [key: string]: string }[]>([]); // For Property Table
  const [annexureList, setAnnexureList] = useState<any[]>([]); // For Annexures Table

  // Fetch existing data
  const existingData = findRecordById(id);
   console.log(existingData);
   
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: existingData ? {
      inspection_date: existingData.inspection_date || '',
      site: String(existingData.site) || '',
      authority: String(existingData.authority) || '',
      standard: String(existingData.standard) || '',
      type_of_exam: existingData.type_of_exam || '',
      description_of_test: existingData.description_of_test || '',
      job_order_no: String(existingData.job_order_no) || '',
      equipment_no: String(existingData.equipment_no) || '',
      title: existingData.title || '',
      test_cert_coc_no: existingData.test_cert_coc_no || '',
      safe_working_load: existingData.safe_working_load || '',
      last_test_exam: existingData.last_test_exam || '',
      next_test_exam: existingData.next_test_exam || '',
      last_thorough_exam: existingData.last_thorough_exam || '',
      next_thorough_exam: existingData.next_thorough_exam || '',
      result: existingData.result || '',
      year_of_manufacture: existingData.year_of_manufacture || '',
      surveyor: String(existingData.surveyor) || '',
      result_description: existingData.result_description || '',
      owner_name: existingData.owner_name || '',
      defect_description: existingData.defect_description || '',
      test_particulars: existingData.test_particulars || '',
      description: existingData.description || '',
      equipment_description: existingData.equipment_description || '',
      manufacturer: String(existingData.manufacturer) || '',
      registration_no: existingData.registration_no || '',
      tested_standard: existingData.tested_standard || '',
      approval_status: existingData.approval_status || '',
      location: String(existingData.location) || '',
      serial_no: existingData.serial_no || '',
      
      owner_id: existingData.owner_id || '',
    } : {},
  });
 
  const {
    reset,
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  // Watch equipment_no to set related fields
  const equipment_no = watch('equipment_no');
  const job_order_no = watch('job_order_no');
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose(); // Close the form after successful update
      toastWithTimeout(ToastVariant.Success, "Equipment details updated successfully.");
    }
  }, [isSubmitSuccessful, reset, onClose]);

  // Fetch all select options on component mount
  const [item_type,setItem_type]=useState<any>("");
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [ authorities, jobOrders, equipmentNos, standards, manufacturers, surveyors, owners] = await Promise.all([
          // getAllSingleSubtopic("site"),
          getAllSingleSubtopic("authority"),
          getAllSingleSubtopic("job_orders"),
          getAllSingleSubtopic("equipment"),
          getAllSingleSubtopic("standard"),
          getAllSingleSubtopic("manufacturer"),
          getAllSingleSubtopic("surveyor"),
          getAllSingleSubtopic("owner"),
          makeApiCall(() => new MasterService().getLocationDetails(), {
            afterSuccess: (data: any) => setLocationOptions(data.filter((item:any)=>item.location.status==="ACTIVE")),
          }),
        ]);
  
       
        // setSiteOptions(sites?.filter((item:any)=>item.status==="ACTIVE") || []);
        setAuthorityOptions(authorities?.filter((item:any)=>item.status==="ACTIVE") || []);
        setJobOrderNoOptions(jobOrders || []);
        setEquipmentNoOptions(equipmentNos?.filter((item:any)=>item.status==="ACTIVE") || []);
        setStandardOptions(standards?.filter((item:any)=>item.status==="ACTIVE") || []);
        setManufacturerOptions(manufacturers?.filter((item:any)=>item.status==="ACTIVE") || []);
        setSurveyorOptions(surveyors || []);
        setOwnerOptions(owners?.filter((item:any)=>item.status==="ACTIVE") || []);
      } catch (error) {
        console.error("Error fetching select options:", error);
        toastWithTimeout(ToastVariant.Error, "Failed to load form options.");
      }
    };
  
    fetchOptions();
  
    // Handle equipment_no changes to set related fields
    if (equipment_no && equipmentNoOptions.length > 0) {
    
      const selectedEquipment = equipmentNoOptions.find((item) => item.id == equipment_no);
     
      setItem_type(selectedEquipment?.property_table_type);
  
      if (selectedEquipment) {
        console.log(selectedEquipment.model_no);
        
        setValue('standard', String(selectedEquipment.standard) || ''); // Update standard
        setValue('manufacturer', String(selectedEquipment.manufacturer) || ''); // Update manufacturer
        setValue('year_of_manufacture', String(selectedEquipment.year_of_manufacture) || ''); // Update year of manufacture
        setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || ''); // Update test cert/coc no
        setValue('safe_working_load', String(selectedEquipment.safe_working_load) || ''); // Update safe working load
       
        setValue('equipment_description', String(selectedEquipment.description) || ''); // Update equipment description
        setValue('title', String(selectedEquipment.title) || ''); // Update title
    
     
        setValue('owner_name',  String(ownerOptions.find((item:any)=>item.id==selectedEquipment.owner_id).code) || ''); // Update owner
        setValue('registration_no', String(selectedEquipment.registration_no) || ''); // Update registration no
        setValue('last_test_exam', String(selectedEquipment.last_test_date) || ''); // Update last test exam
        setValue('next_test_exam', String(selectedEquipment.next_test_date) || ''); // Update next test exam
        setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || ''); // Update last thorough exam
        setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || ''); // Update next thorough exam
        setValue('serial_no', String(selectedEquipment.serial_no) || ''); // Update serial no
        setValue('model_no', String(selectedEquipment.model_no) || ''); // Update model_no
        setValue('owner_id',String(selectedEquipment.owner_id) || ''); // Update owner id
      }
    }
     
  }, [
    equipment_no,
     
  ]); // Add all dependencies here
  

  useEffect(()=>{
    if(job_order_no){
      const job_order = jobOrderNoOptions.find((item: any) => item.id == job_order_no);
      console.log(job_order,"LLLLLLLL");
       if(job_order){
        setValue('surveyor', job_order.surveyor)
       }
    }
  },[job_order_no])
  // Handle checkboxes to disable date inputs
  useEffect(() => {
    const selectedEquipment = equipmentNoOptions.find(item => item.id == equipment_no);
    if (selectedEquipment) {
      console.log(selectedEquipment.next_test_date == null ? true :false);
      
      setTestExamChecked(selectedEquipment.next_test_date == null ? true :false);
      setThoroughExamChecked(selectedEquipment.next_thorough_date == null ? true :false);
    }
  }, [equipment_no, equipmentNoOptions]);

  // Fetch site options based on location
  useEffect(() => {
    const fetchSites = async () => {
      const res = locationOptions.filter((item: any) => String(item.location.id) === watch('location'));

      if (res.length > 0) {
        
        setSiteOptions(res.map((item)=>item?.site));
      }
    };
    fetchSites();
  }, [watch('location'), locationOptions]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        approval_status: values.approval_status === "Approved" ? true : false,
        next_test_exam: testExamChecked ? "Not Applicable" : values.next_test_exam,
        next_thorough_exam: thoroughExamChecked ? "Not Applicable" : values.next_thorough_exam,
        properties: data,
        annexures: annexureList,
      };

      await updateRecord(id, formData);
    } catch (error) {
      console.error('Error updating record:', error);
      toastWithTimeout(ToastVariant.Error, "Failed to update equipment details.");
    } finally {
      setLoading(false);
    }
  };

  if (!existingData) {
    return (
      <Card className="w-full border-0 p-4">
        <CardContent>
          <p className="text-red-500">Record not found.</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-0 p-0 hover:bg-white">
        <CardHeader>
          <CardTitle className="text-md">Edit Equipment Details</CardTitle>
        </CardHeader>
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
                <h2 className="text-base font-bold">CERTIFICATE For Lifting Equipment Certificate</h2>

                <div className="grid gap-4 grid-cols-2">
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
                            {locationOptions.map((location) => (
                              <SelectItem key={location.id} value={String(location.location.id)}>
                                {location.location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                     {/* <Button
                          size="icon"
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsLocation(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button> */}
                    {errors.location && (
                      <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
                    )}</div>
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
                            {authorityOptions.map((authority) => (
                              <SelectItem key={authority.id} value={String(authority.id)}>
                                {authority.authority}
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
                            {/* Add other options as needed */}
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
                            {jobOrderNoOptions.map((jobOrder) => (
                              <SelectItem key={jobOrder.id} value={String(jobOrder.id)}>
                                {jobOrder.job_no}
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
                            {siteOptions.map((site) => (
                              <SelectItem key={site.id} value={String(site.id)}>
                                {site.site}
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

                  
                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment No. */}
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
                            {equipmentNoOptions.map((equipment) => (
                              <SelectItem key={equipment.id} value={String(equipment.id)}>
                                {equipment.equipment_no}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {/* <Button
                          size="icon"
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsEquipment(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button> */}
                    {errors.equipment_no && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                    )}</div>
                  </div>

                  {/* Title */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Equipment Description */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    <Input id="equipment_description" {...register('equipment_description')} />
                    {errors.equipment_description && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_description.message}</p>
                    )}
                  </div>
  {/* Test Cert/COC No. */}
  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="test_cert_coc_no" className="mt-3">Test Cert/COC No.</Label>
                    <Input id="test_cert_coc_no" {...register('test_cert_coc_no')} />
                    {errors.test_cert_coc_no && (
                      <p className="text-red-500 text-[12px] ">{errors.test_cert_coc_no.message}</p>
                    )}
                  </div>
                  {/* Serial No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="serial_no" className="mt-3">Serial No.</Label>
                    <Input id="serial_no" {...register('serial_no')} />
                    {errors.serial_no && (
                      <p className="text-red-500 text-[12px] ">{errors.serial_no.message}</p>
                    )}
                  </div>
 {/* Owner ID */}
 <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_id" className="mt-3">Owner No/ID</Label>
                    <Input id="owner_id" {...register('owner_id')} />
                    {errors.owner_id && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_id.message}</p>
                    )}
                  </div>
                  {/* Model */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="model_no" className="mt-3">Model</Label>
                    <Input id="model_no" {...register('model_no')} />
                    {errors.model_no && (
                      <p className="text-red-500 text-[12px] ">{errors.model_no.message}</p>
                    )}
                  </div>
{/* Manufacturer */}
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
                            {manufacturerOptions.map((manufacturer) => (
                              <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                                {manufacturer.manufacturer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {/* <Button
                          size="icon"
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsManufacturer(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button> */}
                    {errors.manufacturer && (
                      <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
                    )}</div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="year_of_manufacture" className="mt-3">Year of Manufacture</Label>
                    
                    <Input id="year_of_manufacture" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.year_of_manufacture} {...register('year_of_manufacture')} />
                    {errors.year_of_manufacture && (
                      <p className="text-red-500 text-[12px] ">{errors.year_of_manufacture.message}</p>
                    )}
                  </div>
                 
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="registration_no" className="mt-3">Reg No.</Label>
                    <Input id="registration_no" {...register('registration_no')} />
                    {errors.registration_no && (
                      <p className="text-red-500 text-[12px] ">{errors.registration_no.message}</p>
                    )}
                  </div>

                


                  {/* Standard */}
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
                            {standardOptions.map((standard) => (
                              <SelectItem key={standard.id} value={String(standard.id)}>
                                {standard.standard}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {/* <Button
                          size="icon"
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsStandard(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button> */}
                    {errors.standard && (
                      <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                    )}</div>
                  </div>

                  {/* Safe Working Load */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
                    <Input id="safe_working_load" {...register('safe_working_load')} />
                    {errors.safe_working_load && (
                      <p className="text-red-500 text-[12px] ">{errors.safe_working_load.message}</p>
                    )}
                  </div>


                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_name" className="mt-3">Owner Name</Label>
                    <div className='relative'>
                    <Controller
                      name="owner_name"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="owner_name">
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {ownerOptions.map((owner) => (
                              <SelectItem key={owner.id} value={String(owner.id)}>
                                {owner.owner}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {/* <Button
                          size="icon"
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={()=>setIsOwner(true)}>

                          <PlusIcon className="h-4 w-4" />
                        </Button> */}
                    {errors.owner_name && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
                    )}</div>
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
                      <p className="text-red-500 text-[12px] ">{errors.surveyor.message}</p>
                    )}
                  </div>


  {/* Tested Standard */}
  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="tested_standard" className="mt-3">Tested Standard</Label>
                    <Input id="tested_standard" {...register('tested_standard')} />
                    {errors.tested_standard && (
                      <p className="text-red-500 text-[12px] ">{errors.tested_standard.message}</p>
                    )}
                  </div>

                  {/* Last Test Exam */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">Last Test Exam</Label>
                    <Input
                      id="last_test_exam"
                      type="date"
                      {...register('last_test_exam')}
                    />
                    {errors.last_test_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                    )}
                  </div>

                  {/* Last Thorough Exam */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam" className="mt-3">Last Thorough Exam</Label>
                    <Input
                      id="last_thorough_exam"
                      type="date"
                      {...register('last_thorough_exam')}
                    />
                    {errors.last_thorough_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
                    )}
                  </div>
                  

                  {/* Next Test Exam */}
                 
                </div>
                <div className="grid gap-4 grid-cols-1 w-[64%]">
                  <div className="grid grid-cols-[200px_1fr]   items-start gap-4">
                    <Label className='mt-3' htmlFor="next_test_date">Next Test Exam</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input id="next_test_date" defaultValue={
                            equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date
                              ? new Date(equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date).toISOString().split('T')[0]
                              : ''
                          } disabled={testExamChecked} type="date" {...field} />
                        )}
                      />
                      <Checkbox className='w-6 h-6' checked={testExamChecked} onCheckedChange={(checked:boolean) => setTestExamChecked(checked!)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px]  text-[13px] ">
                          {errors.next_test_exam.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4">
                    <Label className='mt-3' htmlFor={"next_thorough_exam"}>Next Thorough Exam</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name={"next_thorough_exam"}
                        control={control}
                        render={({ field }) => (
                          <Input id={"next_thorough_exam"} defaultValue={
                            equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date
                              ? new Date(equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date).toISOString().split('T')[0]
                              : ''
                          } disabled={thoroughExamChecked} type="date" {...field} />
                        )}
                      />
                      <Checkbox className={'w-6 h-6'} checked={thoroughExamChecked} onCheckedChange={(checked:boolean) => setThoroughExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px]    ">
                          {errors.next_thorough_exam.message}
                        </p>
                      )}
                    </div>
                  </div>
                   {
                   
                    equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.property_table_type == 'ELEVATOR CERTIFICATE' && (
                      <div className='grid grid-cols-1 gap-4'>
                  <div className="grid grid-cols-[200px_1fr] gap-4 w-[77%]">
                    <Label htmlFor="lift_location" className="mt-3">Lift Location</Label>
                    <Input id="lift_location" type="text" {...register('lift_location')} />
                    {errors.lift_location && (
                      <p className="text-red-500 text-[12px] ">{errors.lift_location.message}</p>
                    )}
                  </div>
                  </div>
)}
                </div>

                 
                {/* Description Section */}
                <div className="space-y-4">
                  {/* Description */}
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

                  {/* Description of Test */}
                  <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                      <Label htmlFor="description_of_test">description of Test</Label>
                      <div>
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
                          <p className="text-red-500 text-[12px] ">{errors.description_of_test.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <div className="grid gap-4 grid-cols-1  py-4">
                  <div className="grid grid-cols-2  gap-4">

                    {/* Label and Dropdown Section */}
                    <div className="flex ">
                      <Label htmlFor="result" className="mt-3 w-1/2">Result</Label>
                      <Controller
                        name="result"
                        control={control}
                        defaultValue={existingData?.result}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="result">
                              <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="SCRAP">SCRAP</SelectItem>
                            <SelectItem value="SATISFACTORY">SATISFACTORY</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.result && (
                        <p className="text-red-500 text-[12px] mt-1">{errors.result.message}</p>
                      )}
                    </div>

                    {/* Input Section */}
                    <div className="flex flex-col">

                      <Textarea id="result_description" {...register('result_description')} />
                      {errors.result_description && (
                        <p className="text-red-500 text-[12px] mt-1">{errors.result_description.message}</p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Tables Section */}
                <div className="space-y-4">
                  {/* Properties Table */}
                  <div className="grid gap-4 grid-cols-1">
                    <Table data={existingData?.properties} setData={setData} item_type={item_type} />
                  </div>

                  {/* Annexures Table */}
                  <div className="grid gap-4 grid-cols-1">
                    <AnnexuresTable 
                      propertyList={annexureList} 
                      setPropertyList={setAnnexureList} 
                      id={equipment_no} 
                    />
                  </div>
                </div>
                <div className="space-y-4 w-full">
                  <div className="grid gap-4 grid-cols-1 w-full">
                  <div className="grid grid-cols-[400px_1fr]  gap-4">
                    <Label htmlFor="defect_description" className="mt-3 leading-5">Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect:</Label>
                    <Input id="defect_description" className='my-auto' {...register('defect_description')} />
                    {errors.defect_description && (
                      <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                    )}
 
</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                  <div className="grid grid-cols-[400px_1fr]  gap-4">
                    <Label htmlFor="test_particulars" className="mt-3 leading-5">Particulars of any tests carried out as part of the examination</Label>
                    <Input id="test_particulars" className='' {...register('test_particulars')} />
                    {errors.test_particulars && (
                      <p className="text-red-500 text-[12px] ">{errors.test_particulars.message}</p>
                    )}
                     </div>
                  </div>
                </div>
                
                {/* Approval Status */}
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
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.approval_status && (
                    <p className="text-red-500 text-[12px] ">{errors.approval_status.message}</p>
                  )}
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
