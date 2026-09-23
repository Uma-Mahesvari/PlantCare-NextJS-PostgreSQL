import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { isAdmin } from "../../../../../lib/admin-products";
import { prisma } from "../../../../../lib/prisma";

const statuses = new Set(Object.values(OrderStatus));

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const { id } = await params;
  const body = await request.json() as { status?: unknown };
  const status = String(body.status ?? "") as OrderStatus;
  if (!statuses.has(status)) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) return NextResponse.json({ error: "Invalid order number." }, { status: 400 });
  try {
    const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
    return NextResponse.json({ id: order.id, status: order.status });
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
