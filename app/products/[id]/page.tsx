import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/SiteHeader";
import { AddToCartButton } from "../../../components/AddToCartButton";
import { categoryNames, products as fallbackProducts } from "../../../lib/products";
import { getStoreProduct } from "../../../lib/store-products";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return fallbackProducts.map(({ id }) => ({ id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getStoreProduct(id);
  if (!product) return {};
  return { title: `${product.name} – Buy Online`, description: `Buy ${product.name} from PlantCare. Healthy nursery plant, carefully packed for delivery.`, alternates: { canonical: `/products/${id}` }, openGraph: { images: [product.image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStoreProduct(id);
  if (!product) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, image: product.image, sku: product.code, brand: { "@type": "Brand", name: "PlantCare" }, offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: "https://schema.org/InStock", url: `http://localhost:3000/products/${product.id}` } };
  return <div className="min-h-screen bg-[#fbfdf8] text-emerald-950"><SiteHeader/><main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 lg:px-8"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/><img src={product.image} alt={product.name} className="aspect-square w-full rounded-[2rem] bg-white object-cover"/><div className="self-center"><Link href={`/products?category=${product.category}`} className="text-sm font-bold text-emerald-700">← {categoryNames[product.category] ?? product.category}</Link><h1 className="mt-5 font-serif text-5xl">{product.name}</h1><p className="mt-3 text-sm text-emerald-950/50">Product code: {product.code}</p><p className="mt-7 text-3xl font-bold">₹{product.price}</p><p className="mt-5 leading-7 text-emerald-950/65">A healthy nursery plant selected and packed with care. Place it in suitable light, check the soil before watering, and give it time to settle after delivery.</p><div className="mt-8"><AddToCartButton product={product}/></div><Link href="/blog" className="mt-8 block font-bold text-emerald-800 underline underline-offset-4">Read plant-care tips</Link></div></main></div>;
}
