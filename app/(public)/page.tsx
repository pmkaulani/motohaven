import React from "react";
import { Hero } from "@/components/homepage/Hero";
import { ShowroomSpotlight } from "@/components/homepage/ShowroomSpotlight";
import { ShowroomFloor } from "@/components/homepage/ShowroomFloor";
import { WhyMotoHaven } from "@/components/homepage/WhyMotoHaven";
import { DealershipInfo } from "@/components/homepage/DealershipInfo";
import { VehiclesRepository } from "@/lib/repositories/vehicles";

export const revalidate = 60; // 60-second CDN caching with on-demand staff revalidation (Finding R15)

export default async function HomePage() {
  const result = await VehiclesRepository.getPublishedVehicles({ limit: 50, sort: "recent" });
  const vehicles = result.vehicles;
  
  // Hero vehicle: Land Cruiser Prado or primary flagship SUV
  const heroVehicle =
    vehicles.find((v) => v.model?.toLowerCase().includes("prado")) ||
    vehicles[0] ||
    null;

  // Spotlight vehicle: High performance flagship (e.g. BMW M5 Competition)
  const spotlightVehicle =
    vehicles.find((v) => v.model?.toLowerCase().includes("m5") || v.price >= 10000000) ||
    (vehicles.length > 1 ? vehicles[1] : null);

  return (
    <div className="bg-white">
      {/* 1. Cinematic Showroom Plinth Hero (Clean, Open, No Floating Cards) */}
      <Hero
        vehicles={vehicles}
        initialHeroVehicle={heroVehicle}
      />

      {/* 2. Flagship Centerpiece (Open Editorial Showcase, No Boxed Cards) */}
      {spotlightVehicle && <ShowroomSpotlight vehicle={spotlightVehicle} />}

      {/* 3. The Showroom Floor (Open Brochure Catalog & Filters) */}
      <ShowroomFloor vehicles={vehicles} totalCount={result.total} />

      {/* 4. Discover Why MotoHaven (Open Magazine Narrative, No Cards) */}
      <WhyMotoHaven />

      {/* 5. Visit the Ngong Road Showroom */}
      <DealershipInfo />
    </div>
  );
}
