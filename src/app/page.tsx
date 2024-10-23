'use client'
import React from 'react';


function CertificateApp() {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Certificate</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              font-family: Arial, sans-serif;
            }
            .certificate-container {
              padding: 20px;
              border: 1px solid #ccc;
              width: 700px;
              margin: 50px auto;
              text-align: center;
            }
            h2 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 10px;
            }
            p {
              font-size: 18px;
              margin: 5px 0;
            }
            .footer {
              margin-top: 40px;
              text-align: left;
            }
            .signature {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <h2>This is to certify that</h2>
            <h1>Anshad</h1>
            <p>Qatar ID/Passport No.: QID12345</p>
            <p>Company/Employer: XYZ Company</p>
            <p>Has successfully completed a course/assessment as Software Engineer Training</p>
            <div class="footer">
              <p>Issued Date: 12/02/2024</p>
              <p>Expiry Date: 12/06/2025</p>
              <p>Certificate Number: QB-qPR-01-57783</p>
            </div>
            <div class="signature">
              <p>Trainer/Assessor ___________________</p>
              <p>Authorized Signature ___________________</p>
            </div>
          </div>
          <script>
            window.print();
            window.close();
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('Please allow pop-ups for this website to print the certificate.');
    }
  };

  return (
    <div className="App">
      <h2>Certificate Preview</h2>

      <button onClick={handlePrint}>Print Certificate</button>

      <div
        className="certificate-container"
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          width: '700px',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h2>This is to certify that</h2>
        <h1>Anshad</h1>
        <p>Qatar ID/Passport No.: QID12345</p>
        <p>Company/Employer: XYZ Company</p>
        <p>Has successfully completed a course/assessment as Software Engineer Training</p>
        <div style={{ marginTop: '40px', textAlign: 'left' }}>
          <p>Issued Date: 12/02/2024</p>
          <p>Expiry Date: 12/06/2025</p>
          <p>Certificate Number: QB-qPR-01-57783</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p>Trainer/Assessor ___________________</p>
          <p>Authorized Signature ___________________</p>
        </div>
      </div>
    </div>
  );
}

export default CertificateApp;
