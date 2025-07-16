"use client"
import { motion } from "framer-motion"
import { useForm, type SubmitHandler, FormProvider, Controller } from "react-hook-form"
import { object, string, type TypeOf, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubtopic } from "@/context/SubtopicContext"
import { PlusIcon } from "lucide-react"
import { MasterService } from "@/services/api/masters-service"

// Define TypeScript interfaces for type safety
export interface Site {
  id: number
  site: string // Adjust based on your site object structure
  area: Area
}

export interface Area {
  id: number

  thumbnail: string // Adjust based on your area object structure
}

// Define the Zod schema with validation
const equipmentDetailsSchema = z.object({
  site: z.string().nonempty('Site is required'),
  area: z.string().nonempty('Area is required'),
  status: z.string().nonempty('Status is required')
});

type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

interface EquipmentDetailsFormProps {
  onClose: () => void;
  setIsArea: (value: boolean) => void;
  setIsChanged: any;
  isChanged: any;
}

export default function EquipmentDetailsForm({ onClose, setIsArea, setIsChanged, isChanged }: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [areaOptions, setAreaOptions] = useState<any[]>([]); // State to hold the area options
  const { addRecord, findRecordById, getAllSingleSubtopic } = useSubtopic();

  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: {
      site: '',  // Default values can be set as empty or pre-populated
      area: '',
      status: ''
    },
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  // Fetch areas and set them to state
  useEffect(() => {
    const masterservice = new MasterService();
    const fetchAreas = async () => {
      const data = await masterservice.getAllSubtopicDetails("area");
      if (data) {
        setAreaOptions(data.filter((item:any)=>item.status==="ACTIVE")); // Set the area options to the fetched data
        // console.log("area fetching dynamically");
      }
    };
    fetchAreas();
  }, [getAllSingleSubtopic, isChanged]); // Runs once on component mount

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // Prevent submit bubbling to parent forms
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    handleSubmit(onSubmitHandler)(e);
  };

  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true); 
    await addRecord(values, null, "site");  // Assuming you're adding a new record
    setIsChanged(!isChanged)
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
      <CardContent className="p-0">
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleFormSubmit}
            >
              <div className="space-y-4 pt-10">
                <div className="grid gap-4 grid-cols-1">
                  
                  {/* Site Field */}
                  <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4">
                    <Label htmlFor="site" className="mt-3">Site</Label>
                    <div>
                      <Input id="site" {...methods.register('site')} />
                      {errors.site && (
                        <p className="text-red-500 mt-1">{errors.site.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Area Field with dynamic dropdown */}
                  <div className="grid grid-cols-[200px_1fr] w-full items-start gap-4">
                    <Label htmlFor="area" className="mt-3">Area</Label>
                    <div className="relative">
                     <Controller
                        name="area"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger id="area">
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              {areaOptions?.length > 0 ? (
                                areaOptions?.map((area: any, index: number) => (
                                  <SelectItem key={index} value={""+area?.id}>
                                    {area?.thumbnail}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled value="No areas available">
                                  No areas available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      
                      {errors.area && (
                        <p className="text-red-500 mt-1">{errors.area.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Field */}
                  <div className="grid grid-cols-[200px_1fr] w-full gap-4">
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

                {/* Buttons */}
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
