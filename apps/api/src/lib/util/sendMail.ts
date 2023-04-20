import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../constants";

export async function sendEmail(to: string, message: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject: "Verification Code from Turbo Learn",
    html: message,
  };

  await transporter.sendMail(mailOptions);
}

export default sendEmail;
