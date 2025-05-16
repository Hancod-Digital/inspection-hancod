import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const majorCategoryDataRange = [{from:'equipment_type',to:'equipment_type'}]
export const siteDataRange = [{from:'area',to:'area'}]
 

export const locationDataRange = [{from:'site',to:'site'}]
export const minorCategoryDataRange = [{from:'major_category',to:'major_category'},{from:'standard',to:'standard'}]
export function generateRows(rows: any[]) {
  // Base top values for the first row
  const baseTopStatus = 4.129;
  const baseTopDescription = 8.012;
  const baseTopSlNo = 11.012;
  const baseTopRemark = 5.883;

  // Increment for each subsequent row
  const increment = 40;

  let rowsHtml = '';
  let rowsCss = '';

  rows.forEach((rowData: any, index: number) => {
    const rowNumber = index === 0 ? '' : (index + 1).toString();

    // Calculate top offsets for this row
    const offset = index * increment;
    const statusTop = (baseTopStatus + offset).toFixed(3);
    const descriptionTop = (baseTopDescription + offset).toFixed(3);
    const slNoTop = (baseTopSlNo + offset).toFixed(3);
    const remarkTop = (baseTopRemark + offset).toFixed(3);

    // Destructure with default empty strings
    const { 
      condition = '', 
      property = '', 
      slNo = '', 
      remarks = '', 
      remark = '' 
    } = rowData;

    // Determine the serial number to display
    const displaySlNo = slNo || (index + 1).toString();

    // Append HTML for this row (no inline styles, rely on classes)
    rowsHtml += `
      <span class="table-header header${rowNumber}-status">${condition}</span>
      <span class="table-header header${rowNumber}-description">${property}</span>
      <span class="table-header header${rowNumber}-sl-no">${displaySlNo}</span>
      <span class="table-header header${rowNumber}-remark">${remarks}</span>
    `;

    // Append CSS for this row
    rowsCss += `
      .header${rowNumber}-status { top: ${statusTop}px; left: 553.213px; position: absolute; }
      .header${rowNumber}-description { top: ${descriptionTop}px; left: 115.41px; position: absolute; }
      .header${rowNumber}-sl-no { top: ${slNoTop}px; left: 15.449px; position: absolute; }
      .header${rowNumber}-remark { top: ${remarkTop}px; left: 762.461px; position: absolute; }
    `;
  });

  return { rowsHtml, rowsCss };
}



export const fetchCertificateHtml = async (item:any) => {
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
              margi
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


export function generateEquipmentCertificateHTML(item:any):string {
  return `
</style></head><body style="margin: 0px; background: rgb(244, 253, 255); overflow-x: hidden;" dark-scroll="">
  <input type="hidden" id="anPageName" name="page" value="certificate-of-thorough-examination-of-lifting-gear">
  <div class="container-center-horizontal">
    <div class="certificate-of-thorough-examination-of-lifting-gear screen " data-id="277:132">
      <img class="whats-app_-image_202-lyLXxs whats-app_-image_202" data-id="277:133" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-08-21-at-2-15-14-pm-1-removebg-preview-2.png" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-08-21-at-2-15-14-pm-1-removebg-preview-2.png" alt="WhatsApp_Image_2024-08-21_at_2.15.14_PM_1-removebg-preview 2">
      <div class="group-1000006694-lyLXxs" data-id="277:134">
        <img class="whats-app_-image_202-aIznp1 whats-app_-image_202" data-id="277:135" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-39-pm-removebg-preview-1.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-39-pm-removebg-preview-1.svg" alt="WhatsApp_Image_2024-10-16_at_1.39.39_PM-removebg-preview 1">
      </div>
      <img class="whats-app_-image_202-4RajHW whats-app_-image_202" data-id="277:136" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-08-21-at-2-15-14-pm-1-removebg-preview-1.png" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-08-21-at-2-15-14-pm-1-removebg-preview-1.png" alt="WhatsApp_Image_2024-08-21_at_2.15.14_PM_1-removebg-preview 1">
      <img class="whats-app_-image_202-9WsDNS whats-app_-image_202" data-id="277:137" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-40-pm--2--removebg-preview-1.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-40-pm--2--removebg-preview-1.svg" alt="WhatsApp_Image_2024-10-16_at_1.39.40_PM__2_-removebg-preview 1">
      <img class="whats-app_-image_202-uywPwW whats-app_-image_202" data-id="277:138" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-40-pm--1--removebg-preview-1.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-40-pm--1--removebg-preview-1.svg" alt="WhatsApp_Image_2024-10-16_at_1.39.40_PM__1_-removebg-preview 1">
      <img class="whats-app_-image_202-yyauHm whats-app_-image_202" data-id="277:139" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-40-pm-removebg-preview-1.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/whatsapp-image-2024-10-16-at-1-39-40-pm-removebg-preview-1.svg" alt="WhatsApp_Image_2024-10-16_at_1.39.40_PM-removebg-preview 1">
      <img class="line-647-lyLXxs" data-id="277:140" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-647.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-647.svg" alt="Line 647">
      <img class="line-650-lyLXxs" data-id="277:141" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-650.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-650.svg" alt="Line 650">
      <img class="line-651-lyLXxs" data-id="277:142" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-651.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-651.svg" alt="Line 651">
      <img class="line-648-lyLXxs" data-id="277:143" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-648.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-648.svg" alt="Line 648">
      <div class="an-isoiec-170202012-company-lyLXxs valign-text-bottom" data-id="277:144">AN ISO/IEC 17020:2012 COMPANY</div>
      <div class="rectangle-23895-lyLXxs" data-id="277:145"></div>
      <div class="rectangle-23896-lyLXxs" data-id="277:146"></div>
      <div class="rectangle-23897-lyLXxs" data-id="277:147"></div>
      <div class="rectangle-23898-lyLXxs" data-id="277:148"></div>
      <img class="line-652-lyLXxs" data-id="277:149" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-652.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-652.svg" alt="Line 652">
      <div class="certificate-no-crt-24-4142-lyLXxs valign-text-middle body-large-2" data-id="277:150">
        <span>
          <span class="span0-3sSeiN body-large-2">CERTIFICATE No.: </span>
          <span class="span1-3sSeiN body-large-2">${item?.certificate_no}</span>
        </span>
      </div>
      <p class="equipment-owner-art-line-grc-qatar-lyLXxs valign-text-middle body-large-2" data-id="277:151">
        <span>
          <span class="span0-vZkDGw body-large-2">EQUIPMENT OWNER:<br></span>
          <span class="span1-vZkDGw body-large-4">${item?.owner_name}</span>
        </span>
      </p>
      <div class="reference-standard-bs-en-1492a12008-lyLXxs valign-text-middle body-large-2" data-id="277:152">
        <span>
          <span class="span0-2vI5tY body-large-2">REFERENCE STANDARD:<br></span>
          <span class="span1-2vI5tY body-large-4">${item?.standard}</span>
        </span>
      </div>
      <p class="qube-safety-inspection-services-co-wll-lyLXxs valign-text-middle body-small-1" data-id="277:153">Qube Safety Inspection &amp; Services Co WLL</p>
      <p class="cr-134005-office-04-lyLXxs valign-text-middle body-small-4" data-id="277:154">
        <span>
          <span class="span0-oKe1YJ body-small-4">CR# 134005, Office 04, 1st Floor, Bldg No. 154, St 204, Zone 56<br>Salwa Road, P.O. Box 201438, Doha-Qatar, Ph: +974 3149 9334<br></span>
          <span class="span1-oKe1YJ body-small-1">info@qubeinspection.com I www.qubeinspection.com<br></span>
        </span>
      </p>
      <div class="date-of-inspection-29-sep-2024-lyLXxs valign-text-middle body-large-2" data-id="277:155">
        <span>
          <span class="span0-eLUxbt body-large-2">DATE OF INSPECTION:<br></span>
          <span class="span1-eLUxbt body-large-4">${item?.inspection_date}</span>
        </span>
      </div>
      <div class="location-pearl-qatar-lyLXxs valign-text-middle body-large-2" data-id="277:156">
        <span>
          <span class="span0-50ie5f body-large-2">LOCATION:<br></span>
          <span class="span1-50ie5f body-large-4">${item?.location_id}</span>
        </span>
      </div>
     <p class="equipment-descriptio-lyLXxs valign-text-middle body-large-2" data-id="277:157">
        <span>
          <span class="span0-VP1xgE body-large-2">EQUIPMENT DESCRIPTION:<br></span>
          <span class="span1-VP1xgE body-large-4">${item?.location_id}</span>
        </span>
      </p>
      <div class="rectangle-23899-lyLXxs" data-id="277:158"></div>
      <div class="rectangle-23900-lyLXxs" data-id="277:159"></div>
      <div class="rectangle-23901-lyLXxs" data-id="277:160"></div>
      <div class="rectangle-23902-lyLXxs" data-id="277:161"></div>
      <img class="line-653-lyLXxs" data-id="277:162" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-653.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-653.svg" alt="Line 653">
      <img class="line-654-lyLXxs" data-id="277:163" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-654.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-654.svg" alt="Line 654">
      <img class="line-657-lyLXxs" data-id="277:164" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-657.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-657.svg" alt="Line 657">
      <img class="line-658-lyLXxs" data-id="277:165" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" alt="Line 658">
      <img class="line-659-lyLXxs" data-id="277:166" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" alt="Line 659">
      <img class="line-660-lyLXxs" data-id="277:167" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" alt="Line 660">
      <img class="line-661-lyLXxs" data-id="277:168" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" alt="Line 661">
      <img class="line-662-lyLXxs" data-id="277:169" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-658.svg" alt="Line 662">
      <img class="line-665-lyLXxs" data-id="277:170" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-665.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-665.svg" alt="Line 665">
      <img class="line-666-lyLXxs" data-id="277:171" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-665.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-665.svg" alt="Line 666">
      <img class="line-655-lyLXxs" data-id="277:172" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-655.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-655.svg" alt="Line 655">
      <img class="line-656-lyLXxs" data-id="277:173" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-656.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-656.svg" alt="Line 656">
      <div class="serial-noid-no-lyLXxs valign-text-middle body-large-2" data-id="277:174">SERIAL NO./ID NO.</div>
      <p class="dq-22123368-dq-22123-lyLXxs valign-text-middle body-large-2" data-id="277:175">${item.serial_no}</p>
      <div class="date-of-last-examination-lyLXxs valign-text-middle body-large-2" data-id="277:176">Date of Last Examination</div>
      <p class="name-qualifications-lyLXxs valign-text-middle body-large-2" data-id="277:177">Name &amp; Qualifications of person making this report: MUNSHEER P.C.P</p>
      <div class="date-of-next-examination-lyLXxs valign-text-middle body-large-2" data-id="277:178">Date of Next Examination</div>
      <p class="is-this-first-examin-lyLXxs valign-text-middle body-large-4" data-id="277:179">Is this first examination after installation or assembly at a new<br>site or location</p>
      <p class="if-the-answer-to-the-lyLXxs valign-text-middle body-large-4" data-id="277:180">If the answer to the above question is YES has the equipment been installed correctly</p>
      <p class="was-the-examination-lyLXxs valign-text-middle was-the-examination body-large-4" data-id="277:181">Was the examination carried out: within an interval of 6 months</p>
      <p class="was-the-examination-4RajHW valign-text-middle was-the-examination body-large-4" data-id="277:182">Was the examination carried out: within an interval of 12 months</p>
      <p class="in-accordance-with-an-examination-scheme-lyLXxs valign-text-middle body-large-4" data-id="277:183">In accordance with an examination scheme?</p>
      <p class="identification-of-an-lyLXxs valign-text-middle body-large-4" data-id="277:184">Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect:</p>
      <p class="particulars-of-any-t-lyLXxs valign-text-middle body-large-4" data-id="277:185">Particulars of any tests carried out as part of the examination</p>
      <p class="is-this-equipment-safe-to-use-lyLXxs valign-text-middle body-large-2" data-id="277:186">Is this equipment safe to use ?</p>
      <div class="signature-lyLXxs valign-text-middle signature body-large-4" data-id="277:187">Signature:</div>
      <p class="name-of-person-authe-lyLXxs valign-text-middle body-large-2" data-id="277:188">Name of person authenticating this report:<br>SANOOF MOHAMMED (Technical Manager)</p>
      <div class="signature-4RajHW valign-text-middle signature body-large-4" data-id="277:189">Signature:</div>
      <p class="after-the-occurrence-lyLXxs valign-text-middle body-large-4" data-id="277:190">After the occurrence of exceptional circumstances</p>
      <p class="date-of-next-proof-load-test-lyLXxs valign-text-middle body-large-2" data-id="277:191">Date of Next Proof Load Test</p>
      <p class="date-of-last-proof-load-test-lyLXxs valign-text-middle body-large-2" data-id="277:192">Date of Last Proof Load Test</p>
      <div class="not-available-lyLXxs valign-text-middle body-large-2" data-id="277:193">${item?.last_test_exam}</div>
      <div class="x28-mar-2025-lyLXxs valign-text-middle body-large-2" data-id="277:194">${item?.last_thorough_exam}</div>
      <div class="yes-lyLXxs valign-text-middle yes body-large-2" data-id="277:195">Yes</div>
      <div class="no-lyLXxs valign-text-middle no body-large-2" data-id="277:196">No</div>
      <div class="yes-4RajHW valign-text-middle yes body-large-2" data-id="277:197">Yes</div>
      <div class="none-lyLXxs valign-text-middle body-large-2" data-id="277:198">${item?.defect_description}</div>
      <p class="a-thorough-visual-ex-lyLXxs valign-text-middle body-large-2" data-id="277:199">${item?.test_particulars}</p>
      <div class="no-4RajHW valign-text-middle no body-large-2" data-id="277:200">No</div>
      <div class="not-applicable-lyLXxs valign-text-middle not-applicable body-large-2" data-id="277:201">${item?.next_test_exam}</div>
      <div class="not-applicable-4RajHW valign-text-middle not-applicable body-large-2" data-id="277:202">${item?.next_thorough_exam}</div>
      <div class="nil-lyLXxs valign-text-middle body-large-2" data-id="277:203">Nil</div>
      <div class="x10-t-straight-lift-lyLXxs valign-text-middle body-large-2" data-id="277:204">${item?.safe_working_load}</div>
      <div class="make-dutest-qatar-ma-lyLXxs valign-text-middle body-large-2" data-id="277:205">
       ${item?.description} 
      </div>
      <div class="x04-lyLXxs valign-text-middle body-large-2" data-id="277:206">${item?.multiequipments ? (item?.multiequipments?.length < 10 ? "0" + item?.multiequipments?.length : item?.multiequipments?.length) : "01"}</div>
      <div class="qty-lyLXxs valign-text-middle body-large-2" data-id="277:207">QTY</div>
      <div class="description-of-item-lyLXxs valign-text-middle body-large-2" data-id="277:208">DESCRIPTION OF ITEM</div>
      <div class="test-load-tonne-lyLXxs valign-text-middle body-large-2" data-id="277:209">TEST LOAD (tonne)</div>
      <div class="wll-or-swl-tonne-lyLXxs valign-text-middle body-large-2" data-id="277:210">WLL or SWL (tonne)</div>
      <div class="job-no-wo-24-1644-lyLXxs valign-text-middle body-large-2" data-id="277:211">
        <span>
          <span class="span0-dEDzkL body-large-2">JOB No.: </span>
          <span class="span1-dEDzkL body-large-2">${item?.job_order_no}</span>
        </span>
      </div>
      <h1 class="title-lyLXxs valign-text-middle" data-id="277:212">CERTIFICATE OF THOROUGH EXAMINATION OF LIFTING GEAR</h1>
      <div class="rectangle-23903-lyLXxs" data-id="277:213"></div>
      <div class="rectangle-23908-lyLXxs" data-id="277:214"></div>
      <div class="rectangle-23904-lyLXxs" data-id="277:215"></div>
      <div class="rectangle-23905-lyLXxs" data-id="277:216"></div>
      <div class="rectangle-23906-lyLXxs" data-id="277:217"></div>
      <div class="rectangle-23907-lyLXxs" data-id="277:218"></div>
      <img class="line-663-lyLXxs" data-id="277:219" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-663.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-663.svg" alt="Line 663">
      <img class="line-664-lyLXxs" data-id="277:220" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-663.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/line-663.svg" alt="Line 664">
      <img class="charmtick-lyLXxs" data-id="277:221" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/charm-tick@2x.png" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/charm-tick@2x.png" alt="charm:tick">
      <img class="vector-lyLXxs vector" data-id="277:223" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" alt="Vector">
      <div class="yes-9WsDNS valign-text-middle yes body-large-2" data-id="277:224">Yes</div>
      <div class="no-9WsDNS valign-text-middle no body-large-2" data-id="277:225">No</div>
      <img class="vector-4RajHW vector" data-id="277:226" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" alt="Vector">
      <div class="yes-uywPwW valign-text-middle yes body-large-2" data-id="277:227">Yes</div>
      <div class="no-uywPwW valign-text-middle no body-large-2" data-id="277:228">No</div>
      <img class="vector-9WsDNS vector" data-id="277:229" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" alt="Vector">
      <div class="yes-yyauHm valign-text-middle yes body-large-2" data-id="277:230">Yes</div>
      <div class="no-yyauHm valign-text-middle no body-large-2" data-id="277:231">No</div>
      <img class="vector-uywPwW vector" data-id="277:232" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector-1.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" alt="Vector">
      <div class="yes-Y5tY8J valign-text-middle yes body-large-2" data-id="277:233">Yes</div>
      <div class="no-Y5tY8J valign-text-middle no body-large-2" data-id="277:234">No</div>
      <img class="vector-yyauHm vector" data-id="277:235" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" alt="Vector">
      <div class="yes-ASSg9r valign-text-middle yes body-large-2" data-id="277:236">Yes</div>
      <div class="no-ASSg9r valign-text-middle no body-large-2" data-id="277:237">No</div>
      <img class="vector-Y5tY8J vector" data-id="277:238" src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" anima-src="https://cdn.animaapp.com/projects/67333f197f850eaed5a7981b/releases/673f1f22a0ff6727407567e8/img/vector.svg" alt="Vector">
      <p class="the-concern-inspecto-lyLXxs valign-text-middle body-xsmall-4" data-id="277:239">
        <br>The concern inspector or representative has thoroughly examined the equipment in accordance to the relevant standards. Examination indicates that the said equipment has no apparent defects or deformation which may prove dangerous during normal operation. The said equipment is found to be satisfactory for further use, provided there is regular maintenance and operated by a certified operator. This certificate is granted subject to the condition that is agreed &amp; understood that Qube safety Inspection co. Liability shall be limited to the act of its employees on premises of sub-contractors. Under no circumstances whatsoever shall qube safety inspection co.be libel for any injury or damage to any person or occurring as a result of negligent operation or any defect in materials, machinery, equipment or systems other than defects ascertainable during routine inspection. We hereby report that the all particulars in this report are correct at the time of test/ inspection &amp; operational maintenance is the sole responsibility of the equipment owner.
      </p>
      <p class="this-certificate-bec-lyLXxs valign-text-middle body-small-1" data-id="277:240">THIS CERTIFICATE BECOMES INVALID, IF ANY ALTERATION/REPAIR OR MODIFICATION IS MADE TO THE EQUIPMENT</p>
      <p class="this-certificate-is-lyLXxs valign-text-middle body-xsmall-1" data-id="277:241">THIS CERTIFICATE IS GENERATED AND AUTHORIZED ELECTRONICALLY AND CAN BE CONSIDERED AS ORIGINAL. TO VERIFY THE AUTHENTICITY OF THIS CERTIFICATE, PLEASE CONTACT COMPANY.</p>
      <div class="text_label-lyLXxs valign-text-bottom" data-id="277:242">
        <span>
          <span class="span0-8JxGHj">كيوب السلامة</span>
          <span class="span1-8JxGHj"> والانسباكشن سيرفيس</span>
        </span>
      </div>
    </div>
  </div>
  <script src="launchpad-js/launchpad-banner.js" async=""></script>
  <script defer="" src="https://animaapp.s3.amazonaws.com/static/restart-btn.min.js"></script>
  <div id="anima-interface" data-turbo-permanent="true" class="idle"><!----></div>
  `;
}

export function generateEquipmentCertificateHTMLBody(item:any):string {
  return `
  <html><head><style type="text/css">.turbo-progress-bar {
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    height: 3px;
    background: #0076ff;
    z-index: 9999;
    transition:
      width 300ms ease-out,
      opacity 150ms 150ms ease-in;
    transform: translate3d(0, 0, 0);
  }
  </style><style id="st_globalStyles">
  /* MEDIA QUERIES */
  .anima-desktop-only {
    @media (max-width: 768px) {
      display: none !important;
    }
  }
  @media print {  
  @page {
    size: 
1133px 1603px;



    margin: 0;
    padding: 0;
  }
   
}
  /* SCROLLBAR */
  
  [dark-scroll]::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  [dark-scroll]::-webkit-scrollbar-track-piece {
    background-color: #2b2b2b;
    border: 1px solid #1d1d1d;
  }
  
  [dark-scroll]::-webkit-scrollbar-thumb {
    height: 10px;
    background-color: #4d4d4d;
  }
  [dark-scroll]::-webkit-scrollbar-thumb:hover {
    background-color: #5a5a5a;
  }
  
  /* LOAD PROGRESS */
  
  .turbolinks-progress-bar {
    height: 3px;
    background-color: #ff6250;
  }
  
  /* GROUPING */
  
  [data-id].ui-selecting {
    box-shadow: inset 0 0 0 1px #4285f4 !important;
  }
  [data-id].ui-selected {
    box-shadow: inset 0 0 0 1px #4285f4 !important;
  }
  
  /* CURSOR */
  
  body[mode='comments'] * {
    cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00LjkxNjQ4IDIzLjQxMDlDNS40OTE1MyAyMi45ODg3IDUuOTMxNzkgMjIuMzkzNSA2LjIzMjggMjEuNjQwN0M0Ljc5MDY5IDE5LjczODMgNCAxNy4zOTMzIDQgMTQuOTk3NUM0IDguOTM0MSA4LjkzMjgyIDQgMTUuMDAyMiA0QzIxLjA3MTcgNCAyNiA4LjkzOTE5IDI2IDE1LjAwMjVDMjYgMjEuMDY1OSAyMS4wNjcyIDI2IDE0Ljk5NzggMjZDMTIuOTg5NiAyNiAxMS4wMzUzIDI1LjQ1NTcgOS4zMjM2NyAyNC40MjMxQzguNDI5NjUgMjQuOTU3MiA3LjQxNDM0IDI1LjIyNjggNi4zMDAxOCAyNS4yMjY4QzUuOTU0MjYgMjUuMjI2OCA1LjU5OTM1IDI1LjIwMTQgNS4yNTM0MiAyNS4xNDU0QzQuOTAzIDI1LjA4OTUgNC42Mjg5NiAyNC44MDQ2IDQuNTUyNTggMjQuNDE4QzQuNDc2MjEgMjQuMDI2NCA0LjYxOTk3IDIzLjYyOTYgNC45MTY0OCAyMy40MTA5WiIgZmlsbD0iI0ZGNjI1MCIvPgo8L3N2Zz4K')
        0 24,
      auto !important;
  }
  
  body[mode='code'] [data-id]:not(.hidden) {
    cursor: default;
  }
  
  /* default node state */
  
  body[mode='code'] [data-id]:not(.hidden), body[mode='comments'] [data-id]:not(.hidden) {
    pointer-events: all;
  }
  
  /* is_image */
  
  body[mode='code'] [data-id].is_image [data-id], body[mode='comments'] [data-id].is_image [data-id] {
    pointer-events: none !important;
  }
  
  /* without a data-id or ignored */
  
  [data-id].ignore,body[mode='code'] *:not([data-id]) {
    pointer-events: none !important;
  }
  /* disable transforms for ignored elements */
  
  
  body[mode='code'] [data-id]:hover{
    transform: none !important;
  }
  
  /* ANIMA BUTTONS */
  .an-button {
    position: relative;
    height: 28px;
    padding: 0 20px;
    font-size: 14px;
    border-radius: 4px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    white-space: nowrap;
    transition-property: all;
    transition-duration: 100ms;
    appearance: none;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    border-width: 0;
  }
  
  .an-button > div {
    width: 100%;
  }
  
  .an-button.primary {
    background: #ff6250;
    color: #ffffff;
  }
  
  .an-button.primary:hover:not(:disabled) {
    background: #e2412e;
  }
  
  .an-button.secondary {
    background: transparent;
    border: 1px solid #ff6250;
    color: #ff6250;
  }
  
  .an-button.secondary:hover:not(:disabled) {
    color: #ffffff;
    background: #ff6250;
  }
  
  .an-button.rounded {
    border-radius: 100px;
  }
  
  .an-button:disabled {
    opacity: 0.5;
  }
  
  .an-button:disabled {
    cursor: default;
  }
  
  .an-button:active,
  .an-button:focus {
    outline: none;
  }
  
  </style><meta charset="utf-8"><meta name="viewport" content="width=1133, maximum-scale=1.0"><link rel="shortcut icon" type="image/png" href="https://animaproject.s3.amazonaws.com/home/favicon.png"><meta name="og:type" content="website"><meta name="twitter:card" content="photo"><script id="anima-load-script" src="load.js"></script><script id="anima-hotspots-script" src="hotspots.js"></script><style id="hotspots-styles">
      .hotspot {
        position: absolute;
        border: 1px solid #2a9fd8;
        background: rgba(0, 173, 255, 0.54);
        opacity: 0;
        z-index: -1;
        pointer-events:none;
      }
    </style><script id="s_turbo" src="https://animaapp.s3.amazonaws.com/static/turbo.es2017-umd.js"></script><script id="anima-overrides-script" src="overrides.js"></script><script src="https://animaapp.s3.amazonaws.com/js/timeline.js"></script><style>
  @import url("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
  
  @import url("https://fonts.googleapis.com/css?family=Inter:400,700,600");
  
  
  @font-face {
    font-family: "BentonSans Black-Regular";
    font-style: normal;
    font-weight: 400;
    src: url('https://anima-uploads.s3.amazonaws.com/projects/60a30f014258b240d9538671/fonts/bentonsans-regular.otf') format("opentype");
  }
  /* The following line is used to measure usage of this code. You can remove it if you want. */
  @import url("https://px.animaapp.com/67333f187f850eaed5a79816.67333f187f850eaed5a79819.Su0iJvK.hch.png");
  
  
  .screen textarea:focus,
  .screen input:focus {
    outline: none;
  }
  
  .screen * {
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }
  
  .screen div {
    -webkit-text-size-adjust: none;
  }
  
  .component-wrapper a {
    display: contents;
    pointer-events: auto;
    text-decoration: none;
  }
  
  .component-wrapper * {
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    pointer-events: none;
  }
  
  .component-wrapper a *,
  .component-wrapper input,
  .component-wrapper video,
  .component-wrapper iframe {
    pointer-events: auto;
  }
  
  .component-wrapper.not-ready,
  .component-wrapper.not-ready * {
    visibility: hidden !important;
  }
  
  .screen a {
    display: contents;
    text-decoration: none;
  }
  
  .full-width-a {
    width: 100%;
  }
  
  .full-height-a {
    height: 100%;
  }
  
  .container-center-vertical {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100%;
    pointer-events: none;
  }
  
  .container-center-vertical > * {
    flex-shrink: 0;
    pointer-events: auto;
  }
  
  .container-center-horizontal {
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    width: 100%;
  }
  
  .container-center-horizontal > * {
    flex-shrink: 0;
    pointer-events: auto;
  }
  
  .auto-animated div {
    --z-index: -1;
    opacity: 0;
    position: absolute;
  }
  
  .auto-animated input {
    --z-index: -1;
    opacity: 0;
    position: absolute;
  }
  
  .auto-animated .container-center-vertical,
  .auto-animated .container-center-horizontal {
    opacity: 1;
  }
  
  .overlay-base {
    display: none;
    height: 100%;
    opacity: 0;
    position: fixed;
    top: 0;
    width: 100%;
  }
  
  .overlay-base.animate-appear {
    align-items: center;
    animation: reveal 0.3s ease-in-out 1 normal forwards;
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0;
  }
  
  .overlay-base.animate-disappear {
    animation: reveal 0.3s ease-in-out 1 reverse forwards;
    display: block;
    opacity: 1;
    pointer-events: none;
  }
  
  .overlay-base.animate-disappear * {
    pointer-events: none;
  }
  
  @keyframes reveal {
    from { opacity: 0 }
   to { opacity: 1 }
  }
  
  .animate-nodelay {
    animation-delay: 0s;
  }
  
  .align-self-flex-start {
    align-self: flex-start;
  }
  
  .align-self-flex-end {
    align-self: flex-end;
  }
  
  .align-self-flex-center {
    align-self: flex-center;
  }
  
  .valign-text-middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .valign-text-bottom {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  input:focus {
    outline: none;
  }
  
  .listeners-active,
  .listeners-active * {
    pointer-events: auto;
  }
  
  .hidden,
  .hidden * {
    pointer-events: none;
    visibility: hidden;
  }
  
  .smart-layers-pointers,
  .smart-layers-pointers * {
    pointer-events: auto;
    visibility: visible;
  }
  
  .listeners-active-click,
  .listeners-active-click * {
    cursor: pointer;
  }
  
  * {
    box-sizing: border-box;
  }
  :root { 
    --black: #000000;
    --dark-1: #0f1422;
    --dark-2: #1f222a;
    --red-orange: #ff3b30;
   
    --font-size-l: 24px;
    --font-size-m: 16px;
    --font-size-s: 12px;
    --font-size-xs: 10px;
   
    --font-family-bentonsans_black-regular: "BentonSans Black-Regular", Helvetica;
    --font-family-inter: "Inter", Helvetica;
  }
  .body-large-2 {
    font-family: var(--font-family-inter);
    font-size: var(--font-size-m);
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0px;
  }
  
  .body-small-1 {
    font-family: var(--font-family-inter);
    font-size: var(--font-size-s);
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0px;
  }
  
  .body-large-4 {
    font-family: var(--font-family-inter);
    font-size: var(--font-size-m);
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0px;
  }
  
  .body-xsmall-4 {
    font-family: var(--font-family-inter);
    font-size: var(--font-size-xs);
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0px;
  }
  
  .body-xsmall-1 {
    font-family: var(--font-family-inter);
    font-size: var(--font-size-xs);
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0px;
  }
  
  .body-small-4 {
    font-family: var(--font-family-inter);
    font-size: var(--font-size-s);
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0px;
  }
  
  :root {
  }
  
  
  /* screen - certificate-of-thorough-examination-of-lifting-gear */
  
  .certificate-of-thorough-examination-of-lifting-gear {
    background-color: #f4fdff;
    height: 1603.34px;
    overflow: hidden;
    overflow-x: hidden;
    position: relative;
    width: 1133px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202-lyLXxs {
    height: 1056px;
    left: 26px;
    top: 244px;
    width: 1097px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .group-1000006694-lyLXxs {
    background-color: transparent;
    height: 98px;
    left: 36px;
    position: absolute;
    top: 26px;
    width: 79px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202-aIznp1 {
    height: 98px;
    left: 0px;
    top: 0px;
    width: 79px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202-4RajHW {
    height: 88px;
    left: 172px;
    object-fit: cover;
    top: 25px;
    width: 310px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202-9WsDNS {
    height: 74px;
    left: 21px;
    top: 1518px;
    width: 74px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202-uywPwW {
    height: 74px;
    left: 100px;
    top: 1518px;
    width: 74px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202-yyauHm {
    height: 74px;
    left: 179px;
    top: 1518px;
    width: 74px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-647-lyLXxs {
    background-color: transparent;
    height: 1px;
    left: 0px;
    object-fit: cover;
    position: absolute;
    top: 138px;
    width: 1133px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-650-lyLXxs {
    background-color: transparent;
    height: 1px;
    left: 0px;
    object-fit: cover;
    position: absolute;
    top: 1508px;
    width: 1133px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-651-lyLXxs {
    background-color: transparent;
    height: 1px;
    left: 268px;
    object-fit: cover;
    position: absolute;
    top: 1554px;
    width: 523px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-648-lyLXxs {
    background-color: transparent;
    height: 78px;
    left: 140px;
    object-fit: cover;
    position: absolute;
    top: 30px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .an-isoiec-170202012-company-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-family: var(--font-family-bentonsans_black-regular);
    font-size: var(--font-size-m);
    font-style: normal;
    font-weight: 400;
    height: 22px;
    left: 768px;
    letter-spacing: 0.00px;
    line-height: 22.4px;
    position: absolute;
    text-align: right;
    top: 1545px;
    width: 322px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23895-lyLXxs {
    background-color: #cddced;
    border: 1px solid;
    border-color: var(--black);
    height: 49px;
    left: 43px;
    position: absolute;
    top: 191px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23896-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 59px;
    left: 43px;
    position: absolute;
    top: 236px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23897-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 59px;
    left: 43px;
    position: absolute;
    top: 295px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23898-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 59px;
    left: 43px;
    position: absolute;
    top: 355px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-652-lyLXxs {
    background-color: transparent;
    height: 164px;
    left: 566px;
    object-fit: cover;
    position: absolute;
    top: 191px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .certificate-no-crt-24-4142-lyLXxs {
    background-color: transparent;
    color: transparent;
    font-style: normal;
    font-weight: 600;
    height: 19px;
    left: 61px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 205px;
    white-space: nowrap;
    width: 331px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-3sSeiN {
    color: var(--dark-1);
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-3sSeiN {
    color: var(--red-orange);
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .equipment-owner-art-line-grc-qatar-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 48px;
    left: 61px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 241px;
    width: 384px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-vZkDGw {
    font-style: normal;
    font-weight: 600;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-vZkDGw {
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .reference-standard-bs-en-1492a12008-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 48px;
    left: 585px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 241px;
    width: 384px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-2vI5tY {
    font-style: normal;
    font-weight: 600;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-2vI5tY {
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .qube-safety-inspection-services-co-wll-lyLXxs {
    background-color: transparent;
    color: #8d1b3d;
    font-style: normal;
    font-weight: 700;
    height: 19px;
    left: 685px;
    line-height: normal;
    position: absolute;
    text-align: right;
    top: 50px;
    width: 406px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .cr-134005-office-04-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 55px;
    left: 643px;
    line-height: normal;
    position: absolute;
    text-align: right;
    top: 73px;
    width: 448px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-oKe1YJ {
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-oKe1YJ {
    font-style: normal;
    font-weight: 700;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .date-of-inspection-29-sep-2024-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 48px;
    left: 585px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 301px;
    width: 384px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-eLUxbt {
    font-style: normal;
    font-weight: 600;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-eLUxbt {
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .location-pearl-qatar-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 48px;
    left: 61px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 301px;
    width: 384px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-50ie5f {
    font-style: normal;
    font-weight: 600;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-50ie5f {
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .equipment-descriptio-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 48px;
    left: 61px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 361px;
    width: 797px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-VP1xgE {
    font-style: normal;
    font-weight: 600;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-VP1xgE {
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23899-lyLXxs {
    background-color: #cddced;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 49px;
    left: 43px;
    position: absolute;
    top: 414px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23900-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 263px;
    left: 43px;
    position: absolute;
    top: 457px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23901-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 51px;
    left: 43px;
    position: absolute;
    top: 718px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23902-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 51px;
    left: 43px;
    position: absolute;
    top: 769px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-653-lyLXxs {
    background-color: transparent;
    height: 304px;
    left: 216px;
    object-fit: cover;
    position: absolute;
    top: 414px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-654-lyLXxs {
    background-color: transparent;
    height: 406px;
    left: 283px;
    object-fit: cover;
    position: absolute;
    top: 414px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-657-lyLXxs {
    background-color: transparent;
    height: 100px;
    left: 549px;
    object-fit: cover;
    position: absolute;
    top: 719px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-658-lyLXxs {
    background-color: transparent;
    height: 188px;
    left: 549px;
    object-fit: cover;
    position: absolute;
    top: 828px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-659-lyLXxs {
    background-color: transparent;
    height: 188px;
    left: 469px;
    object-fit: cover;
    position: absolute;
    top: 828px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-660-lyLXxs {
    background-color: transparent;
    height: 188px;
    left: 390px;
    object-fit: cover;
    position: absolute;
    top: 828px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-661-lyLXxs {
    background-color: transparent;
    height: 188px;
    left: 1009px;
    object-fit: cover;
    position: absolute;
    top: 828px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-662-lyLXxs {
    background-color: transparent;
    height: 188px;
    left: 930px;
    object-fit: cover;
    position: absolute;
    top: 828px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-665-lyLXxs {
    background-color: transparent;
    height: 40px;
    left: 930px;
    object-fit: cover;
    position: absolute;
    top: 1109px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-666-lyLXxs {
    background-color: transparent;
    height: 40px;
    left: 1009px;
    object-fit: cover;
    position: absolute;
    top: 1109px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-655-lyLXxs {
    background-color: transparent;
    height: 304px;
    left: 962px;
    object-fit: cover;
    position: absolute;
    top: 414px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-656-lyLXxs {
    background-color: transparent;
    height: 406px;
    left: 834px;
    object-fit: cover;
    position: absolute;
    top: 414px;
    width: 1px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .serial-noid-no-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 28px;
    left: 61px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 413px;
    width: 146px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .dq-22123368-dq-22123-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 106px;
    left: 61px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 539px;
    width: 137px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .date-of-last-examination-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 70px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 731px;
    white-space: nowrap;
    width: 194px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .name-qualifications-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 46px;
    left: 58px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 1160px;
    width: 477px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .date-of-next-examination-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 313px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 731px;
    white-space: nowrap;
    width: 196px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .is-this-first-examin-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 50px;
    left: 63px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 849px;
    width: 305px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .if-the-answer-to-the-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 50px;
    left: 63px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 941px;
    width: 272px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .was-the-examination-lyLXxs {
    top: 826px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .was-the-examination-4RajHW {
    top: 873px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .in-accordance-with-an-examination-scheme-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 49px;
    left: 571px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 920px;
    width: 351px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .identification-of-an-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 49px;
    left: 63px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 1017px;
    width: 606px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .particulars-of-any-t-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 39px;
    left: 63px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 1069px;
    width: 606px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .is-this-equipment-safe-to-use-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 38px;
    left: 63px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 1106px;
    width: 606px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .signature-lyLXxs {
    left: 58px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .name-of-person-authe-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 46px;
    left: 595px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 1160px;
    width: 477px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .signature-4RajHW {
    left: 595px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .after-the-occurrence-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 49px;
    left: 571px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 967px;
    width: 334px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .date-of-next-proof-load-test-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 847px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 740px;
    white-space: nowrap;
    width: 228px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .date-of-last-proof-load-test-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 14px;
    left: 562px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 745px;
    white-space: nowrap;
    width: 263px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .not-available-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 70px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 780px;
    white-space: nowrap;
    width: 194px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .x28-mar-2025-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 313px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 780px;
    white-space: nowrap;
    width: 196px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-lyLXxs {
    left: 398px;
    top: 862px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-lyLXxs {
    left: 482px;
    top: 862px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-4RajHW {
    left: 398px;
    top: 956px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .none-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    right: 60px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 1030px;
    white-space: nowrap;
    
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .a-thorough-visual-ex-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 729px;
    line-height: 22.4px;
    position: absolute;
    text-align: end;
    top: 1075px;
    white-space: nowrap;
    width: 344px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-4RajHW {
    left: 482px;
    top: 956px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .not-applicable-lyLXxs {
    left: 847px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .not-applicable-4RajHW {
    left: 580px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .nil-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 843px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 568px;
    white-space: nowrap;
    width: 137px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .x10-t-straight-lift-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 962px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 568px;
    white-space: nowrap;
    width: 137px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .make-dutest-qatar-ma-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 171px;
    left: 308px;
    line-height: 28.3px;
    position: absolute;
    text-align: left;
    top: 493px;
    width: 520px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .x04-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    left: 242px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 568px;
    white-space: nowrap;
    width: 26px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .qty-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 28px;
    left: 234px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 424px;
    width: 37px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .description-of-item-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 28px;
    left: 477px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 424px;
    width: 178px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .test-load-tonne-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 28px;
    left: 847px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 424px;
    width: 99px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .wll-or-swl-tonne-lyLXxs {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 50px;
    left: 982px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 424px;
    width: 99px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .job-no-wo-24-1644-lyLXxs {
    background-color: transparent;
    color: transparent;
    font-style: normal;
    font-weight: 600;
    height: 19px;
    left: 585px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 205px;
    white-space: nowrap;
    width: 331px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-dEDzkL {
    color: var(--dark-1);
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-dEDzkL {
    color: var(--red-orange);
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .title-lyLXxs {
    background-color: transparent;
    color: var(--dark-2);
    font-family: var(--font-family-inter);
    font-size: var(--font-size-l);
    font-style: normal;
    font-weight: 700;
    height: 47px;
    left: 172px;
    letter-spacing: 0.00px;
    line-height: 28.8px;
    position: absolute;
    text-align: center;
    top: 141px;
    width: 789px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23903-lyLXxs {
    background-color: transparent;
    border: 1px solid;
    border-color: var(--black);
    height: 240px;
    left: 43px;
    position: absolute;
    top: 828px;
    width: 1047px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23908-lyLXxs {
    background-color: transparent;
    border: 1px solid;
    border-color: var(--black);
    height: 126px;
    left: 43px;
    position: absolute;
    top: 1369px;
    width: 1048px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23904-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 94px;
    left: 43px;
    position: absolute;
    top: 828px;
    width: 1047px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23905-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 94px;
    left: 43px;
    position: absolute;
    top: 922px;
    width: 1047px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23906-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 41px;
    left: 43px;
    position: absolute;
    top: 1068px;
    width: 1047px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .rectangle-23907-lyLXxs {
    background-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: var(--black);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-style: solid;
    border-right-width: 1px;
    border-top-style: none;
    height: 40px;
    left: 43px;
    position: absolute;
    top: 1109px;
    width: 1047px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-663-lyLXxs {
    background-color: transparent;
    height: 1px;
    left: 549px;
    object-fit: cover;
    position: absolute;
    top: 874px;
    width: 541px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .line-664-lyLXxs {
    background-color: transparent;
    height: 1px;
    left: 549px;
    object-fit: cover;
    position: absolute;
    top: 968px;
    width: 541px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .charmtick-lyLXxs {
    background-color: transparent;
    height: 19px;
    left: 438px;
    position: absolute;
    top: 864px;
    width: 21px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector-lyLXxs {
    height: 12px;
    ${!item?.first_examination ? "left: 513px" :"left: 433px"};
    top: 961px;
    width: 20px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-9WsDNS {
    left: 939px;
    top: 839px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-9WsDNS {
    left: 1022px;
    top: 839px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector-4RajHW {
    height: 14px;
    ${!item?.first_examination ? "left: 1054px;" :"left: 974px;"}
    top: 843px;
    width: 18px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-uywPwW {
    left: 939px;
    top: 886px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-uywPwW {
    left: 1022px;
    top: 886px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector-9WsDNS {
    height: 14px;
    ${item?.twelve_month_interval ? "left: 979px" :"left: 1059px"};
    top: 890px;
    width: 18px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-yyauHm {
    left: 939px;
    top: 932px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-yyauHm {
    left: 1022px;
    top: 932px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector-uywPwW {
    height: 12px;
     ${item?.examination_scheme? "left: 979px":"left: 1059px"};
    top: 937px;
    width: 18px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-Y5tY8J {
    left: 939px;
    top: 1116px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-Y5tY8J {
    left: 1022px;
    top: 1116px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector-yyauHm {
    height: 14px;
    ${item?.safe_to_use ? "left: 979px" :"left: 1059px"};
    top: 1120px;
    width: 18px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes-ASSg9r {
    left: 939px;
    top: 979px;
    width: 32px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no-ASSg9r {
    left: 1022px;
    top: 979px;
    width: 33px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector-Y5tY8J {
    height: 12px;
    ${item?.exceptional_circumstances ? "left: 1054px" :"left: 1134px"};
    top: 984px;
    width: 18px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .the-concern-inspecto-lyLXxs {
    background-color: transparent;
    color: var(--black);
    font-style: normal;
    font-weight: 400;
    height: 104px;
    left: 59px;
    line-height: normal;
    position: absolute;
    text-align: left;
    top: 1384px;
    width: 1032px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .this-certificate-bec-lyLXxs {
    background-color: transparent;
    color: var(--red-orange);
    font-style: normal;
    font-weight: 700;
    height: 15px;
    left: 226px;
    line-height: normal;
    position: absolute;
    text-align: left;
    top: 1377px;
    width: 684px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .this-certificate-is-lyLXxs {
    background-color: transparent;
    color: #015293;
    font-style: normal;
    font-weight: 700;
    height: 12px;
    left: -37px;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 1475px;
    width: 1201px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .text_label-lyLXxs {
    background-color: transparent;
    color: transparent;
    direction: rtl;
    font-family: var(--font-family-bentonsans_black-regular);
    font-size: var(--font-size-m);
    font-style: normal;
    font-weight: 400;
    height: 22px;
    left: 854px;
    letter-spacing: 0.00px;
    line-height: 22.4px;
    position: absolute;
    text-align: right;
    top: 28px;
    white-space: nowrap;
    width: auto;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span0-8JxGHj {
    color: var(--black);
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .span1-8JxGHj {
    color: #8d1b3d;
    font-style: normal;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .no {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    white-space: nowrap;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .not-applicable {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    top: 781px;
    white-space: nowrap;
    width: 228px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .signature {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 45px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    top: 1209px;
    width: 273px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .vector {
    background-color: transparent;
    position: absolute;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .was-the-examination {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 400;
    height: 49px;
    left: 571px;
    line-height: 22.4px;
    position: absolute;
    text-align: left;
    width: 334px;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .whats-app_-image_202 {
    background-color: transparent;
    position: absolute;
  }
  
  .certificate-of-thorough-examination-of-lifting-gear .yes {
    background-color: transparent;
    color: var(--dark-1);
    font-style: normal;
    font-weight: 600;
    height: 24px;
    line-height: 22.4px;
    position: absolute;
    text-align: center;
    white-space: nowrap;
  }
  </style><script id="anime-js-script" src="https://cdn.jsdelivr.net/npm/animejs@3.1.0/lib/anime.min.js" integrity="sha256-98Q574VkbV+PkxXCKSgL6jVq9mrVbS7uCdA+vt0sLS8=" crossorigin="anonymous"></script><script id="imgloaded-js-script" src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script><style id="action-links-styles">
  @import url('https://fonts.googleapis.com/css2?family=Mulish&display=swap');
  
  #anima-interface{
    transition: all 0.5s ease-in-out;
  }
  
  #anima-watermark {
    transition: all 0.5s ease-in-out;
    display: none;
  }
  #anima-watermark-link{
    position: fixed;
    bottom:20px;
    height:30px;
    border-radius: 1000px;
    background: #3B3B3B;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    user-select:none;
    transition: width 0.25s cubic-bezier(0.175, 0.885, 0.320, 1.275);
    text-decoration:none;
    color:#fff;
    padding:8px 16px 8px 11px;
    font-family:Mulish, sans-serif;
    font-size:12px;
  }
  #anima-watermark-link .text {
    margin-left: 6px;
  }
  
  .omniview-anima-action-links .link{
    height: 30px;
    width: 30px;
    border-radius: 1000px;
    background: #3B3B3B;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    user-select:none;
    transition: width 0.25s cubic-bezier(0.175, 0.885, 0.320, 1.275);
    text-decoration:none;
    color:#fff;
  }
  .omniview-anima-action-links #comment-link .text,.omniview-anima-action-links #code-link .text{
    display:none;
    font-size:12px;
    margin-right:5px;
  }
  .omniview-anima-action-links #comment-link:hover,.omniview-anima-action-links #code-link:hover{
    width:105px;
  }
  .omniview-anima-action-links #comment-link.pop-active,.omniview-anima-action-links #code-link.pop-active{
    width:105px;
    background: #FF6250;
  }
  .omniview-anima-action-links #comment-link.pop-active .text,.omniview-anima-action-links #code-link.pop-active .text{
    display:block
  }
  .omniview-anima-action-links #comment-link:hover .text,.omniview-anima-action-links #code-link:hover .text{
    display:block;
  }
  
  .link.navigation{
    position:fixed;
    left:50%;
    transform:translateX(-50%);
    width:auto;
    height:32px;
    color:#fff;
    font-size:12px;
    cursor:default;
    padding:0 5px;
  }
  .link.navigation .icon{
    margin:0 6px;
    fill:none;
    stroke:currentColor;
    cursor:pointer;
  }
  .link.navigation .icon.disabled{
    opacity:0.5;
    cursor:default;
  }
  
  
  .link.navigation .home-icon{
    margin-left:6px;
    fill:currentColor;
    stroke:currentColor;
    cursor:pointer;
  }
  
  .omniview-anima-action-links .restart{
    height: 30px;
    padding:0 12px;
    background: #3B3B3B;
    border-radius: 1000px;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    color:#f1f1f1;
    font-size: 12px;
  }
  
  .omniview-anima-action-links{
    display:flex;
    align-items:center;
    position:fixed;
    bottom:20px;
    right:20px;
    font-family:Mulish, sans-serif;
    transition: all 0.5s ease-in-out;
    opacity:1;
  }
  
  .omniview-anima-action-links > * + *{
     margin-right: 0;
     margin-left: 10px;
  }
  
  .idle{
    opacity:0;
    pointer-events:none;
  }
  
  #popoverOpener {
    position: absolute;
    left: 50%;
    margin-left: -10vw;
    text-align: center;
    top: 45vh;
    width: 20vw;
  }
  
  
  .popover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1060;
    display: none;
    font-family: "sans-serif";
    font-size: 14px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0,0,0,.2);
  }
  
  .popover.top {
    margin-top: -12px
  }
  
  .popover.right {
    margin-left: 10px
  }
  
  .popover.bottom {
    margin-top: 10px
  }
  
  .popover.left {
    margin-left: -10px
  }
  
  .popover-title {
    padding: 8px 14px;
    margin: 0;
    font-size: 14px;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ebebeb;
    border-radius: 5px 5px 0 0
  }
  
  .popover-content {
    height: 100%;
    width: 100%;
    display:flex;
    overflow:hidden;
    font-family:Mulish, sans-serif;
  }
  
  
  
  .popover>.arrow,.popover>.arrow:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid
  }
  
  .popover>.arrow {
    border-width: 11px
  }
  
  .popover>.arrow:after {
    content: "";
    border-width: 10px
  }
  
  .popover.top>.arrow {
    bottom: -11px;
    left: 50%;
    margin-left: -11px;
    border-top-color: #999;
    border-top-color: rgba(0,0,0,.25);
    border-bottom-width: 0
  }
  
  .popover.top>.arrow:after {
    bottom: 1px;
    margin-left: -10px;
    content: " ";
    border-top-color: #fff;
    border-bottom-width: 0
  }
  
  .popover.right>.arrow {
    top: 50%;
    left: -11px;
    margin-top: -11px;
    border-right-color: #999;
    border-right-color: rgba(0,0,0,.25);
    border-left-width: 0
  }
  
  .popover.right>.arrow:after {
    bottom: -10px;
    left: 1px;
    content: " ";
    border-right-color: #fff;
    border-left-width: 0
  }
  
  .popover.bottom>.arrow {
    top: -11px;
    left: 50%;
    margin-left: -11px;
    border-top-width: 0;
    border-bottom-color: #999;
    border-bottom-color: rgba(0,0,0,.25)
  }
  
  .popover.bottom>.arrow:after {
    top: 1px;
    margin-left: -10px;
    content: " ";
    border-top-width: 0;
    border-bottom-color: #fff
  }
  
  .popover.left>.arrow {
    top: 50%;
    right: -11px;
    margin-top: -11px;
    border-right-width: 0;
    border-left-color: #999;
    border-left-color: rgba(0,0,0,.25)
  }
  
  .popover.left>.arrow:after {
    right: 1px;
    bottom: -10px;
    content: " ";
    border-right-width: 0;
    border-left-color: #fff
  }
  
  
  
  #anima-comment-popover,#anima-code-popover{
    background:#333333;
    color:#fff;
  }
  
  #anima-comment-popover.top>.arrow,#anima-comment-popover.top>.arrow:after,#anima-code-popover.top>.arrow:after,#anima-code-popover.top>.arrow {
    border-top-color:#333;
  }
  
  #anima-comment-popover .btn,#anima-code-popover .btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 6px 20px;
    background: #FF6250;
    color:#fff;
    border-radius: 100px;
    width: max-content;
    text-decoration:none;
  }
  
  @media screen and (max-width: 550px) {
    #anima-watermark-link {
      padding: 6px !important;
    }
    #anima-watermark-link .text {
      display: none !important;
    }
  }
${generateEquipmentCertificateHTML(item)}
   <div id="anima-comment-popover" class="popover top" role="tooltip" style="left: -205px; top: -220px;">
            <div class="arrow" style="margin-left: 128px;"></div>
            <div class="popover-content" style="align-items:center">
              <div style="display:flex;flex-direction:column;height: 100%;padding: 20px;">
                <h3 style="font-size:18px;margin-bottom:10px;font-weight:500;line-height: 26px;font-family: Roslindale;">
                  Leave feedback and collaborate
                </h3>
                <p style="font-size:12px;margin-bottom:20px;font-weight:400;line-height: 20px;">
                  Login to your account to leave comments. Don't have an account?
                  Sign up for free!
                </p>
                <a target="_blank" rel="noopener noreferrer" class="btn" href="https://projects.animaapp.com/p/undefined/s/undefined?mode=comments&amp;utm_campaign=add-comment&amp;utm_medium=add-comment&amp;utm_source=animaapp.io">Add comment</a>
              </div>
  
              <div style="display:flex;align-items:center;justify-content:center;padding-right:20px">
                <img src="https://animaapp.s3.amazonaws.com/static/comment-illustration.svg">
              </div>
            </div>
          </div>
          <div id="anima-code-popover" class="popover top" role="tooltip" style="left: -205px; top: -220px;">
            <div class="arrow" style="margin-left: 168px;"></div>
            <div class="popover-content" style="align-items:center">
              <div style="display:flex;flex-direction:column;height: 100%;padding: 20px;">
                <h3 style="font-size:18px;margin-bottom:10px;font-weight:500;line-height: 26px;font-family: Roslindale;">
                  Get clean code you’ll love with Anima
                </h3>
                <p style="font-size:12px;margin-bottom:20px;font-weight:400;line-height: 20px;">
                  Login and easily export HTML, React or Vue of this prototype.
                  Don’t have an account? Sign up for free!
                </p>
                <a target="_blank" rel="noopener noreferrer" class="btn" href="https://projects.animaapp.com/p/undefined/s/undefined?mode=code&amp;utm_campaign=get-code&amp;utm_medium=get-code&amp;utm_source=animaapp.io">
                  Get code
                </a>
              </div>
  
              <img src="https://animaapp.s3.amazonaws.com/static/code-illustration.svg">
            </div>
          </div>
          <div class="omniview-anima-action-links" id="actions-wrap">
            <div class="omniview-anima-action-links">
              <div id="page-nav" class="link navigation" style="display: none;">
                <svg id="homepage-icon" class="home-icon" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.151 11a.25.25 0 01-.167-.436l4.349-3.913a.25.25 0 01.334 0l4.349 3.913a.25.25 0 01-.167.436H8.15zM16 12H9v4a1 1 0 001 1h5a1 1 0 001-1v-4z" fill="#fff"></path>
                </svg>
  
                <svg class="icon" id="arrow-left" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
  
                <span id="page-num"></span>
  
                <svg class="icon" id="arrow-right" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
  
              <a class="link" id="comment-link" target="_blank" style="display: none;">
                <span class="text">Comment</span>
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.301 15.137a.551.551 0 01.199-.55c.314-.23.554-.554.718-.965A6.015 6.015 0 014 10 6.006 6.006 0   0110.001 4 6.006 6.006 0 0116 10.001 6.006 6.006 0 019.999 16a5.98 5.98 0 01-3.095-.86 3.165 3.165 0 01-1.65.438 3.6  3.6 0 01-.57-.044c-.191-.03-.34-.186-.383-.397z" fill="#fff"></path>
                </svg>
              </a>
  
              <a class="link" id="code-link" target="_blank" style="display: none;">
                <span class="text">Get Code</span>
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.667a1 1 0 01-.707-1.708l3.626-3.625-3.626-3.626a1 1 0 111.415-1.415l4.333 4.333a1 1 0 010 1.414l-4.333 4.333a.993.993 0 01-.707.294zM7.333 5a1 1 0 01.707 1.708l-3.626 3.625 3.627 3.626a1 1 0 11-1.415 1.415L2.293 11.04a1 1 0 010-1.415l4.333-4.333A.992.992 0 017.333 5z" fill="#fff"></path>
                </svg>
              </a>
  
              <div class="restart" id="restart-btn" style="display: none;">
                <svg style="margin-right: 6px" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 11.817A5.017 5.017 0 01.994 6.811c0-.207.169-.375.375-.375s.375.168.375.375A4.265 4.265 0 006 11.067a4.265 4.265 0 004.256-4.256A4.265 4.265 0 006 2.555a.376.376 0 01-.375-.376c0-.206.169-.374.375-.374a5.017 5.017 0 015.006 5.006A5.017 5.017 0 016 11.817z" fill="#fff"></path>
                  <path d="M6.75 4.237a.37.37 0 01-.263-.112l-1.65-1.65a.363.363 0 010-.525L6.487.3c.15-.15.375-.15.525 0 .15.15.15.375 0 .525L5.625 2.212 7.012 3.6c.15.15.15.375 0 .525-.056.075-.15.112-.262.112z" fill="#fff"></path>
                </svg>
                Restart
              </div>
            </div>
          </div>
        <!----></div><div id="anima-watermark" class="idle" style="display: none;"><!----><a id="anima-watermark-link" target="_blank" href="https://www.animaapp.com?utm_campaign=public-link-banner&amp;utm_medium=public-link-banner&amp;utm_source=animaapp.io" style="right: 20px; left: auto; padding: 6px;">
          <svg width="20" height="20" viewBox="0 0 20 20" id="anima-logo-icon" fill="none" xmlns="http://www.w3.org/2000/svg" data-hotspot-id="hp-0">
            <path d="M4.09293 3.00001H16.5327C16.5484 2.99976 16.5638 3.00351 16.5776 3.01092C16.5913 3.01832 16.603 3.02913 16.6114 3.04231C16.6198 3.0555 16.6247 3.07061 16.6256 3.08622C16.6265 3.10182 16.6233 3.1174 16.6165 3.13146C15.5441 5.29706 13.9276 7.14699 11.9253 8.50009C8.69117 10.6822 5.43436 10.9075 4.09389 10.9196C4.08165 10.9198 4.06949 10.9176 4.05811 10.9131C4.04672 10.9086 4.03636 10.9019 4.02761 10.8933C4.01887 10.8848 4.01192 10.8745 4.00718 10.8633C4.00244 10.852 4 10.8399 4 10.8276V3.09198C4 3.07982 4.00241 3.06778 4.00709 3.05656C4.01177 3.04534 4.01863 3.03516 4.02728 3.02661C4.03592 3.01805 4.04617 3.0113 4.05744 3.00673C4.06871 3.00217 4.08077 2.99988 4.09293 3.00001Z" fill="#FF6250"></path>
            <path d="M6.77772 17.4446C8.31182 17.4446 9.55545 16.201 9.55545 14.6669C9.55545 13.1328 8.31182 11.8892 6.77772 11.8892C5.24363 11.8892 4 13.1328 4 14.6669C4 16.201 5.24363 17.4446 6.77772 17.4446Z" fill="#FFDF90"></path>
            <path d="M12.4559 17.2799C11.6701 16.9799 11.2522 16.1151 11.5185 15.3496L13.6153 9.3656C13.884 8.60003 14.7387 8.22302 15.5245 8.52299C16.3103 8.82344 16.7282 9.68772 16.4619 10.4538L14.365 16.4377C14.0964 17.2033 13.2417 17.5808 12.4559 17.2799Z" fill="#3366FF"></path>
          </svg>
          <span class="text" style="display: none;">Made with Anima</span>
        </a><!----></div><div id="hotspots_wrapper"><div class="hotspot" id="hp-0" style="top: 0px; left: 0px; z-index: -1; opacity: 0;"></div></div><div id="t_preload_links"><link href="/certificate-of-thorough-examination-of-lifting-gear" rel="prefetch"></div></body></html>
  `
}

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
    top: 35.34%;
    left: 20.09%;
background: url(${item?.avatar})
no-repeat center;
  background-size: cover;
  transform: translate(-50.08%, -50.17%);
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
<span class="sheik-hameed-khan">${item?.name?.toUpperCase()}</span>
<div class="nome">
<span class="apparicio-junior">${item?.certificate_no}<br /><br /></span>
</div>
<span class="qube-inspection-basic"
>${item?.id_no}<br />${item?.company?.toUpperCase()}<br />${item?.designation?.toUpperCase()}<br />${item?.model_level?.toUpperCase()}<br />${item?.course_duration} ${Number(item?.course_duration) > 1 ? "DAYS" : "DAY"}</span
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

// export function getSubTopicOne(str: string) {
   
  
//   const parts = str.split('/');
  
//   // Check if there are at least 3 parts to ensure the second slash exists and has a word after it
//   if (parts.length > 1) {
    
//       return replaceHyphen(parts[1]); // The word after the second slash
//   } else {
//       return null; // Return null if the word after the second slash doesn't exist
//   }
// }
// export function getLastTwoDigitsOfCurrentYear(): string {
//   const year = new Date().getFullYear();
//   const lastTwoDigits = (year % 100).toString(); // Convert to string
//   const paddedYear = lastTwoDigits.padStart(4, '0'); // Pad to 4 digits
//   return paddedYear;
// }

// export function getSubTopic(str: string) {
 
  
//   const parts = str.split('/');
  
//   // Check if there are at least 3 parts to ensure the second slash exists and has a word after it
//   if (parts.length > 2) {
    
//       return replaceHyphen(parts[2]); // The word after the second slash
//   } else {
//       return null; // Return null if the word after the second slash doesn't exist
//   }
// }

// export function joinFunctions(locations: any[], sites: any[]) {
//   return locations?.map(location => {
//       // Find the site record that matches the location's site ID
//       const matchedSite = sites.find(site => site.id === location.site);
      
//       // Return a new object that includes the location data and the site name
//       return {
//           ...location,
//           join: matchedSite ? matchedSite.name : 'Unknown Site' // Add site name or fallback to 'Unknown Site'
//       };
//   });
// }


// export async function loadImages(element: any) {
//   const images = element.getElementsByTagName('img');
//   const promises = [];

//   for (let img of images) {
//       if (!img.complete) {
//           promises.push(
//               new Promise((resolve, reject) => {
//                   img.onload = resolve;
//                   img.onerror = reject;
//               })
//           );
//       }
//   }

//   await Promise.all(promises);
// }

// export const dataURLtoBlob = (dataUrl: string) => {
//   const arr = dataUrl.split(',');
//   const mimeMatch = arr[0].match(/:(.*?);/);
//   const mime = mimeMatch ? mimeMatch[1] : '';
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);

//   while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//   }

//   return new Blob([u8arr], { type: mime });
// };

// export function formatDateWithHyphen(dateString: string | number | Date) {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// } 

// export function mapDataFields(data:any, mappings:any) {
//   const fieldOccurrences:any = []; // Array to store transformed records

//   // Process each record in the data array
//   data.forEach((record:any) => {
//     const mappedRecord:any = {}; // Temporary object for each mapped record

//     // Map fields according to the mappings object
//     for (const key in mappings) {
//       const mappedField = mappings[key]; // Get the mapped field name from mappings
//       const fieldValue = record[mappedField]; // Retrieve the value from data record
//       mappedRecord[key] = fieldValue; // Assign it to the mappedRecord with the new key
//     }

//     // Add the mapped record to the array
//     fieldOccurrences.push(mappedRecord);
//   });

//   return fieldOccurrences; // Return the array of mapped records
// }

// export const cssString = (item:any) => {
//   return `
//   :root {
//   --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//     Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
//     "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
//     "Source Han Sans CN", sans-serif;
// }

// .main-container {
//   overflow: hidden;
// }

// .main-container,
// .main-container * {
//   box-sizing: border-box;
// }

// input,
// select,
// textarea,
// button {
//   outline: 0;
// }
//   *{
//   margin: 0px;
//   padding: 0px;
// }
// @media print {  
//   @page {
//     size: 500px 800px;
//     margin: 0;
//     padding: 0;
//   }
//     html, body {
//         height: 95%;    
//     }
// }
// .main-container {
//   position: relative;
//   width: 493px;
//   height: 788px;
//   margin: 0 auto;
//   background: #ffffff;
//   overflow: hidden;
// }
// .rectangle {
//   position: relative;
//   width: 493px;
//   height: 40.523px;
//   margin: 0 0 0 0;
//   background: #8d1b3d;
//   z-index: 1000;
// }
// .whatsapp-image {
//   position: relative;
//   width: 225.264px;
//   height: 63.591px;
//   margin: 10.625px 0 0 128.75px;
//   background: url(/blank_certificate/redesigned_card/images/8db68740fedd899478a73a914c174d93703d7123.png)
//     no-repeat center;
//   background-size: cover;
//   z-index: 999;
// }
// .apply-style {
//   position: relative;
//   width: 161px;
//   height: 182px;
//   margin: 20.262px 0 0 165.029px;
//   border: 1px solid #8d1b3d;
//   z-index: 994;
//   overflow: hidden;
//   border-radius: 30.971px;
// }
// .profile-photo {
//   position: absolute;
//   width: 597.74px;
//   height: 597.74px;
//   top: 50%;
//   left: 50%;
//   background: url("${item?.avatar}")
//     no-repeat center;
//   background-size: cover;
//   transform: translate(-50.08%, -50.17%);
//   z-index: 995;
// }
// .sheik-hameed-khan {
// display: block;
//     position: relative;
//     height: 35px;
//     /* margin: 17px 0 0 91.318px; */
//     color: #ffffff;
//     font-family: Inter, var(--default-font-family);
//     font-size: 32px;
//     font-weight: 600;
//     padding-top: 14px;
//     line-height: 35px;
//     text-align: left;
//     white-space: nowrap;
//     z-index: 996;
//     text-align: center;
// }
// .flex-row-b {
//   position: relative;
//   width: 480.159px;
//   height: 210.827px;
//   margin: 13.59px 0 0 32px;
//   z-index: 998;
// }
// .nome {
//   display: flex;
//   align-items: flex-start;
//   flex-wrap: nowrap;
//   gap: 15.485px;
//   position: absolute;
//   width: 174px;
//   height: 157px;
//   top: 0;
//   left: 127.251px;
//   z-index: 2;
// }
// .apparicio-junior {
//  display: flex;
//     align-items: flex-start;
//     justify-content: flex-start;
//     flex-shrink: 0;
//     position: relative;
//     width: 174px;
//     height: 157px;
//     color: #ffffff;
//     font-family: Inter, var(--default-font-family);
//     font-size: 20px;
//     font-weight: 500;
//     line-height: 33.233px;
//     text-align: left;
//         margin-left: 14px;

//     text-overflow: initial;
//     letter-spacing: -0.8px;
//     z-index: 3;
//     overflow: hidden;
// }
// .line {
//   position: absolute;
//   width: 423.006px;
//   height: 1.548px;
//   top: 37.424px;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/75eca563-7bd4-4998-aa1d-8833f2d1e1de.png)
//     no-repeat center;
//   background-size: cover;
//   z-index: 4;
// }
// .qatar-id-company {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   width: 168.536px;
//   height: 128px;
//   top: calc(50% - 46.59px);
//   left: calc(50% - 227.96px);
//   color: rgba(255, 255, 255, 0.5);
//   font-family: Inter, var(--default-font-family);
//   font-size: 16px;
//   font-weight: 400;
//   line-height: 29px;
//   text-align: left;
//   letter-spacing: -0.64px;
//   z-index: 5;
// }
// .qube-inspection {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   width: 320.365px;
//   height: 128px;
//   top: 58.828px;
//   left: 159.793px;
//   color: #ffffff;
//   font-family: Inter, var(--default-font-family);
//   font-size: 16px;
//   font-weight: 400;
//   line-height: 29px;
//   text-align: left;
//   text-overflow: initial;
//   letter-spacing: -0.64px;
//   z-index: 6;
//   overflow: hidden;
// }
// .safe-building-operator {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   width: 260.913px;
//   height: 36px;
//   top: 120.827px;
//   left: 159.793px;
//   color: #ffffff;
//   font-family: Inter, var(--default-font-family);
//   font-size: 16px;
//   font-weight: 400;
//   line-height: 24px;
//   text-align: left;
//   white-space: nowrap;
//   letter-spacing: -0.64px;
//   z-index: 997;
// }
// .safety-model-operator {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   width: 260.913px;
//   height: 36px;
//   top: 174.827px;
//   left: 159.793px;
//   color: #ffffff;
//   font-family: Inter, var(--default-font-family);
//   font-size: 16px;
//   font-weight: 400;
//   line-height: 24px;
//   text-align: left;
//   white-space: nowrap;
//   letter-spacing: -0.64px;
//   z-index: 998;
// }
// .line-1 {
//   position: relative;
//   width: 423.006px;
//   height: 1.548px;
//   margin: 29.391px 0 0 32px;
//   background: url(/blank_certificate/redesigned_card/images/c1d8a56c-b135-45d3-8c60-feead411f79a.png)
//     no-repeat center;
//   background-size: cover;
//   z-index: 7;
// }
// .flex-row-baa {
//   position: relative;
//   width: 403.202px;
//   height: 104.348px;
//   margin: 17.309px 0 0 44.093px;
//   z-index: 11;
// }
// .vector {
//   position: absolute;
//   width: 104.348px;
//   height: 104.348px;
//   top: 0;
//   left: 298.854px;
//   background: url("${item?.qr_url}")
//     no-repeat center;
//   background-size: cover;
//   z-index: 11;
// }
// .flex-row-db {
//   position: relative;
//   width: 91.699px;
//   height: 22.134px;
//   margin: 6.32px 0 0 6.324px;
//   z-index: 981;
// }
// .group {
//   position: absolute;
//   width: 24.14%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/1324fcb2-e1c2-4f6f-b95a-2cb00a4ae9de.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 978;
// }
// .vector-2 {
//   position: relative;
//   width: 9.486px;
//   height: 9.486px;
//   margin: 6.328px 0 0 6.324px;
//   background: url(/blank_certificate/redesigned_card/images/f38f3417-1dff-4f07-89a9-cf32ea64626a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 987;
// }
// .vector-3 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/bf8288c7-7c29-43bd-8594-40d2380bdbef.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 15;
// }
// .vector-4 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/a6624518-98da-4211-8b16-50dc2f58aa7e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 18;
// }
// .vector-5 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/74a0fd2e-f93a-4772-a5b5-565a217efd03.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 27;
// }
// .group-6 {
//   position: absolute;
//   width: 24.14%;
//   height: 100%;
//   top: 0;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/dd78f213-e0f9-4305-aaab-f73217d69a28.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 981;
// }
// .vector-7 {
//   position: relative;
//   width: 9.486px;
//   height: 9.486px;
//   margin: 6.328px 0 0 6.324px;
//   background: url(/blank_certificate/redesigned_card/images/bbc09051-d3b4-4e38-aa9b-bb6c16ef772d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 990;
// }
// .regroup {
//   position: absolute;
//   width: 10.34%;
//   height: 100%;
//   top: 0;
//   left: 41.38%;
//   z-index: 24;
// }
// .vector-8 {
//   position: absolute;
//   width: 33.33%;
//   height: 14.29%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/4bec1505-1975-4fb7-b655-4403a1d50470.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 21;
// }
// .vector-9 {
//   position: absolute;
//   width: 33.33%;
//   height: 14.29%;
//   top: 0;
//   left: 66.67%;
//   background: url(/blank_certificate/redesigned_card/images/11e42526-b4fb-46b0-a934-f2ff34a974ea.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 24;
// }
// .vector-a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.24%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/9732a632-aa3d-421b-90ad-b6fbd1e3a372.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 30;
// }
// .vector-b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.24%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/c202adb3-cdea-4b1a-8fe6-4664220992ea.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 33;
// }
// .vector-c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.24%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/d9350f92-4095-4c1e-90ce-fadd781ca4db.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 36;
// }
// .vector-d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.24%;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/3faa5878-aa42-4662-9fad-4ef05a9b2cba.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 39;
// }
// .vector-e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.24%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/188059c3-2c25-4adc-9068-f7d557872074.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 42;
// }
// .vector-f {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.24%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/60c75e1f-da83-465f-9769-05fd5f3d680b.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 45;
// }
// .vector-10 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/4bf4c2c5-3c64-4dc0-ab5b-088238214a93.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 48;
// }
// .vector-11 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 37.93%;
//   background: url(/blank_certificate/redesigned_card/images/287b3c8a-6dfc-449e-bf65-2ee595a0c0f9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 51;
// }
// .vector-12 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/cb3ab9f6-a9e7-4c09-90ed-cd20a041d422.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 54;
// }
// .vector-13 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/25cbdbaf-797e-43b5-9059-8dce04ba250d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 57;
// }
// .vector-14 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/f7bf0515-9324-4ae0-bc42-70194ae2edd1.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 60;
// }
// .vector-15 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/8b15054f-43a0-41a4-bd6a-2bb6a22374a5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 63;
// }
// .vector-16 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.59%;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/69380de4-98fe-4b0c-94de-c708c37b0752.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 66;
// }
// .vector-17 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.85%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/406549a1-ea43-4666-a51b-cfea4dd4a576.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 69;
// }
// .vector-18 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.85%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/a3613cb2-94b3-4ff6-be1d-84301e798195.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 72;
// }
// .vector-19 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.85%;
//   left: 44.83%;
//   background: url(/blank_certificate/redesigned_card/images/af5003fd-82a6-4dbd-8b69-c67bf68f8aa5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 75;
// }
// .vector-1a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.85%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/65c79dbd-b0a5-42cd-a455-002b60faf306.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 78;
// }
// .vector-1b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.85%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/a7feb8f3-0294-4fbd-a16e-5363e74ed1fd.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 81;
// }
// .vector-1c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.85%;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/6c9ed1ed-bf15-45c2-934f-9de531c31bbb.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 84;
// }
// .vector-1d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/6e787f0d-81aa-4a5b-b988-a9391dcc6840.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 87;
// }
// .vector-1e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/242df8df-fcd4-435f-b4a7-4b766f905e88.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 90;
// }
// .vector-1f {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/988d6ebf-f94a-44bb-9d31-d4b5591c0f08.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 93;
// }
// .vector-20 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/c82a41bf-fe29-4250-988b-405340b3b822.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 96;
// }
// .vector-21 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 27.59%;
//   background: url(/blank_certificate/redesigned_card/images/6f20b627-7ee3-449a-8167-8dc933500fa8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 99;
// }
// .vector-22 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/0558eac1-cd28-4612-9a16-e1c2ef6625aa.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 102;
// }
// .vector-23 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/343df007-c7e1-4b6e-859b-0f555685e184.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 105;
// }
// .vector-24 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/05d7753f-4e0e-4e6c-af9f-0c6efeb9a78e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 108;
// }
// .vector-25 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/77db7491-9462-41eb-a977-f74def5d3fa7.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 111;
// }
// .vector-26 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/429a9edc-097f-47fc-af94-155c0f1abf59.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 114;
// }
// .vector-27 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.4%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/ad5ec35c-f470-49cc-b2fc-7abbc4f71be2.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 117;
// }
// .vector-28 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 27.59%;
//   background: url(/blank_certificate/redesigned_card/images/251f3c5f-a3a1-4f98-983f-d87544f693e8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 120;
// }
// .vector-29 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/8a441232-0164-44e6-b8b3-eefe05ddb56c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 123;
// }
// .vector-2a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/a3ed5198-792a-4b71-b6da-0a2511c5f98d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 126;
// }
// .vector-2b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/ad162c0d-cb4f-4c26-9cf8-df4dc386127d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 129;
// }
// .vector-2c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/12a885a0-06e7-4cb4-9434-825f13642694.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 132;
// }
// .vector-2d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/0eb6113d-fbca-4528-b328-e1d4cf168e4d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 135;
// }
// .vector-2e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 85.7%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/baa73462-50ca-4bf0-8e35-3f9200601ba9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 138;
// }
// .flex-row-ba {
//   position: relative;
//   width: 25.296px;
//   height: 3.162px;
//   margin: -0.01px 0 0 44.269px;
//   z-index: 159;
// }
// .vector-2f {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/d6cef39e-0eea-4ec0-9c13-0233372cd7f7.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 141;
// }
// .vector-30 {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 12.5%;
//   background: url(/blank_certificate/redesigned_card/images/80057843-e8d3-49bd-9634-f544bac17cf1.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 144;
// }
// .vector-31 {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 37.5%;
//   background: url(/blank_certificate/redesigned_card/images/2ab63587-28fe-4d96-a78b-9699402b6710.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 147;
// }
// .vector-32 {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 50%;
//   background: url(/blank_certificate/redesigned_card/images/817c20fd-503b-471d-b634-2f6d15287011.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 150;
// }
// .vector-33 {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 62.5%;
//   background: url(/blank_certificate/redesigned_card/images/aa833826-a5ea-4aa2-8da3-a682bbc9251d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 153;
// }
// .vector-34 {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 75%;
//   background: url(/blank_certificate/redesigned_card/images/59af30cd-c88e-4860-a117-d33dd1f2043e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 156;
// }
// .vector-35 {
//   position: absolute;
//   width: 12.5%;
//   height: 100%;
//   top: 0;
//   left: 87.5%;
//   background: url(/blank_certificate/redesigned_card/images/43d664c6-8919-44c8-bc52-ca5a190e4c2a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 159;
// }
// .flex-row-cc {
//   position: relative;
//   width: 75.889px;
//   height: 3.162px;
//   margin: 0.01px 0 0 6.324px;
//   z-index: 195;
// }
// .vector-36 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/f195c6b3-ead9-4dd8-866e-9bd12a38cf67.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 162;
// }
// .vector-37 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 12.5%;
//   background: url(/blank_certificate/redesigned_card/images/bc138a05-92ce-4acc-9e99-7b05d1782692.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 165;
// }
// .vector-38 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 20.83%;
//   background: url(/blank_certificate/redesigned_card/images/1f8ab133-4400-4210-8c0d-6dc03fafe8bb.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 168;
// }
// .vector-39 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 25%;
//   background: url(/blank_certificate/redesigned_card/images/b8885e80-fe01-42f4-a48d-94f490797704.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 171;
// }
// .vector-3a {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 45.83%;
//   background: url(/blank_certificate/redesigned_card/images/c2b86729-01a1-49f3-a824-166a130be246.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 180;
// }
// .vector-3b {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 58.33%;
//   background: url(/blank_certificate/redesigned_card/images/4ac25e02-5f7d-4119-8db8-f368994dd30f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 183;
// }
// .vector-3c {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 66.67%;
//   background: url(/blank_certificate/redesigned_card/images/fd1bc2a8-280d-4fa7-b156-0c9cfb2948b4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 186;
// }
// .vector-3d {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 83.33%;
//   background: url(/blank_certificate/redesigned_card/images/cf61ab25-5e05-4169-9365-40f9916787f2.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 189;
// }
// .vector-3e {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 87.5%;
//   background: url(/blank_certificate/redesigned_card/images/f3b8fdc0-bfdc-4a63-af7b-dbbae8f8942d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 192;
// }
// .vector-3f {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 95.83%;
//   background: url(/blank_certificate/redesigned_card/images/76a01584-4ede-4046-8e80-063437dc1d17.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 195;
// }
// .regroup-40 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 8.33%;
//   height: 100%;
//   top: 0;
//   left: 33.33%;
//   z-index: 177;
// }
// .vector-41 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/76d5c58a-a63c-4a7c-bc77-e0f4b826f842.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 174;
// }
// .vector-42 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/b9dec9f8-685f-4a4d-a0e2-b5cd9cc75978.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 177;
// }
// .flex-row-cc-43 {
//   position: relative;
//   width: 88.538px;
//   height: 3.162px;
//   margin: 0px 0 0 9.486px;
//   z-index: 246;
// }
// .vector-44 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/ceb04065-6f29-448e-9b8f-e627d3a22896.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 198;
// }
// .vector-45 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 3.57%;
//   background: url(/blank_certificate/redesigned_card/images/8ff36b16-dd87-4fce-94d7-b1ff25d4dcee.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 201;
// }
// .vector-46 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 7.14%;
//   background: url(/blank_certificate/redesigned_card/images/284f86ac-6b33-42ad-8577-cd60d8a31f20.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 204;
// }
// .vector-47 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 21.43%;
//   background: url(/blank_certificate/redesigned_card/images/f9c29809-56fa-4e45-bebc-589751fc9e12.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 207;
// }
// .vector-48 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 25%;
//   background: url(/blank_certificate/redesigned_card/images/d8b2e717-f07b-4c56-b641-d03c6f410445.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 210;
// }
// .vector-49 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 28.57%;
//   background: url(/blank_certificate/redesigned_card/images/9a1dae60-c365-4a59-880e-15d1761129b0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 213;
// }
// .vector-4a {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 50%;
//   background: url(/blank_certificate/redesigned_card/images/2271db85-9824-4e6a-84c6-72a5b8d26c19.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 222;
// }
// .vector-4b {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 53.57%;
//   background: url(/blank_certificate/redesigned_card/images/879097a9-d5bb-4256-9dba-d8fec146be08.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 225;
// }
// .vector-4c {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 57.14%;
//   background: url(/blank_certificate/redesigned_card/images/90144646-866f-40e7-824b-f9459bee4cf5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 228;
// }
// .vector-4d {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 60.71%;
//   background: url(/blank_certificate/redesigned_card/images/cdc0cbab-6f7f-48dd-b624-d30537a2cf1c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 231;
// }
// .vector-4e {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 67.86%;
//   background: url(/blank_certificate/redesigned_card/images/defd683d-0ef7-4934-a205-b3b5aa876070.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 234;
// }
// .vector-4f {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 71.43%;
//   background: url(/blank_certificate/redesigned_card/images/78971a0e-b6c9-48e2-a343-f88e1e9adfd1.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 237;
// }
// .vector-50 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 75%;
//   background: url(/blank_certificate/redesigned_card/images/c45c9206-21a5-44a2-8ab3-387a54d5e999.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 240;
// }
// .vector-51 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 85.71%;
//   background: url(/blank_certificate/redesigned_card/images/fc002106-af74-42d4-be5c-4bd2c560fe63.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 243;
// }
// .vector-52 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 96.43%;
//   background: url(/blank_certificate/redesigned_card/images/530778ef-2ca4-4f35-a5d0-666fc20ec973.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 246;
// }
// .regroup-53 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 10.71%;
//   height: 100%;
//   top: 0;
//   left: 35.71%;
//   z-index: 219;
// }
// .vector-54 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/15545254-2629-4729-aa71-95c283ede3c3.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 216;
// }
// .vector-55 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/8ffdaa6a-164c-4b97-aaca-be38c43132ef.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 219;
// }
// .flex-row-dc {
//   position: relative;
//   width: 82.213px;
//   height: 3.162px;
//   margin: 0px 0 0 12.648px;
//   z-index: 285;
// }
// .vector-56 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/ad0f2d8f-dfa5-4e0c-a0af-0453ae3c4d89.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 249;
// }
// .vector-57 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 15.38%;
//   background: url(/blank_certificate/redesigned_card/images/a09a7e25-0b05-4009-a7c6-93f41b839127.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 252;
// }
// .vector-58 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 19.23%;
//   background: url(/blank_certificate/redesigned_card/images/c9fc7a51-4977-4b8f-a659-257128308545.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 255;
// }
// .vector-59 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 34.62%;
//   background: url(/blank_certificate/redesigned_card/images/b9d6ff9f-e3a8-4b3b-af5e-8076999a6681.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 258;
// }
// .vector-5a {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 38.46%;
//   background: url(/blank_certificate/redesigned_card/images/02cfc15a-2b39-4184-9694-6d35303f9733.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 261;
// }
// .vector-5b {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 42.31%;
//   background: url(/blank_certificate/redesigned_card/images/792b3108-6553-4be5-af1c-0b1ae392656d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 264;
// }
// .vector-5c {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 46.15%;
//   background: url(/blank_certificate/redesigned_card/images/5328e10f-de7c-40e8-9084-d02b497ff1f9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 267;
// }
// .vector-5d {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 50%;
//   background: url(/blank_certificate/redesigned_card/images/e9e3b66c-dc00-423e-a3f2-5f47fdea898d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 270;
// }
// .vector-5e {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 88.46%;
//   background: url(/blank_certificate/redesigned_card/images/deda04f1-0fac-44f7-b94c-a7c1222aba39.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 279;
// }
// .vector-5f {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 92.31%;
//   background: url(/blank_certificate/redesigned_card/images/1d672a5d-d279-4d31-b74a-0a36ea084db0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 282;
// }
// .vector-60 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 96.15%;
//   background: url(/blank_certificate/redesigned_card/images/43551943-85f5-4331-84a0-10f30f3983fb.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 285;
// }
// .regroup-61 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 11.54%;
//   height: 100%;
//   top: 0;
//   left: 65.38%;
//   z-index: 276;
// }
// .vector-62 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/b0653522-253b-4df1-aadb-a89b025a181d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 273;
// }
// .vector-63 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/bf3321d5-6c39-48f6-8bcb-e50626a54a37.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 276;
// }
// .flex-row-dc-64 {
//   position: relative;
//   width: 88.538px;
//   height: 3.162px;
//   margin: 0.01px 0 0 6.324px;
//   z-index: 333;
// }
// .vector-65 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/c7ce5dcf-2064-4683-a0fa-1272d51c93c9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 288;
// }
// .vector-66 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 3.57%;
//   background: url(/blank_certificate/redesigned_card/images/c5f47070-a33a-4643-8277-32978f558b72.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 291;
// }
// .vector-67 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 7.14%;
//   background: url(/blank_certificate/redesigned_card/images/1331e50a-0780-4320-83b2-ce98bff3282e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 294;
// }
// .vector-68 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 10.71%;
//   background: url(/blank_certificate/redesigned_card/images/7cc5472c-3cf6-45fd-aaa5-ae8cb78a2b91.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 297;
// }
// .vector-69 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 14.29%;
//   background: url(/blank_certificate/redesigned_card/images/bf5f4883-048a-4ecd-a5aa-0b0547f3764e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 300;
// }
// .vector-6a {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 17.86%;
//   background: url(/blank_certificate/redesigned_card/images/261e793f-6097-4d60-a714-7120fa3438f4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 303;
// }
// .vector-6b {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 42.86%;
//   background: url(/blank_certificate/redesigned_card/images/92c340af-f95b-485a-8b01-4d38925a2b3c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 306;
// }
// .vector-6c {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 46.43%;
//   background: url(/blank_certificate/redesigned_card/images/0d655da0-7736-416e-882f-0e73f902c85e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 309;
// }
// .vector-6d {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 57.14%;
//   background: url(/blank_certificate/redesigned_card/images/5b3cada8-3040-4123-8909-a68e296e274d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 312;
// }
// .vector-6e {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 67.86%;
//   background: url(/blank_certificate/redesigned_card/images/1a645c90-04a2-455b-84cf-f9583b0ebfdf.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 315;
// }
// .vector-6f {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 71.43%;
//   background: url(/blank_certificate/redesigned_card/images/ee653558-a461-431d-a54e-65bff62fa42d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 318;
// }
// .vector-70 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 75%;
//   background: url(/blank_certificate/redesigned_card/images/35407a57-6e43-4a54-8ed2-cc4b7eeea6bd.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 321;
// }
// .vector-71 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 82.14%;
//   background: url(/blank_certificate/redesigned_card/images/32a8b698-0366-44b7-ade4-87067c5fb17b.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 324;
// }
// .vector-72 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 85.71%;
//   background: url(/blank_certificate/redesigned_card/images/a9a47147-60a9-4fe7-83c7-ca23c6ba73ad.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 327;
// }
// .regroup-73 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 7.14%;
//   height: 100%;
//   top: 0;
//   left: 92.86%;
//   z-index: 333;
// }
// .vector-74 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/9185dcba-22c0-45ea-b3e0-3e585e889ec7.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 330;
// }
// .vector-75 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/3805bf25-038c-4b8e-a770-5f4373077d4d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 333;
// }
// .flex-row-a {
//   position: relative;
//   width: 91.7px;
//   height: 3.162px;
//   margin: 0px 0 0 6.324px;
//   z-index: 384;
// }
// .vector-76 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/e3d4d343-ac1b-43c5-adf7-c08fa3d55bfe.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 336;
// }
// .vector-77 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 6.9%;
//   background: url(/blank_certificate/redesigned_card/images/fef32f31-4bb3-41d0-b58f-d548542ffd74.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 339;
// }
// .vector-78 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 17.24%;
//   background: url(/blank_certificate/redesigned_card/images/bfa4f861-1b31-46bd-8662-39ea0fe95988.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 342;
// }
// .vector-79 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 20.69%;
//   background: url(/blank_certificate/redesigned_card/images/fce1782b-7651-4f23-9e0f-9d7596bd075d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 345;
// }
// .vector-7a {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 24.14%;
//   background: url(/blank_certificate/redesigned_card/images/b5ec71c7-7f7e-4438-8b35-adb8ed9854af.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 348;
// }
// .vector-7b {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 27.59%;
//   background: url(/blank_certificate/redesigned_card/images/c52c3e31-24cf-40f8-9d0f-a2903cb95a6a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 351;
// }
// .vector-7c {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/17dd6cf6-66c8-4304-b68e-4b9c45b88bf2.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 354;
// }
// .vector-7d {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/9cfa1914-19c4-440b-9077-b78117c4b322.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 357;
// }
// .vector-7e {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/e4dd0207-e422-4790-ad39-81964945e863.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 360;
// }
// .vector-7f {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/08636238-15f3-40f6-965f-0607d2ae7449.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 363;
// }
// .vector-80 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/95705f83-e374-49e6-84ab-7010b5567f7a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 366;
// }
// .vector-81 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/4865a047-4ff8-47b9-9e95-b06ea616acd8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 369;
// }
// .vector-82 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 72.41%;
//   background: url(/blank_certificate/redesigned_card/images/5774b65e-db2f-48e6-81d7-f9fede48546c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 372;
// }
// .vector-83 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/ad640670-af4d-4b1d-9e3c-f2b30cb415e4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 375;
// }
// .vector-84 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 86.21%;
//   background: url(/blank_certificate/redesigned_card/images/c996d23e-e09b-41eb-bc5c-763c5ec74459.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 378;
// }
// .regroup-85 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 6.9%;
//   height: 100%;
//   top: 0;
//   left: 93.1%;
//   z-index: 384;
// }
// .vector-86 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/c453c7d6-d96d-425c-a4bd-25b7ee9ebd4d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 381;
// }
// .vector-87 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/1a843645-0125-434c-98be-54dd908e542f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 384;
// }
// .flex-row-aac {
//   position: relative;
//   width: 75.889px;
//   height: 3.162px;
//   margin: -0.01px 0 0 6.324px;
//   z-index: 423;
// }
// .vector-88 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/31d18ffe-f2b9-45fe-bb64-a54c51651299.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 387;
// }
// .vector-89 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 4.17%;
//   background: url(/blank_certificate/redesigned_card/images/a27db8ae-d04c-4f9f-a0ae-e6ca0282e496.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 390;
// }
// .vector-8a {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 8.33%;
//   background: url(/blank_certificate/redesigned_card/images/8776538f-4317-484a-a24e-08a21835a081.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 393;
// }
// .vector-8b {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 45.83%;
//   background: url(/blank_certificate/redesigned_card/images/97c325d7-8de8-47c6-a70f-fefbb0477457.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 396;
// }
// .vector-8c {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 50%;
//   background: url(/blank_certificate/redesigned_card/images/281a7979-b618-4245-bbed-7d9b56b84121.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 399;
// }
// .vector-8d {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 54.17%;
//   background: url(/blank_certificate/redesigned_card/images/dcac59d6-b834-4578-a1e1-2214613f0091.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 402;
// }
// .vector-8e {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 58.33%;
//   background: url(/blank_certificate/redesigned_card/images/77986acf-87b4-4b81-804f-16f37ca77354.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 405;
// }
// .vector-8f {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 62.5%;
//   background: url(/blank_certificate/redesigned_card/images/630fff33-2304-408a-a8b5-6f93c64b232c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 408;
// }
// .vector-90 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 66.67%;
//   background: url(/blank_certificate/redesigned_card/images/98929f10-9f69-462a-99dd-a26efba2b4ec.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 411;
// }
// .vector-91 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 79.17%;
//   background: url(/blank_certificate/redesigned_card/images/fd676ac9-7c43-4356-a39a-4c35ad68dd3c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 414;
// }
// .vector-92 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 83.33%;
//   background: url(/blank_certificate/redesigned_card/images/645d08b0-d177-4ba5-9ca0-6c15b333f552.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 417;
// }
// .vector-93 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 87.5%;
//   background: url(/blank_certificate/redesigned_card/images/a69b89b7-cbe7-4534-91d0-17c1d05bc653.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 420;
// }
// .vector-94 {
//   position: absolute;
//   width: 4.17%;
//   height: 100%;
//   top: 0;
//   left: 95.83%;
//   background: url(/blank_certificate/redesigned_card/images/6893746d-4ba7-43f2-90ff-46e579109004.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 423;
// }
// .flex-row-c {
//   position: relative;
//   width: 91.7px;
//   height: 3.162px;
//   margin: 0px 0 0 6.324px;
//   z-index: 468;
// }
// .vector-95 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/de2af5ef-7c94-44ea-bbf6-6884074940c0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 426;
// }
// .vector-96 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 10.34%;
//   background: url(/blank_certificate/redesigned_card/images/5dead084-cc95-4632-ab72-05797dd86806.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 429;
// }
// .vector-97 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 17.24%;
//   background: url(/blank_certificate/redesigned_card/images/a4a0c16d-2a56-45c8-ab31-f71292b0b39c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 432;
// }
// .vector-98 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 20.69%;
//   background: url(/blank_certificate/redesigned_card/images/22e3c5ab-220c-41ea-9c67-4360ce1bc050.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 435;
// }
// .vector-99 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 27.59%;
//   background: url(/blank_certificate/redesigned_card/images/7d940fc7-b670-4db4-ae87-2d6be0a297c6.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 438;
// }
// .vector-9a {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/6a73b37f-5414-42ce-a396-1c29685a7852.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 441;
// }
// .vector-9b {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/93d8ac29-85ea-44f8-8af7-f914fe6accbf.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 450;
// }
// .vector-9c {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 72.41%;
//   background: url(/blank_certificate/redesigned_card/images/f43dc344-2b96-4515-9687-f21c2db93ed5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 453;
// }
// .vector-9d {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/c4138e1d-e0ac-4862-bcac-9deef94bc12c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 456;
// }
// .vector-9e {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 86.21%;
//   background: url(/blank_certificate/redesigned_card/images/8e249a97-6e01-4e15-8746-3beca24f4bb3.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 459;
// }
// .vector-9f {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 89.66%;
//   background: url(/blank_certificate/redesigned_card/images/4f994bd2-0a36-4ff1-8e6f-928d5b5c7532.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 462;
// }
// .vector-a0 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 93.1%;
//   background: url(/blank_certificate/redesigned_card/images/5f6799df-dc06-40a0-a8be-7d21a75f436c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 465;
// }
// .vector-a1 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 96.55%;
//   background: url(/blank_certificate/redesigned_card/images/1d78e8ff-08e1-449b-8553-b4e9437c101f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 468;
// }
// .regroup-a2 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 6.9%;
//   height: 100%;
//   top: 0;
//   left: 44.83%;
//   z-index: 447;
// }
// .vector-a3 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/91d255cd-bd34-4d08-9ce7-f0301ff50a51.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 444;
// }
// .vector-a4 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/a3a0ad79-5377-4157-af4c-010b44a7ff28.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 447;
// }
// .flex-row-cc-a5 {
//   position: relative;
//   width: 88.538px;
//   height: 3.162px;
//   margin: 0px 0 0 6.324px;
//   z-index: 489;
// }
// .vector-a6 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/a69f4fee-c91a-4d26-ad1c-9a191e34ea5f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 471;
// }
// .vector-a7 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 28.57%;
//   background: url(/blank_certificate/redesigned_card/images/dfa49ffd-0cf9-42af-86b0-802f7709ce9f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 474;
// }
// .vector-a8 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 39.29%;
//   background: url(/blank_certificate/redesigned_card/images/7c72e8d2-bb7f-4275-93ae-2a628a00f218.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 477;
// }
// .vector-a9 {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 53.57%;
//   background: url(/blank_certificate/redesigned_card/images/3eeb89bd-e2c4-4ff5-8633-66a91c159a8c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 480;
// }
// .vector-aa {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 60.71%;
//   background: url(/blank_certificate/redesigned_card/images/1ff9ab35-6128-4f8e-9611-3033624ed9d8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 483;
// }
// .vector-ab {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 89.29%;
//   background: url(/blank_certificate/redesigned_card/images/7920ba95-0077-43e9-be4e-2b8509d949b3.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 486;
// }
// .vector-ac {
//   position: absolute;
//   width: 3.57%;
//   height: 100%;
//   top: 0;
//   left: 96.43%;
//   background: url(/blank_certificate/redesigned_card/images/a94322d9-6482-4a7f-a690-16e437faa8a8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 489;
// }
// .flex-row-b-ad {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: relative;
//   width: 79.051px;
//   height: 3.162px;
//   margin: -0.01px 0 0 15.811px;
//   z-index: 528;
// }
// .vector-ae {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/1d1c3a17-b216-4acd-8bb0-05ad7851b178.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 492;
// }
// .vector-af {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/49d4c5b2-1463-49c3-b731-698d85eba2d4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 495;
// }
// .vector-b0 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/36caee39-450d-41eb-99ac-705a06523dab.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 498;
// }
// .vector-b1 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/45cec9ff-8e02-4845-8479-b453d939af28.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 501;
// }
// .vector-b2 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/d2773e41-73c3-4d83-8ac0-5dae4c94f1d5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 504;
// }
// .vector-b3 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/3019733f-b08f-47e5-9050-2b4dff1be57a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 507;
// }
// .vector-b4 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/d776c432-2f38-44ee-bb99-751d5bdf941d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 510;
// }
// .vector-b5 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/b0e4f31b-ea95-4ce6-ad56-798a5d6119cd.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 513;
// }
// .vector-b6 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/fdd105dc-0154-40c9-827b-67927508da6a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 516;
// }
// .vector-b7 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/b1aedef1-7a2a-48c3-b55c-301685e751fd.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 519;
// }
// .vector-b8 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/9fc1b2a4-a4e9-4e03-b95c-f43332630366.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 522;
// }
// .vector-b9 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/c50455f7-f0a3-4078-bce4-c8d3e4428b2e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 525;
// }
// .vector-ba {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/49fd447f-cd78-4971-997c-f05567e997d8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 528;
// }
// .flex-row-faf {
//   position: relative;
//   width: 85.375px;
//   height: 3.162px;
//   margin: 0.01px 0 0 12.648px;
//   z-index: 573;
// }
// .vector-bb {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/baa80112-0b4b-450b-8fa0-b2a9c259d02d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 531;
// }
// .vector-bc {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 3.7%;
//   background: url(/blank_certificate/redesigned_card/images/2cddb6a0-e221-406a-bec0-db23af44eeca.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 534;
// }
// .vector-bd {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 7.41%;
//   background: url(/blank_certificate/redesigned_card/images/32c756a2-8763-4202-9e37-489694ea6ba4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 537;
// }
// .vector-be {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 22.22%;
//   background: url(/blank_certificate/redesigned_card/images/0bfc5cbe-9d06-4e32-a3ae-3a916f6aba39.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 540;
// }
// .vector-bf {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 29.63%;
//   background: url(/blank_certificate/redesigned_card/images/8eefaa84-5eea-46ae-a9ae-837c171ee894.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 543;
// }
// .vector-c0 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 33.33%;
//   background: url(/blank_certificate/redesigned_card/images/48349575-b748-4650-b56c-58b659de6cbb.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 546;
// }
// .vector-c1 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 37.04%;
//   background: url(/blank_certificate/redesigned_card/images/2530fa6a-d1d6-4bea-9f59-2617bc855b3b.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 549;
// }
// .vector-c2 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 40.74%;
//   background: url(/blank_certificate/redesigned_card/images/18bfdf24-5812-4d0c-b231-327dd763b750.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 552;
// }
// .vector-c3 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 44.44%;
//   background: url(/blank_certificate/redesigned_card/images/7ac19e03-efc5-4966-9630-3e581ec71657.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 555;
// }
// .vector-c4 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 48.15%;
//   background: url(/blank_certificate/redesigned_card/images/72ad10a3-0af1-4e28-982b-d8fc69b6324e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 558;
// }
// .vector-c5 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 51.85%;
//   background: url(/blank_certificate/redesigned_card/images/836d40bc-b1cf-4630-9de3-b08647c9f8c8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 561;
// }
// .vector-c6 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 85.18%;
//   background: url(/blank_certificate/redesigned_card/images/9e4627b5-2167-4dba-ab73-e42465ffe387.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 570;
// }
// .vector-c7 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 96.3%;
//   background: url(/blank_certificate/redesigned_card/images/5eb6b3a9-3ffb-4ca2-b351-3e318e7eef4e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 573;
// }
// .regroup-c8 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 7.41%;
//   height: 100%;
//   top: 0;
//   left: 74.07%;
//   z-index: 567;
// }
// .vector-c9 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/934aeecb-804d-47fe-be7d-8c819f22d36d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 564;
// }
// .vector-ca {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/c62d7397-219b-4e01-8c8c-58d8cbeb162b.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 567;
// }
// .flex-row-ca {
//   position: relative;
//   width: 91.7px;
//   height: 3.162px;
//   margin: -0.01px 0 0 6.324px;
//   z-index: 618;
// }
// .vector-cb {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/f80ea1fc-e8dc-4b85-b688-058ffd3c6bd3.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 576;
// }
// .vector-cc {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 10.34%;
//   background: url(/blank_certificate/redesigned_card/images/cd34dfed-6847-40ba-9733-98064db8ed47.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 579;
// }
// .vector-cd {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 13.79%;
//   background: url(/blank_certificate/redesigned_card/images/2d36d3b0-d398-4bc1-9028-f22da82905df.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 582;
// }
// .vector-ce {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 20.69%;
//   background: url(/blank_certificate/redesigned_card/images/45dcb59a-576a-490d-b6df-4548450f4a67.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 585;
// }
// .vector-cf {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/d5a7bdda-9cf8-4681-ab4f-ed211062dd40.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 588;
// }
// .vector-d0 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/b7ed94a0-9bb4-4d64-9891-df6bbbbbf4ca.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 591;
// }
// .vector-d1 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/59f7d154-fd2a-45ec-8d6d-65d3f9c64eec.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 594;
// }
// .vector-d2 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/019eab76-eb32-4bfa-9422-b037f4e33f90.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 597;
// }
// .vector-d3 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/45364f39-e7cd-4619-9d68-b01e1bc44c5a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 600;
// }
// .vector-d4 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/932124a5-283b-4e7f-aa89-6a4c71698ea8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 603;
// }
// .vector-d5 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/d368fabb-0e2a-4775-b487-4fb0443a346a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 606;
// }
// .vector-d6 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/efe1d820-e7fb-436f-a7d8-1375e258f1fa.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 609;
// }
// .vector-d7 {
//   position: absolute;
//   width: 3.45%;
//   height: 100%;
//   top: 0;
//   left: 79.31%;
//   background: url(/blank_certificate/redesigned_card/images/9cd1eb21-4fd3-4c82-a58e-660685daeda9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 612;
// }
// .regroup-d8 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 6.9%;
//   height: 100%;
//   top: 0;
//   left: 93.1%;
//   z-index: 618;
// }
// .vector-d9 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/0a242d50-4ae8-4044-a81b-9977ae189a0c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 615;
// }
// .vector-da {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/70d19fe5-c8f6-43dc-88c5-3c53223d2d2f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 618;
// }
// .flex-row-cf {
//   position: relative;
//   width: 82.213px;
//   height: 3.162px;
//   margin: -0.01px 0 0 15.811px;
//   z-index: 663;
// }
// .vector-db {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/7b3fcb5e-d3ac-44e7-9c79-0e0caeac2d20.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 621;
// }
// .vector-dc {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 3.85%;
//   background: url(/blank_certificate/redesigned_card/images/e3c0f4b7-2766-4d36-8ee4-85f99865f1a9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 624;
// }
// .vector-dd {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 7.69%;
//   background: url(/blank_certificate/redesigned_card/images/07ab4ed0-88df-418b-aaa6-1effb1e86bd8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 627;
// }
// .vector-de {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 15.38%;
//   background: url(/blank_certificate/redesigned_card/images/672bc849-1915-4f29-8a00-d1b2b420ed12.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 630;
// }
// .vector-df {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 19.23%;
//   background: url(/blank_certificate/redesigned_card/images/25c2eeb0-b6b7-4016-b66c-8063793ac8c5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 633;
// }
// .vector-e0 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 23.08%;
//   background: url(/blank_certificate/redesigned_card/images/ed74c7ad-ad95-4b4c-b8e5-a0bba3f07873.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 636;
// }
// .vector-e1 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 26.92%;
//   background: url(/blank_certificate/redesigned_card/images/eb9c6aca-12fb-4ee4-aece-5fdd6980786d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 639;
// }
// .vector-e2 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 34.62%;
//   background: url(/blank_certificate/redesigned_card/images/c4999bd4-e93c-4e09-9fef-a79a0f0d2756.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 642;
// }
// .vector-e3 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 42.31%;
//   background: url(/blank_certificate/redesigned_card/images/f1e0d890-90f6-4e33-8103-d8a28e8e3756.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 645;
// }
// .vector-e4 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 53.85%;
//   background: url(/blank_certificate/redesigned_card/images/d5f4362a-d27c-488d-9404-67136ae565c7.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 648;
// }
// .vector-e5 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 57.69%;
//   background: url(/blank_certificate/redesigned_card/images/c3073d9b-2da7-4968-87a2-87f128931ac8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 651;
// }
// .vector-e6 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 61.54%;
//   background: url(/blank_certificate/redesigned_card/images/696c8d1f-ccf3-46ac-8ea9-83d878a5203e.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 654;
// }
// .vector-e7 {
//   position: absolute;
//   width: 3.85%;
//   height: 100%;
//   top: 0;
//   left: 65.38%;
//   background: url(/blank_certificate/redesigned_card/images/0a12ae2c-a7b8-4cac-966f-86c64f58b5a8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 657;
// }
// .regroup-e8 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 7.69%;
//   height: 100%;
//   top: 0;
//   left: 92.31%;
//   z-index: 663;
// }
// .vector-e9 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/002d1b93-7a50-4232-80cb-c0ac07437c01.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 660;
// }
// .vector-ea {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/501d8023-0570-4607-bc35-ba5d1bb26b5a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 663;
// }
// .flex-row {
//   position: relative;
//   width: 85.375px;
//   height: 3.162px;
//   margin: 0.01px 0 0 6.324px;
//   z-index: 708;
// }
// .vector-eb {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/192d2cfc-32bd-4904-98aa-47aae18fbb24.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 666;
// }
// .vector-ec {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 7.41%;
//   background: url(/blank_certificate/redesigned_card/images/dfa52791-21fb-441b-a405-f6450090dd9d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 669;
// }
// .vector-ed {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 14.82%;
//   background: url(/blank_certificate/redesigned_card/images/2c7a95ab-783e-43cd-91ed-332db90d26dc.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 672;
// }
// .vector-ee {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 22.22%;
//   background: url(/blank_certificate/redesigned_card/images/4724b4f3-9668-4369-aaca-85a20ee7a4b5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 675;
// }
// .vector-ef {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 29.63%;
//   background: url(/blank_certificate/redesigned_card/images/94ffa33d-45c9-4b6b-8255-c1572b02947f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 678;
// }
// .vector-f0 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 55.56%;
//   background: url(/blank_certificate/redesigned_card/images/82ce454e-c807-42f6-9968-38929e505a00.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 687;
// }
// .vector-f1 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 70.37%;
//   background: url(/blank_certificate/redesigned_card/images/b1e8c87e-97e2-48f3-b2d1-6c4fecdce0f1.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 690;
// }
// .vector-f2 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 74.07%;
//   background: url(/blank_certificate/redesigned_card/images/e566df1b-7f12-4a86-8541-8ac329501455.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 693;
// }
// .vector-f3 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 77.78%;
//   background: url(/blank_certificate/redesigned_card/images/63d85413-d017-459b-911d-b57e705d6bbf.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 696;
// }
// .vector-f4 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 81.48%;
//   background: url(/blank_certificate/redesigned_card/images/8c9c34ff-f048-4e2a-8e25-c0140fe2fee2.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 699;
// }
// .vector-f5 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 85.18%;
//   background: url(/blank_certificate/redesigned_card/images/91316df6-e1df-4df1-8789-f795e46a3f27.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 702;
// }
// .vector-f6 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 88.89%;
//   background: url(/blank_certificate/redesigned_card/images/1f91728a-9167-4d36-bdd3-4d3629871d92.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 705;
// }
// .vector-f7 {
//   position: absolute;
//   width: 3.7%;
//   height: 100%;
//   top: 0;
//   left: 96.3%;
//   background: url(/blank_certificate/redesigned_card/images/3aadf468-ddd6-4118-8d82-c6067376f09c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 708;
// }
// .regroup-f8 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 7.41%;
//   height: 100%;
//   top: 0;
//   left: 40.74%;
//   z-index: 684;
// }
// .vector-f9 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/0f2413af-b8b1-4ae2-8391-c585cb22a8e8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 681;
// }
// .vector-fa {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/d7d31485-22f0-4c7f-ae3f-7ee566eebbb2.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 684;
// }
// .flex-row-e {
//   position: relative;
//   width: 66.403px;
//   height: 3.162px;
//   margin: 0.01px 0 0 31.621px;
//   z-index: 741;
// }
// .vector-fb {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/153169c0-6cee-4fe4-b951-0275c0a00183.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 711;
// }
// .vector-fc {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 9.52%;
//   background: url(/blank_certificate/redesigned_card/images/e2c36795-2fd7-4e94-bf3a-adbee900cc34.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 714;
// }
// .vector-fd {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 14.29%;
//   background: url(/blank_certificate/redesigned_card/images/65b1698f-71d6-4073-a081-f6e7e447b55f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 717;
// }
// .vector-fe {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 28.57%;
//   background: url(/blank_certificate/redesigned_card/images/f7f171a5-8b99-44d6-94be-1cd46906fa08.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 720;
// }
// .vector-ff {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 33.33%;
//   background: url(/blank_certificate/redesigned_card/images/1a80c289-9d22-4cd7-b601-0cbfb1010454.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 723;
// }
// .vector-100 {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 76.19%;
//   background: url(/blank_certificate/redesigned_card/images/f8e790fa-669c-44d1-afe3-964c5567acb1.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 732;
// }
// .vector-101 {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 85.71%;
//   background: url(/blank_certificate/redesigned_card/images/9a65a275-5803-4808-9ec7-9ce846a49f22.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 735;
// }
// .vector-102 {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 90.48%;
//   background: url(/blank_certificate/redesigned_card/images/723928df-7816-4f47-a5e9-b258dc0f3edd.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 738;
// }
// .vector-103 {
//   position: absolute;
//   width: 4.76%;
//   height: 100%;
//   top: 0;
//   left: 95.24%;
//   background: url(/blank_certificate/redesigned_card/images/090430fa-47aa-4f46-bac4-637c5b323137.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 741;
// }
// .regroup-104 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 9.52%;
//   height: 100%;
//   top: 0;
//   left: 52.38%;
//   z-index: 729;
// }
// .vector-105 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/91d1bec5-268c-44b2-9da4-4435238d4c3f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 726;
// }
// .vector-106 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/89b06077-6362-4550-9dc0-d9fbe73a20e4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 729;
// }
// .flex-row-baa-107 {
//   position: relative;
//   width: 91.7px;
//   height: 22.134px;
//   margin: 0px 0 0 6.324px;
//   z-index: 984;
// }
// .group-108 {
//   position: absolute;
//   width: 24.14%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/4f481a17-66b4-4edc-9e24-2e917015a4fe.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 984;
// }
// .vector-109 {
//   position: relative;
//   width: 9.486px;
//   height: 9.486px;
//   margin: 6.32px 0 0 6.324px;
//   background: url(/blank_certificate/redesigned_card/images/df84c8ac-5ae8-4bbf-9976-28ca4cf49979.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 993;
// }
// .vector-10a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/be85b427-4d81-4bcc-a3a2-2b358173e6bc.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 744;
// }
// .vector-10b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/4c24f4dc-df54-45f3-9189-277a1f4b3057.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 747;
// }
// .vector-10c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/574b37fe-93cb-4a65-bb15-8ab82b3f5f5a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 750;
// }
// .vector-10d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/443658ea-e923-4823-8cfd-246ef5672ef6.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 753;
// }
// .vector-10e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/0c13ff42-d8da-4aee-944a-6755c768d423.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 756;
// }
// .vector-10f {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/b66787aa-bbe4-413d-8c4b-485ba10976b0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 759;
// }
// .vector-110 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 82.76%;
//   background: url(/blank_certificate/redesigned_card/images/a27e835b-9cfe-4ca7-bca0-e44423fc03d0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 762;
// }
// .vector-111 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 0;
//   left: 93.1%;
//   background: url(/blank_certificate/redesigned_card/images/b060d59a-1baf-4428-b65e-233d6e05b9ae.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 765;
// }
// .vector-112 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 27.59%;
//   background: url(/blank_certificate/redesigned_card/images/623472d2-a871-4dc9-bbc3-7bdb3478b4d0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 768;
// }
// .vector-113 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/f267f7af-1b68-4712-9674-66aaba1db1e4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 771;
// }
// .vector-114 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 37.93%;
//   background: url(/blank_certificate/redesigned_card/images/132f88d0-a916-4bc3-8878-5724f1d9e7e3.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 774;
// }
// .vector-115 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/73cfbca1-e58e-402c-bec6-c691346c46df.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 777;
// }
// .vector-116 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/970e5603-c119-451d-9eda-717b782f1c39.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 780;
// }
// .vector-117 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/49ad3210-0a91-4f6b-9657-f1ae7a343371.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 783;
// }
// .vector-118 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/b81e1183-ade6-4e89-952f-f833c9674c2f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 786;
// }
// .vector-119 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/936058b0-d390-4113-a610-e5d06faad030.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 789;
// }
// .vector-11a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 82.76%;
//   background: url(/blank_certificate/redesigned_card/images/aee2b8a8-da5a-4854-98ae-021b4e1f122d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 792;
// }
// .vector-11b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 86.21%;
//   background: url(/blank_certificate/redesigned_card/images/eacd7fea-e298-4908-85ea-2316f038096d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 795;
// }
// .vector-11c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 14.28%;
//   left: 89.66%;
//   background: url(/blank_certificate/redesigned_card/images/4c0fbd2f-84a0-4ac3-b6dc-9f1076ab75ba.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 798;
// }
// .vector-11d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/0acd9c8a-8e92-4a3b-8285-ef866a950d38.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 801;
// }
// .vector-11e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/ec492f71-7743-4fe3-82b3-6dbc4d9df619.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 804;
// }
// .vector-11f {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 37.93%;
//   background: url(/blank_certificate/redesigned_card/images/f67b3902-f076-47b2-8b4c-1e7fa05cfebc.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 807;
// }
// .vector-120 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/d2c1fed5-a7ba-4ba6-9351-084453a8163d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 810;
// }
// .vector-121 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/6fc448d8-6e42-4340-ab16-dab4b643bd01.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 813;
// }
// .vector-122 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/9f417d1f-29e7-4a71-8a00-af237d5a77ea.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 816;
// }
// .vector-123 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/b4b2fdc7-c632-44a7-980a-267153c0e607.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 819;
// }
// .vector-124 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/43ccd68a-b6d0-43c5-ae98-89dd64e6ebfc.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 822;
// }
// .vector-125 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 72.41%;
//   background: url(/blank_certificate/redesigned_card/images/7ae6e1eb-c912-4ce1-9ce7-69ec13a43f61.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 825;
// }
// .vector-126 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/1fe537c2-0edb-44d9-a760-30dae27c0b74.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 828;
// }
// .vector-127 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 79.31%;
//   background: url(/blank_certificate/redesigned_card/images/c96fcd37-31b2-4b93-9528-2359d672682d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 831;
// }
// .vector-128 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 82.76%;
//   background: url(/blank_certificate/redesigned_card/images/acd5d12c-bbce-42ac-a1fe-31f3830fda61.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 834;
// }
// .vector-129 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 28.55%;
//   left: 93.1%;
//   background: url(/blank_certificate/redesigned_card/images/e4080df0-75e9-4016-b6c5-31b5edf30b9a.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 837;
// }
// .vector-12a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 27.59%;
//   background: url(/blank_certificate/redesigned_card/images/e0d58950-41af-4263-9307-7c1e6c114a75.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 840;
// }
// .vector-12b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/758bf191-8c26-4304-9eda-7444258a70d7.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 843;
// }
// .vector-12c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/97a3f45c-63f7-4e6a-ad81-0b8eca9c6872.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 846;
// }
// .vector-12d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/0c07c6b8-1691-40f1-94b9-a33f3a817278.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 849;
// }
// .vector-12e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 44.83%;
//   background: url(/blank_certificate/redesigned_card/images/db4da563-6a60-4c26-b83f-8bac03c59f1d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 852;
// }
// .vector-12f {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/8a5652ba-f6ec-4fdb-91ca-6c78d6755791.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 855;
// }
// .vector-130 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/366ee4a8-9f60-4440-9771-c8f651ecc928.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 858;
// }
// .vector-131 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/22700130-24ea-4437-9616-db001ed98fc6.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 861;
// }
// .vector-132 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/c0b1b4b1-8247-4d47-ad43-6c60d9021bba.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 864;
// }
// .vector-133 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 82.76%;
//   background: url(/blank_certificate/redesigned_card/images/5d6828f2-0132-4e73-b483-e6e36e5e59aa.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 867;
// }
// .vector-134 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 86.21%;
//   background: url(/blank_certificate/redesigned_card/images/109edc8c-136a-4ca0-b712-b60300a7cb4d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 870;
// }
// .vector-135 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 89.66%;
//   background: url(/blank_certificate/redesigned_card/images/2e55c33e-8001-46ab-bbf5-1195fcd30474.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 873;
// }
// .vector-136 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 42.81%;
//   left: 96.55%;
//   background: url(/blank_certificate/redesigned_card/images/60d845cd-ea82-420b-8dc2-ae612e56cfbd.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 876;
// }
// .vector-137 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 37.93%;
//   background: url(/blank_certificate/redesigned_card/images/ec7cfb41-31fd-4f3e-b20d-abc03e1b5b0f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 879;
// }
// .vector-138 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 41.38%;
//   background: url(/blank_certificate/redesigned_card/images/588f5bb2-af65-4c4b-81b6-0fb696dd41b9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 882;
// }
// .vector-139 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 44.83%;
//   background: url(/blank_certificate/redesigned_card/images/ffc9a2cc-86e7-4fe6-878f-6a83a087511f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 885;
// }
// .vector-13a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/59fb36fe-f9e2-4885-89a5-317fe8ad53d2.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 888;
// }
// .vector-13b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 51.72%;
//   background: url(/blank_certificate/redesigned_card/images/01946936-8447-477a-b726-70335bff3367.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 891;
// }
// .vector-13c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/f4eede6e-4640-413a-afa6-a895d5f53bab.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 894;
// }
// .vector-13d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/98c817f2-f63c-4777-9ed1-0831df8ff8d5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 897;
// }
// .vector-13e {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 82.76%;
//   background: url(/blank_certificate/redesigned_card/images/91bbf97d-6204-4bb5-987e-233716544918.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 900;
// }
// .vector-13f {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 86.21%;
//   background: url(/blank_certificate/redesigned_card/images/fd948708-dde7-450b-a95a-75960f2dec70.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 903;
// }
// .vector-140 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 89.66%;
//   background: url(/blank_certificate/redesigned_card/images/03ae5842-bca9-4450-a39c-9d5a418ee5c4.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 906;
// }
// .vector-141 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 57.14%;
//   left: 96.55%;
//   background: url(/blank_certificate/redesigned_card/images/8c1c485e-c88e-421e-9c16-80cae0eb5528.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 909;
// }
// .vector-142 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 31.03%;
//   background: url(/blank_certificate/redesigned_card/images/283d5fc6-ec0a-405d-8e04-f3522c7b506f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 912;
// }
// .vector-143 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 34.48%;
//   background: url(/blank_certificate/redesigned_card/images/45c14d9a-6cbe-4017-897f-a143206b5ae0.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 915;
// }
// .vector-144 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 48.28%;
//   background: url(/blank_certificate/redesigned_card/images/ee8cf017-f881-4faa-8f09-182e7e408406.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 918;
// }
// .vector-145 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 55.17%;
//   background: url(/blank_certificate/redesigned_card/images/28648c90-f820-4ac4-9b5d-dcbfe29fa122.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 921;
// }
// .vector-146 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 58.62%;
//   background: url(/blank_certificate/redesigned_card/images/6be4f8de-5f61-4700-bba3-76f2151bbed8.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 924;
// }
// .vector-147 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 62.07%;
//   background: url(/blank_certificate/redesigned_card/images/10e584b9-3787-4966-83f7-e90ba4b74b0b.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 927;
// }
// .vector-148 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 65.52%;
//   background: url(/blank_certificate/redesigned_card/images/e9d378c5-0aa1-4646-b044-14087c2c8fc5.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 930;
// }
// .vector-149 {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 68.97%;
//   background: url(/blank_certificate/redesigned_card/images/0f80ca9d-db52-4f45-9ba0-bce25c38efa9.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 933;
// }
// .vector-14a {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 72.41%;
//   background: url(/blank_certificate/redesigned_card/images/4a8218ce-f0a7-46cd-abdd-dcaf0c89d792.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 936;
// }
// .vector-14b {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 75.86%;
//   background: url(/blank_certificate/redesigned_card/images/1b4aa720-3fa9-41ad-911b-f0ad5024e6dc.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 939;
// }
// .vector-14c {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 82.76%;
//   background: url(/blank_certificate/redesigned_card/images/bf4d8871-5a14-49b1-be3d-2537d9dfd872.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 942;
// }
// .vector-14d {
//   position: absolute;
//   width: 3.45%;
//   height: 14.29%;
//   top: 71.42%;
//   left: 93.1%;
//   background: url(/blank_certificate/redesigned_card/images/d94f8840-5c99-45a7-b7c2-6860654c2758.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 945;
// }
// .flex-row-14e {
//   position: relative;
//   width: 63.241px;
//   height: 3.162px;
//   margin: -3.162px 0 0 31.621px;
//   z-index: 975;
// }
// .vector-14f {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/8f7db39a-5969-422e-9835-1701c9920551.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 948;
// }
// .vector-150 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 25%;
//   background: url(/blank_certificate/redesigned_card/images/96c2c654-63fd-495c-8cbb-7bd06dd89273.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 951;
// }
// .vector-151 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 30%;
//   background: url(/blank_certificate/redesigned_card/images/6b6f6fb0-65ee-46c6-ae4f-b2c64f795601.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 954;
// }
// .vector-152 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 35%;
//   background: url(/blank_certificate/redesigned_card/images/34eb4ff5-5023-4382-b1b9-01a11d8d1389.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 957;
// }
// .vector-153 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 50%;
//   background: url(/blank_certificate/redesigned_card/images/7a72fa8b-5ee7-49ac-91b2-76c3beb51b87.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 960;
// }
// .vector-154 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 60%;
//   background: url(/blank_certificate/redesigned_card/images/dc8f21b3-f24e-4dd1-92b1-5da566f2fcda.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 963;
// }
// .vector-155 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 65%;
//   background: url(/blank_certificate/redesigned_card/images/c71ad0ef-80a1-416a-bf75-8db51b585781.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 966;
// }
// .vector-156 {
//   position: absolute;
//   width: 5%;
//   height: 100%;
//   top: 0;
//   left: 95%;
//   background: url(/blank_certificate/redesigned_card/images/a6180ba8-e1a6-4880-ae89-e9a69a82476d.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 975;
// }
// .regroup-157 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: absolute;
//   width: 10%;
//   height: 100%;
//   top: 0;
//   left: 75%;
//   z-index: 972;
// }
// .vector-158 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/bd37717b-36ba-470d-98e8-26e344fa133f.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 969;
// }
// .vector-159 {
//   flex-shrink: 0;
//   position: relative;
//   width: 3.162px;
//   height: 3.162px;
//   background: url(/blank_certificate/redesigned_card/images/0de0c77f-6735-441f-a127-60647533f54c.png)
//     no-repeat center;
//   background-size: 100% 100%;
//   z-index: 972;
// }
// .date-range {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   height: 44px;
//   top: 8.172px;
//   left: 145.454px;
//   color: #ffffff;
//   font-family: Inter, var(--default-font-family);
//   font-size: 16px;
//   font-weight: 400;
//   line-height: 32px;
//   text-align: left;
//   white-space: nowrap;
//   letter-spacing: -0.64px;
//   z-index: 9;
// }
// .date-info {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   height: 44px;
//   top: 9.199px;
//   left: 0;
//   color: rgba(255, 255, 255, 0.5);
//   font-family: Inter, var(--default-font-family);
//   font-size: 16px;
//   font-weight: 400;
//   line-height: 32px;
//   text-align: left;
//   white-space: nowrap;
//   letter-spacing: -0.64px;
//   z-index: 8;
// }
// .qr-code {
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   position: absolute;
//   height: 11px;
//   top: 79.742px;
//   left: 0;
//   color: #ffffff;
//   font-family: Inter, var(--default-font-family);
//   font-size: 15px;
//   font-weight: 400;
//   line-height: 11px;
//   text-align: left;
//   white-space: nowrap;
//   letter-spacing: -0.6px;
//   z-index: 10;
// }
// .rectangle-15a {
//   position: relative;
//   width: 493px;
//   height: 20.063px;
//   margin: 21.924px 0 0 0;
//   background: #ffffff;
//   z-index: 1001;
// }
// .shape {
//   position: absolute;
//   width: 100%;
//   height: 101.54%;
//   top: 0;
//   left: 0;
//   background: url(/blank_certificate/redesigned_card/images/3515823e-6fe1-429b-8ae4-efc3c88472d3.png)
//     no-repeat center;
//   background-size: 100% 100%;
// }

//   `
// }


// export const fetchHtml = async (item:any) => {
//   const htmlString = `
//   <!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// <title>Generated by Codia AI</title>
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
// <style>
// :root {
// --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
// Ubuntu, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
// "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei",
// "Source Han Sans CN", sans-serif;
// }

// .main-container {
// overflow: hidden;
// }

// .main-container,
// .main-container * {
// box-sizing: border-box;
// }

// input,
// select,
// textarea,
// button {
// outline: 0;
// }

// .main-container {
// position: relative;
// width: 595px;
// height: 842px;
// margin: 0 auto;
//     margin-top: 30px;
// background: #ffffff;
// overflow: hidden;
// }
// .rectangle {
// position: absolute;
// width: 43.224px;
// height: 883.813px;
// top: -16.328px;
// left: 0;
// background: #8d1b3d;
// z-index: 11;
// }
// .whatsapp-image {
// position: absolute;
// width: 178.444px;
// height: 50.344px;
// top: 78.535px;
// left: 67.5px;
// background: url(/blank_certificate/images/8c6dea95de03a5cdcee3820f6ffcd969fa994d12.png)
// no-repeat center;
// background-size: cover;
// z-index: 10;
// }
// .qr-code-verification-report {
// position: absolute;
// width: 514.973px;
// height: 34px;
// top: 155.484px;
// left: 71.944px;
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 400;
// line-height: 22px;
// text-align: left;
// letter-spacing: -0.64px;
// z-index: 4;
// }
// .qr-code-verification-report-1 {
// position: relative;
// color: #171717;
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 700;
// line-height: 22px;
// text-align: left;
// letter-spacing: -0.64px;
// }
// .qr-code-authenticated-results {
// position: relative;
// color: #171717;
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 400;
// line-height: 22px;
// text-align: left;
// letter-spacing: -0.64px;
// }
// .profile-photo {
// position: absolute;
// width: 17.31%;
// height: 13.06%;
// top: 27.34%;
// left: 12.09%;
// background: url(${item?.avatar})
// no-repeat center;
// background-size: cover;
// z-index: 9;
// border-radius: 15px;
// }
// .sheik-hameed-khan {
// display: flex;
// align-items: flex-start;
// justify-content: flex-start;
// position: absolute;
// height: 3.09%;
// top: 43.57%;
// padding-top: 13px;
// left: 12.09%;
// color: #171717;
// font-family: Inter, var(--default-font-family);
// font-size: 24px;
// font-weight: 600;
// line-height: 26px;
// text-align: center;
// white-space: nowrap;
// z-index: 8;
// }
// .nome {
// display: flex;
// align-items: flex-start;
// flex-wrap: nowrap;
// gap: 15.485px;
// position: absolute;
// width: 174px;
// height: 157px;
// top: 50%;
// left: 50%;
// transform: translate(-129.63%, -7.14%);
// }
// .apparicio-junior {
// display: flex;
// align-items: flex-start;
// justify-content: flex-start;
// flex-shrink: 0;
// position: relative;
// width: 174px;
// height: 157px;
// color: #171717;
// font-family: Inter, var(--default-font-family);
// font-size: 20px;
// font-weight: 500;
// line-height: 33.233px;
// text-align: left;
// text-overflow: initial;
// letter-spacing: -0.8px;
// z-index: 1;
// overflow: hidden;
// }
// .qube-inspection-basic {
// display: flex;
// align-items: flex-start;
// justify-content: flex-start;
// position: absolute;
// width: 340.257px;
// height: 132px;
// top: 468.398px;
// left: 259.973px;
// color: #171717;
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 400;
// line-height: 30px;
// text-align: left;
// letter-spacing: -0.64px;
// z-index: 3;
// }
// .qatar-id-company {
// display: flex;
// align-items: flex-start;
// justify-content: flex-start;
// position: absolute;
// width: 163.029px;
// height: 132px;
// top: calc(50% - -47.4px);
// left: calc(50% - 225.56px);
// color: rgba(0, 0, 0, 0.5);
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 400;
// line-height: 30px;
// text-align: left;
// letter-spacing: -0.64px;
// z-index: 2;
// }
// .line {
// position: absolute;
// width: 62.71%;
// height: 0.18%;
// top: 70.29%;
// left: 12.09%;
// background: url(/blank_certificate/images/ed1ac0da-e9fe-4b76-b073-cc9e922ba016.png)
// no-repeat center;
// background-size: 100% 100%;
// z-index: 5;
// }
// .issued-expiry {
// display: flex;
// align-items: flex-start;
// justify-content: flex-start;
// position: absolute;
// height: 5.23%;
// top: 75.55%;
// left: 12.09%;
// color: rgba(0, 0, 0, 0.5);
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 400;
// line-height: 32px;
// text-align: left;
// white-space: nowrap;
// letter-spacing: -0.64px;
// z-index: 6;
// }
// .date {
// display: flex;
// align-items: flex-start;
// justify-content: flex-start;
// position: absolute;
// height: 5.23%;
// top: 75.55%;
// left: 43.69%;
// color: #171717;
// font-family: Inter, var(--default-font-family);
// font-size: 16px;
// font-weight: 400;
// line-height: 32px;
// text-align: left;
// white-space: nowrap;
// letter-spacing: -0.64px;
// z-index: 7;
// }
// .contact-info {
// display: flex;
// align-items: flex-start;
// justify-content: flex-end;
// position: absolute;
// width: 104.24%;
// height: 2.02%;
// top: 95.93%;
// left: -8.43%;
// color: #8d1b3d;
// font-family: Inter, var(--default-font-family);
// font-size: 12px;
// font-weight: 500;
// line-height: 17px;
// text-align: right;
// white-space: nowrap;
// letter-spacing: 0.24px;
// z-index: 12;
// }

// </style>
// </head>
// <body>
// <div class="main-container">
// <div class="rectangle"></div>
// <div class="whatsapp-image"></div>
// <div class="qr-code-verification-report">
// <span class="qr-code-verification-report-1"
// >QR Code Verification Report<br /></span
// ><span class="qr-code-authenticated-results"
// >This QR code is authenticated and the results are as below</span
// >
// </div>
// <div class="profile-photo"></div>
// <span class="sheik-hameed-khan">${item?.name?.toUpperCase()}</span>
// <div class="nome">
// <span class="apparicio-junior">${item?.certificate_no}<br /><br /></span>
// </div>
// <span class="qube-inspection-basic"
// >${item?.id_no}<br />${item?.company?.toUpperCase()}<br />${item?.designation?.toUpperCase()}<br />${item?.model_level?.toUpperCase()}<br />${item?.course_duration} ${Number(item?.course_duration) > 1 ? "DAYS" : "DAY"}</span
// ><span class="qatar-id-company"
// >Qatar ID/ ID No.: <br />Company name:<br />Designation:<br />Model/
// Level:<br />Course Duration:</span
// >
// <div class="line"></div>
// <span class="issued-expiry">Issued Date: <br />Expiry Date:</span
// ><span class="date">${item?.issued_on}<br />${item?.valid_untill}</span
// ><span class="contact-info"
// >+974 31499334 | Info@qubeinspection.com | www.qubeinspection.com</span
// >
// </div>
// <!-- Generated by Codia AI - https://codia.ai/ -->
// </body>
// </html>

//   `
  
//   return htmlString;
// };

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
  if(dateString == "Not Applicable") return dateString
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

export const cssStringUpdated =  (item:any) => {
   
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
  font-size: 0px;
  background: #ffffff;
  overflow: hidden;
}
 
    .sheik-hameed-khan {
    display: block;
    position: relative;
    height: 26px;
    margin-top: 339.965px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    
    color: #000000;
    font-family: Inter, var(--default-font-family);
    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
    text-align: left;
    white-space: nowrap;
    z-index: 24;
  }
.nome {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 15.485px;
  position: relative;
  width: 214.634px;
  margin: 10.184px 0 0 137.697px;
  z-index: 17;
}
.qsis-tra {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  width: 214.634px;
  height: 21.555px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 700;
  line-height: 21.555px;
  text-align: center;
  white-space: nowrap;
  letter-spacing: -0.64px;
  z-index: 18;
}
.rectangle {
  position: absolute;
  width: 568.94px;
  height: 949.422px;
  top: -12px;
  left: -50.057px;
  opacity: 0.2;
  z-index: 7;
}
.layer {
  position: absolute;
  width: 40.37%;
  height: 29.18%;
  top: 0;
  left: -1.62%;
  background: url(./card-assets/figma-1.png)
    no-repeat center;
  background-size: 100% 100%;
}
.layer-1 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(./card-assets/figma-1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 1;
}
.whatsapp-image {
  position: absolute;
  width: 318.266px;
  height: 89.845px;
  top: 28.285px;
  left: 85.881px;
  background: url(./card-assets/logo.jpg)
    no-repeat center;
  background-size: cover;
  z-index: 16;
  border-radius: 13px;
}
.aplicar-estilo {
  position: absolute;
  width: 161px;
  height: 182px;
  top: 50%;
  left: 50%;
  border: 1px solid #8d1b3d;
  transform: translate(-51.23%, -139.61%);
  z-index: 6022;
  overflow: hidden;
  border-radius: 30.971px;
}
.profile-photo {
  position: absolute;
  width: 100%;
  height: 100%;
  
  left: 0;
  background: url(${item?.avatar})
    no-repeat center;
  background-size: cover;
  z-index: 23;
  object-fit: cover;
}
.vector {
  position: absolute;
  width: 786.593px;
  height: 108.988px;
  top: 209.195px;
  left: -192.73px;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/QtqkkpaFt6.png)
    no-repeat center;
  background-size: cover;
  z-index: 16;
}
.rectangle-2 {
  position: absolute;
  width: 102.12%;
  height: 12.73%;
  top: 26.55%;
  left: -1.62%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/Y8e0tQqFyT.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 3000;
}
.qube-inspection {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 379.964px;
  height: 72.945px;
  top: 429.949px;
  left: 186.027px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  line-height: 29px;
  text-align: left;
  letter-spacing: -0.72px;
  z-index: 28;
}
.qatar-id-company-name {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 168.536px;
  height: 158px;
  top: calc(50% - -35.95px);
  left: calc(50% - 214.47px);
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  line-height: 29px;
  text-align: left;
  letter-spacing: -0.72px;
  z-index: 27;
}
.layer-3 {
  position: absolute;
  width: 46.94%;
  height: 25.89%;
  top: 59.94%;
  left: 31.96%;
  background: url(./card-assets/6ENtHaYJLO.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 26;
}
.vector-4 {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 63.2%;
  left: 59.75%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/rheQbTb3wS.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 13;
}
.vector-5 {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 64.79%;
  left: 61.39%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/gV1C4OJnc5.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 11;
}
.safe-building-maintenance {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 309.451px;
  height: 37px;
  top: 518.355px;
  left: 185.098px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  letter-spacing: -0.72px;
  z-index: 29;
}
.vector-6 {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 66.58%;
  left: 63.6%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/UqBhr2UsKN.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 14;
}
.group {
  position: relative;
    width: 134.133px;
    height: 134.133px;
    margin: 103.151px 0 0 36.398px;
  background: url(${item?.qr_url})
    no-repeat center;
  background-size: cover;
  z-index: 25;
}
.vector-7 {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 68.17%;
  left: 65.23%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/T63JCxmQ9u.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 10;
}
.vector-8 {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 70%;
  left: 66.6%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/SwoPo7jpkZ.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 9;
}
.layer-9 {
  position: absolute;
  width: 48.12%;
  height: 39.29%;
  top: 33.48%;
  left: 58.2%;
  background: url(./card-assets/VhyRMvhut8-1.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 4;
}
.vector-a {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 71.58%;
  left: 68.23%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/zpGOypOZuu.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 12;
}
.safety-model {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 309.451px;
  height: 37px;
  top: 573.41px;
  left: 186.027px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  letter-spacing: -0.72px;
  z-index: 30;
}
.vector-b {
  position: absolute;
  width: 70.78%;
  height: 70.34%;
  top: 73.54%;
  left: 69.64%;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-04/aCawHmK1zq.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 8;
}
.date-range {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 163.029px;
  height: 37px;
  top: 663.371px;
  left: 185.098px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  letter-spacing: -0.72px;
  z-index: 20;
}
.issued-expiry {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  width: 163.029px;
  height: 37px;
  top: 664.395px;
  left: 32px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  letter-spacing: -0.72px;
  z-index: 19;
}
.scan-qr-code {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 12px;
  top: 727.926px;
  left: 32px;
  color: #000000;
  font-family: Inter, var(--default-font-family);
  font-size: 16px;
  font-weight: 400;
  line-height: 12px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: -0.64px;
  z-index: 21;
}
.rectangle-c {
  position: absolute;
  width: 541.024px;
  height: 41.008px;
  top: 767.938px;
  left: -16.939px;
  background: #8d1b3d;
  z-index: 15;
}
.rectangle-d {
  position: relative;
  width: 493px;
  height: 20.063px;
  margin: 0 0 0 16.939px;
  background: #8d1b3d;
  z-index: 5;
}

  `
}

export const splitCompany = (company: string) => {
  if (!company) return { company1: '', company2: '' };
  
  // Split the company name into words
  const words = company.split(' ');
  let company1 = '';
  let company2 = '';
  
  // If the company name is short enough, keep it all in company1
  if (company.length <= 30) {
    return { company1: company, company2: '' };
  }
  
  // Find the best split point to avoid breaking phrases
  let bestSplitIndex = -1;
  let minDifference = Infinity;
  
  // Try different split points to find the most balanced one
  for (let i = 1; i < words.length; i++) {
    const firstPart = words.slice(0, i).join(' ');
    const secondPart = words.slice(i).join(' ');
    
    if (firstPart.length <= 30 && secondPart.length <= 30) {
      const difference = Math.abs(firstPart.length - secondPart.length);
      if (difference < minDifference) {
        minDifference = difference;
        bestSplitIndex = i;
      }
    }
  }
  
  // If we found a good split point, use it
  if (bestSplitIndex > 0) {
    company1 = words.slice(0, bestSplitIndex).join(' ');
    company2 = words.slice(bestSplitIndex).join(' ');
  } else {
    // Otherwise, split at character level as a fallback
    company1 = company.substring(0, 30);
    company2 = company.substring(30);
  }
  
  return { company1, company2 };
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