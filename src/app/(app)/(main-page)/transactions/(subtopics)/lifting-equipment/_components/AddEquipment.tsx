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
import dynamic from 'next/dynamic';
import Table from './PropertyTable';
import 'react-quill/dist/quill.snow.css';
import { Checkbox } from '@/components/ui/checkbox';
import SafetyChecklist from '@/components/safety-checklist';
import { useSubtopic } from '@/context/SubtopicContext';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import AnnexuresTable from './AnnexureTable';
import { PlusIcon } from 'lucide-react';
import AddLocationButton from '../../_components/Location/Location';
import AddSiteButton from '../../_components/Site/Site';
import AddEquipmentButton from '../../_components/Equipments/Equipments';
import AddStandardButton from '../../_components/Standard/Standard';
import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
import AddOwnerButton from '../../_components/Owner/Owner';
import { AuthService } from '@/services/api/auth-service';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface EquipmentDetailsFormProps {
  onClose: () => void;
  setIsLocation: (value: boolean) => void;
  setIsEquipment: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsOwner: (value: boolean) => void;
  setIsManufacturer: (value: boolean) => void;
}

export default function EquipmentDetailsForm({
  onClose,
  setIsLocation,
  setIsEquipment,
  setIsStandard,
  setIsOwner,
  setIsManufacturer,
}: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);

  // "Not Applicable" checkboxes for next test/thorough
  const [testExamChecked, setTestExamChecked] = useState(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState(false);
  // "Not Available" checkboxes for next test/thorough
  const [testExamNotAvailable, setTestExamNotAvailable] = useState(false);
  const [thoroughExamNotAvailable, setThoroughExamNotAvailable] = useState(false);

  /**
   * Zod Schema (updated: removed next_test_exam_certificate_no and next_thorough_exam_certificate_no)
   */
  const equipmentDetailsSchema = object({
    inspection_date: string().nonempty('Inspection Date is required'),
    site: string().nonempty('Site is required'),
    authority: string().nonempty('Authority is required'),
    standard: string().nonempty('Standard is required'),
    type_of_exam: string().nonempty('Type of Exam is required'),
    description_of_test: string().nonempty('Description of Test is required').optional(),
    job_order_no: string().nonempty('Job Order No. is required'),
    equipment_no: string().nonempty('Equipment No. is required'),
    title: string().nonempty('Title is required'),
    test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
    safe_working_load: string().nonempty('Safe Working Load is required'),
    last_test_exam: string().nonempty('Last Test Exam is required'),
    next_test_exam: string().optional(),
    last_thorough_exam: string().nonempty('Last Thorough Exam is required'),
    next_thorough_exam: string().optional(),
    last_test_exam_certificate_no: string().optional(),
    last_thorough_exam_certificate_no: string().optional(),
    // next_test_exam_certificate_no: REMOVED
    // next_thorough_exam_certificate_no: REMOVED
    result: string().nonempty('Result is required'),
    surveyor: string().nonempty('Surveyor is required'),
    result_description: string().nonempty('Test Particulars is required'),
    owner_name: string().nonempty('Owner Name is required'),
    description: string().nonempty('Description Date is required').optional(),
    equipment_description: string().nonempty('Equipment Description is required'),
    manufacturer: string().nonempty('Manufacturer is required'),
    approval_status: string().nonempty('Approval Status is required'),
    location: string().nonempty('Location is required'),
    serial_no: string().nonempty('Serial No. is required'),
    registration_no: string().nonempty('Registration No. is required'),
    lift_location: string().nonempty('Lift Location is required').optional(),
    model_no: string().nonempty('Model_no is required'),
    year_of_manufacture: string().nonempty('Year of Manufacture is required'),
    owner_id: string().nonempty('Owner ID is required'),
    defect_description: string().nonempty('Defect Description is required'),
  });

  type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;
  // "Not Applicable" checkboxes for last test/thorough
  const [lastTestExamChecked, setLastTestExamChecked] = useState(false);
  const [lastThoroughExamChecked, setLastThoroughExamChecked] = useState(false);
  // "Not Available" checkboxes for last test/thorough
  const [lastTestExamNotAvailable, setLastTestExamNotAvailable] = useState(false);
  const [lastThoroughExamNotAvailable, setLastThoroughExamNotAvailable] = useState(false);

  const { getAllSingleSubtopic, addRecord } = useSubtopic();

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
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

  // Option states
  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [authorityOptions, setAuthorityOptions] = useState<any[]>([]);
  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any[]>([]);
  const [equipmentNoOptions, setEquipmentNoOptions] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  const [manufacturerOptions, setManufacturerOptions] = useState<any[]>([]);
  const [surveyorOptions, setSurveyorOptions] = useState<any[]>([]);
  const [ownerOptions, setOwnerOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);

  const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  const [isStandardTyping, setIsStandardTyping] = useState(false);


  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [data, setData] = useState<{ [key: string]: string }[]>([]); // For PropertyTable
  const [propertyList, setPropertyList] = useState<any[]>([]); // For AnnexuresTable

  const [safetyChecklistValues, setSafetyChecklistValues] = useState({
    firstExamination: 'no',
    sixMonthInterval: 'no',
    twelveMonthInterval: 'no',
    correctInstallation: 'no',
    examinationScheme: 'no',
    exceptionalCircumstances: 'no',
    safeToUse: 'no',
  });

  // Watch values for select fields
  const equipment_no = watch('equipment_no');
  const location = watch('location');

  // Update "surveyor" when "job_order_no" changes
  const job_order_no = watch('job_order_no');
  useEffect(() => {
    if (job_order_no) {
      const job_order = jobOrderNoOptions.find((item: any) => String(item.id) === String(job_order_no));
      if (job_order) {
        setValue('surveyor', job_order.surveyor ? String(job_order.surveyor) : '');
        setValue('location', job_order.location ? String(job_order.location) : '');
      }
    }
  }, [job_order_no, jobOrderNoOptions, setValue]);

  // Auto-populate fields when equipment_no changes
  useEffect(() => {
    const selected = equipmentNoOptions.find((item: any) => String(item.id) === String(equipment_no));
    setSelectedEquipment(selected);

    if (selected) {
      // Set Standard
      if (selected.standard) {
        // Try to find the standard in the options by id or name
        const foundStandard = standardOptions.find(
          (std: any) =>
            String(std.id) === String(selected.standard) ||
            std.standard === selected.standard
        );
        setValue('standard', foundStandard ? String(foundStandard.id) : String(selected.standard));
      } else {
        setValue('standard', '');
      }

      // Set Manufacturer
      if (selected.manufacturer) {
        const foundManufacturer = manufacturerOptions.find(
          (manu: any) =>
            String(manu.id) === String(selected.manufacturer) ||
            manu.manufacturer === selected.manufacturer
        );
        setValue('manufacturer', foundManufacturer ? String(foundManufacturer.id) : String(selected.manufacturer));
      } else {
        setValue('manufacturer', '');
      }

      setValue('year_of_manufacture', String(selected.year_of_manufacture) || '');
      setValue('test_cert_coc_no', String(selected.test_certificate_no) || '');
      setValue('safe_working_load', String(selected.safe_working_load) || '');
      setValue('equipment_description', String(selected.description) || '');
      setValue('title', String(selected.title) || '');
      setValue('registration_no', String(selected.registration_no) || '');
      setValue('last_test_exam', String(selected.last_test_date) || '');
      setValue('last_test_exam_certificate_no', selected?.last_test_exam_certificate_no ? String(selected?.last_test_exam_certificate_no) : '');
      setValue('next_test_exam', String(selected.next_test_date) || '');
      setValue('last_thorough_exam', String(selected.last_thorough_date) || '');
      setValue('last_thorough_exam_certificate_no', selected?.last_thorough_exam_certificate_no ? String(selected?.last_thorough_exam_certificate_no) : '');
      setValue('next_thorough_exam', String(selected.next_thorough_date) || '');
      setValue('serial_no', String(selected.serial_no) || '');
      setValue('model_no', String(selected.model_no) || '');

      // Set Owner
      if (selected.owner_id) {
        const foundOwner = ownerOptions.find(
          (o: any) =>
            String(o.id) === String(selected.owner_id) ||
            o.owner === selected.owner_id ||
            o.code === selected.owner_id
        );
        setValue('owner_id', foundOwner ? String(foundOwner.id) : String(selected.owner_id));
        setValue('owner_name', foundOwner?.code || '');
      } else {
        setValue('owner_id', '');
        setValue('owner_name', '');
      }
    }
  }, [equipment_no, equipmentNoOptions, setValue, ownerOptions, standardOptions, manufacturerOptions]);

  // Check if next_test_date/next_thorough_date is null -> set checkboxes
  useEffect(() => {
    const selected = equipmentNoOptions?.find((item: any) => String(item?.id) === String(equipment_no));
    if (selected) {
      if (selected.last_test_date === 'Not Applicable') {
        setLastTestExamChecked(true);
        setLastTestExamNotAvailable(false);
      } else if (selected.last_test_date === 'Not Available') {
        setLastTestExamNotAvailable(true);
        setLastTestExamChecked(false);
      } else {
        setLastTestExamChecked(false);
        setLastTestExamNotAvailable(false);
      }
      
      if (selected.last_thorough_date === 'Not Applicable') {
        setLastThoroughExamChecked(true);
        setLastThoroughExamNotAvailable(false);
      } else if (selected.last_thorough_date === 'Not Available') {
        setLastThoroughExamNotAvailable(true);
        setLastThoroughExamChecked(false);
      } else {
        setLastThoroughExamChecked(false);
        setLastThoroughExamNotAvailable(false);
      }
      
      if (selected.next_test_date === 'Not Applicable') {
        setTestExamChecked(true);
        setTestExamNotAvailable(false);
      } else if (selected.next_test_date === 'Not Available') {
        setTestExamNotAvailable(true);
        setTestExamChecked(false);
      } else {
        setTestExamChecked(false);
        setTestExamNotAvailable(false);
      }
      
      if (selected.next_thorough_date === 'Not Applicable') {
        setThoroughExamChecked(true);
        setThoroughExamNotAvailable(false);
      } else if (selected.next_thorough_date === 'Not Available') {
        setThoroughExamNotAvailable(true);
        setThoroughExamChecked(false);
      } else {
        setThoroughExamChecked(false);
        setThoroughExamNotAvailable(false);
      }
    }
  }, [equipment_no, equipmentNoOptions]);

  // Fetch Sites based on Location
  useEffect(() => {
    const res = locationOptions.filter((item: any) => String(item.location.id) === String(location));
    if (res.length > 0) {
      setSiteOptions(res.map((item: any) => item.site));
    }
  }, [location, locationOptions]);

  const [invoke, setInvoke] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        // fetch Surveyor
        const surveyors = await getAllSingleSubtopic('surveyor');
        if (surveyors) setSurveyorOptions(surveyors);

        // fetch Owners
        const owners = await getAllSingleSubtopic('owner');
        if (owners) setOwnerOptions(owners.filter((item: any) => item.status === 'ACTIVE'));

        // fetch Authority
        const authorities = await getAllSingleSubtopic('authority');
        if (authorities) {
          setAuthorityOptions(authorities.filter((item: any) => item.status === 'ACTIVE'));
        }

        // fetch Job Orders
        const jobOrders = await getAllSingleSubtopic('job_orders');
        if (jobOrders) setJobOrderNoOptions(jobOrders);

        // fetch Equipment
        const equipments = await getAllSingleSubtopic('equipment');
        if (equipments) {
          setEquipmentNoOptions(equipments.filter((item: any) => item.status === 'ACTIVE'));
        }

        // fetch Standard
        const standards = await getAllSingleSubtopic('standard');
        if (standards) {
          setStandardOptions(standards.filter((item: any) => item.status === 'ACTIVE'));
        }

        // fetch Manufacturer
        const manufacturers = await getAllSingleSubtopic('manufacturer');
        if (manufacturers) {
          setManufacturerOptions(manufacturers.filter((item: any) => item.status === 'ACTIVE'));
        }

        // fetch Locations
        await makeApiCall(() => new MasterService().getLocationDetails(), {
          afterSuccess: (data: any) => {
            if (data) {
              setLocationOptions(data.filter((item: any) => item.location.status === 'ACTIVE'));
            }
          },
        });
      } catch (error) {
        console.error('Error fetching select options:', error);
        toastWithTimeout(ToastVariant.Error, 'Failed to load form options.');
      }
    })();
  }, [getAllSingleSubtopic, invoke]);

  // If submission is successful, optionally reset
  useEffect(() => {
    if (isSubmitSuccessful) {
      // reset();
    }
  }, [isSubmitSuccessful, reset]);

  // Handle Safety Checklist
  const handleSafetyChecklistChange = (name: string, value: string) => {
    setSafetyChecklistValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // OnSubmit Handler (updated: do not send next_test_exam_certificate_no and next_thorough_exam_certificate_no)
  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        first_examination: safetyChecklistValues.firstExamination === 'no' ? false : true,
        six_month_interval: safetyChecklistValues.sixMonthInterval === 'no' ? false : true,
        twelve_month_interval: safetyChecklistValues.twelveMonthInterval === 'no' ? false : true,
        correct_installation: safetyChecklistValues.correctInstallation === 'no' ? false : true,
        examination_scheme: safetyChecklistValues.examinationScheme === 'no' ? false : true,
        exceptional_circumstances: safetyChecklistValues.exceptionalCircumstances === 'no' ? false : true,
        safe_to_use: safetyChecklistValues.safeToUse === 'no' ? false : true,
        approval_status: values.approval_status === 'Approved' ? true : false,

        // Handle "Not Applicable" and "Not Available" logic
        next_test_exam: testExamChecked ? 'Not Applicable' : (testExamNotAvailable ? 'Not Available' : values.next_test_exam),
        next_thorough_exam: thoroughExamChecked ? 'Not Applicable' : (thoroughExamNotAvailable ? 'Not Available' : values.next_thorough_exam),

        // For last test/thorough
        last_test_exam: lastTestExamChecked ? 'Not Applicable' : (lastTestExamNotAvailable ? 'Not Available' : values.last_test_exam),
        last_thorough_exam: lastThoroughExamChecked ? 'Not Applicable' : (lastThoroughExamNotAvailable ? 'Not Available' : values.last_thorough_exam),
        // Set certificate numbers to empty string when dates are Not Applicable or Not Available
        last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? '' : values.last_test_exam_certificate_no,
        last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? '' : values.last_thorough_exam_certificate_no,
        // next_test_exam_certificate_no and next_thorough_exam_certificate_no are not included
      };

      // Add the property & annexures to the record
      await addRecord(
        {
          ...formData,
          properties: data,
          annexures: propertyList,
        },
        null,
        'lifting_equipment'
      );

      // Optionally remove data from localStorage, close form, etc.
      onClose();
      localStorage.removeItem('equipmentData');
    } catch (error) {
      console.error('Form submission error:', error);
      toastWithTimeout(ToastVariant.Error, 'Failed to save equipment details.');
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
            <form className="space-y-4" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="space-y-4 pt-10">

                {/* CERTIFICATE Title */}
                <h2 className="text-base font-bold">CERTIFICATE For Lifting Equipment Certificate</h2>

                {/* First row of fields */}
                <div className="grid gap-4 grid-cols-2">
                  {/* Inspection Date */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="inspection_date" className="mt-3">
                      Inspection Date
                    </Label>
                    <Input id="inspection_date" type="date" {...register('inspection_date')} />
                    {errors.inspection_date && (
                      <p className="text-red-500 text-[12px] ">{errors.inspection_date.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="location" className="mt-3">
                      Location
                    </Label>
                    <div className="relative">
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

                      {errors.location && (
                        <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Authority */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="authority" className="mt-3">
                      Authority
                    </Label>
                    <Controller
                      name="authority"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="authority">
                            <SelectValue placeholder="Select authority" />
                          </SelectTrigger>
                          <SelectContent>
                            {authorityOptions.map((auth: any) => (
                              <SelectItem key={auth.id} value={String(auth.id)}>
                                {auth.authority}
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
                    <Label htmlFor="type_of_exam" className="mt-3">
                      Type of Exam
                    </Label>
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
                    <Label htmlFor="job_order_no" className="mt-3">
                      Job Order No.
                    </Label>
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

                  {/* Site */}
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4 relative">
                    <Label htmlFor="site" className="mt-3">
                      Site
                    </Label>
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
                    {errors.site && (
                      <p className="text-red-500 text-[12px] ">{errors.site.message}</p>
                    )}
                  </div> */}
                </div>

                {/* Equipment Information Title */}
                <h2 className="text-base font-bold mt-6">Equipment Information</h2>

                {/* Second row of fields */}
                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">
                      Equipment No.
                    </Label>
                    <div className="relative">
                      <Controller
                        name="equipment_no"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
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
                      {errors.equipment_no && (
                        <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">
                      Title
                    </Label>
                    <Input
                      id="title"
                      {...register('title')}
                      value={
                        equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.title ||
                        watch('title')
                      }
                      onChange={(e) => setValue('title', e.target.value)}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                {/* Single-row: Equipment Description */}
                <section className="grid gap-4 grid-cols-1">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_description" className="mt-3">
                      Equipment Description
                    </Label>
                    <Input
                      id="equipment_description"
                      {...register('equipment_description')}
                      value={
                        equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                          ?.description || watch('equipment_description')
                      }
                      onChange={(e) => setValue('equipment_description', e.target.value)}
                    />
                    {errors.equipment_description && (
                      <p className="text-red-500 text-[12px] ">
                        {errors.equipment_description.message}
                      </p>
                    )}
                  </div>
                </section>

                {/* Third row of fields */}
                <div className="grid gap-4 grid-cols-2">
                  {/* Test Cert/COC No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="test_cert_coc_no" className="mt-3">
                      Test Cert/COC No.
                    </Label>
                    <Input
                      id="test_cert_coc_no"
                      {...register('test_cert_coc_no')}
                      value={
                        equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                          ?.test_certificate_no || watch('test_cert_coc_no')
                      }
                      onChange={(e) => setValue('test_cert_coc_no', e.target.value)}
                    />
                    {errors.test_cert_coc_no && (
                      <p className="text-red-500 text-[12px] ">
                        {errors.test_cert_coc_no.message}
                      </p>
                    )}
                  </div>

                  {/* Serial No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="serial_no" className="mt-3">
                      Serial No.
                    </Label>
                    <Input id="serial_no" {...register('serial_no')} />
                    {errors.serial_no && (
                      <p className="text-red-500 text-[12px] ">{errors.serial_no.message}</p>
                    )}
                  </div>

                  {/* Owner No/ID */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_name" className="mt-3">
                      Owner No/ID
                    </Label>
                    <Input id="owner_name" {...register('owner_name')} />
                    {errors.owner_name && (
                      <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
                    )}
                  </div>

                  {/* Model_no */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="model_no" className="mt-3">
                      Model_no
                    </Label>
                    <Input id="model_no" {...register('model_no')} />
                    {errors.model_no && (
                      <p className="text-red-500 text-[12px] ">{errors.model_no.message}</p>
                    )}
                  </div>

                  {/* Manufacturer */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="manufacturer" className="mt-3">
                      Manufacturer
                    </Label>
                    <div className="relative">
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
                            </Select>
                          );
                        }}
                      />
                      <AddManufacturerButton />
                      {errors.manufacturer && (
                        <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Year of Manufacture */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="year_of_manufacture" className="mt-3">
                      Year of Manufacture
                    </Label>
                    <Input
                      id="year_of_manufacture"
                      {...register('year_of_manufacture')}
                      value={
                        equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                          ?.year_of_manufacture || watch('year_of_manufacture')
                      }
                      onChange={(e) => setValue('year_of_manufacture', e.target.value)}
                    />
                    {errors.year_of_manufacture && (
                      <p className="text-red-500 text-[12px] ">
                        {errors.year_of_manufacture.message}
                      </p>
                    )}
                  </div>

                  {/* Reg No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="registration_no" className="mt-3">
                      Reg No.
                    </Label>
                    <Input id="registration_no" {...register('registration_no')} />
                    {errors.registration_no && (
                      <p className="text-red-500 text-[12px] ">
                        {errors.registration_no.message}
                      </p>
                    )}
                  </div>

                  {/* Standard */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="standard" className="mt-3">
                      Standard
                    </Label>
                    <div className="relative">
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
                            </Select>
                          );
                        }}
                      />
                      <AddStandardButton />
                      {errors.standard && (
                        <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Safe Working Load */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="safe_working_load" className="mt-3">
                      Safe Working Load
                    </Label>
                    <Input id="safe_working_load" {...register('safe_working_load')} />
                    {errors.safe_working_load && (
                      <p className="text-red-500 text-[12px] ">
                        {errors.safe_working_load.message}
                      </p>
                    )}
                  </div>

                  {/* Owner Name */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="owner_id" className="mt-3">
                      Owner Name
                    </Label>
                    <div className="relative">
                      <Controller
                        name="owner_id"
                        control={control}
                        render={({ field }) => {
                          const currentOwner = String(
                            equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                              ?.owner_id ?? ""
                          );
                          const allOwnerOptions = ownerOptions?.map((owner: any) => String(owner.id)) || [];
                          const value = currentOwner || field.value || "";

                          return (
                            <div className="flex w-full gap-2 items-center">
                              <Select
                                value={allOwnerOptions.includes(value) ? value : ""}
                                onValueChange={(val) => field.onChange(val)}
                              >
                                <SelectTrigger id="owner_id" className="w-full">
                                  <SelectValue
                                    placeholder="Select or type owner"
                                    // Show typed value if not in options
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
                                                toastWithTimeout(ToastVariant.Success, "Owner added successfully");
                                                field.onChange("");
                                              }
                                            }
                                          );
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
                            </div>
                          );
                        }}
                      />
                      <AddOwnerButton />
                      {errors.owner_id && (
                        <p className="text-red-500 text-[12px] ">{errors.owner_id.message}</p>
                      )}
                    </div>
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
                            <SelectValue placeholder="Select surveyor" />
                          </SelectTrigger>
                          <SelectContent>
                            {surveyorOptions?.map((s: any) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.surveyor}
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
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="tested_standard" className="mt-3">
                      Tested Standard
                    </Label>
                    <Input id="tested_standard" {...register('tested_standard')} />
                    {errors.tested_standard && (
                      <p className="text-red-500 text-[12px] ">
                        {errors.tested_standard.message}
                      </p>
                    )}
                  </div> */}
                </div>
                <div className="grid gap-4 grid-cols-1 w-[64%]  ">
                  {/* Date of last proof load test + Not Applicable */}
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
                            disabled={lastTestExamChecked || lastTestExamNotAvailable}
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item.id == equipment_no)?.last_test_date === 'NOT APPLICABLE'
                                ? ''
                                : (() => {
                                  const dateString = equipmentNoOptions?.find((item: any) => item.id == equipment_no)
                                    ?.last_test_date?.toString().trim() || '';
                                  try {
                                    const date = new Date(dateString);
                                    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
                                  } catch {
                                    return '';
                                  }
                                })()
                            }
                            {...field}
                          />
                        )}
                      />
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastTestExamChecked}
                        onCheckedChange={(checked: any) => {
                          setLastTestExamChecked(checked);
                          if (checked) setLastTestExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Applicable</span>
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastTestExamNotAvailable}
                        onCheckedChange={(checked: any) => {
                          setLastTestExamNotAvailable(checked);
                          if (checked) setLastTestExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Available</span>
                      {errors.last_test_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4 w-[77%]">
                    <Label htmlFor="last_test_exam_certificate_no" className="mt-3">
                      Last Test Certificate No.
                    </Label>
                    <Input
                      disabled={lastTestExamChecked || lastTestExamNotAvailable}
                      id="last_test_exam_certificate_no"
                      {...register('last_test_exam_certificate_no')}
                    />
                  </div>

                  {/* Date of last thorough exam + Not Applicable */}
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
                            disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                                ?.last_thorough_date
                                ? equipmentNoOptions?.find((item: any) => item?.id == equipment_no)?.last_thorough_date === 'NOT APPLICABLE'
                                  ? ''
                                  : equipmentNoOptions.find((item: any) => item.id == equipment_no)?.last_thorough_date
                                : ''
                            }
                            {...field}
                          />
                        )}
                      />
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastThoroughExamChecked}
                        onCheckedChange={(checked: any) => {
                          setLastThoroughExamChecked(checked);
                          if (checked) setLastThoroughExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Applicable</span>
                      <Checkbox
                        className="w-6 h-6"
                        checked={lastThoroughExamNotAvailable}
                        onCheckedChange={(checked: any) => {
                          setLastThoroughExamNotAvailable(checked);
                          if (checked) setLastThoroughExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Available</span>
                      {errors.last_thorough_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4 w-[77%]">
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

                {/* Next exam row */}
                <div className="grid gap-4 grid-cols-1 w-[64%]  ">
                  {/* Next test exam + Not Applicable */}
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="next_test_exam" className="mt-3">
                      Date of next proof load test
                    </Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="next_test_exam"
                            type="date"
                            disabled={testExamChecked || testExamNotAvailable}
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                                ?.next_test_date &&
                                equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                                  ?.next_test_date !== 'NOT APPLICABLE'
                                ?
                                equipmentNoOptions?.find(
                                  (item: any) => item?.id == equipment_no
                                )?.next_test_date
                                : ''
                            }
                            {...field}
                          />
                        )}
                      />
                      <Checkbox
                        className="w-6 h-6"
                        checked={testExamChecked}
                        onCheckedChange={(checked: any) => {
                          setTestExamChecked(checked);
                          if (checked) setTestExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Applicable</span>
                      <Checkbox
                        className="w-6 h-6"
                        checked={testExamNotAvailable}
                        onCheckedChange={(checked: any) => {
                          setTestExamNotAvailable(checked);
                          if (checked) setTestExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Available</span>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px] ">
                          {errors.next_test_exam.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Removed Next Test Certificate No. */}
                  {/* 
                  <div className="grid grid-cols-[200px_1fr] gap-4 ">
                    <Label htmlFor="next_test_exam_certificate_no" className="mt-3">
                      Next Test Certificate No.
                    </Label>
                    <Input
                      id="next_test_exam_certificate_no"
                      disabled={testExamChecked}
                      className='w-[68%]'
                      {...register('next_test_exam_certificate_no')}
                    />
                  </div>
                  */}

                  {/* Next thorough exam + Not Applicable */}
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="next_thorough_exam" className="mt-3">
                      Date of next examination
                    </Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_thorough_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="next_thorough_exam"
                            type="date"
                            disabled={thoroughExamChecked || thoroughExamNotAvailable}
                            defaultValue={
                              equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                                ?.next_thorough_date &&
                                equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                                  ?.next_thorough_date !== 'Not Applicable'
                                ?
                                equipmentNoOptions?.find(
                                  (item: any) => item?.id == equipment_no
                                )?.next_thorough_date
                                : ''
                            }
                            {...field}
                          />
                        )}
                      />
                      <Checkbox
                        className="w-6 h-6"
                        checked={thoroughExamChecked}
                        onCheckedChange={(checked: any) => {
                          setThoroughExamChecked(checked);
                          if (checked) setThoroughExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Applicable</span>
                      <Checkbox
                        className="w-6 h-6"
                        checked={thoroughExamNotAvailable}
                        onCheckedChange={(checked: any) => {
                          setThoroughExamNotAvailable(checked);
                          if (checked) setThoroughExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%]">Not Available</span>
                      {errors.next_thorough_exam && (
                        <p className="text-red-500 text-[12px] ">
                          {errors.next_thorough_exam.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Removed Next Thorough Certificate No. */}
                  {/* 
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="next_thorough_exam_certificate_no" className="mt-3">
                      Next Thorough Certificate No.
                    </Label>
                    <Input
                      id="next_thorough_exam_certificate_no"
                      disabled={thoroughExamChecked}
                      className='w-[68%]'
                      {...register('next_thorough_exam_certificate_no')}
                    />
                  </div>
                  */}

                  {/* Lift Location conditionally shown */}
                  {equipmentNoOptions?.find((item: any) => item?.id == equipment_no)
                    ?.property_table_type === 'ELEVATOR CERTIFICATE' && (
                      <div className="grid grid-cols-[200px_1fr] gap-4">
                        <Label htmlFor="lift_location" className="mt-3">
                          Lift Location
                        </Label>
                        <Input id="lift_location" type="text" {...register('lift_location')} />
                        {errors.lift_location && (
                          <p className="text-red-500 text-[12px] ">{errors.lift_location.message}</p>
                        )}
                      </div>
                    )}
                </div>

                {/* Additional Information (Description) */}
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                      <Label htmlFor="description">Description</Label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" className="mt-3" {...field} />}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-[12px] ">{errors.description.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Result & Test Particulars */}
                <div className="grid gap-4 grid-cols-1 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Result */}
                    <div className="flex">
                      <Label htmlFor="result" className="mt-3 w-1/2">
                        Result
                      </Label>
                      <Controller
                        name="result"
                        control={control}
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

                    {/* result_description */}
                    <div className="flex flex-col">
                      <Textarea id="result_description" {...register('result_description')} />
                      {errors.result_description && (
                        <p className="text-red-500 text-[12px] mt-1">
                          {errors.result_description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Table if item_type !== 'Lifting Accessories' */}
                {selectedEquipment?.item_type !== 'Lifting Accessories' && (
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1">
                      <Table data={data} setData={setData} item_type={selectedEquipment?.property_table_type} />
                    </div>
                  </div>
                )}

                {/* Description of Test */}
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="w-full">
                      <Label htmlFor="description_of_test">Description of Test</Label>
                      <Controller
                        name="description_of_test"
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" className="mt-3" {...field} />}
                      />
                      {errors.description_of_test && (
                        <p className="text-red-500 text-[12px] ">{errors.description_of_test.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Annexures Table */}
                <section className="space-y-4">
                  <section className="grid gap-4 grid-cols-1">
                    <AnnexuresTable
                      propertyList={propertyList}
                      setPropertyList={setPropertyList}
                      id={equipment_no}
                    />
                  </section>
                </section>

                {/* Safety Checklist */}
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <SafetyChecklist values={safetyChecklistValues} onChange={handleSafetyChecklistChange} />
                  </div>
                </div>

                {/* Defect Description */}
                <div className="space-y-4 w-full">
                  <div className="grid gap-4 grid-cols-1 w-full">
                    <div className="grid grid-cols-[400px_1fr] gap-4">
                      <Label htmlFor="defect_description" className="mt-3 leading-5">
                        Identification of any part found to have a defect which is or could become a danger to
                        persons and a description of the defect:
                      </Label>
                      <Input  maxLength={50} id="defect_description" className="my-auto" {...register('defect_description')} />
                      {errors.defect_description && (
                        <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Test Particulars */}
                {/* <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1">
                    <div className="grid grid-cols-[400px_1fr] gap-4">
                      <Label htmlFor="test_particulars" className="mt-3 leading-5">
                        Particulars of any tests carried out as part of the examination
                      </Label>
                      <Input id="test_particulars" {...register('test_particulars')} />
                      {errors.test_particulars && (
                        <p className="text-red-500 text-[12px] ">{errors.test_particulars.message}</p>
                      )}
                    </div>
                  </div>
                </div> */}

                {/* Approval Status */}
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="approval_status" className="mt-3">
                      Approval Status
                    </Label>
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
                      <p className="text-red-500 text-[12px] ">
                        {errors.approval_status.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
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
