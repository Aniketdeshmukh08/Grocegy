const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email, subject, text) => {
  try {
    // Skip sending email if not in production
    if (process.env.NODE_ENV !== 'production') {
      console.log("Email not sent - current environment is:", process.env.NODE_ENV);
      return;
    }
    //else{
          //  transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER, 
        pass: process.env.PASSWORD 
       },
    });

      // Email options
      const mailOptions = {
        from: {
          name: 'Grocji',
          address: process.env.USER,
        },
        to: email,
        subject: subject,
        html: text,
      };

    // Send email
    transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    // }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
