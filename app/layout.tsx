import type { Metadata } from "next";
import "./globals.css";
import { DEALERSHIP_CONFIG, getSiteUrl } from "@/lib/config/dealership";

export const metadata: Metadata = {
  title: `${DEALERSHIP_CONFIG.name} | Nairobi Car Dealership`,
  description:
    "Vehicles currently in stock at our Ngong Road showroom in Nairobi. Transparent pricing, detailed specifications, and direct viewings.",
  keywords: [
    "cars for sale nairobi",
    "motohaven nairobi",
    "kenya car dealership",
    "used cars nairobi",
    "buy car nairobi",
  ],
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: `${DEALERSHIP_CONFIG.name} — Nairobi Car Dealership`,
    description: "Vehicles in stock at our Ngong Road showroom in Nairobi, Kenya.",
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
      <body className="min-h-full flex flex-col bg-white text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-text-primary focus:border focus:border-border text-xs font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
