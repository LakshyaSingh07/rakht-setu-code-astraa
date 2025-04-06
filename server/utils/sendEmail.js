const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  if (!to || !subject || !text) {
    throw new Error('Missing required email parameters');
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing');
  }

  try {
    console.log('Attempting to send email with credentials:', {
      user: process.env.EMAIL_USER,
      passProvided: process.env.EMAIL_PASS ? 'Yes' : 'No'
    });
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Life Bridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", {
      to,
      error: error.message,
      stack: error.stack
    });
    
    // Provide more specific error messages for common Gmail authentication issues
    if (error.message.includes('Username and Password not accepted')) {
      console.error('Authentication Error: Your Gmail credentials were rejected. Please check that:');
      console.error('1. You are using an App Password (not your regular password)');
      console.error('2. 2-Step Verification is enabled on your Google Account');
      console.error('3. The App Password was generated for the "Mail" application');
      console.error('4. The email address in EMAIL_USER is correct');
    } else if (error.message.includes('Invalid login')) {
      console.error('Authentication Error: Invalid login credentials');
    } else if (error.message.includes('security settings')) {
      console.error('Security Settings Error: You need to allow less secure apps or use App Password');
      console.error('Visit: https://myaccount.google.com/apppasswords');
    }
    
    throw error;
  }
};

module.exports = sendEmail;
