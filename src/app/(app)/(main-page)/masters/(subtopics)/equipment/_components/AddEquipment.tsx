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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, PlusIcon } from 'lucide-react';

// Validation schema using Zod
const equipmentDetailsSchema = object({
  minorCategory: string().nonempty('Minor Category is required'),
  equipmentNo: string().nonempty("Equipment No is required"),
  ownerIdTagNo: string().nonempty("Owner Id Tag Number is required"),
  registrationNo: string().nonempty("Reg no is required"),
  modelNo: string().nonempty("Model no is required"),
  supplierManufacturer: string().nonempty("Supplier is required"),
  testCertificateNo: string().nonempty("Test certificate No is required"),
  location: string().nonempty('Location is required'),
  title: string().nonempty("Title is required"),
  standard: string().nonempty("standard is required"),
  serialNo: string().nonempty("Serial No is required"),
  annexure: string().nonempty("Annexure is required"),
  yearOfManufacture: string().nonempty("Year of manufacture is required"),
  active: boolean(),
  safeWorkingLoad: string().nonempty("Safe working load is required"),
  lastTestDate: string().nonempty("Last test date is required"),
  proofLoad: string().nonempty("Proof load is required"),
  nextTestDate: string().nonempty("Next test date is required"),
  testInspFrequency: string().nonempty("Test inspection frequency is required"),
  testInspFrequencyMonths: string().nonempty("Test inspection frequency in months is required"),
  lastThoroughDate: string().nonempty("Last thorough date required"),
  nextThoroughDate: string().nonempty("Last thorough date is required"),
  description: string().nonempty("Last thorough date is required"),
});
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EditPopupProps {
    onClose: () => void;
  }
  

export default function EquipmentDetailsForm({ onClose }:{onClose: () => void})  {
  const [loading, setLoading] = useState(false);

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });
 ;

  const {
    reset,
    handleSubmit,
    register,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = (values) => {
    setLoading(true)
    console.log(values);
    // Handle form submission logic here
    setLoading(false)
  };

  return (
    <AnimatePresence>
  <motion.div
    initial={{ opacity: 20, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 20, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="w-full border-0 p-0  hover:bg-white">
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
                  <Label htmlFor="minorCategory">Minor Category:*</Label>
                  <div>
                    <Select {...register('minorCategory')}>
                      <SelectTrigger id="minorCategory">
                        <SelectValue placeholder="Swivel Hoist Ring" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="swivel-hoist-ring">Swivel Hoist Ring</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.minorCategory && (
                      <p className="text-red-500 mt-1 ">{errors.minorCategory.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="equipmentNo">Equipment No</Label>
                  <div>
                    <Input id="equipmentNo" {...register('equipmentNo')} />
                    {errors.equipmentNo && (
                      <p className="text-red-500 mt-1">{errors.equipmentNo.message}</p>
                    )}
                  </div>
                </div>

                {/* Owner ID/Tag No and Registration No./Plate No. */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="ownerIdTagNo">Owner ID/Tag No</Label>
                  <div>
                    <Input id="ownerIdTagNo" {...register('ownerIdTagNo')} />
                    {errors.ownerIdTagNo && (
                      <p className="text-red-500 mt-1">{errors.ownerIdTagNo.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="registrationNo">Registration No./Plate No.</Label>
                  <div>
                    <Input id="registrationNo" {...register('registrationNo')} />
                    {errors.registrationNo && (
                      <p className="text-red-500 mt-1">{errors.registrationNo.message}</p>
                    )}
                  </div>
                </div>

                {/* Model No and Supplier/Manufacturer */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="modelNo">Model No</Label>
                  <div>
                    <Input id="modelNo" {...register('modelNo')} />
                    {errors.modelNo && (
                      <p className="text-red-500 mt-1">{errors.modelNo.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="supplierManufacturer">Supplier/Manufacturer</Label>
                  <div className="relative">
                    <Select {...register('supplierManufacturer')}>
                      <SelectTrigger id="supplierManufacturer">
                        <SelectValue placeholder="RUD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rud">RUD</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="outline" className="absolute bg-primary text-white font-bold right-0 top-0">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    {errors.supplierManufacturer && (
                      <p className="text-red-500 mt-1">{errors.supplierManufacturer.message}</p>
                    )}
                  </div>
                </div>

                {/* Test Certificate No./COC No. and Location */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="testCertificateNo">Test Certificate No./COC No.</Label>
                  <div>
                    <Input id="testCertificateNo" {...register('testCertificateNo')} />
                    {errors.testCertificateNo && (
                      <p className="text-red-500 mt-1">{errors.testCertificateNo.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="location">Location:*</Label>
                  <div className="relative">
                    <Select {...register('location')}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Schlumberger Yard, Ind. Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="schlumberger">Schlumberger Yard, Ind. Area</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="outline" className="absolute bg-primary text-white font-bold right-0 top-0">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    {errors.location && (
                      <p className="text-red-500 mt-1">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                {/* Title and Standard */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="title">Title</Label>
                  <div>
                    <Select {...register('title')}>
                      <SelectTrigger id="title">
                        <SelectValue placeholder="Swivel Hoist Ring" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="swivel-hoist-ring">Swivel Hoist Ring</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.title && (
                      <p className="text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="standard">Standard</Label>
                  <div>
                    <Select {...register('standard')}>
                      <SelectTrigger id="standard">
                        <SelectValue placeholder="EN 14452" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-14452">EN 14452</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.standard && (
                      <p className="text-red-500 mt-1">{errors.standard.message}</p>
                    )}
                  </div>
                </div>

                {/* Serial No. and Annexure */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="serialNo">Serial No.</Label>
                  <div>
                    <Input id="serialNo" {...register('serialNo')} />
                    {errors.serialNo && (
                      <p className="text-red-500 mt-1">{errors.serialNo.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="annexure">Annexure</Label>
                  <div>
                    <Input id="annexure" {...register('annexure')} />
                    {errors.annexure && (
                      <p className="text-red-500 mt-1">{errors.annexure.message}</p>
                    )}
                  </div>
                </div>

                {/* Year of Manufacture and Active */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
                  <div>
                    
                    <Input id="yearOfManufacture" type='date'  {...register('yearOfManufacture')} />
                    {errors.yearOfManufacture && (
                      <p className="text-red-500 mt-1">{errors.yearOfManufacture.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="active">Active</Label>
                  <div>
                    <Checkbox id="active" {...register('active')} />
                    {errors.active && (
                      <p className="text-red-500 mt-1">{errors.active.message}</p>
                    )}
                  </div>
                </div>
                </div>
            </div>
       
           <CardHeader>
            <CardTitle className="text-md   w-full ">Certificate Details</CardTitle>
          </CardHeader>
            <div className="space-y-4 ">
              <div className="grid gap-4 grid-cols-2">
                {/* Safe Working Load and Last Test Date */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="safeWorkingLoad">Safe Working Load</Label>
                  <div>
                    <Input id="safeWorkingLoad" {...register('safeWorkingLoad')} />
                    {errors.safeWorkingLoad && (
                      <p className="text-red-500 mt-1">{errors.safeWorkingLoad.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="lastTestDate">Last Test Date</Label>
                  <div>
                    <Input
                      id="lastTestDate"
                      type="date"
                       
                      {...register('lastTestDate')}
                    />
                    {errors.lastTestDate && (
                      <p className="text-red-500 mt-1">{errors.lastTestDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Proof Load and Next Test Date */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="proofLoad">Proof Load</Label>
                  <div>
                    <Input id="proofLoad" {...register('proofLoad')} />
                    {errors.proofLoad && (
                      <p className="text-red-500 mt-1">{errors.proofLoad.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="nextTestDate">Next Test Date</Label>
                  <div>
                    <Input
                      id="nextTestDate"
                      type="date"
                    
                      {...register('nextTestDate')}
                    />
                    {errors.nextTestDate && (
                      <p className="text-red-500 mt-1">{errors.nextTestDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Test Insp. Frequency and Test Insp. Frequency (Months) */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="testInspFrequency">Test Insp. Frequency</Label>
                  <div>
                    <Input id="testInspFrequency" {...register('testInspFrequency')} />
                    {errors.testInspFrequency && (
                      <p className="text-red-500 mt-1">{errors.testInspFrequency.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="testInspFrequencyMonths">Test Insp. Frequency (Months)</Label>
                  <div>
                    <Input id="testInspFrequencyMonths" {...register('testInspFrequencyMonths')} />
                    {errors.testInspFrequencyMonths && (
                      <p className="text-red-500 mt-1">{errors.testInspFrequencyMonths.message}</p>
                    )}
                  </div>
                </div>

                {/* Last Thorough Examination Date and Next Thorough Examination Date */}
                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="lastThoroughDate">Last Thorough Examination Date</Label>
                  <div>
                    <Input
                      id="lastThoroughDate"
                      type="date"
                      
                      {...register('lastThoroughDate')}
                    />
                    {errors.lastThoroughDate && (
                      <p className="text-red-500 mt-1">{errors.lastThoroughDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                  <Label htmlFor="nextThoroughDate">Next Thorough Examination Date</Label>
                  <div>
                    <Input
                      id="nextThoroughDate"
                      type="date"
                   
                      {...register('nextThoroughDate')}
                    />
                    {errors.nextThoroughDate && (
                      <p className="text-red-500 mt-1">{errors.nextThoroughDate.message}</p>
                    )}
                  </div>
                </div>
                </div>
            </div>
          {/* </CardContent>
        </Card>
                <Card className="w-full border-0 p-0 hover:bg-white">
           
          <CardContent> */}
           <motion.div
                  initial={{ opacity: 20, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
            <div className="space-y-4 ">
              <div className="grid gap-4 grid-cols-1">
                <div className="w-full ">
                <Label htmlFor="description" >Description</Label>
                <div>
                <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          className='mt-3'
                          {...field}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>
              </div>
              </div>
            </div>
            </motion.div>
            <motion.div
                  className='flex justify-end gap-4'
                  initial={{ opacity: 20, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
        <Button type="reset" className='px-10' onClick={onClose} variant={'outline'} >
          Cancel
        </Button>
        <Button className='px-10' type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button></motion.div>
      </form>
    </FormProvider>
    </CardContent>
        </Card>
        </motion.div>
</AnimatePresence>
  );
}
