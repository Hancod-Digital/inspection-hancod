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

export default function EquipmentTable() {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const { data, isLoading, error, getAllSingleSubtopic } = useSubtopic();

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
        },
      }
    );
    console.log(equipment.property_table_type ,"equipment",equipment);
    
    // Fetch the HTML template
    const response = await fetch(`${equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.html" : equipment.property_type == "MEWP AND FORKLIFT" || equipment.property_type == "ELEVATOR CERTIFICATE" ? "/transactions/mewp_and_forklift/index.html" : "/transactions/earth_moving/index.html"}`);
    let htmlString = await response.text();

    // Fetch the CSS template 
    const cssResponse = await fetch(`${equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.css" : equipment.property_type == "MEWP AND FORKLIFT" || equipment.property_type == "ELEVATOR CERTIFICATE" ? "/transactions/mewp_and_forklift/index.css" : "/transactions/earth_moving/index.css"}`);
    let cssText = await cssResponse.text();

    // Replace placeholders in HTML:
    // Adjust these replacements to match your actual placeholders and data
    htmlString = htmlString.replace(/\{\{one\}\}/g, item?.certificate_no || '');
    htmlString = htmlString.replace(/\{\{two\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no || '');
    htmlString = htmlString.replace(/\{\{three\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner || '');
    htmlString = htmlString.replace(/\{\{four\}\}/g, standardOptions.find((standard: any) => standard.id == item.standard)?.standard || '');
    htmlString = htmlString.replace(/\{\{five\}\}/g, siteOptions.find((site: any) => site.id == item.site)?.site || '');
    htmlString = htmlString.replace(/\{\{six\}\}/g, item?.inspection_date || '');

    htmlString = htmlString.replace(/\{\{six1\}\}/g, manufacturerOptions.find((manufacturer: any) => manufacturer.id == item.manufacturer)?.manufacturer || '');
    htmlString = htmlString.replace(/\{\{six2\}\}/g, equipment?.registration_no || '');
    htmlString = htmlString.replace(/\{\{six3\}\}/g, serialNo || '');
    htmlString = htmlString.replace(/\{\{six4\}\}/g, equipment?.model_no || '');
    htmlString = htmlString.replace(/\{\{six5\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner || '');
console.log(ownerOptions.find((owner: any) => owner.id == item.owner_name),item);
    
    htmlString = htmlString.replace(/\{\{seven\}\}/g, item?.equipment_description || '');

    htmlString = htmlString.replace(/\{\{eight\}\}/g, item?.equipment_details || '');

    const conditions = item?.properties?.map((item: any) => item.CONDITION);
    const swls = item?.properties?.map((item: any) => item.SWL);
    const radii = item?.properties?.map((item: any) => item.RADIUS);
    const testLoads = item?.properties?.map((item: any) => item["TEST LOAD"]);
    const boomLengths = item?.properties?.map((item: any) => item["BOOM LENGTH"]);
    
  

    htmlString = htmlString.replace(/\{\{nine\}\}/g, `<ul>${conditions.map((condition: any) => `<li>${condition}</li>`).join('')}</ul>`);
    
    htmlString = htmlString.replace(/\{\{ten\}\}/g, `<ul>${boomLengths.map((boomLength: any) => `<li>${boomLength}</li>`).join('')}</ul>`);
    htmlString = htmlString.replace(/\{\{eleven\}\}/g, `<ul>${radii.map((radius: any) => `<li>${radius}</li>`).join('')}</ul>`);
    htmlString = htmlString.replace(/\{\{twelve\}\}/g, `<ul>${testLoads.map((testLoad: any) => `<li>${testLoad}</li>`).join('')}</ul>`);
    htmlString = htmlString.replace(/\{\{twelve1\}\}/g, `<ul>${swls.map((swl: any) => `<li>${swl}</li>`).join('')}</ul>`);


    htmlString = htmlString.replace(/\{\{thirteen\}\}/g, item?.last_test_exam || '');
    htmlString = htmlString.replace(/\{\{forteen\}\}/g, item?.next_test_exam || '');
    htmlString = htmlString.replace(/\{\{fifteen\}\}/g, item?.last_thorough_exam || '');
    htmlString = htmlString.replace(/\{\{sixteen\}\}/g, item?.next_thorough_exam || '');
    htmlString = htmlString.replace(/\{\{twentythree\}\}/g, item?.defect_description || '');
    htmlString = htmlString.replace(/\{\{twentyfour\}\}/g, item?.test_particulars || '');

    // Replace placeholders in CSS:
    cssText = cssText.replace(/\{\{seventeen\}\}/g, !item?.first_examination ? "36%" : "43.79%");
    cssText = cssText.replace(/\{\{eighteen\}\}/g, item?.six_month_interval ? "89%" : "96%");
    cssText = cssText.replace(/\{\{nineteen\}\}/g, !item?.twelve_month_interval ? "89.17%;" : "96.47%;");
    cssText = cssText.replace(/\{\{twenty\}\}/g, !item?.correct_installation ? "36%" : "43.79%;");
    cssText = cssText.replace(/\{\{twentyone\}\}/g, item?.examination_scheme ? "89.17%;" : "96.47%;");
    cssText = cssText.replace(/\{\{twentytwo\}\}/g, item?.exceptional_circumstances ? "96.47%;" : "89.47%;");
    cssText = cssText.replace(/\{\{jacob\}\}/g, item?.safe_to_use ? "89.28%" : "96%");

    // Open a new window for printing
    const printWindow = window.open('', '', 'width=1133,height=1823');
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
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Error loading data.</p>;
  }

  return (
    <div className="px-8 py-3 bg-white w-[98%] mx-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4">Sl. No.</TableHead>
            <TableHead className="py-4">Equipment ID</TableHead>
            <TableHead className="py-4">Title</TableHead>
            <TableHead className="py-4">Equipment Type</TableHead>
            <TableHead className="py-4">Inspection Date</TableHead>
            <TableHead className="py-4">Next Thorough Date</TableHead>
            <TableHead className="py-4">Inspection Date</TableHead>
            <TableHead className="py-4">Status</TableHead>
            <TableHead className="py-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((item: any, idx: number) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell className="py-4">{idx + 1}</TableCell>
                  <TableCell className="py-4">{item?.equipment_no}</TableCell>
                  <TableCell className="py-4">{item?.title}</TableCell>
                  <TableCell className="py-4">{item?.equipment_type}</TableCell>
                  <TableCell className="py-4">{item?.inspection_date}</TableCell>
                  <TableCell className="py-4">{item?.next_thorough_exam}</TableCell>
                  <TableCell className="py-4">{item?.inspection_date}</TableCell>
                  <TableCell
                    className={`py-4 ${
                      item?.approval_status?.toLowerCase() === 'approved'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {item?.approval_status.toLowerCase() === 'approved' ? 'Approved' : 'Rejected'}
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
                        <DropdownMenuItem onClick={() => handleDeleteClick(item.id)}>Delete</DropdownMenuItem>
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
                      <TableCell colSpan={9}>
                        <div className="overflow-hidden">
                          <EditPopup onClose={handleCloseEdit} id={item.id} />
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
    </div>
  );
}
