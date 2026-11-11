import React from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-3">
            <Link href="/" className="font-extrabold text-lg tracking-tight text-text-primary block">
              {DEALERSHIP_CONFIG.name}
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              An independent car dealership located on Ngong Road, Nairobi. Genuine vehicles, transparent pricing, and direct customer assistance.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary text-xs uppercase tracking-wider mb-2">
              Explore
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/cars" className="hover:text-text-primary transition-colors">
                  Available Vehicles
                </Link>
              </li>
              <li>
                <Link href="/cars?body_type=SUV" className="hover:text-text-primary transition-colors">
                  SUVs & 4x4s
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-text-primary transition-colors">
                  About MotoHaven
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text-primary transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-2 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary text-xs uppercase tracking-wider mb-2">
              Contact Showroom
            </p>
            <p>{DEALERSHIP_CONFIG.address}</p>
            <p>
              Phone:{" "}
              <a
                href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                className="text-text-primary font-medium hover:underline"
              >
                {DEALERSHIP_CONFIG.phone}
              </a>
            </p>
            <div className="pt-2">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-brand-whatsapp transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-brand-whatsapp fill-current" />
                <span>WhatsApp Sales Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} MotoHaven. Nairobi, Kenya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">
              Contact
            </Link>
            <Link href="/admin/login" className="hover:text-text-primary transition-colors">
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
