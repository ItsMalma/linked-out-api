import * as nodemailer from "nodemailer";

export const mailTransporter = nodemailer.createTransport({
  service: Bun.env.MAIL_SERVICE,
  host: Bun.env.MAIL_HOST,
  port: Bun.env.MAIL_PORT,
  auth: {
    user: Bun.env.MAIL_USER,
    pass: Bun.env.MAIL_PASS,
  },
});
