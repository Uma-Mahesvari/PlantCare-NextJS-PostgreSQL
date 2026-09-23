import Link from "next/link";
import { AddToCartButton } from "../components/AddToCartButton";
import { SiteHeader } from "../components/SiteHeader";
import { blogPosts } from "../lib/blog";
import { products } from "../lib/products";

const categories = [
  { name: "Flower plants", slug: "flowers", note: "Colour for every corner" },
  { name: "Herbal plants", slug: "herbs", note: "Useful, fragrant greens" },
  { name: "Fruit plants", slug: "fruits", note: "Grow your own harvest" },
  { name: "Vegetable plants", slug: "vegetables", note: "Fresh food at home" },
  { name: "Planters", slug: "planters", note: "A better home for roots" },
  { name: "Plant care", slug: "plant-care", note: "Feed, protect and thrive" },
].map(category=>({...category,image:products.find(product=>product.category===category.slug)?.image??products[0].image}));

const featuredIds = ["flowers-5", "crotons-5", "herbs-2", "flowers-8"];
const featured = featuredIds.map(id=>products.find(product=>product.id===id)).filter((product):product is NonNullable<typeof product>=>Boolean(product));
const heroProduct = featured[0] ?? products[0];
const storyProduct = products.find(product=>product.category==="herbs") ?? products[0];

const benefits = [
  { icon: "✦", title: "Nursery fresh", text: "Healthy plants selected and packed only after your order." },
  { icon: "⌂", title: "Delivered with care", text: "Protective packaging designed for safe travel to your doorstep." },
  { icon: "☼", title: "Guidance that grows", text: "Simple care tips help every new plant settle into its new home." },
  { icon: "✓", title: "Healthy arrival promise", text: "Friendly support when your order needs extra attention." },
];

export default function Home() {
  const guides = blogPosts.slice(0, 3);
  const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", name: "PlantCare", url: "https://plantcare-store.mugeshofc.chatgpt.site", potentialAction: { "@type": "SearchAction", target: "https://plantcare-store.mugeshofc.chatgpt.site/products?q={search_term_string}", "query-input": "required name=search_term_string" } };
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f2] text-emerald-950">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <section className="relative bg-[#eef1e5]">
          <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300/30 blur-3xl" />
          <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-800"><span className="size-2 rounded-full bg-lime-500" /> Fresh from our nursery</div>
              <h1 className="font-serif text-6xl leading-[.94] tracking-[-.04em] sm:text-7xl lg:text-[5.35rem]">Bring home a little <em className="font-normal text-emerald-700">more life.</em></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-emerald-950/68">Healthy plants, beautiful planters and trusted growing essentials—carefully selected for Indian homes and delivered to your door.</p>
              <div className="mt-9 flex flex-wrap gap-3"><Link href="/products" className="rounded-full bg-emerald-950 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-950/15 hover:-translate-y-0.5 hover:bg-emerald-800">Shop the nursery <span className="ml-2">→</span></Link><Link href="/blog" className="rounded-full border border-emerald-950/15 bg-white px-7 py-4 text-sm font-bold hover:border-emerald-800">Get plant-care tips</Link></div>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-emerald-950/60"><span className="font-bold text-emerald-950">4.9 <span className="text-amber-500">★★★★★</span></span><span>Healthy arrival promise</span><span>Care support included</span></div>
            </div>
            <div className="relative min-h-[470px] sm:min-h-[560px]">
              <div className="absolute inset-x-10 inset-y-0 rotate-2 overflow-hidden rounded-[3rem] bg-emerald-800 shadow-2xl shadow-emerald-950/20"><img src={heroProduct.image} alt={`${heroProduct.name} from PlantCare nursery`} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-emerald-950/45 via-transparent to-transparent"/></div>
              <div className="absolute bottom-7 left-0 max-w-[220px] rounded-3xl bg-white p-5 shadow-2xl"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Plant of the week</p><p className="mt-2 font-serif text-2xl">{heroProduct.name}</p><p className="mt-1 text-sm text-emerald-950/55">Selected from our product catalogue</p></div>
              <div className="absolute right-0 top-10 rounded-3xl border border-white/40 bg-white/85 p-4 shadow-xl backdrop-blur"><span className="block text-2xl">☀</span><b className="mt-2 block text-sm">Loves bright light</b></div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/10 bg-white"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-emerald-950/10 px-5 md:grid-cols-4 md:divide-y-0 lg:px-8">{benefits.map(item=><div key={item.title} className="px-4 py-8 first:pl-0 md:px-6"><span className="text-xl text-emerald-700">{item.icon}</span><h2 className="mt-2 font-bold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-emerald-950/55">{item.text}</p></div>)}</div></section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="mb-10 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-700">Start exploring</p><h2 className="mt-2 max-w-xl font-serif text-4xl tracking-tight sm:text-5xl">Find the right green for your space.</h2></div><Link href="/products" className="hidden font-bold text-emerald-800 underline decoration-lime-400 decoration-2 underline-offset-8 sm:block">See all products</Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(category=><Link key={category.slug} href={`/products?category=${category.slug}`} className="group relative min-h-72 overflow-hidden rounded-[2rem] bg-emerald-900"><img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/10 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-sm text-white/65">{category.note}</p><div className="mt-1 flex items-end justify-between"><h3 className="font-serif text-3xl">{category.name}</h3><span className="grid size-10 place-items-center rounded-full bg-white text-emerald-950 transition group-hover:-rotate-45">↗</span></div></div></Link>)}</div>
        </section>

        <section className="bg-emerald-950 py-20 text-white lg:py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-10 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-lime-300">Popular right now</p><h2 className="mt-2 font-serif text-4xl sm:text-5xl">Meet our best sellers.</h2></div><Link href="/products" className="hidden text-sm font-bold text-lime-200 sm:block">Browse the collection →</Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map(product=><article key={product.id} className="group overflow-hidden rounded-[2rem] bg-white text-emerald-950"><Link href={`/products/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-emerald-50"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/></Link><div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Nursery favourite</p><Link href={`/products/${product.id}`}><h3 className="mt-2 min-h-14 text-lg font-bold">{product.name}</h3></Link><div className="mt-4 flex items-center justify-between"><strong className="text-lg">₹{product.price}</strong><AddToCartButton product={product}/></div></div></article>)}</div></div></section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-24"><div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem]"><img src="/assets/Herbal Plants/Avaram-Senna.jpg" alt="Herbal plant growing in the PlantCare nursery" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent"/><p className="absolute bottom-8 left-8 max-w-sm font-serif text-4xl text-white">Plants chosen with patience. Packed with care.</p></div><div className="self-center lg:px-12"><p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-700">Why PlantCare</p><h2 className="mt-3 font-serif text-5xl leading-tight">A nursery experience, delivered home.</h2><p className="mt-6 text-lg leading-8 text-emerald-950/65">We believe buying a plant should feel exciting—not uncertain. That is why we focus on healthy selections, protective packaging and useful guidance after your order arrives.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><div><b className="font-serif text-3xl">159+</b><p className="mt-1 text-sm text-emerald-950/55">plants and garden essentials</p></div><div><b className="font-serif text-3xl">6</b><p className="mt-1 text-sm text-emerald-950/55">specialist growing categories</p></div></div><Link href="/about" className="mt-9 inline-block rounded-full border border-emerald-950/15 bg-white px-6 py-3 font-bold">Our nursery story →</Link></div></section>

        <section className="bg-[#e6edda] py-20 lg:py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-10 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-700">Grow with confidence</p><h2 className="mt-2 font-serif text-4xl sm:text-5xl">Fresh tips from the PlantCare journal.</h2></div><div className="grid gap-5 md:grid-cols-3">{guides.map(post=><article key={post.slug} className="overflow-hidden rounded-[2rem] bg-white"><Link href={`/blog/${post.slug}`}><img src={post.image} alt="" className="aspect-[16/10] w-full object-cover"/><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{post.category} · {post.readTime}</p><h3 className="mt-3 font-serif text-2xl leading-tight">{post.title}</h3><p className="mt-3 line-clamp-2 leading-7 text-emerald-950/60">{post.excerpt}</p><span className="mt-5 inline-block font-bold text-emerald-800">Read the guide →</span></div></Link></article>)}</div></div></section>

        <section className="px-5 py-20 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-lime-300 px-6 py-16 text-center sm:px-12"><div className="absolute -left-20 -top-24 size-72 rounded-full border-[45px] border-white/25"/><div className="absolute -bottom-24 -right-16 size-64 rounded-full bg-emerald-800/10"/><p className="relative text-xs font-bold uppercase tracking-[.25em] text-emerald-800">Your greener home starts here</p><h2 className="relative mx-auto mt-3 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">Find a plant you will love growing.</h2><p className="relative mx-auto mt-5 max-w-xl text-emerald-950/65">Explore nursery-fresh plants and practical essentials for every kind of space.</p><div className="relative mt-8 flex flex-wrap justify-center gap-3"><Link href="/products" className="rounded-full bg-emerald-950 px-7 py-4 font-bold text-white">Shop all plants</Link><Link href="/contact" className="rounded-full bg-white px-7 py-4 font-bold">Ask us for help</Link></div></div></section>
      </main>
    </div>
  );
}
