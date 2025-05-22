"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler, FormProvider, Controller } from "react-hook-form";
import { object, string, TypeOf, boolean } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useSubtopic } from "@/context/SubtopicContext";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { MasterService } from "@/services/api/masters-service";

interface EquipmentDetailsFormProps {
  onClose: () => void;
  id?: number; // Optional, only required for edit
  isManufacturer: boolean;
  isStandard: boolean;
  isLocation: boolean;
  setIsManufacturer: (value: boolean) => void;
  setIsStandard: (value: boolean) => void;
  setIsLocation: (value: boolean) => void;
  setChanged: (value: boolean) => void;
  changed: boolean;
}

export default function EquipmentDetailsForm({
  onClose,
  id,
  isManufacturer,
  isStandard,
  isLocation,
  setIsManufacturer,
  setIsStandard,
  setIsLocation,
  setChanged,
  changed,
}: EquipmentDetailsFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  // Add new states for all 4 "Not Applicable" checkboxes:
  const [lastTestExamChecked, setLastTestExamChecked] = useState<boolean>(false);
  const [lastThoroughExamChecked, setLastThoroughExamChecked] = useState<boolean>(false);
  const [testExamChecked, setTestExamChecked] = useState<boolean>(false);
  const [thoroughExamChecked, setThoroughExamChecked] = useState<boolean>(false);

  const { addRecord, updateRecord, findRecordById } = useSubtopic();

  // State variables for select options
  const [minorCategoryOptions, setMinorCategoryOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [standardOptions, setStandardOptions] = useState<any[]>([]);
  const [annexureOptions, setAnnexureOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [ownerOptions, setOwnerOptions] = useState<any[]>([]);

 
// Validation schema using Zod
const equipmentDetailsSchema = object({
  minor_category: string().nonempty("Minor Category is required"),
  equipment_no: string().nonempty("Equipment No is required"),
  owner_id: string().nonempty("Owner ID is required"),
  registration_no: string().nonempty("Registration No is required"),
  model_no: string().nonempty("Model No is required"),
  manufacturer: string().nonempty("Supplier is required"),
  test_certificate_no: string().nonempty("Test Certificate No is required"),
  location: string().nonempty("Location is required"),
  title: string().nonempty("Title is required"),
  standard: string().nonempty("Standard is required"),
  serial_no: string().nonempty("Serial No is required"),
  annexure: string().nonempty("Annexure is required"),
  year_of_manufacture: string().nonempty("Year of manufacture is required"),
  status: boolean().optional(),
  safe_working_load: string().nonempty("Safe working load is required"),
  proof_load: string().nonempty("Proof load is required"),

  // All four date fields
  last_test_date: !lastTestExamChecked ? string().nonempty("Last test date is required") : string().optional(),
  next_test_date: !testExamChecked ? string().nonempty("Next test date is required") : string().optional(),
  last_thorough_date: !lastThoroughExamChecked ? string().nonempty("Last thorough date is required") : string().optional(),
  next_thorough_date: !thoroughExamChecked ? string().nonempty("Next thorough date is required") : string().optional(),

  test_insp_frequency: string().nonempty("Test inspection frequency in months is required"),
  description: string().nonempty("Description is required"),
  item_type: string().nonempty("Item type is required"),
  property_table_type: string().optional(), // Conditionally required
});

 
type EquipmentDetailsInput = TypeOf<typeof equipmentDetailsSchema>;

  // If we're editing, fetch existing data
  const data = id ? findRecordById(id) : null;

  // Hook Form
  const methods = useForm<EquipmentDetailsInput>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: data
      ? {
          ...data,
          manufacturer: String(data.manufacturer),
          minor_category: String(data.minor_category),
          location: String(data.location),
          standard: String(data.standard),
          annexure: String(data.annexure),
          owner_id: String(data.owner_id),
          test_insp_frequency: String(data.test_insp_frequency),
          last_test_date: String(data.last_test_date),
          last_thorough_date: String(data.last_thorough_date),
          next_test_date: data.next_test_date ? String(data.next_test_date) : "",
          next_thorough_date: data.next_thorough_date ? String(data.next_thorough_date) : "",
          status: data.status === "ACTIVE",
          item_type: String(data.item_type),
          property_table_type: data.property_table_type
            ? String(data.property_table_type)
            : "",
        }
      : {},
    mode: "onSubmit",
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  const selectedItemType = watch("item_type");

  // When the component loads or data changes, set "Not Applicable" checkboxes
  useEffect(() => {
    if (!data) return;
    console.log(data?.last_test_date, "data?.last_test_date", data?.next_test_date, "data?.next_test_date", data?.last_thorough_date, "data?.last_thorough_date", data?.next_thorough_date, "data?.next_thorough_date");
    // Last Test Date
    if (data.last_test_date) {
      setValue("last_test_date", data.last_test_date);
    } else {
      setLastTestExamChecked(true);
    }

    // Next Test Date
    if (data.next_test_date) {
      setValue("next_test_date", data.next_test_date);
    } else {
      setTestExamChecked(true);
    }

    // Last Thorough Date
    if (data.last_thorough_date) {
      setValue("last_thorough_date", data.last_thorough_date);
    } else {
      setLastThoroughExamChecked(true);
    }

    // Next Thorough Date
    if (data.next_thorough_date) {
      setValue("next_thorough_date", data.next_thorough_date);
    } else {
      setThoroughExamChecked(true);
    }
  }, [data, setValue]);

  // Fetch options for select fields
  useEffect(() => {
    (async () => {
      const masterService = new MasterService();
      try {
        // Fetch minor category options
        const minorCategories = await masterService.getAllSubtopicDetails("minor_category");
        if (minorCategories) {
          setMinorCategoryOptions(minorCategories.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch supplier options
        const suppliers = await masterService.getAllSubtopicDetails("manufacturer");
        if (suppliers) {
          setSupplierOptions(suppliers.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch standard options
        const standards = await masterService.getAllSubtopicDetails("standard");
        if (standards) {
          setStandardOptions(standards.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch annexure options
        const annexures = await masterService.getAllSubtopicDetails("annexure");
        if (annexures) {
          setAnnexureOptions(annexures.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch location options
        const locations = await masterService.getAllSubtopicDetails("location");
        if (locations) {
          setLocationOptions(locations.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch owner options
        const owners = await masterService.getAllSubtopicDetails("owner");
        if (owners) {
          setOwnerOptions(owners.filter((item: any) => item.status === "ACTIVE"));
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        // Optionally, handle the error
      }
    })();
  }, [changed]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  // On Submit
  const onSubmitHandler: SubmitHandler<EquipmentDetailsInput> = async (values) => {
    setLoading(true);
    try {
      // Convert to "Not Applicable" if the user checked the corresponding box
      const payload = {
        ...values,
        status: values.status ? "ACTIVE" : "INACTIVE",
        last_test_date: lastTestExamChecked ? "Not Applicable" : values.last_test_date,
        next_test_date: testExamChecked ? "Not Applicable" : values.next_test_date,
        last_thorough_date: lastThoroughExamChecked
          ? "Not Applicable"
          : values.last_thorough_date,
        next_thorough_date: thoroughExamChecked ? "Not Applicable" : values.next_thorough_date,
        property_table_type:
          selectedItemType === "Lifting Equipment" ? values.property_table_type : null,
      };

      if (id) {
        // Edit mode
        await updateRecord(id, payload);
      } else {
        // Add mode
        await addRecord(payload);
      }
      setChanged(!changed);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Conditionally require property_table_type
  useEffect(() => {
    if (selectedItemType === "Lifting Equipment") {
      methods.register("property_table_type", { required: "Property table type is required" });
    } else {
      methods.unregister("property_table_type");
      setValue("property_table_type", "");
    }
  }, [selectedItemType, methods, setValue]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
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
                  <CardTitle className="text-md">
                    {id ? "Edit Equipment Details" : "Add Equipment Details"}
                  </CardTitle>
                </CardHeader>

                {/* Equipment Details */}
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    {/* Minor Category */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="minor_category">Minor Category:*</Label>
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
                      <Label htmlFor="equipment_no">Equipment No</Label>
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
                      <Label htmlFor="owner_id">Owner ID/Tag No</Label>
                      <div>
                        <Controller
                          name="owner_id"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={String(field.value)}>
                              <SelectTrigger id="owner_id">
                                <SelectValue placeholder="Select Owner" />
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

                    {/* Registration No./Plate No. */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="registration_no">Registration No./Plate No.</Label>
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

                    {/* Model No */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="model_no">Model No</Label>
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
                      <Label htmlFor="manufacturer">Supplier/Manufacturer</Label>
                      <div className="relative">
                        <Controller
                          name="manufacturer"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={String(field.value)}>
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
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={() => setIsManufacturer(true)}
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
                      <Label htmlFor="test_certificate_no">Test Certificate No./COC No.</Label>
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
                      <Label htmlFor="location">Location:*</Label>
                      <div className="relative">
                        <Controller
                          name="location"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={String(field.value)}>
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
                          variant="outline"
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={() => setIsLocation(true)}
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

                    {/* Title */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="title">Title</Label>
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

                    {/* Standard */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="standard">Standard</Label>
                      <div className="relative">
                        <Controller
                          name="standard"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={String(field.value)}>
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
                          className="absolute bg-primary text-white font-bold right-0 top-0"
                          onClick={() => setIsStandard(true)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                        {errors.standard && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.standard.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Serial No. */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="serial_no">Serial No.</Label>
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
                      <Label htmlFor="annexure">Annexure</Label>
                      <div>
                        <Controller
                          name="annexure"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={String(field.value)}>
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
                      <Label htmlFor="year_of_manufacture">Year of Manufacture</Label>
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
                      <Label htmlFor="status">Active</Label>
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

                {/* Certificate Details */}
                <CardHeader>
                  <CardTitle className="text-md w-full">Certificate Details</CardTitle>
                </CardHeader>

                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    {/* Safe Working Load */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="safe_working_load">Safe Working Load</Label>
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
                      <Label htmlFor="test_insp_frequency">
                        Test Insp. Frequency (Months)
                      </Label>
                      <div>
                        <Controller
                          name="test_insp_frequency"
                          control={control}
                          render={({ field }) => <Input id="test_insp_frequency" {...field} />}
                        />
                        {errors.test_insp_frequency && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.test_insp_frequency.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Proof Load */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="proof_load">Proof Load</Label>
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
                    </div>
                    <div className="grid gap-4 grid-cols-1">
                    {/* Last Test Date + Not Applicable */}
                    <div className="grid grid-cols-[200px_1fr]  w-[64.2%]  items-start gap-4">
                      <Label htmlFor="last_test_date">Date of last proof load test</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="last_test_date"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="last_test_date"
                              type="date"
                              disabled={lastTestExamChecked}
                              {...field}
                            />
                          )}
                        />
                        <Checkbox
                          className="w-6 h-6"
                          checked={lastTestExamChecked}
                          onCheckedChange={(checked) => setLastTestExamChecked(!!checked)}
                        />
                        <span className="text-[13px] w-[33%]">Not Applicable</span>
                        {errors.last_test_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.last_test_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                    </div>
                    <div className="grid gap-4 grid-cols-1">
                    {/* Last Thorough Examination Date + Not Applicable */}
                    <div className="grid grid-cols-[200px_1fr]  w-[64.2%]  items-start gap-4">
                      <Label htmlFor="last_thorough_date">Date of last examination</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="last_thorough_date"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="last_thorough_date"
                              type="date"
                              disabled={lastThoroughExamChecked}
                              {...field}
                            />
                          )}
                        />
                        <Checkbox
                          className="w-6 h-6"
                          checked={lastThoroughExamChecked}
                          onCheckedChange={(checked) => setLastThoroughExamChecked(!!checked)}
                        />
                        <span className="text-[13px] w-[33%]">Not Applicable</span>
                        {errors.last_thorough_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.last_thorough_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Next Test Date + Not Applicable */}
                  <div className="grid gap-4 grid-cols-1">
                    <div className="grid grid-cols-[200px_1fr] w-[64.2%] items-start gap-4">
                      <Label htmlFor="next_test_date">Date of next proof load test</Label>
                      <div className="flex items-center gap-4">
                        <Controller
                          name="next_test_date"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="next_test_date"
                              type="date"
                              disabled={testExamChecked}
                              {...field}
                            />
                          )}
                        />
                        <Checkbox
                          className="w-6 h-6"
                          checked={testExamChecked}
                          onCheckedChange={(checked) => setTestExamChecked(!!checked)}
                        />
                        <span className="text-[13px] w-[33%]">Not Applicable</span>
                        {errors.next_test_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.next_test_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Next Thorough Examination Date + Not Applicable */}
                  <div className="grid gap-4 grid-cols-1">
                    <div className="grid grid-cols-[200px_1fr] w-[64.2%] items-start gap-4">
                      <Label htmlFor="next_thorough_date">Date of next examination</Label>
                      <div className="flex items-center gap-4 w-full">
                        <Controller
                          name="next_thorough_date"
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="next_thorough_date"
                              type="date"
                              disabled={thoroughExamChecked}
                              {...field}
                            />
                          )}
                        />
                        <Checkbox
                          className="w-6 h-6"
                          checked={thoroughExamChecked}
                          onCheckedChange={(checked) => setThoroughExamChecked(!!checked)}
                        />
                        <span className="text-[13px] w-[33%]">Not Applicable</span>
                        {errors.next_thorough_date && (
                          <p className="text-red-500 mt-1 text-[13px] ">
                            {errors.next_thorough_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Item Type and Property Table Type */}
                  <div className="grid gap-4 grid-cols-2">
                    {/* Item Type */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="item_type">Item Type</Label>
                      <div>
                        <Controller
                          name="item_type"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="item_type">
                                <SelectValue placeholder="Select Item Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Lifting Equipment">Lifting Equipment</SelectItem>
                                <SelectItem value="Lifting Accessories">Lifting Accessories</SelectItem>
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

                    {/* Property Table Type */}
                    <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                      <Label htmlFor="property_table_type">
                        Property Table Type
                      </Label>
                      <div>
                        <Controller
                          name="property_table_type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              disabled={selectedItemType !== "Lifting Equipment"}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger id="property_table_type">
                                <SelectValue placeholder="Select Property Table Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CRANE CERTIFICATE">CRANE CERTIFICATE</SelectItem>
                                <SelectItem value="ELEVATOR CERTIFICATE">ELEVATOR CERTIFICATE</SelectItem>
                                <SelectItem value="MEWP AND FORKLIFT">MEWP AND FORKLIFT</SelectItem>
                                <SelectItem value="EARTH MOVING EQUIPMENTS">
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

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1">
                      <div className="w-full">
                        <Label htmlFor="description">Description</Label>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <Input id="description" type="text" maxLength={120} {...field} />
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
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex justify-end gap-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="button"
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
                    {loading ? "Saving..." : "Save"}
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
