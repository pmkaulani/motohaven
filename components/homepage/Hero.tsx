import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  heroImageUrl?: string;
  heroVehicleTitle?: string;
}

export function Hero({
  heroImageUrl,
  heroVehicleTitle,
}: HeroProps) {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Actions (approx 42% on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
                Find your next car in Nairobi.
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                Explore vehicles currently available at MotoHaven on Ngong Road. Genuine photography, clear specifications, and direct showroom viewings.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-action text-white text-sm font-semibold hover:bg-action-hover transition-colors"
              >
                <span>Browse available cars</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-white text-text-primary text-sm font-medium border border-border hover:bg-background-secondary transition-colors"
              >
                <span>Contact us</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image (approx 58% on desktop) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-card overflow-hidden bg-background-tertiary border border-border">
              {heroImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heroImageUrl}
                  alt={heroVehicleTitle || "Showroom vehicle"}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-background-secondary text-text-secondary">
                  <p className="text-base font-semibold text-text-primary">MotoHaven Nairobi Showroom</p>
                  <p className="text-sm mt-1">Inspected vehicles available for viewing on Ngong Road</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
