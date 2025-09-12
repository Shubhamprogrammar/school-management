import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
console.log("✅ Middleware called for:", req.nextUrl.pathname);
  const token = req.cookies.get("token")?.value;

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
