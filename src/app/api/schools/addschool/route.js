import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

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

    const dir = path.join(process.cwd(), "public", "schoolImages");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save image
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(dir, filename);
    await writeFile(filepath, buffer);

    // Store record in MySQL
    const [result] = await db.query(
      "INSERT INTO schools (name, address, city, state, contact, image, email_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      [name, address, city, state, contact, `/schoolImages/${filename}`, email_id, new Date()]
    );

    return new Response(JSON.stringify({ success: true, id: result.insertId }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
