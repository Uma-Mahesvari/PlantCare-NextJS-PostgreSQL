import { PrismaClient } from "@prisma/client";
import { products } from "../lib/products";

const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        ...product,
        stock: 10,
        active: true,
      },
    });
  }
  console.log(`Imported ${products.length} catalogue products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
