import { unlink } from "fs/promises";
import path from "path";

export async function deleteLocalProductImage(imageUrl: string | null | undefined) {
  if (!imageUrl?.startsWith("/uploads/products/")) return;
  const filename = path.basename(imageUrl);
  try {
    await unlink(path.join(process.cwd(), "public", "uploads", "products", filename));
  } catch {
    // The database operation should still succeed when a file was already removed.
  }
}
