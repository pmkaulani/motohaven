import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { DEALERSHIP_CONFIG } from "@/lib/config/dealership";

export const metadata: Metadata = {
  title: `${DEALERSHIP_CONFIG.name} | Nairobi Licensed Car Dealership`,
  description:
    "Explore genuine inspected cars currently in stock at MotoHaven in Nairobi. Browse Land Cruisers, Prados, BMW, CX-5, Subarus with transparent pricing and direct WhatsApp enquiries.",
  keywords: [
    "cars for sale nairobi",
    "motohaven nairobi",
    "kenya car dealership",
    "foreign used cars nairobi",
    "buy car nairobi",
  ],
  metadataBase: new URL("https://motohaven.co.ke"),
  openGraph: {
    title: `${DEALERSHIP_CONFIG.name} — Nairobi Car Dealership`,
    description: "Quality inspected vehicles currently available at MotoHaven in Nairobi, Kenya.",
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
