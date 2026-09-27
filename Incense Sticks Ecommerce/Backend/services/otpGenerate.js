const OTPModel = require("../models/OTP");
const transporter=require("../services/nodemailer")
async function generateRandomSixDigit(email) {

  try {
 
    const otp= Math.floor(100000 + Math.random() * 900000);

    const newOTPEntry=await OTPModel.create({
        email:email,
        otp:otp
    })
const info = await transporter.sendMail({
    from: `"Raghu Rash" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of recipients
    subject: "OTP Generation", // subject line
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #333333;
    }

    .email-wrapper {
      width: 100%;
      padding: 30px 15px;
      box-sizing: border-box;
    }

    .email-container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    }

    .email-header {
      background-color: #16a34a;
      padding: 24px 20px;
      text-align: center;
    }

    .email-header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }

    .email-body {
      padding: 32px 28px;
      text-align: center;
    }

    .email-body h2 {
      margin: 0 0 12px;
      font-size: 22px;
      color: #111827;
    }

    .email-body p {
      margin: 0 0 18px;
      font-size: 15px;
      line-height: 1.6;
      color: #555555;
    }

    .otp-box {
      display: inline-block;
      margin: 18px 0 24px;
      padding: 14px 28px;
      background-color: #f0fdf4;
      border: 1px dashed #16a34a;
      border-radius: 10px;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #16a34a;
    }

    .note {
      font-size: 14px;
      color: #777777;
    }

    .email-footer {
      padding: 18px 20px;
      text-align: center;
      background-color: #f9fafb;
      font-size: 13px;
      color: #888888;
      border-top: 1px solid #eeeeee;
    }

    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 26px 20px;
      }

      .otp-box {
        font-size: 26px;
        letter-spacing: 6px;
        padding: 12px 22px;
      }

      .email-header h1 {
        font-size: 22px;
      }

      .email-body h2 {
        font-size: 20px;
      }
    }
  </style>
</head>

<body>
  <div class="email-wrapper">
    <div class="email-container">

      <div class="email-header">
        <h1>OTP Verification</h1>
      </div>

      <div class="email-body">
        <h2>Your Verification Code</h2>

        <p>
          Use the OTP below to verify your account. This code is valid for a limited time.
        </p>

        <div class="otp-box">
          ${otp}
        </div>

        <p class="note">
          Please do not share this OTP with anyone for security reasons.
        </p>
      </div>

      <div class="email-footer">
        This is an automated email. Please do not reply.
      </div>

    </div>
  </div>
</body>
</html>
    `, // HTML body
  });


 return otp
  

   
  } catch (error) {
    console.log(error);
    
  }
}


module.exports = generateRandomSixDigit;