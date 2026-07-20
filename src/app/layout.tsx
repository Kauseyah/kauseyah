import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/CartContext";
import { createClient } from "@/utils/supabase/server";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/constants";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/Loader";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Toaster } from "react-hot-toast";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Woven by Hands. Born from Tribes.`,
    template: `${SITE_NAME} - %s`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Handlooms", "Sarees", "Tribal Crafts", "Kauseyah", 
    "Chhattisgarh", "Delhi", "Mumbai", "Hyderabad", 
    "Pune", "Bangalore", "Kolkata", "Chennai", "Ahmedabad",
    "Handcrafted apparels", "Eco-friendly clothing", "Indian Artisans"
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Woven by Hands. Born from Tribes.`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Woven by Hands. Born from Tribes.`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
  const { data: subcategories } = await supabase.from("subcategories").select("*").order("created_at", { ascending: true });

  const dynamicCategoryGroups = categories?.map(cat => ({
    id: cat.id,
    label: cat.name,
    href: `/collections/${cat.slug}`,
    icon: "✨",
    description: cat.description || "",
    items: subcategories?.filter(sub => sub.category_id === cat.id).map(sub => ({
      label: sub.name,
      href: `/collections/${sub.slug}`
    })) || []
  })) || [];

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased scroll-smooth overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#1C1C1C] overflow-x-hidden max-w-[100vw]">
        <CartProvider>
          <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen">
            <Toaster position="top-center" />
            <Loader />
            <Navbar dynamicCategories={dynamicCategoryGroups} />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
