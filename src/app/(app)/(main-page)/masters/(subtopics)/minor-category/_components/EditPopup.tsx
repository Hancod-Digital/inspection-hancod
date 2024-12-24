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

// Zod schema
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

export default function EquipmentDetailsForm({ onClose, id }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [majorCategories, setMajorCategories] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  
  // Single piece of state to hold the fetched record
  const [fetchedData, setFetchedData] = useState<any>(null);

  const { updateRecord, findRecordByIdWithReference, getAllSingleSubtopic,findRecordById } = useSubtopic();

  // Initialize react-hook-form with zod validation
  const record = findRecordById(id)
  console.log(record);
  
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      minor_category: record?.minor_category || '',
      major_category: String(record?.major_category) || '',
      standard: String(record?.standard) || '',
      status: record?.status || '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  // Fetch data and set defaults
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the single record with references
        const record = await findRecordByIdWithReference(id, minorCategoryDataRange);

        flushSync(() => {
          setFetchedData(record);
          reset({
            minor_category: record?.minor_category || '',
            major_category: String(record?.major_category?.id) || '',
            standard: String(record?.standard?.id) || '',
            status: record?.status || '',
          });
        });
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    };

    fetchData();
  }, [id, reset, findRecordByIdWithReference]);

  // Fetch major categories + standards
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const [categories, standards] = await Promise.all([
          getAllSingleSubtopic('major_category'),
          getAllSingleSubtopic('standard'),
        ]); 
        setMajorCategories(categories || []);
        setStandardOptions(standards || []);
      } catch (error) {
        console.error('Failed to fetch select options:', error);
      }
    };

    fetchSelectOptions();
  }, [getAllSingleSubtopic]);

  // Close form upon successful submit
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  // Submit handler
  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);

    const updatedData = {
      // Merging data from the original record + new values
      ...fetchedData,
      minor_category: values.minor_category,
      major_category: Number(values.major_category),
      standard: values.standard,
      status: values.status,
    };

    try {
      await updateRecord(id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error updating record:', error);
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
                <div className="grid gap-4 grid-cols-1">
                  {/* Minor Category */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="minor_category" className="mt-3">
                      Minor Category
                    </Label>
                    <div>
                      <Input
                        id="minor_category"
                        {...methods.register('minor_category')}
                      />
                      {errors.minor_category && (
                        <p className="text-red-500 mt-1">
                          {errors.minor_category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Major Category */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="major_category" className="mt-3">
                      Major Category
                    </Label>
                    <div>
                      <Controller
                        name="major_category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="major_category">
                              <SelectValue placeholder="Select major category" />
                            </SelectTrigger>
                            <SelectContent>
                              {majorCategories.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={String(cat.id)}
                                >
                                  {cat?.major_category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.major_category && (
                        <p className="text-red-500 mt-1">
                          {errors.major_category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Standard */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="standard" className="mt-3">
                      Standard
                    </Label>
                    <div>
                      <Controller
                        name="standard"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="standard">
                              <SelectValue placeholder="Select standard" />
                            </SelectTrigger>
                            <SelectContent>
                              {standardOptions.map((standard) => (
                                <SelectItem
                                  key={standard.id}
                                  value={String(standard.id)}
                                >
                                  {standard.standard}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.standard && (
                        <p className="text-red-500 mt-1">
                          {errors.standard.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
                    <Label htmlFor="status" className="mt-3">
                      Status
                    </Label>
                    <div>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                        <p className="text-red-500 mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
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
