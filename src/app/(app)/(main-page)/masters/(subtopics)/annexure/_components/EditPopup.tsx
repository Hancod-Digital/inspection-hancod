'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { object, string, TypeOf, array, number } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubtopic } from '@/context/SubtopicContext';
import FormTable from './FormTable'; // Ensure the correct import path
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';

// Define the property schema
const propertySchema = object({
  id: string().or(number()),
  property: string().nonempty('Property is required'),
  property_group: string().nonempty('Property Group is required'),
  condition: string().nonempty('Condition is required'),
});

// Extend the equipment details schema to include properties
const equipmentDetailsSchema = object({
  annexure: string().nonempty('Annexure is required'),
  status: string().nonempty('Status is required'),
  property_table_type: string().nonempty('Property Table Type is required'),
    // properties: array(propertySchema).min(1, 'At least one property is required').optional(),
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema> & { id?: number };

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id?: number; // Optional prop to determine if it's edit mode
}

export default function EquipmentDetailsForm({ onClose, id }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { addRecord, addProperty, updateRecord, findRecordById,updateProperty } = useSubtopic();

  // Fetch existing data if in edit mode
  const existingData = id ? findRecordById(id) : null;
  const [properties,setProperties] = useState([])
  useEffect(()=>{
    const getProperty = async()=>{
      await makeApiCall(()=>new MasterService().getPropertyList(existingData?.id),{
           afterSuccess: (res:any)=>{
            setProperties(res)
           }
      })
      
    }
    getProperty()
  },[existingData])
  
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      annexure: existingData?.annexure || '',
      status: existingData?.status || '',
      property_table_type: existingData?.property_table_type || '',
       
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
    setValue,
    register,
  } = methods;

   

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // useEffect(() => {
  //   register('properties');
  //   setValue('properties', properties);
  // }, [register, setValue, properties]);

  const handlePropertiesChange = (newProperties: any) => {
    setProperties(newProperties);
    // setValue('properties', newProperties, { shouldValidate: true });
  };
  console.log(errors);
  

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    try {
      if (id) {
        // Edit mode
        const response:any =  await updateRecord(id, {
          annexure: values.annexure,
          status: values.status,
          property_table_type: values.property_table_type,
          
        });
    
     
        await Promise.all(
          properties.map(async (property: any) => {
            if (property.id) {
              // Corrected the syntax for updateProperty
              await updateProperty({id:property.id, updates:{
                ...property,
                annexure_id: id,
              }});
            }else{
               
              await addProperty({
                ...property,
                annexure_id: id,
              });
            }
          })
        );
         
      }  
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      // Optionally, handle error feedback here
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
        {id && (
          <CardHeader>
            <CardTitle className="text-md">Edit Equipment Details</CardTitle>
          </CardHeader>
        )}
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
                  {/* Annexure Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="annexure" className='mt-3'>Annexure</Label>
                    <div>
                      <Input id="annexure" {...methods.register('annexure')} />
                      {errors.annexure && (
                        <p className="text-red-500 mt-1 text-[13px]">{errors.annexure.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
                    <Label htmlFor="status" className='mt-3'>Status</Label>
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

                  {/* Property Table Type Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
                    <Label htmlFor="property_table_type" className='mt-3'>Property Table Type</Label>
                    <div>
                      <Controller
                        name="property_table_type"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="property_table_type">
                              <SelectValue placeholder="Select property table type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"CRANE CERTIFICATE"}>CRANE CERTIFICATE</SelectItem>
                              <SelectItem value={"ELEVATOR CERTIFICATE"}>ELEVATOR CERTIFICATE</SelectItem>
                              <SelectItem value={"MEWP AND FORKLIFT"}>
                                MEWP AND FORKLIFT
                              </SelectItem>
                              <SelectItem value={"EARTH MOVING EQUIPMENTS"}>
                                EARTH MOVING EQUIPMENTS
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.property_table_type && (
                        <p className="text-red-500 mt-1 text-[13px]">{errors.property_table_type.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Properties Table */}
                  <FormTable
                    onFunction={() => { /* You can define additional functions if needed */ }}
                    properties={properties}
                    setProperties={handlePropertiesChange}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                  <Button type="button" className="px-10" onClick={onClose} variant="outline">
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
