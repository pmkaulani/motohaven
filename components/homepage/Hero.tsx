import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QuickSearch } from "./QuickSearch";

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
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Search (Lead hierarchy) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.12]">
                Find your next car in Nairobi.
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
                Cars in stock at our Ngong Road showroom. See the price, the mileage and the photographs, then come and test-drive.
              </p>
            </div>

            {/* Mobile First: Quick Search positioned directly in hero flow (Fixes Finding 7) */}
            <div className="pt-2">
              <QuickSearch inline />
            </div>

            <div className="pt-1">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-action underline underline-offset-4"
              >
                <span>Or browse all cars in stock</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Hero Image (Desktop / Tablet view; recedes behind search on mobile) */}
          <div className="lg:col-span-6 hidden sm:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-secondary border border-border">
              {heroImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heroImageUrl}
                  alt={heroVehicleTitle || "Showroom car at MotoHaven Nairobi"}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-background-secondary text-text-secondary">
                  <p className="text-base font-semibold text-text-primary">MotoHaven Nairobi Showroom</p>
                  <p className="text-sm mt-1">Vehicles available for physical inspection on Ngong Road</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
