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
import { formatDateWithHyphen, generateRows } from '@/lib/utils';
// import Manufacturer from '../../../../masters/(subtopics)/manufacturer/_components/AddEquipment'
// import Location from '../../../../masters/(subtopics)/location/_components/AddEquipment'
// import Equipment from '../../../../masters/(subtopics)/equipment/_components/AddEquipment'
// import Standard from '../../../../masters/(subtopics)/standard/_components/AddEquipment'
// import Owner from '../../../../masters/(subtopics)/owner/_components/AddEquipment'
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

export default function EquipmentTable({ setIsSite, setIsArea, setIsLocation, setIsEquipment, setIsStandard, setIsOwner, setIsManufacturer, isLocation, isEquipment, isStandard, isOwner, isManufacturer, searchValue }: any) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const { data, isLoading, error, getAllSingleSubtopic, deleteRecord } = useSubtopic();

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
      if (equipments) setEquipmentOptions(equipments?.filter((item: any) => item.status === "ACTIVE"));
      if (sites) setSiteOptions(sites?.filter((item: any) => item.status === "ACTIVE"));
      if (owners) setOwnerOptions(owners?.filter((item: any) => item.status === "ACTIVE"));
      if (standards) setStandardOptions(standards?.filter((item: any) => item.status === "ACTIVE"));
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
        setManufacturerOptions(data?.filter((item: any) => item.status === "ACTIVE")); // Set the area options to the fetched data
      }
    };
    fetchManufacturers();
    const fetchOwners = async () => {
      const data = await getAllSingleSubtopic("owner"); // Fetch the areas
      if (data) {
        setOwnerOptions(data?.filter((item: any) => item.status === "ACTIVE")); // Set the area options to the fetched data
      }
    };
    fetchOwners();
  }, [getAllSingleSubtopic]);

  const printCertificate = async (item: any) => {
    // Fetch additional item details (like serial_no) if needed
    let equipment: any = []
    await makeApiCall(
      () => new MasterService().fetchEquipmentDetails(item?.equipment_no),
      {
        afterSuccess: async (data: any) => {

          equipment = data[0]
          setSerialNo(data[0]?.serial_no);

          // Fetch the HTML template
          console.log("----------------------------------------------")
          console.log(equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.html" : equipment.property_table_type == "MEWP AND FORKLIFT" ? "/transactions/mewp_and_forklift/index.html" : equipment.property_table_type == "ELEVATOR CERTIFICATE" ? "/transactions/elevation_certificate/index.html" : "/transactions/earth_moving/index.html")
          const response = await fetch(`${equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.html" : equipment.property_table_type == "MEWP AND FORKLIFT" ? "/transactions/mewp_and_forklift/index.html" : equipment.property_table_type == "ELEVATOR CERTIFICATE" ? "/transactions/elevation_certificate/index.html" : "/transactions/earth_moving/index.html"}`);
          let htmlString = await response.text();

          // Fetch the CSS template 
          const cssResponse = await fetch(`${equipment.property_table_type == "CRANE CERTIFICATE" ? "/transactions/crane_certificate/index.css" : equipment.property_table_type == "MEWP AND FORKLIFT" ? "/transactions/mewp_and_forklift/index.css" : equipment.property_table_type == "ELEVATOR CERTIFICATE" ? "/transactions/elevation_certificate/index.css" : "/transactions/earth_moving/index.css"}`);
          let cssText = await cssResponse.text();

          // Replace placeholders in HTML:
          // Adjust these replacements to match your actual placeholders and data
          htmlString = htmlString.replace(/\{\{one\}\}/g, item?.certificate_no || '');
          htmlString = htmlString.replace(/\{\{two\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no || '');
          htmlString = htmlString.replace(/\{\{three\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_id)?.owner || '');
          htmlString = htmlString.replace(/\{\{four\}\}/g, standardOptions.find((standard: any) => standard.id == item.standard)?.standard || '');
          htmlString = htmlString.replace(/\{\{five\}\}/g, locationOptions.find((location: any) => location.id == item.location)?.location || "");
          htmlString = htmlString.replace(/\{\{six\}\}/g, formatDateWithHyphen(item?.inspection_date) || '');

          htmlString = htmlString.replace(/\{\{six1\}\}/g, equipment.property_table_type == "ELEVATOR CERTIFICATE" ? item?.lift_location : manufacturerOptions.find((manufacturer: any) => manufacturer.id == item.manufacturer)?.manufacturer);
          htmlString = htmlString.replace(/\{\{six12\}\}/g, equipment.property_table_type == "ELEVATOR CERTIFICATE" ? item?.lift_location : item?.year_of_manufacture.split('-')[0]);
          htmlString = htmlString.replace(/\{\{six2\}\}/g, equipment?.registration_no || '');
          htmlString = htmlString.replace(/\{\{six3\}\}/g, equipment.property_table_type == "ELEVATOR CERTIFICATE" ? manufacturerOptions.find((manufacturer: any) => manufacturer.id == item.manufacturer)?.manufacturer : data[0]?.serial_no || '');
          htmlString = htmlString.replace(/\{\{six4\}\}/g, equipment?.model_no || '');
          htmlString = htmlString.replace(/\{\{six5\}\}/g, item?.owner_name || '');

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
                return `<li>${radius.substring(0, 6)}<br>${radius.substring(6)}</li>`;
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

          htmlString = htmlString.replace(/\{\{nine\}\}/g, conditions.length ? `<ul>${conditions.join('')}</ul>` : '');
          htmlString = htmlString.replace(/\{\{ten\}\}/g, boomLengths.length ? `<ul>${boomLengths.join('')}</ul>` : '');
          htmlString = htmlString.replace(/\{\{eleven\}\}/g, radii.length ? `<ul>${radii.join('')}</ul>` : '');
          htmlString = htmlString.replace(/\{\{twelve\}\}/g, testLoads.length ? `<ul>${testLoads.join('')}</ul>` : '');
          htmlString = htmlString.replace(/\{\{twelve1\}\}/g, swls.length ? `<ul>${swls.join('')}</ul>` : '');

          htmlString = htmlString.replace(/\{\{four1\}\}/g, item?.version);

          // htmlString = htmlString.replace(/\{\{thirteen\}\}/g, formatDateWithHyphen(item?.last_test_exam) || '');
          // htmlString = htmlString.replace(/\{\{forteen\}\}/g,  formatDateWithHyphen(item?.next_test_exam) || '');
          // htmlString = htmlString.replace(/\{\{fifteen\}\}/g,  formatDateWithHyphen(item?.last_thorough_exam) || '');
          // htmlString = htmlString.replace(/\{\{sixteen\}\}/g,  formatDateWithHyphen(item?.next_thorough_exam) || '');

          if (item?.last_test_exam_certificate_no != "") {
            console.log("last_test_exam_certificate_no", item?.last_test_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{date-28-mar-2025\}\}/g, `<span class="not-available">${item?.last_test_exam != "Not Available" || item?.last_test_exam != "Not Applicable" ? formatDateWithHyphen(item?.last_test_exam) : item?.last_test_exam}</span><span class="not-available-certificate-no">${item.last_test_exam_certificate_no || "Not Available"}</span>`);
          } else {
            console.log("last_test_exam_certificate_no", item?.last_test_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{date-28-mar-2025\}\}/g, `<span class="not-available-css">${item?.last_test_exam != "Not Available" || item?.last_test_exam != "Not Applicable" ? formatDateWithHyphen(item?.last_test_exam) : item?.last_test_exam}</span>`);
          }

          if (item?.next_test_exam_certificate_no != "" && item?.next_test_exam_certificate_no) {
            console.log("next_test_exam_certificate_no", item?.next_test_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{not-available\}\}/g, `<span class="mar">${item?.next_test_exam != "Not Available" || item?.last_test_exam != "Not Applicable" ? formatDateWithHyphen(item?.next_test_exam) : item?.next_test_exam}</span><span class="mar-certificate-no">${item.next_test_exam_certificate_no || "Not Available"}</span>`);
          } else {
            console.log("next_test_exam_certificate_no", item?.next_test_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{not-available\}\}/g, `<span class="mar-css">${item?.next_test_exam != "Not Available" || item?.last_test_exam != "Not Applicable" ? formatDateWithHyphen(item?.next_test_exam) : item?.next_test_exam}</span>`);
          }

          if (item?.last_thorough_exam_certificate_no != "") {
            console.log("last_thorough_exam_certificate_no", item?.last_thorough_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{not-applicable-1a\}\}/g, `<span class="aug-30">${item?.last_thorough_exam != "Not Available" || item?.last_thorough_exam != "Not Applicable" ? formatDateWithHyphen(item?.last_thorough_exam) : item?.last_thorough_exam}</span><span class="aug-30-certificate-no">${item.last_thorough_exam_certificate_no || "Not Available"}</span>`);
          } else {
            console.log("last_thorough_exam_certificate_no", item?.last_thorough_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{not-applicable-1a\}\}/g, `<span class="aug-30-css">${item?.last_thorough_exam != "Not Available" || item?.last_thorough_exam != "Not Applicable" ? formatDateWithHyphen(item?.last_thorough_exam) : item?.last_thorough_exam}</span>`);
          }

          if (item?.next_thorough_exam_certificate_no != "" && item?.next_thorough_exam_certificate_no) {
            console.log("next_thorough_exam_certificate_no", item?.next_thorough_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{not-applicable\}\}/g, `<span class="aug">${item?.next_thorough_exam != "Not Available" || item?.last_thorough_exam != "Not Applicable" ? formatDateWithHyphen(item?.next_thorough_exam) : item?.next_thorough_exam}</span><span class="aug-certificate-no">${item.next_thorough_exam_certificate_no || "Not Available"}</span>`);
          } else {
            console.log("next_thorough_exam_certificate_no", item?.next_thorough_exam_certificate_no)
            htmlString = htmlString.replace(/\{\{not-applicable\}\}/g, `<span class="aug-css">${item?.next_thorough_exam != "Not Available" || item?.last_thorough_exam != "Not Applicable" ? formatDateWithHyphen(item?.next_thorough_exam) : item?.next_thorough_exam}</span>`);
          }

          htmlString = htmlString.replace(/\{\{twentythree\}\}/g, item?.defect_description || '');
          htmlString = htmlString.replace(/\{\{twentyfour\}\}/g, item?.test_particulars || '');

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
    let content: string = ""

    item?.annexures?.forEach((item: { property: string, property_group: string, remarks: string }) => {
      let height = 0;
      console.log(item.property_group.length);
      if (item.property.length > item.property_group.length) {
        height = item.property.length
      } else {
        height = item.property_group.length
      }

      if (height < item?.remarks.length) {
        height = item?.remarks.length
      }
      console.log(height, item?.property?.length, item?.property_group?.length, item?.remarks?.length)
      console.log(height - item?.property?.length, height - item?.property_group?.length, height - item?.remarks?.length);


      content += `
        <div style="display: flex;  width:100%; border-bottom: 1px solid black;"> 
          <section style="width: 32.5%;  
                          height: fit-content; padding-left: 15px; 
                          padding-top: 7.5px; padding-bottom: 7.5px; color: black;
                          border-right: 1px solid black;
                          ">
           ${item?.property}<span style="color:white">${'-'?.repeat(height - item?.property?.length)}</span>
          </section>
          <section style="width: 28.80%;  
                          height: fit-content; padding-left: 15px; 
                          padding-top: 7.5px; padding-bottom: 7.5px; color: black;
                          border-right: 1px solid black;
                          ">
           ${item?.property_group}<span style="color:white">${'-'?.repeat(height - item?.property_group?.length)}</span>
          </section>
          <section style="width: 38.734%;  
                          height: fit-content; padding-left: 15px; 
                          padding-top: 7.5px; padding-bottom: 7.5px; color: black;
                          
                          ">
            
            ${item?.remarks}<span style="color:white">${'-'?.repeat(height - item?.remarks?.length)}</span>
          </section>
        </div>
      `;
    });
    const data = generateRows(item?.annexures)

    const response = await fetch("/finalbackside/index.html");
    let htmlString = await response.text();
    equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.property_table_type == "CRANE CERTIFICATE" ? htmlString = htmlString.replace(/\{\{name\}\}/g, "CRANE CERTIFICATE") : equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.property_table_type == "MEWP AND FORKLIFT" ? htmlString = htmlString.replace(/\{\{name\}\}/g, "MEWP AND FORKLIFT") : equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.property_table_type == "ELEVATOR CERTIFICATE" ? htmlString = htmlString.replace(/\{\{name\}\}/g, "ELEVATOR CERTIFICATE") : htmlString = htmlString.replace(/\{\{name\}\}/g, "EARTH MOVING");
    htmlString = htmlString.replace(/\{\{PASSENGER_ELEVATOR\}\}/g, item?.title?.toUpperCase() || '');
    htmlString = htmlString.replace(/\{\{html\}\}/g, data.rowsHtml);
    //  htmlString = htmlString.replace(/\{\{css\}\}/g, data.rowsCss);
    htmlString = htmlString.replace(/\{\{four\}\}/g, item?.version);
    //  htmlString = htmlString.replace(/\{\{five\}\}/g, item?.revision_date);
    htmlString = htmlString.replace(/\{\{datas\}\}/g, content)
    htmlString = htmlString.replace(/\{\{one\}\}/g, formatDateWithHyphen(item?.inspection_date));
    htmlString = htmlString.replace(/\{\{two\}\}/g, item?.certificate_no);
    htmlString = htmlString.replace(/\{\{three\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no || '');
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
          <style>
          :root {
  --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
    "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
    "Source Han Sans CN", sans-serif;
}

.main-container {
  overflow: hidden;
}

.main-container,
.main-container * {
  box-sizing: border-box;
}

input,
select,
textarea,
button {
  outline: 0;
}

.main-container {
  position: relative;
  width: 1133px;
  height: 1603px;
  margin: 0 auto;
}
.certificate-of-examination {
  position: absolute;
  width: 1133px;
  height: 1603px;
  top: 0;
  left: 0;
  background: #f4fdff;
  z-index: 2;
  overflow: hidden;
}
.group-1 {
  position: absolute;
  width: 1133px;
  height: 1544.343px;
  top: 47.852px;
  left: 0;
  z-index: 4;
}
.group-2 {
  position: absolute;
  width: 1133px;
  height: 1544.343px;
  top: 0;
  left: 0;
  font-size: 0px;
  z-index: 5;
}
.annex-certificate-elevator {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 926.34px;
  height: 28px;
  margin: 0 0 0 90.29px;
  color: #1f222a;
  font-family: Inter, var(--default-font-family);
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 16;
}
.flex-row-eb {
  position: relative;
  width: 1047.983px;
  height: 38.754px;
  margin: 10.988px 0 0 42.508px;
  font-size: 0px;
  z-index: 13;
  overflow: visible auto;
}
.passenger-elevator {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 331.479px;
  height: 19.225px;
  margin: 9.766px 0 0 358.252px;
  color: #0f1422;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 19.225px;
  text-align: center;
  white-space: nowrap;
  z-index: 13;
}
.rectangle {
  position: absolute;
  width: 1047.983px;
  height: 38.754px;
  top: 0;
  left: 0;
  background: #cdddee;
  border: 1px solid #000000;
  z-index: 12;
}
.flex-row-bfe {
  position: relative;
  width: 1047.983px;
  height: 38.754px;
  margin: 0 0 0 42.508px;
  z-index: 21;
}
.rectangle-3 {
  position: absolute;
  width: 1047.983px;
  height: 38.754px;
  top: 0;
  left: 0;
  border-top: 1px solid #000000;
  border-right: 1px solid #000000;
  border-left: 1px solid #000000;
  z-index: 14;
}
.line {
  position: absolute;
  width: 1px;
  height: 38.754px;
  top: 0;
  left: 339.476px;
 background: url(/finalbackside/assets/images/bc3a1de0-cca0-49c7-b286-3d474b53a7c9.png)
    no-repeat center;
  background-size: cover;
  z-index: 17;
}


.footer {
  position: relative;
  width: 1069.306px;
  height: 73.806px;
  margin: 1514.041px 0 0 20.694px;
}

.footer-logo {
  position: absolute;
  width: 73.806px;
  height: 73.806px;
  background: rgba(255, 255, 255, 0.126) no-repeat center;
  background-size: cover;
}

.logo-1 { top: 0; left: 0; background-image: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2024-12-16/307ce527-62e9-4d6e-844f-159f650a03a2.png); }
.logo-2 { top: 0px; left: 79.304px; background-image: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2024-12-16/47388747-36fb-4684-8edd-a0814bed5838.png); }
.logo-3 { top: 0px; left: 158.601px; background-image: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2024-12-16/31e08578-90fc-41d3-a1a4-2eaaf9d79c25.png); }

.footer-text {
  position: absolute;
  color: #aaaaaa;
  font-family: Inter, var(--default-font);
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: left;
  white-space: nowrap;
  top: 12.405px;
  left: 471.083px;
}

.footer-certification {
  position: absolute;
  width: 321.578px;
  height: 22px;
  top: 27.404px;
  left: 747.728px;
  color: #0f1422;
  font-family: BentonSans Black, var(--default-font);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
}

.footer-line {
  position: absolute;
  width: 522.579px;
  height: 1px;
  top: 35.904px;
  left: 247.793px;
  background: #000000;
}
.line-4 {
position: absolute;
    width: 1px;
    height: 38.754px;
    top: 0;
    left: 640.428px;
    background: url(/finalbackside/assets/images/bc3a1de0-cca0-49c7-b286-3d474b53a7c9.png) no-repeat center;
    background-size: cover;
    z-index: 17;
}
.date-of-inspection {
  position: absolute;
  width: 384.082px;
  height: 32.988px;
  top: 8.883px;
  left: 659.368px;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
  text-overflow: initial;
  white-space: nowrap;
  z-index: 21;
}
.date-of-inspection-5 {
  position: relative;
  color: #0f1422;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;padding-top: 3px;
  text-align: left;
}
.sep {
  position: relative;
  color: #0f1422;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: left;
}
.certificate-no {
  position: absolute;
  width: 331.479px;
  height: 19.225px;
  top: 9.765px;
  left: 16.449px;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 19.225px;
  text-align: left;
  text-overflow: initial;
  white-space: nowrap;
  z-index: 19;
}
.text-5 {
  position: relative;
  color: #0f1422;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.text-6 {
  position: relative;
  color: #ff3b30;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.box-5 {
  position: absolute;
  width: 331.479px;
  height: 19.225px;
  top: 9.765px;
  left: 358.251px;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 19.225px;
  text-align: left;
  text-overflow: initial;
  white-space: nowrap;
  z-index: 20;
}
.text-7 {
  position: relative;
  color: #0f1422;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.text-8 {
  position: relative;
  color: #ff3b30;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.wrapper-2 {
  display: flex
;
    align-items: flex-start;
    position: relative;
    width: 1047.983px;
    height: 85%;
    margin: 0 0 0 42.508px;
    border-top: 1px solid #000000;
    border-right: 1px solid #000000;
    border-left: 1px solid #000000;
    border-bottom: 1px solid #000000;
    z-index: -Infinity;
}
.pic-2 {
  position: relative;
  width: 1133px;
  height: 1px;
  margin: 901.617px 0 0 0;
  background: url(/finalbackside/assets/images/c760a132-efd7-40eb-afa6-46f26521ffab.png)
    no-repeat center;
  background-size: cover;
  z-index: 9;
}
.box-6 {
  position: relative;
  width: 1069.306px;
  height: 73.806px;
  margin: 9.131px 0 0 20.694px;
  z-index: 15;
}
.whatsapp-image-preview {
  position: absolute;
  width: 73.806px;
  height: 73.806px;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.126)
    url(/finalbackside/assets/images/6dc8b12af14b6fc19c98fedb757ada8d5b58a0dd.png) no-repeat
    center;
  background-size: cover;
  z-index: 6;
}
.whatsapp-image-preview-6 {
  position: absolute;
  width: 73.8px;
  height: 73.8px;
  top: 0px;
  left: 79.304px;
  background: rgba(255, 255, 255, 0.126)
    url(/finalbackside/assets/images/bcb841c24651d4281e1c9a9081e7af28122985c7.png) no-repeat
    center;
  background-size: cover;
  z-index: 7;
}
.whatsapp-image-preview-7 {
  position: absolute;
  width: 73.802px;
  height: 73.802px;
  top: 0px;
  left: 158.601px;
  background: rgba(255, 255, 255, 0.126)
    url(/finalbackside/assets/images/89af7967b147c57485110b32bbfc10a83756911e.png) no-repeat
    center;
  background-size: cover;
  z-index: 8;
}
.revision-date {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 19px;
  top: 12.405px;
  left: 391.083px;
  color: #aaaaaa;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: left;
  white-space: nowrap;
  z-index: 15;
}
.iso-company {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: absolute;
  width: 321.578px;
  height: 22px;
  top: 27.404px;
  left: 747.728px;
  color: #0f1422;
  font-family: BentonSans Black, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 11;
}
.line-8 {
  position: absolute;
  width: 522.579px;
  height: 1px;
  top: 35.904px;
  left: 247.793px;
  background: url(/finalbackside/assets/images/3ebdc2c6-fe8c-4dd0-9b10-66940a4b27a7.png)
    no-repeat center;
  background-size: cover;
  z-index: 10;
}
.inspection-results {
  position: absolute;
  width: 92.3%;
  height: 81.8%;
  background-color: white;
  
  top: 165px;
  left: 43.563px;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
  z-index: 25;
}
.rectification-items {
  position: relative;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.inspection-comments {
  position: relative;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: left;
}
.rectification-items-9 {
  position: relative;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.inspection-comments-a {
  position: relative;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: left;
}
.rectification-items-b {
  position: relative;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
}
.inspection-comments-c {
  position: relative;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: left;
}
.whatsapp-image {
  position: absolute;
  width: 1096.628px;
  height: 1056.051px;
  top: 244.182px;
  left: 26.3px;
  background: url(/finalbackside/assets/images/9d136bff-ef0d-4b1b-a852-65fe2ce8a5b3.png)
    no-repeat center;
  background-size: cover;
  z-index: 3;
}

          </style>
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


      equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.property_table_type == "CRANE CERTIFICATE" ? htmlString = htmlString.replace(/\{\{name\}\}/g, "CRANE CERTIFICATE") : equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.property_table_type == "MEWP AND FORKLIFT" ? htmlString = htmlString.replace(/\{\{name\}\}/g, "MEWP AND FORKLIFT") : equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.property_table_type == "ELEVATOR CERTIFICATE" ? htmlString = htmlString.replace(/\{\{name\}\}/g, "ELEVATOR CERTIFICATE") : htmlString = htmlString.replace(/\{\{name\}\}/g, "EARTH MOVING");
      htmlString = htmlString.replace(/\{\{PASSENGER_ELEVATOR\}\}/g, item?.title?.toUpperCase() || '');
      htmlString = htmlString.replace(/\{\{one\}\}/g, item?.description_of_test || '');
      htmlString = htmlString.replace(/\{\{two\}\}/g, formatDateWithHyphen(item?.inspection_date) || '');
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
  const [changed, setChanged] = useState(false)
  const [minorCategoryOptions, setMinorCategoryOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);

  const [annexureOptions, setAnnexureOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const masterService = new MasterService();
        // Fetch minor category options
        const minorCategories = await masterService.getAllSubtopicDetails('minor_category');
        if (minorCategories) {
          setMinorCategoryOptions(minorCategories?.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch supplier options
        const suppliers = await masterService.getAllSubtopicDetails('manufacturer');
        if (suppliers) {

          setSupplierOptions(suppliers?.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch standard options
        const standards = await masterService.getAllSubtopicDetails('standard');
        if (standards) {
          setStandardOptions(standards?.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch annexure options
        const annexures = await masterService.getAllSubtopicDetails('annexure');
        if (annexures) {
          setAnnexureOptions(annexures?.filter((item: any) => item.status === "ACTIVE"));
        }

        // Fetch location options
        const locations = await masterService.getAllSubtopicDetails('location');
        if (locations) {
          setLocationOptions(locations?.filter((item: any) => item.status === "ACTIVE"));
        }
        // Fetch owner options
        const owners = await masterService.getAllSubtopicDetails('owner');
        if (owners) {
          setOwnerOptions(owners?.filter((item: any) => item.status === "ACTIVE"));
        }


      } catch (error) {
        console.error('Error fetching options:', error);
        // Optionally, handle the error (e.g., show a notification)
      }
    };
    fetchOptions();
    console.log("refetchiongg");

  }, [changed]);
  const [isChanged, setIsChanged] = useState(false);
  const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage, setCurrentPage } = usePagination(data?.filter((item: any) => item?.title?.toLowerCase()?.includes(searchValue?.toLowerCase())));
  return (
    <div className="px-8 py-3 bg-white w-[98%] mx-auto  ">
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
                  <TableCell className="py-4">{equipmentOptions?.find((equipment: any) => equipment.id == item.equipment_no)?.equipment_no}</TableCell>

                  <TableCell className="py-4">{item?.inspection_date}</TableCell>
                  <TableCell className="py-4">{item?.next_thorough_exam}</TableCell>
                  <TableCell className="py-4">{item?.inspection_date}</TableCell>
                  <TableCell className="py-4">{item?.result}</TableCell>
                  <TableCell
                    className={`py-4 ${item.approval_status == 'true'
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
                        {item.approval_status == 'true' && <DropdownMenuItem onClick={() => printCertificate(item)}>Print</DropdownMenuItem>}
                        {item.approval_status == 'true' && <DropdownMenuItem onClick={() => printAnnexure(item)}>Print Annexure</DropdownMenuItem>}
                        {item.approval_status == 'true' && item?.description_of_test && <DropdownMenuItem onClick={() => printBackside(item)}>Print Details</DropdownMenuItem>}
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
                          {/* {isLocation && <Location onClose={() => setIsLocation(false)} setIsSite={setIsSite} setIsArea={setIsArea} setIsChanged={setIsChanged} isChanged={isChanged} />}
                          {isEquipment && <Equipment  onClose={() => setIsEquipment(false)} setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation} changed={changed} minorCategoryOptions={minorCategoryOptions} supplierOptions={supplierOptions} standardOptions={standardOptions} annexureOptions={annexureOptions} locationOptions={locationOptions} ownerOptions={ownerOptions} />}
                          {isStandard && <Standard onClose={()=>setIsStandard(false)} />}
                          {isOwner && <Owner onClose={()=>setIsOwner(false)} />}
                          {isManufacturer && <Manufacturer onClose={()=>setIsManufacturer(false)} />} */}
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
