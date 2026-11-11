import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocalDB } from "@/lib/db/local-db";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EnquirySection } from "@/components/vehicle/EnquirySection";
import { formatKSh, DEALERSHIP_CONFIG, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import { Phone, MessageCircle } from "lucide-react";

interface VehiclePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0; // Dynamic server query

export default function VehicleDetailPage({ params }: VehiclePageProps) {
  const vehicle = LocalDB.getVehicleBySlug(params.slug);

  if (!vehicle) {
    notFound();
  }

  const similarVehicles = LocalDB.getSimilarVehicles(vehicle.id, 3);
  const isAvailable = vehicle.status === "Available" && !vehicle.sold;
  const isSold = vehicle.status === "Sold" || vehicle.sold;
  const isReserved = vehicle.status === "Reserved";

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 pb-24 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Open Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:underline">
            Inventory
          </Link>
          <span>/</span>
          <span className="text-text-primary">
            {vehicle.year} {vehicle.brand} {vehicle.model}
          </span>
        </div>

        {/* Clean Open Page Header (Unboxed, Anti-Card) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <p className="text-sm text-text-secondary">
              {vehicle.year} · {vehicle.condition}
              {isSold && <span className="ml-2 font-bold text-red-700">· SOLD</span>}
              {isReserved && <span className="ml-2 font-semibold text-amber-600">· RESERVED</span>}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
              {vehicle.brand} {vehicle.model}
              {vehicle.trim && (
                <span className="text-xl sm:text-2xl font-normal text-text-secondary ml-2">
                  {vehicle.trim}
                </span>
              )}
            </h1>
          </div>

          <div className="text-left md:text-right">
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {formatKSh(vehicle.price)}
            </p>
            {vehicle.stock_reference && (
              <p className="text-xs text-text-secondary mt-0.5 font-mono">
                Stock Ref: {vehicle.stock_reference}
              </p>
            )}
          </div>
        </div>

        {/* Main Content Layout: Gallery & Details (Left 7-8) + Sticky Enquiry Panel (Right 4-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-10">
            {/* Gallery */}
            <VehicleGallery
              images={vehicle.photo_urls}
              vehicleTitle={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            />

            {/* Single Unified Specifications Table (Unboxed definition list) */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text-primary">
                Vehicle Specifications
              </h2>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Make</dt>
                  <dd className="font-medium text-text-primary">{vehicle.brand}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Model</dt>
                  <dd className="font-medium text-text-primary">{vehicle.model}</dd>
                </div>
                {vehicle.trim && (
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-text-secondary">Trim</dt>
                    <dd className="font-medium text-text-primary">{vehicle.trim}</dd>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Year of Manufacture</dt>
                  <dd className="font-medium text-text-primary">{vehicle.year}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Mileage</dt>
                  <dd className="font-medium text-text-primary">{vehicle.mileage.toLocaleString("en-KE")} km</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Condition</dt>
                  <dd className="font-medium text-text-primary">{vehicle.condition}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Engine Capacity</dt>
                  <dd className="font-medium text-text-primary">{vehicle.engine_cc}cc</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Transmission</dt>
                  <dd className="font-medium text-text-primary">{vehicle.transmission}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <dt className="text-text-secondary">Fuel Type</dt>
                  <dd className="font-medium text-text-primary">{vehicle.fuel}</dd>
                </div>
                {vehicle.body_type && (
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-text-secondary">Body Type</dt>
                    <dd className="font-medium text-text-primary">{vehicle.body_type}</dd>
                  </div>
                )}
                {vehicle.drivetrain && (
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-text-secondary">Drivetrain</dt>
                    <dd className="font-medium text-text-primary">{vehicle.drivetrain}</dd>
                  </div>
                )}
                {vehicle.origin && (
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-text-secondary">Origin</dt>
                    <dd className="font-medium text-text-primary">{vehicle.origin}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="space-y-3 border-t border-border pt-6">
                <h2 className="text-lg font-bold text-text-primary">
                  Vehicle Description
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Features (Only shown when data exists, unboxed list) */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-3 border-t border-border pt-6">
                <h2 className="text-lg font-bold text-text-primary">
                  Features & Equipment
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-primary list-disc list-inside">
                  {vehicle.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Enquiry Panel (Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <EnquirySection vehicle={vehicle} />
          </div>
        </div>

        {/* Similar Vehicles Section */}
        {similarVehicles.length > 0 && (
          <section className="pt-12 border-t border-border space-y-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight">
                Similar Available Vehicles
              </h3>
              <p className="text-sm text-text-secondary mt-0.5">
                Related vehicles currently in stock at MotoHaven
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {similarVehicles.map((sim) => (
                <VehicleCard key={sim.id} vehicle={sim} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-3 px-4 md:hidden shadow-md flex items-center gap-3">
        <a
          href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
          className="flex-1 h-11 rounded-btn border border-border bg-white text-text-primary text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Phone className="w-4 h-4 text-text-secondary" />
          <span>Call Desk</span>
        </a>

        {isAvailable && (
          <a
            href={buildVehicleWhatsAppUrl(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-11 rounded-btn bg-brand-whatsapp text-white text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
