import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon } from "@heroicons/react/solid";
import { useFormContext } from "react-hook-form";

interface Property {
  property: string;
  property_group: string;
  condition: string;
}

interface ComponentProps {
  onFunction: () => void;
  properties: Property[];
  setProperties: (value: Property[]) => void;
}

export default function Component({ onFunction, properties, setProperties }: ComponentProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { formState: { errors } } = useFormContext();

  const handleAddRow = () => {
    const newRow: Property = { property: "", property_group: "", condition: "" };
    setProperties([...properties, newRow]);
    setEditingIndex(properties.length);
  };

  const handleInputChange = (index: number, field: keyof Property, value: string) => {
    const newProperties = [...properties];
    newProperties[index] = { ...newProperties[index], [field]: value };
    setProperties(newProperties);
  };

  const handleDelete = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Property List</span>
        <span onClick={handleAddRow} className="text-red-600 cursor-pointer">+ New</span>
      </div>
      {errors.properties && (
        <div className="text-red-500 mb-4 text-[13px]">
          {errors.properties.message as string}
        </div>
      )}
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="border-r p-2 text-left">Property</TableHead>
            <TableHead className="border-r p-2 text-left">Property Group</TableHead>
            <TableHead className="border-r p-2 text-left">Condition</TableHead>
            <TableHead className="p-2 text-left"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((item: Property, index: number) => (
            <TableRow key={index} className="border-b">
              <TableCell className="border-r p-2 h-12">
                {editingIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={item.property}
                      onChange={(e) => handleInputChange(index, "property", e.target.value)}
                      className={`border rounded w-full p-1 ${
                        errors.properties?.[index]?.property ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.properties?.[index]?.property && (
                      <p className="text-red-500 text-[13px] mt-1">
                        {(errors.properties[index]?.property?.message || '') as string}
                      </p>
                    )}
                  </div>
                ) : (
                  item.property
                )}
              </TableCell>
              <TableCell className="border-r p-2 h-12">
                {editingIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={item.property_group}
                      onChange={(e) => handleInputChange(index, "property_group", e.target.value)}
                      className={`border rounded w-full p-1 ${
                        errors.properties?.[index]?.property_group ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.properties?.[index]?.property_group && (
                      <p className="text-red-500 text-[13px] mt-1">
                        {(errors.properties[index]?.property_group?.message || '') as string}
                      </p>
                    )}
                  </div>
                ) : (
                  item.property_group
                )}
              </TableCell>
              <TableCell className="border-r p-2 h-12">
                {editingIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={item.condition}
                      onChange={(e) => handleInputChange(index, "condition", e.target.value)}
                      className={`border rounded w-full p-1 ${
                        errors.properties?.[index]?.condition ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.properties?.[index]?.condition && (
                      <p className="text-red-500 text-[13px] mt-1">
                        {(errors.properties[index]?.condition?.message || '') as string}
                      </p>
                    )}
                  </div>
                ) : (
                  item.condition
                )}
              </TableCell>
              <TableCell className="p-2 h-12 text-center">
                <TrashIcon
                  className="h-5 w-5 text-red-600 cursor-pointer"
                  onClick={() => handleDelete(index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
