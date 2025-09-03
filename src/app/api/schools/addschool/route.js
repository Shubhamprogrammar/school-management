import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
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

    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM schools WHERE email_id = ?", [email_id]);
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: "Email ID already exists" }), { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer to Cloudinary
    const uploadedImage = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "schools" }, 
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
        imageUrl: uploadedImage.secure_url,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
