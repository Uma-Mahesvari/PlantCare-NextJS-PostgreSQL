import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../../lib/prisma";
import { isAdmin, validateProductInput, type ProductInput } from "../../../../../lib/admin-products";
import { deleteLocalProductImage } from "../../../../../lib/product-images";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const { id } = await params;
  const parsed = validateProductInput((await request.json()) as ProductInput);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { id: _unused, ...data } = parsed.data;
  try {
    const previous = await prisma.product.findUnique({ where: { id }, select: { image: true } });
    const product = await prisma.product.update({ where: { id }, data });
    if (previous?.image !== product.image) await deleteLocalProductImage(previous?.image);
    return NextResponse.json({ ...product, price: Number(product.price) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "That product code already exists." }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return NextResponse.json({ error: "Product not found." }, { status: 404 });
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const { id } = await params;
  try {
    const previous = await prisma.product.findUnique({ where: { id }, select: { image: true } });
    await prisma.product.delete({ where: { id } });
    await deleteLocalProductImage(previous?.image);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return NextResponse.json({ error: "Product not found." }, { status: 404 });
    throw error;
  }
}
