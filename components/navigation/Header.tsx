"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { Menu, X, MessageCircle, Phone, Shield } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white border-b border-border/80">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-action flex items-center justify-center text-white font-bold text-sm tracking-tighter">
              MH
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-text-primary group-hover:text-action transition-colors">
                MotoHaven
              </span>
              <span className="text-[10px] text-text-secondary -mt-1 hidden sm:block">
                Nairobi Dealership
              </span>
            </div>
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
                    className={`text-sm font-medium transition-colors hover:text-action ${
                      isActive
                        ? "text-action font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-text-primary hover:bg-background-secondary rounded-btn transition-colors border border-border"
            >
              <Phone className="w-3.5 h-3.5 text-text-secondary" />
              <span>{DEALERSHIP_CONFIG.phone}</span>
            </a>

            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover rounded-btn transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              href="/admin"
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-btn transition-colors ml-1"
              title="Staff Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-brand-whatsapp hover:bg-background-secondary rounded-btn"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>

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
        <div className="md:hidden border-t border-border bg-white px-4 pt-3 pb-6 space-y-3">
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
                      ? "bg-background-secondary text-action font-semibold"
                      : "text-text-primary hover:bg-background-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-btn text-sm font-medium text-text-secondary hover:bg-background-secondary flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Dealership Staff Portal</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-border space-y-2">
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium border border-border rounded-btn text-text-primary hover:bg-background-secondary"
            >
              <Phone className="w-4 h-4 text-text-secondary" />
              <span>Call {DEALERSHIP_CONFIG.phone}</span>
            </a>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover rounded-btn"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
