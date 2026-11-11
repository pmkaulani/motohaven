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
    { label: "Browse Cars", href: "/cars" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[72px]">
          {/* Brand Wordmark (No invented monogram box) */}
          <Link href="/" className="flex flex-col">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-text-primary">
              MotoHaven
            </span>
            <span className="text-xs text-text-secondary -mt-1 hidden sm:block">
              Nairobi
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAdminPage && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-text-primary ${
                      isActive
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Single Header Action (WhatsApp Only) */}
          <div className="hidden md:flex items-center">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover rounded-btn transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-primary hover:bg-background-secondary rounded-btn transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-btn text-base font-medium transition-colors ${
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
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover rounded-btn"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium border border-border rounded-btn text-text-primary hover:bg-background-secondary"
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
