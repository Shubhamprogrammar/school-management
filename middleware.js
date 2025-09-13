import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function middleware(req) {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("❌ No token found, redirecting...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    console.log("✅ Token valid, allowing request.");
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/addschool"],
};
