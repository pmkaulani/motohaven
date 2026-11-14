import React from "react";
import Link from "next/link";
import { Hero } from "@/components/homepage/Hero";
import { PopularCategories } from "@/components/homepage/PopularCategories";
import { WhyMotoHaven } from "@/components/homepage/WhyMotoHaven";
import { DealershipInfo } from "@/components/homepage/DealershipInfo";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { ArrowRight } from "lucide-react";

export const revalidate = 0; // Dynamic server render for live inventory

export default async function HomePage() {
  const result = await VehiclesRepository.getPublishedVehicles({ limit: 6, sort: "recent" });
  const vehicles = result.vehicles;
  const heroVehicle = vehicles[0] || null;

  return (
    <div>
      {/* 1. Hero with integrated mobile-first search */}
      <Hero
        heroImageUrl={heroVehicle?.cover_photo || heroVehicle?.photo_urls[0]}
        heroVehicleTitle={heroVehicle ? `${heroVehicle.year} ${heroVehicle.brand} ${heroVehicle.model}` : undefined}
      />

      {/* 2. Available Vehicles Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-border">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Featured Showroom Inventory
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Vehicles currently in stock and available for physical viewing at our Ngong Road showroom.
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-action underline underline-offset-4"
            >
              <span>View all cars ({result.total})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Inventory Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          {vehicles.length === 0 ? (
            <div className="py-16 text-center border border-border bg-background-secondary p-8">
              <p className="text-base font-semibold text-text-primary">
                No vehicles currently listed
              </p>
              <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                Check back shortly as new showroom stock arrives, or contact our sales desk directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Browse by body type (Text-led links, Anti-Card) */}
      <PopularCategories />

      {/* 4. Why MotoHaven (3 unboxed factual text columns) */}
      <WhyMotoHaven />

      {/* 5. Dealership Information & Coordinates */}
      <DealershipInfo />
    </div>
  );
}
