import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatKSh } from "@/lib/config/dealership";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const coverImage = vehicle.cover_photo || vehicle.photo_urls?.[0] || "/images/car-placeholder.jpg";
  const isSold = vehicle.status === "Sold" || vehicle.sold;
  const isReserved = vehicle.status === "Reserved";

  return (
    <article className="group bg-white rounded-card border border-border flex flex-col overflow-hidden">
      {/* Photograph Container (4:3 aspect ratio) */}
      <Link href={`/cars/${vehicle.slug}`} className="relative aspect-[4/3] w-full bg-background-tertiary overflow-hidden block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          className={`w-full h-full object-cover transition-opacity group-hover:opacity-95 ${
            isSold ? "grayscale" : ""
          }`}
          loading="lazy"
        />

        {/* Status Indicator (Sold or Reserved only; Available is not badged) */}
        {(isSold || isReserved) && (
          <div className="absolute top-3 right-3">
            {isSold ? (
              <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-red-700 text-white">
                SOLD
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-amber-600 text-white">
                RESERVED
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Year · Condition */}
          <p className="text-xs text-text-secondary">
            {vehicle.year} · {vehicle.condition}
          </p>

          {/* Make and Model */}
          <h3 className="text-base sm:text-lg font-bold text-text-primary mt-1 leading-snug">
            <Link href={`/cars/${vehicle.slug}`} className="hover:underline">
              {vehicle.brand} {vehicle.model}
              {vehicle.trim && (
                <span className="text-sm font-normal text-text-secondary ml-1.5">
                  {vehicle.trim}
                </span>
              )}
            </Link>
          </h3>

          {/* Price */}
          <p className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight mt-1.5">
            {formatKSh(vehicle.price)}
          </p>

          {/* Single Compact Specifications Line */}
          <p className="text-xs text-text-secondary mt-3 pt-3 border-t border-border">
            {vehicle.mileage.toLocaleString("en-KE")} km · {vehicle.transmission} · {vehicle.fuel} · {vehicle.engine_cc}cc
          </p>
        </div>

        {/* Single View Details Action */}
        <div className="pt-2">
          <Link
            href={`/cars/${vehicle.slug}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-btn text-xs font-semibold bg-action text-white hover:bg-action-hover transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
