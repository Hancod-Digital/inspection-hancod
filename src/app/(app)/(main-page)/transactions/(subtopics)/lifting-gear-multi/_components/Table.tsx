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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import EditPopup from './EditPopup' 
import { useSubtopic } from '@/context/SubtopicContext';
import { generateEquipmentCertificateHTMLBody } from '@/lib/utils';
interface EquipmentData {
    slNo: number;
    equipmentID: string;
    title: string;
    equipmentType: string;
    lastThroughDate: string;
    nextTestExam: string;
    status: string;
}

 

export default function EquipmentTable() {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const {getAllSingleSubtopic} = useSubtopic()
    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };
    const {data} = useSubtopic();
    console.log(data);
    const [jobOrderNoOptions,setJobOrderNoOptions] = useState<any>([])
    const [siteOptions,setSiteOptions] = useState<any>([])
    const [ownerOptions,setOwnerOptions] = useState<any>([])
    const [standardOptions,setStandardOptions] = useState<any>([])
    const [equipmentOptions,setEquipmentOptions] = useState<any>([])
    useEffect(()=>{
        const fetchJobOrderNos = async () => {
            const data = await getAllSingleSubtopic("job_orders"); // Fetch the areas
            if (data) {
                console.log(data,"data")
              setJobOrderNoOptions(data); 
            }
          };
          fetchJobOrderNos();
          const fetchEquipments = async () => {
            const data = await getAllSingleSubtopic("equipment"); // Fetch the areas
            if (data) {
              setEquipmentOptions(data); 
            }
          };
          fetchEquipments();
          const fetchSites = async () => {
            const data = await getAllSingleSubtopic("site"); // Fetch the areas
            if (data) {
                console.log(data,"datssa")
              setSiteOptions(data); 
            }
          };
          fetchSites();
          const fetchOwners = async () => {
            const data = await getAllSingleSubtopic("owner"); // Fetch the areas
            console.log(data,"dataa")
            if (data) {
              setOwnerOptions(data); 
            }
          };
          fetchOwners();
          const fetchStandards = async () => {
            const data = await getAllSingleSubtopic("standard"); // Fetch the areas
            if (data) {
              setStandardOptions(data); 
            }
          };
          fetchStandards();
    },[data])

    const printCertificate = (item: any) => {
        //job_number as job_order_no, certificate_no is undefined, location_id is undefined, date of inspection in dd-mm-yyyy format, test_load,
        console.log(equipmentOptions.find((equipment:any)=>equipment.id == item.equipment_no)?.equipment_name);
        console.log({...item,job_order_no:jobOrderNoOptions.find((job:any)=>job.id == item.job_order_no)?.job_no,location_id:siteOptions.find((site:any)=>site.id == item.site)?.site,owner_name:ownerOptions.find((owner:any)=>owner.id == item.owner_name)?.owner,standard:standardOptions.find((standard:any)=>standard.id == item.standard)?.standard});
         
        // console.log(generateEquipmentCertificateHTMLBody({...item,job_order_no:jobOrderNoOptions.find((job:any)=>job.id === item.job_order_no)?.job_number,location_id:siteOptions.find((site:any)=>site.id === item.site)?.site}));
        
          const iframe: any = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
    
        iframe.srcdoc = `
            ${generateEquipmentCertificateHTMLBody({...item,serial_no:equipmentOptions.find((equipment:any)=>equipment.id == item.equipment_no)?.serial_no,job_order_no:jobOrderNoOptions.find((job:any)=>job.id == item.job_order_no)?.job_no,location_id:siteOptions.find((site:any)=>site.id == item.site)?.site,owner_name:ownerOptions.find((owner:any)=>owner.id == item.owner_name)?.owner,standard:standardOptions.find((standard:any)=>standard.id == item.standard)?.standard})}
    
              `
        document.body.appendChild(iframe);
    
        iframe.onload = function () {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
    
          // Remove the iframe after printing
          iframe.contentWindow.onafterprint = function () {
            document.body.removeChild(iframe);
          };
        };
      };
    
    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className='flex justify-start'>
                        <TableHead className="py-4 flex-[1]">Sl. No.</TableHead>
                        <TableHead className="py-4 flex-[1]">Equipment ID</TableHead>
                        <TableHead className="py-4 flex-[2]">Title</TableHead>
                        <TableHead className="py-4 flex-[1]">Equipment Type</TableHead>
                        <TableHead className="py-4 flex-[1]">Inspection Date</TableHead>
                        <TableHead className="py-4 flex-[1]">Next Test Exam</TableHead>
                        <TableHead className="py-4 flex-[1]">Result</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item:any,idx:number) => (
                        <React.Fragment key={idx}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{idx}</TableCell>
                                <TableCell className="py-4 flex-[1]">{item?.equipment_no}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item?.title}</TableCell>
                                <TableCell className="py-4 flex-[1]">{item?.equipmentType}</TableCell>
                                <TableCell className="py-4 flex-[1]">{item?.last_thorough_exam}</TableCell>
                                
                                <TableCell className="py-4 flex-[1]">{item?.next_thorough_exam}</TableCell>
                                <TableCell className="py-4 flex-[1]  ">{item?.result}</TableCell>
                                
                                <TableCell className={`py-4 flex-[1] ${item?.approval_status   ? 'text-orange-500' : 'text-green-500'}`}>
                                    {item?.approval_status ? "Rejected" : "Approved"}
                                </TableCell>
                                <TableCell className="py-4 flex-[1]">
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button>
                                                <ActionButtonIcon />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleEditClick(item?.slNo)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => printCertificate(item)}>Print</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                                {editingRow === item.slNo && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={5}>
                                        <EditPopup onClose={handleCloseEdit} id={item?.id} />
                                        </TableCell>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
