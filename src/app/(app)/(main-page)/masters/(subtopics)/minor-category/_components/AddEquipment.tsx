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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';

// Define the validation schema using Zod
const equipmentDetailsSchema = object({ 
  minor_category: z.string().nonempty('Minor Category is required'),
  major_category: z.string().nonempty('Major Category is required'),
  standard: z.string().nonempty('Standard is required'),
  status: z.string().nonempty('Status is required')
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  
  // States to hold fetched data for major categories and standards
  const [majorCategories, setMajorCategories] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  
  const { addRecord, getAllSingleSubtopic } = useSubtopic();

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  // Fetch major categories and standards when the component mounts
  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        // Fetch major categories
        const majorCats = await getAllSingleSubtopic('major_category');
        console.log('Major Categories:', majorCats);
        setMajorCategories(majorCats || []);

        // Fetch standards
        const stds = await getAllSingleSubtopic('standard');
        console.log('Standards:', stds);
        setStandards(stds || []);
      } catch (error) {
        console.error('Error fetching subtopics:', error);
      }
    };

    fetchSubtopics();
  }, [getAllSingleSubtopic]);

  // Reset the form after successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // Handle form submission
  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    console.log('Form Values:', values);
    await addRecord(values);
    setLoading(false);
    onClose();
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

                  {/* Major Category Field (Converted to Select) */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="major_category" className="mt-3">Major Category</Label>
                    <div>
                      <Controller
                        name="major_category"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="major_category">
                              <SelectValue placeholder="Select major category" />
                            </SelectTrigger>
                            <SelectContent>
                              {majorCategories.map((item) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                  {item.major_category} {/* Adjust the property based on your data structure */}
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

                  {/* Standard Field (Converted to Select) */}
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
                              {standards?.map((item) => (
                                <SelectItem key={item.id} value={String(item.id)}>
                                  {item.standard} {/* Adjust the property based on your data structure */}
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

                  {/* Status Field */}
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

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button className="px-10" type="submit" disabled={loading}>
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
