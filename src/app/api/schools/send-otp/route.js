// app/api/send-otp/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!user || user.length === 0) {
      return NextResponse.json({ success: false, message: "No account found with this email" },{ status: 404 });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query("INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)", [
        email,
        otp,
        expiresAt,
    ]);

    // send email
    await sgMail.send({
        to: email,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        subject: "Your One-Time Password (OTP) for Secure Login",
        text: `
Hello,

We received a request to log in to your account.  
Use the following One-Time Password (OTP) to complete your login:

${otp}

This code will expire in 10 minutes.  
If you did not request this, please ignore this email.

Thank you,  
The Reno Platforms Team
  `,
        html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4F46E5;">Your One-Time Password (OTP)</h2>
    <p>Hello,</p>
    <p>We received a request to log in to your account. Use the following One-Time Password (OTP) to complete your login:</p>
    <p style="font-size: 20px; font-weight: bold; color: #111; background: #f3f4f6; padding: 10px 15px; border-radius: 6px; display: inline-block;">
      ${otp}
    </p>
    <p>This code will expire in <strong>10 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br/>
    <p>Thank you,<br/>The <strong>Reno Platforms</strong> Team</p>
  </div>
  `,
    });

    return NextResponse.json({ success: true });
    } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
  }
}
