"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { Menu, X, MessageCircle, Phone } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Cars for sale", href: "/cars" },
    { label: "How buying works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[72px]">
          {/* Brand Wordmark (Aligned baseline) */}
          <Link href="/" className="flex items-baseline gap-1.5 focus:outline-none">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-text-primary">
              MotoHaven
            </span>
            <span className="text-xs text-text-secondary font-medium hidden sm:inline">
              Nairobi
            </span>
          </Link>

          {/* Desktop Navigation (Shared baseline with logo) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-text-primary ${
                    isActive
                      ? "text-text-primary font-semibold border-b-2 border-text-primary pb-0.5"
                      : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Single Header Action (WhatsApp Sales Desk) */}
          <div className="hidden md:flex items-center">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact MotoHaven sales desk on WhatsApp"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Sales Desk</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button (WCAG 2.1 AA Compliant) */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="p-2.5 text-text-primary hover:bg-background-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-border bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-background-secondary text-text-primary font-semibold"
                      : "text-text-primary hover:bg-background-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border space-y-2">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Sales Desk</span>
            </a>
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium border border-field bg-white text-text-primary hover:bg-background-secondary min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-text-secondary" />
              <span>Call {DEALERSHIP_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
