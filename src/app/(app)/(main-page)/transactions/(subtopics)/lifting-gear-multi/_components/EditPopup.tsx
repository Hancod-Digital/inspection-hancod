'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { z, object, string, TypeOf, optional } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import Table from './AnnexureTable';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import 'react-quill/dist/quill.snow.css';
import AddOwnerButton from '../../_components/Owner/Owner';
import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
import AddStandardButton from '../../_components/Standard/Standard';
import AddEquipmentButton from '../../_components/Equipments/Equipments';
// import AddSiteButton from '../../_components/Site/Site';
import AddLocationButton from '../../_components/Location/Location';
// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
 
// Define schema for validation

interface EquipmentDetailsEditFormProps {
  onClose: () => void;
  id: number; // ID of the equipment record to edit
}

export default function EquipmentDetailsEditForm({ onClose, id }: EquipmentDetailsEditFormProps) {
  const [loading, setLoading] = useState(false);
  const { getAllSingleSubtopic, findRecordById, updateRecord } = useSubtopic();
  const [testExamChecked, setTestExamChecked] = useState<boolean>(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState<boolean>(false);
  const [lastTestExamChecked, setLastTestExamChecked] = useState<boolean>(false);
  const [lastThoroughExamChecked, setLastThoroughExamChecked] = useState<boolean>(false);
  const [testExamNotAvailable, setTestExamNotAvailable] = useState<boolean>(false);
  const [thoroughExamNotAvailable, setThoroughExamNotAvailable] = useState<boolean>(false);
  const [lastTestExamNotAvailable, setLastTestExamNotAvailable] = useState<boolean>(false);
  const [lastThoroughExamNotAvailable, setLastThoroughExamNotAvailable] = useState<boolean>(false);

  const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
    const [isOwnerTyping, setIsOwnerTyping] = useState(false);
    const [isStandardTyping, setIsStandardTyping] = useState(false);


  const [invoke, setInvoke] = useState(false);
  const currentData = id ? findRecordById(id) : null;
  console.log("Current data for edit:", currentData)
  const equipmentDetailsSchema = object({
    inspection_date: string().nonempty('Inspection Date is required'),
    // site: string().nonempty('Site is required'),
    authority: string().nonempty('Authority is required'),
    type_of_exam: string().nonempty('Type of Exam is required'),
    job_order_no: string().nonempty('Job Order No. is required'),
    location: string().nonempty('Location is required'),
    equipment_no: string().nonempty('Equipment No. is required'),
    title: string().nonempty('Title is required'),
    test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
    safe_working_load: string().nonempty('Safe Working Load is required'),
    proof_load: string().nonempty('Proof Load is required'),
    standard: string().nonempty('Standard is required'),
    last_test_exam: string().optional(),
    next_test_exam: string().optional(),
    last_thorough_exam: string().optional(),
    next_thorough_exam: string().optional(),
    last_test_exam_certificate_no: string().optional(),
    // next_test_exam_certificate_no: testExamChecked ? string().optional() : string().nonempty('Next Test Exam Certificate No. is required'),
    last_thorough_exam_certificate_no: string().optional(),
    // next_thorough_exam_certificate_no: thoroughExamChecked ? string().optional() : string().nonempty('Next Thorough Exam Certificate No. is required'),

    result: string().nonempty('Result is required'),
    surveyor: string().nonempty('Surveyor is required'),
    defect_description: string().nonempty('Defect Description is required'),
    //test_particulars: string().nonempty('Test Particulars is required'),
    owner_name: string().nonempty('Owner Name is required'),
    description: string().nonempty('Description is required'),
    equipment_description: string().nonempty('Equipment Description is required'),
    manufacturer: string().nonempty('Manufacturer is required'),
    //  tested_standard: string().nonempty('Tested Standard is required'),
    approval_status: string().nonempty('Approval Status is required'),
  });

  type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      inspection_date: String(currentData?.inspection_date) || '',
      // site: String(currentData?.site) || '',
      authority: String(currentData?.authority) || '',
      type_of_exam: currentData?.type_of_exam || '',
      job_order_no: String(currentData?.job_order_no) || '',
      location: String(currentData?.location) || '',
      equipment_no: String(currentData?.equipment_no) || '',
      title: currentData?.title || '',
      test_cert_coc_no: currentData?.test_cert_coc_no || '',
      safe_working_load: currentData?.safe_working_load || '',
      proof_load: currentData?.proof_load || '',
      standard: String(currentData?.standard) || '',
      last_test_exam: currentData?.last_test_exam || '',
      next_test_exam: currentData?.next_test_exam || '',
      last_thorough_exam: currentData?.last_thorough_exam || '',
      next_thorough_exam: currentData?.next_thorough_exam || '',
      result: String(currentData?.result) || '',
      surveyor: String(currentData?.surveyor) || '',
      defect_description: currentData?.defect_description || '',
      //test_particulars: currentData?.test_particulars || '',
      owner_name: String(currentData?.owner_name) || '',
      description: currentData?.description || '',
      equipment_description: currentData?.equipment_description || '',
      manufacturer: String(currentData?.manufacturer) || '',
      //    tested_standard: currentData?.tested_standard || '',
      approval_status: currentData?.approval_status == 'true' ? 'Approved' : 'Rejected',
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
  console.log("errors:", errors)
  const equipmentNoChanged = (value: string, field: any) => {
    console.log("Selected equipment no:", value)
    const selectedEquipment = equipmentNoOptions.find((item) => item.id == value);

      if (selectedEquipment) {
        setValue('standard', String(selectedEquipment.standard) || '');
        setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
        setValue('owner_name', String(selectedEquipment.owner_id) || '');
        setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || '');
        setValue('safe_working_load', String(selectedEquipment.safe_working_load) || '');
        setValue('proof_load', String(selectedEquipment.proof_load) || '');

        setValue('equipment_description', String(selectedEquipment.description) || '');
        setValue('title', String(selectedEquipment.title) || '');
        setValue('last_test_exam', String(selectedEquipment.last_test_date) || '');
        setValue('next_test_exam', String(selectedEquipment.next_test_date) || '');
        setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || '');
        setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || '');
      }
    
    field.onChange(value)
  }
  // const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any[]>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any[]>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any[]>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any>([]);
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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const deleteRecord = async (id: number) => {
    await makeApiCall(() => new MasterService().deleteMultiEquipment(id), {
      afterSuccess: () => {
        setExistingData(existingData.filter(item => item.id != id));
        toastWithTimeout(ToastVariant.Default, 'Equipment deleted successfully')
      }
    })
  }
  // Fetch existing equipment data
  useEffect(() => {
    const fetchEquipmentData = async () => {
      const data = await findRecordById(id);
      console.log("Fetched equipment data for edit:", data)
      console.log("Full data object:", JSON.stringify(data));
      console.log("Standard exists:", data?.hasOwnProperty('standard'), "Value:", data?.standard);
      console.log("Standard type:", typeof data?.standard, "Value:", data?.standard);


      if (data) {
        console.log("standard:", data.standard)
        // Populate form fields with existing data
        reset({
          inspection_date: String(data.inspection_date) || '',
          // site: String(data.site) || '',
          authority: String(data.authority) || '',
          type_of_exam: data.type_of_exam || '',
          job_order_no: String(data.job_order_no) || '',
          location: String(data.location) || '',
          equipment_no: String(data.equipment_no) || '',
          title: data.title || '',
          test_cert_coc_no: data.test_cert_coc_no || '',
          safe_working_load: data.safe_working_load || '',
          proof_load: data.proof_load || '',
          standard: String(data.standard) || '',
          // last_test_exam: data.last_test_exam || '',
          // next_test_exam: data.next_test_exam || '',
          // last_thorough_exam: data.last_thorough_exam || '',
          // next_thorough_exam: data.next_thorough_exam || '',
          result: String(data.result) || '',
          surveyor: String(data.surveyor) || '',
          last_test_exam_certificate_no: data.last_test_exam_certificate_no || '',
          // next_test_exam_certificate_no: data.next_test_exam_certificate_no || '',
          last_thorough_exam_certificate_no: data.last_thorough_exam_certificate_no || '',
          // next_thorough_exam_certificate_no: data.next_thorough_exam_certificate_no || '',
          defect_description: data.defect_description || '',
          //test_particulars: data.test_particulars || '',
          owner_name: String(data.owner_name) || '',
          description: data.description || '',
          equipment_description: data.equipment_description || '',
          manufacturer: "115" || '',
          //  tested_standard: data.tested_standard || '',
          approval_status: data.approval_status == 'true' ? 'Approved' : 'Rejected',
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

        // Handle "Not Applicable" and "Not Available" checkboxes
        setTestExamChecked(!data.next_test_exam || data.next_test_exam === "Not Applicable");
        setTestExamNotAvailable(data.next_test_exam === "Not Available");
        
        setThoroughExamChecked(!data.next_thorough_exam || data.next_thorough_exam === "Not Applicable");
        setThoroughExamNotAvailable(data.next_thorough_exam === "Not Available");
        
        setLastTestExamChecked(!data.last_test_exam || data.last_test_exam === "Not Applicable");
        setLastTestExamNotAvailable(data.last_test_exam === "Not Available");
        
        setLastThoroughExamChecked(!data.last_thorough_exam || data.last_thorough_exam === "Not Applicable");
        setLastThoroughExamNotAvailable(data.last_thorough_exam === "Not Available");
        
      }
    };

    fetchEquipmentData();
  }, [id, findRecordById, reset]);

  // Fetch select options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      const [authorities, jobOrders, equipments, standards, manufacturers, surveyors, owners] = await Promise.all([
        // getAllSingleSubtopic("site"),
        getAllSingleSubtopic("authority"),
        getAllSingleSubtopic("job_orders"),
        getAllSingleSubtopic("equipment"),
        getAllSingleSubtopic("standard"),
        getAllSingleSubtopic("manufacturer"),
        getAllSingleSubtopic("surveyor"),
        getAllSingleSubtopic("owner")
      ]);

      // setSiteOptions(sites?.filter((item:any)=>item.status==="ACTIVE") || []);
      setAuthorityOptions(authorities?.filter((item: any) => item.status === "ACTIVE") || []);
      setJobOrderNoOptions(jobOrders || []);
      setEquipmentNoOptions(equipments?.filter((item: any) => item.status === "ACTIVE") || []);
      setStandardOptions(standards?.filter((item: any) => item.status === "ACTIVE") || []);
      setManufacturerOptions(manufacturers?.filter((item: any) => item.status === "ACTIVE") || []);
      setSurveyorOptions(surveyors || []);
      setOwnerOptions(owners?.filter((item: any) => item.status === "ACTIVE") || []);
      
      // Once options are loaded, find and set the correct IDs for select fields
      if (currentData && id) {
        // Fallback matching logic if direct setting doesn't work
        // Match standard name to ID
        if (currentData.standard) {
          const standardObj = standards?.find((s: any) => 
            s.standard === currentData.standard || String(s.id) === String(currentData.standard)
          );
          if (standardObj) {
            setValue('standard', String(standardObj.id));
          }
        }
        
        // Match manufacturer name to ID
        if (currentData.manufacturer) {
          const manufacturerObj = manufacturers?.find((m: any) => 
            m.manufacturer === currentData.manufacturer || String(m.id) === String(currentData.manufacturer)
          );
          if (manufacturerObj) {
            setValue('manufacturer', String(manufacturerObj.id));
          }
        }
        
        // Match owner name to ID
        if (currentData.owner_name) {
          const ownerObj = owners?.find((o: any) => 
            o.owner === currentData.owner_name || String(o.id) === String(currentData.owner_name)
          );
          if (ownerObj) {
            setValue('owner_name', String(ownerObj.id));
          }
        }
      }
    };

    fetchOptions();
  }, [getAllSingleSubtopic, invoke, id, currentData, setValue]);

  // Fetch location options separately
  const [existingData, setExistingData] = useState<any[]>([]);
  const [equipmentData, setEquipmentData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await makeApiCall(() => new MasterService().getLocationDetails(), {
        afterSuccess: (data: any) => {
          if (data) {
            setLocationOptions(data?.filter((item: any) => item.location.status === "ACTIVE")); // Set the location options to the fetched data
          }
        }
      });
    };
    fetchLocations();
    const fetchEquipment = async () => {
      await makeApiCall(() => new MasterService().fetchAllEquipments(id), {
        afterSuccess: (data: any) => {

          if (data) {
            setExistingData(data); // Set the location options to the fetched data
          }
        }
      });
    }
    fetchEquipment();
  }, []);

  // Watch location and update site options accordingly
  const location = watch('location');

  // useEffect(() => {
  //   const fetchSites = async () => {
  //     const res = locationOptions.filter((item: any) => item.location.id == location ? location : currentData?.location);

  //     if (res.length > 0) {
  //       console.log("ressss",res)
  //       setSiteOptions(res?.filter((item) => item.site !=null)); // Set the area options to the fetched data
  //     } else {
  //       setSiteOptions([]); // Clear site options if no location is selected
  //     }
  //   };
  //   fetchSites();
  // }, [location, locationOptions]);

  // Watch equipment_no and update related fields
  const equipment_no = watch('equipment_no');

  
  // Handle "Not Applicable" and "Not Available" checkboxes based on equipment data
  useEffect(() => {
    const selectedEquipment = equipmentNoOptions.find((item) => item.id === equipment_no);
    if (selectedEquipment) {
      // Handle next_test_date
      if (selectedEquipment.next_test_date == null) {
        setTestExamChecked(true);
        setTestExamNotAvailable(false);
      } else if (selectedEquipment.next_test_date === "Not Available") {
        setTestExamNotAvailable(true);
        setTestExamChecked(false);
      } else {
        setTestExamChecked(false);
        setTestExamNotAvailable(false);
      }
      
      // Handle next_thorough_date
      if (selectedEquipment.next_thorough_date == null) {
        setThoroughExamChecked(true);
        setThoroughExamNotAvailable(false);
      } else if (selectedEquipment.next_thorough_date === "Not Available") {
        setThoroughExamNotAvailable(true);
        setThoroughExamChecked(false);
      } else {
        setThoroughExamChecked(false);
        setThoroughExamNotAvailable(false);
      }
      
      // Handle last_test_date
      if (selectedEquipment.last_test_date == null) {
        setLastTestExamChecked(true);
        setLastTestExamNotAvailable(false);
      } else if (selectedEquipment.last_test_date === "Not Available") {
        setLastTestExamNotAvailable(true);
        setLastTestExamChecked(false);
      } else {
        setLastTestExamChecked(false);
        setLastTestExamNotAvailable(false);
      }
      
      // Handle last_thorough_date
      if (selectedEquipment.last_thorough_date == null) {
        setLastThoroughExamChecked(true);
        setLastThoroughExamNotAvailable(false);
      } else if (selectedEquipment.last_thorough_date === "Not Available") {
        setLastThoroughExamNotAvailable(true);
        setLastThoroughExamChecked(false);
      } else {
        setLastThoroughExamChecked(false);
        setLastThoroughExamNotAvailable(false);
      }
    }
  }, [equipment_no, equipmentNoOptions]);
  const job_order_no = watch('job_order_no');
  useEffect(() => {
    if (job_order_no) {
      const job_order = jobOrderNoOptions.find((item: any) => item.id == job_order_no);

      if (job_order) {
        setValue('surveyor', job_order.surveyor)
        setValue('location', job_order.location)
      }
    }
  }, [job_order_no])
  useEffect(() => {
    if (isSubmitSuccessful) {
      // Optionally reset the form or perform other actions
      // reset();
    }
  }, [isSubmitSuccessful, reset]);
console.log(watch('manufacturer'),"manufacturer")
  const handleSafetyChecklistChange = (name: string, value: string) => {
    setSafetyChecklistValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // console.log(siteOptions)
  // Function to handle adding equipment to multi-equipments (AnnexureTable)
  const addEquipmentToMulti = async () => {
    // Validation checks first
    if (!watch('result')) {
      toastWithTimeout(ToastVariant.Default, "Result is required")
      return
    } else if (!watch('surveyor')) {
      toastWithTimeout(ToastVariant.Default, "Surveyor is required")
      return
    } else if (!watch('approval_status')) {
      toastWithTimeout(ToastVariant.Default, "Approval Status is required")
      return
    } else if (!watch('inspection_date')) {
      toastWithTimeout(ToastVariant.Default, "Inspection Date is required")
      return
    } else if (!watch('type_of_exam')) {
      toastWithTimeout(ToastVariant.Default, "Type of Exam is required")
      return
    } else if (!watch('equipment_no')) {
      toastWithTimeout(ToastVariant.Default, "Equipment No. is required")
      return
    }
  
    // Get the selected equipment's full data
    const selectedEquipment = equipmentNoOptions.find((item) => item.id == equipment_no);
    
    const datas = {
      equipment_no,
      inspection_date: watch('inspection_date'),
      type_of_exam: watch('type_of_exam'),
      title: watch('title'),
      equipment_description: selectedEquipment?.description || '',
      test_cert_coc_no: selectedEquipment?.test_certificate_no || '',
      safe_working_load: selectedEquipment?.safe_working_load || '',
      proof_load: selectedEquipment?.proof_load || '',
      last_test_exam: lastTestExamChecked ? "Not Applicable" : lastTestExamNotAvailable ? "Not Available" : selectedEquipment?.last_test_date || '',
      next_test_exam: testExamChecked ? "Not Applicable" : testExamNotAvailable ? "Not Available" : selectedEquipment?.next_test_date || '',
      last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : selectedEquipment?.last_thorough_date || '',
      next_thorough_exam: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : selectedEquipment?.next_thorough_date || '',
      result: watch('result'),
      owner_name: selectedEquipment?.owner_id || '',
      surveyor: watch('surveyor'),
      manufacturer: selectedEquipment?.manufacturer || '',
      standard: selectedEquipment?.standard || '',
      approval_status: watch('approval_status'),
      last_thorough_exam_certificate_no: watch('last_thorough_exam_certificate_no'),
      last_test_exam_certificate_no: watch('last_test_exam_certificate_no')
    };
  
    await makeApiCall(
      () => new MasterService().addEquipment(datas),
      {
        afterSuccess: (data: any) => {
          setExistingData([...existingData, data])
          toastWithTimeout(ToastVariant.Success, "Equipment added");
          setIsSubmitted(true);
        }
      }
    );
  };
  // Handle form submission
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
        // Set certificate numbers to empty string when dates are Not Applicable or Not Available
        last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? '' : values.last_test_exam_certificate_no,
        last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? '' : values.last_thorough_exam_certificate_no,
        last_test_exam: lastTestExamChecked ? "Not Applicable" : lastTestExamNotAvailable ? "Not Available" : values.last_test_exam,
        last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam,
        next_test_exam: testExamChecked ? "Not Applicable" : testExamNotAvailable ? "Not Available" : values.next_test_exam,
        next_thorough_exam: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam
      };

      console.log("Form data for update:", formData)
      await updateRecord(id, formData);

      // Handle updating multi-equipments if any
      console.log("Existing data for update:", existingData)

      if (existingData.length > 0) {
        await Promise.all(existingData.map((item: any) => {
          return makeApiCall(
            () => new MasterService().updateSubtopicDetails('lifting_gear_multi_equipments', item.id, { lifting_gear_multi_id: id }), {}
          );
        }));
        console.log('All updates completed successfully');

      }

      toastWithTimeout(ToastVariant.Success, 'Equipment details updated successfully');
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toastWithTimeout(ToastVariant.Error, 'An error occurred while updating the equipment details');
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

                {/* CERTIFICATE For Lifting Gear Title */}
                <h2 className={"text-base font-bold"}>CERTIFICATE For Lifting Gear Multi</h2>

                <div className={"grid gap-4 grid-cols-2"}>
                  {/* Certificate For Lifting Gear Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspection_date" className="mt-3">Inspection Date</Label>
                    <Input id="inspection_date" type="date" {...register('inspection_date')} />
                    {errors.inspection_date && (
                      <p className="text-red-500 text-[12px] ">{errors.inspection_date.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4 relative">
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <div className="flex w-full gap-2 items-center">
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
                          <AddLocationButton />
                        </div>
                      )}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
                    )}
                  </div>

                  {/* <div className="grid grid-cols-[200px_1fr] gap-4 relative">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <Controller
                      name="site"
                      control={control}
                      render={({ field }) => (
                        <div className="flex w-full gap-2 items-center">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="site">
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                            <SelectContent>
                              {siteOptions?.map((item: any) => (
                                <SelectItem key={item?.site?.id} value={String(item?.site?.id)}>
                                  {item?.site?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <AddSiteButton />
                        </div>
                      )}
                    />
                    {errors.site && (
                      <p className="text-red-500 text-[12px] ">{errors.site.message}</p>
                    )}
                  </div> */}

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
                            <SelectValue placeholder="Select type of exam" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"Test"}>Test</SelectItem>
                            <SelectItem value={"Thorough"}>Thorough</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type_of_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.type_of_exam.message}</p>
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
                            {jobOrderNoOptions?.map((jobOrder) => (
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
                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment Information Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4 relative">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
                    <Controller
                      name="equipment_no"
                      control={control}
                      render={({ field }) => (
                        <div className="flex w-full gap-2 items-center">
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
                          <AddEquipmentButton />
                        </div>
                      )}
                    />
                    {errors.equipment_no && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      value={watch('title')}
                    // Make it read-only since it's auto-populated
                    />
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                <section className='grid gap-4 grid-cols-1'>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    <Input maxLength={119}
                      id="equipment_description"
                      {...register('equipment_description')}
                      value={watch('equipment_description')}
                    // Make it read-only since it's auto-populated
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
                      value={watch('test_cert_coc_no')}
                    // Make it read-only since it's auto-populated
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
                      value={watch('safe_working_load')}
                    // Make it read-only since it's auto-populated
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
                      value={watch('proof_load')}
                    // Make it read-only since it's auto-populated
                    />
                    {errors.proof_load && (
                      <p className="text-red-500 text-[12px] ">{errors.proof_load.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4 relative">
                    <Label htmlFor="standard" className="mt-3">Standard</Label>
                    <Controller
                      name="standard"
                      control={control}
                      render={({ field }) => {
                        const allStandardOptions = standardOptions?.map((std: any) => String(std.id)) || [];
                        const value = allStandardOptions.includes(field.value) ? field.value : "";
                        return (
                          <div className="flex w-full gap-2 items-center relative">
                            <Select
                              value={value}
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
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">Date of last proof load test</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="last_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="last_test_exam" className='w-96' 
                            type="date"
                            {...field}
                            disabled={lastTestExamChecked || lastTestExamNotAvailable}
                            value={lastTestExamChecked ? "" : field.value}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          className='w-6 h-6' 
                          checked={lastTestExamChecked} 
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setLastTestExamChecked(true);
                              setLastTestExamNotAvailable(false);
                            } else {
                              setLastTestExamChecked(false);
                            }
                          }} 
                        /> 
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox 
                          className='w-6 h-6' 
                          checked={lastTestExamNotAvailable} 
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setLastTestExamNotAvailable(true);
                              setLastTestExamChecked(false);
                            } else {
                              setLastTestExamNotAvailable(false);
                            }
                          }} 
                        /> 
                        <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.last_test_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam_certificate_no" className="mt-3">
                      Last Proof Load Certificate No.
                    </Label>
                    <Input
                      id="last_test_exam_certificate_no" className='w-96'
                      disabled={lastTestExamChecked || lastTestExamNotAvailable}
                      {...register('last_test_exam_certificate_no')}
                    />
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam" className="mt-3">Date of last examination</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="last_thorough_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="last_thorough_exam" className='w-96'
                            type="date"
                            {...field}
                            disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                            value={lastThoroughExamChecked ? "" : field.value}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          className='w-6 h-6' 
                          checked={lastThoroughExamChecked} 
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setLastThoroughExamChecked(true);
                              setLastThoroughExamNotAvailable(false);
                            } else {
                              setLastThoroughExamChecked(false);
                            }
                          }} 
                        /> 
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox 
                          className='w-6 h-6' 
                          checked={lastThoroughExamNotAvailable} 
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setLastThoroughExamNotAvailable(true);
                              setLastThoroughExamChecked(false);
                            } else {
                              setLastThoroughExamNotAvailable(false);
                            }
                          }} 
                        /> 
                        <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.last_thorough_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam_certificate_no" className="mt-3">
                      Last Examination Certificate No.
                    </Label>
                    <Input
                      id="last_thorough_exam_certificate_no" className='w-96'
                      disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                      {...register('last_thorough_exam_certificate_no')}
                    />
                  </div>
                {/* </div> */}

                {/* <div className="grid gap-4 grid-cols-1 w-[64%]">
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4"> */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor="next_test_exam">Date of next proof load test</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="next_test_exam" className='w-96'
                            type="date"
                            {...field}
                            disabled={testExamChecked  || testExamNotAvailable}
                            value={testExamChecked ? "" : field.value}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          className='w-6 h-6'
                          checked={testExamChecked}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setTestExamChecked(true);
                              setTestExamNotAvailable(false);
                            } else {
                              setTestExamChecked(false);
                            }
                          }}
                        />
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox
                          className='w-6 h-6'
                          checked={testExamNotAvailable}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setTestExamNotAvailable(true);
                              setTestExamChecked(false);
                            } else {
                              setTestExamNotAvailable(false);
                            }
                          }}
                        />
                        <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.next_test_exam.message}</p>
                      )}
                    </div>
                  {/* </div> */}
                  {/* Next Test Certificate No. REMOVED */}
                </div>
                {/* <div className="grid gap-4 grid-cols-1 w-[64%]">
                  <div className="grid grid-cols-[200px_1fr] gap-4"> */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor={"next_thorough_exam"}>Date of next examination</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name={"next_thorough_exam"}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={"next_thorough_exam"} className='w-96'
                            type="date"
                            {...field}
                            disabled={thoroughExamChecked || thoroughExamNotAvailable}
                            value={thoroughExamChecked ? "" : field.value}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          className={'w-6 h-6'}
                          checked={thoroughExamChecked}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setThoroughExamChecked(true);
                              setThoroughExamNotAvailable(false);
                            } else {
                              setThoroughExamChecked(false);
                            }
                          }}
                        />
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox
                          className={'w-6 h-6'}
                          checked={thoroughExamNotAvailable}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setThoroughExamNotAvailable(true);
                              setThoroughExamChecked(false);
                            } else {
                              setThoroughExamNotAvailable(false);
                            }
                          }}
                        />
                        <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.next_thorough_exam.message}</p>
                      )}
                    </div>
                  </div>
                  {/* Next Thorough Certificate No. REMOVED */}
                {/* </div> */}

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
                      render={({ field }) => {
                        const currentOwner = String(
                          equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                            ?.owner_id ?? ""
                        );
                        const allOwnerOptions = ownerOptions?.map((owner: any) => String(owner.id)) || [];
                        const value = currentOwner || field.value || "";

                        return (
                          <div className="flex w-full gap-2 items-center relative">
                            <Select 
                              value={allOwnerOptions.includes(value) ? value : ""}
                              onValueChange={(val) => field.onChange(val)}
                            >
                              <SelectTrigger id="owner_id" className="w-full">
                                <SelectValue
                                  placeholder="Select or type owner"
                                  {...(allOwnerOptions.includes(value)
                                    ? {}
                                    : { children: value ? value : undefined })}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="px-2 py-1 relative">
                                  <>
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
                                  </>
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

                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="tested_standard" className="mt-3">Tested Standard</Label>
                    <Input 
                      id="tested_standard" 
                      {...register('tested_standard')} 
                      value={watch('tested_standard')} 
                    />
                    {errors.tested_standard && (
                      <p className="text-red-500 text-[12px] ">{errors.tested_standard.message}</p>
                    )}
                  </div> */}

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <Controller
                      name="manufacturer"
                      control={control}
                      render={({ field }) => {
                        const allManufacturerOptions = manufacturerOptions?.map((manu: any) => String(manu.id)) || [];
                        const value = allManufacturerOptions.includes(field.value) ? field.value : "41";
                        return (
                          <div className="flex w-full gap-2 items-center relative">
                            <Select
                              value={value}
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
                    <Table equipmentOptions={equipmentNoOptions} onFunction={addEquipmentToMulti} isSubmitted={isSubmitted} existingData={existingData} setValue={setValue} deleteRecord={deleteRecord} />
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
                      <Input  maxLength={45} id="defect_description" className='my-auto' {...register('defect_description')} />
                      {errors.defect_description && (
                        <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                      )}

                    </div>
                  </div>
                </div>
                {/* <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                  <div className="grid grid-cols-[400px_1fr]  gap-4">
                    <Label htmlFor="test_particulars" className="mt-3 leading-5">Particulars of any tests carried out as part of the examination</Label>
                    <Input id="test_particulars" className='' {...register('test_particulars')} />
                    {errors.test_particulars && (
                      <p className="text-red-500 text-[12px] ">{errors.test_particulars.message}</p>
                    )}
                     </div>
                  </div>
                </div> */}

                {/* Submit and Cancel Buttons */}
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
