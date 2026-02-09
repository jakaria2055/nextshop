import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `process.env.EMAIL_FROM`,
    to,
    subject,
    html,
  });
};
