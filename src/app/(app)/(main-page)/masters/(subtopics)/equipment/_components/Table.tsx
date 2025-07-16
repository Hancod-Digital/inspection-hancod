'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import EditPopup from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';

import DeleteDialogue from '@/components/ui/delete-dialog';
import Standard from '../../_common/Standard'
import Manufacturer from '../../_common/Manufacturer'
import Location from '../../_common/Location'
import ClonePopup from './ClonePopup';

import { PaginationDemo } from '@/components/pagination-demo';

export default function Component({searchValue,isManufacturer,isStandard,isLocation, setIsManufacturer, setIsStandard, setIsLocation,setChanged,changed}:{searchValue:string,isManufacturer:boolean,isStandard:boolean,isLocation:boolean, setIsManufacturer: (value: boolean) => void, setIsStandard: (value: boolean) => void, setIsLocation: (value: boolean) => void,setChanged: (value: boolean) => void,changed:boolean}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [cloningRow, setCloningRow] = useState<number | null>(null);
    const { isLoading, error, getAllSingleSubtopic, getMergedData, deleteRecord, data } = useSubtopic();
    const [subtopics, setSubtopics] = useState([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleEditClick = (slNo: number) => {
        setCloningRow(null);
        setEditingRow(slNo === editingRow ? null : slNo);
    };
    const handleCloneClick = (slNo: number) => {
        setEditingRow(null);
        setCloningRow(slNo === cloningRow ? null : slNo);
    };
    const handleCloseEdit = () => {
        setEditingRow(null);
    };
     
    const rearrangedData:any = data?.filter((item:any)=>item.title.toLowerCase().includes(searchValue.toLowerCase()))
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Number of items per page
    const totalPages = Math.ceil(rearrangedData?.length / pageSize);
   
    // Get current page data
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = rearrangedData?.slice(startIndex, startIndex + pageSize);
    const [isSite, setIsSite] = useState(false);
    const [isArea, setIsArea] = useState(false);
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };
    const [isChanged,setIsChanged] = useState(false);
    

    return (
        <div className="px-8 py-3 bg-white   w-[98%] mx-auto ">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Sl. No.</TableHead>
                        <TableHead className="py-4">Equipment ID</TableHead>
                        <TableHead className="py-4">Title</TableHead> 
                        <TableHead className="py-4">Last Through Date</TableHead>
                        <TableHead className="py-4">Next Through Date</TableHead>
                        <TableHead className="py-4">Last Test Date</TableHead>
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
                    currentData?.map((item: any, idx: number) => {
                        const actualIndex = startIndex + idx + 1; // Adjusted index based on pagination
                        return (
                            <React.Fragment key={actualIndex}>
                                <TableRow>
                                    <TableCell className="py-4">{actualIndex}</TableCell>
                                    <TableCell className="py-4">{item?.equipment_no}</TableCell>
                                    <TableCell className="py-4">{item?.title}</TableCell>
                                    <TableCell className="py-4">{item?.last_thorough_date}</TableCell>
                                    <TableCell className="py-4">{item?.next_thorough_date === null || item?.next_thorough_date === '' ? "NOT APPLICABLE": item?.next_thorough_date}</TableCell>
                                    <TableCell className="py-4">{item?.last_test_date}</TableCell>
                                    <TableCell className="py-4">{item?.status}</TableCell>
                                    <TableCell className="py-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button>
                                                    <ActionButtonIcon />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleEditClick(actualIndex)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCloneClick(actualIndex)}>
                                                    Clone
                                                </DropdownMenuItem>
                                                <DeleteDialogue
                                                    onConfirm={async () => await deleteRecord(item.id)}
                                                    triggerButton={
                                                        <DropdownMenuItem 
                                                            onSelect={(event) => event.preventDefault()}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </TableCell>
                                </TableRow>
                                <AnimatePresence>
                                    {cloningRow === actualIndex && (
                                        <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={9}>
                                            <div className="overflow-hidden">
                                                {isManufacturer && (<Manufacturer onClose={()=>setIsManufacturer(false)} setChanged={setChanged} changed={changed}/>)}
                                                {isStandard && (<Standard  onClose={()=>setIsStandard(false)} setChanged={setChanged} changed={changed}/>)}
                                                {isLocation && (<Location  onClose={()=>setIsLocation(false)}   changed={changed} setChanged={setChanged}/>)}
                                                {!isManufacturer && !isStandard && !isLocation && (
                                                    <ClonePopup 
                                                        onClose={()=>setCloningRow(null)} 
                                                        id={item.id} 
                                                        isManufacturer={isManufacturer} 
                                                        isStandard={isStandard} 
                                                        isLocation={isLocation}  
                                                        setIsManufacturer={setIsManufacturer} 
                                                        setIsStandard={setIsStandard} 
                                                        setIsLocation={setIsLocation}
                                                        setChanged={setChanged}
                                                        changed={changed}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                    )}
                                    {editingRow === actualIndex && (
                                        <motion.tr
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <TableCell colSpan={9}>
                                                <div className="overflow-hidden">
                                                    {isManufacturer && (<Manufacturer onClose={()=>setIsManufacturer(false)} setChanged={setChanged} changed={changed}/>)}
                                                    {isStandard && (<Standard  onClose={()=>setIsStandard(false)} setChanged={setChanged} changed={changed}/>)}
                                                    {isLocation && (<Location  onClose={()=>setIsLocation(false)}   changed={changed} setChanged={setChanged}/>)}
                                                    {!isManufacturer && !isStandard && !isLocation && (
                                                        <EditPopup 
                                                            onClose={handleCloseEdit} 
                                                            id={item.id} 
                                                            isManufacturer={isManufacturer} 
                                                            isStandard={isStandard} 
                                                            isLocation={isLocation}  
                                                            setIsManufacturer={setIsManufacturer} 
                                                            setIsStandard={setIsStandard} 
                                                            setIsLocation={setIsLocation}
                                                            setChanged={setChanged}
                                                            changed={changed}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        );
                    })
                    )}
                </TableBody>
                 
                
            </Table>
            {/* <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} /> */}
            {currentData && currentData.length > 6 && (
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
            {/* Pagination Controls */}
           
        </div>
    );
}
