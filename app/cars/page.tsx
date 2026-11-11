import React from "react";
import Link from "next/link";
import { LocalDB } from "@/lib/db/local-db";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { VehicleFilterParams } from "@/types/vehicle";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarsPageProps {
  searchParams: {
    q?: string;
    brand?: string;
    body_type?: string;
    condition?: string;
    transmission?: string;
    fuel?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
    sort?: "recent" | "price_asc" | "price_desc" | "year_desc" | "year_asc" | "mileage_asc";
    page?: string;
  };
}

export const revalidate = 0; // Dynamic server query

export default function CarsPage({ searchParams }: CarsPageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const queryParams: VehicleFilterParams = {
    q: searchParams.q,
    brand: searchParams.brand,
    body_type: searchParams.body_type,
    condition: searchParams.condition,
    transmission: searchParams.transmission,
    fuel: searchParams.fuel,
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice, 10) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice, 10) : undefined,
    minYear: searchParams.minYear ? parseInt(searchParams.minYear, 10) : undefined,
    maxYear: searchParams.maxYear ? parseInt(searchParams.maxYear, 10) : undefined,
    sort: searchParams.sort || "recent",
    page: currentPage,
    limit: 12,
  };

  const { vehicles, total, totalPages, page } = LocalDB.getVehicles(queryParams);

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    params.set("page", targetPage.toString());
    return `/cars?${params.toString()}`;
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Simple Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary">Inventory</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Available Cars
            </h1>
            <span className="text-sm text-text-secondary">
              Showing {vehicles.length} of {total} vehicles
            </span>
          </div>
        </div>

        {/* Toolbar & Filter Drawer */}
        <InventoryFilters totalResults={total} />

        {/* Vehicle Cards Grid (Unboxed, pure grid) */}
        {vehicles.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-card p-8 bg-background-secondary/50">
            <p className="text-base font-semibold text-text-primary">
              No vehicles match your search
            </p>
            <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
              Try adjusting your filters or search keywords. You can also contact our sales team directly for upcoming arrivals.
            </p>
            <div className="pt-4">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-8 flex items-center justify-center gap-3">
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                className="h-10 px-4 rounded-btn border border-border bg-white text-text-primary hover:bg-background-secondary flex items-center gap-1.5 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Link>
            ) : (
              <span className="h-10 px-4 rounded-btn border border-border bg-background-tertiary text-text-secondary/50 flex items-center gap-1.5 text-xs font-semibold cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </span>
            )}

            <span className="text-xs text-text-secondary font-medium">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                className="h-10 px-4 rounded-btn border border-border bg-white text-text-primary hover:bg-background-secondary flex items-center gap-1.5 text-xs font-semibold"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="h-10 px-4 rounded-btn border border-border bg-background-tertiary text-text-secondary/50 flex items-center gap-1.5 text-xs font-semibold cursor-not-allowed">
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
