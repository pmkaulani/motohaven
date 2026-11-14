import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatKSh } from "@/lib/config/dealership";
import { ArrowUpRight } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const coverImage = vehicle.cover_photo || vehicle.photo_urls?.[0] || "/images/car-placeholder.jpg";
  const isSold = vehicle.status === "Sold" || vehicle.sold;
  const isReserved = vehicle.status === "Reserved";

  return (
    <article className="group bg-white border border-border flex flex-col overflow-hidden hover:border-text-primary/40 transition-colors">
      {/* Photograph Container (Consistent 4:3 ratio) */}
      <Link
        href={`/cars/${vehicle.slug}`}
        aria-label={`View details for ${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
        className="relative aspect-[4/3] w-full bg-background-secondary overflow-hidden block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          className={`w-full h-full object-cover transition-opacity group-hover:opacity-95 ${
            isSold ? "grayscale" : ""
          }`}
          loading="lazy"
        />

        {/* Status indicator (Only shown for non-available states) */}
        {(isSold || isReserved) && (
          <div className="absolute top-3 right-3">
            {isSold ? (
              <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-red-700 text-white">
                Sold
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-amber-600 text-white">
                Reserved
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Year & Condition */}
          <p className="text-xs text-text-secondary">
            {vehicle.year} · {vehicle.condition}
          </p>

          {/* Make and Model (Fixed min-height for alignment) */}
          <h3 className="text-base sm:text-lg font-bold text-text-primary mt-1 leading-snug min-h-[2.75rem] line-clamp-2">
            <Link href={`/cars/${vehicle.slug}`} className="hover:underline">
              {vehicle.brand} {vehicle.model}
              {vehicle.trim && (
                <span className="text-sm font-normal text-text-secondary ml-1.5">
                  {vehicle.trim}
                </span>
              )}
            </Link>
          </h3>

          {/* Price - Lead visual hierarchy */}
          <p className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-1.5">
            {formatKSh(vehicle.price)}
          </p>

          {/* Aligned Specifications Line */}
          <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border-subtle line-clamp-1">
            {vehicle.mileage.toLocaleString("en-KE")} km · {vehicle.transmission} · {vehicle.fuel} · {vehicle.engine_cc}cc
          </p>
        </div>

        {/* Quiet text link with arrow affordance (Replaced heavy black bar) */}
        <div className="pt-1 flex items-center justify-between">
          <Link
            href={`/cars/${vehicle.slug}`}
            className="text-xs font-semibold text-text-primary group-hover:text-action hover:underline inline-flex items-center gap-1 min-h-[36px]"
          >
            <span>View specifications</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[11px] text-text-secondary">Ngong Road</span>
        </div>
      </div>
    </article>
  );
}
