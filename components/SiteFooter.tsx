"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter(){
  const pathname=usePathname();
  if(["/admin","/login","/register","/cart","/checkout"].some(path=>pathname.startsWith(path)))return null;
  return <footer className="bg-emerald-950 px-5 py-12 text-sm text-white/60"><div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4"><div><p className="font-serif text-2xl font-bold text-white">PlantCare</p><p className="mt-3 max-w-xs leading-6">Healthy plants and helpful guidance for greener Indian homes.</p></div><div><b className="text-white">Shop</b><div className="mt-3 grid gap-2"><Link href="/products">All products</Link><Link href="/products?category=flowers">Flower plants</Link><Link href="/products?category=planters">Planters</Link></div></div><div><b className="text-white">Learn</b><div className="mt-3 grid gap-2"><Link href="/blog">Care tips</Link><Link href="/about">About us</Link><Link href="/contact">Contact</Link></div></div><div><b className="text-white">Our promise</b><p className="mt-3 leading-6">Secure checkout<br/>Healthy arrival support<br/>Care guidance included</p></div></div><div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row"><span>© 2026 PlantCare</span><span>Grow something wonderful.</span></div></footer>;
}
