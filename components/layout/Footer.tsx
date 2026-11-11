import React from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border mt-auto">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-action flex items-center justify-center text-white font-bold text-xs tracking-tighter">
                MH
              </div>
              <span className="font-bold text-lg tracking-tight text-text-primary">
                {DEALERSHIP_CONFIG.name}
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed">
              {DEALERSHIP_CONFIG.description}
            </p>
            <div className="pt-2">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-text-primary hover:text-brand-whatsapp transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-brand-whatsapp fill-current" />
                <span>Chat with our sales desk</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Inventory & Services
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/cars" className="hover:text-action transition-colors">
                  All Available Vehicles
                </Link>
              </li>
              <li>
                <Link href="/cars?body_type=SUV" className="hover:text-action transition-colors">
                  SUVs & 4x4s
                </Link>
              </li>
              <li>
                <Link href="/cars?body_type=Saloon" className="hover:text-action transition-colors">
                  Saloons & Sedans
                </Link>
              </li>
              <li>
                <Link href="/cars?condition=Foreign+Used" className="hover:text-action transition-colors">
                  Foreign Used / Fresh Imports
                </Link>
              </li>
              <li>
                <Link href="/cars?sort=recent" className="hover:text-action transition-colors">
                  Recent Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Showroom & Working Hours
            </h4>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-text-primary shrink-0 mt-0.5" />
                <span>{DEALERSHIP_CONFIG.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p>Mon – Fri: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                  <p>Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                  <p>Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-text-primary shrink-0" />
                <a
                  href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                  className="hover:text-action font-medium"
                >
                  {DEALERSHIP_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-text-primary shrink-0" />
                <a
                  href={`mailto:${DEALERSHIP_CONFIG.email}`}
                  className="hover:text-action"
                >
                  {DEALERSHIP_CONFIG.email}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-text-secondary">
                Viewings and test drives can be scheduled online or directly over phone / WhatsApp.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} MotoHaven. Licensed Nairobi Dealership. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-action transition-colors">
              About MotoHaven
            </Link>
            <Link href="/contact" className="hover:text-action transition-colors">
              Directions & Contact
            </Link>
            <Link href="/admin/login" className="hover:text-action transition-colors text-[11px]">
              Staff Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
