import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { VehicleFilterParams } from "@/types/vehicle";

export const metadata: Metadata = {
  title: "Cars for Sale in Nairobi | MotoHaven Showroom",
  description: "Browse genuine cars currently in stock at MotoHaven on Ngong Road. Verified specifications, transparent pricing, and direct test-drive bookings.",
};

interface CarsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const revalidate = 0; // Dynamic server query

function getFirstString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) {
    const first = val[0];
    return typeof first === "string" && first.trim() ? first.trim() : undefined;
  }
  return typeof val === "string" && val.trim() ? val.trim() : undefined;
}

function parsePositiveInt(val: string | string[] | undefined): number | undefined {
  const str = getFirstString(val);
  if (!str) return undefined;
  const num = parseInt(str, 10);
  return !isNaN(num) && num >= 0 ? num : undefined;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  // Safe normalization of parameters: prevents 500 error on repeated params (Defect D5 fix)
  const q = getFirstString(searchParams.q);
  const brand = getFirstString(searchParams.brand);
  const body_type = getFirstString(searchParams.body_type);
  const condition = getFirstString(searchParams.condition);
  const transmission = getFirstString(searchParams.transmission);
  const fuel = getFirstString(searchParams.fuel);
  const minPrice = parsePositiveInt(searchParams.minPrice);
  const maxPrice = parsePositiveInt(searchParams.maxPrice);
  const minYear = parsePositiveInt(searchParams.minYear);
  const maxYear = parsePositiveInt(searchParams.maxYear);
  const rawSort = getFirstString(searchParams.sort);
  const sort = (rawSort && ["recent", "price_asc", "price_desc", "year_desc", "year_asc", "mileage_asc"].includes(rawSort))
    ? (rawSort as any)
    : "recent";
  const currentPage = parsePositiveInt(searchParams.page) || 1;

  const queryParams: VehicleFilterParams = {
    q,
    brand,
    body_type,
    condition,
    transmission,
    fuel,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    sort,
    page: currentPage,
    limit: 12,
  };

  const { vehicles, total, totalPages, page } = await VehiclesRepository.getPublishedVehicles(queryParams);

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      const cleanVal = getFirstString(v);
      if (cleanVal && k !== "page") {
        params.set(k, cleanVal);
      }
    });
    params.set("page", targetPage.toString());
    return `/cars?${params.toString()}`;
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Open Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium" aria-current="page">
            Cars for sale
          </span>
        </nav>

        {/* Aligned Page Header (Unboxed, Anti-Card) */}
        <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Cars for sale in Nairobi
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {total === 1 ? "1 vehicle currently in stock" : `${total} vehicles currently in stock`} at our Ngong Road showroom
            </p>
          </div>
        </div>

        {/* Filter Controls Toolbar (Unboxed, integrated) */}
        <InventoryFilters totalCount={total} />

        {/* Vehicle Inventory Grid (Anti-Card: grid container is open whitespace, cards are vehicles only) */}
        {vehicles.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-base font-semibold text-text-primary">
              No vehicles match the selected criteria.
            </p>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Try adjusting your price range or filter choices to view available showroom stock.
            </p>
            <div className="pt-2">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-action text-white hover:bg-action-hover transition-colors min-h-[40px]"
              >
                Clear all filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="pt-8 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <p>
              Page <span className="font-semibold text-text-primary">{page}</span> of{" "}
              <span className="font-semibold text-text-primary">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildPageUrl(page - 1)}
                  className="px-3 py-1.5 border border-field text-text-primary hover:bg-background-secondary transition-colors font-medium min-h-[36px] flex items-center"
                >
                  Previous
                </Link>
              ) : (
                <span className="px-3 py-1.5 border border-border text-text-secondary opacity-50 cursor-not-allowed min-h-[36px] flex items-center">
                  Previous
                </span>
              )}

              {page < totalPages ? (
                <Link
                  href={buildPageUrl(page + 1)}
                  className="px-3 py-1.5 border border-field text-text-primary hover:bg-background-secondary transition-colors font-medium min-h-[36px] flex items-center"
                >
                  Next
                </Link>
              ) : (
                <span className="px-3 py-1.5 border border-border text-text-secondary opacity-50 cursor-not-allowed min-h-[36px] flex items-center">
                  Next
                </span>
              )}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
