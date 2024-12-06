import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import ColumnModal from './ColumnModal'; // Import ColumnModal

export default function PropertyTable({data,setData}:{data:any,setData:any}) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<string[]>([]); // State to store column names

  // Handle saving the new column
  const handleSaveColumn = (columnName: string) => {
    setColumns((prevColumns) => {
      // Add the new column
      const newColumns = [...prevColumns, columnName];

      // Update each row to add the new column with an empty value
      setData((prevData:any) =>
        prevData.map((row:any) => ({
          ...row,
          [columnName]: '', // Add empty value for the new column in all rows
        }))
      );

      return newColumns;
    });
  };

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      acc[column] = ''; // Initialize each column with an empty value
      return acc;
    }, { property: '' } as { [key: string]: string }); // Include 'property' key

    setData((prevData:any) => [...prevData, newRow]);
  };

  return (
    <div className="w-full mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Properties</span>
        <div className="flex space-x-2">
          <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
            Create Column
          </Button>
          <Button type="button" variant="secondary" onClick={handleAddRow}>
            Add Row
          </Button>
          {/* <Button type="button" variant="secondary" onClick={()=>console.log(data)}>
            Submit
          </Button> */}
        </div>
      </div>
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="border-r p-2 text-left">Condition</TableHead>
            {columns?.map((column, index) => (
              <TableHead key={index} className="p-2 text-left border-r">
                {column}
              </TableHead>
            ))}
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
            data?.map((row:any, index:any) => (
              <TableRow key={index}>
                <TableCell className="p-2">
                  <input
                    type="text"
                    value={row.property || ''}
                    className="w-full  rounded p-2  border-r"
                    onChange={(e) => {
                      const updatedData = [...data];
                      updatedData[index]['property'] = e.target.value;
                      setData(updatedData);
                    }}
                  />
                </TableCell>
                {columns?.map((column) => (
                  <TableCell key={column} className="p-2  border-r">
                    <input
                      type="text"
                      value={row[column] || ''}
                      className="w-full border-none rounded px-2 py-2"
                      onChange={(e) => {
                        const updatedData = [...data];
                        updatedData[index][column] = e.target.value;
                        setData(updatedData);
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Column Modal */}
      <ColumnModal open={open} onOpenChange={setOpen} onSave={handleSaveColumn} />
    </div>
  );
}
