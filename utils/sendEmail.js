const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');
// dotenv.config({ path: './config/config.env' });

const sendEmail = async options => {
  // create reusable transporter object using the default SMTP transport
  let transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email,
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    html: options.html, // html body
  };

  const info = await transport.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
