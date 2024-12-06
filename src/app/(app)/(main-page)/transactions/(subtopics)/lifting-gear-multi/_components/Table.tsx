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
import { fetchMultiCertificate } from '@/lib/html';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
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
    
    const [jobOrderNoOptions,setJobOrderNoOptions] = useState<any>([])
    const [siteOptions,setSiteOptions] = useState<any>([])
    const [ownerOptions,setOwnerOptions] = useState<any>([])
    const [standardOptions,setStandardOptions] = useState<any>([])
    const [equipmentOptions,setEquipmentOptions] = useState<any>([])
    useEffect(()=>{
        const fetchJobOrderNos = async () => {
            const data = await getAllSingleSubtopic("job_orders"); // Fetch the areas
            if (data) {
           
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
              
              setSiteOptions(data); 
            }
          };
          fetchSites();
          const fetchOwners = async () => {
            const data = await getAllSingleSubtopic("owner"); // Fetch the areas
        
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
    const [state, setState] = useState<any[]>([]);
    const fetchEquipments = (id: string) => {
      return new Promise((resolve, reject) => {
        makeApiCall(
          () => new MasterService().fetchAllEquipments(id),
          {
            afterSuccess: (data: any) => {
              resolve(data);
            },
            afterError: (error: any) => {
              reject(error);
            },
          }
        );
      });
    }
    const fetchSerialNos = (id: string) =>{
      return new Promise((resolve, reject) => {
        makeApiCall(
          () => new MasterService().fetchSerialNos(id),
          {
            afterSuccess: (data: any) => {
              resolve(data);
            },
            afterError: (error: any) => {
              reject(error);
            },
          }
        );
      });
    }
    const [serialNo,setSerialNo] = useState<any>(null)
    useEffect(() => {
        const generateCertificates = async () => {
            const certificates = await Promise.all(data?.map(async (item) => {
                const serialNo:any = await fetchEquipments(item?.id);
                 
                const serialNoGroups = await Promise.all(serialNo.map(async (item: any) => {
                    return await fetchSerialNos(item.equipment_no);
                }));
                setSerialNo(serialNoGroups)
                return fetchMultiCertificate({
                    ...item,
                    serial_no: serialNo,
                    job_order_no: jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no,
                    location_id: siteOptions.find((site: any) => site.id == item.site)?.site,
                    owner_name: ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner,
                    standard: standardOptions.find((standard: any) => standard.id == item.standard)?.standard
                });
            }) || []);
            setState(certificates);
        };
        generateCertificates();
    }, [data, equipmentOptions, jobOrderNoOptions, siteOptions, ownerOptions, standardOptions]);
    const printCertificate = async(item: any) => {

      const response = await fetch('/equ-certificate/index.html'); 
      let htmlString = await response.text();
      console.log(
        serialNo
  .map((serial: any) => `${serial[0]["serial_no"]}<br />`)
  .join("")
      );
      htmlString = htmlString.replace(/\{\{one\}\}/g, item?.certificate_no);
htmlString = htmlString.replace(/\{\{two\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no);

htmlString = htmlString.replace(/\{\{three\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner);

htmlString = htmlString.replace(/\{\{four\}\}/g, standardOptions.find((standard: any) => standard.id == item.standard)?.standard);

htmlString = htmlString.replace(/\{\{five\}\}/g, siteOptions.find((site: any) => site.id == item.site)?.site);

htmlString = htmlString.replace(/\{\{six\}\}/g, item?.inspection_date);

htmlString = htmlString.replace(/\{\{seven\}\}/g, item?.equipment_description);

htmlString = htmlString.replace(/\{\{eight\}\}/g, serialNo
  .map((serial: any) => `${serial[0]["serial_no"]}<br />`)
  .join(""));

htmlString = htmlString.replace(/\{\{nine\}\}/g, `${item?.multiequipments ? (item?.multiequipments?.length < 10 ? "0" + item?.multiequipments?.length : item?.multiequipments?.length) : "01"}`);

htmlString = htmlString.replace(/\{\{ten\}\}/g, item?.description);

htmlString = htmlString.replace(/\{\{eleven\}\}/g, item?.proof_load);

htmlString = htmlString.replace(/\{\{twelve\}\}/g, item?.safe_working_load);

htmlString = htmlString.replace(/\{\{thirteen\}\}/g, item?.last_test_exam);

htmlString = htmlString.replace(/\{\{forteen\}\}/g, item?.next_test_exam);

htmlString = htmlString.replace(/\{\{fifteen\}\}/g, item?.last_thorough_exam);

htmlString = htmlString.replace(/\{\{sixteen\}\}/g, item?.next_thorough_exam);

             
const cssResponse = await fetch('/equ-certificate/index.css');
  let cssText = await cssResponse.text();
  
cssText = cssText.replace(/\{\{seventeen\}\}/g, !item?.first_examination ? " 36%" :" 43.79%");

cssText = cssText.replace(/\{\{eighteen\}\}/g, item?.six_month_interval ? " 89%" :" 96%");

cssText = cssText.replace(/\{\{nineteen\}\}/g,  !item?.twelve_month_interval ? " 89.17%;" : "  96.47%;");

cssText = cssText.replace(/\{\{twenty\}\}/g,  !item?.correct_installation ? "36%" : "43.79%;");

cssText = cssText.replace(/\{\{twentyone\}\}/g,  item?.examination_scheme ? "89.17%;" : "  96.47%;");

cssText = cssText.replace(/\{\{twentytwo\}\}/g,  item?.exceptional_circumstances ? "96.47%;" : " 89.47%;");

htmlString = htmlString.replace(/\{\{twentythree\}\}/g, item?.defect_description);

htmlString = htmlString.replace(/\{\{twentyfour\}\}/g, item?.test_particulars);

cssText = cssText.replace(/\{\{jacob\}\}/g, item?.safe_to_use ?" 89.28%":"96%"); 




const styleElement = document.createElement('style');
  styleElement.textContent = cssText;
 



const htmlElement = document.createElement('div');


  htmlElement.innerHTML = htmlString;
  document.head.appendChild(styleElement);

  document.body.appendChild(htmlElement);
  htmlElement.style.width = '1133px';
  htmlElement.style.height = '1823px';

  const printWindow = window.open('', '', 'width=1133,height=1823');

  // Write the HTML and CSS into the new window
  printWindow?.document.open();
  printWindow?.document.write(`
    <html>
   
      <head>
       <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated by Codia AI</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BentonSans+Black:wght@400&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
    <link rel="stylesheet" href="index.css" />
        <style>${cssText}</style>
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `);
  printWindow?.document.close();
  document.body.removeChild(htmlElement);
  document.head.removeChild(styleElement);
//         const iframe: any = window.document.createElement('iframe');
//         iframe.style.visibility = 'hidden';
//         iframe.style.position = 'fixed';
//         iframe.style.right = '0';
//         iframe.style.bottom = '0';
//         iframe.style.width = '3000px';
//         iframe.style.height = '5000px';
        
//         const certificate = state.find(cert => cert.includes(item.id));
       
//         const blob = new Blob([certificate], { type: 'text/html' });
// const url = URL.createObjectURL(blob);
// console.log(url);

//         iframe.src=url
//             document.body.appendChild(iframe);
        
//             iframe.onload = function () {
//               iframe.contentWindow.focus();
//               iframe.contentWindow.print();
        
//               // Remove the iframe after printing
//               iframe.contentWindow.onafterprint = function () {
//                 document.body.removeChild(iframe);
//               };
//             };
          
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
                                            <DropdownMenuItem onClick={() => handleEditClick(item?.id)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => printCertificate(item)}>Print</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                                {editingRow === item.id && (
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
