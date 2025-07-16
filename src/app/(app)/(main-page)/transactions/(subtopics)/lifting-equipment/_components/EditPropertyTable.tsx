import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect, useRef } from 'react';
import ColumnModal from './ColumnModal';
import { Trash2 } from 'lucide-react';

export default function PropertyTable({ data, setData, item_type }: { data: any; setData: any; item_type: any }) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const initialRender = useRef(true);
  const [internalData, setInternalData] = useState<any[]>([]);
 
  // Initialize internalData when component mounts or data changes
  useEffect(() => {
    const safeData = Array.isArray(data) ? data : [];
    setInternalData(safeData);
    // console.log("Data prop changed, new length:", safeData.length);
  }, [data]);

  // Set initial columns based on item_type
  useEffect(() => {
    if (item_type === "CRANE CERTIFICATE") {
      // console.log("CRANE CERTIFICATE");
      setColumns(["CONDITION", "BOOM LENGTH", "RADIUS", "TEST LOAD", "SWL"]);
    } else if (item_type === "MEWP AND FORKLIFT" || item_type === "ELEVATOR CERTIFICATE") {
      // console.log("MEWP AND FORKLIFT");
      setColumns(["TEST LOAD", "SWL"]);
    } else {
      // console.log("ELSE", item_type);
      setColumns([]);
    }
  }, [item_type]);

  // If columns change, ensure data rows contain those columns
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setInternalData((prevData) => {
      // For each row, if a column doesn't exist, initialize it
      return prevData.map((row) => {
        const updatedRow = { ...row };
        columns.forEach((col) => {
          if (!(col in updatedRow)) {
            updatedRow[col] = '';
          }
        });
        return updatedRow;
      });
    });
    
    // Also update parent state
    setData((prevData: any[]) => {
      const safeData = Array.isArray(prevData) ? prevData : [];
      
      return safeData.map((row) => {
        const updatedRow = { ...row };
        columns.forEach((col) => {
          if (!(col in updatedRow)) {
            updatedRow[col] = '';
          }
        });
        return updatedRow;
      });
    });
  }, [columns, setData]);

  // Handle saving the new column
  const handleSaveColumn = (columnName: string) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns, columnName];
      
      // Update internal state
      setInternalData((prevData) => {
        return prevData.map((row: any) => ({
          ...row,
          [columnName]: ''
        }));
      });
      
      // Update parent state
      setData((prevData: any) => {
        const safeData = Array.isArray(prevData) ? prevData : [];
        return safeData.map((row: any) => ({
          ...row,
          [columnName]: ''
        }));
      });
      
      return newColumns;
    });
  };

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow: { [key: string]: string } = {};
    columns.forEach((col) => {
      newRow[col] = '';
    });
    
    // Update internal state first
    setInternalData((prevData) => {
      const newData = [...prevData, newRow];
      // console.log("Adding new row to internal state. New length:", newData.length);
      return newData;
    });
    
    // Then update parent state
    setData((prevData: any) => {
      const safeData = Array.isArray(prevData) ? prevData : [];
      const newData = [...safeData, newRow];
      // console.log("Adding new row to parent state. Previous length:", safeData.length, "New length:", newData.length);
      return newData;
    });
  };

  // Handle deleting a row
  const handleDeleteRow = (rowIndex: number) => {
    // Update internal state first
    setInternalData((prevData) => {
      const newData = prevData.filter((_, index) => index !== rowIndex);
      // console.log("Deleting row from internal state. New length:", newData.length);
      return newData;
    });
    
    // Then update parent state
    setData((prevData: any) => {
      const safeData = Array.isArray(prevData) ? prevData : [];
      const newData = safeData.filter((_, index) => index !== rowIndex);
      // console.log("Deleting row from parent state. Previous length:", safeData.length, "New length:", newData.length);
      return newData;
    });
  };

  // Handle input changes with proper immutability
  const handleInputChange = (rowIndex: number, column: string, value: string) => {
    // Update internal state
    setInternalData((prevData) => {
      return prevData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [column]: value
          };
        }
        return row;
      });
    });
    
    // Update parent state
    setData((prevData: any[]) => {
      const safeData = Array.isArray(prevData) ? prevData : [];
      return safeData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [column]: value
          };
        }
        return row;
      });
    });
  };

  // console.log("Rendering with internal data:", internalData.length, "items");
  // console.log("Rendering with props data:", Array.isArray(data) ? data.length : 'Not an array');

  return (
    <>
      {columns?.length > 0 && (
        <div className="w-full mx-auto py-5">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Properties</span>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAddRow}
              >
                Add Row ({internalData.length})
              </Button>
            </div>
          </div>
          <Table className="border border-gray-200">
            <TableHeader>
              <TableRow className="border-b">
                {columns.map((column, index) => (
                  <TableHead key={index} className="p-2 text-left border-r">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {internalData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length || 1} className="p-2 text-center text-gray-500">
                    No data to display
                  </TableCell>
                </TableRow>
              ) : (
                internalData.map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={column} className="p-2 border-r">
                        <input
                          type="text"
                          value={row[column] || ''}
                          className="w-full border rounded px-2 py-2"
                          onChange={(e) => handleInputChange(rowIndex, column, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="p-2 w-16">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Column Modal */}
          <ColumnModal open={open} onOpenChange={setOpen} onSave={handleSaveColumn} />
        </div>
      )}
    </>
  );
}