// Component2.js
'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiX } from 'react-icons/fi'; // Using react-icons for the clear icon

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepper } from "../_context/Context";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the fields to map to
const fields = [
  { id: "name", label: "Name" },
  { id: "contact_number", label: "Contact Number" },
  { id: "email", label: "Email" },
  { id: "address", label: "Address" },
  { id: "gender", label: "Gender" },
  { id: "company", label: "Company" },
  { id: "id_no", label: "Qatar ID/ Employer ID No." },
  { id: "designation", label: "Designation / Course" },
  { id: "issued_on", label: "Issued On" },
  { id: "course_duration", label: "Course Duration (In Days)" },
  { id: "model_level", label: "Model/Level" },
  { id: "valid_untill", label: "Expiry Date" },
];

// Define the Zod schema for mappings
const mappingsSchema = z.object(
  fields.reduce((acc:any, field:any) => {
    acc[field.id] = z
      .string()
      .min(1, { message: `${field.label} is required` })
      .refine((val) => val !== "none", {
        message: `${field.label} must be selected`,
      });
    return acc;
  }, {})
);

export default function Map({ errors, setErrors }:any) {
  const { data, mappings, setMappings } = useStepper(); // Access imported data, mappings, and setMappings from context

  // Extract headers from the first row of the data
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  // Update the mappings state when a field is mapped to a specific header
  const handleMappingChange = (fieldId:string, selectedHeader:string) => {
    setMappings((prevMappings:any) => ({
      ...prevMappings,
      [fieldId]: selectedHeader,
    }));
  };

  // Validate mappings whenever they change
  useEffect(() => {
    try {
      mappingsSchema.parse(mappings);
      setErrors({});
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors = e.errors.reduce((acc:any, error:any) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  }, [mappings]);

  const companyDetailIndex = fields.findIndex((field) => field.id === "company");

  // Handler to clear the mapping for a specific field
  const handleClearMapping = (fieldId:any) => {
    setMappings((prevMappings:any) => ({
      ...prevMappings,
      [fieldId]: "none", // Assuming "none" is the default unselected state
    }));
    setErrors((prevErrors:any) => ({
      ...prevErrors,
      [fieldId]: undefined, // Clear any existing error for this field
    }));
  };

  return (
    <Card className="w-full p-5 mx-auto">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">
          Your Selected File: sample_userdetails.csv
        </p>
        
        <p className="text-primary  mb-6">The best match to each field on the selected file have been auto-selected.</p>

        <div className="grid gap-8 md:grid-cols-2">
          <h3 className="text-lg font-medium mb-4">Details</h3>
          <h3 className="text-lg font-medium mb-4">IMPORTED FILE HEADERS</h3>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              {index === companyDetailIndex && (
                <div className="text-primary font-medium mt-4 mb-2 md:col-span-2">
                  Company/Other Details
                </div>
              )}
              <div className="grid gap-8 md:grid-cols-2 ">
                <div className="text-sm flex-1 w-full">{field.label}</div>
                <div className="relative m-auto w-full">
                  <Select
                    value={mappings[field.id]}
                    onValueChange={(value) => {
                      handleMappingChange(field.id, value);
                      setErrors((prev:any) => ({ ...prev, [field.id]: undefined }));
                    }}
                  >
                    <SelectTrigger className="w-full pr-8">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>

                  {/* Conditionally render the clear button only if a mapping exists */}
                  {mappings[field.id] && mappings[field.id] !== "none" && (
                    <button
                      type="button"
                      onClick={() => handleClearMapping(field.id)}
                      className="absolute right-14 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-gray-700 focus:outline-none"
                      aria-label={`Clear selection for ${field.label}`}
                    >
                      <FiX size={18} />
                    </button>
                  )}

                  {errors[field.id] && (
                    <p className="text-red-500 mt-2 text-[12px] ">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
