import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read Kauseyah's stories, insights, and traditional craft articles.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
