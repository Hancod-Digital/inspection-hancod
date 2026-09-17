'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditPopup from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';
import DeleteDialogue from '@/components/ui/delete-dialog';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';
import { MasterService } from '@/services/api/masters-service';

export default function EquipmentTable({searchValue,setIsChanged,isChanged}:{searchValue:string,setIsChanged:any,isChanged:any}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { deleteRecord} = useSubtopic();
    const [data, setData] = useState<any>(null);

    const fetchLocations = async () => {
      try {
        const datas = await new MasterService().getLocationDetails();
        setData(datas ?? []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      fetchLocations();
    }, [isChanged]);
  
      
    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo); 
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
        setIsChanged((prev: boolean) => !prev);
    };

    const handleDelete = async (locationId: number) => {
        try {
            await deleteRecord(locationId);
        } catch (error) {
            console.error('Error deleting location:', error);
        } finally {
            // Update UI immediately, then refetch so list stays in sync without a full page reload
            setData((prev: any) =>
                Array.isArray(prev)
                    ? prev.filter((item: any) => Number(item.location?.id) !== Number(locationId))
                    : []
            );
            await fetchLocations();
            setIsChanged((prev: boolean) => !prev);
        }
    };

    const rearrangedData  = data
    ? data.filter((item: any) =>
        item.location?.name?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];
    const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(rearrangedData);
    
    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto ">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-4">Sl. No.</TableHead>
                        <TableHead className="py-4">Location</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                    currentData && currentData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9}>
              <div className="text-center text-gray-400 py-8">NO DATA AVAILABLE</div>
            </TableCell>
          </TableRow>
        ) : (
                    currentData?.map((item:any,idx:any) => {
                        const locationId = item.location?.id;
                        return (
                        <React.Fragment key={locationId ?? idx}> 
                            <TableRow>
                                <TableCell className="py-4">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                                <TableCell className="py-4">{item?.location?.name}</TableCell>
                                <TableCell className="py-4">{item?.location?.status}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(idx + 1)} className="text-red-500">
                                            <EditIcon />
                                        </button>
                                        <DeleteDialogue onConfirm={() => handleDelete(locationId)} triggerButton={<button className="text-red-500">
                                            <DeleteIcon />
                                        </button>} />
                                    </div>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                                {editingRow === idx + 1 && locationId != null && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={4}>
                                            <div className="overflow-hidden">
                                                <EditPopup onClose={handleCloseEdit} id={locationId} />
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </React.Fragment>
                    )})
                    )}
                </TableBody>
            </Table>
            {data && data.length > 6 && (
                <div className='absolute bottom-0 right-0'>
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
        </div>
    );
}
