import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { AddToCartButton } from "../../components/AddToCartButton";
import { categoryNames } from "../../lib/products";
import { getStoreProducts } from "../../lib/store-products";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category = "all", q = "" } = await searchParams;
  const products = await getStoreProducts();
  const query = q.trim().toLowerCase();
  const filtered = products.filter((product) => (category === "all" || product.category === category) && (!query || product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query)));

  return <div className="min-h-screen bg-[#fbfdf8] text-emerald-950"><SiteHeader/><main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-700">Nursery collection</p>
    <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="font-serif text-5xl">{categoryNames[category] ?? "Products"}</h1><p className="mt-3 text-emerald-950/60">{filtered.length} available products.</p></div><form><input type="hidden" name="category" value={category}/><label><span className="sr-only">Search products</span><input name="q" defaultValue={q} className="w-full rounded-full border border-emerald-950/15 bg-white px-5 py-3 sm:w-72" placeholder="Search plants or product code..."/></label></form></div>
    <div className="mt-8 flex flex-wrap gap-2">{Object.entries(categoryNames).map(([slug, name]) => <Link key={slug} href={slug === "all" ? "/products" : `/products?category=${slug}`} className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === slug ? "border-emerald-900 bg-emerald-900 text-white" : "border-emerald-950/15 bg-white"}`}>{name}</Link>)}</div>
    {filtered.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((product) => <article key={product.id} className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Link href={`/products/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-emerald-50"><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105"/></Link><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{categoryNames[product.category] ?? product.category}</p><h2 className="mt-2 min-h-14 text-lg font-bold"><Link href={`/products/${product.id}`}>{product.name}</Link></h2><p className="mt-1 text-xs text-emerald-950/45">Code: {product.code}</p><div className="mt-5 flex items-center justify-between"><strong>₹{product.price}</strong><AddToCartButton product={product}/></div></div></article>)}</div> : <div className="mt-16 rounded-3xl border border-dashed border-emerald-950/20 p-12 text-center"><h2 className="font-serif text-3xl">No matching products</h2><p className="mt-2 text-emerald-950/60">Try another category or search term.</p></div>}
  </main></div>;
}
