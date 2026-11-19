"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { Menu, X, MessageCircle, Phone, ArrowUpRight } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  // Track scroll position to transition header from transparent to solid white
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "The Collection", href: "/cars" },
    { label: "How Buying Works", href: "/how-it-works" },
    { label: "About MotoHaven", href: "/about" },
    { label: "Visit Showroom", href: "/contact" },
  ];

  // Header appearance state: Transparent over dark hero when at top of homepage, solid white otherwise
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-b border-white/10 text-white"
            : "bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-sm"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] sm:h-[76px]">
            {/* Brand Wordmark & Showroom Coordinates */}
            <Link href="/" className="flex items-center gap-3 focus:outline-none">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm tracking-tighter transition-colors ${
                  isTransparent
                    ? "bg-white/15 text-white border border-white/20"
                    : "bg-stone-900 text-white"
                }`}
              >
                MH
              </div>
              <div>
                <span
                  className={`font-extrabold text-lg sm:text-xl tracking-tight block leading-none transition-colors ${
                    isTransparent ? "text-white" : "text-stone-900"
                  }`}
                >
                  MotoHaven
                </span>
                <span
                  className={`text-[11px] font-medium tracking-wide hidden sm:block mt-0.5 transition-colors ${
                    isTransparent ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  Ngong Road Showroom · Nairobi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isTransparent
                        ? isActive
                          ? "bg-white/20 text-white font-bold"
                          : "text-stone-300 hover:text-white hover:bg-white/10"
                        : isActive
                        ? "bg-stone-100 text-stone-900 font-bold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Header Action Button */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={buildGeneralWhatsAppUrl("Hello MotoHaven, I would like to enquire about visiting your showroom.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact MotoHaven on WhatsApp"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover transition-all shadow-sm min-h-[40px]"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Showroom</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </a>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Showroom"
                className="p-2 rounded-xl bg-brand-whatsapp text-white flex items-center justify-center min-w-[40px] min-h-[40px]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                className={`p-2 rounded-xl transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center ${
                  isTransparent
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-stone-100 text-stone-900 hover:bg-stone-200"
                }`}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl text-stone-900"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-stone-100 text-stone-900 font-bold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-stone-100 space-y-2">
              <a
                href={buildGeneralWhatsAppUrl("Hello MotoHaven, I would like to enquire about visiting your showroom.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover min-h-[44px] shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Showroom</span>
              </a>
              <a
                href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold border border-stone-200 bg-white text-stone-900 hover:bg-stone-50 min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-stone-500" />
                <span>Call: {DEALERSHIP_CONFIG.phone}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for non-homepage views so content sits below the fixed header */}
      {!isHome && <div className="h-[68px] sm:h-[76px]" />}
    </>
  );
}
