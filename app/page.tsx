import React from "react";
import Link from "next/link";
import { Hero } from "@/components/homepage/Hero";
import { QuickSearch } from "@/components/homepage/QuickSearch";
import { PopularCategories } from "@/components/homepage/PopularCategories";
import { WhyMotoHaven } from "@/components/homepage/WhyMotoHaven";
import { DealershipInfo } from "@/components/homepage/DealershipInfo";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { LocalDB } from "@/lib/db/local-db";
import { ArrowRight } from "lucide-react";

export const revalidate = 0; // Dynamic server render for live inventory

export default function HomePage() {
  const result = LocalDB.getVehicles({ limit: 6, sort: "recent" });
  const vehicles = result.vehicles;
  const heroVehicle = vehicles[0] || null;

  return (
    <div>
      {/* Hero */}
      <Hero
        heroImageUrl={heroVehicle?.cover_photo || heroVehicle?.photo_urls[0]}
        heroVehicleTitle={heroVehicle ? `${heroVehicle.year} ${heroVehicle.brand} ${heroVehicle.model}` : undefined}
        heroVehiclePrice={heroVehicle ? `KSh ${heroVehicle.price.toLocaleString("en-KE")}` : undefined}
        heroVehicleSlug={heroVehicle?.slug}
      />

      {/* Quick Search */}
      <QuickSearch />

      {/* Popular Categories */}
      <PopularCategories />

      {/* Available Vehicles Section */}
      <section className="py-12 lg:py-16 bg-white border-b border-border">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Current Showroom Stock
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1">
                Available Vehicles
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Inspected vehicles on site in Nairobi. Real photos, real prices.
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-action hover:underline self-start sm:self-auto"
            >
              <span>View all inventory ({result.total})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Inventory Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          {vehicles.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-card bg-background-secondary p-8">
              <p className="text-base font-semibold text-text-primary">
                No vehicles currently listed
              </p>
              <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                Check back shortly as new inspected stock arrives, or contact our sales team directly for specific orders.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          {/* Bottom browse button */}
          <div className="mt-10 text-center">
            <Link
              href="/cars"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-btn bg-background-secondary text-text-primary text-sm font-semibold border border-border hover:bg-background-tertiary transition-colors shadow-sm"
            >
              <span>Browse All {result.total} Vehicles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why MotoHaven */}
      <WhyMotoHaven />

      {/* Dealership Info & Location */}
      <DealershipInfo />
    </div>
  );
}
