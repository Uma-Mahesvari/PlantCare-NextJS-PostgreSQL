"use client";

import { useState } from "react";

type AdminOrder = { id: number; status: string; total: number; address: string; createdAt: string };
const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export function AdminOrderManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function changeStatus(id: number, status: string) {
    setBusyId(id); setMessage("");
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    const result = await response.json() as { status?: string; error?: string };
    if (response.ok && result.status) { setOrders((current) => current.map((order) => order.id === id ? { ...order, status: result.status! } : order)); setMessage(`Order #${id} updated to ${result.status}.`); }
    else setMessage(result.error ?? "Unable to update the order.");
    setBusyId(null);
  }

  return <section><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-serif text-3xl">Recent orders</h2><p className="mt-1 text-sm text-emerald-950/55">Status changes are immediately available to customer order tracking.</p></div><p role="status" className="text-sm font-bold text-emerald-700">{message}</p></div><div className="overflow-x-auto rounded-3xl border bg-white"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-emerald-50"><tr>{["Order", "Status", "Total", "Address", "Date"].map((header) => <th key={header} className="px-5 py-4">{header}</th>)}</tr></thead><tbody>{orders.length ? orders.map((order) => <tr key={order.id} className="border-t"><td className="px-5 py-4 font-bold">#{order.id}</td><td className="px-5 py-4"><select value={order.status} disabled={busyId === order.id} onChange={(event) => void changeStatus(order.id, event.target.value)} className="rounded-xl border px-3 py-2 font-bold">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-5 py-4">₹{order.total}</td><td className="max-w-sm px-5 py-4">{order.address}</td><td className="px-5 py-4">{new Date(order.createdAt).toLocaleString("en-IN")}</td></tr>) : <tr><td colSpan={5} className="px-5 py-8 text-center">No orders yet.</td></tr>}</tbody></table></div></section>;
}
