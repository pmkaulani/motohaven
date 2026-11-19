"use client";

import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { ArrowRight, MessageCircle } from "lucide-react";

interface HeroProps {
  vehicles?: Vehicle[];
  initialHeroVehicle?: Vehicle | null;
}

export function Hero({ vehicles = [], initialHeroVehicle }: HeroProps) {
  // Select active showcase vehicle (e.g. Prado or first available)
  const activeCar = initialHeroVehicle || vehicles[0] || null;
  const fallbackImg = "https://images.unsplash.com/photo-1650530579355-7ad9d4766043?w=1600&auto=format&fit=crop&q=85";
  const heroImage = activeCar?.cover_photo || activeCar?.photo_urls?.[0] || fallbackImg;
  const carTitle = activeCar ? `${activeCar.year} ${activeCar.brand} ${activeCar.model}${activeCar.trim ? ` ${activeCar.trim}` : ""}` : "Showroom Collection";

  return (
    <section className="relative w-full min-h-[100dvh] sm:min-h-screen flex items-center overflow-hidden bg-stone-950">
      {/* Background Car Image: Fills the screen, positioned to show the car clearly on mobile and desktop */}
      <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[80%] md:w-[70%] lg:w-[65%] xl:w-[60%] h-full z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={carTitle}
          className="w-full h-full object-cover object-[70%_center] sm:object-right"
          loading="eager"
        />
        {/* Subtle soft feather gradient on the left edge of the photo on desktop */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-stone-950 to-transparent hidden sm:block pointer-events-none" />
      </div>

      {/* Desktop Horizontal Gradient: Solid stone-950 on left where text lives, fading smoothly to transparent */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950 via-35% md:via-stone-950/90 md:via-45% to-transparent z-[1] pointer-events-none hidden sm:block" />
      
      {/* Mobile Vignette Gradient: Solid stone-950 at top behind transparent header & text, fading down so car is clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/85 via-50% to-stone-950/30 z-[1] pointer-events-none sm:hidden" />

      {/* Fullscreen Content: Offset with top padding so it flows naturally under the transparent header */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-36 pb-12 sm:pb-16 flex items-center">
        <div className="max-w-xl space-y-5 sm:space-y-6">
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              The Car of Your Dreams.
              <span className="block text-lg sm:text-2xl lg:text-3xl font-normal text-stone-400 mt-1.5 sm:mt-3 tracking-normal">
                Direct in our showroom.
              </span>
            </h1>

            {/* "No broker" text: refined and smaller as requested */}
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md font-normal pt-0.5">
              No broker intermediaries. No phantom listings. Every motorcar in our showroom is physically present on Ngong Road, fully duty-cleared, and ready for an unhurried test drive today.
            </p>
          </div>

          {/* Action Buttons: Stacked full-width on mobile for easy thumb tapping, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <a
              href="#collection"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-stone-950 font-semibold text-sm hover:bg-stone-100 transition-colors shadow-lg min-h-[46px]"
            >
              <span>View Available Cars</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={buildGeneralWhatsAppUrl("Hello MotoHaven, I would like to enquire about visiting your Ngong Road showroom.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-colors shadow-md min-h-[46px]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Showroom Desk</span>
            </a>
          </div>

          {/* Quiet Footer Note */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 text-[11px] sm:text-xs text-stone-400 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1">
            <span>{carTitle}</span>
            <span>·</span>
            <span>Ngong Road Showroom, Nairobi</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Verified Auction Sheets & Kilometres</span>
          </div>
        </div>
      </div>
    </section>
  );
}
