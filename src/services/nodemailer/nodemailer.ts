import nodemailer from 'nodemailer'

export const sendOtpEmail = ({ name, email }: { name: string, email: string }) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "accounts@foxelo.co.in",
                pass: process.env.NODEMAILER,
            },
        });


        const mailOptions = {
            from: "accounts@foxelo.co.in",
            to: email,
            subject: "Thrive 2.0 Registration",
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BNI Thrive 2.0 Confirmation</title>
    <style>
      html {
          background: #f5f5dc; /* Cream color */
          color: black;
          margin: 0;
          padding: 0;
          height: 100%;
      }
      body {
          font-family: Arial, sans-serif;
          height: 100%;       
          background: #f5f5dc; /* Cream color */
          color: black;
          background-repeat: no-repeat;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
      }
      .header {
          font-weight: bold;
          font-size: 20px;
          text-align: center;
          padding: 1px;
      }
      .contact-info {
          margin-top: 20px;
      }
      .head {
          margin-top: 50px;
      }
    </style>
</head>
<body>
    <div class="header">
        <div class="head">
            <p>Thrive 2.0</p>
        </div>
    </div>
    <div class="container">
        <p>Dear ${name},</p>
        <p>We are excited to inform you that your registration for Thrive 2.0 - BNI Benchmark has been successfully confirmed!</p>
        <p><strong>Event Details:</strong></p>
        <p><strong>Event:</strong> Thrive 2.0</p>
        <p><strong>Date:</strong> August 25, 2024</p>
        <p><strong>Time:</strong> 10am to 10pm</p>
        <p><strong>Location:</strong> KTDC WaterScapes, Kumarakom</p>
        <p><strong>Reporting Time:</strong> 9.00am</p>
        <p>Thrive 2.0 is a fantastic opportunity to expand your business network, gain insightful knowledge, and enhance your business skills. We are honored to have Mr. Madhu Bhaskaran, a renowned business trainer, share his expertise with us. Followed by the address from Mr. John Kuriakose (MD of DentCare), Mr. Shijo K Thomas (MD of Oxygen), Mr. K P Raveendran, Chief Mentor, Positive Commune Entrepreneurship Club (PCEC), and many more eminent business personalities from different segments.</p>
        <p>The evening will wind up with an Entertainment Night featuring performances by The Sound People band, a sumptuous Cocktail Dinner, and more.</p>
        <p>For any queries or further information, feel free to contact us at accounts@foxelo.co.in or reach out to Registrations Head - Mr. Joseph Skariah: +91 70342 86887 and Programme Director - Mr. Benu Varghese: +91 98958 06380.</p>
        <p>Thank you for being a part of the BNI community. We look forward to seeing you at Thrive 2.0!</p>
        <div class="contact-info">
            <p>- BNI Thrive 2.0 Core Team</p>
        </div>
        <br/><br/><br/>
    </div>
</body>
</html>

            `,
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log(error);

                // Handle the error and reject the promise with the error details
                reject({ error, message: 'Invalid sender-email or password' });
            } else {
                // Resolve the promise with the OTP and success message
                resolve({ message: 'OTP sent successfully' });
            }
        });
    });
};

