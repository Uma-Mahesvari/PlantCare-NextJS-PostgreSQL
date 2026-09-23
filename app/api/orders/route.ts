import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { getStoreProducts } from "../../../lib/store-products";

type IncomingItem = { id: string; quantity: number };

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
  const body = await request.json() as Record<string, unknown> & { items?: IncomingItem[] };
  const address = [body.address, body.city, body.state, body.postalCode].map(String).join(", ");
  const phone = String(body.phone ?? "").trim();
  const products = await getStoreProducts();
  const lines = (body.items ?? []).map((item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));
    return product ? { product, quantity } : null;
  }).filter(Boolean) as Array<{ product: (typeof products)[number]; quantity: number }>;
  if (!lines.length || !phone || address.includes("undefined")) return NextResponse.json({ error: "Complete the delivery details and cart." }, { status: 400 });
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const order = await prisma.order.create({ data: { userId: Number(session.user.id), total, address: `${address} | Phone: ${phone}`, items: { create: lines.map((line) => ({ productCode: line.product.code, productName: line.product.name, quantity: line.quantity, unitPrice: line.product.price })) } } });
  return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
}
