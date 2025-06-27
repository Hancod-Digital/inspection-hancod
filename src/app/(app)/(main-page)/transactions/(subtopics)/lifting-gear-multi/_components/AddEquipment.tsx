'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
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
import { useSubtopic } from '@/context/SubtopicContext';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { PlusIcon } from 'lucide-react';

// Dummy Add*Button components for demonstration
import AddOwnerButton from '../../_components/Owner/Owner';
import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
import AddStandardButton from '../../_components/Standard/Standard';
import AddEquipmentButton from '../../_components/Equipments/Equipments';
import AddSiteButton from '../../_components/Site/Site';
import AddLocationButton from '../../_components/Location/Location';
interface AddEquipmentProps {
  onClose: () => void;
  setIsLocation: (value: boolean) => void;
  setIsEquipment: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsManufacturer: (value: boolean) => void;
}

export default function AddEquipment({ onClose, setIsLocation, setIsEquipment, setIsStandard, setIsManufacturer }: AddEquipmentProps) {
  const [loading, setLoading] = useState(false);
  const { getAllSingleSubtopic, addRecord } = useSubtopic();
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


  // Remove next_test_exam_certificate_no and next_thorough_exam_certificate_no from schema
  const equipmentDetailsSchema = object({
    inspection_date: string().nonempty('Inspection Date is required'),
    site: string().nonempty('Site is required'),
    authority: string().nonempty('Authority is required'),  
    standard: string().nonempty('Standard is required'),
    type_of_exam: string().nonempty('Type of Exam is required'),
    job_order_no: string().nonempty('Job Order No. is required'),
    equipment_no: string().nonempty('Equipment No. is required'),
    serial_no: string().optional(),
    title: string().nonempty('Title is required'),
    test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
    safe_working_load: string().nonempty('Safe Working Load is required'),
    last_test_exam: string().nonempty('Last Test Exam is required'),
    next_test_exam: string().optional(),
    last_thorough_exam: string().nonempty('Last Thorough Exam is required'),
    next_thorough_exam: string().optional(),
    result: string().nonempty('Result is required'),
    last_test_exam_certificate_no: string().optional(),
    // next_test_exam_certificate_no: testExamChecked ? string().optional() : string().nonempty('Next Test Exam Certificate No. is required'),
    last_thorough_exam_certificate_no: string().optional(),
    // next_thorough_exam_certificate_no: thoroughExamChecked ? string().optional() : string().nonempty('Next Thorough Exam Certificate No. is required'),
    surveyor: string().nonempty('Surveyor is required'),
    defect_description: string().nonempty('Defect Description is required'),
    owner_name: string().nonempty('Owner Name is required'),
    proof_load: string().nonempty('Proof Load is required'),
    description: string().nonempty('Description Date is required'),
    equipment_description: string().nonempty('Equipment Description is required'),
    manufacturer: string().nonempty('Manufacturer is required'),
    approval_status: string().nonempty('Approval Status is required'),
    location: string().nonempty('Location is required'),
  });

  type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });
  const deleteRecord = async (id: number) => {
    await makeApiCall(() => new MasterService().deleteMultiEquipment(id), {
      afterSuccess: () => {
        setExistingData(existingData.filter(item => item.id != id));
        toastWithTimeout(ToastVariant.Default, 'Equipment deleted successfully')
      }
    })
  }

  const { reset, handleSubmit, control, register, formState: { isSubmitSuccessful, errors } } = methods;
  const [siteOptions, setSiteOptions] = useState<any>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any>([]);
  const [standardOptions, setStandardOptions] = useState<any>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any>([]);
  const [ownerOptions, setOwnerOptions] = useState<any>([])
  const [locationOptions, setLocationOptions] = useState<any>([]);

const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  const [isStandardTyping, setIsStandardTyping] = useState(false);

  const { watch, setValue } = methods
  const { equipment_no, inspection_date, type_of_exam, standard, title, equipment_description, test_cert_coc_no, safe_working_load, proof_load, last_test_exam, last_thorough_exam, next_test_exam, next_thorough_exam, owner_name, manufacturer, approval_status, result, surveyor, location } = watch()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [existingData, setExistingData] = useState<any[]>([]);

  const addEquipmentToMulti = async () => {
    if (!result) {
      toastWithTimeout(ToastVariant.Default, "Result is required")
      return
    } else if (!surveyor) {
      toastWithTimeout(ToastVariant.Default, "Surveyor is required")
      return

    } else if (!approval_status) {
      toastWithTimeout(ToastVariant.Default, "Approval Status is required")
      return
    } else if (!inspection_date) {
      toastWithTimeout(ToastVariant.Default, "Inspection Date is required")
      return

    } else if (!type_of_exam) {
      toastWithTimeout(ToastVariant.Default, "Type of Exam is required")
      return

    } else if (!equipment_no) {
      toastWithTimeout(ToastVariant.Default, "Equipment No. is required")
      return
    }

    const datas = {
      equipment_no, inspection_date, type_of_exam, title, equipment_description, test_cert_coc_no, safe_working_load, proof_load,
      standard: standardOptions?.filter((item: any) => item?.id == standard)[0]?.standard,
      last_test_exam,
      last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : last_thorough_exam,
      next_test_exam,
      next_thorough_exam: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : next_thorough_exam,
      owner_name: ownerOptions?.filter((item: any) => item?.id == owner_name)[0]?.owner,
      manufacturer: manufacturerOptions?.filter((item: any) => item?.id == manufacturer)[0]?.manufacturer,
      result, surveyor, approval_status
    };

    const addEquipmentApiCall = async (payload: any) => {
      await makeApiCall(
        () => new MasterService().addEquipment(payload), {
        afterSuccess: (data: any) => {
          setExistingData([...existingData, data]);
          toastWithTimeout(ToastVariant.Success, "Equipment addded");
          setIsSubmitted(true);
        }
      });
    };

    if (!isAutoFill) {
      const manualData = {
        equipment_no,
        title,
        description: equipment_description,
        manufacturer_name: manufacturer,
        owner_name,
        standard_code: standard,
        surveyor_name: surveyor,
      };

      await makeApiCall(
        () => new MasterService().manualDataEntryFromSingleEquipment(manualData), {
          afterSuccess: async (resp: any) => {
            const newIds = resp?.data?.[0] || {};
            const payload = {
              ...datas,
              equipment_no: newIds.equipment_id,
              manufacturer: newIds.manufacturer_id,
              owner_name: newIds.owner_id,
              standard: newIds.standard_id,
              surveyor: newIds.surveyor_id,
            };
            await addEquipmentApiCall(payload);
          }
        }
      );
    } else {
      await addEquipmentApiCall(datas);
    }
  }

  useEffect(() => {
    if (equipment_no) {
      const selectedEquipment = equipmentNoOptions.find((item: any) => item.id == equipment_no);
      if (selectedEquipment) {
        setValue('standard', selectedEquipment.standard || '');
        setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
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
      const res = locationOptions.filter((item: any) => item.location.id == location);
      if (res.length > 0) {
        // setSiteOptions(res?.map((item: any) => item.site));
        setSiteOptions([])
      }
    };
    fetchSites();
  }, [location, locationOptions]);
  useEffect(() => {
    const fetchSurveyors = async () => {
      const data = await getAllSingleSubtopic("surveyor");
      if (data) {
        setSurveyorOptions(data);
      }
    };
    fetchSurveyors();

    const fetchOwners = async () => {
      const data = await getAllSingleSubtopic('owner')
      if (data) {
        setOwnerOptions(data?.filter((item: any) => item.status === "ACTIVE"))
      }
    }
    fetchOwners()
    const fetchAuthorities = async () => {
      const data = await getAllSingleSubtopic("authority");
      if (data) {
        setAuthorityOptions(data?.filter((item: any) => item.status === "ACTIVE"));
      }
    };
    fetchAuthorities();

    const fetchJobOrderNos = async () => {
      const data = await getAllSingleSubtopic("job_orders");
      if (data) {
        setJobOrderNoOptions(data);
      }
    };
    fetchJobOrderNos();

    const fetchEquipmentNos = async () => {
      const data = await getAllSingleSubtopic("equipment");
      if (data) {
        setEquipmentNoOptions(data?.filter((item: any) => item.status === "ACTIVE"));
      }
    };
    fetchEquipmentNos();

    const fetchStandards = async () => {
      const data = await getAllSingleSubtopic("standard");
      if (data) {
        setStandardOptions(data?.filter((item: any) => item.status === "ACTIVE"));
      }
    };
    fetchStandards();

    const fetchManufacturers = async () => {
      const data = await getAllSingleSubtopic("manufacturer");
      if (data) {
        setManufacturerOptions(data?.filter((item: any) => item.status === "ACTIVE"));
      }
    };
    fetchManufacturers();

    const fetchLocations = async () => {
      await makeApiCall(() => new MasterService().getLocationDetails(), {
        afterSuccess: (data: any) => {
          if (data) {
            setLocationOptions(data?.filter((item: any) => item.location.status === "ACTIVE"));
          }
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
      let finalFormData = {
        ...values,
        last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? "" : (values.last_test_exam_certificate_no || ""),
        last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? "" : (values.last_thorough_exam_certificate_no || ""),
        first_examination: safetyChecklistValues.firstExamination === "no" ? false : true,
        six_month_interval: safetyChecklistValues.sixMonthInterval === "no" ? false : true,
        twelve_month_interval: safetyChecklistValues.twelveMonthInterval === "no" ? false : true,
        correct_installation: safetyChecklistValues.correctInstallation === "no" ? false : true,
        examination_scheme: safetyChecklistValues.examinationScheme === "no" ? false : true,
        exceptional_circumstances: safetyChecklistValues.exceptionalCircumstances === "no" ? false : true,
        safe_to_use: safetyChecklistValues.safeToUse === "no" ? false : true,
        approval_status: values.approval_status === "Approved" ? true : false,
        last_test_exam: lastTestExamChecked ? "Not Applicable" : lastTestExamNotAvailable ? "Not Available" : values.last_test_exam,
        last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam,
        next_test_exam: testExamChecked ? "Not Applicable" : testExamNotAvailable ? "Not Available" : values.next_test_exam,
        next_thorough_exam: thoroughExamChecked ? "Not Applicable" : thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam
      };

      if (!isAutoFill) {
      const manualData = {
        equipment_no: values.equipment_no,
        title: values.title,
        description: values.equipment_description,
        manufacturer_name: values.manufacturer,
        owner_name: values.owner_name,
        standard_code: values.standard,
        surveyor_name: values.surveyor,
        serial_no: values.serial_no,
      };
      await makeApiCall(
        () => new MasterService().manualDataEntryFromSingleEquipment(manualData), {
          afterSuccess: (resp: any) => {
            const ids = resp?.data?.[0] || {};
            finalFormData = {
              ...finalFormData,
              equipment_no: ids.equipment_id,
              manufacturer: ids.manufacturer_id,
              owner_name: ids.owner_id,
              standard: ids.standard_id,
              surveyor: ids.surveyor_id,
            };
          }
        }
      );
    }

    const data = await addRecord(finalFormData, null, "lifting_gear_multi");

      Promise.all(existingData.map((item: any) => {
        return makeApiCall(
          () => new MasterService().updateSubtopicDetails('lifting_gear_multi_equipments', item.id, { lifting_gear_multi_id: data[0]?.id }), {}
        );
      }))
        .then(() => {
          console.log('All updates completed successfully');
        })
        .catch((error) => {
          console.error('Error updating records:', error);
        });

      onClose()
    } catch (error) {
      console.error('Form submission error:', error);
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
              onSubmit={handleSubmit((values) => {
                onSubmitHandler(values);
              })}
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

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="location" className="mt-3">Location</Label>
                    <div className='relative flex gap-2 items-center'>
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
                            <SelectItem value={"Test"}>
                              Test
                            </SelectItem>
                            <SelectItem value={"Thorough"}>
                              Thorough
                            </SelectItem>
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
                    <div className="relative flex gap-2 items-center">
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
                <div className="flex justify-between items-center mt-6">
                  <h2 className="text-base font-bold">Equipment Information</h2>
                </div>
                {/* <h2 className="text-base font-bold mt-6">Equipment Information</h2> */}
                <div className='flex justify-start gap-2 hover:text-black mb-2'>
                  <Button
                    type="button"
                    variant={!isAutoFill ? "default" : "outline"}
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
                    AUTO FILL
                  </Button>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment Information Section */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No </Label>
                    <div className="relative flex gap-2 items-center">
                      
                      {isAutoFill ? (
                      <Controller
                        name="equipment_no"
                        control={control}
                        render={({ field }) => (
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
                            <AddEquipmentButton />
                          </Select>
                          
                        )}
                      />
                    ) : (
                      <Input id="equipment_no" {...register('equipment_no')} />
                    )}
                      
                    </div>
                    {errors.equipment_no && (
                      <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                    )}
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
                    <Input id="title" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.title} {...register('title')} />
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>
                </div>
                <section className='grid gap-4 grid-cols-1'>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
                    <Input maxLength={119} id="equipment_description" value={equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.description} {...register('equipment_description')} />
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
                    <div className="relative flex gap-2 items-center">
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
                      
                    </div>
                    {errors.standard && (
                      <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                    )}
                  </div>

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
                            id="last_test_exam"
                            type="date"
                            defaultValue={
                              (() => {
                                const lastTestDate = equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_test_date;
                                return lastTestDate && lastTestDate !== "" &&
                                  lastTestDate.toUpperCase() !== "NOT AVAILABLE" &&
                                  lastTestDate.toUpperCase() !== "NOT APPLICABLE"
                                  ? new Date(lastTestDate).toISOString().split('T')[0]
                                  : lastTestDate || '';
                              })()
                            }
                            disabled={lastTestExamChecked}
                            {...field}
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
                        }} /> <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={lastTestExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setLastTestExamNotAvailable(true);
                            setLastTestExamChecked(false);
                          } else {
                            setLastTestExamNotAvailable(false);
                          }
                        }} /> <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.last_test_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam_certificate_no" className="mt-3">
                      Certificate No.
                    </Label>
                    <Input
                      id="last_test_exam_certificate_no"
                      disabled={lastTestExamChecked || lastTestExamNotAvailable}
                      {...register('last_test_exam_certificate_no')}
                    />
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
                            id="last_thorough_exam"
                            type="date"
                            defaultValue={
                              (() => {
                                const lastThoroughDate = equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_thorough_date;
                                return lastThoroughDate && lastThoroughDate !== "" &&
                                  lastThoroughDate.toUpperCase() !== "NOT AVAILABLE" &&
                                  lastThoroughDate.toUpperCase() !== "NOT APPLICABLE"
                                  ? new Date(lastThoroughDate).toISOString().split('T')[0]
                                  : lastThoroughDate || '';
                              })()
                            }
                            disabled={lastThoroughExamChecked}
                            {...field}
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
                        }} /> <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={lastThoroughExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setLastThoroughExamNotAvailable(true);
                            setLastThoroughExamChecked(false);
                          } else {
                            setLastThoroughExamNotAvailable(false);
                          }
                        }} /> <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.last_thorough_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_thorough_exam_certificate_no" className="mt-3">
                      Last Thorough Certificate No.
                    </Label>
                    <Input
                      id="last_thorough_exam_certificate_no"
                      disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                      {...register('last_thorough_exam_certificate_no')}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor="next_test_date">Date of next proof load test</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input id="next_test_date" defaultValue={
                            (() => {
                              const nextTestDate = equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_test_date;
                              try {
                                return nextTestDate && nextTestDate !== "" &&
                                  nextTestDate.toUpperCase() !== "NOT AVAILABLE" &&
                                  nextTestDate.toUpperCase() !== "NOT APPLICABLE"
                                  ? new Date(nextTestDate).toISOString().split('T')[0]
                                  : nextTestDate || '';
                              } catch (e) {
                                console.error("Invalid date format:", nextTestDate);
                                return '';
                              }
                            })()
                          } disabled={testExamChecked || testExamNotAvailable} type="date" {...field} />
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
                        }} /> <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={testExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setTestExamNotAvailable(true);
                            setTestExamChecked(false);
                          } else {
                            setTestExamNotAvailable(false);
                          }
                        }} /> <span className="text-[13px]">Not Available</span>
                      </div>
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
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4">
                    <Label className='mt-3' htmlFor={"next_thorough_exam"}>Date of next examination</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name={"next_thorough_exam"}
                        control={control}
                        render={({ field }) => (
                          <Input id={"next_thorough_exam"} defaultValue={
                            (() => {
                              const nextThoroughDate = equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.next_thorough_date;
                              return nextThoroughDate && nextThoroughDate !== "" &&
                                nextThoroughDate.toUpperCase() !== "NOT AVAILABLE" &&
                                nextThoroughDate.toUpperCase() !== "NOT APPLICABLE"
                                ? new Date(nextThoroughDate).toISOString().split('T')[0]
                                : nextThoroughDate || '';
                            })()
                          } disabled={thoroughExamChecked} type="date" {...field} />
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
                        }} /> <span className="text-[13px] mr-4">Not Applicable</span>
                        <Checkbox className='w-6 h-6' checked={thoroughExamNotAvailable} onCheckedChange={(checked) => {
                          if (checked) {
                            setThoroughExamNotAvailable(true);
                            setThoroughExamChecked(false);
                          } else {
                            setThoroughExamNotAvailable(false);
                          }
                        }} /> <span className="text-[13px]">Not Available</span>
                      </div>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px]  text-[13px] ">
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
                </div>
                <div className="grid gap-4 grid-cols-1 ">
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
                        // render={({ field }) => (
                        //   <Select onValueChange={field.onChange} value={field.value}>
                        //     <SelectTrigger id="surveyor">
                        //       <SelectValue placeholder="Select surveyor" />
                        //     </SelectTrigger>
                        //     <SelectContent>
                        //       {surveyorOptions?.map((surveyor: any) => (
                        //         <SelectItem key={surveyor.id} value={String(surveyor.id)}>
                        //           {surveyor.surveyor}
                        //         </SelectItem>
                        //       ))}
                        //     </SelectContent>
                        //   </Select>
                        // )}
                         render={({ field }) => {
                                                const surveyorName =
                                                  surveyorOptions.find(
                                                    (s: any) => String(s.id) === String(field.value)
                                                  )?.surveyor || '';
                                              return <Input id="surveyor" value={surveyorName} disabled />;
                                              }}
                      />
                      {/* ) : (
                        <Input id="surveyor" {...register('surveyor')} />
                      )} */}
                      {errors.surveyor && (
                        <p className="text-red-500 text-[12px] ">{errors.surveyor.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-[200px_1fr] gap-4">
                      <Label htmlFor="manufacturer" className="mt-3">
                        Manufacturer
                      </Label>
                      <div className="relative flex gap-2 items-center">
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
