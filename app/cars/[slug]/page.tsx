import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocalDB } from "@/lib/db/local-db";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EnquirySection } from "@/components/vehicle/EnquirySection";
import { formatKSh, DEALERSHIP_CONFIG, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import {
  Calendar,
  Gauge,
  Fuel,
  Cog,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  FileText,
  Phone,
  MessageCircle,
} from "lucide-react";

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
    <div className="bg-background-secondary min-h-screen py-6 sm:py-10 pb-28 md:pb-12">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:text-action">
            Home
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-action">
            Inventory
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium truncate max-w-xs">
            {vehicle.year} {vehicle.brand} {vehicle.model}
          </span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white p-5 sm:p-6 rounded-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-background-secondary text-text-primary border border-border">
                {vehicle.condition}
              </span>
              {isSold ? (
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded bg-red-700 text-white">
                  SOLD
                </span>
              ) : isReserved ? (
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase rounded bg-amber-600 text-white">
                  RESERVED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase rounded bg-emerald-700 text-white">
                  AVAILABLE IN NAIROBI
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {vehicle.year} {vehicle.brand} {vehicle.model}
              {vehicle.trim && (
                <span className="text-xl font-normal text-text-secondary ml-2">
                  {vehicle.trim}
                </span>
              )}
            </h1>

            <div className="flex items-center gap-3 text-xs text-text-secondary pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-text-primary" />
                <span>{vehicle.location || DEALERSHIP_CONFIG.address}</span>
              </span>
              {vehicle.stock_reference && (
                <span className="font-mono bg-background-secondary px-2 py-0.5 rounded border border-border">
                  Stock Ref: {vehicle.stock_reference}
                </span>
              )}
            </div>
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <p className="text-xs text-text-secondary font-medium">Selling Price</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {formatKSh(vehicle.price)}
            </p>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Taxes & Import Duty Verified
            </p>
          </div>
        </div>

        {/* Main Content Layout: Gallery & Details (Left 7 Cols) + Sticky Enquiry Panel (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Gallery */}
            <VehicleGallery
              images={vehicle.photo_urls}
              vehicleTitle={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            />

            {/* Quick Specs Highlight Box */}
            <div className="bg-white p-5 rounded-card border border-border shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-text-secondary flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-action" />
                  <span>Mileage</span>
                </span>
                <p className="text-sm font-bold text-text-primary">
                  {vehicle.mileage.toLocaleString("en-KE")} km
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-text-secondary flex items-center gap-1">
                  <Cog className="w-3.5 h-3.5 text-action" />
                  <span>Transmission</span>
                </span>
                <p className="text-sm font-bold text-text-primary">
                  {vehicle.transmission}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-text-secondary flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-action" />
                  <span>Fuel Type</span>
                </span>
                <p className="text-sm font-bold text-text-primary">
                  {vehicle.fuel}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-text-secondary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-action" />
                  <span>Engine Capacity</span>
                </span>
                <p className="text-sm font-bold text-text-primary">
                  {vehicle.engine_cc}cc
                </p>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-4">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-action" />
                <span>Vehicle Specifications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs border-t border-border pt-4">
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Make</span>
                  <span className="font-semibold text-text-primary">{vehicle.brand}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Model</span>
                  <span className="font-semibold text-text-primary">{vehicle.model}</span>
                </div>
                {vehicle.trim && (
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-text-secondary">Trim / Grade</span>
                    <span className="font-semibold text-text-primary">{vehicle.trim}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Year</span>
                  <span className="font-semibold text-text-primary">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Condition</span>
                  <span className="font-semibold text-text-primary">{vehicle.condition}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Mileage</span>
                  <span className="font-semibold text-text-primary">{vehicle.mileage.toLocaleString("en-KE")} km</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Engine Displacement</span>
                  <span className="font-semibold text-text-primary">{vehicle.engine_cc}cc</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Transmission</span>
                  <span className="font-semibold text-text-primary">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Fuel Type</span>
                  <span className="font-semibold text-text-primary">{vehicle.fuel}</span>
                </div>
                {vehicle.body_type && (
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-text-secondary">Body Type</span>
                    <span className="font-semibold text-text-primary">{vehicle.body_type}</span>
                  </div>
                )}
                {vehicle.drivetrain && (
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-text-secondary">Drivetrain</span>
                    <span className="font-semibold text-text-primary">{vehicle.drivetrain}</span>
                  </div>
                )}
                {vehicle.origin && (
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-text-secondary">Country of Origin</span>
                    <span className="font-semibold text-text-primary">{vehicle.origin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-3">
                <h2 className="text-base font-bold text-text-primary">
                  Dealership Description
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Features & Equipment */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-4">
                <h2 className="text-base font-bold text-text-primary">
                  Verified Features & Equipment
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-text-primary">
                  {vehicle.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Enquiry Panel (Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <EnquirySection vehicle={vehicle} />

            {/* Dealership Assurance Card */}
            <div className="bg-white p-5 rounded-card border border-border shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-action" />
                <span>MotoHaven Nairobi Promise</span>
              </h4>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action mt-1.5 shrink-0" />
                  <span>Physical vehicle available for physical test drive at our Ngong Road premises.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action mt-1.5 shrink-0" />
                  <span>Original import logbook & NTSA TIMS clearance verified prior to sale.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action mt-1.5 shrink-0" />
                  <span>Assistance with financing and comprehensive insurance arrangement.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Section */}
        {similarVehicles.length > 0 && (
          <section className="pt-12 border-t border-border space-y-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight">
                Similar Available Vehicles in Nairobi
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Explore related vehicles currently in stock at MotoHaven
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((sim) => (
                <VehicleCard key={sim.id} vehicle={sim} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Fixed Bottom Action Bar (Appears on small screens only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-3 px-4 md:hidden shadow-lg flex items-center gap-3">
        <a
          href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
          className="flex-1 py-3 px-3 rounded-btn border border-border bg-background-secondary text-text-primary text-xs font-bold flex items-center justify-center gap-2 active:bg-background-tertiary"
        >
          <Phone className="w-4 h-4" />
          <span>Call Desk</span>
        </a>

        {isAvailable && (
          <a
            href={buildVehicleWhatsAppUrl(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-3 rounded-btn bg-brand-whatsapp text-white text-xs font-bold flex items-center justify-center gap-2 active:bg-brand-whatsappHover shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Us</span>
          </a>
        )}
      </div>
    </div>
  );
}
