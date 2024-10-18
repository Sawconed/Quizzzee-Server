import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (option: EmailOptions): Promise<void> => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const emailOptions = {
      from: "Quizzzee support<support@quizzzee.com>",
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    const info = await transporter.sendMail(emailOptions);
    // console.log("Email sent: " + info.response);
  } catch (error: any) {
    throw new Error("Email sending failed: " + error.message);
  }
};

export default sendEmail;
