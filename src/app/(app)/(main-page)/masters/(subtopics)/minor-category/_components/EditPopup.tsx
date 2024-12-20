'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';
import { flushSync } from 'react-dom';
import { minorCategoryDataRange } from '@/lib/utils';

// Define the schema with Zod, including major_category and standard as required strings
const equipmentDetailsSchema = object({
  minor_category: z.string().nonempty('Minor Category is required'),
  major_category: z.string().nonempty('Major Category is required'),
  standard: z.string().nonempty('Standard is required'),
  status: z.string().nonempty('Status is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function EquipmentDetailsForm({
  onClose,
  id,
}: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [majorCategories, setMajorCategories] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]); // New state for standard options
  const [data, setData] = useState<any>(null);
  const { updateRecord, findRecordByIdWithReference, getAllSingleSubtopic ,findRecordById} = useSubtopic();
  const selected = findRecordById(id);
  const [recordData,setRecordData] = useState<any>(null);
  findRecordByIdWithReference(id, minorCategoryDataRange).then((res:any)=>{
    setRecordData(res)
   })
  const methods =   useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      minor_category: recordData?.minor_category || '',
      major_category: String(recordData?.major_category?.id) || "",
      standard: String(recordData?.standard?.id) || '',  
      status: recordData?.status || '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  // Fetch existing data with references when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define the references you want to include
        const references = ['majorCategory']; // Add other references if needed

        // Fetch the record with references
        const recordData = await findRecordByIdWithReference(id, minorCategoryDataRange);
     console.log(recordData,"recordData")
        flushSync(() => {
          setData(recordData);
          reset({
            minor_category: recordData?.minor_category || '',
            major_category: String(recordData?.major_category?.id) || "",
            standard: String(recordData?.standard?.id) || '',  
            status: recordData?.status || '',
          });
        });
      } catch (error) {
        console.error('Error fetching record:', error);
        // Optionally, handle the error by setting an error state or showing a notification
      }
    };

    fetchData();
  }, [id, findRecordByIdWithReference, reset]);

  // Fetch major categories when the component mounts
  useEffect(() => {
    const fetchMajorCategories = async () => {
      try {
        const categories = await getAllSingleSubtopic('major_category');
        
        setMajorCategories(categories || []);
      } catch (error) {
        console.error('Failed to fetch major categories:', error);
        // Optionally, handle the error
      }
    };
    fetchMajorCategories();
    const fetchStandardOptions = async () => {
      try {
        const standards = await getAllSingleSubtopic('standard'); // Adjust the key as per your API
        setStandardOptions(standards || []);
      } catch (error) {
        console.error('Failed to fetch standard options:', error);
        // Optionally, handle the error
      }
    };
    fetchStandardOptions();
  }, [getAllSingleSubtopic]);

  // Fetch standard options when the component mounts
  useEffect(() => {
    const fetchStandardOptions = async () => {
      try {
        const standards = await getAllSingleSubtopic('standard'); // Adjust the key as per your API
        setStandardOptions(standards || []);
      } catch (error) {
        console.error('Failed to fetch standard options:', error);
        // Optionally, handle the error
      }
    };
    fetchStandardOptions();
  }, [getAllSingleSubtopic]);

  // Reset form and close modal upon successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
   

    // Prepare the updated data
    const updatedData = {
      ...data,
      minor_category: values.minor_category,
      major_category: Number(values?.major_category),
      standard: values.standard, // Assuming standard is a string
      status: values.status,
    };

    try {
      await updateRecord(id, updatedData);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error updating record:', error);
      setLoading(false);
      // Optionally, handle the error by showing a notification
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
                <div className="grid gap-4 grid-cols-1">

                  {/* Minor Category Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="minor_category" className="mt-3">Minor Category</Label>
                    <div>
                      <Input id="minor_category" {...methods.register('minor_category')} />
                      {errors.minor_category && (
                        <p className="text-red-500 mt-1">{errors.minor_category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Major Category Field with Select */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="major_category" className="mt-3">Major Category</Label>
                    <div>
                      <Controller
                        name="major_category"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={String(field.value)}>
                            <SelectTrigger id="major_category">
                              <SelectValue placeholder="Select major category" />
                            </SelectTrigger>
                            <SelectContent>
                              {majorCategories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                  {category?.major_category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.major_category && (
                        <p className="text-red-500 mt-1">{errors.major_category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Standard Field with Select */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="standard" className="mt-3">Standard</Label>
                    <div>
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
                      {errors.standard && (
                        <p className="text-red-500 mt-1">{errors.standard.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Field with Select */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
                    <Label htmlFor="status" className="mt-3">Status</Label>
                    <div>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-red-500 mt-1">{errors.status.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
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
