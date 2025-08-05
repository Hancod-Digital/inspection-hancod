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
import { formatDateWithHyphen, generateEquipmentCertificateHTMLBody } from '@/lib/utils';
import { fetchMultiCertificate } from '@/lib/html';
import { makeApiCall } from '@/lib/apicaller';
import { MasterService } from '@/services/api/masters-service';
import DeleteDialogue from '@/components/ui/delete-dialog';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';
interface EquipmentData {
    slNo: number;
    equipmentID: string;
    title: string;
    equipmentType: string;
    lastThroughDate: string;
    nextTestExam: string;
    status: string;
}

 

export default function EquipmentTable({searchValue}:{searchValue:string}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const {getAllSingleSubtopic,deleteRecord,data} = useSubtopic()
    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };
    
    const [jobOrderNoOptions,setJobOrderNoOptions] = useState<any>([])
    const [siteOptions,setSiteOptions] = useState<any>([])
    const [ownerOptions,setOwnerOptions] = useState<any>([])
    const [standardOptions,setStandardOptions] = useState<any>([])
    const [equipmentOptions,setEquipmentOptions] = useState<any>([])
    const [locationOptions,setLocationOptions] = useState<any>([])
    const [authorityOptions,setAuthorityOptions] = useState<any>([])
    const [surveyorOptions,setSurveyorOptions] = useState<any>([])
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

              setEquipmentOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
              console.log("data equipment",data)
            }
          };
          fetchEquipments();
          const fetchSites = async () => {
            const data = await getAllSingleSubtopic("site"); // Fetch the areas
            if (data) {
              
              setSiteOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
            }
          };
          fetchSites();
          const fetchOwners = async () => {
            const data = await getAllSingleSubtopic("owner"); // Fetch the areas
        
            if (data) {
              setOwnerOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
            }
          };
          fetchOwners();
          const fetchStandards = async () => {
            const data = await getAllSingleSubtopic("standard"); // Fetch the areas
            if (data) {
              setStandardOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
            }
          };
          fetchStandards();
          const fetchLocations = async () => {
            const data = await getAllSingleSubtopic("location"); // Fetch the areas
            if (data) {
              setLocationOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
            }
          };
          fetchLocations();
          const fetchAuthorities = async () => {
            const data = await getAllSingleSubtopic("authority"); // Fetch the areas
            if (data) {
              setAuthorityOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
            }
          };
          fetchAuthorities();
          const fetchSurveyors = async () => {
            const data = await getAllSingleSubtopic("surveyor"); // Fetch the areas
            if (data) {
              setSurveyorOptions(data?.filter((item:any)=>item.status==="ACTIVE")); 
            }
          };
          fetchSurveyors();
    },[data])
    const [state, setState] = useState<any[]>([]);
    const fetchEquipments = (id: string) => {
      return new Promise((resolve, reject) => {
        makeApiCall(
          () => new MasterService().fetchAllEquipments(id),
          {
            afterSuccess: (data: any) => {
              resolve(data);
              // console.log("multi data",data)
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
              // console.log("serial nos",data)
            },
            afterError: (error: any) => {
              reject(error);
            },
          }
        );
      });
    }
  
    const printCertificate = async(item: any) => {

      const response = await fetch('/equ-certificate/index.html'); 
      let htmlString = await response.text();
       
      const equipments:any = await fetchEquipments(item?.id);
  
      // Map equipment IDs to equipment_no values
      const equipmentNumbers = await Promise.all(equipments.map(async (equipment:any)=>{

        // Find the equipment in equipmentOptions by matching the id
        const equipmentData = equipmentOptions.find((eq: any) => eq.id == equipment.equipment_no);

        // Use equipment_no from equipmentOptions if found, otherwise fallback to equipment.equipment_no or id
        return equipmentData?.equipment_no || equipment.equipment_no || equipment.id;
      }))
      htmlString = htmlString.replace(/\{\{coc\}\}/g, item?.test_cert_coc_no);
      htmlString = htmlString.replace(/\{\{exam_type\}\}/g, item.type_of_exam?.toUpperCase() || 'THOROUGH');
          
      htmlString = htmlString.replace(/\{\{one\}\}/g, item?.certificate_no);
htmlString = htmlString.replace(/\{\{two\}\}/g, jobOrderNoOptions.find((job: any) => job.id == item.job_order_no)?.job_no);

htmlString = htmlString.replace(/\{\{three\}\}/g, ownerOptions.find((owner: any) => owner.id == item.owner_name)?.owner);

htmlString = htmlString.replace(/\{\{four\}\}/g, standardOptions.find((standard: any) => standard.id == item.standard)?.standard);

htmlString = htmlString.replace(/\{\{five\}\}/g, locationOptions.find((location: any) => location.id == item.location)?.location);
htmlString = htmlString.replace(/\{\{four1\}\}/g, item?.version);
htmlString = htmlString.replace(/\{\{six\}\}/g,  formatDateWithHyphen(item?.inspection_date));

htmlString = htmlString.replace(/\{\{seven\}\}/g, item?.equipment_description);
 
htmlString = htmlString.replace(
  /\{\{eight\}\}/g,
  equipmentNumbers
    .map((equipmentNo: any) => `${equipmentNo}<br />`) // Optional chaining and nullish coalescing
    .join("")
);

htmlString = htmlString.replace(/\{\{nine\}\}/g, `${equipments ? (equipments.length < 10 ? "0" + equipments.length : equipments.length) : "01"}`);

htmlString = htmlString.replace(/\{\{ten\}\}/g, item?.description);

htmlString = htmlString.replace(/\{\{eleven\}\}/g, item?.proof_load);
function formatWeightString(input: string): string {
  const regex = /(\d+(?:\.\d+)?)(\D*?)\s*\(([^)]+)\)/g;
  let result = "";

  input = input.replace(/\s+/g, ' '); // Normalize spaces

  let matches;
  while ((matches = regex.exec(input)) !== null) {
      const weight = matches[1].trim();
      const unit = matches[2].trim();
      const description = matches[3].trim();
      
      const totalLength = weight.length + unit.length + description.length;

      if (totalLength > 10) {
          result += `<p>${weight} ${unit}</p><p>(${description})</p>`;
      } else {
          result += `<p>${weight} ${unit} (${description})</p>`;
      }
  }

  if (result === "") {
      const fallbackRegex = /^(\d+(?:\.\d+)?)(\D*)$/;
      const fallbackMatch = input.match(fallbackRegex);
      if (fallbackMatch) {
          const weight = fallbackMatch[1].trim();
          const unit = fallbackMatch[2].trim();
          result = `<p>${weight}${unit ? ' ' + unit : ''}</p>`;
      } else {
          result = `<p>${input}</p>`;
      }
  }

  return result;
}
htmlString = htmlString.replace(/\{\{twelve\}\}/g, formatWeightString(item?.safe_working_load));

if(item?.last_thorough_exam_certificate_no != ""){
  htmlString = htmlString.replace(/\{\{date-28-mar-2025\}\}/g, `<span class="not-available">${item?.last_thorough_exam == "Not Available" ? "Not Available" : item?.last_thorough_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.last_thorough_exam)}</span><span class="not-available-certificate-no">${item.last_thorough_exam_certificate_no|| "Not Available"}</span>`);
  
}else{
  htmlString = htmlString.replace(/\{\{date-28-mar-2025\}\}/g, `<span class="not-available-css">${item?.last_thorough_exam == "Not Available" ? "Not Available" : item?.last_thorough_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.last_thorough_exam)}</span>`);
 }

if(item?.last_test_exam_certificate_no != ""){
  htmlString = htmlString.replace(/\{\{not-applicable-1a\}\}/g, `<span class="not-applicable-1a">${item?.last_test_exam == "Not Available" ? "Not Available" : item?.last_test_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.last_test_exam)}</span><span class="not-applicable-1a-certificate-no">${item.last_test_exam_certificate_no|| "Not Available"}</span>`);
 
}else{
  htmlString = htmlString.replace(/\{\{not-applicable-1a\}\}/g, `<span class="not-applicable-1a-css">${item?.last_test_exam == "Not Available" ? "Not Available" : item?.last_test_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.last_test_exam)}</span>`);
}





if(item?.next_test_exam_certificate_no != "" && item?.next_test_exam_certificate_no){
  htmlString = htmlString.replace(/\{\{not-applicable\}\}/g, `<span class="not-applicable">${item?.next_test_exam == "Not Available" ? "Not Available" : item?.next_test_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.next_test_exam)}</span><span class="not-applicable-certificate-no">${item.next_test_exam_certificate_no|| "Not Available"}</span>`);
}else{
  htmlString = htmlString.replace(/\{\{not-applicable\}\}/g, `<span class="not-applicable-css">${item?.next_test_exam == "Not Available" ? "Not Available" : item?.next_test_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.next_test_exam)}</span>`);
}



if(item?.next_thorough_exam_certificate_no != "" && item?.next_thorough_exam_certificate_no){
  htmlString = htmlString.replace(/\{\{not-available\}\}/g, `<span class="date-28-mar-2025">${item?.next_thorough_exam == "Not Available" ? "Not Available" : item?.next_thorough_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.next_thorough_exam)}</span><span class="date-28-mar-2025-certificate-no">${item.next_thorough_exam_certificate_no|| "Not Available"}</span>`);
}else{
  htmlString = htmlString.replace(/\{\{not-available\}\}/g, `<span class="date-28-mar-2025-css">${item?.next_thorough_exam == "Not Available" ? "Not Available" : item?.next_thorough_exam == "Not Applicable" ? "Not Applicable" : formatDateWithHyphen(item?.next_thorough_exam)}</span>`);
}

const cssResponse = await fetch('/equ-certificate/index.css');
  let cssText = await cssResponse.text();
 
// cssText = cssText.replace(/\{\{seventeen\}\}/g, item?.first_examination ? " 36%" :" 43.79%");

// cssText = cssText.replace(/\{\{eighteen\}\}/g, item?.six_month_interval ? " 89%" :" 96%");

// cssText = cssText.replace(/\{\{nineteen\}\}/g,  item?.twelve_month_interval ? " 89.17%;" : "  96.47%;");

// cssText = cssText.replace(/\{\{twenty\}\}/g,  item?.correct_installation ? "36%" : "43.79%;");

// cssText = cssText.replace(/\{\{twentyone\}\}/g,  item?.examination_scheme ? "89.17%;" : "96.47%;");

// cssText = cssText.replace(/\{\{twentytwo\}\}/g,  !item?.exceptional_circumstances ? "96.47%;" : "89.47%;");

// htmlString = htmlString.replace(/\{\{twentythree\}\}/g, item?.defect_description);

// htmlString = htmlString.replace(/\{\{twentyfour\}\}/g, item?.test_particulars);

// cssText = cssText.replace(/\{\{jacob\}\}/g, item?.safe_to_use ?" 89.28%":"96%"); 

// cssText = cssText.replace(/\{\{seventeen\}\}/g, item?.first_examination === true ? " 36%" : item?.first_examination === false ? " 43.79%" : "");
cssText = cssText.replace(/\{\{seventeen\}\}/g,
  item?.first_examination === true  ? '36%' :
  item?.first_examination === false ? '43.79%' :
  '-9999px'                   // push off-canvas when null
);
console.log("item?.first_examination",item?.first_examination);

// background / visibility
cssText = cssText.replace(/\{\{bg_seventeen\}\}/g,
  item?.first_examination != null
    ? 'url(/assets/images/2ba15c98-813c-43ef-bdeb-a4d2d1ab035b.png)'
    : 'none'
);


// cssText = cssText.replace(/\{\{eighteen\}\}/g, item?.six_month_interval === true ? " 89%" : item?.six_month_interval === false ? " 96%" : "");
cssText = cssText.replace(/\{\{eighteen\}\}/g,
  item?.six_month_interval === true  ? '89%' :
  item?.six_month_interval === false ? '96%' :
  '-9999px'                   // push off-canvas when null
);

cssText = cssText.replace(/\{\{bg_eighteen\}\}/g,
  item?.six_month_interval != null
    ? 'url(/assets/images/2ba15c98-813c-43ef-bdeb-a4d2d1ab035b.png)'
    : 'none'
);

// cssText = cssText.replace(/\{\{nineteen\}\}/g,  item?.twelve_month_interval === true ? " 89.17%;" : item?.twelve_month_interval === false ? "  96.47%;" : "");
cssText = cssText.replace(/\{\{nineteen\}\}/g,
  item?.twelve_month_interval === true  ? '89.17%' :
  item?.twelve_month_interval === false ? '96.47%' :
  '-9999px'                   // push off-canvas when null
);

cssText = cssText.replace(/\{\{bg_nineteen\}\}/g,
  item?.twelve_month_interval != null
    ? 'url(/assets/images/2ba15c98-813c-43ef-bdeb-a4d2d1ab035b.png)'
    : 'none'
);

// cssText = cssText.replace(/\{\{twenty\}\}/g,  item?.correct_installation === true ? "36%" : item?.correct_installation === false ? "43.79%;" : "");
cssText = cssText.replace(/\{\{twenty\}\}/g,
  item?.correct_installation === true  ? '36%' :
  item?.correct_installation === false ? '43.79%' :
  '-9999px'                   // push off-canvas when null
);

// background / visibility
cssText = cssText.replace(/\{\{bg_twenty\}\}/g,
  item?.correct_installation != null
    ? 'url(/assets/images/2ba15c98-813c-43ef-bdeb-a4d2d1ab035b.png)'
    : 'none'
);

// cssText = cssText.replace(/\{\{twentyone\}\}/g,  item?.examination_scheme === true ? "89.17%;" : item?.examination_scheme === false ? "  96.47%;" : "");
cssText = cssText.replace(/\{\{twentyone\}\}/g,
  item?.examination_scheme === true  ? '89.17%' :
  item?.examination_scheme === false ? '96.47%' :
  '-9999px'         // push it off-canvas (or leave empty)
);

// background / visibility
cssText = cssText.replace(/\{\{bg_twentyone\}\}/g,
  item?.examination_scheme != null
    ? 'url(/assets/images/2ba15c98-813c-43ef-bdeb-a4d2d1ab035b.png)'
    : 'none'        // hides the image
);

// cssText = cssText.replace(/\{\{twentytwo\}\}/g,  item?.exceptional_circumstances === true ? " 89.47%;" : item?.exceptional_circumstances === false ? "96.47%;" : "");
// offset (tick position)
cssText = cssText.replace(/\{\{twentytwo\}\}/g,
  item?.exceptional_circumstances === true  ? '89.47%' :
  item?.exceptional_circumstances === false ? '96.47%' :
  '-9999px'                   // push off-canvas when null
);

// background / visibility
cssText = cssText.replace(/\{\{bg_twentytwo\}\}/g,
  item?.exceptional_circumstances != null
    ? 'url(/assets/images/a44fe311-7c8b-486c-87a8-4c9d50124d4c.png)'
    : 'none'
);

htmlString = htmlString.replace(/\{\{twentythree\}\}/g, item?.defect_description);

htmlString = htmlString.replace(/\{\{twentyfour\}\}/g, item?.test_particulars);

htmlString = htmlString.replace(/\{\{twentyfive\}\}/g, surveyorOptions.find((surveyor: any) => surveyor.id == item.surveyor)?.surveyor);

htmlString = htmlString.replace(/\{\{twentyfive_qualification\}\}/g, surveyorOptions.find((surveyor: any) => surveyor.id == item.surveyor)?.qualification || 'Not Available');

htmlString = htmlString.replace(/\{\{twentysix\}\}/g, authorityOptions.find((authority: any) => authority.id == item.authority)?.authority);


// cssText = cssText.replace(/\{\{jacob\}\}/g, item?.safe_to_use === true ? " 89.28%" : item?.safe_to_use === false ? "96%" : ""); 
// offset (tick position)
cssText = cssText.replace(/\{\{jacob\}\}/g,
  item?.safe_to_use === true  ? '89.28%' :
  item?.safe_to_use === false ? '96%'    :
  '-9999px'                   // push off-canvas when null
);

// background / visibility
cssText = cssText.replace(/\{\{bg_jacob\}\}/g,
  item?.safe_to_use != null
    ? 'url(/assets/images/a44fe311-7c8b-486c-87a8-4c9d50124d4c.png)'
    : 'none'
);




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
    <title>Generated by QUBE</title>
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
        const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(data?.filter((item:any)=>item?.title?.toLowerCase()?.includes(searchValue?.toLowerCase())));
    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto  ">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className='flex justify-start'>
                        <TableHead className="py-4 flex-[1]">Sl. No.</TableHead>
            
                        {/* <TableHead className="py-4 flex-[2]">Title</TableHead>  */}
                        <TableHead className="py-4 flex-[2] max-w-[180px] truncate" title="Title">Title</TableHead>
                        <TableHead className="py-4 flex-[1]">Inspection Date</TableHead>
                        <TableHead className="py-4 flex-[1]">Next Exam Date</TableHead>
                        <TableHead className="py-4 flex-[1]">Result</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
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
                        currentData?.map((item:any,idx:number) => (
                        <React.Fragment key={idx}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                               
                                {/* <TableCell className="py-4 flex-[2]">{item?.title}</TableCell>  */}
                                <TableCell className="py-4 flex-[2] max-w-[180px] truncate" title={item?.title}>{item?.title}</TableCell>
                              
                                <TableCell className="py-4 flex-[1]">{item?.inspection_date}</TableCell>
                                
                                <TableCell className="py-4 flex-[1]">{item?.next_thorough_exam}</TableCell>
                                <TableCell className="py-4 flex-[1]  ">{item?.result}</TableCell>
                                
                                <TableCell className={`py-4 flex-[1] ${item?.approval_status=='true'   ? 'text-green-500' : 'text-orange-500'}`}>
                                    {item?.approval_status=='true' ? "Approved" : "Rejected"}
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
                                            <DeleteDialogue
                                                onConfirm={async () => await deleteRecord(item.id)}
                                                triggerButton={
                                                  <button className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                  Delete
                                              </button>
                                                }
                                            />
                                            {item?.approval_status == "true" && <DropdownMenuItem onClick={() => printCertificate(item)}>Print</DropdownMenuItem>}
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
                        ))
                        )}
                    </TableBody>
                </Table>
                {/* <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} /> */}
            {data && data.length > 6 && (
                <div className='absolute bottom-0 right-0 '>
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
