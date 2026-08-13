import nodemailer from "nodemailer";
import env from "../config/env.js";

const transport = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  await transport.sendMail({
    from: env.MAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

export default transport;
