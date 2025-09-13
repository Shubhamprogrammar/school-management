import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" },{ status: 400 });
    }

    // Check if user already exists (prevent duplicate signup)
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user && user.length > 0) {
      return NextResponse.json({ success: false, message: "Account already exists with this email" },{ status: 409 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      "INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // Send email with SendGrid
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: "Your OTP for Signup Verification",
      text: `
Hello,

Thank you for signing up!  
To complete your registration, please use the following One Time Password (OTP):

${otp}

This code will expire in 10 minutes.  
Do not share this OTP with anyone.

Thank you,  
The Reno Platforms Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <h2 style="color: #4F46E5;">Your Signup OTP</h2>
  <p>Hello,</p>
  <p>Thank you for signing up! To complete your registration, please use the following OTP:</p>
  <p style="font-size: 20px; font-weight: bold; color: #111; background: #f3f4f6; padding: 10px 15px; border-radius: 6px; display: inline-block;">
    ${otp}
  </p>
  <p>This code will expire in <strong>10 minutes</strong>.</p>
  <p>Do not share this OTP with anyone.</p>
  <br/>
  <p>Thank you,<br/>The <strong>Reno Platforms</strong> Team</p>
</div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending signup OTP:", err);
    return NextResponse.json({ success: false, message: "Failed to send OTP" },{ status: 500 });
  }
}
