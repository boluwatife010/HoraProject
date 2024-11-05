import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
 try  {const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);}
  catch (err) {
    console.error('Error sending OTP email:', err);
    throw new Error('Failed to send OTP email. Please try again later.');
  }
};
