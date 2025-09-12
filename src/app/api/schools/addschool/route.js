import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Verify JWT from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized!! please login again." }), { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 403 });
    }
    const formData = await req.formData();
    const name = formData.get("name");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const contact = formData.get("contact");
    const email_id = formData.get("email_id");
    const file = formData.get("image");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    // Check if email exists
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email_id]);
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "You must be a registered user to add a school." }), { status: 403 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer to Cloudinary
    const uploadedImage = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "schoolImages" }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Store record in MySQL (store Cloudinary secure_url)
    const [result] = await db.query(
      "INSERT INTO schools (name, address, city, state, contact, image, email_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, uploadedImage.secure_url, email_id, new Date()]
    );

    return new Response(
      JSON.stringify({
        success: true,
        id: result.insertId,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
