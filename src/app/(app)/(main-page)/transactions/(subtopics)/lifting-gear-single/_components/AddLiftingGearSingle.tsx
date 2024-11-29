'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, optional, string, TypeOf, z } from 'zod';
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
import SafetyChecklist from '@/components/safety-checklist';
import { equipmentDataRange, generateEquipmentCertificateHTML } from '@/lib/utils';
import { useSubtopic } from '@/context/SubtopicContext';
import { MasterService } from '@/services/api/masters-service';
import { makeApiCall } from '@/lib/apicaller';
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
  description: string().nonempty('Description Date is required'),
  equipment_description: string().nonempty('Equipment Description is required'),
  manufacturer: string().nonempty('Manufacturer is required'),
  tested_standard: string().nonempty('Tested Standard is required'),
  approval_status: string().nonempty('Approval Status is required'),
});
 
type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { getAllSingleSubtopic, addRecord } = useSubtopic();
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });
  const [testExamChecked, setTestExamChecked] = useState<any>(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState<any>(false);
  const { reset, handleSubmit, control, register, formState: { isSubmitSuccessful, errors } } = methods;
  const [siteOptions, setSiteOptions] = useState<any>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any>([]);
  const [standardOptions, setStandardOptions] = useState<any>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any>([]);
  const [ownerOptions, setOwnerOptions] = useState<any>([])

 const[locationOptions,setLocationOptions] = useState<any>([])
  const { watch, setValue, formState } = methods
  const { equipment_no, standard } = watch()
  
  useEffect(() => {
    if (equipment_no) {
      // Find the associated data for the current equipment_no
      const selectedEquipment = equipmentNoOptions.find((item: any) => item.id == equipment_no);

      if (selectedEquipment) {

        setValue('standard', selectedEquipment.standard || ''); // Update standard
        setValue('manufacturer', String(selectedEquipment.manufacturer) || ''); // Update manufacturer
        setValue('owner_name', String(selectedEquipment.owner_name) || ''); // Update owner
        setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || ''); // Update test cert/coc no
        setValue('safe_working_load', String(selectedEquipment.safe_working_load) || ''); // Update safe working load
        setValue('proof_load', String(selectedEquipment.proof_load) || ''); // Update proof load
        setValue('description', String(selectedEquipment.description) || ''); // Update description
        setValue('equipment_description', String(selectedEquipment.description) || ''); // Update equipment description
        setValue('title', String(selectedEquipment.title) || ''); // Update title
        setValue('standard', String(selectedEquipment.standard) || ''); // Update standard
        setValue('manufacturer', String(selectedEquipment.manufacturer) || ''); // Update manufacturer
        setValue('owner_name', String(selectedEquipment.owner_name) || ''); // Update owner
        
        setValue('last_test_exam', String(selectedEquipment.last_test_date) || ''); // Update last test exam
        setValue('next_test_exam', String(selectedEquipment.next_test_date) || ''); // Update next test exam
        setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || ''); // Update last thorough exam
        setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || ''); // Update next thorough exam
        // Add additional fields here if necessary
      }
    }
  }, [equipment_no, equipmentNoOptions, setValue]);
  const {location} = watch()
  useEffect(() => {
    const fetchSites = async () => {
      const res = locationOptions.filter((item:any ) => item.location.id == location);
 
      
      if (res.length > 0) {
       
        setSiteOptions([res[0].site]); // Set the area options to the fetched data
      }
    };
    fetchSites();
  }, [location, locationOptions]);

  useEffect(() => {
    if (equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date == null) {
      setTestExamChecked(true)
    } else {
      setTestExamChecked(false)
    }
    if (equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date == null) {
      setThoroughExamChecked(true)
    } else {
      setThoroughExamChecked(false)
    }

  }, [equipment_no])
  useEffect(() => {
    const fetchSites = async () => {
      const data = await getAllSingleSubtopic("site"); // Fetch the areas
      if (data) {
      
        setSiteOptions(data); // Set the area options to the fetched data
      }
    };
    fetchSites();
    const fetchSurveyors = async () => {
      const data = await getAllSingleSubtopic("surveyor"); // Fetch the areas
      if (data) {
        setSurveyorOptions(data); // Set the area options to the fetched data
      }
    };
    fetchSurveyors();

    const fetchOwners = async () => {
      const data = await getAllSingleSubtopic('owner')
      if (data) {
        setOwnerOptions(data)
      }
    }
    fetchOwners()
    const fetchAuthorities = async () => {
      const data = await getAllSingleSubtopic("authority"); // Fetch the areas
      if (data) {
        setAuthorityOptions(data); // Set the area options to the fetched data
      }
    };
    fetchAuthorities();

    const fetchJobOrderNos = async () => {
      const data = await getAllSingleSubtopic("job_orders"); // Fetch the areas
      if (data) {
        setJobOrderNoOptions(data); // Set the area options to the fetched data
      }
    };
    fetchJobOrderNos();

    const fetchEquipmentNos = async () => {
      const data = await getAllSingleSubtopic("equipment"); // Fetch the areas
    if (data) {
        setEquipmentNoOptions(data); // Set the area options to the fetched data
      }
    };
    fetchEquipmentNos();

    const fetchStandards = async () => {
      const data = await getAllSingleSubtopic("standard"); // Fetch the areas
      if (data) {
        setStandardOptions(data); // Set the area options to the fetched data
      }
    };
    fetchStandards();

    const fetchManufacturers = async () => {
      const data = await getAllSingleSubtopic("manufacturer"); // Fetch the areas
      if (data) {
        setManufacturerOptions(data); // Set the area options to the fetched data
      }
    };
    fetchManufacturers();
    const fetchLocations = async () => {
      const data = await makeApiCall(()=>new MasterService().getLocationDetails(),{
        afterSuccess: (data:any)=>{
       
          if (data) {
        
          
            setLocationOptions(data); // Set the location options to the fetched data
          }
        }
      })
     
    };
    fetchLocations();
  }, [getAllSingleSubtopic]); // Runs once on component mount

  useEffect(() => {
    if (isSubmitSuccessful) {
      // reset();
    }
  }, [isSubmitSuccessful, reset]);

  const [safetyChecklistValues, setSafetyChecklistValues] = useState({
    firstExamination: 'no',
    sixMonthInterval: 'no',
    twelveMonthInterval: 'no',
    correctInstallation: 'no',
    examinationScheme: 'no',
    exceptionalCircumstances: 'no',
    safeToUse: 'no'
  });

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

      
      await addRecord(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  }, [])
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
              onSubmit={handleSubmit((values) => {
             
                onSubmitHandler(values);
              })}
            >
              <div className="space-y-4 pt-10">

                {/* CERTIFICATE For Lifting Gear Title */}
                <h2 className={"text-base font-bold"}>CERTIFICATE For Lifting Gear</h2>

                <div className={"grid gap-4 grid-cols-2"}>
                  {/* Certificate For Lifting Gear Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspection_date" className="mt-3">Inspection Date</Label>
                    <Input id="inspection_date" type="date" {...register('inspection_date')} />
                    {errors.inspection_date && (
                      <p className="text-red-500 text-[12px] ">{errors.inspection_date.message}</p>
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
                            {siteOptions?.map((site: any) => (
                              <SelectItem key={site.id} value={String(site.id)}>
                                {site?.site}
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
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="type_of_exam" className="mt-3">Type of Exam</Label>
                    <Controller
                      name="type_of_exam"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="type_of_exam">
                            <SelectValue placeholder="Select job order no." />
                          </SelectTrigger>
                          <SelectContent>
                             
                              <SelectItem   value={"Test"}>
                                Test
                              </SelectItem>
                              <SelectItem   value={"Thorough"}>
                                Thorough
                              </SelectItem>
                            
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.job_order_no && (
                      <p className="text-red-500 text-[12px] ">{errors.job_order_no.message}</p>
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
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationOptions?.map((location: any) => (
                              <SelectItem key={location.id} value={String(location?.location?.id)}>
                                {location?.location?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
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
                            <SelectValue placeholder="Select equipment no." />
                          </SelectTrigger>
                          <SelectContent>
                            {equipmentNoOptions?.map((equipment: any) => (
                              <SelectItem key={equipment.id} value={String(equipment.id)}>
                                {equipment?.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.equipment_no && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input id="title" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.title} {...register('title')} />
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>
                </div>
                <section className='grid gap-4 grid-cols-1'>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    <Input id="equipment_description" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.description} {...register('equipment_description')} />
                    {errors.equipment_description && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_description.message}</p>
                    )}
                  </div>
                </section>
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="test_cert_coc_no" className="mt-3">Test Cert/COC No.</Label>
                    <Input id="test_cert_coc_no" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.test_certificate_no} {...register('test_cert_coc_no')} />
                    {errors.test_cert_coc_no && (
                      <p className="text-red-500 text-[12px] ">{errors.test_cert_coc_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
                    <Input id="safe_working_load" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.safe_working_load} {...register('safe_working_load')} />
                    {errors.safe_working_load && (
                      <p className="text-red-500 text-[12px] ">{errors.safe_working_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="proof_load" className="mt-3">Proof Load:</Label>
                    <Input id="proof_load" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.proof_load} {...register('proof_load')} />
                    {errors.proof_load && (
                      <p className="text-red-500 text-[12px] ">{errors.proof_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="standard" className="mt-3">
                      Standard
                    </Label>
                    <Controller
                      name="standard"
                      control={control}
                      render={({ field }) => {
                        // Extract the current standard value based on equipment_no
                        const currentStandard = String(
                          equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.standard
                        );

                        return (
                          <Select
                            value={currentStandard || field.value} // Use field value or fallback to currentStandard
                            onValueChange={(value) => field.onChange(value)} // Update the form's value
                          >
                            <SelectTrigger id="standard">
                              <SelectValue defaultValue={currentStandard || field.value} placeholder="Select standard" />
                            </SelectTrigger>
                            <SelectContent>
                              {standardOptions?.map((standard: any) => (
                                <SelectItem key={standard.id} value={String(standard.id)}>
                                  {standard.standard}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    {errors.standard && (
                      <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">
                      Last Test Exam
                    </Label>
                    <Input
                      id="last_test_exam"
                      type="date"
                      defaultValue={
                        equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_test_date
                          ? new Date(equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_test_date).toISOString().split('T')[0]
                          : ''
                      }
                      {...register('last_test_exam')}
                    />
                    {errors.last_test_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                    )}
                  </div>


                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam" className="mt-3">
                      Last Thorough Exam
                    </Label>
                    <Input
                      id="last_thorough_exam"
                      type="date"
                      defaultValue={
                        equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_thorough_date
                          ? new Date(equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_thorough_date).toISOString().split('T')[0]
                          : ''
                      }
                      {...register('last_thorough_exam')}
                    />
                    {errors.last_thorough_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
                    )}
                  </div>

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
                      <Checkbox className='w-6 h-6' checked={testExamChecked} onCheckedChange={(checked) => setTestExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
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
                      <Checkbox className={'w-6 h-6'} checked={thoroughExamChecked} onCheckedChange={(checked) => setThoroughExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px]  text-[13px] ">
                          {errors.next_thorough_exam.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="nextThoroughExam" className="mt-3">Next Thorough Exam</Label>
                    <Input id="nextThoroughExam" type="date" {...register('nextThoroughExam')} />
                    {errors.nextThoroughExam && (
                      <p className="text-red-500 text-[12px] ">{errors.nextThoroughExam.message}</p>
                    )}
                  </div> */}
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
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.result && (
                      <p className="text-red-500 text-[12px] ">{errors.result.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owners" className="mt-3">
                      Owner Name
                    </Label>
                    <Controller
                      name="owner_name"
                      control={control}
                      render={({ field }) => {
                        // Extract the current owner value based on equipment_no
                        const currentOwner = String(
                          equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.owner_id
                        );

                        return (
                          <Select
                            value={currentOwner || field.value} // Use field value or fallback to currentOwner
                            onValueChange={(value) => field.onChange(value)} // Update the form's value
                          >
                            <SelectTrigger id="owners">
                              <SelectValue defaultValue={currentOwner || field.value} placeholder="Select owner" />
                            </SelectTrigger>
                            <SelectContent>
                              {ownerOptions?.map((owner: any) => (
                                <SelectItem key={owner.id} value={String(owner.id)}>
                                  {owner?.owner}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
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
                    <Input id="tested_standard" {...register('tested_standard')} />
                    {errors.tested_standard && (
                      <p className="text-red-500 text-[12px] ">{errors.tested_standard.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">
                      Manufacturer
                    </Label>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => {
                        // Extract the current manufacturer value based on equipment_no
                        const currentManufacturer = String(
                          equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.manufacturer
                        );

                        return (
                          <Select
                            value={currentManufacturer || field.value} // Use field value or fallback to currentManufacturer
                            onValueChange={(value) => field.onChange(value)} // Update the form's value
                          >
                            <SelectTrigger id="manufacturer">
                              <SelectValue defaultValue={currentManufacturer || field.value} placeholder="Select manufacturer" />
                            </SelectTrigger>
                            <SelectContent>
                              {manufacturerOptions?.map((manufacturer: any) => (
                                <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                                  {manufacturer.manufacturer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    {errors.manufacturer && (
                      <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
                    )}
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

                    <Label htmlFor="defect_description" className="mt-3">Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect:</Label>
                    <Input id="defect_description" {...register('defect_description')} />
                    {errors.defect_description && (
                      <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                    )}

                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">

                    <Label htmlFor="test_particulars" className="mt-3">Particulars of any tests carried out as part of the examination</Label>
                    <Input id="test_particulars" {...register('test_particulars')} />
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
