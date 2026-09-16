'use client';
import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion, AnimatePresence } from 'framer-motion';
import JobDetailsForm from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';
import EditIcon from '@/components/icons/EditIcon';
import DeleteDialogue from '@/components/ui/delete-dialog';
import DeleteIcon from '@/components/icons/DeleteIcon';
import usePagination from '@/hooks/usePagination';
import { PaginationDemo } from '@/components/pagination-demo';



export default function JobTable({isState,setIsState,search,setSearch}:{isState:boolean,setIsState:any,search:string,setSearch:any}) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const { getAllJobOrders, getAllSingleSubtopic, deleteJobOrder } = useSubtopic()
  const handleEditClick = (slNo: number) => {
    setEditingRow(slNo === editingRow ? null : slNo);
  };
  const [jobOrders, setJobOrders] = useState<any>([])
  useEffect(() => {
    getAllJobOrders().then((data) => {
     
      setJobOrders(data)
    })
  }, [isState])
  const [surveyorOptions, setSurveyorOptions] = useState<any>([])
  const [locationOptions, setLocationOptions] = useState<any>([])
  const [equipmentOptions, setEquipmentOptions] = useState<any>([])

  useEffect(() => {
    const fetchSurveyors = async () => {
      const data: any = await getAllSingleSubtopic("surveyor"); // Fetch the areas
      if (data) {
        setSurveyorOptions(data); // Set the area options to the fetched data
      }
    };
    fetchSurveyors();
    const fetchLocations = async () => {
      const data: any = await getAllSingleSubtopic("location"); // Fetch the areas
      if (data) {
        setLocationOptions(data.filter((item:any)=>item.status==="ACTIVE")); // Set the area options to the fetched data
      }
    };
    fetchLocations();
    const fetchEquipment = async () => {
      const data: any = await getAllSingleSubtopic("equipment"); // Fetch the areas
      if (data) {
        setEquipmentOptions(data.filter((item:any)=>item.status==="ACTIVE")); // Set the area options to the fetched data
      }
    };
    fetchEquipment();
  }, [jobOrders])
  const handleCloseEdit = () => {
    setEditingRow(null);
  };
const {currentPage,totalPages,pageSize,handlePreviousPage,handleNextPage,setCurrentPage,currentData}=usePagination(jobOrders.filter((item:any)=>item.job_no.toLowerCase().includes(search.toLowerCase())))
  return (
    <div className="px-8 py-3 bg-white w-[98%] mx-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="flex justify-start">
            <TableHead className="py-4 flex-[1]">Sl. No.</TableHead>
            <TableHead className="py-4 flex-[1]">Job Number</TableHead>
            <TableHead className="py-4 flex-[1]">Client Name</TableHead>
            <TableHead className="py-4 flex-[2]">Contact Number</TableHead>
            <TableHead className="py-4 flex-[2]">Surveyor</TableHead>
            <TableHead className="py-4 flex-[2]">Location</TableHead>
            <TableHead className="py-4 flex-[2]">Equipment Details</TableHead>
            <TableHead className="py-4 flex-[2]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData && currentData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>
              <div className="text-center text-gray-400 py-8">NO DATA AVAILABLE</div>
            </TableCell>
          </TableRow>
        ) : (
          currentData?.map((item: any, idx: number) => (
            <React.Fragment key={idx}>
              <TableRow className="flex">
                <TableCell className="py-4 flex-[1]">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="py-4 flex-[1]">{item?.job_no}</TableCell>
                <TableCell className="py-4 flex-[1]">{item?.client_name}</TableCell>
                <TableCell className="py-4 flex-[2]">{item?.contact_number}</TableCell>
                <TableCell className="py-4 flex-[2]">{surveyorOptions.find((surveyor: any) => surveyor.id === item?.surveyor)?.surveyor}</TableCell>
                <TableCell className="py-4 flex-[2]">{locationOptions.find((location: any) => location.id === item?.location)?.location}</TableCell>
                <TableCell className="py-4 flex-[2]">{item?.equipment_details}</TableCell>
                <TableCell className="py-4 flex-[2]">
                  <div className="flex gap-4">
                    <button onClick={() => handleEditClick(idx)}>
                      <EditIcon />

                    </button>
                    <DeleteDialogue
                      onConfirm={async () => {
                        await deleteJobOrder(item.id)
                        setIsState(!isState)
                      }
                      }
                      triggerButton={
                        <button>
                          <DeleteIcon />
                        </button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
              {editingRow === idx && (
                <TableRow>
                  <TableCell colSpan={7} className="p-4">
                    <AnimatePresence>
                      <JobDetailsForm setIsState={setIsState} isState={isState} onClose={handleCloseEdit} id={item.id} />
                    </AnimatePresence>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
          )}
        </TableBody>
      </Table>
      {/* <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} /> */}
      {jobOrders && jobOrders.length > 6 && (
        <div className='absolute bottom-0 right-0 '>
          <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
