import { prisma } from "./prisma";
import { products as fallbackProducts, type Product } from "./products";

function toStoreProduct(product: { id: string; name: string; code: string; price: unknown; category: string; image: string }): Product {
  return { id: product.id, name: product.name, code: product.code, price: Number(product.price), category: product.category, image: product.image };
}

export async function getStoreProducts(): Promise<Product[]> {
  const databaseProducts = await prisma.product.findMany({ orderBy: [{ createdAt: "desc" }] });
  if (!databaseProducts.length) return fallbackProducts;
  return databaseProducts.filter((product) => product.active).map(toStoreProduct);
}

export async function getStoreProduct(id: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (product) return product.active ? toStoreProduct(product) : undefined;
  const databaseHasProducts = await prisma.product.count();
  return databaseHasProducts ? undefined : fallbackProducts.find((item) => item.id === id);
}
