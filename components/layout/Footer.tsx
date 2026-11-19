import React from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MessageCircle, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand info */}
          <div className="sm:col-span-2 md:col-span-5 space-y-3 sm:space-y-4">
            <Link href="/" className="inline-block group focus:outline-none">
              <span className="font-bold text-xl sm:text-2xl tracking-tight text-white block">
                MotoHaven
              </span>
              <span className="text-xs text-stone-400 font-medium block">
                Ngong Road Showroom · Nairobi, Kenya
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              An independent car dealership located on Ngong Road, Nairobi. Genuine imported stock from Japan and the UK, transparent pricing, and direct in-person service.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3 text-xs sm:text-sm">
            <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2 sm:mb-3">
              Explore
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/cars" className="hover:text-white transition-colors py-0.5 inline-block">
                  All Showroom Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?body_type=SUV" className="hover:text-white transition-colors py-0.5 inline-block">
                  SUVs & 4x4
                </Link>
              </li>
              <li>
                <Link href="/cars?body_type=Saloon" className="hover:text-white transition-colors py-0.5 inline-block">
                  Saloons & Sedans
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors py-0.5 inline-block">
                  How Buying Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors py-0.5 inline-block">
                  About MotoHaven
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Coordinates & Contact */}
          <div className="sm:col-span-2 md:col-span-4 space-y-3 text-xs sm:text-sm">
            <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2 sm:mb-3">
              Showroom Contact
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{DEALERSHIP_CONFIG.address}</span>
            </p>
            <p className="text-stone-400">
              Hours: Mon–Fri 8:00 AM – 6:00 PM · Sat 9:00 AM – 5:00 PM
            </p>
            <p className="text-stone-400">
              Direct Phone:{" "}
              <a
                href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                className="text-white font-medium hover:underline"
              >
                {DEALERSHIP_CONFIG.phone}
              </a>
            </p>
            <div className="pt-2">
              <a
                href={buildGeneralWhatsAppUrl("Hello MotoHaven, I have an enquiry about your showroom cars.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-whatsapp hover:bg-brand-whatsappHover text-white text-xs font-semibold transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Showroom Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} MotoHaven Nairobi. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6">
            <Link href="/how-it-works" className="hover:text-stone-300 transition-colors py-1">
              Buying Guide
            </Link>
            <Link href="/privacy" className="hover:text-stone-300 transition-colors py-1">
              Privacy Notice
            </Link>
            <Link href="/contact" className="hover:text-stone-300 transition-colors py-1">
              Contact & Location
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
