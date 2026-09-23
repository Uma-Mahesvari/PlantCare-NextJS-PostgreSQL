import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "../components/SiteFooter";
import { CustomerChatbot } from "../components/CustomerChatbot";

export const metadata: Metadata = {
  title: { default: "PlantCare Store | Plants, Seeds & Gardening Essentials", template: "%s | PlantCare" },
  description: "Shop healthy plants, seeds, planters and gardening essentials in India, with practical plant-care guides for every growing space.",
  metadataBase: new URL("https://plantcare-store.mugeshofc.chatgpt.site"),
  alternates: { canonical: "/" },
  keywords: ["buy plants online India", "indoor plants", "garden plants", "seeds", "planters", "plant care"],
  authors: [{ name: "PlantCare" }], creator: "PlantCare", publisher: "PlantCare",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { title: "PlantCare Store", description: "Healthy plants and practical growing guidance for greener homes.", url: "/", siteName: "PlantCare", locale: "en_IN", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "PlantCare Store", description: "Grow something wonderful.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema={"@context":"https://schema.org","@type":"Organization",name:"PlantCare",url:"https://plantcare-store.mugeshofc.chatgpt.site",logo:"https://plantcare-store.mugeshofc.chatgpt.site/og.png"};
  return <html lang="en-IN"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>{children}<SiteFooter/><CustomerChatbot/></body></html>;
}
