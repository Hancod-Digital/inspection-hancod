'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, boolean } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, PlusIcon } from 'lucide-react';

import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { useSubtopic } from '@/context/SubtopicContext';




interface EquipmentDetailsFormProps {
  onClose: () => void;
  isManufacturer: boolean;
  isStandard: boolean;
  isLocation: boolean;
  setIsManufacturer: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsLocation: (value: boolean) => void;
}

export default function EquipmentDetailsForm({ onClose,isManufacturer,isStandard,isLocation, setIsManufacturer, setIsStandard, setIsLocation }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState<any>(false);
  const { addRecord, getAllSingleSubtopic } = useSubtopic();

  const [testExamChecked, setTestExamChecked] = useState<any>(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState<any>(false);
  // State variables for select options
  const [minorCategoryOptions, setMinorCategoryOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  const [annexureOptions, setAnnexureOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [ownerOptions, setOwnerOptions] = useState<any[]>([]);

  const [selectedItemType, setSelectedItemType] = useState<string>('');

// Validation schema using Zod
const equipmentDetailsSchema = object({
  minor_category: string().nonempty('Minor Category is required'),
  equipment_no: string().nonempty('Equipment No is required'),
  
  owner_id: string().nonempty('Owner ID  is required'),
  registration_no: string().nonempty('Registration No is required'),
  model_no: string().nonempty('Model No is required'),
  manufacturer: string().nonempty('Supplier is required'),
  test_certificate_no: string().nonempty('Test Certificate No is required'),
  location: string().nonempty('Location is required'),
  title: string().nonempty('Title is required'),
  standard: string().nonempty('Standard is required'),
  thorough_insp_frequency_months: string().nonempty('Thorough inspection frequency in months is required'),
  serial_no: string().nonempty('Serial No is required'),
  annexure: string().nonempty('Annexure is required'),
  year_of_manufacture: string().nonempty('Year of manufacture is required'),
  status: boolean(),
  safe_working_load: string().nonempty('Safe working load is required'),
  last_test_date: string().nonempty('Last test date is required'),
  proof_load: string().nonempty('Proof load is required'),
  next_test_date: testExamChecked ? string().optional() : string().nonempty('Next test date is required'),
  test_insp_frequency: string().nonempty('Test inspection frequency in months is required'),
  last_thorough_date: string().nonempty('Last thorough date is required'),
  next_thorough_date: thoroughExamChecked ? string().optional() : string().nonempty('Next thorough date is required'),
  description: string().nonempty('Description is required'),
  property_table_type: selectedItemType === 'Elevator Certificate' ? string().nonempty('Property table type is required') : string().optional(),
  item_type: string().nonempty('Item type is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        
        // Fetch minor category options
        const minorCategories = await getAllSingleSubtopic('minor_category');
        if (minorCategories) {
          setMinorCategoryOptions(minorCategories);
        }

        // Fetch supplier options
        const suppliers = await getAllSingleSubtopic('manufacturer');
        if (suppliers) {
          setSupplierOptions(suppliers);
        }

        // Fetch standard options
        const standards = await getAllSingleSubtopic('standard');
        if (standards) {
          setStandardOptions(standards);
        }

        // Fetch annexure options
        const annexures = await getAllSingleSubtopic('annexure');
        if (annexures) {
          setAnnexureOptions(annexures);
        }

        // Fetch location options
        const locations = await getAllSingleSubtopic('location');
        if (locations) {
          setLocationOptions(locations);
        }
        // Fetch owner options
        const owners = await getAllSingleSubtopic('owner');
        if (owners) {
          setOwnerOptions(owners);
        }

      
      } catch (error) {
        console.error('Error fetching options:', error);
        // Optionally, handle the error (e.g., show a notification)
      }
    };
    fetchOptions();
  }, [getAllSingleSubtopic]);

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;
console.log(errors)
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true); 
    await addRecord({
      ...values,
      status: values.status === true ? "ACTIVE" : "INACTIVE",
      next_test_date: testExamChecked ? values.next_test_date : null,
      next_thorough_date: thoroughExamChecked ? values.next_thorough_date : null,
      property_table_type: selectedItemType === 'Lifting Equipment' ? values.property_table_type : null,

    });
        setLoading(false);
    onClose();
  };

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === 'item_type') {
        setSelectedItemType(value.item_type!);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 20, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 20, y: 0 }}
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
                <CardHeader>
                  <CardTitle className="text-md">Equipment Details</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    {/* Minor Category and Equipment No */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="minor_category">Minor Category:*</Label>
                      <div>
                        <Controller
                          name="minor_category"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="minor_category">
                                <SelectValue placeholder="Select Minor Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {minorCategoryOptions.map((option: any) => (
                                  <SelectItem key={option.id} value={String(option.id)}>
                                    {option.minor_category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.minor_category && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.minor_category.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Equipment No */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="equipment_no">Equipment No</Label>
                      <div>
                        <Controller
                          name="equipment_no"
                          control={control}
                          render={({ field }) => <Input id="equipment_no" {...field} />}
                        />
                        {errors.equipment_no && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.equipment_no.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Owner ID/Tag No */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3'  htmlFor="owner_id">Owner ID/Tag No</Label>
                      <div>
                      <Controller
                          name="owner_id"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="owner_id">
                                <SelectValue placeholder="Select owner_id" />
                              </SelectTrigger>
                              <SelectContent>
                                {ownerOptions?.map((option: any) => (
                                  <SelectItem key={option.id} value={String(option.id)}>
                                    {option.owner}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.owner_id && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.owner_id.message}
                          </p>
                        )}
                      </div>
                    </div>

                     {/* Title */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="title">Title</Label>
                      <div>
                        <Controller
                          name="title"
                          control={control}
                          render={({ field }) => <Input id="title" {...field} />}
                        />
                        {errors.title && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                    </div>

                   

                    {/* Model No */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="model_no">Model No</Label>
                      <div>
                        <Controller
                          name="model_no"
                          control={control}
                          render={({ field }) => <Input id="model_no" {...field} />}
                        />
                        {errors.model_no && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.model_no.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Supplier/Manufacturer */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="manufacturer">Supplier/Manufacturer</Label>
                      <div className="relative">
                        <Controller
                          name="manufacturer"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="manufacturer">
                                <SelectValue placeholder="Select Supplier" />
                              </SelectTrigger>
                              <SelectContent>
                                {supplierOptions?.map((option: any) => (
                                  <SelectItem key={option.id} value={String(option.id)}>
                                    {option.manufacturer}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Button
                          size="icon"
                          onClick={()=>setIsManufacturer(true)}
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                        {errors.manufacturer && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.manufacturer.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Test Certificate No./COC No. */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="test_certificate_no">Test Certificate No./COC No.</Label>
                      <div>
                        <Controller
                          name="test_certificate_no"
                          control={control}
                          render={({ field }) => <Input id="test_certificate_no" {...field} />}
                        />
                        {errors.test_certificate_no && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.test_certificate_no.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="location">Location:*</Label>
                      <div className="relative">
                        <Controller
                          name="location"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="location">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                {locationOptions?.map((option: any) => (
                                  <SelectItem key={option.id} value={String(option.id)}>
                                    {option.location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Button
                          size="icon"
                          onClick={()=>setIsLocation(true)}
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                        {errors.location && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.location.message}
                          </p>
                        )}
                      </div>
                    </div>

                     {/* Registration No./Plate No. */}
                     <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="registration_no">Registration No./Plate No.</Label>
                      <div>
                        <Controller
                          name="registration_no"
                          control={control}
                          render={({ field }) => <Input id="registration_no" {...field} />}
                        />
                        {errors.registration_no && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.registration_no.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Standard */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="standard">Standard</Label>
                      <div className='relative'>
                        <Controller
                          name="standard"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="standard">
                                <SelectValue placeholder="Select Standard" />
                              </SelectTrigger>
                              <SelectContent>
                                {standardOptions?.map((option: any) => (
                                  <SelectItem key={option.id} value={String(option.id)}>
                                    {option.standard}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={()=>setIsStandard(true)}
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                        {errors.manufacturer && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.manufacturer.message}
                          </p>
                        )}
                        {errors.standard && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.standard.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Serial No. */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="serial_no">Serial No.</Label>
                      <div>
                        <Controller
                          name="serial_no"
                          control={control}
                          render={({ field }) => <Input id="serial_no" {...field} />}
                        />
                        {errors.serial_no && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.serial_no.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Annexure */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="annexure">Annexure</Label>
                      <div>
                        <Controller
                          name="annexure"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="annexure">
                                <SelectValue placeholder="Select Annexure" />
                              </SelectTrigger>
                              <SelectContent>
                                {annexureOptions.map((option: any) => (
                                  <SelectItem key={option.id} value={String(option.id)}>
                                    {option.annexure}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.annexure && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.annexure.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Year of Manufacture */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="year_of_manufacture">Year of Manufacture</Label>
                      <div>
                        <Controller
                          name="year_of_manufacture"
                          control={control}
                          render={({ field }) => (
                            <Input id="year_of_manufacture" type="date" {...field} />
                          )}
                        />
                        {errors.year_of_manufacture && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.year_of_manufacture.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Active */}
                    <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                      <Label  className='mt-3' htmlFor="status">Active</Label>
                      <div>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="status"
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked)}
                            />
                          )}
                        />
                        {errors.status && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.status.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-md w-full">Certificate Details</CardTitle>
                </CardHeader>
                <div className="space-y-4 ">
                  <div className="grid gap-4 grid-cols-2">
                    {/* Safe Working Load */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="safe_working_load">Safe Working Load</Label>
                      <div>
                        <Controller
                          name="safe_working_load"
                          control={control}
                          render={({ field }) => <Input id="safe_working_load" {...field} />}
                        />
                        {errors.safe_working_load && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.safe_working_load.message}
                          </p>
                        )}
                      </div>
                    </div>
                     {/* Test Insp. Frequency (Months) */}
                     <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="test_insp_frequency">
                        Test Insp. Frequency
                      </Label>
                      <div>
                        <Controller
                          name="test_insp_frequency"
                          control={control}
                          render={({ field }) => (
                            <Input id="test_insp_frequency" {...field} />
                          )}
                        />
                        {errors.test_insp_frequency && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.test_insp_frequency.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Last Test Date */}
                    

                    {/* Proof Load */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="proof_load">Proof Load</Label>
                      <div>
                        <Controller
                          name="proof_load"
                          control={control}
                          render={({ field }) => <Input id="proof_load" {...field} />}
                        />
                        {errors.proof_load && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.proof_load.message}
                          </p>
                        )}
                      </div>
                    </div>

                     {/* Thorough Insp. Frequency:(Months) */}
                     <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="thorough_insp_frequency_months">Thorough Insp. Frequency:(Months)</Label>
                      <div>
                        <Controller
                          name="thorough_insp_frequency_months"
                          control={control}
                          render={({ field }) => <Input id="thorough_insp_frequency_months" {...field} />}
                        />
                        {errors.thorough_insp_frequency_months && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.thorough_insp_frequency_months.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="last_test_date">Last Test Date</Label>
                      <div>
                        <Controller
                          name="last_test_date"
                          control={control}
                          render={({ field }) => (
                            <Input id="last_test_date" type="date" {...field} />
                          )}
                        />
                        {errors.last_test_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.last_test_date.message}
                          </p>
                        )}
                      </div>
                    </div>
{/* Last Thorough Exam */}
<div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="last_thorough_date">Last Thorough Exam</Label>
                      <div>
                        <Controller
                          name="last_thorough_date"
                          control={control}
                          render={({ field }) => (
                            <Input id="last_thorough_date" type="date" {...field} />
                          )}
                        />
                        {errors.last_thorough_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.last_thorough_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                    </div>
                    {/* Next Test Date */}
                    <div className="grid gap-4 grid-cols-1">
                    <div className="grid grid-cols-[200px_1fr] w-[64.2%]  items-start gap-4">
                      <Label  className='mt-3' htmlFor="next_test_date">Next Test Date</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="next_test_date"
                          control={control}
                          render={({ field }) => (
                            <Input id="next_test_date" disabled={testExamChecked} type="date" {...field} />
                          )}
                        />
                        <Checkbox className='w-6 h-6' checked={testExamChecked} onCheckedChange={(checked) => setTestExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                        {errors.next_test_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.next_test_date.message}
                          </p>
                        )}
                      </div>
                    </div>

                     
</div>
                   

                    
                                     
                    <div className="grid gap-4 grid-cols-1">
                    {/* Next Thorough Exam */}
                    <div className="grid grid-cols-[200px_1fr] w-[64.2%]  items-start gap-4">                      <Label  className='mt-3' htmlFor="next_thorough_date">Next Thorough Exam</Label>
                      <div className="flex items-center gap-4 w-full ">
                        <Controller
                          name="next_thorough_date"
                          control={control}
                          render={({ field }) => (
                            <Input id="next_thorough_date" disabled={thoroughExamChecked} type="date" {...field} />
                          )}
                        />
                        <Checkbox className='w-6 h-6' checked={thoroughExamChecked} onCheckedChange={(checked) => setThoroughExamChecked(checked)} /> <span className="text-[13px] w-[33%] ">Not Applicable</span>
                        {errors.next_thorough_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.next_thorough_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="item_type">Item Type</Label>
                      <div>
                        <Controller
                          name="item_type"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="item_type">
                                <SelectValue placeholder="Select Equipment Type" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem   value={'Lifting Equipment'}>
                                   Lifting Equipment
                                  </SelectItem>
                                  <SelectItem   value={'Lifting Accessories'}>
                                   Lifting Accessories
                                  </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.item_type && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.item_type.message}
                          </p>
                        )}
                      </div>
                    </div>
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label  className='mt-3' htmlFor="property_table_type">Property Table Type*</Label>
                      <div>
                        <Controller
                          name="property_table_type"
                          control={control}
                          
                          render={({ field }) => (
                            <Select disabled={selectedItemType !== 'Lifting Equipment'} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="property_table_type">
                                <SelectValue placeholder="Select Property Table Type" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem   value={'CRANE CERTIFICATE'}>
                                    CRANE CERTIFICATE
                                  </SelectItem>
                                
                                  <SelectItem   value={'ELEVATOR CERTIFICATE'}>
                                   ELEVATOR CERTIFICATE
                                  </SelectItem>

                                  <SelectItem   value={'MEWP AND FORKLIFT'}>
                                    MEWP AND FORKLIFT Certificate
                                  </SelectItem>
                                  <SelectItem   value={'EARTH MOVING EQUIPMENTS'}>
                                    EARTH MOVING EQUIPMENTS
                                  </SelectItem>
                                  
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.property_table_type && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.property_table_type.message}
                          </p>
                        )}
                      </div>
                    </div>
                   
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 20, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-4 ">
                    <div className="grid gap-4 grid-cols-1">
                      <div className="w-full ">
                        <Label  className='mt-3' htmlFor="description">Description</Label>
                        <div>
                          <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                              <ReactQuill theme="snow" className="mt-3" {...field} />
                            )}
                          />
                          {errors.description && (
                            <p className="text-red-500 mt-1 text-[13px] ">
                              {errors.description.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="flex justify-end gap-4"
                  initial={{ opacity: 20, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="reset"
                    className="px-10"
                    onClick={onClose}
                    variant={'outline'}
                  >
                    Cancel
                  </Button>
                  <Button className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border " type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </motion.div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
