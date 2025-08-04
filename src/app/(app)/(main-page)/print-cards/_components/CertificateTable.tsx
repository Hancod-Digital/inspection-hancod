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
import { makeApiCall } from '@/lib/apicaller';
import { StudentService } from '@/services/api/students-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import QRCode from 'qrcode';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { UserService } from '@/services/api/user-service';
import TableSpinner from '@/components/animated/TableSpinner';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { formatDateWithHyphen, splitDesignation } from '@/lib/utils';
import AvatarWithTooltip from './AvatarQr';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

export default function CertificateTable({ data, changed, setChanged }: { data: any, changed: boolean, setChanged: any }) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [isGenerating, setIsGenerating] = useState<number | null>(null);
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
    const Printq = (item: any) => {
        const {training, training1} = splitDesignation(item?.designation)
        const {training:model_level, training1:model_level1} = splitDesignation(item?.model_level)
        const iframe: any = document.createElement('iframe');
        iframe.style.cssText = `
            visibility: hidden;
            position: fixed;
            right: 0;
            bottom: 0; 
            width: 100%;
            height:  100%;
        `;
        console.log(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Certificate of Completion</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap" />
                <style>
                    :root {
                        --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                            Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
                            "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
                            "Source Han Sans CN", sans-serif;
                    }
                            @page {   
    size: 695px 930px;
    margin: 0mm;
}
                  
                    .certificate-container {
                        background-color: #fff;
                        display: flex;
                        max-width: 595px;
                        max-height: 860px;
                        flex-direction: column;
                        overflow: hidden;
                        align-items: center;
                        padding: 218px 35px 89px;
                        margin: 40px auto 0 auto;
                    }
                    .logo {
                        aspect-ratio: 0.94;
                        object-fit: contain;
                        object-position: center;
                        width: 113px;
                        border-radius: 15px;
                    }
                    .certificate-intro {
                        color: #212121;
                        margin: 16px 0 0;
                        font: 400 16px/1.1 Javanese Text, var(--default-font-family);
                    }
                    .recipient-name {
                        color: #000;
                        margin: 9px 0 0;
                        font: 400 32.4px/1.1 Javanese Text, var(--default-font-family);
                    }
                    .certificate-details {
                        color: #1a1a1e;
                        width: 100%;
                        margin: 26px 0 0;
                        font: 400 14px/32px Javanese Text, var(--default-font-family);
                        position: relative;
                    }
                    .underline {
                        color: #c9c9c9;
                    }
                    .signatures-section {
                        width: 100%;
                        margin-top: 92px;
                    }
                    .value {
                        position: absolute;
                        text-align: center;
                        width: 100%;
                        font-weight: bold;
                        color: #000;
                        transform: translateY(-20px);
                        text-align: left;
                        margin-left: 40px;
                    }
                    .signatures-container {
                        gap: 20px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-column {
                        display: flex;
                        flex-direction: column;
                        width: 45%;
                    }
                    .trainer-section {
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                        font: 400 14px Javanese Text, sans-serif;
                    }
                    .signature-line {
                        aspect-ratio: 200;
                        object-fit: cover;
                        max-width: 100%;
                    }
                    .signature-title {
                        color: #1f1f1f;
                        font-size: 14px;
                        text-align: center;
                        margin: 9px 0 0;
                    }
                    .certificate-meta {
                        display: flex;
                        margin-top: 36px;
                        gap: 37px;
                        font-size: 12px;
                        color: #1a1a1e;
                        line-height: 0px;
                    }
                    .meta-labels {
                        align-self: start;
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        flex: 1;
                    }
                    .meta-values {
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        flex: 1;
                    }
                    .authorized-section {
                        display: flex;
                        flex-grow: 1;
                        flex-direction: column;
                        color: #1f1f1f;
                        font: 400 14px Javanese Text, sans-serif;
                    }
                    .auth-signature-wrapper {
                        display: flex;
                        margin-top: 9px;
                        flex-direction: column;
                        align-items: start;
                        padding: 0 28px;
                    }
                   .stamp {
            aspect-ratio: 1.01;
            object-fit: contain;
            width: 117px;
          margin-top: 28px;
          }
                    
                        *{
                    margin: 0px,
                    padding: 0px
                    }
                </style>
            </head>
            <body>
                <section class="certificate-container">
                    <img src="${item?.avatar}" alt="Certificate Logo" class="logo" />
                    <h1 class="certificate-intro">This is to certify that</h1>
                    <h2 class="recipient-name">${item?.name?.toUpperCase()}</h2>
                    <p class="certificate-details" style="font-size: 14px;">
                        Qatar ID/ Employer ID No.
                        <span class="value qatar-id" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.id_no}</span>
                        <span class="underline">____________________________________________________________________</span>
                        <br />
                        Company / Employer
                        <span class="value company" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.company?.toUpperCase()}</span>
                        <span class="underline">__________________________________________________________________________</span>
                        <br />
                        has successfully completed a Training/assessment as
                        <span class="value training" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.designation?.length > 20 ? splitLongString(item?.designation)[0] : item?.designation?.toUpperCase()}</span>
                        <span class="underline">____________________________________________</span>
                        <br />
                        <span class="value role" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.designation?.length > 20 ? splitLongString(item?.designation)[1] : item?.designation?.toUpperCase()}</span>
                        <span class="underline">_______________________________________________________</span>.
                    </p>
                    <article class="signatures-section">
                        <div class="signatures-container">
                            <div class="signature-column">
                                <section class="trainer-section">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ad78b217e334dfbd7976459e664d9d9995052b34db611f60c68bd8a693d3a39?placeholderIfAbsent=true&apiKey=ec30a833d743462ba89f4aaebb78651e" alt="Trainer Signature" class="signature-line" />
                                    <p class="signature-title">Trainer/Assessor</p>
                                    <div class="certificate-meta">
                                        <div class="meta-labels">
                                            <p>Certificate Number:</p>
                                            <p>Course Duration:</p>
                                            <p>Issued Date :</p>
                                            <p>Expiry Date :</p>
                                        </div>
                                        <div class="meta-values">
                                            <p>${item?.certificate_no}</p>
                                            <p>${(item?.course_duration || 2) > 1 ? `${item?.course_duration || 2} DAYS` : `${item?.course_duration || 2} DAY`}</p>
                                            <p>${formatDateWithHyphen(item?.issued_on)}</p>
                                            <p>${formatDateWithHyphen(item?.valid_untill)}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div class="signature-column">
                                <section class="authorized-section">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d89aae86126e38e4b57de5efb2cdbc307737da9691d772b85c8f21184c2b195?placeholderIfAbsent=true&apiKey=ec30a833d743462ba89f4aaebb78651e" alt="Authorized Signature Line" class="signature-line" />
                                    <div class="auth-signature-wrapper">
                                        <p class="signature-title" style="margin-top: 4px; margin-left: 43px">Authorized Signature</p>
                                        <img src="${item?.qr_url}" alt="Official Stamp" class="stamp" />
                                    </div>
                                </section>
                            </div>
                        </div>
                    </article>
                </section>
                <script>
                    // Print and close the window after content is loaded
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
            </html>`)
        iframe.srcdoc = `
           <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Certificate of Completion</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap" />
                <style>
                    :root {
                        --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                            Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
                            "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
                            "Source Han Sans CN", sans-serif;
                    }
                            @page {   
    size: 695px 930px;
    margin: 0mm;
}
                  
                    .certificate-container {
                        background-color: #fff;
                        display: flex;
                        max-width: 595px;
                        max-height: 860px;
                        flex-direction: column;
                        overflow: hidden;
                        align-items: center;
                        padding: 218px 35px 89px;
                        margin: 0 auto;
                    }
                    .logo {
                        aspect-ratio: 0.94;
                        object-fit: contain;
                        object-position: center;
                        width: 113px;
                        border-radius: 15px;
                    }
                    .certificate-intro {
                        color: #212121;
                        margin: 16px 0 0;
                        font: 400 16px/1.1 Javanese Text, var(--default-font-family);
                    }
                    .recipient-name {
                        color: #000;
                        margin: 9px 0 0;
                        font: 400 32.4px/1.1 Javanese Text, var(--default-font-family);
                    }
                    .certificate-details {
                        color: #1a1a1e;
                        width: 100%;
                        margin: 26px 0 0;
                        font: 400 14px/32px Javanese Text, var(--default-font-family);
                        position: relative;
                    }
                    .underline {
                        color: #c9c9c9;
                    }
                    .signatures-section {
                        width: 100%;
                        margin-top: 92px;
                    }
                    .value {
                        position: absolute;
                        text-align: center;
                        width: 100%;
                        font-weight: bold;
                        color: #000;
                        transform: translateY(-20px);
                        text-align: left;
                        margin-left: 40px;
                    }
                    .signatures-container {
                        gap: 20px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-column {
                        display: flex;
                        flex-direction: column;
                        width: 45%;
                    }
                    .trainer-section {
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                        font: 400 14px Javanese Text, sans-serif;
                    }
                    .signature-line {
                        aspect-ratio: 200;
                        object-fit: cover;
                        max-width: 100%;
                    }
                    .signature-title {
                        color: #1f1f1f;
                        font-size: 14px;
                        text-align: center;
                        margin: 9px 0 0;
                    }
                    .certificate-meta {
                        display: flex;
                        margin-top: 36px;
                        gap: 37px;
                        font-size: 12px;
                        color: #1a1a1e;
                        line-height: 0px;
                    }
                    .meta-labels {
                        align-self: start;
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        flex: 1;
                    }
                    .meta-values {
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        flex: 1;
                    }
                    .authorized-section {
                        display: flex;
                        flex-grow: 1;
                        flex-direction: column;
                        color: #1f1f1f;
                        font: 400 14px Javanese Text, sans-serif;
                    }
                    .auth-signature-wrapper {
                        display: flex;
                        margin-top: 9px;
                        flex-direction: column;
                        align-items: start;
                        padding: 0 28px;
                    }
                   .stamp {
            aspect-ratio: 1.01;
            object-fit: contain;
            width: 117px;
          margin-top: 28px;
          }
                    
                        *{
                    margin: 0px,
                    padding: 0px
                    }
                </style>
            </head>
            <body>
                <section class="certificate-container">
                    <img src="${item?.avatar}" alt="Certificate Logo" class="logo" />
                    <h1 class="certificate-intro">This is to certify that</h1>
                    <h2 class="recipient-name">${item?.name?.toUpperCase()}</h2>
                    <p class="certificate-details" style="font-size: 14px;">
                        Qatar ID/ Employer ID No.
                        <span class="value qatar-id" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.id_no}</span>
                        <span class="underline">____________________________________________________________________</span>
                        <br />
                        Company / Employer
                        <span class="value company" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.company?.toUpperCase()}</span>
                        <span class="underline">__________________________________________________________________________</span>
                        <br />
                        has successfully completed a Training/assessment as
                        <span class="value training" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.designation?.length > 28 ? splitLongString(item?.designation)[0] : item?.designation?.toUpperCase()}</span>
                        <span class="underline">____________________________________________</span>
                        <br />
                        <span class="value role" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.designation?.length > 28 ? splitLongString(item?.designation)[1] : ""}</span>
                        <span class="underline">_______________________________________________________</span>.
                    </p>
                    <article class="signatures-section">
                        <div class="signatures-container">
                            <div class="signature-column">
                                <section class="trainer-section">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ad78b217e334dfbd7976459e664d9d9995052b34db611f60c68bd8a693d3a39?placeholderIfAbsent=true&apiKey=ec30a833d743462ba89f4aaebb78651e" alt="Trainer Signature" class="signature-line" />
                                    <p class="signature-title">Trainer/Assessor</p>
                                    <div class="certificate-meta">
                                        <div class="meta-labels">
                                            <p>Certificate Number:</p>
                                            <p>Course Duration:</p>
                                            <p>Issued Date :</p>
                                            <p>Expiry Date :</p>
                                        </div>
                                        <div class="meta-values">
                                            <p>${item?.certificate_no}</p>
                                            <p>${(item?.course_duration || 2) > 1 ? `${item?.course_duration || 2} DAYS` : `${item?.course_duration || 2} DAY`}</p>
                                            <p>${formatDateWithHyphen(item?.issued_on)}</p>
                                            <p>${formatDateWithHyphen(item?.valid_untill)}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div class="signature-column">
                                <section class="authorized-section">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d89aae86126e38e4b57de5efb2cdbc307737da9691d772b85c8f21184c2b195?placeholderIfAbsent=true&apiKey=ec30a833d743462ba89f4aaebb78651e" alt="Authorized Signature Line" class="signature-line" />
                                    <div class="auth-signature-wrapper">
                                        <p class="signature-title" style="margin-top: 4px; margin-left: 43px">Authorized Signature</p>
                                        <img src="${item?.qr_url}" alt="Official Stamp" class="stamp" />
                                    </div>
                                </section>
                            </div>
                        </div>
                    </article>
                </section>
                <script>
                    // Print and close the window after content is loaded
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
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
     
    const fetchHtml = async (profile_url: string, qr_url: string, name: string, id_no: string, company: string, designation: string, issued_on: string, valid_untill: string, course_duration: string, certificate_no:string,item:any   ) => {
        const response = await fetch('/blank_certificate/data.html'); 
        let htmlString = await response.text();
 
        // Replace placeholders for dynamic URLs
        htmlString = htmlString.replace(/\{\{profilePhotoUrl\}\}/g, profile_url);
        htmlString = htmlString.replace(/\{\{qrCodeUrl\}\}/g, qr_url);
        htmlString = htmlString.replace(/\{\{IDNumber\}\}/g, id_no);
        htmlString = htmlString.replace(/\{\{Company\}\}/g, company.toUpperCase());
        htmlString = htmlString.replace(/\{\{name\}\}/g, name.toUpperCase());
        const words = designation.split(' ');
        let training = '';
        let training1 = '';
        let currentLength = 0;
        
        for (const word of words) {
            const newLength = currentLength + word.length + (training ? 1 : 0);
            if (newLength <= 25) {
                training += (training ? ' ' : '') + word;
                currentLength = newLength;
            } else {
                training1 += (training1 ? ' ' : '') + word;
            }
        }
        
        htmlString = htmlString.replace(/\{\{Training\}\}/g, designation?.length > 20 ? splitLongString(designation)[0] : designation);
        htmlString = htmlString.replace(/\{\{Training1\}\}/g, designation?.length > 20 ? splitLongString(designation)[1] : '');
        htmlString = htmlString.replace(/\{\{CertificateNo\}\}/g, certificate_no);
        htmlString = htmlString.replace(/\{\{IssuedDate\}\}/g, issued_on);
        htmlString = htmlString.replace(/\{\{ExpiryDate\}\}/g, valid_untill);
        htmlString = htmlString.replace(/\{\{CourseDuration\}\}/g, `${course_duration} ${parseInt(course_duration) > 1 ? " DAYS" : "DAY"}`);

        
        // Replace the placeholder name in the span
        // htmlString = htmlString.replace(/<span class="name-text">.*?<\/span>/, `<span class="name-text">${name}</span>`);
        //  htmlString = htmlString.replace(/<span class="date">.*?<br\s*\/>.*?<\/span>/, `<span class="date">${issued_on}<br />${valid_untill}</span>`);
        // htmlString = htmlString.replace(/<span\s*class="day">.*?<\/span>/, `<span class="day">${course_duration} ${parseInt(course_duration) > 1 ? " days" : "day"}</span>`);
      
        setHtmlContent(htmlString);
        return htmlString;
    };

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const generateCertificate = async (item: any) => {
        try {
           
            setIsGenerating(item?.id); // Set the current row's id as generating
            const htmlElement = document.createElement('div');
             
            htmlElement.innerHTML = await fetchHtml(item?.avatar, item?.qr_url, item?.name, item?.id_no, item?.company, item?.designation, formatDateWithHyphen(item?.issued_on), formatDateWithHyphen(item?.valid_untill), item?.course_duration, item?.certificate_no,item);

            document.body.appendChild(htmlElement);
            htmlElement.style.width = '794px';
            htmlElement.style.height = '1123px';
            const dataUrl = await toPng(htmlElement, {
                width: 794,
                height: 1123,
                pixelRatio: 1,
            });

            document.body.removeChild(htmlElement); // Clean up
            const imageBlob = dataURLtoBlob(dataUrl);
            const certificateUrl = await uploadImage(imageBlob);

            if (certificateUrl) {
                await makeApiCall(
                    () => new StudentService().updateStudentCertificateUrl(item?.id, certificateUrl),
                    { afterSuccess: (data: any) => { } }
                );

                // const qrDataUrl = await QRCode.toDataURL(certificateUrl, {
                //     width: 300,
                //     errorCorrectionLevel: 'H',
                // });

                // const qrImageBlob = dataURLtoBlob(qrDataUrl);
                // const qrImageUrl = await uploadImage(qrImageBlob);

                // if (qrImageUrl) {
                //     await makeApiCall(
                //         () => new StudentService().updateStudentCertificateQRUrl(item?.id, qrImageUrl),
                //         { afterSuccess: (data: any) => {} }
                //     );
                //     toastWithTimeout(ToastVariant.Success, "Certificate and QR code created successfully.");
                // } else {
                //     toastWithTimeout(ToastVariant.Success, "Failed to upload QR image.");
                // }
                toastWithTimeout(ToastVariant.Success, "Certificate Recreated successfully.");
            } else {
                toastWithTimeout(ToastVariant.Success, "Failed to upload certificate image.");
            }
            setChanged(!changed);

        } catch (error) {
            console.error("Error generating certificate:", error);
            toastWithTimeout(ToastVariant.Success, "An error occurred while generating the certificate.");
        } finally {
            setIsGenerating(null); // Reset after completion
        }
    };

    const dataURLtoBlob = (dataUrl: string) => {
        const arr = dataUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : '';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };

    const uploadImage = async (imageBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', imageBlob);

        let res: any;
        await makeApiCall(
            () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
            { afterSuccess: (data: any) => { res = data; } }
        );

        return res?.fullPath
            ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
            : null;
    };
    const printCertificate = (certificateUrl: string, item: any) => {
        const url = `${certificateUrl}?name=${encodeURIComponent(item.name)}&id_number=${encodeURIComponent(item.id_number)}&company=${encodeURIComponent(item.company)}&designation=${encodeURIComponent(item.designation)}&model_level=${encodeURIComponent(item.model_level)}&issued_on=${encodeURIComponent(formatDateWithHyphen(item?.issued_on))}&valid_until=${encodeURIComponent(formatDateWithHyphen(item.valid_untill))}&_=${new Date().getTime()}`;
    
        const iframe:any = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Print Content</title>
              <style>
                @page {
                  size: A4; /* Change to 'Letter' if needed */
                  margin: 0; /* Remove default margins */
                }
                body {
                  margin: 0;
                }
                img {
                  width: 100%;
                  height: auto;
                  display: block;
                }
              </style>
            </head>
            <body>
              <img src="${url}" alt="Certificate" id="certificateImage" />
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
            </html>
        `;
        document.body.appendChild(iframe);
    
        iframe.onload = function() {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
    
            // Remove the iframe after printing
            iframe.contentWindow.onafterprint = function() {
                document.body.removeChild(iframe);
            };
        };
    };
    const {currentPage, totalPages, handlePreviousPage, handleNextPage, setCurrentPage, currentData, goToPage} = usePagination(data)


    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto relative">
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
                    {currentData?.map((item: any, idx: number) => (
                        <React.Fragment key={idx + 1}>
                            <TableRow>
                                <TableCell className="py-4">{item?.id}</TableCell>
                               
                                <TableCell className="py-4">
                                    {item?.name}
                                    <div>Address: {item?.address}</div>
                                    <div>Designation: {item?.designation}</div>
                                </TableCell>
                                <TableCell className="py-4">{item?.added_by}</TableCell>
                                <TableCell className="py-4">
                                    <Avatar className="mb-2 w-16 h-16">
                                        <AvatarImage
                                            className="object-cover w-full h-full"
                                            alt="User's avatar"
                                            src={item?.avatar}
                                        />
                                        <AvatarFallback>{item?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div>ID No: {item?.id_no}</div>
                                    <div>Card No: {item?.card_no}</div>
                                    <div>Model/Level: {item?.model_level}</div>
                                    <div>Company: {item?.company}</div>
                                    <div>Issued on: {formatDateWithHyphen(item?.issued_on)}</div>
                                    <div>Valid Until: {formatDateWithHyphen(item?.valid_untill)}</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    {isGenerating === item?.id ? (
                                        <TableSpinner />
                                    ) : (
                                        !item?.qr_url ? "QR not found" :   <AvatarWithTooltip item={item} tooltipPosition="top" />
                                    )}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-2 ">
                                        <>
                                            {!item?.certificate_url && (
                                                <button onClick={async () => await generateCertificate(item)} className="bg-white py-1 px-2 rounded-md  border-primary border text-primary">
                                                    Certificate
                                                </button>
                                            )}

                                            {item?.certificate_url && (
                                                <>
                                                    <button onClick={async () => await generateCertificate(item)} className="bg-white py-1 px-2  rounded-md  border-primary border text-primary mb-2">
                                                        Re-create
                                                    </button>
                                                    <button onClick={() => Printq( item)} className="bg-white py-1 rounded-md   px-1  border-primary border text-primary">
                                                        Print
                                                    </button>
                                                </>
                                            )}
                                        </>
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
            <div className='mt-4 flex justify-center pb-4'>
                <PaginationDemo 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPreviousPage={handlePreviousPage} 
                    onNextPage={handleNextPage} 
                    onPageChange={goToPage} 
                />
            </div>
        </div>
    );
}
