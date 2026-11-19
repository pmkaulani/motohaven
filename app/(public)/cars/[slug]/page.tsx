import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EnquirySection } from "@/components/vehicle/EnquirySection";
import { VehicleShareActions } from "@/components/vehicle/VehicleShareActions";
import { formatKSh, DEALERSHIP_CONFIG, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import { Phone, MessageCircle, FileCheck, ShieldCheck, Gauge, CheckCircle2 } from "lucide-react";

interface VehiclePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // 60-second CDN caching with on-demand staff revalidation (Finding R15)

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const vehicle = await VehiclesRepository.getPublishedVehicleBySlug(params.slug);
  if (!vehicle) {
    return {
      title: "Vehicle Not Found | MotoHaven Nairobi",
    };
  }

  const title = `${vehicle.year} ${vehicle.brand} ${vehicle.model}${vehicle.trim ? " " + vehicle.trim : ""} for Sale in Nairobi | MotoHaven`;
  const description = `${formatKSh(vehicle.price)} · ${vehicle.condition} · ${vehicle.mileage.toLocaleString()} km · ${vehicle.transmission} ${vehicle.fuel}. Available for viewing at our Ngong Road showroom.`;
  const imageUrl = vehicle.cover_photo || vehicle.photo_urls[0] || "https://motohaven.co.ke/images/car-placeholder.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 900,
          alt: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  // Public access: strictly returns null if Draft or Archived (Fixes Defect D3)
  const vehicle = await VehiclesRepository.getPublishedVehicleBySlug(params.slug);

  if (!vehicle) {
    notFound();
  }

  const similarVehicles = await VehiclesRepository.getSimilarVehicles(vehicle.id, 3);
  const isSold = vehicle.status === "Sold" || vehicle.sold;
  const isReserved = vehicle.status === "Reserved";
  const isAvailable = vehicle.status === "Available" && !isSold && !isReserved;

  const proof = vehicle.proof_records;

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 pb-24 md:pb-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Open Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:underline">
            The Collection
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium" aria-current="page">
            {vehicle.year} {vehicle.brand} {vehicle.model}
          </span>
        </nav>

        {/* Clean Open Page Header (Showroom Exhibit Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {vehicle.year} · {vehicle.condition} {vehicle.origin ? `· ${vehicle.origin}` : ""}
              </span>
              {isSold && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-stone-900 text-white">
                  Sold
                </span>
              )}
              {isReserved && !isSold && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-amber-600 text-white">
                  Reserved
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              {vehicle.brand} {vehicle.model}
              {vehicle.trim && <span className="font-normal text-text-secondary text-2xl sm:text-3xl ml-2">{vehicle.trim}</span>}
            </h1>
          </div>

          {/* Right Side: High-Impact, Prominent Showroom Price Tag & Quiet Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="text-left md:text-right">
              <div className="flex items-center md:justify-end gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Showroom Price
                </span>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                  Duty Cleared
                </span>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-none">
                {formatKSh(vehicle.price)}
              </p>
            </div>

            <div className="pt-0.5">
              <VehicleShareActions vehicle={vehicle} />
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-7 space-y-8">
            <VehicleGallery
              photos={vehicle.photo_urls}
              coverPhoto={vehicle.cover_photo}
              vehicleTitle={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            />

            {/* Factual Vehicle Specifications Table */}
            <div className="space-y-4 border-t border-border pt-6">
              <h2 className="text-lg font-bold text-text-primary">
                Vehicle Specifications
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Year of Manufacture</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.year}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Mileage</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.mileage.toLocaleString()} km</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Engine Capacity</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.engine_cc.toLocaleString()} cc</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Transmission</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.transmission}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Fuel Type</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.fuel}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Body Type</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.body_type || "Saloon"}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Condition</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.condition}</dd>
                </div>
                {vehicle.drivetrain && (
                  <div className="flex justify-between py-1.5 border-b border-border-subtle">
                    <dt className="text-text-secondary">Drivetrain</dt>
                    <dd className="font-semibold text-text-primary">{vehicle.drivetrain}</dd>
                  </div>
                )}
                {vehicle.origin && (
                  <div className="flex justify-between py-1.5 border-b border-border-subtle">
                    <dt className="text-text-secondary">Origin</dt>
                    <dd className="font-semibold text-text-primary">{vehicle.origin}</dd>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Showroom Location</dt>
                  <dd className="font-semibold text-text-primary">{vehicle.location}</dd>
                </div>
              </dl>
            </div>

            {/* Per-Car Proof & Paperwork Section (Truthful Verification Gate) */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-text-primary" />
                <h2 className="text-lg font-bold text-text-primary">
                  Showroom Verification & Paperwork
                </h2>
              </div>
              <p className="text-xs text-text-secondary">
                Factual verification status recorded for this specific vehicle:
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Odometer & Mileage</dt>
                  <dd className="font-semibold text-text-primary">
                    {proof?.mileage?.status === "verified" || (proof?.mileage_source && proof.mileage_source.trim().length > 0)
                      ? (proof?.mileage?.sourceLabel || proof?.mileage_source)
                      : "Pending showroom check"}
                  </dd>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Export / Auction Sheet</dt>
                  <dd className="font-semibold text-text-primary">
                    {proof?.exportSheet?.status === "verified" || proof?.export_sheet_status === "Provided"
                      ? "Provided for review"
                      : "Not supplied"}
                  </dd>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Chassis / VIN Check</dt>
                  <dd className="font-semibold text-text-primary">
                    {proof?.chassisCheck?.status === "verified" || (proof?.chassis_check_status === "Staff checked" && proof?.chassis_checked_date)
                      ? "Staff checked & verified"
                      : "Pending check"}
                  </dd>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Duty & Import Status</dt>
                  <dd className="font-semibold text-text-primary">
                    {proof?.dutyStatus?.status === "verified" || proof?.duty_status === "Fully paid / duty cleared"
                      ? "Fully paid / duty cleared"
                      : "In processing"}
                  </dd>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Logbook Transfer</dt>
                  <dd className="font-semibold text-text-primary">
                    {proof?.logbook?.status === "verified" || proof?.logbook_status === "Available at showroom"
                      ? "Available at showroom"
                      : "Pending transfer papers"}
                  </dd>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <dt className="text-text-secondary">Independent Inspection</dt>
                  <dd className="font-semibold text-text-primary">
                    Welcome (mechanic or AA Kenya)
                  </dd>
                </div>
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

      {/* Mobile Sticky Bottom Action Bar with Noticeable Price */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border py-2.5 px-4 md:hidden shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">Showroom Price</span>
          <span className="text-base sm:text-lg font-black text-stone-950 leading-none">{formatKSh(vehicle.price)}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
            className="h-10 px-3.5 rounded-lg border border-stone-200 bg-white text-text-primary text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <span>Call</span>
          </a>

          {isAvailable && (
            <a
              href={buildVehicleWhatsAppUrl(vehicle)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-lg bg-brand-whatsapp text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand-whatsappHover transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
