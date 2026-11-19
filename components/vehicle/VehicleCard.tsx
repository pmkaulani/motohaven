import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatKSh } from "@/lib/config/dealership";
import { ArrowRight } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const coverImage = vehicle.cover_photo || vehicle.photo_urls?.[0] || "/images/car-placeholder.jpg";
  const isSold = vehicle.status === "Sold" || vehicle.sold;
  const isReserved = vehicle.status === "Reserved";

  return (
    <article className="group flex flex-col space-y-3.5">
      {/* Photograph Container (Clean open image, no heavy card wrapper) */}
      <Link
        href={`/cars/${vehicle.slug}`}
        aria-label={`View details for ${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
        className="relative aspect-[16/10] w-full bg-stone-100 rounded-lg overflow-hidden block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isSold ? "grayscale opacity-70" : "opacity-95 group-hover:opacity-100"
          }`}
          loading="lazy"
        />

        {/* Quiet status tag (only if sold or reserved) */}
        {isSold && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-stone-900 text-white">
            Sold
          </div>
        )}
        {isReserved && !isSold && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-600 text-white">
            Reserved
          </div>
        )}
      </Link>

      {/* Details (Open, editorial typography) */}
      <div className="space-y-1.5">
        <p className="text-xs text-stone-500">
          {vehicle.year} · {vehicle.condition} · {vehicle.body_type}
        </p>

        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-tight">
          <Link href={`/cars/${vehicle.slug}`} className="hover:underline">
            {vehicle.brand} {vehicle.model}
            {vehicle.trim && (
              <span className="font-normal text-stone-500 ml-1.5 text-sm sm:text-base">
                {vehicle.trim}
              </span>
            )}
          </Link>
        </h3>

        <div className="flex items-baseline justify-between pt-1">
          <p className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            {formatKSh(vehicle.price)}
          </p>
          <span className="text-[11px] font-semibold text-stone-500">
            Duty cleared
          </span>
        </div>

        <p className="text-xs text-stone-500 pt-1">
          {vehicle.mileage.toLocaleString("en-KE")} km · {vehicle.transmission} · {vehicle.fuel} · {vehicle.engine_cc}cc
        </p>

        <div className="pt-2">
          <Link
            href={`/cars/${vehicle.slug}`}
            className="text-xs font-semibold text-stone-900 hover:text-stone-600 inline-flex items-center gap-1.5"
          >
            <span>View car details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
