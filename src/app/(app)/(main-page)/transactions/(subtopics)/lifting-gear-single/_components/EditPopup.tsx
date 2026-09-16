// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
// import { z, object, string, TypeOf } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import dynamic from 'next/dynamic';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import {
//   DialogContent,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import SafetyChecklist from '@/components/safety-checklist';
// import { useSubtopic } from '@/context/SubtopicContext';
// import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
// import { makeApiCall } from '@/lib/apicaller';
// import { MasterService } from '@/services/api/masters-service';
// import { PlusIcon } from 'lucide-react';

// import AddLocationButton from '../../_components/Location/Location';
// // import AddSiteButton from '../../_components/Site/Site';
// import AddEquipmentButton from '../../_components/Equipments/Equipments';
// import AddStandardButton from '../../_components/Standard/Standard';
// import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
// import AddOwnerButton from '../../_components/Owner/Owner';

// interface EquipmentDetailsEditFormProps {
//   onClose: () => void;
//   id: number; // ID of the equipment record to edit
//   setIsLocation: (value: boolean) => void;
//   setIsEquipment: (value: boolean) => void;
//   setIsStandard: (value: boolean) => void;
//   setIsManufacturer: (value: boolean) => void;
// }

// export default function EquipmentDetailsEditForm({
//   onClose,
//   id,
//   setIsLocation,
//   setIsEquipment,
//   setIsStandard,
//   setIsManufacturer,
// }: EquipmentDetailsEditFormProps) {
//   const [loading, setLoading] = useState(false);
//   const { getAllSingleSubtopic, findRecordById, updateRecord } = useSubtopic();
//   const [testExamChecked, setTestExamChecked] = useState<boolean>(false);
//   const [thoroughExamChecked, setThoroughExamChecked] = useState<boolean>(false);
//   const [lastTestExamChecked, setLastTestExamChecked] = useState<boolean>(false);
//   const [lastThoroughExamChecked, setLastThoroughExamChecked] = useState<boolean>(false);
//   const [testExamNotAvailable, setTestExamNotAvailable] = useState<boolean>(false);
//   const [thoroughExamNotAvailable, setThoroughExamNotAvailable] = useState<boolean>(false);
//   const [lastTestExamNotAvailable, setLastTestExamNotAvailable] = useState<boolean>(false);
//   const [lastThoroughExamNotAvailable, setLastThoroughExamNotAvailable] = useState<boolean>(false);
//   const [invoke, setInvoke] = useState(false);
//   const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
//   const [isOwnerTyping, setIsOwnerTyping] = useState(false);
//   const [isStandardTyping, setIsStandardTyping] = useState(false);

//   const existingData = id ? findRecordById(id) : null;
//   const equipmentNoChanged = (value: string, field: any) => {
//     // console.log("Selected equipment no:", value)
//     const selectedEquipment = equipmentNoOptions.find((item) => item.id == value);
//     if (selectedEquipment) {
//       setValue('standard', String(selectedEquipment.standard) || '');
//       setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
//       const owner = ownerOptions.find(o => o.id === selectedEquipment.owner_id);
//       setValue('owner_name', owner ? owner.name : '');
//       setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || '');
//       setValue('safe_working_load', String(selectedEquipment.safe_working_load) || '');
//       setValue('proof_load', String(selectedEquipment.proof_load) || '');
//       setValue('equipment_description', String(selectedEquipment.description) || '');
//       setValue('title', String(selectedEquipment.title) || '');
//       setValue('last_test_exam', String(selectedEquipment.last_test_date) || '');
//       setValue('next_test_exam', String(selectedEquipment.next_test_date) || '');
//       setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || '');
//       setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || '');
//       setTestExamChecked(!selectedEquipment.next_test_date);
//       setThoroughExamChecked(!selectedEquipment.next_thorough_date);
//       setLastTestExamChecked(!selectedEquipment.last_test_date);
//       setLastThoroughExamChecked(!selectedEquipment.last_thorough_date);
//     }
//     field.onChange(value)
//   }
//    // Define schema for validation
//   const equipmentDetailsSchema = object({
//     inspection_date: string().nonempty('Inspection Date is required'),
//     // site: string().nonempty('Site is required'),
//     authority: string().nonempty('Authority is required'),
//     standard: string().nonempty('Standard is required'),
//     job_order_no: string().nonempty('Job Order No. is required'),
//     equipment_no: string().nonempty('Equipment No. is required'),
//     title: string().nonempty('Title is required'),
//     test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
//     safe_working_load: string().nonempty('Safe Working Load is required'),
//     last_test_exam: string().optional(),
//     next_test_exam: string().optional(),
//     last_thorough_exam: string().optional(),
//     next_thorough_exam: string().optional(),
//     result: string().nonempty('Result is required'),
//     type_of_exam: string().nonempty('Type of Exam is required'),
//     surveyor: string().nonempty('Surveyor is required'),
//     defect_description: string().nonempty('Defect Description is required'),
//     last_test_exam_certificate_no: string().optional(),
//     // next_test_exam_certificate_no: string().optional(), // REMOVED
//     last_thorough_exam_certificate_no: string().optional(),
//     // next_thorough_exam_certificate_no: string().optional(), // REMOVED
//     location: string().nonempty('Location is required'),
//     owner_name: string().nonempty('Owner Name is required'),
//     proof_load: string().nonempty('Proof Load is required'),
//     description: string().nonempty('Description is required'),
//     equipment_description: string().nonempty('Equipment Description is required'),
//     manufacturer: string().nonempty('Manufacturer is required'),
//     approval_status: string().nonempty('Approval Status is required'),
//   });

//   type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;
// // console.log("Existing data for edit:", existingData)
// // console.log("Existing data for edit:", existingData?.surveyor)
//   const methods = useForm<EquipmentDetailsInput>({
//     resolver: zodResolver(equipmentDetailsSchema),
//     defaultValues: {
//       inspection_date: existingData?.inspection_date || '',
//       // site: String(existingData?.site) || '',
//       authority: String(existingData?.authority) || '',
//       standard: String(existingData?.standard) || '',
//       job_order_no: String(existingData?.job_order_no) || '',
//       equipment_no: String(existingData?.equipment_no) || '',
//       title: existingData?.title || '',
//       test_cert_coc_no: existingData?.test_cert_coc_no || '',
//       safe_working_load: existingData?.safe_working_load || '',
//       last_test_exam: existingData?.last_test_exam || '',
//       next_test_exam: existingData?.next_test_exam || '',
//       last_thorough_exam: existingData?.last_thorough_exam || '',
//       next_thorough_exam: existingData?.next_thorough_exam || '',
//       last_test_exam_certificate_no: existingData?.last_test_exam_certificate_no || '',
//       last_thorough_exam_certificate_no: existingData?.last_thorough_exam_certificate_no || '',
//       result: existingData?.result || '',
//       type_of_exam: existingData?.type_of_exam || '',
//       surveyor: String(existingData?.surveyor) || '',
//       defect_description: existingData?.defect_description || '',
//       location: String(existingData?.location) || '5',
//       owner_name: String(existingData?.owner_name) || '',
//       proof_load: String(existingData?.proof_load) || '',
//       description: String(existingData?.description) || '',
//       equipment_description: String(existingData?.equipment_description) || '',
//       manufacturer: String(existingData?.manufacturer) || '',
//       approval_status: existingData?.approval_status ? 'Approved' : 'Not Approved',
//     },
//   });

//   const {
//     reset,
//     handleSubmit,
//     control,
//     register,
//     formState: { isSubmitSuccessful, errors },
//     watch,
//     setValue,
//   } = methods;

//   const [siteOptions, setSiteOptions] = useState<any[]>([]);
//   const [authorityOptions, setAuthorityOptions] = useState<any[]>([]);
//   const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any[]>([]);
//   const [equipmentNoOptions, setEquipmentNoOptions] = useState<any[]>([]);
//   const [standardOptions, setStandardOptions] = useState<any[]>([]);
//   const [manufacturerOptions, setManufacturerOptions] = useState<any[]>([]);
//   const [surveyorOptions, setSurveyorOptions] = useState<any>([]);
//   const [ownerOptions, setOwnerOptions] = useState<any[]>([]);
//   const [locationOptions, setLocationOptions] = useState<any[]>([]);

//   const [safetyChecklistValues, setSafetyChecklistValues] = useState({
//     firstExamination: 'no',
//     sixMonthInterval: 'no',
//     twelveMonthInterval: 'no',
//     correctInstallation: 'no',
//     examinationScheme: 'no',
//     exceptionalCircumstances: 'no',
//     safeToUse: 'no'
//   });

//   // Fetch existing equipment data
//   useEffect(() => {
//     const fetchEquipmentData = async () => {
//       const data = await findRecordById(id);
//       if (data) {
//         // helper to convert nullable boolean to checklist value
//         const mapChecklist = (val: boolean | null | undefined): string => {
//           if (val === null || val === undefined) return ""; // leave both checkboxes unticked
//           return val ? "yes" : "no";
//         };
//         setSafetyChecklistValues({
//           // firstExamination: data.first_examination ? 'yes' : 'no',
//           // sixMonthInterval: data.six_month_interval ? 'yes' : 'no',
//           // twelveMonthInterval: data.twelve_month_interval ? 'yes' : 'no',
//           // correctInstallation: data.correct_installation ? 'yes' : 'no',
//           // examinationScheme: data.examination_scheme ? 'yes' : 'no',
//           // exceptionalCircumstances: data.exceptional_circumstances ? 'yes' : 'no',
//           // safeToUse: data.safe_to_use ? 'yes' : 'no',
//           firstExamination: mapChecklist(data.first_examination),
//           sixMonthInterval: mapChecklist(data.six_month_interval),
//           twelveMonthInterval: mapChecklist(data.twelve_month_interval),
//           correctInstallation: mapChecklist(data.correct_installation),
//           examinationScheme: mapChecklist(data.examination_scheme),
//           exceptionalCircumstances: mapChecklist(data.exceptional_circumstances),
//           safeToUse: mapChecklist(data.safe_to_use),
//         });

//         // Store the original values regardless of checkbox state
//         setValue('last_test_exam', data.last_test_exam || '');
//         setValue('last_thorough_exam', data.last_thorough_exam || '');
//         setValue('next_test_exam', data.next_test_exam || '');
//         setValue('next_thorough_exam', data.next_thorough_exam || '');
//         // console.log("data",data)
//         // Now set the checkboxes based on those values
//         setTestExamChecked(data.next_test_exam === "Not Applicable");
//         setThoroughExamChecked(data.next_thorough_exam === "Not Applicable");
//         setLastTestExamChecked(data.last_test_exam === "Not Applicable");
//         setLastThoroughExamChecked(data.last_thorough_exam === "Not Applicable");
        
//         setTestExamNotAvailable(data.next_test_exam === "Not Available");
//         setThoroughExamNotAvailable(data.next_thorough_exam === "Not Available");
//         setLastTestExamNotAvailable(data.last_test_exam === "Not Available");
//         setLastThoroughExamNotAvailable(data.last_thorough_exam === "Not Available");
//       }
//     };

//     fetchEquipmentData();
//     // eslint-disable-next-line
//   }, [id]);

//   // Fetch select options on mount
//   useEffect(() => {
//     const fetchOptions = async () => {
//       // const [sites, authorities, jobOrders, equipments, standards, manufacturers, surveyors, owners] = await Promise.all([
//       const [authorities, jobOrders, equipments, standards, manufacturers, surveyors, owners] = await Promise.all([
//         // getAllSingleSubtopic("site"),
//         getAllSingleSubtopic("authority"),
//         getAllSingleSubtopic("job_orders"),
//         getAllSingleSubtopic("equipment"),
//         getAllSingleSubtopic("standard"),
//         getAllSingleSubtopic("manufacturer"),
//         getAllSingleSubtopic("surveyor"),
//         getAllSingleSubtopic("owner")
//       ]);
//       // setSiteOptions(sites?.filter((item: any) => item.status === "ACTIVE") || []);
//       setAuthorityOptions(authorities?.filter((item: any) => item.status === "ACTIVE") || []);
//       setJobOrderNoOptions(jobOrders || []);
//       setEquipmentNoOptions(equipments?.filter((item: any) => item.status === "ACTIVE") || []);
//       setStandardOptions(standards?.filter((item: any) => item.status === "ACTIVE") || []);
//       setManufacturerOptions(manufacturers?.filter((item: any) => item.status === "ACTIVE") || []);
//       setSurveyorOptions(surveyors);
//       setOwnerOptions(owners?.filter((item: any) => item.status === "ACTIVE") || []);
//     };

//     fetchOptions();
//     // eslint-disable-next-line
//   }, [getAllSingleSubtopic, invoke]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       await makeApiCall(() => new MasterService().getLocationDetails(), {
//         afterSuccess: (data: any) => {
//           if (data) {
//             setLocationOptions(data);
//           }
//         }
//       });
//     };
//     fetchLocations();
//   }, []);

 

//   const job_order_no = watch('job_order_no');
//   useEffect(() => {
//     if (job_order_no) {
//       const job_order = jobOrderNoOptions.find((item: any) => item.id == job_order_no);

//       if (job_order) {
//         setValue('surveyor', job_order.surveyor)
//         setValue('location', job_order.location)
//       }
//     }
//     // eslint-disable-next-line
//   }, [job_order_no]);
//    const equipment_no = watch('equipment_no');
  
//   useEffect(() => {
//     if (isSubmitSuccessful) {
//       reset();
//     }
//   }, [isSubmitSuccessful, reset]);

//   const handleSafetyChecklistChange = (name: string, value: string) => {
//     setSafetyChecklistValues(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
//     setLoading(true);
//     try {
//       const formData = {
//         ...values,
//         last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? "" : values.last_test_exam_certificate_no,
//         // next_test_exam_certificate_no: testExamChecked ? "" : values.next_test_exam_certificate_no, // REMOVED
//         last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? "" : values.last_thorough_exam_certificate_no,
//         // next_thorough_exam_certificate_no: thoroughExamChecked ? "" : values.next_thorough_exam_certificate_no, // REMOVED
//         // first_examination: safetyChecklistValues.firstExamination === "no" ? false : true,
//         first_examination:safetyChecklistValues.firstExamination === "yes"? true:safetyChecklistValues.firstExamination === "no"? false:null,
//         // six_month_interval: safetyChecklistValues.sixMonthInterval === "no" ? false : true,
//         six_month_interval:safetyChecklistValues.sixMonthInterval === "yes"? true:safetyChecklistValues.sixMonthInterval === "no"? false:null,
//         // twelve_month_interval: safetyChecklistValues.twelveMonthInterval === "no" ? false : true,
//         twelve_month_interval:safetyChecklistValues.twelveMonthInterval === "yes"? true:safetyChecklistValues.twelveMonthInterval === "no"? false:null,
//         // correct_installation: safetyChecklistValues.correctInstallation === "no" ? false : true,
//         correct_installation:safetyChecklistValues.correctInstallation === "yes"? true:safetyChecklistValues.correctInstallation === "no"? false:null,
//         // examination_scheme: safetyChecklistValues.examinationScheme === "no" ? false : true,
//         examination_scheme:safetyChecklistValues.examinationScheme === "yes"? true:safetyChecklistValues.examinationScheme === "no"? false:null,
//         // exceptional_circumstances: safetyChecklistValues.exceptionalCircumstances === "no" ? false : true,
//         exceptional_circumstances:safetyChecklistValues.exceptionalCircumstances === "yes"? true:safetyChecklistValues.exceptionalCircumstances === "no"? false:null,
//         // safe_to_use: safetyChecklistValues.safeToUse === "no" ? false : true,
//         safe_to_use:safetyChecklistValues.safeToUse === "yes"? true:safetyChecklistValues.safeToUse === "no"? false:null,
//         approval_status: values.approval_status === "Approved" ? true : false,
//         last_test_exam: lastTestExamChecked ? "Not Applicable" : (lastTestExamNotAvailable ? "Not Available" : values.last_test_exam),
//         last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : (lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam),
//         next_test_exam: testExamChecked ? "Not Applicable" : (testExamNotAvailable ? "Not Available" : values.next_test_exam),
//         next_thorough_exam: thoroughExamChecked ? "Not Applicable" : (thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam)
//       };
//       // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
//       console.log("Edit form data:",formData)
//       // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
//       await updateRecord(id, formData);

//       toastWithTimeout(ToastVariant.Success, 'Equipment details updated successfully');
//       onClose();
//     } catch (error) {
//       console.error('Form submission error:', error);
//       toastWithTimeout(ToastVariant.Error, 'An error occurred while updating the equipment details');
//     } finally {
//       setLoading(false);
//       onClose();
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="w-full border-0 p-0 hover:bg-white">
//         <CardContent>
//           <FormProvider {...methods}>
//             <form
//               className="space-y-4"
//               noValidate
//               autoComplete="off"
//               onSubmit={handleSubmit(onSubmitHandler)}
//             >
//               <div className="space-y-4 pt-10">

//                 {/* CERTIFICATE For Lifting Gear Title */}
//                 <h2 className={"text-base font-bold"}>CERTIFICATE For Lifting Gear Single</h2>

//                 <div className={"grid gap-4 grid-cols-2"}>
//                   {/* Inspection Date */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="inspection_date" className="mt-3">Inspection Date</Label>
//                     <Input id="inspection_date" type="date" {...register('inspection_date')} />
//                     {errors.inspection_date && (
//                       <p className="text-red-500 text-[12px] ">{errors.inspection_date.message}</p>
//                     )}
//                   </div>

//                   {/* Location */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="location" className="mt-3">Location</Label>
//                     <div className='relative'>
//                       <Controller
//                         name="location"
//                         control={control}
//                         render={({ field }) => (
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <SelectTrigger id="location">
//                               <SelectValue placeholder="Select location" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {locationOptions?.map((loc: any) => (
//                                 <SelectItem key={loc.id} value={String(loc.location.id)}>
//                                   {loc.location.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                       <AddLocationButton />
//                       {errors.location && (
//                         <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Authority */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="authority" className="mt-3">Authority</Label>
//                     <Controller
//                       name="authority"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger id="authority">
//                             <SelectValue placeholder="Select authority" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {authorityOptions?.map((authority: any) => (
//                               <SelectItem key={authority.id} value={String(authority.id)}>
//                                 {authority?.authority}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.authority && (
//                       <p className="text-red-500 text-[12px] ">{errors.authority.message}</p>
//                     )}
//                   </div>

//                   {/* Type of Exam */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="type_of_exam" className="mt-3">Type of Exam</Label>
//                     <Controller
//                       name="type_of_exam"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger id="type_of_exam">
//                             <SelectValue placeholder="Select type of exam" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Test">Test</SelectItem>
//                             <SelectItem value="Thorough">Thorough</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.type_of_exam && (
//                       <p className="text-red-500 text-[12px] ">{errors.type_of_exam.message}</p>
//                     )}
//                   </div>

//                   {/* Job Order No. */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="job_order_no" className="mt-3">Job Order No.</Label>
//                     <Controller
//                       name="job_order_no"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger id="job_order_no">
//                             <SelectValue placeholder="Select job order no." />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {jobOrderNoOptions?.map((jobOrder: any) => (
//                               <SelectItem key={jobOrder.id} value={String(jobOrder.id)}>
//                                 {jobOrder?.job_no}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.job_order_no && (
//                       <p className="text-red-500 text-[12px] ">{errors.job_order_no.message}</p>
//                     )}
//                   </div>

//                   {/* Site */}
//                   {/* <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="site" className="mt-3">Site</Label>
//                     <div className='relative'>
//                       <Controller
//                         name="site"
//                         control={control}
//                         render={({ field }) => (
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <SelectTrigger id="site">
//                               <SelectValue placeholder="Select site" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {siteOptions?.map((site: any) => (
//                                 <SelectItem key={site.id} value={String(site.id)}>
//                                   {site?.name ?? site?.site}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                       <AddSiteButton />
//                       {errors.site && (
//                         <p className="text-red-500 text-[12px] ">{errors.site.message}</p>
//                       )}
//                     </div>
//                   </div> */}
//                 </div>

//                 {/* Equipment Information Title */}
//                 <div className="flex justify-between items-center mt-6">
//                   <h2 className="text-base font-bold">Equipment Information</h2>
//                 </div>
//                 <div className="grid gap-4 grid-cols-2">
//                   {/* Equipment No. */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
//                     <div className='relative'>
//                       <Controller
//                         name="equipment_no"
//                         control={control}
//                         render={({ field }) => (
//                           <Select onValueChange={(value) => equipmentNoChanged(value, field)} value={field.value}>
//                             <SelectTrigger id="equipment_no">
//                               <SelectValue placeholder="Select equipment no." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {equipmentNoOptions?.map((equipment: any) => (
//                                 <SelectItem key={equipment.id} value={String(equipment.id)}>
//                                   {equipment?.equipment_no}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                       <AddEquipmentButton />
//                       {errors.equipment_no && (
//                         <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="title" className="mt-3">Title</Label>
//                     <Input
//                       id="title"
//                       {...register('title')}
//                     />
//                     {errors.title && (
//                       <p className="text-red-500 text-[12px] ">{errors.title.message}</p>
//                     )}
//                   </div>
//                 </div>
//                 <section className='grid gap-4 grid-cols-1'>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="equipment_description" className="mt-3">Equipment Description</Label>
//                     <Input maxLength={119}
//                       id="equipment_description"
//                       {...register('equipment_description')}
//                     />
//                     {errors.equipment_description && (
//                       <p className="text-red-500 text-[12px] ">{errors.equipment_description.message}</p>
//                     )}
//                   </div>
//                 </section>
//                 <div className="grid gap-4 grid-cols-2">
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="test_cert_coc_no" className="mt-3">Test Cert/COC No.</Label>
//                     <Input
//                       id="test_cert_coc_no"
//                       {...register('test_cert_coc_no')}
//                     />
//                     {errors.test_cert_coc_no && (
//                       <p className="text-red-500 text-[12px] ">{errors.test_cert_coc_no.message}</p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="safe_working_load" className="mt-3">Safe Working Load</Label>
//                     <Input
//                       id="safe_working_load"
//                       {...register('safe_working_load')}
//                     />
//                     {errors.safe_working_load && (
//                       <p className="text-red-500 text-[12px] ">{errors.safe_working_load.message}</p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="proof_load" className="mt-3">Proof Load:</Label>
//                     <Input
//                       id="proof_load"
//                       {...register('proof_load')}
//                     />
//                     {errors.proof_load && (
//                       <p className="text-red-500 text-[12px] ">{errors.proof_load.message}</p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="standard" className="mt-3">Standard</Label>
//                     <div className='relative'>
//                       <Controller
//                         name="standard"
//                         control={control}
//                         render={({ field }) => {
//                           // Check if value is in options list or needs to be displayed as custom value
//                           const stdItem = standardOptions?.find((std: any) => String(std.id) === field.value);
//                           const displayValue = stdItem ? field.value : field.value;
                          
//                           return (
//                             <Select
//                               value={displayValue}
//                               onValueChange={field.onChange}
//                             >
//                               <SelectTrigger id="standard">
//                                 <SelectValue
//                                   placeholder="Select or type standard"
//                                   {...(stdItem ? {} : { children: stdItem?.standard || field.value })}
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <div className="px-2 py-1 relative">
//                                   <Input
//                                     className="mt-2"
//                                     placeholder="Type standard name"
//                                     value={!isStandardTyping ? field.value : ""}
//                                     onChange={e => {
//                                       setIsStandardTyping(true);
//                                       field.onChange(e.target.value);
//                                     }}
//                                   />
//                                   <Button
//                                     size="icon"
//                                     variant="outline"
//                                     className="absolute bg-primary text-white font-bold right-2 top-3 px-2 py-1"
//                                     onClick={async () => {
//                                       setIsStandardTyping(false);
//                                       if (!field.value) return;
//                                       await makeApiCall(
//                                         () => new MasterService().addStandard({ standard: field.value }),
//                                         {
//                                           afterSuccess: (data: any) => {
//                                             setInvoke((prev) => !prev);
//                                             toastWithTimeout(ToastVariant.Success, "Standard added successfully");
//                                             if (data && data.id) {
//                                               field.onChange(String(data.id));
//                                             } else {
//                                               field.onChange("");
//                                             }
//                                           }
//                                         }
//                                       );
//                                     }}
//                                     type="button"
//                                   >
//                                     Add
//                                   </Button>
//                                 </div>
//                                 {standardOptions?.map((std: any) => (
//                                   <SelectItem key={std.id} value={String(std.id)}>
//                                     {std.standard}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           );
//                         }}
//                       />
//                       <AddStandardButton />
//                       {errors.standard && (
//                         <p className="text-red-500 text-[12px] ">{errors.standard.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   </div>

//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="last_test_exam" className="mt-3">Date of last proof load test</Label>
//                     <div className="flex items-center gap-4">
//                       <Controller
//                         name="last_test_exam"
//                         control={control}
//                         render={({ field }) => (
//                           <Input
//                             id="last_test_exam" className="w-96"
//                             type="date"
//                             {...field}
//                             disabled={lastTestExamChecked || lastTestExamNotAvailable}
//                             value={(lastTestExamChecked || lastTestExamNotAvailable) ? "" : field.value || ""}
//                           />
//                         )}
//                       />
//                       <div className="flex items-center gap-2">
//                       <Checkbox 
//                         className='w-6 h-6' 
//                         checked={lastTestExamChecked} 
//                         onCheckedChange={(checked: any) => {
//                           setLastTestExamChecked(checked);
//                           if (checked) setLastTestExamNotAvailable(false);
//                         }} 
//                       /> 
//                       <span className="text-[13px] mr-4">Not Applicable</span>
//                       <Checkbox 
//                         className='w-6 h-6' 
//                         checked={lastTestExamNotAvailable} 
//                         onCheckedChange={(checked: any) => {
//                           setLastTestExamNotAvailable(checked);
//                           if (checked) setLastTestExamChecked(false);
//                         }} 
//                       /> 
//                       <span className="text-[13px] ">Not Available</span>
//                       </div>
//                       {errors.last_test_exam && (
//                         <p className="text-red-500 text-[12px] ">{errors.last_test_exam.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="last_test_exam_certificate_no" className="mt-3">
//                     Last Proof Load Certificate No.
//                     </Label>
//                     <Input
//                       id="last_test_exam_certificate_no" className="w-96"
//                       disabled={lastTestExamChecked || lastTestExamNotAvailable}
//                       {...register('last_test_exam_certificate_no')}
//                     />
//                   </div>

//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="last_thorough_exam" className="mt-3">Date of last examination</Label>
//                     <div className="flex items-center gap-4">
//                       <Controller
//                         name="last_thorough_exam"
//                         control={control}
//                         render={({ field }) => (
//                           <Input
//                             id="last_thorough_exam" className="w-96"
//                             type="date"
//                             {...field}
//                             disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
//                             value={(lastThoroughExamChecked || lastThoroughExamNotAvailable) ? "" : field.value || ""}
//                           />
//                         )}
//                       />
//                       <Checkbox 
//                         className='w-6 h-6' 
//                         checked={lastThoroughExamChecked} 
//                         onCheckedChange={(checked: any) => {
//                           setLastThoroughExamChecked(checked);
//                           if (checked) setLastThoroughExamNotAvailable(false);
//                         }} 
//                       /> 
//                       <span className="text-[13px] w-[15%] ">Not Applicable</span>
//                       <Checkbox 
//                         className='w-6 h-6' 
//                         checked={lastThoroughExamNotAvailable} 
//                         onCheckedChange={(checked: any) => {
//                           setLastThoroughExamNotAvailable(checked);
//                           if (checked) setLastThoroughExamChecked(false);
//                         }} 
//                       /> 
//                       <span className="text-[13px] w-[15%] ">Not Available</span>
//                       {errors.last_thorough_exam && (
//                         <p className="text-red-500 text-[12px] ">{errors.last_thorough_exam.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="last_thorough_exam_certificate_no" className="mt-3">
//                     Last Examination Certificate No.
//                     </Label>
//                     <Input
//                       id="last_thorough_exam_certificate_no" className="w-96"
//                       disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
//                       {...register('last_thorough_exam_certificate_no')}
//                     />
//                   </div>
//                 {/* </div> */}
//                 {/* <div className="grid gap-4 grid-cols-1 w-full">
//                   <div className="grid grid-cols-[200px_1fr] items-start gap-4"> */}

//                 {/* <div className="grid gap-4 grid-cols-2">
//                   <div className="grid grid-cols-[200px_1fr] gap-4"> */}
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label className='mt-3' htmlFor="next_test_exam">Date of next proof load test</Label>
//                     <div className="flex items-center gap-4">
//                       <Controller
//                         name="next_test_exam"
//                         control={control}
//                         render={({ field }) => (
//                           <Input
//                             id="next_test_exam" className="w-96"
//                             type="date"
//                             {...field}
//                             disabled={testExamChecked || testExamNotAvailable}
//                             value={(testExamChecked || testExamNotAvailable) ? "" : field.value || ""}
//                           />
//                         )}
//                       />
//                       <Checkbox
//                         className='w-6 h-6'
//                         checked={testExamChecked}
//                         onCheckedChange={(checked: any) => {
//                           setTestExamChecked(checked);
//                           if (checked) setTestExamNotAvailable(false);
//                         }}
//                       />
//                       <span className="text-[13px] w-[15%] ">Not Applicable</span>
//                       <Checkbox
//                         className='w-6 h-6'
//                         checked={testExamNotAvailable}
//                         onCheckedChange={(checked: any) => {
//                           setTestExamNotAvailable(checked);
//                           if (checked) setTestExamChecked(false);
//                         }}
//                       />
//                       <span className="text-[13px] w-[15%] ">Not Available</span>
//                       {errors.next_test_exam && (
//                         <p className="text-red-500 text-[12px] ">{errors.next_test_exam.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   {/* </div> */}
//                   {/* REMOVED: Next Test Certificate No. */}
//                   {/* 
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="next_test_exam_certificate_no" className="mt-3">
//                       Next Test Certificate No.
//                     </Label>
//                     <Input
//                       className='w-[37%]'
//                       id="next_test_exam_certificate_no"
//                       disabled={testExamChecked}
//                       {...register('next_test_exam_certificate_no')}
//                     />
//                   </div>
//                   */}
// {/* 
//                   <div className="grid gap-4 grid-cols-1 w-full">
//                     <div className="grid grid-cols-[200px_1fr] gap-4"> */}
//                       {/* <div className="grid gap-4 grid-cols-2">
//                         <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4"> */}
//                       <div className="grid grid-cols-[200px_1fr] gap-4">
//                       <Label className='mt-3' htmlFor={"next_thorough_exam"}>Date of next examination</Label>
//                       <div className="flex items-center gap-4">
//                         <Controller
//                           name={"next_thorough_exam"}
//                           control={control}
//                           render={({ field }) => (
//                             <Input
//                               id={"next_thorough_exam"}
//                               type="date"
//                               {...field}
//                               className='w-96'
//                               disabled={thoroughExamChecked || thoroughExamNotAvailable}
//                               value={(thoroughExamChecked || thoroughExamNotAvailable) ? "" : field.value || ""}
//                             />
//                           )}
//                         />
//                         <div className="flex items-center gap-2">
//                         <Checkbox
//                           className={'w-6 h-6'}
//                           checked={thoroughExamChecked}
//                           onCheckedChange={(checked: any) => {
//                             setThoroughExamChecked(checked);
//                             if (checked) setThoroughExamNotAvailable(false);
//                           }}
//                         />
//                         <span className="text-[13px] mr-4 ">Not Applicable</span>
//                         <Checkbox
//                           className={'w-6 h-6'}
//                           checked={thoroughExamNotAvailable}
//                           onCheckedChange={(checked: any) => {
//                             setThoroughExamNotAvailable(checked);
//                             if (checked) setThoroughExamChecked(false);
//                           }}
//                         />
//                         <span className="text-[13px] ">Not Available</span>
//                         </div>
//                         {errors.next_thorough_exam && (
//                           <p className="text-red-500 text-[12px] text-[13px]">{errors.next_thorough_exam.message}</p>
//                         )}
//                       </div>
//                     {/* </div> */}
//                   </div>
//                   {/* REMOVED: Next Thorough Certificate No. */}
//                   {/* 
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="next_thorough_exam_certificate_no" className="mt-3">
//                       Next Thorough Certificate No.
//                     </Label>
//                     <Input
//                       className='w-[37%]'
//                       id="next_thorough_exam_certificate_no"
//                       disabled={thoroughExamChecked}
//                       {...register('next_thorough_exam_certificate_no')}
//                     />
//                   </div>
//                   */}
//                 {/* </div> */}

//                 {/* Result Section */}
//                 <div className="grid gap-4 grid-cols-2">
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="result" className="mt-3">Result</Label>
//                     <Controller
//                       name="result"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger id="result">
//                             <SelectValue placeholder="Select result" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Satisfactory">Satisfactory</SelectItem>
//                             <SelectItem value="Scrap">Scrap</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.result && (
//                       <p className="text-red-500 text-[12px] ">{errors.result.message}</p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="owner_name" className="mt-3">Owner Name</Label>
//                     <div className='relative'>
//                       <Controller
//                         name="owner_name"
//                         control={control}
//                         render={({ field }) => {
//                           // Find if selected value matches an option
//                           const ownerItem = ownerOptions?.find((owner: any) => String(owner.id) === field.value);
//                           const displayValue = field.value || "";
                          
//                           return (
//                             <div className="flex w-full gap-2 items-center">
//                               <Select
//                                 value={displayValue}
//                                 onValueChange={(val) => field.onChange(String(val))}
//                               >
//                                 <SelectTrigger id="owner_id" className="w-full">
//                                   <SelectValue
//                                     placeholder="Select or type owner"
//                                     {...(ownerItem ? {} : { children: displayValue })}
//                                   />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <div className="px-2 py-1 relative">
//                                     <>
//                                       <Input
//                                         className="mt-2"
//                                         placeholder="Type owner name"
//                                         value={!isOwnerTyping ? field.value : ""}
//                                         onChange={e => {
//                                           setIsOwnerTyping(true);
//                                           field.onChange(e.target.value);
//                                         }}
//                                       />
//                                       <Button
//                                         size="icon"
//                                         variant="outline"
//                                         className="absolute bg-primary text-white font-bold right-2 top-3 px-2 py-1"
//                                         onClick={async () => {
//                                           setIsOwnerTyping(false);
//                                           if (!field.value) return;
//                                           await makeApiCall(
//                                             () => new MasterService().addOwner({ owner: field.value }),
//                                             {
//                                               afterSuccess: (data: any) => {
//                                                 setInvoke((prev) => !prev);
//                                                 toastWithTimeout(ToastVariant.Success, "Owner added successfully");
//                                                 if (data && data.id) {
//                                                   field.onChange(String(data.id));
//                                                 } else {
//                                                   field.onChange("");
//                                                 }
//                                               }
//                                             }
//                                           )
//                                         }}
//                                         type="button"
//                                       >
//                                         Add
//                                       </Button>
//                                     </>
//                                   </div>
//                                   {ownerOptions?.map((owner: any) => (
//                                     <SelectItem key={owner.id} value={String(owner.id)}>
//                                       {owner.owner}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           );
//                         }}
//                       />
//                       <AddOwnerButton />
//                       {errors.owner_name && (
//                         <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="surveyor" className="mt-3">Surveyor</Label>
//                     <Controller
//                       name="surveyor"
//                       control={control}
//                       render={({ field }) => (
//                         // console.log("Surveyor field value:", field.value),
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger id="surveyor">
//                             <SelectValue placeholder="Select surveyor" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {surveyorOptions?.map((surveyor: any) => (
//                               <SelectItem key={surveyor.id} value={String(surveyor.id)}>
//                                 {surveyor.surveyor}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.surveyor && (
//                       <p className="text-red-500 text-[12px] ">{errors.surveyor.message}</p>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
//                     <div className='relative'>
//                       <Controller
//                         name="manufacturer"
//                         control={control}
//                         render={({ field }) => {
//                           // Find if selected value matches an option
//                           const manuItem = manufacturerOptions?.find((manu: any) => String(manu.id) === field.value);
//                           const displayValue = manuItem ? field.value : field.value;
                          
//                           return (
//                             <Select
//                               value={displayValue}
//                               onValueChange={field.onChange}
//                             >
//                               <SelectTrigger id="manufacturer">
//                                 <SelectValue
//                                   placeholder="Select or type manufacturer"
//                                   {...(manuItem ? {} : { children: manuItem?.manufacturer || field.value })}
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <div className="px-2 py-1 relative">
//                                   <Input
//                                     className="mt-2"
//                                     placeholder="Type manufacturer name"
//                                     value={!isManufacturerTyping ? field.value : ""}
//                                     onChange={e => {
//                                       setIsManufacturerTyping(true);
//                                       field.onChange(e.target.value);
//                                     }}
//                                   />
//                                   <Button
//                                     size="icon"
//                                     variant="outline"
//                                     className="absolute bg-primary text-white font-bold right-2 top-3 px-2 py-1"
//                                     onClick={async () => {
//                                       setIsManufacturerTyping(false);
//                                       if (!field.value) return;
//                                       await makeApiCall(
//                                         () => new MasterService().addManufacturer({ manufacturer: field.value }),
//                                         {
//                                           afterSuccess: (data: any) => {
//                                             setInvoke((prev) => !prev);
//                                             toastWithTimeout(ToastVariant.Success, "Manufacturer added successfully");
//                                             if (data && data.id) {
//                                               field.onChange(String(data.id));
//                                             } else {
//                                               field.onChange("");
//                                             }
//                                           }
//                                         }
//                                       );
//                                     }}
//                                     type="button"
//                                   >
//                                     Add
//                                   </Button>
//                                 </div>
//                                 {manufacturerOptions?.map((manu: any) => (
//                                   <SelectItem key={manu.id} value={String(manu.id)}>
//                                     {manu.manufacturer}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           );
//                         }}
//                       />
//                       <AddManufacturerButton />
//                       {errors.manufacturer && (
//                         <p className="text-red-500 text-[12px] ">{errors.manufacturer.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-[200px_1fr] gap-4">
//                     <Label htmlFor="approval_status" className="mt-3">Approval Status</Label>
//                     <Controller
//                       name="approval_status"
//                       control={control}
//                       render={({ field }) => (
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger id="approval_status">
//                             <SelectValue placeholder="Select approval status" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Approved">Approved</SelectItem>
//                             <SelectItem value="Not Approved">Not Approved</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.approval_status && (
//                       <p className="text-red-500 text-[12px] ">{errors.approval_status.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Additional Information Section */}
//                 <div className="space-y-4">
//                   <div className="grid gap-4 grid-cols-1">
//                     <div className="w-full">
//                       <Label htmlFor="description">Description</Label>
//                       <div>
//                     <Controller
//                           name="description"
//                       control={control}
//                       render={({ field }) => (
//                             <ReactQuill
//                               theme="snow"
//                               className="mt-3"
//                               {...field}
//                             />
//                           )}
//                         />
//                         {errors.description && (
//                           <p className="text-red-500 text-[12px] ">{errors.description.message}</p>
//                     )}
//                   </div>
//                   </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="grid gap-4 grid-cols-1">
//                     <SafetyChecklist
//                       values={safetyChecklistValues}
//                       onChange={handleSafetyChecklistChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-4 w-full">
//                   <div className="grid gap-4 grid-cols-1 w-full">
//                     <div className="grid grid-cols-[400px_1fr]  gap-4">
//                       <Label htmlFor="defect_description" className="mt-3 leading-5">Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect:</Label>
//                       <Input  maxLength={45} id="defect_description" className='my-auto' {...register('defect_description')} />
//                       {errors.defect_description && (
//                         <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
//                     )}
//                   </div>
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-4">
//                   <Button
//                     type="reset"
//                     className="px-10"
//                     onClick={onClose}
//                     variant="outline"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border"
//                     type="submit"
//                     disabled={loading}
//                   >
//                     {loading ? 'Saving...' : 'Save'}
//                   </Button>
//                 </div>
//                   </div>
//             </form>
//           </FormProvider>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }









'use client';

import React, { useState, useEffect, useRef } from 'react';
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

import AddLocationButton from '../../_components/Location/Location';
// import AddSiteButton from '../../_components/Site/Site';
import AddEquipmentButton from '../../_components/Equipments/Equipments';
import AddStandardButton from '../../_components/Standard/Standard';
import AddManufacturerButton from '../../_components/Manufacturer/Manufacturer';
import AddOwnerButton from '../../_components/Owner/Owner';

interface EquipmentDetailsEditFormProps {
  onClose: () => void;
  id: number; // ID of the equipment record to edit
  setIsLocation: (value: boolean) => void;
  setIsEquipment: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsManufacturer: (value: boolean) => void;
}

export default function EquipmentDetailsEditForm({
  onClose,
  id,
  setIsLocation,
  setIsEquipment,
  setIsStandard,
  setIsManufacturer,
}: EquipmentDetailsEditFormProps) {
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
  const [invoke, setInvoke] = useState(false);
  const [isManufacturerTyping, setIsManufacturerTyping] = useState(false);
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  const [isStandardTyping, setIsStandardTyping] = useState(false);



    // New constants, state, and ref for ReactQuill line restriction
    const MAX_DESCRIPTION_LINES = 12; // Define your maximum lines here

    // State to hold the last valid description content from ReactQuill
    const [descriptionContent, setDescriptionContent] = useState('');
    // Ref for ReactQuill to access its internal editor instance
    const quillRef = useRef<any>(null);

  const existingData = id ? findRecordById(id) : null;
  const equipmentNoChanged = (value: string, field: any) => {
    // console.log("Selected equipment no:", value)
    const selectedEquipment = equipmentNoOptions.find((item) => item.id == value);
    if (selectedEquipment) {
      setValue('standard', String(selectedEquipment.standard) || '');
      setValue('manufacturer', String(selectedEquipment.manufacturer) || '');
      const owner = ownerOptions.find(o => o.id === selectedEquipment.owner_id);
      setValue('owner_name', owner ? owner.name : '');
      setValue('test_cert_coc_no', String(selectedEquipment.test_certificate_no) || '');
      setValue('safe_working_load', String(selectedEquipment.safe_working_load) || '');
      setValue('proof_load', String(selectedEquipment.proof_load) || '');
      setValue('equipment_description', String(selectedEquipment.description) || '');
      setValue('title', String(selectedEquipment.title) || '');
      setValue('last_test_exam', String(selectedEquipment.last_test_date) || '');
      setValue('next_test_exam', String(selectedEquipment.next_test_date) || '');
      setValue('last_thorough_exam', String(selectedEquipment.last_thorough_date) || '');
      setValue('next_thorough_exam', String(selectedEquipment.next_thorough_date) || '');
      setTestExamChecked(!selectedEquipment.next_test_date);
      setThoroughExamChecked(!selectedEquipment.next_thorough_date);
      setLastTestExamChecked(!selectedEquipment.last_test_date);
      setLastThoroughExamChecked(!selectedEquipment.last_thorough_date);
    }
    field.onChange(value)
  }
   // Define schema for validation
  const equipmentDetailsSchema = object({
    inspection_date: string().nonempty('Inspection Date is required'),
    // site: string().nonempty('Site is required'),
    authority: string().nonempty('Authority is required'),
    standard: string().nonempty('Standard is required'),
    job_order_no: string().nonempty('Job Order No. is required'),
    equipment_no: string().nonempty('Equipment No. is required'),
    title: string().nonempty('Title is required'),
    test_cert_coc_no: string().nonempty('Test Cert/COC No. is required'),
    safe_working_load: string().nonempty('Safe Working Load is required'),
    last_test_exam: string().optional(),
    next_test_exam: string().optional(),
    last_thorough_exam: string().optional(),
    next_thorough_exam: string().optional(),
    result: string().nonempty('Result is required'),
    type_of_exam: string().nonempty('Type of Exam is required'),
    surveyor: string().nonempty('Surveyor is required'),
    defect_description: string().nonempty('Defect Description is required'),
    last_test_exam_certificate_no: string().optional(),
    // next_test_exam_certificate_no: string().optional(), // REMOVED
    last_thorough_exam_certificate_no: string().optional(),
    // next_thorough_exam_certificate_no: string().optional(), // REMOVED
    location: string().nonempty('Location is required'),
    owner_name: string().nonempty('Owner Name is required'),
    proof_load: string().nonempty('Proof Load is required'),
    description: string().nonempty('Description is required')
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
    manufacturer: string().nonempty('Manufacturer is required'),
    approval_status: string().nonempty('Approval Status is required'),
  });

  type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;
// console.log("Existing data for edit:", existingData)
// console.log("Existing data for edit:", existingData?.surveyor)
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      inspection_date: existingData?.inspection_date || '',
      // site: String(existingData?.site) || '',
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
      last_test_exam_certificate_no: existingData?.last_test_exam_certificate_no || '',
      last_thorough_exam_certificate_no: existingData?.last_thorough_exam_certificate_no || '',
      result: existingData?.result || '',
      type_of_exam: existingData?.type_of_exam || '',
      surveyor: String(existingData?.surveyor) || '',
      defect_description: existingData?.defect_description || '',
      location: String(existingData?.location) || '5',
      owner_name: String(existingData?.owner_name) || '',
      proof_load: String(existingData?.proof_load) || '',
      description: String(existingData?.description) || '',
      equipment_description: String(existingData?.equipment_description) || '',
      manufacturer: String(existingData?.manufacturer) || '',
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
    trigger,
  } = methods;

  // Watch description changes and update local state
  useEffect(() => {
    const currentDescriptionValue = methods.watch('description');
    if (currentDescriptionValue !== descriptionContent) {
      setDescriptionContent(currentDescriptionValue || ''); // Set to initial data or empty string
    }
  }, [methods, descriptionContent]);

  const [siteOptions, setSiteOptions] = useState<any[]>([]);
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

  // Fetch existing equipment data
  useEffect(() => {
    const fetchEquipmentData = async () => {
      const data = await findRecordById(id);
      if (data) {
        // helper to convert nullable boolean to checklist value
        const mapChecklist = (val: boolean | null | undefined): string => {
          if (val === null || val === undefined) return ""; // leave both checkboxes unticked
          return val ? "yes" : "no";
        };
        setSafetyChecklistValues({
          // firstExamination: data.first_examination ? 'yes' : 'no',
          // sixMonthInterval: data.six_month_interval ? 'yes' : 'no',
          // twelveMonthInterval: data.twelve_month_interval ? 'yes' : 'no',
          // correctInstallation: data.correct_installation ? 'yes' : 'no',
          // examinationScheme: data.examination_scheme ? 'yes' : 'no',
          // exceptionalCircumstances: data.exceptional_circumstances ? 'yes' : 'no',
          // safeToUse: data.safe_to_use ? 'yes' : 'no',
          firstExamination: mapChecklist(data.first_examination),
          sixMonthInterval: mapChecklist(data.six_month_interval),
          twelveMonthInterval: mapChecklist(data.twelve_month_interval),
          correctInstallation: mapChecklist(data.correct_installation),
          examinationScheme: mapChecklist(data.examination_scheme),
          exceptionalCircumstances: mapChecklist(data.exceptional_circumstances),
          safeToUse: mapChecklist(data.safe_to_use),
        });

        // Store the original values regardless of checkbox state
        setValue('last_test_exam', data.last_test_exam || '');
        setValue('last_thorough_exam', data.last_thorough_exam || '');
        setValue('next_test_exam', data.next_test_exam || '');
        setValue('next_thorough_exam', data.next_thorough_exam || '');
        // console.log("data",data)
        // Now set the checkboxes based on those values
        setTestExamChecked(data.next_test_exam === "Not Applicable");
        setThoroughExamChecked(data.next_thorough_exam === "Not Applicable");
        setLastTestExamChecked(data.last_test_exam === "Not Applicable");
        setLastThoroughExamChecked(data.last_thorough_exam === "Not Applicable");
        
        setTestExamNotAvailable(data.next_test_exam === "Not Available");
        setThoroughExamNotAvailable(data.next_thorough_exam === "Not Available");
        setLastTestExamNotAvailable(data.last_test_exam === "Not Available");
        setLastThoroughExamNotAvailable(data.last_thorough_exam === "Not Available");
      }
    };

    fetchEquipmentData();
    // eslint-disable-next-line
  }, [id]);

  // Fetch select options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      // const [sites, authorities, jobOrders, equipments, standards, manufacturers, surveyors, owners] = await Promise.all([
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
      // setSiteOptions(sites?.filter((item: any) => item.status === "ACTIVE") || []);
      setAuthorityOptions(authorities?.filter((item: any) => item.status === "ACTIVE") || []);
      setJobOrderNoOptions(jobOrders || []);
      setEquipmentNoOptions(equipments?.filter((item: any) => item.status === "ACTIVE") || []);
      setStandardOptions(standards?.filter((item: any) => item.status === "ACTIVE") || []);
      setManufacturerOptions(manufacturers?.filter((item: any) => item.status === "ACTIVE") || []);
      setSurveyorOptions(surveyors);
      setOwnerOptions(owners?.filter((item: any) => item.status === "ACTIVE") || []);
    };

    fetchOptions();
    // eslint-disable-next-line
  }, [getAllSingleSubtopic, invoke]);

  useEffect(() => {
    const fetchLocations = async () => {
      await makeApiCall(() => new MasterService().getLocationDetails(), {
        afterSuccess: (data: any) => {
          if (data) {
            setLocationOptions(data);
          }
        }
      });
    };
    fetchLocations();
  }, []);

 

  const job_order_no = watch('job_order_no');
  useEffect(() => {
    if (job_order_no) {
      const job_order = jobOrderNoOptions.find((item: any) => item.id == job_order_no);

      if (job_order) {
        setValue('surveyor', job_order.surveyor)
        setValue('location', job_order.location)
      }
    }
    // eslint-disable-next-line
  }, [job_order_no]);
   const equipment_no = watch('equipment_no');
  
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
        last_test_exam_certificate_no: lastTestExamChecked || lastTestExamNotAvailable ? "" : values.last_test_exam_certificate_no,
        // next_test_exam_certificate_no: testExamChecked ? "" : values.next_test_exam_certificate_no, // REMOVED
        last_thorough_exam_certificate_no: lastThoroughExamChecked || lastThoroughExamNotAvailable ? "" : values.last_thorough_exam_certificate_no,
        // next_thorough_exam_certificate_no: thoroughExamChecked ? "" : values.next_thorough_exam_certificate_no, // REMOVED
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
        last_test_exam: lastTestExamChecked ? "Not Applicable" : (lastTestExamNotAvailable ? "Not Available" : values.last_test_exam),
        last_thorough_exam: lastThoroughExamChecked ? "Not Applicable" : (lastThoroughExamNotAvailable ? "Not Available" : values.last_thorough_exam),
        next_test_exam: testExamChecked ? "Not Applicable" : (testExamNotAvailable ? "Not Available" : values.next_test_exam),
        next_thorough_exam: thoroughExamChecked ? "Not Applicable" : (thoroughExamNotAvailable ? "Not Available" : values.next_thorough_exam)
      };
      // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      console.log("Edit form data:",formData)
      // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
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
                      <AddLocationButton />
                      {errors.location && (
                        <p className="text-red-500 text-[12px] ">{errors.location.message}</p>
                      )}
                    </div>
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

                  {/* Site */}
                  {/* <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <div className='relative'>
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
                      <AddSiteButton />
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
                <div className="grid gap-4 grid-cols-2">
                  {/* Equipment No. */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="equipment_no" className="mt-3">Equipment No.</Label>
                    <div className='relative'>
                      <Controller
                        name="equipment_no"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={(value) => equipmentNoChanged(value, field)} value={field.value}>
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
                      <AddEquipmentButton />
                      {errors.equipment_no && (
                        <p className="text-red-500 text-[12px] ">{errors.equipment_no.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="title" className="mt-3">Title</Label>
                    <Input
                      id="title"
                      {...register('title')}
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
                        render={({ field }) => {
                          // Check if value is in options list or needs to be displayed as custom value
                          const stdItem = standardOptions?.find((std: any) => String(std.id) === field.value);
                          const displayValue = stdItem ? field.value : field.value;
                          
                          return (
                            <Select
                              value={displayValue}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="standard">
                                <SelectValue
                                  placeholder="Select or type standard"
                                  {...(stdItem ? {} : { children: stdItem?.standard || field.value })}
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
                  </div>

                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="last_test_exam" className="mt-3">Date of last proof load test</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="last_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="last_test_exam" className="w-96"
                            type="date"
                            {...field}
                            disabled={lastTestExamChecked || lastTestExamNotAvailable}
                            value={(lastTestExamChecked || lastTestExamNotAvailable) ? "" : field.value || ""}
                          />
                        )}
                      />
                      <div className="flex items-center gap-2">
                      <Checkbox 
                        className='w-6 h-6' 
                        checked={lastTestExamChecked} 
                        onCheckedChange={(checked: any) => {
                          setLastTestExamChecked(checked);
                          if (checked) setLastTestExamNotAvailable(false);
                        }} 
                      /> 
                      <span className="text-[13px] mr-4">Not Applicable</span>
                      <Checkbox 
                        className='w-6 h-6' 
                        checked={lastTestExamNotAvailable} 
                        onCheckedChange={(checked: any) => {
                          setLastTestExamNotAvailable(checked);
                          if (checked) setLastTestExamChecked(false);
                        }} 
                      /> 
                      <span className="text-[13px] ">Not Available</span>
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
                      id="last_test_exam_certificate_no" className="w-96"
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
                            id="last_thorough_exam" className="w-96"
                            type="date"
                            {...field}
                            disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                            value={(lastThoroughExamChecked || lastThoroughExamNotAvailable) ? "" : field.value || ""}
                          />
                        )}
                      />
                      <Checkbox 
                        className='w-6 h-6' 
                        checked={lastThoroughExamChecked} 
                        onCheckedChange={(checked: any) => {
                          setLastThoroughExamChecked(checked);
                          if (checked) setLastThoroughExamNotAvailable(false);
                        }} 
                      /> 
                      <span className="text-[13px] w-[15%] ">Not Applicable</span>
                      <Checkbox 
                        className='w-6 h-6' 
                        checked={lastThoroughExamNotAvailable} 
                        onCheckedChange={(checked: any) => {
                          setLastThoroughExamNotAvailable(checked);
                          if (checked) setLastThoroughExamChecked(false);
                        }} 
                      /> 
                      <span className="text-[13px] w-[15%] ">Not Available</span>
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
                      disabled={lastThoroughExamChecked || lastThoroughExamNotAvailable}
                      {...register('last_thorough_exam_certificate_no')}
                    />
                  </div>
                {/* </div> */}
                {/* <div className="grid gap-4 grid-cols-1 w-full">
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4"> */}

                {/* <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] gap-4"> */}
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label className='mt-3' htmlFor="next_test_exam">Date of next proof load test</Label>
                    <div className="flex items-center gap-4">
                      <Controller
                        name="next_test_exam"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="next_test_exam" className="w-96"
                            type="date"
                            {...field}
                            disabled={testExamChecked || testExamNotAvailable}
                            value={(testExamChecked || testExamNotAvailable) ? "" : field.value || ""}
                          />
                        )}
                      />
                      <Checkbox
                        className='w-6 h-6'
                        checked={testExamChecked}
                        onCheckedChange={(checked: any) => {
                          setTestExamChecked(checked);
                          if (checked) setTestExamNotAvailable(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%] ">Not Applicable</span>
                      <Checkbox
                        className='w-6 h-6'
                        checked={testExamNotAvailable}
                        onCheckedChange={(checked: any) => {
                          setTestExamNotAvailable(checked);
                          if (checked) setTestExamChecked(false);
                        }}
                      />
                      <span className="text-[13px] w-[15%] ">Not Available</span>
                      {errors.next_test_exam && (
                        <p className="text-red-500 text-[12px] ">{errors.next_test_exam.message}</p>
                      )}
                    </div>
                  </div>
                  {/* </div> */}
                  {/* REMOVED: Next Test Certificate No. */}
                  {/* 
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="next_test_exam_certificate_no" className="mt-3">
                      Next Test Certificate No.
                    </Label>
                    <Input
                      className='w-[37%]'
                      id="next_test_exam_certificate_no"
                      disabled={testExamChecked}
                      {...register('next_test_exam_certificate_no')}
                    />
                  </div>
                  */}
{/* 
                  <div className="grid gap-4 grid-cols-1 w-full">
                    <div className="grid grid-cols-[200px_1fr] gap-4"> */}
                      {/* <div className="grid gap-4 grid-cols-2">
                        <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4"> */}
                      <div className="grid grid-cols-[200px_1fr] gap-4">
                      <Label className='mt-3' htmlFor={"next_thorough_exam"}>Date of next examination</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name={"next_thorough_exam"}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id={"next_thorough_exam"}
                              type="date"
                              {...field}
                              className='w-96'
                              disabled={thoroughExamChecked || thoroughExamNotAvailable}
                              value={(thoroughExamChecked || thoroughExamNotAvailable) ? "" : field.value || ""}
                            />
                          )}
                        />
                        <div className="flex items-center gap-2">
                        <Checkbox
                          className={'w-6 h-6'}
                          checked={thoroughExamChecked}
                          onCheckedChange={(checked: any) => {
                            setThoroughExamChecked(checked);
                            if (checked) setThoroughExamNotAvailable(false);
                          }}
                        />
                        <span className="text-[13px] mr-4 ">Not Applicable</span>
                        <Checkbox
                          className={'w-6 h-6'}
                          checked={thoroughExamNotAvailable}
                          onCheckedChange={(checked: any) => {
                            setThoroughExamNotAvailable(checked);
                            if (checked) setThoroughExamChecked(false);
                          }}
                        />
                        <span className="text-[13px] ">Not Available</span>
                        </div>
                        {errors.next_thorough_exam && (
                          <p className="text-red-500 text-[12px] text-[13px]">{errors.next_thorough_exam.message}</p>
                        )}
                      </div>
                    {/* </div> */}
                  </div>
                  {/* REMOVED: Next Thorough Certificate No. */}
                  {/* 
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="next_thorough_exam_certificate_no" className="mt-3">
                      Next Thorough Certificate No.
                    </Label>
                    <Input
                      className='w-[37%]'
                      id="next_thorough_exam_certificate_no"
                      disabled={thoroughExamChecked}
                      {...register('next_thorough_exam_certificate_no')}
                    />
                  </div>
                  */}
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
                    <div className='relative'>
                      <Controller
                        name="owner_name"
                        control={control}
                        render={({ field }) => {
                          // Find if selected value matches an option
                          const ownerItem = ownerOptions?.find((owner: any) => String(owner.id) === field.value);
                          const displayValue = field.value || "";
                          
                          return (
                            <div className="flex w-full gap-2 items-center">
                              <Select
                                value={displayValue}
                                onValueChange={(val) => field.onChange(String(val))}
                              >
                                <SelectTrigger id="owner_id" className="w-full">
                                  <SelectValue
                                    placeholder="Select or type owner"
                                    {...(ownerItem ? {} : { children: displayValue })}
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
                                        onClick={async () => {
                                          setIsOwnerTyping(false);
                                          if (!field.value) return;
                                          await makeApiCall(
                                            () => new MasterService().addOwner({ owner: field.value }),
                                            {
                                              afterSuccess: (data: any) => {
                                                setInvoke((prev) => !prev);
                                                toastWithTimeout(ToastVariant.Success, "Owner added successfully");
                                                if (data && data.id) {
                                                  field.onChange(String(data.id));
                                                } else {
                                                  field.onChange("");
                                                }
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
                            </div>
                          );
                        }}
                      />
                      <AddOwnerButton />
                      {errors.owner_name && (
                        <p className="text-red-500 text-[12px] ">{errors.owner_name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <Label htmlFor="surveyor" className="mt-3">Surveyor</Label>
                    <Controller
                      name="surveyor"
                      control={control}
                      render={({ field }) => (
                        // console.log("Surveyor field value:", field.value),
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
                    <Label htmlFor="manufacturer" className="mt-3">Manufacturer</Label>
                    <div className='relative'>
                      <Controller
                        name="manufacturer"
                        control={control}
                        render={({ field }) => {
                          // Find if selected value matches an option
                          const manuItem = manufacturerOptions?.find((manu: any) => String(manu.id) === field.value);
                          const displayValue = manuItem ? field.value : field.value;
                          
                          return (
                            <Select
                              value={displayValue}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="manufacturer">
                                <SelectValue
                                  placeholder="Select or type manufacturer"
                                  {...(manuItem ? {} : { children: manuItem?.manufacturer || field.value })}
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
                    render={({ field }) => {
                      return (
                        <ReactQuill
                          ref={quillRef} // Attach ref here to get direct access to Quill editor
                          theme="snow"
                          className="mt-3"
                          value={field.value} // ReactQuill is controlled by react-hook-form's field.value
                          onChange={(content, delta, source, editor) => {
                            // We only want to intervene if the change came from the user typing
                            if (source === 'user') {
                              const plainText = editor.getText(); // Get plain text content from the editor
                              // Count lines based on plain text, filtering out empty strings from splits
                              const lines = plainText.split('\n').filter(line => line.trim() !== '');

                              // If the number of lines now exceeds the maximum allowed
                              if (lines.length > MAX_DESCRIPTION_LINES) {
                                // Revert the editor to the last known valid content
                                if (quillRef.current) {
                                  const editorInstance = quillRef.current.getEditor();
                                  // Set contents silently to avoid re-triggering this onChange handler and causing a loop
                                  editorInstance.setContents(editorInstance.clipboard.convert(descriptionContent), 'silent');
                                  // Position the cursor at the end of the reverted content for better user experience
                                  editorInstance.setSelection(editorInstance.getLength(), 0);
                                }
                                // IMPORTANT: Do NOT call field.onChange(content) here, as this 'content' is invalid.
                                // The form state will retain the 'descriptionContent' (last valid state).
                              } else {
                                // If the content is within limits, update the form field and our local state
                                field.onChange(content);
                                setDescriptionContent(content);
                              }
                            } else {
                              // For changes not initiated by the user (e.g., initial load, programmatic updates),
                              // simply pass the content through to react-hook-form and sync local state.
                              field.onChange(content);
                              setDescriptionContent(content);
                            }

                            // Always trigger validation to update the error message below the input if needed
                            trigger('description');
                          }}
                          onBlur={(range, source, editor) => {
                            // Trigger validation on blur to ensure the error state is accurate after user leaves the field
                            trigger('description');
                          }}
                          placeholder={`Enter description (maximum ${MAX_DESCRIPTION_LINES} lines)...`}
                        />
                      );
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
                      <Input  maxLength={40} id="defect_description" className='my-auto' {...register('defect_description')} />
                      {errors.defect_description && (
                        <p className="text-red-500 text-[12px] ">{errors.defect_description.message}</p>
                    )}
                  </div>
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

