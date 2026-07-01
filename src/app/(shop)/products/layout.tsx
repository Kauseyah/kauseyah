import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products & Services",
  description: "Browse Kauseyah's full range of authentic handlooms, clothing, jewellery, and tribal gifts.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
