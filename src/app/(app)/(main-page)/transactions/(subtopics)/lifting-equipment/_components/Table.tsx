// components/EquipmentTable.tsx

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
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import EditPopup from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import DeleteDialogue from '@/components/ui/delete-dialog';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { generateRows } from '@/lib/utils';
import Manufacturer from '../../../../masters/(subtopics)/manufacturer/_components/AddEquipment'
import Location from '../../../../masters/(subtopics)/location/_components/AddEquipment'
import Equipment from '../../../../masters/(subtopics)/equipment/_components/AddEquipment'
import Standard from '../../../../masters/(subtopics)/standard/_components/AddEquipment'
import Owner from '../../../../masters/(subtopics)/owner/_components/AddEquipment'
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

export default function EquipmentTable({setIsSite,setIsArea,setIsLocation,setIsEquipment,setIsStandard,setIsOwner,setIsManufacturer,isLocation,isEquipment,isStandard,isOwner,isManufacturer,searchValue}:any) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const { data, isLoading, error, getAllSingleSubtopic,deleteRecord } = useSubtopic();

  const [jobOrderNoOptions, setJobOrderNoOptions] = useState<any>([]);
  const [siteOptions, setSiteOptions] = useState<any>([]);
  const [ownerOptions, setOwnerOptions] = useState<any>([]);
  const [standardOptions, setStandardOptions] = useState<any>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<any>([]);
  const [serialNo, setSerialNo] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const jobOrders = await getAllSingleSubtopic('job_orders');
      const equipments = await getAllSingleSubtopic('equipment');
      const sites = await getAllSingleSubtopic('site');
      const owners = await getAllSingleSubtopic('owner');
      const standards = await getAllSingleSubtopic('standard');

      if (jobOrders) setJobOrderNoOptions(jobOrders);
      if (equipments) setEquipmentOptions(equipments);
      if (sites) setSiteOptions(sites);
      if (owners) setOwnerOptions(owners);
      if (standards) setStandardOptions(standards);
    };
    fetchData();
  }, [getAllSingleSubtopic]);

  const handleEditClick = (id: number) => {
    setEditingRow(id === editingRow ? null : id);
  };

  const handleCloseEdit = () => {
    setEditingRow(null);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        // await deleteRecord(id);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };
  const [manufacturerOptions, setManufacturerOptions] = useState<any>([]);
   
  useEffect(() => {
    const fetchManufacturers = async () => {
      const data = await getAllSingleSubtopic("manufacturer"); // Fetch the areas
      if (data) {
        setManufacturerOptions(data); // Set the area options to the fetched data
      }
    };
    fetchManufacturers();
    const fetchOwners = async () => {
      const data = await getAllSingleSubtopic("owner"); // Fetch the areas
      if (data) {
        setOwnerOptions(data); // Set the area options to the fetched data
      }
    };
    fetchOwners();
  }, [getAllSingleSubtopic]);
   
  const printCertificate = async (item: any) => {
    // Fetch additional item details (like serial_no) if needed
    let equipment:any = []
    await makeApiCall(
      () => new MasterService().fetchEquipmentDetails(item?.equipment_no),
      {
        afterSuccess: async (data: any) => {
          console.log(data,"data");
          equipment = data[0]
          setSerialNo(data[0]?.serial_no);
          console.log(equipment,equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.css" : equipment.property_table_type == "MEWP AND FORKLIFT"  ? "/transactions/mewp_and_forklift/index.css" : equipment.property_table_type == "ELEVATOR CERTIFICATE" ? "/transactions/elevation_certificate/index.css" :"/transactions/earth_moving/index.css");
    
    // Fetch the HTML template
    const response = await fetch(`${equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.html" : equipment.property_table_type == "MEWP AND FORKLIFT"  ? "/transactions/mewp_and_forklift/index.html" : equipment.property_table_type == "ELEVATOR CERTIFICATE" ? "/transactions/elevation_certificate/index.html" : "/transactions/earth_moving/index.html"}`);
    let htmlString = await response.text();

    // Fetch the CSS template 
    const cssResponse = await fetch(`${equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.css" : equipment.property_table_type == "MEWP AND FORKLIFT"  ? "/transactions/mewp_and_forklift/index.css" : equipment.property_table_type == "ELEVATOR CERTIFICATE" ? "/transactions/elevation_certificate/index.css" : "/transactions/earth_moving/index.css"}`);
    let cssText = await cssResponse.text();

    // Replace placeholders in HTML:
    // Adjust these replacements to match your actual placeholders and data
    htmlString = htmlString.replace(/\{\{one\}\}/g, item?.certificate_no || '');
    htmlString = htmlString.replace(/\{\{two\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no || '');
    htmlString = htmlString.replace(/\{\{three\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner || '');
    htmlString = htmlString.replace(/\{\{four\}\}/g, standardOptions.find((standard: any) => standard.id == item.standard)?.standard || '');
    htmlString = htmlString.replace(/\{\{five\}\}/g, siteOptions.find((site: any) => site.id == item.site)?.site || '');
    htmlString = htmlString.replace(/\{\{six\}\}/g, item?.inspection_date || '');

    htmlString = htmlString.replace(/\{\{six1\}\}/g, equipment.property_table_type == "ELEVATOR CERTIFICATE" ? item?.lift_location :  manufacturerOptions.find((manufacturer: any) => manufacturer.id == item.manufacturer)?.manufacturer );
    htmlString = htmlString.replace(/\{\{six2\}\}/g, equipment?.registration_no || '');
    htmlString = htmlString.replace(/\{\{six3\}\}/g, equipment.property_table_type == "ELEVATOR CERTIFICATE" ? manufacturerOptions.find((manufacturer: any) => manufacturer.id == item.manufacturer)?.manufacturer :data[0]?.serial_no || '');
    htmlString = htmlString.replace(/\{\{six4\}\}/g, equipment?.model_no || '');
    htmlString = htmlString.replace(/\{\{six5\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner || '');
    
    htmlString = htmlString.replace(/\{\{seven\}\}/g, item?.equipment_description || '');
    htmlString = htmlString.replace(/\{\{eight\}\}/g, item?.description || '');


    const conditions = (item?.properties?.map((p: any) => p.CONDITION) || [])
    .filter((v: any) => v != null)
    .map((condition: string) => {
      // If length exceeds 10 characters, break it into two lines
      if (condition.length > 6) {
        return `<li>${condition.substring(0, 6)}<br>${condition.substring(6)}</li>`;
      } else {
        return `<li>${condition}</li>`;
      }
    });
  
  // Repeat similar logic for boomLengths, radii, testLoads, and swls
  const boomLengths = (item?.properties?.map((p: any) => p["BOOM LENGTH"]) || [])
    .filter((v: any) => v != null)
    .map((boomLength: string) => {
      if (boomLength.length > 6) {
        return `<li>${boomLength.substring(0, 6)}<br>${boomLength.substring(6)}</li>`;
      } else {
        return `<li>${boomLength}</li>`;
      }
    });
  
  const radii = (item?.properties?.map((p: any) => p.RADIUS) || [])
    .filter((v: any) => v != null)
    .map((radius: string) => {
      if (radius.length > 6) {
        return `<li>${radius.substring(0,6)}<br>${radius.substring(6)}</li>`;
      } else {
        return `<li>${radius}</li>`;
      }
    });
  
  const testLoads = (item?.properties?.map((p: any) => p["TEST LOAD"]) || [])
    .filter((v: any) => v != null)
    .map((testLoad: string) => {
      if (testLoad.length > 6) {
        return `<li>${testLoad.substring(0, 6)}<br>${testLoad.substring(6)}</li>`;
      } else {
        return `<li>${testLoad}</li>`;
      }
    });
  
  const swls = (item?.properties?.map((p: any) => p.SWL) || [])
    .filter((v: any) => v != null)
    .map((swl: string) => {
      if (swl.length > 6) {
        return `<li>${swl.substring(0, 6)}<br>${swl.substring(6)}</li>`;
      } else {
        return `<li>${swl}</li>`;
      }
    });
  console.log(testLoads,"testLoads",swls,"swls");
  
  htmlString = htmlString.replace(/\{\{nine\}\}/g, conditions.length ? `<ul>${conditions.join('')}</ul>` : '');
  htmlString = htmlString.replace(/\{\{ten\}\}/g, boomLengths.length ? `<ul>${boomLengths.join('')}</ul>` : '');
  htmlString = htmlString.replace(/\{\{eleven\}\}/g, radii.length ? `<ul>${radii.join('')}</ul>` : '');
  htmlString = htmlString.replace(/\{\{twelve\}\}/g, testLoads.length ? `<ul>${testLoads.join('')}</ul>` : '');
  htmlString = htmlString.replace(/\{\{twelve1\}\}/g, swls.length ? `<ul>${swls.join('')}</ul>` : '');
  
htmlString = htmlString.replace(/\{\{four1\}\}/g, item?.version);

    htmlString = htmlString.replace(/\{\{thirteen\}\}/g, item?.last_test_exam || '');
    htmlString = htmlString.replace(/\{\{forteen\}\}/g, item?.next_test_exam || '');
    htmlString = htmlString.replace(/\{\{fifteen\}\}/g, item?.last_thorough_exam || '');
    htmlString = htmlString.replace(/\{\{sixteen\}\}/g, item?.next_thorough_exam || '');
    htmlString = htmlString.replace(/\{\{twentythree\}\}/g, item?.defect_description || '');
    htmlString = htmlString.replace(/\{\{twentyfour\}\}/g, item?.test_particulars || '');
    console.log(
      "First Examination: " + item?.first_examination,
      " | Six Month Interval: " + item?.six_month_interval,
      " | Twelve Month Interval: " + item?.twelve_month_interval,
      " | Correct Installation: " + item?.correct_installation,
      " | Examination Scheme: " + item?.examination_scheme,
      " | Exceptional Circumstances: " + item?.exceptional_circumstances,
      " | Safe to Use: " + item?.safe_to_use
    );
        // Replace placeholders in CSS:
    cssText = cssText.replace(/\{\{seventeen\}\}/g, item?.first_examination ? "36%" : "43.79%");
    cssText = cssText.replace(/\{\{eighteen\}\}/g, item?.six_month_interval ? "89%" : "96%");
    cssText = cssText.replace(/\{\{nineteen\}\}/g, item?.twelve_month_interval ? "89.17%;" : "96.47%;");
    cssText = cssText.replace(/\{\{twenty\}\}/g, item?.correct_installation ? "36%" : "43.79%;");
    cssText = cssText.replace(/\{\{twentyone\}\}/g, item?.examination_scheme ? "89.17%;" : "96.47%;");
    cssText = cssText.replace(/\{\{twentytwo\}\}/g, item?.exceptional_circumstances ? "89.47%;" : "96.47%;");
    cssText = cssText.replace(/\{\{jacob\}\}/g, item?.safe_to_use ? "89.28%" : "96%");

    // Open a new window for printing
    const printWindow = window.open('', '', 'width=1033,height=1823');
    if (!printWindow) return;

    // Write the combined HTML/CSS into the new window
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Equipment Certificate</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BentonSans+Black:wght@400&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
          <style>${cssText}</style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // printWindow.print();
    // printWindow.close();
        },
      }
    );
    
    
  };

  const printAnnexure = async (item: any) => {
    console.log(item,"item");
   const data = generateRows(item?.annexures)
   console.log(data,"data");
   const response = await fetch("/backside1/annex-certificate-elevator.html");
   let htmlString = await response.text();
   htmlString = htmlString.replace(/\{\{html\}\}/g, data.rowsHtml);
   htmlString = htmlString.replace(/\{\{css\}\}/g, data.rowsCss);
   htmlString = htmlString.replace(/\{\{four\}\}/g, item?.version);
  //  htmlString = htmlString.replace(/\{\{five\}\}/g, item?.revision_date);

   htmlString = htmlString.replace(/\{\{one\}\}/g, item?.inspection_date);
   htmlString = htmlString.replace(/\{\{two\}\}/g, item?.certificate_no);
   htmlString = htmlString.replace(/\{\{three\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no || '');
   console.log(htmlString,"htmlString");
    // Open a new window for printing
    const printWindow = window.open('', '', 'width=1033,height=1823');
    if (!printWindow) return;

    // Write the combined HTML/CSS into the new window
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Equipment Certificate</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BentonSans+Black:wght@400&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
          
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
  };
  const printBackside = async (item: any) => {
    try {
      // Fetch and process HTML template
      const htmlResponse = await fetch("/backside2/index.html");
      if (!htmlResponse.ok) {
        console.error("Failed to fetch HTML template");
        return;
      }
      let htmlString = await htmlResponse.text();
  
      // Replace placeholders
      htmlString = htmlString.replace(/\{\{one\}\}/g, item?.description || '');
      htmlString = htmlString.replace(/\{\{two\}\}/g, item?.inspection_date || '');
      htmlString = htmlString.replace(/\{\{three\}\}/g, item?.certificate_no || '');
      htmlString = htmlString.replace(/\{\{four\}\}/g, 
        jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no || ''
      );
      htmlString = htmlString.replace(/\{\{five\}\}/g, item?.version || '');
  
      // Fetch CSS
      const cssResponse = await fetch('/backside2/index.css');
      if (!cssResponse.ok) {
        console.error("Failed to fetch CSS");
        return;
      }
      const cssText = await cssResponse.text();
  
      // Open a new window for printing
      const printWindow = window.open('', '', 'width=1033,height=1823');
      if (!printWindow) {
        console.error("Failed to open print window");
        return;
      }
  
      printWindow.document.open();
      // Write HTML and CSS into the print window directly
      printWindow.document.write(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Equipment Certificate</title>
            <style>${cssText}</style>
          </head>
          <body>
            ${htmlString}
          </body>
        </html>
      `);
      printWindow.document.close();
  
      // Focus on the print window
      printWindow.focus();
  
      // If you want to auto-trigger print:
      // printWindow.print();
      // printWindow.close();
      
    
    } catch (error) {
      console.error("An error occurred while printing the backside:", error);
    }
  };
  const [changed,setChanged] = useState(false)
   const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(data?.filter((item:any)=>item?.title?.toLowerCase()?.includes(searchValue?.toLowerCase())));
  return (
    <div className="px-8 py-3 bg-white w-[98%] mx-auto relative min-h-[500px]">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4">Sl. No.</TableHead>
            
            <TableHead className="py-4">Title</TableHead> 
            <TableHead className="py-4">Equipment ID</TableHead>
            <TableHead className="py-4">Inspection Date</TableHead>
            <TableHead className="py-4">Next Thorough Date</TableHead>
            <TableHead className="py-4">Inspection Date</TableHead>
            <TableHead className="py-4">Status</TableHead>
            <TableHead className="py-4"></TableHead>
            <TableHead className="py-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData?.length > 0 ? (
            currentData?.map((item: any, idx: number) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell className="py-4">{idx + 1}</TableCell>
                  <TableCell className="py-4">{item?.title}</TableCell> 
                  <TableCell className="py-4">{equipmentOptions?.find((equipment:any)=>equipment.id == item.equipment_no)?.equipment_no}</TableCell>
                  
                  <TableCell className="py-4">{item?.inspection_date}</TableCell>
                  <TableCell className="py-4">{item?.next_thorough_exam}</TableCell>
                  <TableCell className="py-4">{item?.inspection_date}</TableCell>
                  <TableCell className="py-4">{item?.approval_status}</TableCell>
                  <TableCell
                    className={`py-4 ${
                      item.approval_status == 'true'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {item.approval_status == 'true' ? 'Approved' : 'Rejected'}
                  </TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button>
                          <ActionButtonIcon />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(item.id)}>Edit</DropdownMenuItem>
                        <DeleteDialogue
                                                onConfirm={async () => await deleteRecord(item.id)}
                                                triggerButton={
                                                  <button className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                  Delete
                                              </button>
                                                }
                                            />
                        <DropdownMenuItem onClick={() => printCertificate(item)}>Print</DropdownMenuItem>
                       {equipmentOptions?.find((equipment:any)=>equipment.id == item.equipment_no)?.property_table_type == 'ELEVATOR CERTIFICATE' &&  <DropdownMenuItem onClick={() => printAnnexure(item)}>Print Annexure</DropdownMenuItem>}
                       {equipmentOptions?.find((equipment:any)=>equipment.id == item.equipment_no)?.property_table_type == 'ELEVATOR CERTIFICATE' && item?.description && <DropdownMenuItem onClick={() => printBackside(item)}>Print Details</DropdownMenuItem>}
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
                      <TableCell colSpan={9}>
                        <div className="overflow-hidden">
                          {isLocation && <Location onClose={()=>setIsLocation(false)} setIsSite={setIsSite} setIsArea={setIsArea} />}
                          {isEquipment && <Equipment onClose={() => setIsEquipment(false)} setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation} changed={changed} />}
                          {isStandard && <Standard onClose={()=>setIsStandard(false)} />}
                          {isOwner && <Owner onClose={()=>setIsOwner(false)} />}
                          {isManufacturer && <Manufacturer onClose={()=>setIsManufacturer(false)} />}
                          {!isLocation && !isEquipment && !isStandard && !isOwner && !isManufacturer && <EditPopup onClose={handleCloseEdit} id={item.id} setIsLocation={setIsLocation} setIsEquipment={setIsEquipment} setIsStandard={setIsStandard} setIsOwner={setIsOwner} setIsManufacturer={setIsManufacturer} />}
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="p-2 text-center text-gray-500">
                No data to display
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='absolute bottom-0 right-0'>
        <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
