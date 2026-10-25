import { NextResponse } from "next/server";
import { getMailTransporter, getMailAddresses } from "@/lib/mail";

export async function GET() {
  const { from, adminEmail } = getMailAddresses();
  const transporter = getMailTransporter();

  if (!transporter) {
    return NextResponse.json({
      configured: false,
      provider: "Google SMTP (smtp.gmail.com)",
      message:
        "Google SMTP is not yet connected. Add GOOGLE_SMTP_USER and GOOGLE_SMTP_PASS in .env.local to enable real email delivery.",
      instructions: [
        "1. Open your Google Account at https://myaccount.google.com/security",
        "2. Ensure 2-Step Verification is turned ON",
        "3. Navigate to https://myaccount.google.com/apppasswords",
        "4. Create a new App Password named 'TeslaX' and copy the 16-character code",
        "5. Paste your Gmail address into GOOGLE_SMTP_USER and the 16-character code into GOOGLE_SMTP_PASS in .env.local",
      ],
      adminEmail,
      from,
    });
  }

  try {
    // Verify connection configuration with smtp.gmail.com
    await transporter.verify();
    return NextResponse.json({
      configured: true,
      provider: "Google SMTP (smtp.gmail.com)",
      connected: true,
      message: "Successfully verified connection to Google SMTP server.",
      adminEmail,
      from,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: true,
        provider: "Google SMTP (smtp.gmail.com)",
        connected: false,
        error: error?.message || "Failed to authenticate with Google SMTP",
      },
      { status: 502 }
    );
  }
}
