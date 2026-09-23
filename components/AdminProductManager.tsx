"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

export type AdminProduct = {
  id: string;
  name: string;
  code: string;
  price: number;
  category: string;
  image: string;
  description: string | null;
  stock: number;
  active: boolean;
};

const emptyProduct: AdminProduct = { id: "", name: "", code: "", price: 0, category: "flowers", image: "", description: "", stock: 0, active: true };
const categories = ["crotons", "flowers", "fruits", "herbs", "plant-care", "planters", "seeds", "trees", "vegetables"];

export function AdminProductManager({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<AdminProduct>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const visibleProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? products.filter((product) => `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(value)) : products;
  }, [products, query]);

  function update<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function edit(product: AdminProduct) {
    setEditingId(product.id);
    setForm(product);
    setMessage("");
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyProduct);
    setMessage("");
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setMessage("Uploading image...");
    const body = new FormData(); body.append("image", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const result = await response.json() as { url?: string; error?: string };
    if (response.ok && result.url) { update("image", result.url); setMessage("Image uploaded."); }
    else setMessage(result.error ?? "Image upload failed.");
    setBusy(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json() as AdminProduct & { error?: string };
    if (response.ok) {
      setProducts((current) => editingId ? current.map((item) => item.id === editingId ? result : item) : [result, ...current]);
      setMessage(editingId ? "Product updated successfully." : "Product created successfully.");
      setEditingId(null); setForm(emptyProduct);
    } else setMessage(result.error ?? "Unable to save the product.");
    setBusy(false);
  }

  async function remove(product: AdminProduct) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    if (response.ok) { setProducts((current) => current.filter((item) => item.id !== product.id)); if (editingId === product.id) reset(); setMessage("Product deleted."); }
    else setMessage(result.error ?? "Unable to delete the product.");
    setBusy(false);
  }

  return <section className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Catalogue database</p><h2 className="mt-1 font-serif text-3xl">Manage products</h2><p className="mt-2 text-sm text-emerald-950/60">Add products, upload images and control store availability.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." className="rounded-full border bg-white px-5 py-3"/></div>

    <form id="product-editor" onSubmit={save} className="grid gap-4 rounded-3xl border bg-white p-6 md:grid-cols-2 lg:grid-cols-4">
      <h3 className="font-serif text-2xl md:col-span-2 lg:col-span-4">{editingId ? "Edit product" : "Add a product"}</h3>
      <Field label="Product ID"><input required disabled={Boolean(editingId)} value={form.id} onChange={(event) => update("id", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="flowers-red-rose" className="control disabled:bg-stone-100"/></Field>
      <Field label="Product code"><input required value={form.code} onChange={(event) => update("code", event.target.value.toUpperCase())} placeholder="RRP001" className="control"/></Field>
      <Field label="Product name"><input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Red Rose Plant" className="control"/></Field>
      <Field label="Category"><select value={form.category} onChange={(event) => update("category", event.target.value)} className="control">{categories.map((category) => <option key={category}>{category}</option>)}</select></Field>
      <Field label="Price (₹)"><input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => update("price", Number(event.target.value))} className="control"/></Field>
      <Field label="Stock quantity"><input required type="number" min="0" step="1" value={form.stock} onChange={(event) => update("stock", Number(event.target.value))} className="control"/></Field>
      <Field label="Image URL"><input required value={form.image} onChange={(event) => update("image", event.target.value)} placeholder="/uploads/products/image.jpg" className="control"/></Field>
      <Field label="Upload product image"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className="control file:mr-3 file:rounded-full file:border-0 file:bg-emerald-100 file:px-3 file:py-1"/></Field>
      <Field label="Description" wide><textarea value={form.description ?? ""} onChange={(event) => update("description", event.target.value)} rows={3} className="control resize-y"/></Field>
      <label className="flex items-center gap-3 self-center font-bold"><input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} className="size-5 accent-emerald-800"/>Visible in store</label>
      <div className="flex flex-wrap items-center gap-3 lg:col-span-3"><button disabled={busy} className="rounded-full bg-emerald-900 px-6 py-3 font-bold text-white disabled:opacity-50">{busy ? "Please wait..." : editingId ? "Save changes" : "Add product"}</button>{editingId && <button type="button" onClick={reset} className="rounded-full border px-6 py-3 font-bold">Cancel</button>}<p role="status" className="text-sm font-semibold text-emerald-700">{message}</p></div>
    </form>

    <div className="overflow-x-auto rounded-3xl border bg-white"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-emerald-50"><tr>{["Product", "Code", "Category", "Price", "Stock", "Status", "Actions"].map((header) => <th key={header} className="px-5 py-4">{header}</th>)}</tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.id} className="border-t"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="size-12 rounded-xl bg-stone-100 object-cover"/><div><b>{product.name}</b><p className="text-xs text-emerald-950/45">{product.id}</p></div></div></td><td className="px-5 py-4">{product.code}</td><td className="px-5 py-4">{product.category}</td><td className="px-5 py-4">₹{product.price}</td><td className="px-5 py-4"><b className={product.stock < 5 ? "text-orange-700" : ""}>{product.stock}</b></td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${product.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200"}`}>{product.active ? "Published" : "Hidden"}</span></td><td className="px-5 py-4"><div className="flex gap-3"><button onClick={() => edit(product)} className="font-bold text-emerald-800">Edit</button><button disabled={busy} onClick={() => remove(product)} className="font-bold text-red-700">Delete</button></div></td></tr>)}{!visibleProducts.length && <tr><td colSpan={7} className="px-5 py-10 text-center text-emerald-950/50">No products found.</td></tr>}</tbody></table></div>
  </section>;
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`text-sm font-bold ${wide ? "md:col-span-2 lg:col-span-4" : ""}`}>{label}{children}</label>; }
