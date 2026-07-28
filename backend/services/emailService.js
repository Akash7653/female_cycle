import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export async function sendEmail(to, subject, text) {
  const t = getTransporter();
  if (!t) {
    console.log(`📧 (email not configured) → ${to}: ${subject}`);
    return;
  }
  await t.sendMail({
    from: process.env.FROM_EMAIL || 'SkyLove <no-reply@skylove.app>',
    to,
    subject,
    text,
  });
}
