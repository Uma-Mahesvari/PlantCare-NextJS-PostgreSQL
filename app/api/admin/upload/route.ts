import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/admin-products";

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const formData = await request.formData();
  const image = formData.get("image");
  if (!(image instanceof File)) return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  if (!allowedTypes[image.type]) return NextResponse.json({ error: "Only JPG, PNG and WebP images are accepted." }, { status: 400 });
  if (image.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image size must not exceed 5 MB." }, { status: 400 });

  const filename = `${Date.now()}-${randomUUID()}${allowedTypes[image.type]}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), Buffer.from(await image.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/products/${filename}` }, { status: 201 });
}
