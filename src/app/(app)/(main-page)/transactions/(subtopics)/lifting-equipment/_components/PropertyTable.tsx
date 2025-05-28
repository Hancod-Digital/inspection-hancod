import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import ColumnModal from './ColumnModal'; // Import ColumnModal
import { Trash2 } from 'lucide-react';

export default function PropertyTable({ data, setData, item_type }: { data: any; setData: any; item_type: any }) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
 
  // Set initial columns based on item_type
  useEffect(() => {
    if (item_type === "CRANE CERTIFICATE") {
      setColumns(["CONDITION", "BOOM LENGTH", "RADIUS", "TEST LOAD", "SWL"]);
    } else if (item_type === "MEWP AND FORKLIFT" || item_type === "ELEVATOR CERTIFICATE") {
      setColumns(["TEST LOAD", "SWL"]);
    } else {
      setColumns([]);
    }
  }, [item_type]);

  // If columns change, ensure data rows contain those columns
  useEffect(() => {
    setData((prevData: any[]) => {
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
  }, [columns, setData]);

  // Handle saving the new column
  const handleSaveColumn = (columnName: string) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns, columnName];
      // Add the new column with empty values to each row
      setData((prevData: any) =>
        prevData.map((row: any) => ({
          ...row,
          [columnName]: ''
        }))
      );
      return newColumns;
    });
  };

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow: { [key: string]: string } = {};
    columns.forEach((col) => {
      newRow[col] = '';
    });
    setData((prevData: any) => [...prevData, newRow]);
    console.log(data,"pppppppppppp");
  };

  // Handle deleting a row
  const handleDeleteRow = (rowIndex: number) => {
    setData((prevData: any) => {
      const safeData = Array.isArray(prevData) ? prevData : [];
      const newData = safeData.filter((_, index) => index !== rowIndex);
      console.log("Deleting row. Previous length:", safeData.length, "New length:", newData.length);
      return newData;
    });
  };

  return (
    <>
      {columns?.length > 0 && (
        <div className="w-full mx-auto py-5">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Properties</span>
            <div className="flex space-x-2">
              <Button type="button" variant="secondary" onClick={handleAddRow}>
                Add Row
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
                <TableHead className="p-2 text-left w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="p-2 text-center text-gray-500">
                    No data to display
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={column} className="p-2 border-r">
                        <input
                          type="text"
                          value={row[column] || ''}
                          className="w-full border rounded px-2 py-2"
                          onChange={(e) => {
                            const updatedData = [...data];
                            updatedData[rowIndex][column] = e.target.value;
                            setData(updatedData);
                          }}
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
