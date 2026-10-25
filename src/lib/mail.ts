import nodemailer from "nodemailer";

/**
 * Returns a configured Nodemailer Transporter for Google SMTP (Gmail / Google Workspace)
 * or custom SMTP configuration if provided in environment variables.
 */
export function getMailTransporter() {
  const user =
    process.env.GOOGLE_SMTP_USER ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER;

  const rawPass =
    process.env.GOOGLE_SMTP_PASS ||
    process.env.GOOGLE_APP_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.SMTP_PASS;

  if (!user || !rawPass) {
    return null;
  }

  // Remove spaces if the user copied a 16-character Google App Password with spaces
  const pass = rawPass.replace(/\s+/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const isGmail = host.includes("gmail.com");

  return nodemailer.createTransport({
    ...(isGmail
      ? { service: "gmail" }
      : {
          host,
          port,
          secure: process.env.SMTP_SECURE === "true" || port === 465,
        }),
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Default sender and admin addresses
 */
export function getMailAddresses() {
  const user =
    process.env.GOOGLE_SMTP_USER ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER;

  const defaultFrom = user
    ? `"TeslaX" <${user}>`
    : `"TeslaX" <noreply@teslax.io>`;

  const from = process.env.SMTP_FROM || defaultFrom;
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.CUSTOMER_CARE_EMAIL ||
    user ||
    "support@teslax.io";

  return { from, adminEmail };
}
