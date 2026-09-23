import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";
import { isAdmin, validateProductInput, type ProductInput } from "../../../../lib/admin-products";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(products.map((product) => ({ ...product, price: Number(product.price) })));
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const parsed = validateProductInput((await request.json()) as ProductInput, true);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json({ ...product, price: Number(product.price) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "That product ID or code already exists." }, { status: 409 });
    throw error;
  }
}
