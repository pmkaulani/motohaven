import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatKSh, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import { Calendar, Gauge, Fuel, Cog, MessageCircle, ArrowRight } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const coverImage = vehicle.cover_photo || vehicle.photo_urls?.[0] || "/images/car-placeholder.jpg";
  const isAvailable = vehicle.status === "Available" && !vehicle.sold;
  const isReserved = vehicle.status === "Reserved";
  const isSold = vehicle.status === "Sold" || vehicle.sold;

  return (
    <div className="group bg-white rounded-card border border-border hover:border-text-secondary/40 transition-all duration-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md">
      {/* Photograph Container (approx 4:3) */}
      <div className="relative aspect-[4/3] w-full bg-background-tertiary overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isSold ? "grayscale" : ""
          }`}
          loading="lazy"
        />

        {/* Condition Tag */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase rounded bg-white/95 text-text-primary shadow-sm backdrop-blur-sm">
            {vehicle.condition}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isSold ? (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-red-700 text-white shadow-sm">
              SOLD
            </span>
          ) : isReserved ? (
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded bg-amber-600 text-white shadow-sm">
              RESERVED
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded bg-emerald-700 text-white shadow-sm">
              AVAILABLE
            </span>
          )}
        </div>

        {/* Photo Count Pill */}
        {vehicle.photo_urls && vehicle.photo_urls.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-medium text-white bg-black/60 rounded backdrop-blur-sm">
            {vehicle.photo_urls.length} photos
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Make, Model, Trim, Year */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-text-secondary">
                {vehicle.year} • {vehicle.body_type || "Vehicle"}
              </p>
              <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-action transition-colors leading-tight mt-0.5">
                {vehicle.brand} {vehicle.model}
                {vehicle.trim && (
                  <span className="text-sm font-normal text-text-secondary ml-1">
                    {vehicle.trim}
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Price */}
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
              {formatKSh(vehicle.price)}
            </span>
            {vehicle.stock_reference && (
              <span className="text-[11px] text-text-secondary ml-2 font-mono">
                {vehicle.stock_reference}
              </span>
            )}
          </div>

          {/* Quick Specifications Grid */}
          <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-text-primary/70 shrink-0" />
              <span>{vehicle.mileage.toLocaleString("en-KE")} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-text-primary/70 shrink-0" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-text-primary/70 shrink-0" />
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-primary/70 shrink-0" />
              <span>{vehicle.engine_cc}cc</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-5 pt-3 border-t border-border flex items-center gap-2">
          <Link
            href={`/cars/${vehicle.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-btn text-xs font-semibold bg-action text-white hover:bg-action-hover transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isAvailable && (
            <a
              href={buildVehicleWhatsAppUrl(vehicle)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2.5 rounded-btn bg-background-secondary border border-border text-brand-whatsapp hover:bg-brand-whatsapp hover:text-white transition-colors"
              title="Enquire on WhatsApp"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
