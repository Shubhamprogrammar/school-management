import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // check if user already exists
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if ((rows).length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into db
    await db.query("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", [
      name,
      email,
      hashedPassword,
      new Date(),
    ]);

    // Create JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log(token);

    // Response with cookie
    const res = NextResponse.json({ success: true });
    console.log("Response before setting cookie:", res);
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });
    console.log("Response after setting cookie:", res);
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
