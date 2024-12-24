'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, enum as zEnum, array, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';
import FormTable from './FormTable';

const propertySchema = object({
 
  property: string().nonempty('Property is required'),
  property_group: string().nonempty('Property Group is required'),
  condition: string().nonempty('Condition is required'),
});

const equipmentDetailsSchema = object({
  annexure: string().nonempty('Annexure is required'),
  status: string().nonempty('Status is required'),
  properties: array(propertySchema).min(1, 'At least one property is required')
}); 

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
}

export default function EquipmentDetailsForm({ onClose }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { addRecord, addProperty } = useSubtopic();
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
  });
  
  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;
 
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async(values) => {
    setLoading(true);
    const dataToSubmit = {
      annexure: values.annexure,
      status: values.status
    };
    
   const response:any = await addRecord(dataToSubmit,null,"annexure")
  
    const d = values.properties.map(property => ({
      ...property,
      annexure_id: response[0].id
    })) 
    await addProperty(d)
    setLoading(false);
    onClose()
  };
  const [properties, setProperties] = useState([
    // { id: 1, property: "Main Structure", property_group: "Nil", condition: "In Order" },
    // { id: 2, property: "Steering System", property_group: "Nil", condition: "In Order" },
    // { id: 3, property: "Counter Weight", property_group: "Nil", condition: "In Order" },
  ]);

  useEffect(() => {
    methods.register('properties');
    methods.setValue('properties', properties);
  }, [methods, properties]);

  const handlePropertiesChange = (newProperties: any) => {
    setProperties(newProperties);
    methods.setValue('properties', newProperties, {
      shouldValidate: true
    });
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
                  
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="annexure"  className='mt-3'>Annexure</Label>
                    <div>
                      <Input id="annexure" {...methods.register('annexure')} />
                      {errors.annexure && (
                        <p className="text-red-500 mt-1 text-[13px]">{errors.annexure.message}</p>
                      )}
                      </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr]  w-1/2 gap-4">
                    <Label htmlFor="status"  className='mt-3'>Status</Label>
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
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>

                              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-red-500 mt-1 text-[13px]">{errors.status.message}</p>
                      )}
                    </div>
                  </div>
                  <FormTable onFunction={()=>{}} properties={properties} setProperties={handlePropertiesChange} />
                </div>
           
                <div className="flex justify-end gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button  className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border " type="submit" disabled={loading}>
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
