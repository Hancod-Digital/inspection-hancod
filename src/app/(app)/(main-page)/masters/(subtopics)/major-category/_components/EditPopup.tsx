'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const equipmentDetailsSchema = object({
  major_category: string().nonempty('Major Category is required'),
  equipment_type: string().nonempty('Equipment Type is required'),
  status: string().nonempty('Status is required'),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function EquipmentDetailsForm({ onClose, id }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [equipmentData, setEquipmentData] = useState<any[]>([]); // Fetch and store equipment types
  const { updateRecord, findRecordById, getAllSingleSubtopic } = useSubtopic();

  // Get existing data synchronously
  const data = findRecordById(id);

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      major_category: data?.major_category || '',
      equipment_type: data?.equipment_type || '',
      status: data?.status || '',
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  // Fetch equipment types from the subtopic context when the component mounts
  useEffect(() => {
    const fetchEquipmentTypes = async () => {
      const subtopics = await getAllSingleSubtopic('equipment_type');
      setEquipmentData(subtopics || []);
    };

    fetchEquipmentTypes();
  }, [getAllSingleSubtopic]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    await updateRecord(id, values);
    setLoading(false);
    onClose(); // Close the form after saving
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-0 p-0 hover:bg-white">
        <CardHeader>
          <CardTitle className="text-md">Equipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1">
                   

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="major_category">Major Category</Label>
                    <div>
                      <Input id="major_category" {...methods.register('major_category')} />
                      {errors.major_category && (
                        <p className="text-red-500 mt-1">{errors.major_category.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="equipment_type">Equipment Type</Label>
                    <div>
                      <Controller
                        name="equipment_type"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="equipment_type">
                              <SelectValue placeholder="Select equipment type" />
                            </SelectTrigger>
                            <SelectContent>
                              {equipmentData?.map((item) => (
                                <SelectItem key={item.id} value={"" + item.id}>
                                  {item.equipment_type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.equipment_type && (
                        <p className="text-red-500 mt-1">{errors.equipment_type.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                    <Label htmlFor="status">Status</Label>
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
