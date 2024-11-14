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
import { dataURLtoBlob, fetchHtml, formatDateWithHyphen, loadImages } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { UserService } from '@/services/api/user-service';
import TableSpinner from '@/components/animated/TableSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
          toastWithTimeout(ToastVariant.Error, "Failed to upload QR image.");
        }
      } else {
        toastWithTimeout(ToastVariant.Error, "Failed to upload card image.");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toastWithTimeout(ToastVariant.Error, "An error occurred while generating the QR code.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleEditClick = (item: any) => {


    // // Open a new window
    // const printWindow = window.open('', '_blank', 'width=600,height=600');
    const cssString = () => {
      return `
                   :root {
  --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
    "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
    "Source Han Sans CN", sans-serif;
}

.main-container {
  overflow: hidden;
}
* {
    -webkit-print-color-adjust: exact !important;   /* Chrome, Safari 6 – 15.3, Edge */
    color-adjust: exact !important;                 /* Firefox 48 – 96 */
    print-color-adjust: exact !important;           /* Firefox 97+, Safari 15.4+ */
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
  width: 493px;
  height: 788px;
  margin: 0 auto;
  background: #ffffff;
  overflow: hidden;
}
.rectangle {
  position: relative;
  width: 493px;
  height: 50.73px;
  margin: 0 0 0 0;
  background: #8d1b3d;
  z-index: 999;
}
.whatsapp-image {
  position: relative;
  width: 225.264px;
  height: 63.591px;
  margin: 24.041px 0 0 133.868px;
  background: url(/blank_certificate/card/images/8db68740fedd899478a73a914c174d93703d7123.png)
    no-repeat center;
  background-size: cover;
  z-index: 998;
}
.apply-style {
  position: relative;
  width: 175px;
  height: 198px;
  margin: 13.669px 0 0 163.318px;
  border: 1px solid #8d1b3d;
  z-index: 995;
  overflow: hidden;
   border-radius: 30.971px;
  overflow: hidden;
}
.profile-photo {
  position: absolute; /* Positions the element relative to its nearest positioned ancestor */
 width: 175px;
  height: 198px;
  top: 50%;
  left: 50%;
  background: url("${item?.avatar}")  no-repeat center center;
  background-size: contain;
  transform: translate(-50%, -50%);
") no-repeat center center; 
  background-size: contain; /* Ensures the entire image fits within the container */
  transform: translate(-50%, -50%); /* Centers the container */
  z-index: 996;
  padding: 0;
  border: none;
  box-sizing: border-box;
  /* background-clip: content-box; */ /* Removed for clarity */
}


.sheik-hameed-khan {
  display: block;
  position: relative;
  height: 35px;
 
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 32px;
  font-weight: 600;
  line-height: 35px;
  text-align: center;
  white-space: nowrap;
  z-index: 997;
}
.flex-row-cf {
  position: relative;
  width: 393px;
  height: 157px;
  margin: 15.59px 0 0 59.751px;
  z-index: 5;
}
.name {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 15.485px;
  position: absolute;
  width: 174px;
  height: 157px;
  top: 0;
  left: 99.5px;
  z-index: 2;
}
.apparicio-junior {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-shrink: 0;
  position: relative;
  width: 174px;
  height: 157px;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 20px;
  font-weight: 500;
  line-height: 71.233px;
  text-align: center;
  text-overflow: initial;
  letter-spacing: -0.8px;
  z-index: 3;
  overflow: hidden;
}
.line {
  position: absolute;
  width: 373.135px;
  height: 1.549px;
  top: 29.19px;
  left: 0;
  background: url(/blank_certificate/card/images/aa3af7ac-d5ee-4fe9-8137-f4e8b8816b91.png)
    no-repeat center;
  background-size: cover;
  z-index: 4;
}
  .bio {
  display: grid;
  grid-template-columns: 163px 1fr; /* Fixed width for labels, flexible for values */
  row-gap: 10px; /* Space between rows */
  column-gap: 10px; /* Space between columns */
  position: absolute;
  width: 393px;
  height: auto; /* Let height adjust based on content */
  top: 51.023px;
  left: 0;
  z-index: 5;
}

.field {
  display: contents; /* Allows grid items to flow correctly */
}

.qatar-id {
  color: rgba(255, 255, 255, 0.5);
  font-family: Inter, var(--default-font-family);
  font-size: 18.58px;
  font-weight: 400;
  line-height: 30px;
  text-align: left;
  letter-spacing: -0.74px;
  /* Removed fixed width and other flex properties */
}

.qube-inspection {
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 18.58px;
  font-weight: 400;
  line-height: 30px;
  text-align: left;
  letter-spacing: -0.74px;
  word-wrap: break-word; /* Ensures long words wrap */
  /* Removed fixed width and other flex properties */
}

.line-1 {
  position: relative;
  width: 373.135px;
  height: 1.549px;
  margin: 21.272px 0 0 59.751px;
  background: url(/blank_certificate/card/images/c6ce412d-1bb8-4b4e-b768-37d8b13c3bf8.png)
    no-repeat center;
  background-size: cover;
  z-index: 8;
}
.flex-row-b {
  position: relative;
  width: 371.848px;
  height: 104.348px;
  margin: 12px 0 0 59.751px;
  z-index: 12;
}
.vector {
  position: absolute;
  width: 104.348px;
  height: 104.348px;
  top: 0;
  left: 267.5px;
  background: url("${item?.qr_url}")
  no-repeat center;
  background-size: cover;
  z-index: 9999999;
}
.flex-row-cf-2 {
  position: relative;
  width: 91.699px;
  height: 22.134px;
  margin: 6.316px 0 0 6.324px;
  z-index: 982;
}
.group {
  position: absolute;
  width: 24.14%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/8e57c915-a5ba-4ee2-878d-657e54980b2a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 979;
  
  border: 1px solid black; /* Add border here */
}
.vector-3 {
  position: relative;
  width: 9.486px;
  height: 9.486px;
  margin: 6.328px 0 0 6.324px;
  background: url(/blank_certificate/card/images/49df665b-5a9b-423d-9909-5426162ee18a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 988;
}
.vector-4 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 31.03%;
  background: url(/blank_certificate/card/images/48551474-c123-4524-ab38-1dcbbb40198e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 16;
}
.vector-5 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 34.48%;
  background: url(/blank_certificate/card/images/12671834-ae81-43ef-9175-d28b6d9706dc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 19;
}
.vector-6 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 41.38%;
  background: url(/blank_certificate/card/images/9a29c350-d3e1-4c51-9bb6-9b1131c62272.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 22;
}
.vector-7 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 48.28%;
  background: url(/blank_certificate/card/images/509ca2c7-0095-4062-8618-3f783153b209.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 25;
}
.vector-8 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 65.52%;
  background: url(/blank_certificate/card/images/945aa53b-f936-4fdf-a396-e7cdea093956.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 28;
}
.group-9 {
  position: absolute;
  width: 24.14%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/card/images/12273391-fc4b-4bf1-aa3e-85536f6578d0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 982;
}
.vector-a {
  position: relative;
  width: 9.486px;
  height: 9.486px;
  margin: 6.328px 0 0 6.324px;
  background: url(/blank_certificate/card/images/d382cfdd-dfdd-44fa-9464-a61dc2bedc72.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 991;
}
.vector-b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/d23b9c5f-30d5-4a84-a622-e78c10968073.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 31;
}
.vector-c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/d3d91909-134c-4321-afe2-aa65060c1d46.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 34;
}
.vector-d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/0da38b9d-9ea7-46fa-b2f8-673d00a5baf7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 37;
}
.vector-e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 58.62%;
  background: url(/blank_certificate/card/images/f9298354-719e-468c-8636-f9082b8cedb0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 40;
}
.vector-f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/a02e6d32-5aaa-4fc3-9b2c-ce3fe723bdb7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 43;
}
.vector-10 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/6f14168b-c642-4fd7-ba01-c79dc9e0cd61.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 46;
}
.vector-11 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/839b97f8-9a9d-4f2a-866e-bf41e225a204.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 49;
}
.vector-12 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 37.93%;
  background: url(/blank_certificate/card/images/f578ff8c-d233-4eab-a26b-305595e7e9bc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 52;
}
.vector-13 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/08a37d39-03de-4989-8dce-9e6f62e77ccc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 55;
}
.vector-14 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 48.28%;
  background: url(/blank_certificate/card/images/bcd8930e-3482-4867-81dd-1242ec0a557f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 58;
}
.vector-15 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 51.72%;
  background: url(/blank_certificate/card/images/f6c9ac43-00a3-47d9-99b9-c390cf3ae51c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 61;
}
.vector-16 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 58.62%;
  background: url(/blank_certificate/card/images/e3e03539-2a5c-4fea-a3ee-8834a2169d60.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 64;
}
.vector-17 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 65.52%;
  background: url(/blank_certificate/card/images/169c81ee-da41-4b5d-9b3a-5d837cf2b98a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 67;
}
.vector-18 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/a63edff8-7137-49d0-bd0d-ee0b6957f3c6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 70;
}
.vector-19 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/63e4fbdf-bf67-4016-b2df-dafe98e43877.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 73;
}
.vector-1a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 44.83%;
  background: url(/blank_certificate/card/images/f143bd92-9f5e-4561-90e0-b184f33faed6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 76;
}
.vector-1b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/482fa1bc-8107-47af-a6f1-f978e89542a3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 79;
}
.vector-1c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/487b75e8-8fb2-40aa-80c6-df2389bb976c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 82;
}
.vector-1d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 65.52%;
  background: url(/blank_certificate/card/images/1e26f92f-6d6d-4f99-8e8e-7e755eb87660.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 85;
}
.vector-1e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/37641d2c-6220-43d9-a02e-dda28a08cdeb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 88;
}
.vector-1f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/fdf46d11-65dc-49f4-855a-62418ab37f93.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 91;
}
.vector-20 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 58.62%;
  background: url(/blank_certificate/card/images/aa8efb38-fd03-45b5-9a8a-b7347123f4a3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 94;
}
.vector-21 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/e69b4bea-2952-4141-bca3-495c102d509f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 97;
}
.vector-22 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 27.59%;
  background: url(/blank_certificate/card/images/4880ac6a-1731-4eac-8ed3-06878e5d8b47.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 100;
}
.vector-23 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/53939b34-6a85-4666-9bb6-1cea01304de0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 103;
}
.vector-24 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/86ea6c5d-d41a-4e90-8cde-9f3afa30cc02.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 106;
}
.vector-25 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 51.72%;
  background: url(/blank_certificate/card/images/90eaa10c-1989-43f3-8fcb-2215fa3a467f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 109;
}
.vector-26 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/e2a75f00-2293-489a-95a3-0dec017bba25.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 112;
}
.vector-27 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 65.52%;
  background: url(/blank_certificate/card/images/704980c8-cae7-48b3-ae01-8a6d915baca2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 115;
}
.vector-28 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/0d11c2fb-6efd-4225-b46b-f33708833841.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 118;
}
.vector-29 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 27.59%;
  background: url(/blank_certificate/card/images/9700975c-c56a-4b04-8954-bf2171a8b55c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 121;
}
.vector-2a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/20c7c572-da3d-4f42-8e5f-bfb91746deac.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 124;
}
.vector-2b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/7ab559fa-4895-412b-9942-d7be4b08db5d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 127;
}
.vector-2c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 48.28%;
  background: url(/blank_certificate/card/images/513dfcc3-ff3b-4cd4-9bd1-ade890f492c9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 130;
}
.vector-2d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/03034a5f-f630-4df8-997f-d3c0b3362410.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 133;
}
.vector-2e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/7b4a3b08-8967-412b-a1bc-d671619dfa4e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 136;
}
.vector-2f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/3b53fb87-e4fa-44b7-81bb-e95438775afa.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 139;
}
.flex-row-eb {
  position: relative;
  width: 25.296px;
  height: 3.162px;
  margin: -0.01px 0 0 44.269px;
  z-index: 160;
}
.vector-30 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/f61b747b-bea0-4300-8448-f4babdfa2252.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 142;
}
.vector-31 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 12.5%;
  background: url(/blank_certificate/card/images/a0deb496-276c-4afb-9363-3097afd4c2df.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 145;
}
.vector-32 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 37.5%;
  background: url(/blank_certificate/card/images/ec74b79b-1271-47b4-8ce7-4a9757dc773a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 148;
}
.vector-33 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/card/images/419e66fa-0018-449b-b8dc-65f430f76a96.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 151;
}
.vector-34 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 62.5%;
  background: url(/blank_certificate/card/images/2b7f65fd-9954-4b5e-8aa1-523bc05d0497.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 154;
}
.vector-35 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/card/images/40726f66-7fa6-46bd-958f-f939d557ec04.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 157;
}
.vector-36 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 87.5%;
  background: url(/blank_certificate/card/images/b962121c-c992-4821-91dd-f523cc823bab.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 160;
}
.flex-row-eea {
  position: relative;
  width: 75.889px;
  height: 3.162px;
  margin: 0.01px 0 0 6.324px;
  z-index: 196;
}
.vector-37 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/c7bd3d74-6b2b-44bf-8f28-293190d21da8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 163;
}
.vector-38 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 12.5%;
  background: url(/blank_certificate/card/images/67a209b2-d661-41b8-ab1d-307d177e3495.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 166;
}
.vector-39 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 20.83%;
  background: url(/blank_certificate/card/images/d52fc25d-4e31-4512-9a82-4a17bcdc4403.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 169;
}
.vector-3a {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 25%;
  background: url(/blank_certificate/card/images/33e112bc-2773-41d2-b689-4d81b3bd4a34.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 172;
}
.vector-3b {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 33.33%;
  background: url(/blank_certificate/card/images/6e9113cb-24fe-44f0-ad36-ea0279123153.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 175;
}
.vector-3c {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 37.5%;
  background: url(/blank_certificate/card/images/22d81b5f-9057-49d4-82a4-4b733e7edb8d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 178;
}
.vector-3d {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 45.83%;
  background: url(/blank_certificate/card/images/d1dfd09e-9f3a-4a16-a4a8-26fade1b6744.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 181;
}
.vector-3e {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 83.33%;
  background: url(/blank_certificate/card/images/5aa2a379-bf2d-4509-bff3-55761256f1af.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 190;
}
.vector-3f {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 87.5%;
  background: url(/blank_certificate/card/images/a7e46aa2-8b62-4032-b11a-cc7b85db855f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 193;
}
.vector-40 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 95.83%;
  background: url(/blank_certificate/card/images/9b0e3a68-406d-475e-83f8-a1f8cca91f2f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 196;
}
.regroup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 58.33%;
  z-index: 187;
}
.vector-41 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/515f7161-251d-4d5a-b2e7-5234721a2b13.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 184;
}
.vector-42 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/ef073936-0906-465b-97c6-40c905372d29.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 187;
}
.flex-row {
  position: relative;
  width: 88.537px;
  height: 3.162px;
  margin: 0px 0 0 9.486px;
  z-index: 247;
}
.vector-43 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/998456f6-f969-4415-aaa5-68071501c7b6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 199;
}
.vector-44 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 3.57%;
  background: url(/blank_certificate/card/images/09759947-5536-4208-8baf-4299d44b62c3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 202;
}
.vector-45 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 7.14%;
  background: url(/blank_certificate/card/images/ae097974-9e50-4b86-8e39-4de8fbf4224a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 205;
}
.vector-46 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 21.43%;
  background: url(/blank_certificate/card/images/87a1c94c-603a-4505-b62a-72d312f974d0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 208;
}
.vector-47 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 25%;
  background: url(/blank_certificate/card/images/04304a32-a766-4913-962c-84c24a90d863.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 211;
}
.vector-48 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 28.57%;
  background: url(/blank_certificate/card/images/c2eef82b-e752-48c3-9326-76a39ac9bdfb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 214;
}
.vector-49 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 35.71%;
  background: url(/blank_certificate/card/images/3634d2e5-9633-4b92-b53c-040102fe9c45.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 217;
}
.vector-4a {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 42.86%;
  background: url(/blank_certificate/card/images/81a55470-e521-462e-bdc1-43b0a711db69.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 220;
}
.vector-4b {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/card/images/7bdcb5bd-889f-4aaa-8405-146feef40004.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 223;
}
.vector-4c {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 53.57%;
  background: url(/blank_certificate/card/images/618c553d-4dfe-4df2-9440-7583c44a0597.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 226;
}
.vector-4d {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 57.14%;
  background: url(/blank_certificate/card/images/9503a5fb-1bb5-4e48-a2d8-25a5f64ae455.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 229;
}
.vector-4e {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 60.71%;
  background: url(/blank_certificate/card/images/bced72ef-9c5e-46c3-b483-56b8918ea2a6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 232;
}
.vector-4f {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 67.86%;
  background: url(/blank_certificate/card/images/15d7a8c6-b1a4-4983-a1d1-c81bc50c5a17.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 235;
}
.vector-50 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 71.43%;
  background: url(/blank_certificate/card/images/d9d71ef6-01c6-4e43-9d0f-7bbd1df6913d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 238;
}
.vector-51 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/card/images/7cbd7025-e7ee-4b8c-bb48-3ad2a2df1142.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 241;
}
.vector-52 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 85.71%;
  background: url(/blank_certificate/card/images/01121ade-c054-4564-863c-a404b7027524.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 244;
}
.vector-53 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 96.43%;
  background: url(/blank_certificate/card/images/0af50749-0c8b-4a38-8b66-880ada2df5ea.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 247;
}
.flex-row-ad {
  position: relative;
  width: 82.213px;
  height: 3.162px;
  margin: 0px 0 0 12.648px;
  z-index: 286;
}
.vector-54 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/ea861f63-d9b7-407e-9a30-6d8f775528ee.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 250;
}
.vector-55 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 15.38%;
  background: url(/blank_certificate/card/images/a2c1e1a1-336e-47b6-b4e8-fbd3eb4768d1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 253;
}
.vector-56 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 19.23%;
  background: url(/blank_certificate/card/images/d09332d1-f07c-45af-a37a-674057d8c583.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 256;
}
.vector-57 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 34.62%;
  background: url(/blank_certificate/card/images/d039ed68-50ea-4fb2-a9cb-2d956fe7d9d8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 259;
}
.vector-58 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 38.46%;
  background: url(/blank_certificate/card/images/46251aec-1973-4961-bfc7-c6920f7b75ba.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 262;
}
.vector-59 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 42.31%;
  background: url(/blank_certificate/card/images/a4939b07-5157-4dc8-8b1e-4122a86b4ed9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 265;
}
.vector-5a {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 46.15%;
  background: url(/blank_certificate/card/images/3582f8e8-8b51-49ac-89a9-bc9c26abd38f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 268;
}
.vector-5b {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/card/images/29602741-f7c0-42bf-9c47-7b5bde3b7929.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 271;
}
.vector-5c {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 88.46%;
  background: url(/blank_certificate/card/images/a8dbb047-b556-4ec6-b2a6-935f77773d1a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 280;
}
.vector-5d {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 92.31%;
  background: url(/blank_certificate/card/images/a554aac7-9270-46a2-9405-f1c79267f7c8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 283;
}
.vector-5e {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 96.15%;
  background: url(/blank_certificate/card/images/d037a174-cf8a-4c1a-b083-25aab3565ced.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 286;
}
.regroup-5f {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 11.54%;
  height: 100%;
  top: 0;
  left: 65.38%;
  z-index: 277;
}
.vector-60 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/748f71ac-b0e6-494c-9f16-dffc13efea66.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 274;
}
.vector-61 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/d968e5ff-d341-4dd7-9d52-f2de9bac8475.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 277;
}
.flex-row-d {
  position: relative;
  width: 88.537px;
  height: 3.162px;
  margin: 0.01px 0 0 6.324px;
  z-index: 334;
}
.vector-62 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/c8e44ec9-c246-4f36-8f2a-51d6290e9c0d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 289;
}
.vector-63 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 3.57%;
  background: url(/blank_certificate/card/images/df62901c-bc42-40f5-8580-cf4a91e19938.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 292;
}
.vector-64 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 7.14%;
  background: url(/blank_certificate/card/images/5d94dcf4-b255-410a-92cf-a6198ef62d00.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 295;
}
.vector-65 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 10.71%;
  background: url(/blank_certificate/card/images/d6eeb443-b6c0-4513-867e-e1038b2e58db.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 298;
}
.vector-66 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 14.29%;
  background: url(/blank_certificate/card/images/6f0a943c-cee2-4014-830b-81cd45472b6c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 301;
}
.vector-67 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 17.86%;
  background: url(/blank_certificate/card/images/d7c674a8-d73e-420d-b945-8b5ccabe32a4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 304;
}
.vector-68 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 42.86%;
  background: url(/blank_certificate/card/images/f51faf18-4719-4bae-b02b-d283a95da44a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 307;
}
.vector-69 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 46.43%;
  background: url(/blank_certificate/card/images/f35f89bf-95aa-447d-8073-cb5ce6a39791.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 310;
}
.vector-6a {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 57.14%;
  background: url(/blank_certificate/card/images/19f6280a-ff7b-47f6-8f49-f020d174ce73.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 313;
}
.vector-6b {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 67.86%;
  background: url(/blank_certificate/card/images/e0aa566e-59fe-483d-ab52-4e7229b93ebc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 316;
}
.vector-6c {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 71.43%;
  background: url(/blank_certificate/card/images/d0c88f6a-dcee-42a2-a0e6-7f6b74340c98.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 319;
}
.vector-6d {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/card/images/75742356-b6f0-47ac-8933-d9e133b99d56.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 322;
}
.vector-6e {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 82.14%;
  background: url(/blank_certificate/card/images/b9e4117f-bc70-44ef-bf5b-aecbf373373c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 325;
}
.vector-6f {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 85.71%;
  background: url(/blank_certificate/card/images/2c13e99b-5027-4d7e-b92f-b21dbf8ff42d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 328;
}
.vector-70 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 92.86%;
  background: url(/blank_certificate/card/images/4a2c6f9e-c24b-4369-8f27-ec6062d5fb6c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 331;
}
.vector-71 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 96.43%;
  background: url(/blank_certificate/card/images/fdf05dd6-8d60-4fdf-ab64-516504404863.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 334;
}
.flex-row-f {
  position: relative;
  width: 91.699px;
  height: 3.162px;
  margin: 0px 0 0 6.324px;
  z-index: 385;
}
.vector-72 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 17.24%;
  background: url(/blank_certificate/card/images/f1e6e277-80e8-4c1d-9987-b4fdfc647b2c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 343;
}
.vector-73 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 20.69%;
  background: url(/blank_certificate/card/images/04e322b8-2bc2-4d25-a361-e13ff4064268.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 346;
}
.vector-74 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 24.14%;
  background: url(/blank_certificate/card/images/9f77a18f-cb91-4d7c-a584-e8c9fad6ce99.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 349;
}
.vector-75 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 27.59%;
  background: url(/blank_certificate/card/images/c1710e2b-2f59-445a-be62-fa91f6e1383a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 352;
}
.vector-76 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 48.28%;
  background: url(/blank_certificate/card/images/d68a4d44-d0ce-4859-b412-26f9c724e8f1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 355;
}
.vector-77 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 51.72%;
  background: url(/blank_certificate/card/images/1587b78b-4533-4f56-8cdb-71726e59b91c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 358;
}
.vector-78 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 58.62%;
  background: url(/blank_certificate/card/images/02746127-c145-4573-bbe4-e873aef437bb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 361;
}
.vector-79 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 62.07%;
  background: url(/blank_certificate/card/images/492f65ab-2c45-4530-b052-99c45055ee25.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 364;
}
.vector-7a {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 65.52%;
  background: url(/blank_certificate/card/images/71c526f2-0a98-4733-a60d-061cf4d5c004.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 367;
}
.vector-7b {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/card/images/ef71d8bf-60b6-45a9-8874-1a2e90a76940.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 370;
}
.vector-7c {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 72.41%;
  background: url(/blank_certificate/card/images/836d0c27-40f8-4d3a-9dd9-db483d794d96.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 373;
}
.vector-7d {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/card/images/0aa37a95-40eb-4683-9b8c-571349f5152a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 376;
}
.vector-7e {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 86.21%;
  background: url(/blank_certificate/card/images/140e2fcc-23a6-432c-b21d-48a8bc6fbf03.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 379;
}
.vector-7f {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 93.1%;
  background: url(/blank_certificate/card/images/fc2c9d24-9f20-4752-9f87-1ce20492474b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 382;
}
.vector-80 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 96.55%;
  background: url(/blank_certificate/card/images/2fa03054-79d3-4801-a4b9-cc24a216f8c9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 385;
}
.regroup-81 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 10.34%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 340;
}
.vector-82 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/dcdf5376-47d8-4f42-add9-0dbb4c50bb7a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 337;
}
.vector-83 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/e1036d41-1316-498c-b265-d2ed99f351f2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 340;
}
.flex-row-f-84 {
  position: relative;
  width: 75.889px;
  height: 3.162px;
  margin: -0.01px 0 0 6.324px;
  z-index: 424;
}
.vector-85 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/688407b7-306e-4ef9-8602-1a811b3f0106.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 388;
}
.vector-86 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 4.17%;
  background: url(/blank_certificate/card/images/00f1755b-e429-48ba-bd11-83a20ffafea5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 391;
}
.vector-87 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 8.33%;
  background: url(/blank_certificate/card/images/8822aeca-0a48-45e0-a1fa-cc92d299e75e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 394;
}
.vector-88 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 45.83%;
  background: url(/blank_certificate/card/images/e023ff1d-eaab-493b-a578-6995eca5f59b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 397;
}
.vector-89 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/card/images/1c5b7125-2204-4dcc-8c41-90b627e8a547.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 400;
}
.vector-8a {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 54.17%;
  background: url(/blank_certificate/card/images/f12997e7-80b2-47d8-9301-0f3d1d1c856c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 403;
}
.vector-8b {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 58.33%;
  background: url(/blank_certificate/card/images/4db85a57-0c9c-413b-93dd-f245fbea1844.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 406;
}
.vector-8c {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 62.5%;
  background: url(/blank_certificate/card/images/157e00fa-3c88-4f84-9456-8832fe50a9b2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 409;
}
.vector-8d {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 66.67%;
  background: url(/blank_certificate/card/images/b85416e1-ffd1-4109-85da-f9aabd40cacf.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 412;
}
.vector-8e {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 79.17%;
  background: url(/blank_certificate/card/images/f4a19157-b0e4-4b7c-ba37-2b46658f5425.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 415;
}
.vector-8f {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 83.33%;
  background: url(/blank_certificate/card/images/ae219c9b-96f0-4539-a808-c61a139ef255.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 418;
}
.vector-90 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 87.5%;
  background: url(/blank_certificate/card/images/90330321-7809-4de0-b1b9-6161a0ce7d90.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 421;
}
.vector-91 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 95.83%;
  background: url(/blank_certificate/card/images/b9797849-df18-4497-b007-2c2a0312184a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 424;
}
.flex-row-aba {
  position: relative;
  width: 91.699px;
  height: 3.162px;
  margin: 0px 0 0 6.324px;
  z-index: 469;
}
.vector-92 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/dc87d81f-453f-425b-ac10-0b04f6cf7fc7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 427;
}
.vector-93 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 10.34%;
  background: url(/blank_certificate/card/images/00da09da-d8a8-45b5-b45b-dfe5e2140aef.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 430;
}
.vector-94 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 17.24%;
  background: url(/blank_certificate/card/images/c20408e5-756a-4212-9232-d83629b56701.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 433;
}
.vector-95 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 20.69%;
  background: url(/blank_certificate/card/images/5f641c64-c04d-4860-a0b1-8ef6339c56aa.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 436;
}
.vector-96 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 27.59%;
  background: url(/blank_certificate/card/images/33b364a3-8460-4710-aad8-b37797ebfd02.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 439;
}
.vector-97 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 34.48%;
  background: url(/blank_certificate/card/images/6de4b2f7-27a2-4ab7-b53c-7178d43efc63.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 442;
}
.vector-98 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/card/images/920aa0f3-3deb-4e49-a5a4-c5fb5a758037.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 451;
}
.vector-99 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 72.41%;
  background: url(/blank_certificate/card/images/5f559668-25c7-4eea-af6a-88d6ef9386f0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 454;
}
.vector-9a {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/card/images/11d21c2a-b7a6-4172-88bb-bfc9c7163797.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 457;
}
.vector-9b {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 86.21%;
  background: url(/blank_certificate/card/images/7b8368c5-4bad-4089-8516-8349d4e8d9cd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 460;
}
.vector-9c {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 89.66%;
  background: url(/blank_certificate/card/images/23a3949c-ef9d-4f09-936d-70318e7ab1b7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 463;
}
.vector-9d {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 93.1%;
  background: url(/blank_certificate/card/images/232d2910-e751-4190-89d6-6ab8b025bb4b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 466;
}
.vector-9e {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 96.55%;
  background: url(/blank_certificate/card/images/a7cafae4-f02e-486b-a165-766cdea88359.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 469;
}
.regroup-9f {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 6.9%;
  height: 100%;
  top: 0;
  left: 44.83%;
  z-index: 448;
}
.vector-a0 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/67273eb3-59bc-419c-93e3-312a134b2f6f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 445;
}
.vector-a1 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/16559128-d400-4a8f-a1bd-113367a8c163.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 448;
}
.flex-row-ca {
  position: relative;
  width: 88.537px;
  height: 3.162px;
  margin: 0px 0 0 6.324px;
  z-index: 490;
}
.vector-a2 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/fdc2f9f7-f50c-4f18-a75e-8de3fcaa68b3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 472;
}
.vector-a3 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 28.57%;
  background: url(/blank_certificate/card/images/90b4035e-f4e6-4461-9782-89d57da95804.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 475;
}
.vector-a4 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 39.29%;
  background: url(/blank_certificate/card/images/dac37376-71f3-47fd-8a78-7bdfb7666863.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 478;
}
.vector-a5 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 53.57%;
  background: url(/blank_certificate/card/images/3e6c4cac-06d3-4824-a2d3-b881ce12b748.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 481;
}
.vector-a6 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 60.71%;
  background: url(/blank_certificate/card/images/63adb9b9-5a95-42ae-aef5-0383315b40ff.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 484;
}
.regroup-a7 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 10.71%;
  height: 100%;
  top: 0;
  left: 89.29%;
  z-index: 490;
}
.vector-a8 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/d950df1b-b01c-4df0-8f63-4ce9fb2b89ae.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 487;
}
.vector-a9 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/3c480bb1-b7c2-4a8d-b4fd-881eb7bf4dac.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 490;
}
.flex-row-f-aa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 79.051px;
  height: 3.162px;
  margin: -0.01px 0 0 15.81px;
  z-index: 529;
}
.vector-ab {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/6b0e599b-b333-40a8-b2f7-6ff81240630b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 493;
}
.vector-ac {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/6510517a-334b-4fda-aa5f-1830fdaf5e7c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 496;
}
.vector-ad {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/0bcb3462-56da-4d78-b0a6-6daf3fa052e9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 499;
}
.vector-ae {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/797dd3ba-3c53-4174-ab68-c2056139c999.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 502;
}
.vector-af {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/788c2d56-d36b-4d8b-9792-789d4a71c0fc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 505;
}
.vector-b0 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/ae810e4f-6346-4a93-9a5f-3e00778af0bc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 508;
}
.vector-b1 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/eca16b24-d544-45ef-b290-d9fff1b2a226.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 511;
}
.vector-b2 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/16759c00-f66a-4723-afa7-6367dd4d9779.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 514;
}
.vector-b3 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/9eb645ab-4ce2-4566-9919-85eb54677323.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 517;
}
.vector-b4 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/089803d9-00ce-4beb-a6fd-7cbc6f5c7fe8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 520;
}
.vector-b5 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/9755411a-5a8e-4ef1-a755-29e3b7b4ee17.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 523;
}
.vector-b6 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/786a9b92-b802-47d5-9e12-96edf26875a9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 526;
}
.vector-b7 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/ce1420f3-25b8-4159-b231-53a847fc2b20.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 529;
}
.flex-row-b8 {
  position: relative;
  width: 85.375px;
  height: 3.162px;
  margin: 0.01px 0 0 12.648px;
  z-index: 574;
}
.vector-b9 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/67871dfd-5b14-4584-aac6-a1df905a8d08.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 532;
}
.vector-ba {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 3.7%;
  background: url(/blank_certificate/card/images/c79db763-a72c-4108-9654-4f4f36283177.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 535;
}
.vector-bb {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 7.41%;
  background: url(/blank_certificate/card/images/b3647df5-10b8-47e0-91e4-feb1efe3e6e0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 538;
}
.vector-bc {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 22.22%;
  background: url(/blank_certificate/card/images/5b1b2ef9-9f97-4104-8496-7f7021cd65f2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 541;
}
.vector-bd {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 29.63%;
  background: url(/blank_certificate/card/images/3d9281dd-a38e-4890-80aa-04fc7f53abe8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 544;
}
.vector-be {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 33.33%;
  background: url(/blank_certificate/card/images/1a1f9263-a9dd-49e5-afe9-4386b5ed35b7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 547;
}
.vector-bf {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 37.04%;
  background: url(/blank_certificate/card/images/fcf850d7-d145-43a9-823f-92f38d483da5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 550;
}
.vector-c0 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 40.74%;
  background: url(/blank_certificate/card/images/c0ea4d48-7591-4800-9b31-ac38bdc9b587.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 553;
}
.vector-c1 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 44.44%;
  background: url(/blank_certificate/card/images/f7ebd634-6350-4fcc-90fe-bbb0d509db64.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 556;
}
.vector-c2 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 48.15%;
  background: url(/blank_certificate/card/images/fd2b056f-d25c-4c35-a842-4403d91bdeb2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 559;
}
.vector-c3 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 51.85%;
  background: url(/blank_certificate/card/images/f419d8a5-34a4-4c45-803c-4e9d1693d99e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 562;
}
.vector-c4 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 74.07%;
  background: url(/blank_certificate/card/images/4ec3ab02-7797-464b-a65c-781c350464fe.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 565;
}
.vector-c5 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 77.78%;
  background: url(/blank_certificate/card/images/39745103-7631-46d4-aa11-30cbe1893113.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 568;
}
.vector-c6 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 85.19%;
  background: url(/blank_certificate/card/images/c0f32ca1-3638-40f0-bc40-8241c32bb374.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 571;
}
.vector-c7 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 96.3%;
  background: url(/blank_certificate/card/images/a013a286-f836-4581-a30d-61d2f4826f10.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 574;
}
.flex-row-a {
  position: relative;
  width: 91.699px;
  height: 3.162px;
  margin: -0.01px 0 0 6.324px;
  z-index: 619;
}
.vector-c8 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/b0620c90-9276-4c70-9865-3b0b570203af.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 577;
}
.vector-c9 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 20.69%;
  background: url(/blank_certificate/card/images/926be97e-5ac1-4042-b8d6-f6e89b6db018.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 586;
}
.vector-ca {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 41.38%;
  background: url(/blank_certificate/card/images/28301312-b1b4-4d26-979b-3bba265a75a0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 589;
}
.vector-cb {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 48.28%;
  background: url(/blank_certificate/card/images/0f0c1c06-6390-49d1-9118-48b9bc7bbb94.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 592;
}
.vector-cc {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 51.72%;
  background: url(/blank_certificate/card/images/ededad81-2e42-49a9-8bd8-32a73e776b0a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 595;
}
.vector-cd {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 55.17%;
  background: url(/blank_certificate/card/images/b028f7a5-b250-4e75-9343-11afe5b705dd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 598;
}
.vector-ce {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 58.62%;
  background: url(/blank_certificate/card/images/b9925089-92bd-4bf9-a267-dcaf88479dcd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 601;
}
.vector-cf {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 62.07%;
  background: url(/blank_certificate/card/images/5d19754a-8f82-41a8-a821-7dee6cca1d1e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 604;
}
.vector-d0 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/card/images/62b46142-e885-4aa8-a398-e3f68cfd4285.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 607;
}
.vector-d1 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/card/images/c6213aa9-1504-4c62-be0e-6fef8f450fc0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 610;
}
.vector-d2 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 79.31%;
  background: url(/blank_certificate/card/images/6eb3b90d-aa57-4e16-a015-81415f8b6728.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 613;
}
.vector-d3 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 93.1%;
  background: url(/blank_certificate/card/images/d9d17154-a8f6-44a2-b672-95c57ba1a167.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 616;
}
.vector-d4 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 96.55%;
  background: url(/blank_certificate/card/images/b3293b1e-1135-473a-88d8-82d51bc33ab0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 619;
}
.regroup-d5 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 6.9%;
  height: 100%;
  top: 0;
  left: 10.34%;
  z-index: 583;
}
.vector-d6 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/cd39a6fe-2cec-4359-8a87-ea27414287ad.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 580;
}
.vector-d7 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/126164be-c259-4231-aa48-50dcd061a9c8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 583;
}
.flex-row-fc {
  position: relative;
  width: 82.213px;
  height: 3.162px;
  margin: -0.01px 0 0 15.81px;
  z-index: 664;
}
.vector-d8 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/3a50f341-d2df-4630-9402-3a0217775d06.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 622;
}
.vector-d9 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 3.85%;
  background: url(/blank_certificate/card/images/cf5749ee-208d-43a1-89bd-221800ce6ca5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 625;
}
.vector-da {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 7.69%;
  background: url(/blank_certificate/card/images/9d129acc-b881-424b-b0c7-2967733d1cd2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 628;
}
.vector-db {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 15.38%;
  background: url(/blank_certificate/card/images/9ce236aa-22e9-452b-977d-c798a6561e8f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 631;
}
.vector-dc {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 19.23%;
  background: url(/blank_certificate/card/images/c26838c7-43dc-456a-b518-a796405c19c6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 634;
}
.vector-dd {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 23.08%;
  background: url(/blank_certificate/card/images/63b99c96-fb34-4b2a-bc2e-13d0fe47e8b1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 637;
}
.vector-de {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 26.92%;
  background: url(/blank_certificate/card/images/032d452b-2f69-4849-8f1a-a5ce3d8ff4d4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 640;
}
.vector-df {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 34.62%;
  background: url(/blank_certificate/card/images/24770181-d777-41d3-9aca-bd9f014a8868.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 643;
}
.vector-e0 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 42.31%;
  background: url(/blank_certificate/card/images/b074746c-0cf4-4e6a-889a-2aeaa09a8d34.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 646;
}
.vector-e1 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 53.85%;
  background: url(/blank_certificate/card/images/4821cc51-221e-464d-a29b-c212e62d1c61.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 649;
}
.vector-e2 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 57.69%;
  background: url(/blank_certificate/card/images/cff5572e-3530-47fe-a8d0-b9f86304d624.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 652;
}
.vector-e3 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 61.54%;
  background: url(/blank_certificate/card/images/5092ba36-0800-4721-a7a9-2da72f883501.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 655;
}
.vector-e4 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 65.38%;
  background: url(/blank_certificate/card/images/f916202a-1d64-40ab-95dd-410d7ad4fe8d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 658;
}
.vector-e5 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 92.31%;
  background: url(/blank_certificate/card/images/b5be2fe1-71c5-4c28-abe7-88266de98a69.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 661;
}
.vector-e6 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 96.15%;
  background: url(/blank_certificate/card/images/69448d03-94ba-45e0-b1da-df23d99d7d02.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 664;
}
.flex-row-da {
  position: relative;
  width: 85.375px;
  height: 3.162px;
  margin: 0.01px 0 0 6.324px;
  z-index: 709;
}
.vector-e7 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/31b02e6a-4405-4d38-952f-e8ea32817cf4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 667;
}
.vector-e8 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 7.41%;
  background: url(/blank_certificate/card/images/b15475df-612d-4d76-8cb9-087a2d90fb25.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 670;
}
.vector-e9 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 14.81%;
  background: url(/blank_certificate/card/images/68bb61f7-685e-4514-87dd-a75c05b784d5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 673;
}
.vector-ea {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 40.74%;
  background: url(/blank_certificate/card/images/f0f54f67-c12d-40b9-8901-0f4e54cdcb42.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 682;
}
.vector-eb {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 44.44%;
  background: url(/blank_certificate/card/images/750505b1-94ed-41cc-bf18-b4f6bd48fe4a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 685;
}
.vector-ec {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 55.56%;
  background: url(/blank_certificate/card/images/395ffa82-7f77-4a73-8916-bd3050d2e56a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 688;
}
.vector-ed {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 70.37%;
  background: url(/blank_certificate/card/images/81903337-cd4c-436a-865c-7289b061f30c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 691;
}
.vector-ee {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 74.07%;
  background: url(/blank_certificate/card/images/ef3e4cff-392f-4a8f-bc49-743c38e94b71.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 694;
}
.vector-ef {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 77.78%;
  background: url(/blank_certificate/card/images/4b8f2342-7480-429d-9fc5-0b6054fa9284.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 697;
}
.vector-f0 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 81.48%;
  background: url(/blank_certificate/card/images/dc1bef32-7a28-439c-8eeb-d36e052b15bd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 700;
}
.vector-f1 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 85.19%;
  background: url(/blank_certificate/card/images/07f79cc1-d31c-49b7-8acd-a221dc8b2cb2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 703;
}
.vector-f2 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 88.89%;
  background: url(/blank_certificate/card/images/6394724f-f99f-452e-a8b2-76369d806ec1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 706;
}
.vector-f3 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 96.3%;
  background: url(/blank_certificate/card/images/c37ef1f4-e1fd-47cc-b44b-6b30c0ac76ea.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 709;
}
.regroup-f4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 11.11%;
  height: 100%;
  top: 0;
  left: 22.22%;
  z-index: 679;
}
.vector-f5 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/e1cc5de1-36b2-41dd-b4f3-f46a89df569c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 676;
}
.vector-f6 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/37706412-d482-4de2-a58b-9a3f189852a8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 679;
}
.flex-row-e {
  position: relative;
  width: 66.403px;
  height: 3.162px;
  margin: 0.01px 0 0 31.621px;
  z-index: 742;
}
.vector-f7 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/7523cd2f-7a7c-464e-801f-ea3960cdbee2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 712;
}
.vector-f8 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 9.52%;
  background: url(/blank_certificate/card/images/46d975b7-d528-48c2-ae4e-22e769f78a04.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 715;
}
.vector-f9 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 14.29%;
  background: url(/blank_certificate/card/images/7099d262-2ad4-4087-8715-def7af466ad0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 718;
}
.vector-fa {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 28.57%;
  background: url(/blank_certificate/card/images/bf4b5939-d3d1-46ef-a6de-0d93da31cf07.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 721;
}
.vector-fb {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 33.33%;
  background: url(/blank_certificate/card/images/19ea9e17-73cd-426a-a934-bdf746d6ee9e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 724;
}
.vector-fc {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 76.19%;
  background: url(/blank_certificate/card/images/a2f06dfa-9a7e-43e8-9863-aa0e1e30e8a7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 733;
}
.vector-fd {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 85.71%;
  background: url(/blank_certificate/card/images/e9792736-67f4-4e54-b251-1363860822f5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 736;
}
.vector-fe {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 90.48%;
  background: url(/blank_certificate/card/images/148a23ef-31ec-4fe6-9443-2dc5a60fb7ef.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 739;
}
.vector-ff {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 95.24%;
  background: url(/blank_certificate/card/images/d6ebb788-5222-4de0-bbe8-c37825e2f840.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 742;
}
.regroup-100 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 9.52%;
  height: 100%;
  top: 0;
  left: 52.38%;
  z-index: 730;
}
.vector-101 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/de1c6d3e-9e6a-4355-94cf-3e5fa0452c28.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 727;
}
.vector-102 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/card/images/aaaad692-f40f-40cc-950e-ab6d6840ab00.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 730;
}
.flex-row-e-103 {
  position: relative;
  width: 91.699px;
  height: 22.134px;
  margin: 0px 0 0 6.324px;
  z-index: 985;
}
.group-104 {
  position: absolute;
  width: 24.14%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/27cba5b6-9be4-49e9-8672-32c584480eec.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 985;
}
.vector-105 {
  position: relative;
  width: 9.486px;
  height: 9.486px;
  margin: 6.32px 0 0 6.324px;
  background: url(/blank_certificate/card/images/376c5008-1dd3-429f-92c0-d2864968f960.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 994;
}
.vector-106 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/c6dd0855-87d1-47d3-9116-e8faea6779e2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 745;
}
.vector-107 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/e329a15b-bc2c-4b5a-bd39-f163bfaf63a7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 748;
}
.vector-108 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/ca5b7500-7184-42d7-8f21-89473236b9d2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 751;
}
.vector-109 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 58.62%;
  background: url(/blank_certificate/card/images/fc47bad8-95eb-433c-9238-18df49a26ba4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 754;
}
.vector-10a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/7dd6b043-10e3-417a-ae93-85b67a3a05c0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 757;
}
.vector-10b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 75.86%;
  background: url(/blank_certificate/card/images/1519d7c7-29ad-4dc8-aae0-a76bf46d99f3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 760;
}
.vector-10c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 82.76%;
  background: url(/blank_certificate/card/images/6bacbe40-7939-47f1-9ca3-4f035dd0a8e2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 763;
}
.vector-10d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0%;
  left: 93.1%;
  background: url(/blank_certificate/card/images/0652e0b9-343f-43f7-99fa-767a693f76ac.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 766;
}
.vector-10e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 27.59%;
  background: url(/blank_certificate/card/images/a791675d-3de5-4d7b-a0a6-93d74e31803d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 769;
}
.vector-10f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/2609c775-c51e-4d2c-a2d5-e33a5947e170.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 772;
}
.vector-110 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 37.93%;
  background: url(/blank_certificate/card/images/872e0eed-7c98-4821-b926-bc2a2cbdfda8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 775;
}
.vector-111 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/f328fbd5-04ac-446a-8eab-032b5a254472.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 778;
}
.vector-112 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 48.28%;
  background: url(/blank_certificate/card/images/eb7d51f3-ea38-4579-b46d-ff044ce82be0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 781;
}
.vector-113 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 51.72%;
  background: url(/blank_certificate/card/images/b3bc5b47-7657-46f5-8790-f4246daeac1b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 784;
}
.vector-114 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/e760071e-475d-4a0f-9d1e-2ee82a94d304.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 787;
}
.vector-115 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/ffbe2f4d-6d37-43e6-9f7d-38ed8078234d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 790;
}
.vector-116 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 82.76%;
  background: url(/blank_certificate/card/images/c450fe4d-d72c-435b-8a38-a9d78ba7be41.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 793;
}
.vector-117 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 86.21%;
  background: url(/blank_certificate/card/images/adc49c55-0ec9-4e13-a1d5-c3869b1235f2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 796;
}
.vector-118 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 89.66%;
  background: url(/blank_certificate/card/images/39a34373-3e1f-4ff6-a84b-79b92d53e8a7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 799;
}
.vector-119 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/b480b272-cc10-45d1-a9f4-704257a08c69.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 802;
}
.vector-11a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/96b20d87-541a-4c87-a6fe-a057d5f7e4e0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 805;
}
.vector-11b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 37.93%;
  background: url(/blank_certificate/card/images/e08d5da2-af3a-4185-86b6-c481920da87b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 808;
}
.vector-11c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/210deeb3-0836-42ed-880b-edd408ae3961.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 811;
}
.vector-11d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/f9512808-3afa-4701-bd39-68643332c2e7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 814;
}
.vector-11e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 58.62%;
  background: url(/blank_certificate/card/images/adcad8d5-21c0-4d3c-8fff-f7a9f9c4ebc5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 817;
}
.vector-11f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/f4f041b6-7dbf-4ace-b86b-8b3c2aafd209.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 820;
}
.vector-120 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/179ed21f-adfe-4886-81a1-a1180402b58a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 823;
}
.vector-121 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 72.41%;
  background: url(/blank_certificate/card/images/9cce2e3c-d403-420e-9e2f-c8c40e15e70a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 826;
}
.vector-122 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 75.86%;
  background: url(/blank_certificate/card/images/2e12a914-fb5a-48a0-b9a2-cd4fb59c4d71.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 829;
}
.vector-123 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 79.31%;
  background: url(/blank_certificate/card/images/64a9e856-ccc8-4da5-9678-da3a67653530.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 832;
}
.vector-124 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 82.76%;
  background: url(/blank_certificate/card/images/d4b753db-dd0a-44a0-91ab-836b72810f7f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 835;
}
.vector-125 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 93.1%;
  background: url(/blank_certificate/card/images/7fc160b3-7f9d-47a3-a223-96261a37c446.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 838;
}
.vector-126 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 27.59%;
  background: url(/blank_certificate/card/images/ed0661f7-2d14-4c81-8af4-d191b1006041.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 841;
}
.vector-127 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/8f52fc5b-b872-4b97-bc0b-5a15960e98dc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 844;
}
.vector-128 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/515a212b-1020-4ec2-a2e0-4ffccabfd84b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 847;
}
.vector-129 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/8d326d73-9fad-4dbc-adca-7c98bf2503a8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 850;
}
.vector-12a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 44.83%;
  background: url(/blank_certificate/card/images/6a6f98d3-e75d-4680-ab4a-5e008159f987.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 853;
}
.vector-12b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 51.72%;
  background: url(/blank_certificate/card/images/859d1f69-93ba-4697-b966-9e04eabf7f1a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 856;
}
.vector-12c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 65.52%;
  background: url(/blank_certificate/card/images/0186e7a3-bbbf-44d8-a957-53386cea96d7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 859;
}
.vector-12d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/60db1d97-4203-45d1-89b1-305a4d754c06.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 862;
}
.vector-12e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 75.86%;
  background: url(/blank_certificate/card/images/89f153e1-9953-46fc-af08-773ec87b42ba.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 865;
}
.vector-12f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 82.76%;
  background: url(/blank_certificate/card/images/af971137-db47-49a6-bff7-b8ad66de36e1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 868;
}
.vector-130 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 86.21%;
  background: url(/blank_certificate/card/images/89b691a6-eb82-4806-9175-f72fd9c1250e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 871;
}
.vector-131 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 89.66%;
  background: url(/blank_certificate/card/images/24aeee14-d5c4-4e72-a566-955d95538869.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 874;
}
.vector-132 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 96.55%;
  background: url(/blank_certificate/card/images/f7d643c0-9b2e-4d31-b65c-3aee4b2d17c4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 877;
}
.vector-133 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 37.93%;
  background: url(/blank_certificate/card/images/a46cd1d6-0439-4146-87d5-c6aadad3a05f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 880;
}
.vector-134 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 41.38%;
  background: url(/blank_certificate/card/images/dcba4eff-63c3-476a-9edf-84aaa2a63513.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 883;
}
.vector-135 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 44.83%;
  background: url(/blank_certificate/card/images/3671f395-ccba-4385-90fc-083669d3589f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 886;
}
.vector-136 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 48.28%;
  background: url(/blank_certificate/card/images/47e5cea7-1867-4f91-8768-c1f92654e2a7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 889;
}
.vector-137 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 51.72%;
  background: url(/blank_certificate/card/images/ad560c52-3686-481a-8b57-84f11df03479.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 892;
}
.vector-138 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/760669f9-a9b3-4b9e-b47c-fb4bf38bce73.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 895;
}
.vector-139 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 65.52%;
  background: url(/blank_certificate/card/images/90639b8c-6870-434c-ae5d-b4c699aa21b6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 898;
}
.vector-13a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 82.76%;
  background: url(/blank_certificate/card/images/17f95778-63f4-437b-bd68-5750a96b1228.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 901;
}
.vector-13b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 86.21%;
  background: url(/blank_certificate/card/images/08ac6a58-acb1-41db-a812-988b0bccc783.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 904;
}
.vector-13c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 89.66%;
  background: url(/blank_certificate/card/images/0dd37d25-0487-4e55-910c-d86b1dc77194.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 907;
}
.vector-13d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 96.55%;
  background: url(/blank_certificate/card/images/3b5606c2-8f91-40dd-a613-eaaf471f7e68.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 910;
}
.vector-13e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 31.03%;
  background: url(/blank_certificate/card/images/43c95f4a-c922-4cf6-8753-808635130694.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 913;
}
.vector-13f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 34.48%;
  background: url(/blank_certificate/card/images/23b3f775-f137-4419-a7ed-4d72ae020e97.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 916;
}
.vector-140 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 48.28%;
  background: url(/blank_certificate/card/images/cc714f6f-1735-407d-bbaf-47e700cea0be.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 919;
}
.vector-141 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 55.17%;
  background: url(/blank_certificate/card/images/0dfa6468-c5aa-4b84-a35f-89db978201b8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 922;
}
.vector-142 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 58.62%;
  background: url(/blank_certificate/card/images/69b77e92-0349-4589-86e1-b00da3989cfa.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 925;
}
.vector-143 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 62.07%;
  background: url(/blank_certificate/card/images/8800e6f7-515f-4598-a8ef-ef2c4b1b7179.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 928;
}
.vector-144 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 65.52%;
  background: url(/blank_certificate/card/images/81929786-b823-4cbf-889b-bfcbdbae1154.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 931;
}
.vector-145 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 68.97%;
  background: url(/blank_certificate/card/images/ae1550e0-f258-4031-b264-76953ecbd430.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 934;
}
.vector-146 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 72.41%;
  background: url(/blank_certificate/card/images/2167794d-12e5-4549-8b40-d23f90f11873.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 937;
}
.vector-147 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 75.86%;
  background: url(/blank_certificate/card/images/889edd4f-338c-4999-89b0-9d5bcd66e39d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 940;
}
.vector-148 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 82.76%;
  background: url(/blank_certificate/card/images/f9e74b82-08ca-40e7-b511-a1899bb4ee4f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 943;
}
.vector-149 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 93.1%;
  background: url(/blank_certificate/card/images/578b1054-9958-46e9-85a6-0f5695fbd5d4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 946;
}
.flex-row-ad-14a {
  position: relative;
  width: 63.241px;
  height: 3.162px;
  margin: -3.162px 0 0 31.621px;
  z-index: 976;
}
.vector-14b {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/34ff1d15-3278-4978-a8f6-d05d59b1f805.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 949;
}
.vector-14c {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 25%;
  background: url(/blank_certificate/card/images/ef13b6ac-b36b-49f9-bc04-facf4bba05eb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 952;
}
.vector-14d {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 30%;
  background: url(/blank_certificate/card/images/173b4c5e-b11f-42c1-a8ce-012dd74be212.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 955;
}
.vector-14e {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 35%;
  background: url(/blank_certificate/card/images/5886caed-5a6d-4438-9826-2b178b2c7dff.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 958;
}
.vector-14f {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/card/images/17e5877d-99d8-4151-a0d5-fdbea1374150.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 961;
}
.vector-150 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 60%;
  background: url(/blank_certificate/card/images/0b57ef4c-12cb-4180-aa92-0f7ccbc050fc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 964;
}
.vector-151 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 65%;
  background: url(/blank_certificate/card/images/fc854e6e-fb83-4e48-98ea-74e4d1de7e29.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 967;
}
.vector-152 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/card/images/4d15ffc1-b179-4d1f-85e5-2e63823f159f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 970;
}
.vector-153 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 80%;
  background: url(/blank_certificate/card/images/660c8b1b-d35b-4e83-a7fb-e1584f5cbd10.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 973;
}
.vector-154 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 95%;
  background: url(/blank_certificate/card/images/04b9a9be-d88e-475d-b9cb-e901c1f0d326.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 976;
}
.issued-date-expiry-date {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 46px;
  top: 13.367px;
  left: 149.029px;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 18.582597732543945px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.74px;
  z-index: 10;
}
.scan-qr-code {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 46px;
  top: 20.395px;
  left: 0;
  color: rgba(255, 255, 255, 0.5);
  font-family: Inter, var(--default-font-family);
  font-size: 13.582597732543945px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.74px;
  z-index: 9;
}
.rectangle-155 {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 11px;
  top: 90.937px;
  left: 0;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 15px;
  font-weight: 400;
  line-height: 11px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.6px;
  z-index: 11;
}
.shape {
  position: relative;
  width: 493px;
  height: 20.063px;
  margin: 52.863px 0 0 0;
  background: #ffffff;
  z-index: 1000;
}
.img-a3 {
  position: absolute;
  width: 100%;
  height: 94.54%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/card/images/aceabc52-acd8-4500-9ee1-a30e10edd491.png)
    no-repeat center;
  background-size: 100% 100%;
}
              
         `
    }
    const iframe: any = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';

    iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
               
              <style>
${cssString()}
          </style>
            </head>
            <body>
              <div class="main-container">
                <div class="rectangle"></div>
                <div class="whatsapp-image"></div>
                <div class="apply-style"><div class="profile-photo"></div></div>
                <span class="sheik-hameed-khan">${item?.name}</span>
                <div class="flex-row-cf">
                  <div class="name">
                    <span class="apparicio-junior">${item?.certificate_no}<br /><br /></span>
                  </div>
                  <div class="line"></div>
                  <div class="bio">
  <div class="field">
    <span class="qatar-id">Qatar ID/ ID No.:</span>
    <span class="qube-inspection">${item?.id_no}</span>
  </div>
  <div class="field">
    <span class="qatar-id">Company Name:</span>
    <span class="qube-inspection">${item?.company}</span>
  </div>
  <div class="field">
    <span class="qatar-id">Course Details:</span>
    <span class="qube-inspection">${item?.designation}</span>
  </div>
  <div class="field">
    <span class="qatar-id">Model/ Level:</span>
    <span class="qube-inspection">${item?.model_level}</span>
  </div>
</div>

                </div>
                <div class="line-1"></div>
                <div class="flex-row-b">
                  <div class="vector" ></div>
                  <span class="issued-date-expiry-date">${formatDateWithHyphen(item?.issued_on)}<br />${formatDateWithHyphen(item?.valid_untill)}</span>
                  <span class="scan-qr-code">Issued Date: <br />Expiry Date:</span>
                  <span class="rectangle-155">Scan QR code to verify this card</span>
                </div>
                <div class="shape"></div>
                <div class="img-a3"></div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
            </html>
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


  const handleCloseEdit = () => {
    setEditingRow(null);
  };

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
                <TableCell className="py-4">{idx}</TableCell>

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
                  {isGenerating === item.id ? <TableSpinner /> : <img src={item?.qr_url} alt="QR code" className="w-16 h-16" />}
                </TableCell>
                <TableCell className="py-4">


                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <ActionButtonIcon />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditClick(item)}>

                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => generateQr(item)}>

                        Recreate QR
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
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
    </div>
  );
}
