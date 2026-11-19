import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatKSh, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import { ArrowRight, MessageCircle } from "lucide-react";

interface ShowroomSpotlightProps {
  vehicle: Vehicle | null;
}

export function ShowroomSpotlight({ vehicle }: ShowroomSpotlightProps) {
  if (!vehicle) return null;

  const coverImage = vehicle.cover_photo || vehicle.photo_urls?.[0];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Photograph (Clean frame, no outer card) */}
          <div className="lg:col-span-7">
            <Link
              href={`/cars/${vehicle.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </Link>
          </div>

          {/* Editorial Details (Clean typography, no card boxes, no labels) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                {vehicle.year} · {vehicle.condition} {vehicle.origin ? `· ${vehicle.origin}` : ""}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-1">
                {vehicle.brand} {vehicle.model}
                {vehicle.trim && (
                  <span className="font-normal text-stone-500 block sm:inline sm:ml-2 text-xl sm:text-2xl">
                    {vehicle.trim}
                  </span>
                )}
              </h2>
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Showroom Price · Duty Cleared
                </span>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight mt-0.5">
                  {formatKSh(vehicle.price)}
                </p>
              </div>
            </div>

            {vehicle.description && (
              <p className="text-sm text-stone-600 leading-relaxed">
                {vehicle.description}
              </p>
            )}

            {/* Clean Specifications Row (No cards, no boxes) */}
            <div className="border-t border-b border-stone-200 py-3 text-xs sm:text-sm divide-y divide-stone-100">
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Engine</span>
                <span className="font-semibold text-stone-900">{vehicle.engine_cc}cc · {vehicle.fuel}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Transmission</span>
                <span className="font-semibold text-stone-900">{vehicle.transmission}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Odometer</span>
                <span className="font-semibold text-stone-900">{vehicle.mileage.toLocaleString("en-KE")} km</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Drivetrain</span>
                <span className="font-semibold text-stone-900">{vehicle.drivetrain || "AWD"}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href={`/cars/${vehicle.slug}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-stone-900 text-white text-xs sm:text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <span>Full Specifications</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={buildVehicleWhatsAppUrl(vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
