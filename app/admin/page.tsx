import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import { AdminProductManager } from "../../components/AdminProductManager";
import { AdminOrderManager } from "../../components/AdminOrderManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [users, orders, contacts, products, userCount, orderCount, contactCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: "desc" }, take: 20 }),
    prisma.order.findMany({ orderBy: { id: "desc" }, take: 20 }),
    prisma.contact.findMany({ orderBy: { id: "desc" }, take: 20 }),
    prisma.product.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.contact.count(),
  ]);

  const adminProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    code: product.code,
    price: Number(product.price),
    category: product.category,
    image: product.image,
    description: product.description,
    stock: product.stock,
    active: product.active,
  }));

  return <div className="min-h-screen bg-stone-100 text-emerald-950">
    <header className="bg-emerald-950 px-6 py-5 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[.25em] text-lime-300">PlantCare</p><h1 className="font-serif text-3xl">Admin dashboard</h1><p className="mt-1 text-sm text-white/55">Signed in as {session.user.email}</p></div><Link href="/" className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">View store</Link></div></header>
    <main className="mx-auto max-w-7xl space-y-12 px-5 py-10">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Database products" value={products.length}/><Stat label="Registered customers" value={userCount}/><Stat label="Orders" value={orderCount}/><Stat label="Customer messages" value={contactCount}/></section>
      <AdminProductManager initialProducts={adminProducts}/>
      <AdminOrderManager initialOrders={orders.map((order) => ({ id: order.id, status: order.status, total: Number(order.total), address: order.address, createdAt: order.createdAt.toISOString() }))}/>
      <Data title="Customers" headers={["Name", "Email", "Role"]} rows={users.map((user) => [`${user.firstName} ${user.lastName}`, user.email, user.role])}/>
      <Data title="Contact messages" headers={["Name", "Email", "Message"]} rows={contacts.map((contact) => [contact.firstName, contact.email, contact.subject])}/>
    </main>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) { return <article className="rounded-3xl bg-white p-6"><b className="text-4xl">{value}</b><p className="mt-2 text-sm text-emerald-950/55">{label}</p></article>; }
function Data({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) { return <section><h2 className="mb-4 font-serif text-3xl">{title}</h2><div className="overflow-x-auto rounded-3xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-emerald-50"><tr>{headers.map((header) => <th key={header} className="px-5 py-4">{header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={index} className="border-t">{row.map((cell, cellIndex) => <td key={cellIndex} className="max-w-sm px-5 py-4">{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="px-5 py-8 text-center">No records yet.</td></tr>}</tbody></table></div></section>; }
