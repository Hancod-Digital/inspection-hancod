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

import AddOwnerButton from '../../_components/Owner/Owner';
import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
import AddStandardButton from '../../_components/Standard/Standard';
import AddEquipmentButton from '../../_components/Equipments/Equipments';
import AddSiteButton from '../../_components/Site/Site';
import AddLocationButton from '../../_components/Location/Location';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
  const [safetyChecklistValues, setSafetyChecklistValues] = useState({
    firstExamination: 'no',
    sixMonthInterval: 'no',
    twelveMonthInterval: 'no',
    correctInstallation: 'no',
    examinationScheme: 'no',
    exceptionalCircumstances: 'no',
    safeToUse: 'no'
  });
  const { getAllSingleSubtopic, updateRecord, findRecordById } = useSubtopic();

  const [testExamChecked, setTestExamChecked] = useState(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState(false);
  const [lastTestExamChecked, setLastTestExamChecked] = useState(false);
  const [lastThoroughExamChecked, setLastThoroughExamChecked] = useState(false);
  
  // Not Available checkboxes
  const [testExamNotAvailable, setTestExamNotAvailable] = useState(false);
  const [thoroughExamNotAvailable, setThoroughExamNotAvailable] = useState(false);
  const [lastTestExamNotAvailable, setLastTestExamNotAvailable] = useState(false);
  const [lastThoroughExamNotAvailable, setLastThoroughExamNotAvailable] = useState(false);

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
  const existingData = findRecordById(id);

  const [data, setData] = useState<{ [key: string]: string }[]>(existingData.properties); // For Property Table
  const [annexureList, setAnnexureList] = useState<any[]>([]); // For Annexures Table

  // For re-fetching after add
  const [invoke, setInvoke] = useState(false);
  const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  const [isStandardTyping, setIsStandardTyping] = useState(false);
  // Remove next_test_exam_certificate_no and next_thorough_exam_certificate_no from schema
  const equipmentDetailsSchema = object({
    inspection_date: string().nonempty('Inspection Date is required'),
    site: string().nonempty('Site is required'),
    year_of_manufacture: string().nonempty('Year of Manufacture is required'),
    authority: string().nonempty('Authority is required'),
    standard: string().nonempty('Standard is required'),
    type_of_exam: string().nonempty('Type of Exam is required'),
    description_of_test: string().optional(),
    job_order_no: string().nonempty('Job Order No. is required'),
    // test_particulars: string().nonempty('Test Particulars is required'),
    defect_description: string().nonempty('Defect Description is required'),
    equipment_no: string().nonempty('Equipment No. is required'),
    lift_location: string()
      .optional()
      .nullable(),
    last_test_exam_certificate_no: string().optional(),
    // next_test_exam_certificate_no: testExamChecked ? string().optional() : string().nonempty('Next Test Exam Certificate No. is required'),
    last_thorough_exam_certificate_no: string().optional() ,
    // next_thorough_exam_certificate_no: thoroughExamChecked ? string().optional() : string().nonempty('Next Thorough Exam Certificate No. is required'),
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
    //  tested_standard: string().nonempty('Tested Standard is required'),
    approval_status: string().nonempty('Approval Status is required'),
    location: string().nonempty('Location is required'),
    serial_no: string().nonempty('Serial No. is required'),
    owner_id: string().nonempty('Owner ID is required')
  });

  type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

  // --- Fix: Track select defaults for standard, manufacturer, owner ---
  // We'll use useEffect to set the default values for these fields after options are loaded

  // Track when options are loaded
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  // Fetch all select options on component mount
  const [item_type, setItem_type] = useState<any>("");
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          authorities,
          jobOrders,
          equipmentNos,
          standards,
          manufacturers,
          surveyors,
          owners
        ] = await Promise.all([
          // getAllSingleSubtopic("site"),
          getAllSingleSubtopic("authority"),
          getAllSingleSubtopic("job_orders"),
          getAllSingleSubtopic("equipment"),
          getAllSingleSubtopic("standard"),
          getAllSingleSubtopic("manufacturer"),
          getAllSingleSubtopic("surveyor"),
          getAllSingleSubtopic("owner"),
          makeApiCall(() => new MasterService().getLocationDetails(), {
            afterSuccess: (data: any) => setLocationOptions(data.filter((item: any) => item.location.status === "ACTIVE")),
          }),
        ]);

        setAuthorityOptions(authorities?.filter((item: any) => item.status === "ACTIVE") || []);
        setJobOrderNoOptions(jobOrders || []);
        setEquipmentNoOptions(equipmentNos?.filter((item: any) => item.status === "ACTIVE") || []);
        setStandardOptions(standards?.filter((item: any) => item.status === "ACTIVE") || []);
        setManufacturerOptions(manufacturers?.filter((item: any) => item.status === "ACTIVE") || []);
        setSurveyorOptions(surveyors || []);
        setOwnerOptions(owners?.filter((item: any) => item.status == "ACTIVE") || []);
        setOptionsLoaded(true);
      } catch (error) {
        console.error("Error fetching select options:", error);
        toastWithTimeout(ToastVariant.Error, "Failed to load form options.");
      }
    };

    fetchOptions();
    // eslint-disable-next-line
  }, [invoke]);

  // --- End Fix: Track select defaults for standard, manufacturer, owner ---

  // Get existingData after options are loaded
  // (existingData is not async, but we want to set select defaults after options are loaded)
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: existingData ? {
      inspection_date: existingData.inspection_date || '',
      site: String(existingData.site) || '',
      lift_location: existingData.lift_location || '',
      authority: String(existingData.authority) || '',
      standard: existingData.standard ? String(existingData.standard) : '',
      last_test_exam_certificate_no: existingData.last_test_exam_certificate_no || '',
      last_thorough_exam_certificate_no: existingData.last_thorough_exam_certificate_no || '',
      type_of_exam: existingData.type_of_exam || '',
      description_of_test: existingData.description_of_test || '',
      job_order_no: String(existingData.job_order_no) || '',
      equipment_no: String(existingData.equipment_no) || '',
      title: existingData.title || '',
      model_no: existingData?.model_no || '',
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
      description: existingData.description || '',
      equipment_description: existingData.equipment_description || '',
      manufacturer: existingData.manufacturer ? String(existingData.manufacturer) : '',
      registration_no: existingData.registration_no || '',
      approval_status: existingData.approval_status == 'true' ? "Approved" : "Rejected",
      location: String(existingData.location) || '',
      serial_no: existingData.serial_no || '',
      owner_id: existingData.owner_id ? String(existingData.owner_id) : '',
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
  const equipmentNoChanged = (value: string, field: any) => {
    // console.log("Selected equipment no:", value)
    const selectedEquipment = equipmentNoOptions.find((item) => item.id == value);

    setItem_type(selectedEquipment?.property_table_type);

    if (selectedEquipment) {
      // Set standard if available in options
      if (selectedEquipment.standard) {
        const stdId = String(selectedEquipment.standard);
        const found = standardOptions.find((s: any) => String(s.id) === stdId);
        setValue('standard', found ? stdId : selectedEquipment.standard);
      }
      // Set manufacturer if available in options
      if (selectedEquipment.manufacturer) {
        const manuId = String(selectedEquipment.manufacturer);
        const found = manufacturerOptions.find((m: any) => String(m.id) === manuId);
        setValue('manufacturer', found ? manuId : selectedEquipment.manufacturer);
      }
      setValue('year_of_manufacture', String(selectedEquipment.year_of_manufacture) || '');
      setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || '');
      setValue('safe_working_load', String(selectedEquipment.safe_working_load) || '');

      setValue('equipment_description', String(selectedEquipment.description) || '');
      setValue('title', String(selectedEquipment.title) || '');
      setValue('last_test_exam_certificate_no', selectedEquipment.last_test_exam_certificate_no ? String(selectedEquipment.last_test_exam_certificate_no) : '');
      setValue('last_thorough_exam_certificate_no', selectedEquipment.last_thorough_exam_certificate_no ? String(selectedEquipment.last_thorough_exam_certificate_no) : '');

      // Set owner_name and owner_id if available in options
      if (selectedEquipment.owner_id) {
        const ownerId = String(selectedEquipment.owner_id);
        const found = ownerOptions.find((o: any) => String(o.id) === ownerId);
        setValue('owner_id', found ? ownerId : selectedEquipment.owner_id);
        setValue('owner_name', String(ownerOptions.find((item: any) => String(item.id) === ownerId)?.code) || '');
      }

      setValue('registration_no', String(selectedEquipment.registration_no) || '');
      setValue('last_test_exam', String(selectedEquipment.last_test_date) || '');
      setValue('next_test_exam', String(selectedEquipment.next_test_date) || '');
      setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || '');
      setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || '');
      setValue('serial_no', String(selectedEquipment.serial_no) || '');
      setValue('model_no', String(selectedEquipment.model_no) || '');
    }
    field.onChange(value)
  }
  // --- Fix: Set select defaults for standard, manufacturer, owner after options loaded ---
  useEffect(() => {
    if (!existingData) return;
    if (!optionsLoaded) return;

    // Set standard
    if (existingData.standard) {
      const stdId = String(existingData.standard);
      const found = standardOptions.find((s: any) => String(s.id) === stdId);
      if (found) setValue('standard', stdId);
    }

    // Set manufacturer
    if (existingData.manufacturer) {
      const manuId = String(existingData.manufacturer);
      const found = manufacturerOptions.find((m: any) => String(m.id) === manuId);
      if (found) setValue('manufacturer', manuId);
    }

    // Set owner_id
    if (existingData.owner_id) {
      const ownerId = String(existingData.owner_id);
      const found = ownerOptions.find((o: any) => String(o.id) === ownerId);
      if (found) setValue('owner_id', ownerId);
    }
    // eslint-disable-next-line
  }, [optionsLoaded, existingData, setValue, standardOptions, manufacturerOptions, ownerOptions]);
  // --- End Fix ---

  const handleSafetyChecklistChange = (name: string, value: string) => {
    setSafetyChecklistValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  // Handle equipment_no changes to set related fields
  // useEffect(() => {
  //   if (equipment_no && equipmentNoOptions.length > 0) {
      
  //   }
  //   // eslint-disable-next-line
  // }, [
  //   equipment_no,
  //   invoke,
  //   standardOptions,
  //   manufacturerOptions,
  //   ownerOptions,
  //   setValue,
  //   equipmentNoOptions
  // ]);

  useEffect(() => {
    if (job_order_no) {
      const job_order = jobOrderNoOptions.find((item: any) => item.id == job_order_no);

      if (job_order) {
        setValue('surveyor', job_order.surveyor)
        setValue('location', job_order.location)
      }
    }
    // eslint-disable-next-line
  }, [job_order_no])
  // Handle checkboxes to disable date inputs
  useEffect(() => {
    // console.log("equipment_no", existingData)
     if (existingData) {
      // console.log("selectedEquipment", existingData)
      // Last Test Exam
      if (existingData.last_test_exam === "Not Applicable") {
        setLastTestExamChecked(true);
        setLastTestExamNotAvailable(false);
      } else if (existingData.last_test_exam === "Not Available") {
        // console.log("last_test_date", existingData.last_test_exam)
        setLastTestExamNotAvailable(true);
        setLastTestExamChecked(false);
      } else {
        // console.log("last_test_date", existingData.last_test_exam)
        setLastTestExamChecked(false);
        setLastTestExamNotAvailable(false);
      }
      
      // Last Thorough Exam
      if (existingData.last_thorough_exam === "Not Applicable") {
        setLastThoroughExamChecked(true);
        setLastThoroughExamNotAvailable(false);
      } else if (existingData.last_thorough_exam === "Not Available") {
        setLastThoroughExamNotAvailable(true);
        setLastThoroughExamChecked(false);
      } else {
        setLastThoroughExamChecked(false);
        setLastThoroughExamNotAvailable(false);
      }
      
      // Next Test Exam
      if (existingData.next_test_exam === "Not Applicable") {
        setTestExamChecked(true);
        setTestExamNotAvailable(false);
      } else if (existingData.next_test_exam === "Not Available") {
        setTestExamNotAvailable(true);
        setTestExamChecked(false);
      } else {
        setTestExamChecked(false);
        setTestExamNotAvailable(false);
      }
      
      // Next Thorough Exam
      if (existingData.next_thorough_exam === "Not Applicable") {
        setThoroughExamChecked(true);
        setThoroughExamNotAvailable(false);
      } else if (existingData.next_thorough_exam === "Not Available") {
        setThoroughExamNotAvailable(true);
        setThoroughExamChecked(false);
      } else {
        setThoroughExamChecked(false);
        setThoroughExamNotAvailable(false);
      }
    }
  }, [equipment_no, equipmentNoOptions]);

  // Fetch site options based on location
  useEffect(() => {
    const fetchSites = async () => {
      const res = locationOptions.filter((item: any) => String(item.location.id) === watch('location'));

      if (res.length > 0) {
        setSiteOptions(res.map((item) => item?.site));
      }
    };
    fetchSites();
    // eslint-disable-next-line
  }, [watch('location'), locationOptions]);

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

        next_test_exam: testExamChecked ? "Not Applicable" : (testExamNotAvailable ? "Not Available" : values.next_test_exam),
        next_thorough_exam: thoroughExamChecked ? "Not Applicable" : (thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam),
        last_test_exam: lastTestExamChecked ? "Not Applicable" : (lastTestExamNotAvailable ? "Not Available" : values.last_test_exam),
        last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : (lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam),
        // Set certificate numbers to empty string when dates are Not Applicable or Not Available
        last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? '' : values.last_test_exam_certificate_no,
        last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? '' : values.last_thorough_exam_certificate_no,
        approval_status: values.approval_status === "Approved" ? true : false,

        properties: data,
        annexures: annexureList,
      };

      // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      // console.log({ ...formData, properties: data, annexures: propertyList }) 
      // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      await updateRecord(id, { ...formData, properties: data, annexures: propertyList });
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
  console.log("erros", errors)
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

                  {/* Location (with Add) */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <div className="flex items-center gap-2 relative">
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
                      <AddLocationButton />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
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

                  {/* Site (with Add) */}
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <div className="flex items-center gap-2 relative">
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
                                  {site.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <AddSiteButton />
                    </div>
                    {errors.site && (
                      <p className="text-red-500 text-[12px] ">{errors.site.message}</p>
                    )}
                  </div> */}
                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment No. (with Add) */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
                    <div className="flex items-center gap-2 relative">
                      <Controller
                        name="equipment_no"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={(value) => equipmentNoChanged(value, field)} value={field.value}>
                            <SelectTrigger id="equipment_no">
                              <SelectValue placeholder="Select equipment no." />
                            </SelectTrigger>
                            <SelectContent>
                              {equipmentNoOptions?.map((eq: any) => (
                                <SelectItem key={eq.id} value={String(eq.id)}>
                                  {eq.equipment_no}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <AddEquipmentButton />
                    </div>
                    {errors.equipment_no && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                    )}
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
                  {/* Owner No/ID */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_name" className="mt-3">Owner No/ID</Label>
                    <Input id="owner_name" {...register('owner_name')} />
                    {errors.owner_name && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
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
                  {/* Manufacturer (Add and Type) */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => {
                        const allManufacturerOptions = manufacturerOptions?.map((manu: any) => String(manu.id)) || [];
                        // Fix: Use field.value directly, don't override with "" if not found
                        return (
                          <div className="flex items-center gap-2 relative">
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="manufacturer">
                                <SelectValue
                                  placeholder="Select or type manufacturer"
                                  {...(allManufacturerOptions.includes(field.value)
                                    ? {}
                                    : { children: field.value ? field.value : undefined })}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="px-2 py-1 relative">
                                  <Input
                                    className="mt-2"
                                    placeholder="Type manufacturer name"
                                    value={!isManufacturerTyping ? field.value : ""}
                                    onChange={e => {
                                      setIsManufacturerTyping(true);
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute bg-primary text-white font-bold right-2 top-3 px-2 py-1"
                                    onClick={async () => {
                                      setIsManufacturerTyping(false);
                                      if (!field.value) return;
                                      await makeApiCall(
                                        () => new MasterService().addManufacturer({ manufacturer: field.value }),
                                        {
                                          afterSuccess: (data: any) => {
                                            setInvoke((prev) => !prev);
                                            toastWithTimeout(ToastVariant.Success, "Manufacturer added successfully");
                                            if (data && data.id) {
                                              field.onChange(String(data.id));
                                            } else {
                                              field.onChange("");
                                            }
                                          }
                                        }
                                      );
                                    }}
                                    type="button"
                                  >
                                    Add
                                  </Button>
                                </div>
                                {manufacturerOptions?.map((manu: any) => (
                                  <SelectItem key={manu.id} value={String(manu.id)}>
                                    {manu.manufacturer}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <AddManufacturerButton />
                          </div>
                        );
                      }}
                    />
                    {errors.manufacturer && (
                      <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
                    )}
                  </div>
                  {/* Year of Manufacture */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="year_of_manufacture" className="mt-3">Year of Manufacture</Label>
                    <Input id="year_of_manufacture" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.year_of_manufacture} {...register('year_of_manufacture')} />
                    {errors.year_of_manufacture && (
                      <p className="text-red-500 text-[12px] ">{errors.year_of_manufacture.message}</p>
                    )}
                  </div>
                  {/* Reg No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="registration_no" className="mt-3">Reg No.</Label>
                    <Input id="registration_no" {...register('registration_no')} />
                    {errors.registration_no && (
                      <p className="text-red-500 text-[12px] ">{errors.registration_no.message}</p>
                    )}
                  </div>
                  {/* Standard (Add and Type) */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="standard" className="mt-3">Standard</Label>
                    <Controller
                      name="standard"
                      control={control}
                      render={({ field }) => {
                        const allStandardOptions = standardOptions?.map((std: any) => String(std.id)) || [];
                        // Fix: Use field.value directly, don't override with "" if not found
                        return (
                          <div className="flex items-center gap-2 relative">
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="standard">
                                <SelectValue
                                  placeholder="Select or type standard"
                                  {...(allStandardOptions.includes(field.value)
                                    ? {}
                                    : { children: field.value ? field.value : undefined })}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="px-2 py-1 relative">
                                  <Input
                                    className="mt-2"
                                    placeholder="Type standard name"
                                    value={!isStandardTyping ? field.value : ""}
                                    onChange={e => {
                                      setIsStandardTyping(true);
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute bg-primary text-white font-bold right-2 top-3 px-2 py-1"
                                    onClick={async () => {
                                      setIsStandardTyping(false);
                                      if (!field.value) return;
                                      await makeApiCall(
                                        () => new MasterService().addStandard({ standard: field.value }),
                                        {
                                          afterSuccess: (data: any) => {
                                            setInvoke((prev) => !prev);
                                            toastWithTimeout(ToastVariant.Success, "Standard added successfully");
                                            if (data && data.id) {
                                              field.onChange(String(data.id));
                                            } else {
                                              field.onChange("");
                                            }
                                          }
                                        }
                                      );
                                    }}
                                    type="button"
                                  >
                                    Add
                                  </Button>
                                </div>
                                {standardOptions?.map((std: any) => (
                                  <SelectItem key={std.id} value={String(std.id)}>
                                    {std.standard}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <AddStandardButton />
                          </div>
                        );
                      }}
                    />
                    {errors.standard && (
                      <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                    )}
                  </div>
                  {/* Safe Working Load */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
                    <Input id="safe_working_load" {...register('safe_working_load')} />
                    {errors.safe_working_load && (
                      <p className="text-red-500 text-[12px] ">{errors.safe_working_load.message}</p>
                    )}
                  </div>
                  {/* Owner Name (Add and Type) */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_id" className="mt-3">Owner Name</Label>
                    <Controller
                      name="owner_id"
                      control={control}
                      render={({ field }) => {
                        // Fix: Use field.value directly, don't override with "" if not found
                        const allOwnerOptions = ownerOptions?.map((owner: any) => String(owner.id)) || [];
                        return (
                          <div className="flex w-full gap-2 items-center relative">
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => field.onChange(val)}
                            >
                              <SelectTrigger id="owner_id" className="w-full">
                                <SelectValue
                                  placeholder="Select or type owner"
                                  {...(allOwnerOptions.includes(field.value)
                                    ? {}
                                    : { children: field.value ? field.value : undefined })}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="px-2 py-1 relative">
                                  <Input
                                    className="mt-2"
                                    placeholder="Type owner name"
                                    value={!isOwnerTyping ? field.value : ""}
                                    onChange={e => {
                                      setIsOwnerTyping(true);
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute bg-primary text-white font-bold right-2 top-3 px-2 py-1"
                                    onClick={() => {
                                      setIsOwnerTyping(false);
                                      if (!field.value) return;
                                      makeApiCall(
                                        () => new MasterService().addOwner({ owner: field.value }),
                                        {
                                          afterSuccess: () => {
                                            setInvoke(!invoke);
                                            toastWithTimeout(ToastVariant.Success, "Owner added successfully")
                                            field.onChange("");
                                          }
                                        }
                                      )
                                    }}
                                    type="button"
                                  >
                                    Add
                                  </Button>
                                </div>
                                {ownerOptions?.map((owner: any) => (
                                  <SelectItem key={owner.id} value={String(owner.id)}>
                                    {owner.owner}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <AddOwnerButton />
                          </div>
                        );
                      }}
                    />
                    {errors.owner_name && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
                    )}
                  </div>
                  {/* Surveyor */}
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
                            {surveyorOptions.map((surveyor: any) => (
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
                  {/* Last Test Exam */}
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label className="mt-3" htmlFor="last_test_exam">
                      Date of last proof load test
                    </Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="last_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="last_test_exam"
                            type="date"
                            disabled={lastTestExamChecked || lastTestExamNotAvailable}
                            {...field}
                          />
                        )}
                      />
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastTestExamChecked}
                        onCheckedChange={(checked: boolean) => {
                          setLastTestExamChecked(checked);
                          if (checked) setLastTestExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Applicable</span>
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastTestExamNotAvailable}
                        onCheckedChange={(checked: boolean) => {
                          setLastTestExamNotAvailable(checked);
                          if (checked) setLastTestExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Available</span>
                    </div>
                    {errors.last_test_exam && (
                      <p className="text-red-500 text-[12px]">
                        {errors.last_test_exam.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam_certificate_no" className="mt-3">
                      Last Test Certificate No.
                    </Label>
                    <Input
                      disabled={lastTestExamChecked || lastTestExamNotAvailable}
                      id="last_test_exam_certificate_no"
                      {...register('last_test_exam_certificate_no')}
                    />
                  </div>
                  {/* Last Thorough Exam */}
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label className="mt-3" htmlFor="last_thorough_exam">
                      Date of last examination
                    </Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="last_thorough_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="last_thorough_exam"
                            type="date"
                            disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                            {...field}
                          />
                        )}
                      />
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastThoroughExamChecked}
                        onCheckedChange={(checked: boolean) => {
                          setLastThoroughExamChecked(checked);
                          if (checked) setLastThoroughExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Applicable</span>
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastThoroughExamNotAvailable}
                        onCheckedChange={(checked: boolean) => {
                          setLastThoroughExamNotAvailable(checked);
                          if (checked) setLastThoroughExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Available</span>
                    </div>
                    {errors.last_thorough_exam && (
                      <p className="text-red-500 text-[12px]">
                        {errors.last_thorough_exam.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam_certificate_no" className="mt-3">
                      Last Thorough Certificate No.
                    </Label>
                    <Input
                      disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                      id="last_thorough_exam_certificate_no"
                      {...register('last_thorough_exam_certificate_no')}
                    />
                  </div>
                </div>
                {/* Next Test Exam, Next Thorough Exam, Elevator Certificate, etc. */}
                <div className="grid gap-4 grid-cols-1 w-[64%]">
                  <div className="grid grid-cols-[200px_1fr]   items-start gap-4">
                    <Label className='mt-3' htmlFor="next_test_date">Date of next proof load test </Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input id="next_test_date" defaultValue={
                            equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date
                              ?
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date
                              : ''
                          } disabled={testExamChecked || testExamNotAvailable} type="date" {...field} />
                        )}
                      />
                      <Checkbox 
                        className='w-6 h-6' 
                        checked={testExamChecked} 
                        onCheckedChange={(checked: boolean) => {
                          setTestExamChecked(checked);
                          if (checked) setTestExamNotAvailable(false);
                        }} 
                      /> 
                      <span className="text-[13px] w-[15%] ">Not Applicable</span>
                      <Checkbox 
                        className='w-6 h-6' 
                        checked={testExamNotAvailable} 
                        onCheckedChange={(checked: boolean) => {
                          setTestExamNotAvailable(checked);
                          if (checked) setTestExamChecked(false);
                        }} 
                      /> 
                      <span className="text-[13px] w-[15%] ">Not Available</span>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px]  text-[13px] ">
                          {errors.next_test_exam.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Removed Next Test Certificate No. */}
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4 ">
                    <Label htmlFor="next_test_exam_certificate_no" className="mt-3">
                      Next Test Certificate No.
                    </Label>
                    <Input
                      id="next_test_exam_certificate_no"
                      disabled={testExamChecked}
                      className='w-[68%]'
                      {...register('next_test_exam_certificate_no')}
                    />
                  </div> */}
                  <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4">
                    <Label className='mt-3' htmlFor={"next_thorough_exam"}>Date of next examination </Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name={"next_thorough_exam"}
                        control={control}
                        render={({ field }) => (
                          <Input id={"next_thorough_exam"} defaultValue={
                            equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date
                              ?
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date
                              : ''
                          } disabled={thoroughExamChecked || thoroughExamNotAvailable} type="date" {...field} />
                        )}
                      />
                      <Checkbox 
                        className={'w-6 h-6'} 
                        checked={thoroughExamChecked} 
                        onCheckedChange={(checked: boolean) => {
                          setThoroughExamChecked(checked);
                          if (checked) setThoroughExamNotAvailable(false);
                        }} 
                      /> 
                      <span className="text-[13px] w-[15%] ">Not Applicable</span>
                      <Checkbox 
                        className={'w-6 h-6'} 
                        checked={thoroughExamNotAvailable} 
                        onCheckedChange={(checked: boolean) => {
                          setThoroughExamNotAvailable(checked);
                          if (checked) setThoroughExamChecked(false);
                        }} 
                      /> 
                      <span className="text-[13px] w-[15%] ">Not Available</span>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px]    ">
                          {errors.next_thorough_exam.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Removed Next Thorough Certificate No. */}
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="next_thorough_exam_certificate_no" className="mt-3">
                      Next Thorough Certificate No.
                    </Label>
                    <Input
                      id="next_thorough_exam_certificate_no"
                      disabled={thoroughExamChecked}
                      className='w-[68%]'
                      {...register('next_thorough_exam_certificate_no')}
                    />
                  </div> */}
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
                    )
                  }
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
                  {equipmentNoOptions.find((item) => item.id == equipment_no)?.item_type !== 'Lifting Accessories' && equipmentNoOptions.find((item) => item.id == existingData?.equipment_no)?.property_table_type != "EARTH MOVING EQUIPMENTS" && (
                    <div className="grid gap-4 grid-cols-1">
                      <Table data={existingData?.properties} setData={setData} item_type={equipmentNoOptions.find((item) => item.id == existingData?.equipment_no)?.property_table_type} />
                    </div>
                  )}
                  {/* Annexures Table */}
                  <div className="grid gap-4 grid-cols-1">
                    <AnnexuresTable
                      propertyList={existingData?.annexures}
                      setPropertyList={setAnnexureList}
                      id={equipment_no}
                    />
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
                <div className="space-y-4 w-full">
                  <div className="grid gap-4 grid-cols-1 w-full">
                    <div className="grid grid-cols-[400px_1fr]  gap-4">
                      <Label htmlFor="defect_description" className="mt-3 leading-5">Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect:</Label>
                      <Input  maxLength={40} id="defect_description" className='my-auto' {...register('defect_description')} />
                      {errors.defect_description && (
                        <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
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
