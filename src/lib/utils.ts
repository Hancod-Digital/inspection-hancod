import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const majorCategoryDataRange = [{from:'equipment_type',to:'equipment_type'}]
export const siteDataRange = [{from:'area',to:'area'}]
export const equipmentDataRange = [{from:'equipment_type',to:'equipment_type'}]

export const locationDataRange = [{from:'site',to:'site'}]
export const minorCategoryDataRange = [{from:'major_category',to:'major_category'},{from:'standard',to:'standard'}]

export const fetchCertificateHtml = async (item) => {
  const htmlString = `
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
          .certificate-container {
            background-color: #fff;
            display: flex;
            max-width: 595px;
            flex-direction: column;
            overflow: hidden;
            align-items: center;
            padding: 218px 35px 89px;
          }
          .logo {
            aspect-ratio: 0.94;
            object-fit: contain;
            object-position: center;
            width: 94px;
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
            font: 400 36px/1.1 Javanese Text, var(--default-font-family);
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
            width: 80px;
            margin-top: 28px;
          }
      </style>
  </head>
  <body>
      <section class="certificate-container">
          <img src="${item?.avatar}" alt="Certificate Logo" class="logo" />
          <h1 class="certificate-intro">This is to certify that</h1>
          <h2 class="recipient-name">${item?.name}</h2>
          <p class="certificate-details" style="font-size: 14px;">
            Qatar ID/ Employer ID No.
            <span class="value qatar-id" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.IDNumber}</span>
            <span class="underline">____________________________________________________________________</span>
            <br />
            Company / Employer
            <span class="value company" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.Company}</span>
            <span class="underline">__________________________________________________________________________</span>
            <br />
            has successfully completed a Training/assessment as
            <span class="value training" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.Training}</span>
            <span class="underline">____________________________________________</span>
            <br />
            <span class="value role" style="font-family: Lato, var(--default-font-family); font-size: 12px; margin-top: 14px;">${item?.Training1}</span>
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
                      <p>${item?.course_duration+" " || 2+" "}day</p>
                      <p>${item?.issued_on}</p>
                      <p>${item?.valid_untill}</p>
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
  </body>
  </html>
  `;

  return htmlString;
};


export function replaceHyphen(str: string) {
  if (str.includes('-')) {
      return str.replace(/-/g, '_');  // Replace all hyphens with underscores
  } else {
      return str;  // Return string as is if no hyphens are present
  }
}

export const fetchHtml = async (item:any) => {
  const htmlString = `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Generated by Codia AI</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
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
width: 595px;
height: 842px;
margin: 0 auto;
background: #ffffff;
overflow: hidden;
}
.rectangle {
position: absolute;
width: 43.224px;
height: 883.813px;
top: -16.328px;
left: 0;
background: #8d1b3d;
z-index: 11;
}
.whatsapp-image {
position: absolute;
width: 178.444px;
height: 50.344px;
top: 78.535px;
left: 67.5px;
background: url(/blank_certificate/images/8c6dea95de03a5cdcee3820f6ffcd969fa994d12.png)
no-repeat center;
background-size: cover;
z-index: 10;
}
.qr-code-verification-report {
position: absolute;
width: 514.973px;
height: 34px;
top: 155.484px;
left: 71.944px;
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 400;
line-height: 22px;
text-align: left;
letter-spacing: -0.64px;
z-index: 4;
}
.qr-code-verification-report-1 {
position: relative;
color: #171717;
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 700;
line-height: 22px;
text-align: left;
letter-spacing: -0.64px;
}
.qr-code-authenticated-results {
position: relative;
color: #171717;
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 400;
line-height: 22px;
text-align: left;
letter-spacing: -0.64px;
}
.profile-photo {
position: absolute;
width: 17.31%;
height: 13.06%;
top: 27.34%;
left: 12.09%;
background: url(${item?.avatar})
no-repeat center;
background-size: cover;
z-index: 9;
border-radius: 15px;
}
.sheik-hameed-khan {
display: flex;
align-items: flex-start;
justify-content: flex-start;
position: absolute;
height: 3.09%;
top: 43.57%;
padding-top: 13px;
left: 12.09%;
color: #171717;
font-family: Inter, var(--default-font-family);
font-size: 24px;
font-weight: 600;
line-height: 26px;
text-align: center;
white-space: nowrap;
z-index: 8;
}
.nome {
display: flex;
align-items: flex-start;
flex-wrap: nowrap;
gap: 15.485px;
position: absolute;
width: 174px;
height: 157px;
top: 50%;
left: 50%;
transform: translate(-129.63%, -7.14%);
}
.apparicio-junior {
display: flex;
align-items: flex-start;
justify-content: flex-start;
flex-shrink: 0;
position: relative;
width: 174px;
height: 157px;
color: #171717;
font-family: Inter, var(--default-font-family);
font-size: 20px;
font-weight: 500;
line-height: 33.233px;
text-align: left;
text-overflow: initial;
letter-spacing: -0.8px;
z-index: 1;
overflow: hidden;
}
.qube-inspection-basic {
display: flex;
align-items: flex-start;
justify-content: flex-start;
position: absolute;
width: 340.257px;
height: 132px;
top: 468.398px;
left: 259.973px;
color: #171717;
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 400;
line-height: 30px;
text-align: left;
letter-spacing: -0.64px;
z-index: 3;
}
.qatar-id-company {
display: flex;
align-items: flex-start;
justify-content: flex-start;
position: absolute;
width: 163.029px;
height: 132px;
top: calc(50% - -47.4px);
left: calc(50% - 225.56px);
color: rgba(0, 0, 0, 0.5);
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 400;
line-height: 30px;
text-align: left;
letter-spacing: -0.64px;
z-index: 2;
}
.line {
position: absolute;
width: 62.71%;
height: 0.18%;
top: 70.29%;
left: 12.09%;
background: url(/blank_certificate/images/ed1ac0da-e9fe-4b76-b073-cc9e922ba016.png)
no-repeat center;
background-size: 100% 100%;
z-index: 5;
}
.issued-expiry {
display: flex;
align-items: flex-start;
justify-content: flex-start;
position: absolute;
height: 5.23%;
top: 75.55%;
left: 12.09%;
color: rgba(0, 0, 0, 0.5);
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 400;
line-height: 32px;
text-align: left;
white-space: nowrap;
letter-spacing: -0.64px;
z-index: 6;
}
.date {
display: flex;
align-items: flex-start;
justify-content: flex-start;
position: absolute;
height: 5.23%;
top: 75.55%;
left: 43.69%;
color: #171717;
font-family: Inter, var(--default-font-family);
font-size: 16px;
font-weight: 400;
line-height: 32px;
text-align: left;
white-space: nowrap;
letter-spacing: -0.64px;
z-index: 7;
}
.contact-info {
display: flex;
align-items: flex-start;
justify-content: flex-end;
position: absolute;
width: 104.24%;
height: 2.02%;
top: 95.93%;
left: -8.43%;
color: #8d1b3d;
font-family: Inter, var(--default-font-family);
font-size: 12px;
font-weight: 500;
line-height: 17px;
text-align: right;
white-space: nowrap;
letter-spacing: 0.24px;
z-index: 12;
}

</style>
</head>
<body>
<div class="main-container">
<div class="rectangle"></div>
<div class="whatsapp-image"></div>
<div class="qr-code-verification-report">
<span class="qr-code-verification-report-1"
>QR Code Verification Report<br /></span
><span class="qr-code-authenticated-results"
>This QR code is authenticated and the results are as below</span
>
</div>
<div class="profile-photo"></div>
<span class="sheik-hameed-khan">${item?.name}</span>
<div class="nome">
<span class="apparicio-junior">${item?.certificate_no}<br /><br /></span>
</div>
<span class="qube-inspection-basic"
>${item?.id_no}<br />${item?.company}<br />${item?.designation}<br />${item?.model_level}<br />${item?.course_duration+" " || 2+" "}day</span
><span class="qatar-id-company"
>Qatar ID/ ID No.: <br />Company name:<br />Designation:<br />Model/
Level:<br />Course Duration:</span
>
<div class="line"></div>
<span class="issued-expiry">Issued Date: <br />Expiry Date:</span
><span class="date">${item?.issued_on}<br />${item?.valid_untill}</span
><span class="contact-info"
>+974 31499334 | Info@qubeinspection.com | www.qubeinspection.com</span
>
</div>
<!-- Generated by Codia AI - https://codia.ai/ -->
</body>
</html>

  `
  
  return htmlString;
};

export function getSubTopicOne(str: string) {
   
  
  const parts = str.split('/');
  
  // Check if there are at least 3 parts to ensure the second slash exists and has a word after it
  if (parts.length > 1) {
    
      return replaceHyphen(parts[1]); // The word after the second slash
  } else {
      return null; // Return null if the word after the second slash doesn't exist
  }
}
export function getLastTwoDigitsOfCurrentYear(): string {
  const year = new Date().getFullYear();
  const lastTwoDigits = (year % 100).toString(); // Convert to string
  const paddedYear = lastTwoDigits.padStart(4, '0'); // Pad to 4 digits
  return paddedYear;
}

export function getSubTopic(str: string) {
 
  
  const parts = str.split('/');
  
  // Check if there are at least 3 parts to ensure the second slash exists and has a word after it
  if (parts.length > 2) {
    
      return replaceHyphen(parts[2]); // The word after the second slash
  } else {
      return null; // Return null if the word after the second slash doesn't exist
  }
}

export function joinFunctions(locations: any[], sites: any[]) {
  return locations?.map(location => {
      // Find the site record that matches the location's site ID
      const matchedSite = sites.find(site => site.id === location.site);
      
      // Return a new object that includes the location data and the site name
      return {
          ...location,
          join: matchedSite ? matchedSite.name : 'Unknown Site' // Add site name or fallback to 'Unknown Site'
      };
  });
}


export async function loadImages(element: any) {
  const images = element.getElementsByTagName('img');
  const promises = [];

  for (let img of images) {
      if (!img.complete) {
          promises.push(
              new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
              })
          );
      }
  }

  await Promise.all(promises);
}

export const dataURLtoBlob = (dataUrl: string) => {
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

export function formatDateWithHyphen(dateString: string | number | Date) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
} 

export function mapDataFields(data:any, mappings:any) {
  const fieldOccurrences:any = []; // Array to store transformed records

  // Process each record in the data array
  data.forEach((record:any) => {
    const mappedRecord:any = {}; // Temporary object for each mapped record

    // Map fields according to the mappings object
    for (const key in mappings) {
      const mappedField = mappings[key]; // Get the mapped field name from mappings
      const fieldValue = record[mappedField]; // Retrieve the value from data record
      mappedRecord[key] = fieldValue; // Assign it to the mappedRecord with the new key
    }

    // Add the mapped record to the array
    fieldOccurrences.push(mappedRecord);
  });

  return fieldOccurrences; // Return the array of mapped records
}

export const cssString = (item:any) => {
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
  height: 40.523px;
  margin: 0 0 0 0;
  background: #8d1b3d;
  z-index: 1000;
}
.whatsapp-image {
  position: relative;
  width: 225.264px;
  height: 63.591px;
  margin: 10.625px 0 0 128.75px;
  background: url(/blank_certificate/redesigned_card/images/8db68740fedd899478a73a914c174d93703d7123.png)
    no-repeat center;
  background-size: cover;
  z-index: 999;
}
.apply-style {
  position: relative;
  width: 161px;
  height: 182px;
  margin: 20.262px 0 0 165.029px;
  border: 1px solid #8d1b3d;
  z-index: 994;
  overflow: hidden;
  border-radius: 30.971px;
}
.profile-photo {
  position: absolute;
  width: 597.74px;
  height: 597.74px;
  top: 50%;
  left: 50%;
  background: url("${item?.avatar}")
    no-repeat center;
  background-size: cover;
  transform: translate(-50.08%, -50.17%);
  z-index: 995;
}
.sheik-hameed-khan {
display: block;
    position: relative;
    height: 35px;
    /* margin: 17px 0 0 91.318px; */
    color: #ffffff;
    font-family: Inter, var(--default-font-family);
    font-size: 32px;
    font-weight: 600;
    padding-top: 14px;
    line-height: 35px;
    text-align: left;
    white-space: nowrap;
    z-index: 996;
    text-align: center;
}
.flex-row-b {
  position: relative;
  width: 480.159px;
  height: 210.827px;
  margin: 13.59px 0 0 32px;
  z-index: 998;
}
.nome {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 15.485px;
  position: absolute;
  width: 174px;
  height: 157px;
  top: 0;
  left: 127.251px;
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
    line-height: 33.233px;
    text-align: left;
        margin-left: 14px;

    text-overflow: initial;
    letter-spacing: -0.8px;
    z-index: 3;
    overflow: hidden;
}
.line {
  position: absolute;
  width: 423.006px;
  height: 1.548px;
  top: 37.424px;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/75eca563-7bd4-4998-aa1d-8833f2d1e1de.png)
    no-repeat center;
  background-size: cover;
  z-index: 4;
}
.qatar-id-company {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 168.536px;
  height: 128px;
  top: calc(50% - 46.59px);
  left: calc(50% - 227.96px);
  color: rgba(255, 255, 255, 0.5);
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 29px;
  text-align: left;
  letter-spacing: -0.64px;
  z-index: 5;
}
.qube-inspection {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 320.365px;
  height: 128px;
  top: 58.828px;
  left: 159.793px;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 29px;
  text-align: left;
  text-overflow: initial;
  letter-spacing: -0.64px;
  z-index: 6;
  overflow: hidden;
}
.safe-building-operator {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 260.913px;
  height: 36px;
  top: 120.827px;
  left: 159.793px;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.64px;
  z-index: 997;
}
.safety-model-operator {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 260.913px;
  height: 36px;
  top: 174.827px;
  left: 159.793px;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.64px;
  z-index: 998;
}
.line-1 {
  position: relative;
  width: 423.006px;
  height: 1.548px;
  margin: 29.391px 0 0 32px;
  background: url(/blank_certificate/redesigned_card/images/c1d8a56c-b135-45d3-8c60-feead411f79a.png)
    no-repeat center;
  background-size: cover;
  z-index: 7;
}
.flex-row-baa {
  position: relative;
  width: 403.202px;
  height: 104.348px;
  margin: 17.309px 0 0 44.093px;
  z-index: 11;
}
.vector {
  position: absolute;
  width: 104.348px;
  height: 104.348px;
  top: 0;
  left: 298.854px;
  background: url("${item?.qr_url}")
    no-repeat center;
  background-size: cover;
  z-index: 11;
}
.flex-row-db {
  position: relative;
  width: 91.699px;
  height: 22.134px;
  margin: 6.32px 0 0 6.324px;
  z-index: 981;
}
.group {
  position: absolute;
  width: 24.14%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/1324fcb2-e1c2-4f6f-b95a-2cb00a4ae9de.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 978;
}
.vector-2 {
  position: relative;
  width: 9.486px;
  height: 9.486px;
  margin: 6.328px 0 0 6.324px;
  background: url(/blank_certificate/redesigned_card/images/f38f3417-1dff-4f07-89a9-cf32ea64626a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 987;
}
.vector-3 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/bf8288c7-7c29-43bd-8594-40d2380bdbef.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 15;
}
.vector-4 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/a6624518-98da-4211-8b16-50dc2f58aa7e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 18;
}
.vector-5 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/74a0fd2e-f93a-4772-a5b5-565a217efd03.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 27;
}
.group-6 {
  position: absolute;
  width: 24.14%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/dd78f213-e0f9-4305-aaab-f73217d69a28.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 981;
}
.vector-7 {
  position: relative;
  width: 9.486px;
  height: 9.486px;
  margin: 6.328px 0 0 6.324px;
  background: url(/blank_certificate/redesigned_card/images/bbc09051-d3b4-4e38-aa9b-bb6c16ef772d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 990;
}
.regroup {
  position: absolute;
  width: 10.34%;
  height: 100%;
  top: 0;
  left: 41.38%;
  z-index: 24;
}
.vector-8 {
  position: absolute;
  width: 33.33%;
  height: 14.29%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/4bec1505-1975-4fb7-b655-4403a1d50470.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 21;
}
.vector-9 {
  position: absolute;
  width: 33.33%;
  height: 14.29%;
  top: 0;
  left: 66.67%;
  background: url(/blank_certificate/redesigned_card/images/11e42526-b4fb-46b0-a934-f2ff34a974ea.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 24;
}
.vector-a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/9732a632-aa3d-421b-90ad-b6fbd1e3a372.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 30;
}
.vector-b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/c202adb3-cdea-4b1a-8fe6-4664220992ea.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 33;
}
.vector-c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/d9350f92-4095-4c1e-90ce-fadd781ca4db.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 36;
}
.vector-d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/3faa5878-aa42-4662-9fad-4ef05a9b2cba.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 39;
}
.vector-e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/188059c3-2c25-4adc-9068-f7d557872074.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 42;
}
.vector-f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.24%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/60c75e1f-da83-465f-9769-05fd5f3d680b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 45;
}
.vector-10 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/4bf4c2c5-3c64-4dc0-ab5b-088238214a93.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 48;
}
.vector-11 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 37.93%;
  background: url(/blank_certificate/redesigned_card/images/287b3c8a-6dfc-449e-bf65-2ee595a0c0f9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 51;
}
.vector-12 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/cb3ab9f6-a9e7-4c09-90ed-cd20a041d422.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 54;
}
.vector-13 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/25cbdbaf-797e-43b5-9059-8dce04ba250d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 57;
}
.vector-14 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/f7bf0515-9324-4ae0-bc42-70194ae2edd1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 60;
}
.vector-15 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/8b15054f-43a0-41a4-bd6a-2bb6a22374a5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 63;
}
.vector-16 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.59%;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/69380de4-98fe-4b0c-94de-c708c37b0752.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 66;
}
.vector-17 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/406549a1-ea43-4666-a51b-cfea4dd4a576.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 69;
}
.vector-18 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/a3613cb2-94b3-4ff6-be1d-84301e798195.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 72;
}
.vector-19 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 44.83%;
  background: url(/blank_certificate/redesigned_card/images/af5003fd-82a6-4dbd-8b69-c67bf68f8aa5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 75;
}
.vector-1a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/65c79dbd-b0a5-42cd-a455-002b60faf306.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 78;
}
.vector-1b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/a7feb8f3-0294-4fbd-a16e-5363e74ed1fd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 81;
}
.vector-1c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.85%;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/6c9ed1ed-bf15-45c2-934f-9de531c31bbb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 84;
}
.vector-1d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/6e787f0d-81aa-4a5b-b988-a9391dcc6840.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 87;
}
.vector-1e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/242df8df-fcd4-435f-b4a7-4b766f905e88.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 90;
}
.vector-1f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/988d6ebf-f94a-44bb-9d31-d4b5591c0f08.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 93;
}
.vector-20 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/c82a41bf-fe29-4250-988b-405340b3b822.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 96;
}
.vector-21 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 27.59%;
  background: url(/blank_certificate/redesigned_card/images/6f20b627-7ee3-449a-8167-8dc933500fa8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 99;
}
.vector-22 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/0558eac1-cd28-4612-9a16-e1c2ef6625aa.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 102;
}
.vector-23 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/343df007-c7e1-4b6e-859b-0f555685e184.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 105;
}
.vector-24 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/05d7753f-4e0e-4e6c-af9f-0c6efeb9a78e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 108;
}
.vector-25 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/77db7491-9462-41eb-a977-f74def5d3fa7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 111;
}
.vector-26 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/429a9edc-097f-47fc-af94-155c0f1abf59.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 114;
}
.vector-27 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.4%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/ad5ec35c-f470-49cc-b2fc-7abbc4f71be2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 117;
}
.vector-28 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 27.59%;
  background: url(/blank_certificate/redesigned_card/images/251f3c5f-a3a1-4f98-983f-d87544f693e8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 120;
}
.vector-29 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/8a441232-0164-44e6-b8b3-eefe05ddb56c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 123;
}
.vector-2a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/a3ed5198-792a-4b71-b6da-0a2511c5f98d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 126;
}
.vector-2b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/ad162c0d-cb4f-4c26-9cf8-df4dc386127d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 129;
}
.vector-2c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/12a885a0-06e7-4cb4-9434-825f13642694.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 132;
}
.vector-2d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/0eb6113d-fbca-4528-b328-e1d4cf168e4d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 135;
}
.vector-2e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 85.7%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/baa73462-50ca-4bf0-8e35-3f9200601ba9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 138;
}
.flex-row-ba {
  position: relative;
  width: 25.296px;
  height: 3.162px;
  margin: -0.01px 0 0 44.269px;
  z-index: 159;
}
.vector-2f {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/d6cef39e-0eea-4ec0-9c13-0233372cd7f7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 141;
}
.vector-30 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 12.5%;
  background: url(/blank_certificate/redesigned_card/images/80057843-e8d3-49bd-9634-f544bac17cf1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 144;
}
.vector-31 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 37.5%;
  background: url(/blank_certificate/redesigned_card/images/2ab63587-28fe-4d96-a78b-9699402b6710.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 147;
}
.vector-32 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/redesigned_card/images/817c20fd-503b-471d-b634-2f6d15287011.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 150;
}
.vector-33 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 62.5%;
  background: url(/blank_certificate/redesigned_card/images/aa833826-a5ea-4aa2-8da3-a682bbc9251d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 153;
}
.vector-34 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/redesigned_card/images/59af30cd-c88e-4860-a117-d33dd1f2043e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 156;
}
.vector-35 {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  left: 87.5%;
  background: url(/blank_certificate/redesigned_card/images/43d664c6-8919-44c8-bc52-ca5a190e4c2a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 159;
}
.flex-row-cc {
  position: relative;
  width: 75.889px;
  height: 3.162px;
  margin: 0.01px 0 0 6.324px;
  z-index: 195;
}
.vector-36 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/f195c6b3-ead9-4dd8-866e-9bd12a38cf67.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 162;
}
.vector-37 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 12.5%;
  background: url(/blank_certificate/redesigned_card/images/bc138a05-92ce-4acc-9e99-7b05d1782692.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 165;
}
.vector-38 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 20.83%;
  background: url(/blank_certificate/redesigned_card/images/1f8ab133-4400-4210-8c0d-6dc03fafe8bb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 168;
}
.vector-39 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 25%;
  background: url(/blank_certificate/redesigned_card/images/b8885e80-fe01-42f4-a48d-94f490797704.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 171;
}
.vector-3a {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 45.83%;
  background: url(/blank_certificate/redesigned_card/images/c2b86729-01a1-49f3-a824-166a130be246.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 180;
}
.vector-3b {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 58.33%;
  background: url(/blank_certificate/redesigned_card/images/4ac25e02-5f7d-4119-8db8-f368994dd30f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 183;
}
.vector-3c {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 66.67%;
  background: url(/blank_certificate/redesigned_card/images/fd1bc2a8-280d-4fa7-b156-0c9cfb2948b4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 186;
}
.vector-3d {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 83.33%;
  background: url(/blank_certificate/redesigned_card/images/cf61ab25-5e05-4169-9365-40f9916787f2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 189;
}
.vector-3e {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 87.5%;
  background: url(/blank_certificate/redesigned_card/images/f3b8fdc0-bfdc-4a63-af7b-dbbae8f8942d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 192;
}
.vector-3f {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 95.83%;
  background: url(/blank_certificate/redesigned_card/images/76a01584-4ede-4046-8e80-063437dc1d17.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 195;
}
.regroup-40 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 8.33%;
  height: 100%;
  top: 0;
  left: 33.33%;
  z-index: 177;
}
.vector-41 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/76d5c58a-a63c-4a7c-bc77-e0f4b826f842.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 174;
}
.vector-42 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/b9dec9f8-685f-4a4d-a0e2-b5cd9cc75978.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 177;
}
.flex-row-cc-43 {
  position: relative;
  width: 88.538px;
  height: 3.162px;
  margin: 0px 0 0 9.486px;
  z-index: 246;
}
.vector-44 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/ceb04065-6f29-448e-9b8f-e627d3a22896.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 198;
}
.vector-45 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 3.57%;
  background: url(/blank_certificate/redesigned_card/images/8ff36b16-dd87-4fce-94d7-b1ff25d4dcee.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 201;
}
.vector-46 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 7.14%;
  background: url(/blank_certificate/redesigned_card/images/284f86ac-6b33-42ad-8577-cd60d8a31f20.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 204;
}
.vector-47 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 21.43%;
  background: url(/blank_certificate/redesigned_card/images/f9c29809-56fa-4e45-bebc-589751fc9e12.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 207;
}
.vector-48 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 25%;
  background: url(/blank_certificate/redesigned_card/images/d8b2e717-f07b-4c56-b641-d03c6f410445.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 210;
}
.vector-49 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 28.57%;
  background: url(/blank_certificate/redesigned_card/images/9a1dae60-c365-4a59-880e-15d1761129b0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 213;
}
.vector-4a {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/redesigned_card/images/2271db85-9824-4e6a-84c6-72a5b8d26c19.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 222;
}
.vector-4b {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 53.57%;
  background: url(/blank_certificate/redesigned_card/images/879097a9-d5bb-4256-9dba-d8fec146be08.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 225;
}
.vector-4c {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 57.14%;
  background: url(/blank_certificate/redesigned_card/images/90144646-866f-40e7-824b-f9459bee4cf5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 228;
}
.vector-4d {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 60.71%;
  background: url(/blank_certificate/redesigned_card/images/cdc0cbab-6f7f-48dd-b624-d30537a2cf1c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 231;
}
.vector-4e {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 67.86%;
  background: url(/blank_certificate/redesigned_card/images/defd683d-0ef7-4934-a205-b3b5aa876070.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 234;
}
.vector-4f {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 71.43%;
  background: url(/blank_certificate/redesigned_card/images/78971a0e-b6c9-48e2-a343-f88e1e9adfd1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 237;
}
.vector-50 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/redesigned_card/images/c45c9206-21a5-44a2-8ab3-387a54d5e999.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 240;
}
.vector-51 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 85.71%;
  background: url(/blank_certificate/redesigned_card/images/fc002106-af74-42d4-be5c-4bd2c560fe63.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 243;
}
.vector-52 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 96.43%;
  background: url(/blank_certificate/redesigned_card/images/530778ef-2ca4-4f35-a5d0-666fc20ec973.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 246;
}
.regroup-53 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 10.71%;
  height: 100%;
  top: 0;
  left: 35.71%;
  z-index: 219;
}
.vector-54 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/15545254-2629-4729-aa71-95c283ede3c3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 216;
}
.vector-55 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/8ffdaa6a-164c-4b97-aaca-be38c43132ef.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 219;
}
.flex-row-dc {
  position: relative;
  width: 82.213px;
  height: 3.162px;
  margin: 0px 0 0 12.648px;
  z-index: 285;
}
.vector-56 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/ad0f2d8f-dfa5-4e0c-a0af-0453ae3c4d89.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 249;
}
.vector-57 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 15.38%;
  background: url(/blank_certificate/redesigned_card/images/a09a7e25-0b05-4009-a7c6-93f41b839127.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 252;
}
.vector-58 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 19.23%;
  background: url(/blank_certificate/redesigned_card/images/c9fc7a51-4977-4b8f-a659-257128308545.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 255;
}
.vector-59 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 34.62%;
  background: url(/blank_certificate/redesigned_card/images/b9d6ff9f-e3a8-4b3b-af5e-8076999a6681.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 258;
}
.vector-5a {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 38.46%;
  background: url(/blank_certificate/redesigned_card/images/02cfc15a-2b39-4184-9694-6d35303f9733.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 261;
}
.vector-5b {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 42.31%;
  background: url(/blank_certificate/redesigned_card/images/792b3108-6553-4be5-af1c-0b1ae392656d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 264;
}
.vector-5c {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 46.15%;
  background: url(/blank_certificate/redesigned_card/images/5328e10f-de7c-40e8-9084-d02b497ff1f9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 267;
}
.vector-5d {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/redesigned_card/images/e9e3b66c-dc00-423e-a3f2-5f47fdea898d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 270;
}
.vector-5e {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 88.46%;
  background: url(/blank_certificate/redesigned_card/images/deda04f1-0fac-44f7-b94c-a7c1222aba39.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 279;
}
.vector-5f {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 92.31%;
  background: url(/blank_certificate/redesigned_card/images/1d672a5d-d279-4d31-b74a-0a36ea084db0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 282;
}
.vector-60 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 96.15%;
  background: url(/blank_certificate/redesigned_card/images/43551943-85f5-4331-84a0-10f30f3983fb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 285;
}
.regroup-61 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 11.54%;
  height: 100%;
  top: 0;
  left: 65.38%;
  z-index: 276;
}
.vector-62 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/b0653522-253b-4df1-aadb-a89b025a181d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 273;
}
.vector-63 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/bf3321d5-6c39-48f6-8bcb-e50626a54a37.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 276;
}
.flex-row-dc-64 {
  position: relative;
  width: 88.538px;
  height: 3.162px;
  margin: 0.01px 0 0 6.324px;
  z-index: 333;
}
.vector-65 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/c7ce5dcf-2064-4683-a0fa-1272d51c93c9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 288;
}
.vector-66 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 3.57%;
  background: url(/blank_certificate/redesigned_card/images/c5f47070-a33a-4643-8277-32978f558b72.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 291;
}
.vector-67 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 7.14%;
  background: url(/blank_certificate/redesigned_card/images/1331e50a-0780-4320-83b2-ce98bff3282e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 294;
}
.vector-68 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 10.71%;
  background: url(/blank_certificate/redesigned_card/images/7cc5472c-3cf6-45fd-aaa5-ae8cb78a2b91.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 297;
}
.vector-69 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 14.29%;
  background: url(/blank_certificate/redesigned_card/images/bf5f4883-048a-4ecd-a5aa-0b0547f3764e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 300;
}
.vector-6a {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 17.86%;
  background: url(/blank_certificate/redesigned_card/images/261e793f-6097-4d60-a714-7120fa3438f4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 303;
}
.vector-6b {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 42.86%;
  background: url(/blank_certificate/redesigned_card/images/92c340af-f95b-485a-8b01-4d38925a2b3c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 306;
}
.vector-6c {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 46.43%;
  background: url(/blank_certificate/redesigned_card/images/0d655da0-7736-416e-882f-0e73f902c85e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 309;
}
.vector-6d {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 57.14%;
  background: url(/blank_certificate/redesigned_card/images/5b3cada8-3040-4123-8909-a68e296e274d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 312;
}
.vector-6e {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 67.86%;
  background: url(/blank_certificate/redesigned_card/images/1a645c90-04a2-455b-84cf-f9583b0ebfdf.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 315;
}
.vector-6f {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 71.43%;
  background: url(/blank_certificate/redesigned_card/images/ee653558-a461-431d-a54e-65bff62fa42d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 318;
}
.vector-70 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 75%;
  background: url(/blank_certificate/redesigned_card/images/35407a57-6e43-4a54-8ed2-cc4b7eeea6bd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 321;
}
.vector-71 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 82.14%;
  background: url(/blank_certificate/redesigned_card/images/32a8b698-0366-44b7-ade4-87067c5fb17b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 324;
}
.vector-72 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 85.71%;
  background: url(/blank_certificate/redesigned_card/images/a9a47147-60a9-4fe7-83c7-ca23c6ba73ad.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 327;
}
.regroup-73 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 7.14%;
  height: 100%;
  top: 0;
  left: 92.86%;
  z-index: 333;
}
.vector-74 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/9185dcba-22c0-45ea-b3e0-3e585e889ec7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 330;
}
.vector-75 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/3805bf25-038c-4b8e-a770-5f4373077d4d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 333;
}
.flex-row-a {
  position: relative;
  width: 91.7px;
  height: 3.162px;
  margin: 0px 0 0 6.324px;
  z-index: 384;
}
.vector-76 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/e3d4d343-ac1b-43c5-adf7-c08fa3d55bfe.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 336;
}
.vector-77 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 6.9%;
  background: url(/blank_certificate/redesigned_card/images/fef32f31-4bb3-41d0-b58f-d548542ffd74.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 339;
}
.vector-78 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 17.24%;
  background: url(/blank_certificate/redesigned_card/images/bfa4f861-1b31-46bd-8662-39ea0fe95988.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 342;
}
.vector-79 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 20.69%;
  background: url(/blank_certificate/redesigned_card/images/fce1782b-7651-4f23-9e0f-9d7596bd075d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 345;
}
.vector-7a {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 24.14%;
  background: url(/blank_certificate/redesigned_card/images/b5ec71c7-7f7e-4438-8b35-adb8ed9854af.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 348;
}
.vector-7b {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 27.59%;
  background: url(/blank_certificate/redesigned_card/images/c52c3e31-24cf-40f8-9d0f-a2903cb95a6a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 351;
}
.vector-7c {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/17dd6cf6-66c8-4304-b68e-4b9c45b88bf2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 354;
}
.vector-7d {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/9cfa1914-19c4-440b-9077-b78117c4b322.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 357;
}
.vector-7e {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/e4dd0207-e422-4790-ad39-81964945e863.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 360;
}
.vector-7f {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/08636238-15f3-40f6-965f-0607d2ae7449.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 363;
}
.vector-80 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/95705f83-e374-49e6-84ab-7010b5567f7a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 366;
}
.vector-81 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/4865a047-4ff8-47b9-9e95-b06ea616acd8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 369;
}
.vector-82 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 72.41%;
  background: url(/blank_certificate/redesigned_card/images/5774b65e-db2f-48e6-81d7-f9fede48546c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 372;
}
.vector-83 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/ad640670-af4d-4b1d-9e3c-f2b30cb415e4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 375;
}
.vector-84 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 86.21%;
  background: url(/blank_certificate/redesigned_card/images/c996d23e-e09b-41eb-bc5c-763c5ec74459.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 378;
}
.regroup-85 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 6.9%;
  height: 100%;
  top: 0;
  left: 93.1%;
  z-index: 384;
}
.vector-86 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/c453c7d6-d96d-425c-a4bd-25b7ee9ebd4d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 381;
}
.vector-87 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/1a843645-0125-434c-98be-54dd908e542f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 384;
}
.flex-row-aac {
  position: relative;
  width: 75.889px;
  height: 3.162px;
  margin: -0.01px 0 0 6.324px;
  z-index: 423;
}
.vector-88 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/31d18ffe-f2b9-45fe-bb64-a54c51651299.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 387;
}
.vector-89 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 4.17%;
  background: url(/blank_certificate/redesigned_card/images/a27db8ae-d04c-4f9f-a0ae-e6ca0282e496.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 390;
}
.vector-8a {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 8.33%;
  background: url(/blank_certificate/redesigned_card/images/8776538f-4317-484a-a24e-08a21835a081.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 393;
}
.vector-8b {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 45.83%;
  background: url(/blank_certificate/redesigned_card/images/97c325d7-8de8-47c6-a70f-fefbb0477457.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 396;
}
.vector-8c {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/redesigned_card/images/281a7979-b618-4245-bbed-7d9b56b84121.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 399;
}
.vector-8d {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 54.17%;
  background: url(/blank_certificate/redesigned_card/images/dcac59d6-b834-4578-a1e1-2214613f0091.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 402;
}
.vector-8e {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 58.33%;
  background: url(/blank_certificate/redesigned_card/images/77986acf-87b4-4b81-804f-16f37ca77354.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 405;
}
.vector-8f {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 62.5%;
  background: url(/blank_certificate/redesigned_card/images/630fff33-2304-408a-a8b5-6f93c64b232c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 408;
}
.vector-90 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 66.67%;
  background: url(/blank_certificate/redesigned_card/images/98929f10-9f69-462a-99dd-a26efba2b4ec.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 411;
}
.vector-91 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 79.17%;
  background: url(/blank_certificate/redesigned_card/images/fd676ac9-7c43-4356-a39a-4c35ad68dd3c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 414;
}
.vector-92 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 83.33%;
  background: url(/blank_certificate/redesigned_card/images/645d08b0-d177-4ba5-9ca0-6c15b333f552.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 417;
}
.vector-93 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 87.5%;
  background: url(/blank_certificate/redesigned_card/images/a69b89b7-cbe7-4534-91d0-17c1d05bc653.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 420;
}
.vector-94 {
  position: absolute;
  width: 4.17%;
  height: 100%;
  top: 0;
  left: 95.83%;
  background: url(/blank_certificate/redesigned_card/images/6893746d-4ba7-43f2-90ff-46e579109004.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 423;
}
.flex-row-c {
  position: relative;
  width: 91.7px;
  height: 3.162px;
  margin: 0px 0 0 6.324px;
  z-index: 468;
}
.vector-95 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/de2af5ef-7c94-44ea-bbf6-6884074940c0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 426;
}
.vector-96 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 10.34%;
  background: url(/blank_certificate/redesigned_card/images/5dead084-cc95-4632-ab72-05797dd86806.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 429;
}
.vector-97 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 17.24%;
  background: url(/blank_certificate/redesigned_card/images/a4a0c16d-2a56-45c8-ab31-f71292b0b39c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 432;
}
.vector-98 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 20.69%;
  background: url(/blank_certificate/redesigned_card/images/22e3c5ab-220c-41ea-9c67-4360ce1bc050.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 435;
}
.vector-99 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 27.59%;
  background: url(/blank_certificate/redesigned_card/images/7d940fc7-b670-4db4-ae87-2d6be0a297c6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 438;
}
.vector-9a {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/6a73b37f-5414-42ce-a396-1c29685a7852.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 441;
}
.vector-9b {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/93d8ac29-85ea-44f8-8af7-f914fe6accbf.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 450;
}
.vector-9c {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 72.41%;
  background: url(/blank_certificate/redesigned_card/images/f43dc344-2b96-4515-9687-f21c2db93ed5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 453;
}
.vector-9d {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/c4138e1d-e0ac-4862-bcac-9deef94bc12c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 456;
}
.vector-9e {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 86.21%;
  background: url(/blank_certificate/redesigned_card/images/8e249a97-6e01-4e15-8746-3beca24f4bb3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 459;
}
.vector-9f {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 89.66%;
  background: url(/blank_certificate/redesigned_card/images/4f994bd2-0a36-4ff1-8e6f-928d5b5c7532.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 462;
}
.vector-a0 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 93.1%;
  background: url(/blank_certificate/redesigned_card/images/5f6799df-dc06-40a0-a8be-7d21a75f436c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 465;
}
.vector-a1 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 96.55%;
  background: url(/blank_certificate/redesigned_card/images/1d78e8ff-08e1-449b-8553-b4e9437c101f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 468;
}
.regroup-a2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 6.9%;
  height: 100%;
  top: 0;
  left: 44.83%;
  z-index: 447;
}
.vector-a3 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/91d255cd-bd34-4d08-9ce7-f0301ff50a51.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 444;
}
.vector-a4 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/a3a0ad79-5377-4157-af4c-010b44a7ff28.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 447;
}
.flex-row-cc-a5 {
  position: relative;
  width: 88.538px;
  height: 3.162px;
  margin: 0px 0 0 6.324px;
  z-index: 489;
}
.vector-a6 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/a69f4fee-c91a-4d26-ad1c-9a191e34ea5f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 471;
}
.vector-a7 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 28.57%;
  background: url(/blank_certificate/redesigned_card/images/dfa49ffd-0cf9-42af-86b0-802f7709ce9f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 474;
}
.vector-a8 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 39.29%;
  background: url(/blank_certificate/redesigned_card/images/7c72e8d2-bb7f-4275-93ae-2a628a00f218.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 477;
}
.vector-a9 {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 53.57%;
  background: url(/blank_certificate/redesigned_card/images/3eeb89bd-e2c4-4ff5-8633-66a91c159a8c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 480;
}
.vector-aa {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 60.71%;
  background: url(/blank_certificate/redesigned_card/images/1ff9ab35-6128-4f8e-9611-3033624ed9d8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 483;
}
.vector-ab {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 89.29%;
  background: url(/blank_certificate/redesigned_card/images/7920ba95-0077-43e9-be4e-2b8509d949b3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 486;
}
.vector-ac {
  position: absolute;
  width: 3.57%;
  height: 100%;
  top: 0;
  left: 96.43%;
  background: url(/blank_certificate/redesigned_card/images/a94322d9-6482-4a7f-a690-16e437faa8a8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 489;
}
.flex-row-b-ad {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 79.051px;
  height: 3.162px;
  margin: -0.01px 0 0 15.811px;
  z-index: 528;
}
.vector-ae {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/1d1c3a17-b216-4acd-8bb0-05ad7851b178.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 492;
}
.vector-af {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/49d4c5b2-1463-49c3-b731-698d85eba2d4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 495;
}
.vector-b0 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/36caee39-450d-41eb-99ac-705a06523dab.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 498;
}
.vector-b1 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/45cec9ff-8e02-4845-8479-b453d939af28.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 501;
}
.vector-b2 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/d2773e41-73c3-4d83-8ac0-5dae4c94f1d5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 504;
}
.vector-b3 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/3019733f-b08f-47e5-9050-2b4dff1be57a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 507;
}
.vector-b4 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/d776c432-2f38-44ee-bb99-751d5bdf941d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 510;
}
.vector-b5 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/b0e4f31b-ea95-4ce6-ad56-798a5d6119cd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 513;
}
.vector-b6 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/fdd105dc-0154-40c9-827b-67927508da6a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 516;
}
.vector-b7 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/b1aedef1-7a2a-48c3-b55c-301685e751fd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 519;
}
.vector-b8 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/9fc1b2a4-a4e9-4e03-b95c-f43332630366.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 522;
}
.vector-b9 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/c50455f7-f0a3-4078-bce4-c8d3e4428b2e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 525;
}
.vector-ba {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/49fd447f-cd78-4971-997c-f05567e997d8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 528;
}
.flex-row-faf {
  position: relative;
  width: 85.375px;
  height: 3.162px;
  margin: 0.01px 0 0 12.648px;
  z-index: 573;
}
.vector-bb {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/baa80112-0b4b-450b-8fa0-b2a9c259d02d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 531;
}
.vector-bc {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 3.7%;
  background: url(/blank_certificate/redesigned_card/images/2cddb6a0-e221-406a-bec0-db23af44eeca.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 534;
}
.vector-bd {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 7.41%;
  background: url(/blank_certificate/redesigned_card/images/32c756a2-8763-4202-9e37-489694ea6ba4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 537;
}
.vector-be {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 22.22%;
  background: url(/blank_certificate/redesigned_card/images/0bfc5cbe-9d06-4e32-a3ae-3a916f6aba39.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 540;
}
.vector-bf {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 29.63%;
  background: url(/blank_certificate/redesigned_card/images/8eefaa84-5eea-46ae-a9ae-837c171ee894.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 543;
}
.vector-c0 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 33.33%;
  background: url(/blank_certificate/redesigned_card/images/48349575-b748-4650-b56c-58b659de6cbb.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 546;
}
.vector-c1 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 37.04%;
  background: url(/blank_certificate/redesigned_card/images/2530fa6a-d1d6-4bea-9f59-2617bc855b3b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 549;
}
.vector-c2 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 40.74%;
  background: url(/blank_certificate/redesigned_card/images/18bfdf24-5812-4d0c-b231-327dd763b750.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 552;
}
.vector-c3 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 44.44%;
  background: url(/blank_certificate/redesigned_card/images/7ac19e03-efc5-4966-9630-3e581ec71657.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 555;
}
.vector-c4 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 48.15%;
  background: url(/blank_certificate/redesigned_card/images/72ad10a3-0af1-4e28-982b-d8fc69b6324e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 558;
}
.vector-c5 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 51.85%;
  background: url(/blank_certificate/redesigned_card/images/836d40bc-b1cf-4630-9de3-b08647c9f8c8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 561;
}
.vector-c6 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 85.18%;
  background: url(/blank_certificate/redesigned_card/images/9e4627b5-2167-4dba-ab73-e42465ffe387.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 570;
}
.vector-c7 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 96.3%;
  background: url(/blank_certificate/redesigned_card/images/5eb6b3a9-3ffb-4ca2-b351-3e318e7eef4e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 573;
}
.regroup-c8 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 7.41%;
  height: 100%;
  top: 0;
  left: 74.07%;
  z-index: 567;
}
.vector-c9 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/934aeecb-804d-47fe-be7d-8c819f22d36d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 564;
}
.vector-ca {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/c62d7397-219b-4e01-8c8c-58d8cbeb162b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 567;
}
.flex-row-ca {
  position: relative;
  width: 91.7px;
  height: 3.162px;
  margin: -0.01px 0 0 6.324px;
  z-index: 618;
}
.vector-cb {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/f80ea1fc-e8dc-4b85-b688-058ffd3c6bd3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 576;
}
.vector-cc {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 10.34%;
  background: url(/blank_certificate/redesigned_card/images/cd34dfed-6847-40ba-9733-98064db8ed47.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 579;
}
.vector-cd {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 13.79%;
  background: url(/blank_certificate/redesigned_card/images/2d36d3b0-d398-4bc1-9028-f22da82905df.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 582;
}
.vector-ce {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 20.69%;
  background: url(/blank_certificate/redesigned_card/images/45dcb59a-576a-490d-b6df-4548450f4a67.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 585;
}
.vector-cf {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/d5a7bdda-9cf8-4681-ab4f-ed211062dd40.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 588;
}
.vector-d0 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/b7ed94a0-9bb4-4d64-9891-df6bbbbbf4ca.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 591;
}
.vector-d1 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/59f7d154-fd2a-45ec-8d6d-65d3f9c64eec.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 594;
}
.vector-d2 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/019eab76-eb32-4bfa-9422-b037f4e33f90.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 597;
}
.vector-d3 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/45364f39-e7cd-4619-9d68-b01e1bc44c5a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 600;
}
.vector-d4 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/932124a5-283b-4e7f-aa89-6a4c71698ea8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 603;
}
.vector-d5 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/d368fabb-0e2a-4775-b487-4fb0443a346a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 606;
}
.vector-d6 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/efe1d820-e7fb-436f-a7d8-1375e258f1fa.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 609;
}
.vector-d7 {
  position: absolute;
  width: 3.45%;
  height: 100%;
  top: 0;
  left: 79.31%;
  background: url(/blank_certificate/redesigned_card/images/9cd1eb21-4fd3-4c82-a58e-660685daeda9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 612;
}
.regroup-d8 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 6.9%;
  height: 100%;
  top: 0;
  left: 93.1%;
  z-index: 618;
}
.vector-d9 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/0a242d50-4ae8-4044-a81b-9977ae189a0c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 615;
}
.vector-da {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/70d19fe5-c8f6-43dc-88c5-3c53223d2d2f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 618;
}
.flex-row-cf {
  position: relative;
  width: 82.213px;
  height: 3.162px;
  margin: -0.01px 0 0 15.811px;
  z-index: 663;
}
.vector-db {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/7b3fcb5e-d3ac-44e7-9c79-0e0caeac2d20.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 621;
}
.vector-dc {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 3.85%;
  background: url(/blank_certificate/redesigned_card/images/e3c0f4b7-2766-4d36-8ee4-85f99865f1a9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 624;
}
.vector-dd {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 7.69%;
  background: url(/blank_certificate/redesigned_card/images/07ab4ed0-88df-418b-aaa6-1effb1e86bd8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 627;
}
.vector-de {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 15.38%;
  background: url(/blank_certificate/redesigned_card/images/672bc849-1915-4f29-8a00-d1b2b420ed12.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 630;
}
.vector-df {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 19.23%;
  background: url(/blank_certificate/redesigned_card/images/25c2eeb0-b6b7-4016-b66c-8063793ac8c5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 633;
}
.vector-e0 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 23.08%;
  background: url(/blank_certificate/redesigned_card/images/ed74c7ad-ad95-4b4c-b8e5-a0bba3f07873.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 636;
}
.vector-e1 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 26.92%;
  background: url(/blank_certificate/redesigned_card/images/eb9c6aca-12fb-4ee4-aece-5fdd6980786d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 639;
}
.vector-e2 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 34.62%;
  background: url(/blank_certificate/redesigned_card/images/c4999bd4-e93c-4e09-9fef-a79a0f0d2756.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 642;
}
.vector-e3 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 42.31%;
  background: url(/blank_certificate/redesigned_card/images/f1e0d890-90f6-4e33-8103-d8a28e8e3756.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 645;
}
.vector-e4 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 53.85%;
  background: url(/blank_certificate/redesigned_card/images/d5f4362a-d27c-488d-9404-67136ae565c7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 648;
}
.vector-e5 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 57.69%;
  background: url(/blank_certificate/redesigned_card/images/c3073d9b-2da7-4968-87a2-87f128931ac8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 651;
}
.vector-e6 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 61.54%;
  background: url(/blank_certificate/redesigned_card/images/696c8d1f-ccf3-46ac-8ea9-83d878a5203e.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 654;
}
.vector-e7 {
  position: absolute;
  width: 3.85%;
  height: 100%;
  top: 0;
  left: 65.38%;
  background: url(/blank_certificate/redesigned_card/images/0a12ae2c-a7b8-4cac-966f-86c64f58b5a8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 657;
}
.regroup-e8 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 7.69%;
  height: 100%;
  top: 0;
  left: 92.31%;
  z-index: 663;
}
.vector-e9 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/002d1b93-7a50-4232-80cb-c0ac07437c01.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 660;
}
.vector-ea {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/501d8023-0570-4607-bc35-ba5d1bb26b5a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 663;
}
.flex-row {
  position: relative;
  width: 85.375px;
  height: 3.162px;
  margin: 0.01px 0 0 6.324px;
  z-index: 708;
}
.vector-eb {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/192d2cfc-32bd-4904-98aa-47aae18fbb24.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 666;
}
.vector-ec {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 7.41%;
  background: url(/blank_certificate/redesigned_card/images/dfa52791-21fb-441b-a405-f6450090dd9d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 669;
}
.vector-ed {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 14.82%;
  background: url(/blank_certificate/redesigned_card/images/2c7a95ab-783e-43cd-91ed-332db90d26dc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 672;
}
.vector-ee {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 22.22%;
  background: url(/blank_certificate/redesigned_card/images/4724b4f3-9668-4369-aaca-85a20ee7a4b5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 675;
}
.vector-ef {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 29.63%;
  background: url(/blank_certificate/redesigned_card/images/94ffa33d-45c9-4b6b-8255-c1572b02947f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 678;
}
.vector-f0 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 55.56%;
  background: url(/blank_certificate/redesigned_card/images/82ce454e-c807-42f6-9968-38929e505a00.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 687;
}
.vector-f1 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 70.37%;
  background: url(/blank_certificate/redesigned_card/images/b1e8c87e-97e2-48f3-b2d1-6c4fecdce0f1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 690;
}
.vector-f2 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 74.07%;
  background: url(/blank_certificate/redesigned_card/images/e566df1b-7f12-4a86-8541-8ac329501455.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 693;
}
.vector-f3 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 77.78%;
  background: url(/blank_certificate/redesigned_card/images/63d85413-d017-459b-911d-b57e705d6bbf.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 696;
}
.vector-f4 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 81.48%;
  background: url(/blank_certificate/redesigned_card/images/8c9c34ff-f048-4e2a-8e25-c0140fe2fee2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 699;
}
.vector-f5 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 85.18%;
  background: url(/blank_certificate/redesigned_card/images/91316df6-e1df-4df1-8789-f795e46a3f27.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 702;
}
.vector-f6 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 88.89%;
  background: url(/blank_certificate/redesigned_card/images/1f91728a-9167-4d36-bdd3-4d3629871d92.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 705;
}
.vector-f7 {
  position: absolute;
  width: 3.7%;
  height: 100%;
  top: 0;
  left: 96.3%;
  background: url(/blank_certificate/redesigned_card/images/3aadf468-ddd6-4118-8d82-c6067376f09c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 708;
}
.regroup-f8 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 7.41%;
  height: 100%;
  top: 0;
  left: 40.74%;
  z-index: 684;
}
.vector-f9 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/0f2413af-b8b1-4ae2-8391-c585cb22a8e8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 681;
}
.vector-fa {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/d7d31485-22f0-4c7f-ae3f-7ee566eebbb2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 684;
}
.flex-row-e {
  position: relative;
  width: 66.403px;
  height: 3.162px;
  margin: 0.01px 0 0 31.621px;
  z-index: 741;
}
.vector-fb {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/153169c0-6cee-4fe4-b951-0275c0a00183.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 711;
}
.vector-fc {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 9.52%;
  background: url(/blank_certificate/redesigned_card/images/e2c36795-2fd7-4e94-bf3a-adbee900cc34.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 714;
}
.vector-fd {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 14.29%;
  background: url(/blank_certificate/redesigned_card/images/65b1698f-71d6-4073-a081-f6e7e447b55f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 717;
}
.vector-fe {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 28.57%;
  background: url(/blank_certificate/redesigned_card/images/f7f171a5-8b99-44d6-94be-1cd46906fa08.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 720;
}
.vector-ff {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 33.33%;
  background: url(/blank_certificate/redesigned_card/images/1a80c289-9d22-4cd7-b601-0cbfb1010454.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 723;
}
.vector-100 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 76.19%;
  background: url(/blank_certificate/redesigned_card/images/f8e790fa-669c-44d1-afe3-964c5567acb1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 732;
}
.vector-101 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 85.71%;
  background: url(/blank_certificate/redesigned_card/images/9a65a275-5803-4808-9ec7-9ce846a49f22.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 735;
}
.vector-102 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 90.48%;
  background: url(/blank_certificate/redesigned_card/images/723928df-7816-4f47-a5e9-b258dc0f3edd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 738;
}
.vector-103 {
  position: absolute;
  width: 4.76%;
  height: 100%;
  top: 0;
  left: 95.24%;
  background: url(/blank_certificate/redesigned_card/images/090430fa-47aa-4f46-bac4-637c5b323137.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 741;
}
.regroup-104 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 9.52%;
  height: 100%;
  top: 0;
  left: 52.38%;
  z-index: 729;
}
.vector-105 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/91d1bec5-268c-44b2-9da4-4435238d4c3f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 726;
}
.vector-106 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/89b06077-6362-4550-9dc0-d9fbe73a20e4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 729;
}
.flex-row-baa-107 {
  position: relative;
  width: 91.7px;
  height: 22.134px;
  margin: 0px 0 0 6.324px;
  z-index: 984;
}
.group-108 {
  position: absolute;
  width: 24.14%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/4f481a17-66b4-4edc-9e24-2e917015a4fe.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 984;
}
.vector-109 {
  position: relative;
  width: 9.486px;
  height: 9.486px;
  margin: 6.32px 0 0 6.324px;
  background: url(/blank_certificate/redesigned_card/images/df84c8ac-5ae8-4bbf-9976-28ca4cf49979.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 993;
}
.vector-10a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/be85b427-4d81-4bcc-a3a2-2b358173e6bc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 744;
}
.vector-10b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/4c24f4dc-df54-45f3-9189-277a1f4b3057.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 747;
}
.vector-10c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/574b37fe-93cb-4a65-bb15-8ab82b3f5f5a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 750;
}
.vector-10d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/443658ea-e923-4823-8cfd-246ef5672ef6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 753;
}
.vector-10e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/0c13ff42-d8da-4aee-944a-6755c768d423.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 756;
}
.vector-10f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/b66787aa-bbe4-413d-8c4b-485ba10976b0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 759;
}
.vector-110 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 82.76%;
  background: url(/blank_certificate/redesigned_card/images/a27e835b-9cfe-4ca7-bca0-e44423fc03d0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 762;
}
.vector-111 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 0;
  left: 93.1%;
  background: url(/blank_certificate/redesigned_card/images/b060d59a-1baf-4428-b65e-233d6e05b9ae.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 765;
}
.vector-112 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 27.59%;
  background: url(/blank_certificate/redesigned_card/images/623472d2-a871-4dc9-bbc3-7bdb3478b4d0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 768;
}
.vector-113 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/f267f7af-1b68-4712-9674-66aaba1db1e4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 771;
}
.vector-114 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 37.93%;
  background: url(/blank_certificate/redesigned_card/images/132f88d0-a916-4bc3-8878-5724f1d9e7e3.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 774;
}
.vector-115 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/73cfbca1-e58e-402c-bec6-c691346c46df.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 777;
}
.vector-116 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/970e5603-c119-451d-9eda-717b782f1c39.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 780;
}
.vector-117 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/49ad3210-0a91-4f6b-9657-f1ae7a343371.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 783;
}
.vector-118 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/b81e1183-ade6-4e89-952f-f833c9674c2f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 786;
}
.vector-119 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/936058b0-d390-4113-a610-e5d06faad030.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 789;
}
.vector-11a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 82.76%;
  background: url(/blank_certificate/redesigned_card/images/aee2b8a8-da5a-4854-98ae-021b4e1f122d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 792;
}
.vector-11b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 86.21%;
  background: url(/blank_certificate/redesigned_card/images/eacd7fea-e298-4908-85ea-2316f038096d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 795;
}
.vector-11c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 14.28%;
  left: 89.66%;
  background: url(/blank_certificate/redesigned_card/images/4c0fbd2f-84a0-4ac3-b6dc-9f1076ab75ba.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 798;
}
.vector-11d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/0acd9c8a-8e92-4a3b-8285-ef866a950d38.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 801;
}
.vector-11e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/ec492f71-7743-4fe3-82b3-6dbc4d9df619.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 804;
}
.vector-11f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 37.93%;
  background: url(/blank_certificate/redesigned_card/images/f67b3902-f076-47b2-8b4c-1e7fa05cfebc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 807;
}
.vector-120 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/d2c1fed5-a7ba-4ba6-9351-084453a8163d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 810;
}
.vector-121 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/6fc448d8-6e42-4340-ab16-dab4b643bd01.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 813;
}
.vector-122 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/9f417d1f-29e7-4a71-8a00-af237d5a77ea.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 816;
}
.vector-123 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/b4b2fdc7-c632-44a7-980a-267153c0e607.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 819;
}
.vector-124 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/43ccd68a-b6d0-43c5-ae98-89dd64e6ebfc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 822;
}
.vector-125 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 72.41%;
  background: url(/blank_certificate/redesigned_card/images/7ae6e1eb-c912-4ce1-9ce7-69ec13a43f61.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 825;
}
.vector-126 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/1fe537c2-0edb-44d9-a760-30dae27c0b74.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 828;
}
.vector-127 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 79.31%;
  background: url(/blank_certificate/redesigned_card/images/c96fcd37-31b2-4b93-9528-2359d672682d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 831;
}
.vector-128 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 82.76%;
  background: url(/blank_certificate/redesigned_card/images/acd5d12c-bbce-42ac-a1fe-31f3830fda61.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 834;
}
.vector-129 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 28.55%;
  left: 93.1%;
  background: url(/blank_certificate/redesigned_card/images/e4080df0-75e9-4016-b6c5-31b5edf30b9a.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 837;
}
.vector-12a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 27.59%;
  background: url(/blank_certificate/redesigned_card/images/e0d58950-41af-4263-9307-7c1e6c114a75.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 840;
}
.vector-12b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/758bf191-8c26-4304-9eda-7444258a70d7.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 843;
}
.vector-12c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/97a3f45c-63f7-4e6a-ad81-0b8eca9c6872.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 846;
}
.vector-12d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/0c07c6b8-1691-40f1-94b9-a33f3a817278.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 849;
}
.vector-12e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 44.83%;
  background: url(/blank_certificate/redesigned_card/images/db4da563-6a60-4c26-b83f-8bac03c59f1d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 852;
}
.vector-12f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/8a5652ba-f6ec-4fdb-91ca-6c78d6755791.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 855;
}
.vector-130 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/366ee4a8-9f60-4440-9771-c8f651ecc928.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 858;
}
.vector-131 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/22700130-24ea-4437-9616-db001ed98fc6.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 861;
}
.vector-132 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/c0b1b4b1-8247-4d47-ad43-6c60d9021bba.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 864;
}
.vector-133 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 82.76%;
  background: url(/blank_certificate/redesigned_card/images/5d6828f2-0132-4e73-b483-e6e36e5e59aa.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 867;
}
.vector-134 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 86.21%;
  background: url(/blank_certificate/redesigned_card/images/109edc8c-136a-4ca0-b712-b60300a7cb4d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 870;
}
.vector-135 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 89.66%;
  background: url(/blank_certificate/redesigned_card/images/2e55c33e-8001-46ab-bbf5-1195fcd30474.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 873;
}
.vector-136 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 42.81%;
  left: 96.55%;
  background: url(/blank_certificate/redesigned_card/images/60d845cd-ea82-420b-8dc2-ae612e56cfbd.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 876;
}
.vector-137 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 37.93%;
  background: url(/blank_certificate/redesigned_card/images/ec7cfb41-31fd-4f3e-b20d-abc03e1b5b0f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 879;
}
.vector-138 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 41.38%;
  background: url(/blank_certificate/redesigned_card/images/588f5bb2-af65-4c4b-81b6-0fb696dd41b9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 882;
}
.vector-139 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 44.83%;
  background: url(/blank_certificate/redesigned_card/images/ffc9a2cc-86e7-4fe6-878f-6a83a087511f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 885;
}
.vector-13a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/59fb36fe-f9e2-4885-89a5-317fe8ad53d2.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 888;
}
.vector-13b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 51.72%;
  background: url(/blank_certificate/redesigned_card/images/01946936-8447-477a-b726-70335bff3367.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 891;
}
.vector-13c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/f4eede6e-4640-413a-afa6-a895d5f53bab.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 894;
}
.vector-13d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/98c817f2-f63c-4777-9ed1-0831df8ff8d5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 897;
}
.vector-13e {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 82.76%;
  background: url(/blank_certificate/redesigned_card/images/91bbf97d-6204-4bb5-987e-233716544918.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 900;
}
.vector-13f {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 86.21%;
  background: url(/blank_certificate/redesigned_card/images/fd948708-dde7-450b-a95a-75960f2dec70.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 903;
}
.vector-140 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 89.66%;
  background: url(/blank_certificate/redesigned_card/images/03ae5842-bca9-4450-a39c-9d5a418ee5c4.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 906;
}
.vector-141 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 57.14%;
  left: 96.55%;
  background: url(/blank_certificate/redesigned_card/images/8c1c485e-c88e-421e-9c16-80cae0eb5528.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 909;
}
.vector-142 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 31.03%;
  background: url(/blank_certificate/redesigned_card/images/283d5fc6-ec0a-405d-8e04-f3522c7b506f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 912;
}
.vector-143 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 34.48%;
  background: url(/blank_certificate/redesigned_card/images/45c14d9a-6cbe-4017-897f-a143206b5ae0.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 915;
}
.vector-144 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 48.28%;
  background: url(/blank_certificate/redesigned_card/images/ee8cf017-f881-4faa-8f09-182e7e408406.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 918;
}
.vector-145 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 55.17%;
  background: url(/blank_certificate/redesigned_card/images/28648c90-f820-4ac4-9b5d-dcbfe29fa122.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 921;
}
.vector-146 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 58.62%;
  background: url(/blank_certificate/redesigned_card/images/6be4f8de-5f61-4700-bba3-76f2151bbed8.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 924;
}
.vector-147 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 62.07%;
  background: url(/blank_certificate/redesigned_card/images/10e584b9-3787-4966-83f7-e90ba4b74b0b.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 927;
}
.vector-148 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 65.52%;
  background: url(/blank_certificate/redesigned_card/images/e9d378c5-0aa1-4646-b044-14087c2c8fc5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 930;
}
.vector-149 {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 68.97%;
  background: url(/blank_certificate/redesigned_card/images/0f80ca9d-db52-4f45-9ba0-bce25c38efa9.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 933;
}
.vector-14a {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 72.41%;
  background: url(/blank_certificate/redesigned_card/images/4a8218ce-f0a7-46cd-abdd-dcaf0c89d792.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 936;
}
.vector-14b {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 75.86%;
  background: url(/blank_certificate/redesigned_card/images/1b4aa720-3fa9-41ad-911b-f0ad5024e6dc.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 939;
}
.vector-14c {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 82.76%;
  background: url(/blank_certificate/redesigned_card/images/bf4d8871-5a14-49b1-be3d-2537d9dfd872.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 942;
}
.vector-14d {
  position: absolute;
  width: 3.45%;
  height: 14.29%;
  top: 71.42%;
  left: 93.1%;
  background: url(/blank_certificate/redesigned_card/images/d94f8840-5c99-45a7-b7c2-6860654c2758.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 945;
}
.flex-row-14e {
  position: relative;
  width: 63.241px;
  height: 3.162px;
  margin: -3.162px 0 0 31.621px;
  z-index: 975;
}
.vector-14f {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/8f7db39a-5969-422e-9835-1701c9920551.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 948;
}
.vector-150 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 25%;
  background: url(/blank_certificate/redesigned_card/images/96c2c654-63fd-495c-8cbb-7bd06dd89273.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 951;
}
.vector-151 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 30%;
  background: url(/blank_certificate/redesigned_card/images/6b6f6fb0-65ee-46c6-ae4f-b2c64f795601.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 954;
}
.vector-152 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 35%;
  background: url(/blank_certificate/redesigned_card/images/34eb4ff5-5023-4382-b1b9-01a11d8d1389.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 957;
}
.vector-153 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 50%;
  background: url(/blank_certificate/redesigned_card/images/7a72fa8b-5ee7-49ac-91b2-76c3beb51b87.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 960;
}
.vector-154 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 60%;
  background: url(/blank_certificate/redesigned_card/images/dc8f21b3-f24e-4dd1-92b1-5da566f2fcda.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 963;
}
.vector-155 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 65%;
  background: url(/blank_certificate/redesigned_card/images/c71ad0ef-80a1-416a-bf75-8db51b585781.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 966;
}
.vector-156 {
  position: absolute;
  width: 5%;
  height: 100%;
  top: 0;
  left: 95%;
  background: url(/blank_certificate/redesigned_card/images/a6180ba8-e1a6-4880-ae89-e9a69a82476d.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 975;
}
.regroup-157 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 10%;
  height: 100%;
  top: 0;
  left: 75%;
  z-index: 972;
}
.vector-158 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/bd37717b-36ba-470d-98e8-26e344fa133f.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 969;
}
.vector-159 {
  flex-shrink: 0;
  position: relative;
  width: 3.162px;
  height: 3.162px;
  background: url(/blank_certificate/redesigned_card/images/0de0c77f-6735-441f-a127-60647533f54c.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 972;
}
.date-range {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 44px;
  top: 8.172px;
  left: 145.454px;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.64px;
  z-index: 9;
}
.date-info {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 44px;
  top: 9.199px;
  left: 0;
  color: rgba(255, 255, 255, 0.5);
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.64px;
  z-index: 8;
}
.qr-code {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 11px;
  top: 79.742px;
  left: 0;
  color: #ffffff;
  font-family: Inter, var(--default-font-family);
  font-size: 15px;
  font-weight: 400;
  line-height: 11px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.6px;
  z-index: 10;
}
.rectangle-15a {
  position: relative;
  width: 493px;
  height: 20.063px;
  margin: 21.924px 0 0 0;
  background: #ffffff;
  z-index: 1001;
}
.shape {
  position: absolute;
  width: 100%;
  height: 101.54%;
  top: 0;
  left: 0;
  background: url(/blank_certificate/redesigned_card/images/3515823e-6fe1-429b-8ae4-efc3c88472d3.png)
    no-repeat center;
  background-size: 100% 100%;
}

  `
}


export const splitDesignation = (designation: string) => {
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
    return {training, training1}
  }