const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"EduSphere LMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'EduSphere - Verification Code (OTP)',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 500px;">
        <h2 style="color: #4F46E5;">EduSphere LMS Verification</h2>
        <p style="color: #374151;">Your One-Time Password (OTP) for account verification is:</p>
        <div style="background-color: #F3F4F6; padding: 12px; text-align: center; border-radius: 6px; margin: 15px 0;">
          <h1 style="color: #111827; letter-spacing: 6px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #6B7280; font-size: 14px;">This code is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
