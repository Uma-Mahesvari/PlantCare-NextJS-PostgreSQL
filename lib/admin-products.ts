import { auth } from "../auth";

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export type ProductInput = {
  id?: unknown;
  name?: unknown;
  code?: unknown;
  price?: unknown;
  category?: unknown;
  image?: unknown;
  description?: unknown;
  stock?: unknown;
  active?: unknown;
};

export function validateProductInput(body: ProductInput, requireId = false) {
  const id = String(body.id ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const code = String(body.code ?? "").trim().toUpperCase();
  const category = String(body.category ?? "").trim().toLowerCase();
  const image = String(body.image ?? "").trim();
  const description = String(body.description ?? "").trim() || null;
  const price = Number(body.price);
  const stock = Number(body.stock);
  const active = body.active !== false;

  if (requireId && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return { error: "Use a lowercase product ID such as flowers-red-rose." } as const;
  if (name.length < 2 || name.length > 120) return { error: "Product name must contain 2–120 characters." } as const;
  if (!/^[A-Z0-9_-]{2,30}$/.test(code)) return { error: "Product code must contain 2–30 letters, numbers, underscores or hyphens." } as const;
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." } as const;
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number of zero or more." } as const;
  if (!category || category.length > 50) return { error: "Choose a valid category." } as const;
  if (!image.startsWith("/") && !/^https:\/\//i.test(image)) return { error: "Upload an image or enter a valid HTTPS image URL." } as const;
  if (description && description.length > 2000) return { error: "Description must be under 2,000 characters." } as const;

  return { data: { id, name, code, price, category, image, description, stock, active } } as const;
}
