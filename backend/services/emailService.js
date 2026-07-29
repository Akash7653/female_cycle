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

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new Error(`Email send timed out after ${ms}ms`)), ms);
    timer.unref?.();
  });
}

export async function sendEmail(to, subject, text) {
  const t = getTransporter();
  if (!t) {
    console.log(`📧 (email not configured) → ${to}: ${subject}`);
    return;
  }

  const sendMailPromise = t.sendMail({
    from: process.env.FROM_EMAIL || 'SkyLove <no-reply@skylove.app>',
    to,
    subject,
    text,
  });

  return Promise.race([sendMailPromise, timeoutPromise(15000)]).catch((error) => {
    console.error('Email send failed:', error?.message ?? error);
    throw error;
  });
}
