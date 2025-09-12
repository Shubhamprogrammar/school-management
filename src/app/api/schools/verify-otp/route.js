// app/api/verify-otp/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, otp } = await req.json();

  const [rows] = await db.query("SELECT * FROM otp_codes WHERE email = ? AND code = ? ORDER BY id DESC LIMIT 1", [email, otp]);
  const record = (rows)[0];

  if (!record || new Date(record.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  // delete OTP after use
  await db.query("DELETE FROM otp_codes WHERE id = ?", [record.id]);

  // create JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
  return res;
}
