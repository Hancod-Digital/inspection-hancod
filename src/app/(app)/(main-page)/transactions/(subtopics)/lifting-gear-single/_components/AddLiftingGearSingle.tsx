'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useRef } from 'react';
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
import { useSubtopic } from '@/context/SubtopicContext';
import { MasterService } from '@/services/api/masters-service';
import { makeApiCall } from '@/lib/apicaller';
import { PlusIcon } from 'lucide-react';
import { toastWithTimeout } from '@/components/ui/use-toast';
import { ToastVariant } from '@/components/ui/use-toast';


import AddLocationButton from '../../_components/Location/Location';
// import AddSiteButton from '../../_components/Site/Site';
import AddEquipmentButton from '../../_components/Equipments/Equipments';
import AddStandardButton from '../../_components/Standard/Standard';
import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
import AddOwnerButton from '../../_components/Owner/Owner';

interface EquipmentDetailsFormProps {
  onClose: () => void;
  setIsLocation: (value: boolean) => void;
  setIsEquipment: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsManufacturer: (value: boolean) => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [testExamChecked, setTestExamChecked] = useState<any>(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState<any>(false);
  const [lastTestExamChecked, setLastTestExamChecked] = useState<any>(false);
  const [lastThoroughExamChecked, setLastThoroughExamChecked] = useState<any>(false);
  const [testExamNotAvailable, setTestExamNotAvailable] = useState<any>(false);
  const [thoroughExamNotAvailable, setThoroughExamNotAvailable] = useState<any>(false);
  const [lastTestExamNotAvailable, setLastTestExamNotAvailable] = useState<any>(false);
  const [lastThoroughExamNotAvailable, setLastThoroughExamNotAvailable] = useState<any>(false);



  const [invoke, setInvoke] = useState(false);

  const [isAutoFill, setIsAutoFill] = useState(true);
  
  const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  const [isStandardTyping, setIsStandardTyping] = useState(false);


  const MAX_DESCRIPTION_LINES = 12; // Define your maximum lines here

  // State to hold the description content from ReactQuill
  const [descriptionContent, setDescriptionContent] = useState('');
  // Ref for ReactQuill to access its internal editor
  const quillRef = useRef<any>(null);

  // Remove next_test_exam_certificate_no and next_thorough_exam_certificate_no from schema
  const equipmentDetailsSchema = object({
    inspection_date: string().nonempty('Inspection Date is required'),
    // site: string().nonempty('Site is required'),
    authority: string().nonempty('Authority is required'),
    // standard: string().nonempty('Standard is required'),
    standard: z.union([z.string(), z.number()])
    .transform(val => val?.toString())
    .refine(val => val !== '', { message: 'Standard is required' }),
    job_order_no: string().nonempty('Job Order No. is required'),
    // equipment_no: string().nonempty('Equipment No. is required'),
    equipment_no: z.union([z.string(), z.number()])
    .transform(val => val?.toString())
    .refine(val => val !== '', { message: 'Equipment No. is required' }),
    serial_no: string().optional(),
    title: string().nonempty('Title is required'),
    test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
    safe_working_load: string().nonempty('Safe Working Load is required'),
    last_test_exam:  string().optional(),
    next_test_exam: string().optional(),
    last_thorough_exam: string().optional(),
    next_thorough_exam: string().optional(),
    result: string().nonempty('Result is required'),
    type_of_exam: string().nonempty('Type of Exam is required'),
    // surveyor: string().nonempty('Surveyor is required'),
    surveyor: z.union([z.string(), z.number()])
    .transform(val => val?.toString())
    .refine(val => val !== '', { message: 'Surveyor is required' }),
    defect_description: string().nonempty('Defect Description is required'),
    location: string().nonempty('Location is required'),
    // owner_name: string().nonempty('Owner Name is required'),
    owner_name: z.union([z.string(), z.number()])
    .transform(val => val?.toString())
    .refine(val => val !== '', { message: 'Owner Name is required' }),
    proof_load: string().nonempty('Proof Load is required'),
    description: string().nonempty('Description Date is required')
    .refine((data) => {
      // This validation runs on the HTML content from ReactQuill
      // Count lines based on <p> and <br> tags, after stripping empty tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const paragraphs = doc.querySelectorAll('p');
      let lineCount = 0;
      paragraphs.forEach(p => {
        // Count non-empty paragraphs as lines or paragraphs with a <br> (forced newline)
        if (p.textContent?.trim() !== '' || p.querySelector('br')) {
          lineCount++;
        }
      });

      // Special handling for initial empty state which Quill might represent as "<p><br></p>"
      if (data === "<p><br></p>") {
        lineCount = 0;
      }

      return lineCount <= MAX_DESCRIPTION_LINES;
    }, { message: `Description must not exceed ${MAX_DESCRIPTION_LINES} lines` }),
    equipment_description: string().nonempty('Equipment Description is required'),
    // manufacturer: string().nonempty('Manufacturer is required'),
    manufacturer: z.union([z.string(), z.number()])
    .transform(val => val?.toString())
    .refine(val => val !== '', { message: 'Manufacturer is required' }),
    approval_status: string().nonempty('Approval Status is required'),
    last_test_exam_certificate_no: string().optional(),
    last_thorough_exam_certificate_no: string().optional(),
  });
 
   
  type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

  const { getAllSingleSubtopic, addRecord } = useSubtopic();
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });
  
  const { reset, handleSubmit, control, register, formState: { isSubmitSuccessful, errors }, trigger } = methods;
  const [siteOptions, setSiteOptions] = useState<any>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any>([]);
  const [standardOptions, setStandardOptions] = useState<any>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any>([]);
  const [ownerOptions, setOwnerOptions] = useState<any>([]);
  const [locationOptions, setLocationOptions] = useState<any>([]);
  const { watch, setValue } = methods;


  const { equipment_no, standard, owner_name } = watch();

// console.log("watch",watch())



  useEffect(() => {
    if (equipment_no) {
      const selectedEquipment = equipmentNoOptions.find((item: any) => item.id == equipment_no);
      if (selectedEquipment) {
        setValue('standard', selectedEquipment.standard || '');
        setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
        setValue('owner_name', String(selectedEquipment.owner_name) || '');
        setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || '');
        setValue('safe_working_load', String(selectedEquipment.safe_working_load) || '');
        setValue('proof_load', String(selectedEquipment.proof_load) || '');
        setValue('equipment_description', String(selectedEquipment.description) || '');
        setValue('title', String(selectedEquipment.title) || '');
        setValue('standard', String(selectedEquipment.standard) || '');
        setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
        setValue('owner_name', String(selectedEquipment.owner_id) || '');
        setValue('last_test_exam', String(selectedEquipment.last_test_date) || '');
        setValue('next_test_exam', String(selectedEquipment.next_test_date) || '');
        setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || '');
        setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || '');
      }
    }
  }, [equipment_no, equipmentNoOptions, setValue]);

  const { location } = watch();
  useEffect(() => {
    const fetchSites = async () => {
      const res = locationOptions.filter((item: any) => item.location.id == location);
      if (res.length > 0) {
        // setSiteOptions(res?.map((item: any) => item.site));
        setSiteOptions([])
      }
    };
    fetchSites();
  }, [location, locationOptions]);

  useEffect(() => {
    const selectedEquipment = equipmentNoOptions?.find((item: any) => item?.id == equipment_no);
    
    // Handle next_test_date
    if (selectedEquipment?.next_test_date == null) {
      setTestExamChecked(true);
      setTestExamNotAvailable(false);
    } else if (selectedEquipment?.next_test_date === "Not Available") {
      setTestExamNotAvailable(true);
      setTestExamChecked(false);
    } else {
      setTestExamChecked(false);
      setTestExamNotAvailable(false);
    }
    
    // Handle next_thorough_date
    if (selectedEquipment?.next_thorough_date == null) {
      setThoroughExamChecked(true);
      setThoroughExamNotAvailable(false);
    } else if (selectedEquipment?.next_thorough_date === "Not Available") {
      setThoroughExamNotAvailable(true);
      setThoroughExamChecked(false);
    } else {
      setThoroughExamChecked(false);
      setThoroughExamNotAvailable(false);
    }
    
    // Handle last_test_date
    if (selectedEquipment?.last_test_date == null) {
      setLastTestExamChecked(true);
      setLastTestExamNotAvailable(false);
    } else if (selectedEquipment?.last_test_date === "Not Available") {
      setLastTestExamNotAvailable(true);
      setLastTestExamChecked(false);
    } else {
      setLastTestExamChecked(false);
      setLastTestExamNotAvailable(false);
    }
    
    // Handle last_thorough_date
    if (selectedEquipment?.last_thorough_date == null) {
      setLastThoroughExamChecked(true);
      setLastThoroughExamNotAvailable(false);
    } else if (selectedEquipment?.last_thorough_date === "Not Available") {
      setLastThoroughExamNotAvailable(true);
      setLastThoroughExamChecked(false);
    } else {
      setLastThoroughExamChecked(false);
      setLastThoroughExamNotAvailable(false);
    }
  }, [equipment_no])

  useEffect(() => {
    const fetchSites = async () => {
      const data = await getAllSingleSubtopic("site");
      if (data) setSiteOptions(data);
    };
    fetchSites();
    const fetchSurveyors = async () => {
      const data = await getAllSingleSubtopic("surveyor");
      if (data) setSurveyorOptions(data);
    };
    fetchSurveyors();
    const fetchOwners = async () => {
      const data = await getAllSingleSubtopic('owner')
      if (data) setOwnerOptions(data?.filter((item: any) => item.status === "ACTIVE"))
    }
    fetchOwners()
    const fetchAuthorities = async () => {
      const data = await getAllSingleSubtopic("authority");
      if (data) setAuthorityOptions(data?.filter((item: any) => item.status === "ACTIVE"));
    };
    fetchAuthorities();
    const fetchJobOrderNos = async () => {
      const data = await getAllSingleSubtopic("job_orders");
      if (data) setJobOrderNoOptions(data);
    };
    fetchJobOrderNos();
    const fetchEquipmentNos = async () => {
      const data = await getAllSingleSubtopic("equipment");
      if (data) setEquipmentNoOptions(data?.filter((item: any) => item.status === "ACTIVE"));
    };
    fetchEquipmentNos();
    const fetchStandards = async () => {
      const data = await getAllSingleSubtopic("standard");
      if (data) setStandardOptions(data?.filter((item: any) => item.status === "ACTIVE"));
    };
    fetchStandards();
    const fetchManufacturers = async () => {
      const data = await getAllSingleSubtopic("manufacturer");
      if (data) setManufacturerOptions(data?.filter((item: any) => item.status === "ACTIVE"));
    };
    fetchManufacturers();
    const fetchLocations = async () => {
      await makeApiCall(() => new MasterService().getLocationDetails(), {
        afterSuccess: (data: any) => {
          if (data) setLocationOptions(data?.filter((item: any) => item.location.status === "ACTIVE"));
        }
      })
    };
    fetchLocations();
  }, [getAllSingleSubtopic, invoke]);
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
      // reset();
    }
  }, [isSubmitSuccessful, reset]);

  const [safetyChecklistValues, setSafetyChecklistValues] = useState({
    firstExamination: '',
    sixMonthInterval: '',
    twelveMonthInterval: '',
    correctInstallation: '',
    examinationScheme: '',
    exceptionalCircumstances: '',
    safeToUse: ''
  });

  const handleSafetyChecklistChange = (name: string, value: string) => {
    setSafetyChecklistValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    console.log('last_test_exam:', values.last_test_exam);
    console.log('next_test_exam:', values.next_test_exam);
    console.log('last_thorough_exam:', values.last_thorough_exam);
    console.log('next_thorough_exam:', values.next_thorough_exam);

    setLoading(true);
    try {
      if (isAutoFill) {
        // Auto-fill flow - use existing addRecord
        const { serial_no, ...filteredValues } = values;
        const formData = {
          ...filteredValues,
          // first_examination: safetyChecklistValues.firstExamination === "no" ? false : true,
          first_examination:safetyChecklistValues.firstExamination === "yes"? true:safetyChecklistValues.firstExamination === "no"? false:null,
          // six_month_interval: safetyChecklistValues.sixMonthInterval === "no" ? false : true,
          six_month_interval:safetyChecklistValues.sixMonthInterval === "yes"? true:safetyChecklistValues.sixMonthInterval === "no"? false:null,
          // twelve_month_interval: safetyChecklistValues.twelveMonthInterval === "no" ? false : true,
          twelve_month_interval:safetyChecklistValues.twelveMonthInterval === "yes"? true:safetyChecklistValues.twelveMonthInterval === "no"? false:null,
          // correct_installation: safetyChecklistValues.correctInstallation === "no" ? false : true,
          correct_installation:safetyChecklistValues.correctInstallation === "yes"? true:safetyChecklistValues.correctInstallation === "no"? false:null,
          // examination_scheme: safetyChecklistValues.examinationScheme === "no" ? false : true,
          examination_scheme:safetyChecklistValues.examinationScheme === "yes"? true:safetyChecklistValues.examinationScheme === "no"? false:null,
          // exceptional_circumstances: safetyChecklistValues.exceptionalCircumstances === "no" ? false : true,
          exceptional_circumstances:safetyChecklistValues.exceptionalCircumstances === "yes"? true:safetyChecklistValues.exceptionalCircumstances === "no"? false:null,
          // safe_to_use: safetyChecklistValues.safeToUse === "no" ? false : true,
          safe_to_use:safetyChecklistValues.safeToUse === "yes"? true:safetyChecklistValues.safeToUse === "no"? false:null,
          approval_status: values.approval_status === "Approved" ? true : false,
          last_test_exam: lastTestExamChecked ? "Not Applicable" : lastTestExamNotAvailable ? "Not Available" : values.last_test_exam,
          last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam,
          next_test_exam: testExamChecked ? "Not Applicable" : testExamNotAvailable ? "Not Available" : values.next_test_exam,
          next_thorough_exam: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam,
          last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? "" : values.last_test_exam_certificate_no,
          last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? "" : values.last_thorough_exam_certificate_no
        };

        if (
          !formData.last_test_exam || !formData.next_test_exam ||
          !formData.last_thorough_exam || !formData.next_thorough_exam
        ) {
          toastWithTimeout(ToastVariant.Error, `All exam fields are required or should be marked as N/A`);
          return;
        }
        

        console.log("Form Data being sent to RPC:", formData); 
        await addRecord(formData, null, "lifting_gear_single");
        onClose();
      } else {
        const manualData = {
          equipment_no: values.equipment_no,
          title: values.title,
          description: values.equipment_description,
          manufacturer_name: values.manufacturer,
          owner_name: values.owner_name,
          standard_code: values.standard,
          serial_no: values.serial_no,
          test_certificate_no: values.test_cert_coc_no, // map to correct backend key
          safe_working_load: values.safe_working_load,
          proof_load: values.proof_load,
          last_test_date: lastTestExamChecked ? "Not Applicable" : lastTestExamNotAvailable ? "Not Available" : values.last_test_exam,           // map to correct backend key
          last_through_date: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam,    // map to correct backend key
          next_test_date: testExamChecked ? "Not Applicable" : testExamNotAvailable ? "Not Available" : values.next_test_exam,           // map to correct backend key
          next_through_date: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam     // map to correct backend key
        };
        // console.log("Manual Data being sent to RPC:", manualData); 
        await makeApiCall(() => new MasterService().manualDataEntryFromSingleEquipment(manualData), {
          afterSuccess: async (data: any) => {
            // console.log("Manual Data RPC Response:", data); 
            const responseData = data.data;
            if (!responseData || responseData.length === 0) {
              console.error("RPC call did not return the expected data.", responseData);
              return; 
            }

            const newIds = responseData[0]; 

            // console.log("New IDs:", newIds); 
            const { serial_no, ...restOfValues } = values;
            const formData = {
              ...restOfValues,
              equipment_no: newIds.equipment_id,
              manufacturer: newIds.manufacturer_id,
              owner_name: newIds.owner_id,
              standard: newIds.standard_id,
              // first_examination: safetyChecklistValues.firstExamination === "no" ? false : true,
              first_examination:safetyChecklistValues.firstExamination === "yes"? true:safetyChecklistValues.firstExamination === "no"? false:null,
              // six_month_interval: safetyChecklistValues.sixMonthInterval === "no" ? false : true,
              six_month_interval:safetyChecklistValues.sixMonthInterval === "yes"? true:safetyChecklistValues.sixMonthInterval === "no"? false:null,
              // twelve_month_interval: safetyChecklistValues.twelveMonthInterval === "no" ? false : true,
              twelve_month_interval:safetyChecklistValues.twelveMonthInterval === "yes"? true:safetyChecklistValues.twelveMonthInterval === "no"? false:null,
              // correct_installation: safetyChecklistValues.correctInstallation === "no" ? false : true,
              correct_installation:safetyChecklistValues.correctInstallation === "yes"? true:safetyChecklistValues.correctInstallation === "no"? false:null,
              // examination_scheme: safetyChecklistValues.examinationScheme === "no" ? false : true,
              examination_scheme:safetyChecklistValues.examinationScheme === "yes"? true:safetyChecklistValues.examinationScheme === "no"? false:null,
              // exceptional_circumstances: safetyChecklistValues.exceptionalCircumstances === "no" ? false : true,
              exceptional_circumstances:safetyChecklistValues.exceptionalCircumstances === "yes"? true:safetyChecklistValues.exceptionalCircumstances === "no"? false:null,
              // safe_to_use: safetyChecklistValues.safeToUse === "no" ? false : true,
              safe_to_use:safetyChecklistValues.safeToUse === "yes"? true:safetyChecklistValues.safeToUse === "no"? false:null,
              approval_status: values.approval_status === "Approved" ? true : false,
              last_test_exam: lastTestExamChecked ? "Not Applicable" : lastTestExamNotAvailable ? "Not Available" : values.last_test_exam,
              last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam,
              next_test_exam: testExamChecked ? "Not Applicable" : testExamNotAvailable ? "Not Available" : values.next_test_exam,
              next_thorough_exam: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam,
              last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? "" : values.last_test_exam_certificate_no,
              last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? "" : values.last_thorough_exam_certificate_no
            };

            const missingFields: string[] = [];
          if (!formData.last_test_exam) missingFields.push('Date of last proof load test');
          if (!formData.last_thorough_exam) missingFields.push('Date of last examination');
          if (!formData.next_test_exam) missingFields.push('Date of next proof load test');
          if (!formData.next_thorough_exam) missingFields.push('Date of next examination');
          if (missingFields.length > 0) {
            toastWithTimeout(
              ToastVariant.Default,
              `Missing: ${missingFields.join(', ')}`
              // <>
              //   <span style={{ color: 'red', fontWeight: 600 }}>Missing:</span> {missingFields.join(', ')}
              // </>
            );
            return;
          }
            
            console.log("Form Data being sent to RPC:", formData); 
            await addRecord(formData, null, "lifting_gear_single");
            onClose();
          }
        });
        // await addRecord(values, null, "lifting_gear_single");
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
      // onClose();
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
              onSubmit={handleSubmit((values) => {
                onSubmitHandler(values);
              })}
            >
              <div className="space-y-4 pt-10">
                {/* CERTIFICATE For Lifting Gear Title */}
                <h2 className={"text-base font-bold"}>CERTIFICATE For Lifting Gear Single</h2>
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
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <div className='relative'>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <div className="flex w-full gap-2 items-center">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="location" className="w-full">
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
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <div className='relative'>
                      <Controller
                        name="site"
                        control={control}
                        render={({ field }) => (
                          <div className="flex w-full gap-2 items-center">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="site" className="w-full">
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
                            <AddSiteButton />
                          </div>
                        )}
                      />
                      {errors.site && (
                        <p className="text-red-500 text-[12px] ">{errors.site.message}</p>
                      )}
                    </div>
                  </div> */}
                </div>
                {/* Equipment Information Title */}
                <div className="flex justify-between items-center mt-6">
                  <h2 className="text-base font-bold">Equipment Information</h2>
                </div>
                <div className='flex justify-start gap-2 hover:text-black mb-2'>
                  <Button
                    type="button"
                    variant={!isAutoFill ? "default" : "outline"}
                    // onClick={() => setIsAutoFill(false)}
                    onClick={() => {
                      setIsAutoFill(false);
                      setTestExamChecked(false);
                      setThoroughExamChecked(false);
                      setLastTestExamChecked(false);
                      setLastThoroughExamChecked(false);
                      setTestExamNotAvailable(false);
                      setThoroughExamNotAvailable(false);
                      setLastTestExamNotAvailable(false);
                      setLastThoroughExamNotAvailable(false);
                      reset({
                        ...watch(),
                        equipment_no: '',
                        serial_no: '',
                        title: '',
                        equipment_description: '',
                        test_cert_coc_no: '',
                        safe_working_load: '',
                        proof_load: '',
                        standard: '',
                        last_test_exam: '',
                        next_test_exam: '',
                        last_thorough_exam: '',
                        next_thorough_exam: '',
                        manufacturer: '',
                        owner_name: '',
                        surveyor: '',
                        job_order_no: '',
                        location: '',
                      });

                      const surveyorId = watch('surveyor');
                      if (surveyorId) {
                        const surveyor = surveyorOptions.find((s: any) => String(s.id) === String(surveyorId));
                        if (surveyor) {
                          setValue('surveyor', surveyor.surveyor);
                        }
                      }
                    }}
                  >
                    MANUAL
                  </Button>
                  <Button
                    type="button"
                    variant={isAutoFill ? "default" : "outline"}
                    onClick={() => setIsAutoFill(true)}
                  >
                    AUTO-FILL
                  </Button>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment Information Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
                    <div className='relative'>
                      {isAutoFill ? (
                        <Controller
                          name="equipment_no"
                          control={control}
                          render={({ field }) => (
                            <div className="flex w-full gap-2 items-center">
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="equipment_no" className="w-full">
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
                      ) : (
                        <Input id="equipment_no" {...register('equipment_no')} />
                      )}
                      {errors.equipment_no && (
                        <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Serial No field - shown only in manual mode */}
                  {!isAutoFill && (
                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <Label htmlFor="serial_no" className="mt-3">Serial No.</Label>
                      <Input id="serial_no" {...register('serial_no')} />
                      {errors.serial_no && (
                        <p className="text-red-500 text-[12px] ">{errors.serial_no.message}</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    {isAutoFill ? (
                      <Input id="title" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.title} {...register('title')} />
                    ) : (
                      <Input id="title" {...register('title')} />
                    )}
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>
                </div>
                <section className='grid gap-4 grid-cols-1'>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    {isAutoFill ? (
                      <Input maxLength={119} id="equipment_description" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.description} {...register('equipment_description')} />
                    ) : (
                      <Input maxLength={119} id="equipment_description" {...register('equipment_description')} />
                    )}
                    {errors.equipment_description && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_description.message}</p>
                    )}
                  </div>
                </section>
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="test_cert_coc_no" className="mt-3">Test Cert/COC No.</Label>
                    {isAutoFill ? (
                      <Input id="test_cert_coc_no" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.test_certificate_no} {...register('test_cert_coc_no')} />
                    ) : (
                      <Input id="test_cert_coc_no" {...register('test_cert_coc_no')} />
                    )}
                    {errors.test_cert_coc_no && (
                      <p className="text-red-500 text-[12px] ">{errors.test_cert_coc_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
                    {isAutoFill ? (
                      <Input id="safe_working_load" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.safe_working_load} {...register('safe_working_load')} />
                    ) : (
                      <Input id="safe_working_load" {...register('safe_working_load')} />
                    )}
                    {errors.safe_working_load && (
                      <p className="text-red-500 text-[12px] ">{errors.safe_working_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="proof_load" className="mt-3">Proof Load:</Label>
                    {isAutoFill ? (
                      <Input id="proof_load" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.proof_load} {...register('proof_load')} />
                    ) : (
                      <Input id="proof_load" {...register('proof_load')} />
                    )}
                    {errors.proof_load && (
                      <p className="text-red-500 text-[12px] ">{errors.proof_load.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="standard" className="mt-3">Standard</Label>
                    <div className='relative'>
                      {isAutoFill ? (
                        <Controller
                          name="standard"
                          control={control}
                          render={({ field }) => {
                            const allStandardOptions = standardOptions?.map((std: any) => String(std.id)) || [];
                            const value = allStandardOptions.includes(field.value) ? field.value : "";
                            return (
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
                                <AddStandardButton />
                              </Select>
                            );
                          }}
                        />
                      ) : (
                        <Input id="standard" {...register('standard')} />
                      )}
                      {/* <AddStandardButton /> */}
                      {errors.standard && (
                        <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4"> */}
                   <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">
                      Date of last proof load test
                    </Label>
                  <div className="flex items-center gap-4">

                      <Controller
                        name="last_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="last_test_exam" className="w-96"
                            type="date"
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_test_date
                                ? equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_test_date
                                : ''
                            }
                            disabled={lastTestExamChecked || lastTestExamNotAvailable}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setLastTestExamChecked(false);
                              setLastTestExamNotAvailable(false);
                            }}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox className='w-6 h-6' checked={lastTestExamChecked} onCheckedChange={(checked) => {
                          if (checked) {
                            setLastTestExamChecked(true);
                            setLastTestExamNotAvailable(false);
                                            } else {
                            setLastTestExamChecked(false);
                          }
                        }} /> 
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={lastTestExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setLastTestExamNotAvailable(true);
                            setLastTestExamChecked(false);
                          } else {
                            setLastTestExamNotAvailable(false);
                          }
                        }} /> 
                        <span className="text-[13px]">Not Available</span>
                                </div>
                    {errors.last_test_exam && (
                      <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                    )}
                    </div>
                    </div>
                  {/* </div> */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam_certificate_no" className="mt-3">
                      Last Proof Load Certificate No.
                    </Label>
                    <Input
                      id="last_test_exam_certificate_no" className="w-96"
                      type="text"
                      disabled={lastTestExamChecked || lastTestExamNotAvailable}
                      {...register('last_test_exam_certificate_no')}
                    />
                    {errors.last_test_exam_certificate_no && (
                      <p className="text-red-500 text-[12px] ">{errors.last_test_exam_certificate_no.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam" className="mt-3">
                      Date of last examination
                    </Label>
                    <div className="flex items-center gap-4">
                    <Controller
                      name="last_thorough_exam"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="last_thorough_exam" className="w-96"
                          type="date"
                          defaultValue={
                            equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_thorough_date
                              ? equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_thorough_date
                              : ''
                          }
                          disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setLastThoroughExamChecked(false);
                            setLastThoroughExamNotAvailable(false);
                          }}
                        />
                      )}
                    />
                      <div className="flex items-center gap-2">
                        <Checkbox className='w-6 h-6' checked={lastThoroughExamChecked} onCheckedChange={(checked) => {
                          if (checked) {
                            setLastThoroughExamChecked(true);
                            setLastThoroughExamNotAvailable(false);
                          } else {
                            setLastThoroughExamChecked(false);
                          }
                        }} /> 
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={lastThoroughExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setLastThoroughExamNotAvailable(true);
                            setLastThoroughExamChecked(false);
                          } else {
                            setLastThoroughExamNotAvailable(false);
                          }
                        }} /> 
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
                      id="last_thorough_exam_certificate_no" className="w-96"
                      type="text"
                      disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                      {...register('last_thorough_exam_certificate_no')}
                    />
                    {errors.last_thorough_exam_certificate_no && (
                      <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam_certificate_no.message}</p>
                    )}
                  </div>
                {/* </div> */}
                {/* <div className="grid gap-4 grid-cols-2"> */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor="next_test_date">Date of next proof load test</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          // <Input id="next_test_date" defaultValue={
                          <Input
                            id="next_test_date" className="w-96"
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date
                                ? equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date
                                : ''
                              // } disabled={testExamChecked} type="date" {...field} />
                            }
                            disabled={testExamChecked || testExamNotAvailable}
                            type="date"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setTestExamChecked(false);
                              setTestExamNotAvailable(false);
                            }}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox className='w-6 h-6' checked={testExamChecked} onCheckedChange={(checked) => {
                          if (checked) {
                            setTestExamChecked(true);
                            setTestExamNotAvailable(false);
                                            } else {
                            setTestExamChecked(false);
                          }
                        }} /> 
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={testExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setTestExamNotAvailable(true);
                            setTestExamChecked(false);
                          } else {
                            setTestExamNotAvailable(false);
                          }
                        }} /> 
                        <span className="text-[13px]">Not Available</span>
                                </div>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px]  text-[13px] ">
                          {errors.next_test_exam.message}
                        </p>
                      )}
                    </div>
                  {/* </div> */}
                  </div>
                  {/* Removed Next Test Certificate No. */}
                  {/* <div className="grid gap-4 grid-cols-2"> */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor={"next_thorough_exam"}>Date of next examination</Label>
                    <div className="flex items-center gap-4">
                    <Controller
                        name={"next_thorough_exam"}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={"next_thorough_exam"} className="w-96"
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date
                                ? equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date
                                : ''
                              // } disabled={thoroughExamChecked} type="date" {...field} />
                            }
                            disabled={thoroughExamChecked || thoroughExamNotAvailable}
                            type="date"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setThoroughExamChecked(false);
                              setThoroughExamNotAvailable(false);
                            }}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox className='w-6 h-6' checked={thoroughExamChecked} onCheckedChange={(checked) => {
                          if (checked) {
                            setThoroughExamChecked(true);
                            setThoroughExamNotAvailable(false);
                                            } else {
                            setThoroughExamChecked(false);
                          }
                        }} /> 
                        <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={thoroughExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setThoroughExamNotAvailable(true);
                            setThoroughExamChecked(false);
                          } else {
                            setThoroughExamNotAvailable(false);
                          }
                        }} /> 
                        <span className="text-[13px]">Not Available</span>
                                </div>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px]  text-[13px] ">
                          {errors.next_thorough_exam.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Removed Next Thorough Certificate No. */}
                {/* </div> */}
                {/* Result Section */}
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="result" className="mt-3">Result</Label>
                    {/* {isAutoFill ? ( */}
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
                    {/* ) : (
                      <Input id="result" {...register('result')} />
                    )} */}
                    {errors.result && (
                      <p className="text-red-500 text-[12px] ">{errors.result.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owners" className="mt-3">
                      Owner Name
                    </Label>
                    {isAutoFill ? (
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
                                            setInvoke((prev) => !prev);
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
                    ) : (
                      <Input id="owner_name" {...register('owner_name')} />
                    )}
                    {errors.owner_name && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="surveyor" className="mt-3">Surveyor</Label>
                    {/* {isAutoFill ? ( */}
                    <Controller
                      name="surveyor"
                      control={control}
                    //   render={({ field }) => (
                    //     <Select onValueChange={field.onChange} value={field.value}>
                    //       <SelectTrigger id="surveyor">
                    //         <SelectValue placeholder="Select surveyor" />
                    //       </SelectTrigger>
                    //       <SelectContent>
                    //         {surveyorOptions?.map((surveyor: any) => (
                    //           <SelectItem key={surveyor.id} value={String(surveyor.id)}>
                    //             {surveyor.surveyor}
                    //           </SelectItem>
                    //         ))}
                    //       </SelectContent>
                    //     </Select>
                    //   )}
                    // />
                    // ) : (
                    //   <Input id="surveyor" {...register('surveyor')} />
                    // )}
                      render={({ field }) => {
                        const surveyorName =
                          surveyorOptions.find(
                            (s: any) => String(s.id) === String(field.value)
                          )?.surveyor || '';
                        return <Input id="surveyor" value={surveyorName} disabled />;
                      }}
                    />
                    {errors.surveyor && (
                      <p className="text-red-500 text-[12px] ">{errors.surveyor.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4 relative">
                    <Label htmlFor="manufacturer" className="mt-3">
                      Manufacturer
                    </Label>
                    <div className='relative '>
                      {isAutoFill ? (
                      <Controller
                        name="manufacturer"
                        control={control}
                        render={({ field }) => {
                          const allManufacturerOptions = manufacturerOptions?.map((manu: any) => String(manu.id)) || [];
                          const value = allManufacturerOptions.includes(field.value) ? field.value : "";
                          return (
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
                              <AddManufacturerButton />
                            </Select>
                            // <AddManufacturerButton />
                          );
                        }}
                      />
                      ) : (
                        <Input id="manufacturer" {...register('manufacturer')} />
                      )}

                      {errors.manufacturer && (
                        <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="approval_status" className="mt-3">Approval Status</Label>
                    {/* {isAutoFill ? ( */}
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
                    {/* ) : (
                      <Input id="approval_status" {...register('approval_status')} />
                    )} */}
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
                      render={({ field }) => {
                        console.log(field)
                        return (
                          <ReactQuill
                            // ref={quillRef} // Remove this line
                            theme="snow"
                            className="mt-3"
                            value={field.value} // Use field.value as the source of truth
                            onChange={(content, delta, source, editor) => {
                              // Get plain text to easily count lines
                              const plainText = editor.getText().trim();
                              // Count actual newlines in plain text
                              const lines = plainText.split('\n').filter(line => line.trim() !== '');

                              if (lines.length <= MAX_DESCRIPTION_LINES) {
                                field.onChange(content); // Update form field only if within limits
                                // If you still need a local state to revert, you'll need to reintroduce quillRef
                                // and the descriptionContent state, and set the content on the editor directly.
                                // For now, let's assume the Zod schema's validation on submit is sufficient
                                // and we only prevent further typing if the limit is reached.
                              } else {
                                // If the limit is exceeded, you might want to prevent further input
                                // or revert to the previous valid content.
                                // For simplicity, we'll just prevent the field from updating.
                                // If you want to revert, you'll need the quillRef and descriptionContent state.
                                if (field.value !== content) { // Only prevent if content actually changed
                                    // This part is tricky without direct ref.
                                    // A common approach is to use a controlled component with local state
                                    // and only update it if valid, then pass that to field.onChange.
                                    // For now, let's just not call field.onChange if limit is exceeded.
                                }
                              }
                              // Trigger validation to show error message immediately
                              trigger('description');
                            }}
                            onBlur={(range, source, editor) => {
                              // Trigger validation on blur to catch any final changes
                              trigger('description');
                            }}
                            placeholder={`Enter description (maximum ${MAX_DESCRIPTION_LINES} lines)...`}
                          />
                        )
                      }}
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
                      <Input maxLength={40} id="defect_description" className='my-auto' {...register('defect_description')} />
                      {errors.defect_description && (
                        <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                    )}
                  </div>
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

