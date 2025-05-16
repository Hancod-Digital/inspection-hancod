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
import QRCode from 'qrcode';

import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { Button } from '@/components/ui/button';
import { makeApiCall } from '@/lib/apicaller';
import { StudentService } from '@/services/api/students-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import {   cssStringUpdated, dataURLtoBlob, fetchHtml, formatDateWithHyphen, loadImages, splitCompany, splitDesignation } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { UserService } from '@/services/api/user-service';
import TableSpinner from '@/components/animated/TableSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarWithTooltip from './AvatarQr';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

export default function PrintCardTable({ data, changed, setChanged }: { data: any, changed: boolean, setChanged: any }) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<number | null>(null);


  const staticData = [
    {
      id: 5491,
      name: 'Ajad Miya Mansuri',
      address: 'Z',
      designation: 'Work at Height',
      addedBy: 'Munsheer',
      idNumber: '30035613413',
      cardNumber: 'QB-OPR-24-136042',
      modelLevel: 'Safety Training',
      company: 'Abraj Qatar Group',
      issueDate: '16-09-2024',
      validUntil: '15-09-2026',
      qrImage: '/path/to/qr.png',
    },
    // Add more rows here if needed
  ];
  const uploadImage = async (imageBlob: string | Blob) => {
    if (!imageBlob) return null;

    const formData = new FormData();
    formData.append('file', imageBlob);

    try {
      let res: any;
      const result = await makeApiCall(
        () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
        {
          afterSuccess: (data: any) => {
            res = data
          },
        }
      );

      return res?.fullPath
        ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
        : null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const generateQr = async (item: any) => {
    setIsGenerating(item.id);
    try {

      // Create an HTML template for the card
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = await fetchHtml(item);
      
      // Append the element to the body temporarily
      document.body.appendChild(htmlElement);
      await loadImages(htmlElement);

      // Convert the HTML element to a PNG image
      const dataUrl = await toPng(htmlElement, {
        quality: 0.95,
        width: htmlElement.offsetWidth,
        height: htmlElement.offsetHeight,
      });

      // Remove the temporary element
      document.body.removeChild(htmlElement);

      // Convert Data URL to Blob
      const imageBlob = dataURLtoBlob(dataUrl);

      // Upload the card image and get its URL
      const cardImageUrl = await uploadImage(imageBlob);

      if (cardImageUrl) {
        // Update the student's card_url in the database
        await makeApiCall(
          () => new StudentService().updateStudentCardUrl(item?.id, cardImageUrl),
          {
            afterSuccess: (data: any) => {

            },
          }
        );

        // Now generate a QR code that points to the card image URL
        const qrDataUrl = await QRCode.toDataURL(cardImageUrl, {
          width: 300,
          errorCorrectionLevel: 'H',
        });

        // Convert QR code Data URL to Blob
        const qrImageBlob = dataURLtoBlob(qrDataUrl);

        // Upload the QR code image and get its URL
        const qrImageUrl = await uploadImage(qrImageBlob);

        if (qrImageUrl) {
          // Update the student's card_qr_url in the database
          await makeApiCall(
            () => new StudentService().updateStudentQRUrl(item?.id, qrImageUrl),
            {
              afterSuccess: (data: any) => {
              },
            }
          );

          setChanged(!changed);
          toastWithTimeout(ToastVariant.Success, "Card and QR code created successfully.");
        } else {
          toastWithTimeout(ToastVariant.Success, "Failed to upload QR image.");
        }
      } else {
        toastWithTimeout(ToastVariant.Success, "Failed to upload card image.");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toastWithTimeout(ToastVariant.Success, "An error occurred while generating the QR code.");
    } finally {
      setIsGenerating(null);
    }
  };
  const splitLongString = (str: string) => {
    if (str.length <= 28) return [str];
    
    const firstPart = str.substring(0, 28);
    const lastSpaceIndex = firstPart.lastIndexOf(' ');
    
    if (lastSpaceIndex === -1) {
        return [str.substring(0, 28), str.substring(28)];
    }
     
    return [
        str.substring(0, lastSpaceIndex + 1),
        str.substring(lastSpaceIndex + 1)
    ];
}
  const handleEditClick = (item: any) => {
    const {training, training1} = splitDesignation(item?.designation)
    const {company1, company2} = splitCompany(item?.company)
    const {training:model_level, training1:model_level1} = splitDesignation(item?.model_level)
    const iframe: any = document.createElement('iframe');
    iframe.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Remove the iframe after printing
      iframe.contentWindow.onafterprint = function () {
        document.body.removeChild(iframe);
      };
    };
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    console.log(`
      <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      
       
      
      ${cssStringUpdated(item)}
    </style>
  </head>
  <body>
    <div class="main-container">
      <span class="sheik-hameed-khan"><div style="text-align: center;">${item?.name?.toUpperCase()}</div></span>
      <div class="nome">
        <span class="qsis-tra">${item?.card_no}<br /><br /></span>
      </div>
      <div class="rectangle"></div>
 
     <div class="layer-1"></div>
     
      
      </div>
     
      <div class="aplicar-estilo"><div class="profile-photo"></div></div>
    
    
      <span style="font-weight: 600;" class="qube-inspection"
        >: ${item?.id_no}<br />: ${item?.company?.length > 28 ? splitLongString(item?.company)[0] : item?.company}<br />
         ‎‎  ${item?.company?.length > 28 ? splitLongString(item?.company)[1] : ''}<br /><br /><br /></span
      ><span  style="font-weight: 600;"  class="qatar-id-company-name"
        >Qatar ID/ ID No.<br />Company name<br /><br />Course Details<br /><br />Model/
        Level</span
      >
     
      <div class="vector-4"></div>
      <div class="vector-5"></div>
      <span  style="font-weight: 600;"  class="safe-building-maintenance"
        >: ${item?.designation?.length > 28 ? splitLongString(item?.designation)[0] : item?.designation} <br />
         ‎‎  ${item?.designation?.length > 28 ? splitLongString(item?.designation)[1] : ''}</span
      >
      <div class="vector-6"><div class="group"></div></div>
      <div class="vector-7"></div>
      <div class="vector-8"></div>
     
     
      
      <div class="vector-a"></div>
      <span  style="font-weight: 600;"  class="safety-model"
        >: ${item?.model_level?.length > 28 ? splitLongString(item?.model_level)[0] : item?.model_level} <br />
         ‎‎  ${item?.model_level?.length > 28 ? splitLongString(item?.model_level)[1] : ''}</span
      >
      <div class="vector-b"></div>
      <span  style="font-weight: 600;"  class="date-range">${formatDateWithHyphen(item?.issued_on)}<br />${formatDateWithHyphen(item?.valid_untill)}</span
      ><span  style="font-weight: 600;"  class="issued-expiry">Issued Date: <br />Expiry Date:</span
      ><span  style="font-weight: 600;"  class="scan-qr-code">Scan QR code to verify this card</span>
      <div class="rectangle-c"><div class="rectangle-d"></div></div>
    </div>
  
  </body>
</html>

      `)
    
    iframe.srcdoc = `
      <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      
       
      
      ${cssStringUpdated(item)}
    </style>
  </head>
  <body>
    <div class="main-container">
      <span class="sheik-hameed-khan"><div style="text-align: center;">${item?.name?.toUpperCase()}</div></span>
      <div class="nome">
        <span class="qsis-tra">${item?.card_no}<br /><br /></span>
      </div>
      <div class="rectangle"></div>
    <div class="layer-1">
    
     
      
      </div>
       
      <div class="aplicar-estilo"><div class="profile-photo"></div></div>
       
      <span style="font-weight: 600;" class="qube-inspection"
        >: ${item?.id_no}<br />: ${item?.company?.length > 28 ? splitLongString(item?.company)[0] : item?.company}<br />
         ‎‎  ${item?.company?.length > 28 ? splitLongString(item?.company)[1] : ''}<br /><br /><br /></span
      ><span  style="font-weight: 600;"  class="qatar-id-company-name"
        >Qatar ID/ ID No.<br />Company name<br /><br />Course Details<br /><br />Model/
        Level</span
      >
     
      <div class="vector-4"></div>
      <div class="vector-5"></div>
      <span  style="font-weight: 600;"  class="safe-building-maintenance"
        >: ${item?.designation?.length > 28 ? splitLongString(item?.designation)[0] : item?.designation} <br />
         ‎‎  ${item?.designation?.length > 28 ? splitLongString(item?.designation)[1] : ''}</span
      >
      <div class="vector-6"><div class="group"></div></div>
      <div class="vector-7"></div>
      <div class="vector-8"></div>
       
      
      <div class="vector-a"></div>
      <span  style="font-weight: 600;"  class="safety-model"
        >: ${item?.model_level?.length > 28 ? splitLongString(item?.model_level)[0] : item?.model_level} <br />
         ‎‎  ${item?.model_level?.length > 28 ? splitLongString(item?.model_level)[1] : ''}</span
      >
      <div class="vector-b"></div>
      <span  style="font-weight: 600;"  class="date-range">${formatDateWithHyphen(item?.issued_on)}<br />${formatDateWithHyphen(item?.valid_untill)}</span
      ><span  style="font-weight: 600;"  class="issued-expiry">Issued Date: <br />Expiry Date:</span
      ><span  style="font-weight: 600;"  class="scan-qr-code">Scan QR code to verify this card</span>
      <div class="rectangle-c"><div class="rectangle-d"></div></div>
    </div>
  </body>
</html>

    `

 
  
 
    document.body.appendChild(iframe);

   
  };


  const handleCloseEdit = () => {
    setEditingRow(null);
  };
  const {currentPage,totalPages,handlePreviousPage,handleNextPage,setCurrentPage} = usePagination(data)

  return (
    <div className="px-8 py-3 bg-white w-[98%] mx-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4">ID</TableHead>

            <TableHead className="py-4">Name</TableHead>
            <TableHead className="py-4">Added_By</TableHead>
            <TableHead className="py-4">Image</TableHead>
            <TableHead className="py-4">Card/Model/Level</TableHead>
            <TableHead className="py-4">QR Image</TableHead>

            <TableHead className="py-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: any, idx: number) => (
            <React.Fragment key={idx + 1}>
              <TableRow>
                <TableCell className="py-4">{item?.id}</TableCell>

                <TableCell className="py-4">
                  {item?.name}
                  <div>Address: {item?.address}</div>
                  <div>Designation: {item?.designation}</div>
                </TableCell>
                <TableCell className="py-4">{item?.added_by}</TableCell>
                <TableCell className="py-4"><Avatar className="mb-2 w-16 h-16">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    alt="User's avatar"
                    src={item?.avatar}
                  />
                  <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                </Avatar></TableCell>
                <TableCell className="py-4">
                  <div>ID No: {item?.id_no}</div>
                  <div>Card No: {item?.card_no}</div>
                  <div>Model/Level: {item?.model_level}</div>
                  <div>Company: {item?.company}</div>
                  <div>Issued on: {formatDateWithHyphen(item?.issued_on)}</div>
                  <div>Valid Until: {formatDateWithHyphen(item?.valid_untill)}</div>
                </TableCell>
                <TableCell className="py-4">
                  {isGenerating === item.id ? <TableSpinner /> :   <AvatarWithTooltip item={item} tooltipPosition="top" />}
                </TableCell>
                <TableCell className="py-4">
                <div className="flex flex-col gap-2 ">
                  <button onClick={() => handleEditClick(item)} className="bg-white py-1 px-2 rounded-md  border-primary border text-primary">
                    Print
                  </button>
                  <button onClick={() => generateQr(item)} className="bg-white py-1 px-2 rounded-md  border-primary border text-primary">
                    Recreate QR
                  </button>
                 </div>
                </TableCell>
              </TableRow>
              <AnimatePresence>
                {editingRow === idx + 1 && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell colSpan={6}>
                      <div className="overflow-hidden">
                        {/* Insert the EditPopup component with relevant props here */}
                      </div>
                    </TableCell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div className='absolute bottom-0 right-0 '>
                    <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} />
                </div>
    </div>
  );
}
