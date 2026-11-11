import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

interface HeroProps {
  heroImageUrl?: string;
  heroVehicleTitle?: string;
  heroVehiclePrice?: string;
  heroVehicleSlug?: string;
}

export function Hero({
  heroImageUrl = "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794248603531-pr17p468u49.jpg",
  heroVehicleTitle = "BMW M5 Competition 2023",
  heroVehiclePrice = "KSh 15,000,000",
  heroVehicleSlug = "bmw-m5-2023-6a5d",
}: HeroProps) {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-xs font-semibold text-text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Available Showroom Inventory</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
                Find your next car in Nairobi.
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
                Explore genuine inspected vehicles currently held in stock at MotoHaven. Direct showroom viewings, verified specs, and transparent KSh pricing.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-action text-white text-sm font-semibold hover:bg-action-hover transition-colors shadow-sm"
              >
                <span>Browse available cars</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-background-secondary text-text-primary text-sm font-semibold border border-border hover:bg-background-tertiary transition-colors"
              >
                <span>Visit Showroom</span>
              </Link>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-action shrink-0" />
                <span>Inspected & Clean Docs</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-action shrink-0" />
                <span>Ngong Rd Showroom</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image (Actual Dealership Vehicle) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-card overflow-hidden border border-border bg-background-tertiary shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt={heroVehicleTitle}
                className="w-full aspect-[4/3] object-cover"
                loading="eager"
              />

              {/* Verified Stock Tag Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded bg-white/95 backdrop-blur-sm border border-border flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                    In Stock at MotoHaven
                  </p>
                  <p className="text-sm font-bold text-text-primary leading-tight">
                    {heroVehicleTitle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-text-primary">
                    {heroVehiclePrice}
                  </p>
                  <Link
                    href={`/cars/${heroVehicleSlug}`}
                    className="text-[11px] font-semibold text-action underline hover:no-underline"
                  >
                    View Car →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
