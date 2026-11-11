import React from "react";
import Link from "next/link";
import { LocalDB } from "@/lib/db/local-db";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { VehicleFilterParams } from "@/types/vehicle";
import { ChevronLeft, ChevronRight, Car } from "lucide-react";

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

  // Helper to build pagination links keeping current filters
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    params.set("page", targetPage.toString());
    return `/cars?${params.toString()}`;
  };

  return (
    <div className="bg-background-secondary min-h-screen py-8 sm:py-12">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Breadcrumb */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:text-action">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Inventory</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Vehicle Inventory
            </h1>
            <span className="text-xs sm:text-sm text-text-secondary">
              Showing <strong className="text-text-primary">{vehicles.length}</strong> of{" "}
              <strong className="text-text-primary">{total}</strong> verified vehicles
            </span>
          </div>
        </div>

        {/* Filter Bar & Drawer */}
        <InventoryFilters totalResults={total} />

        {/* Vehicle Cards Grid or Empty State */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-card border border-border p-12 text-center space-y-4 shadow-sm my-8">
            <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center mx-auto text-text-secondary">
              <Car className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-primary">
                No vehicles matched your search
              </h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                Try loosening your filters or search keywords. You can also contact our Nairobi sales desk directly to enquire on upcoming stock arrivals.
              </p>
            </div>
            <div className="pt-2">
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
          <div className="pt-8 pb-4 flex items-center justify-center gap-2">
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                className="p-2 rounded-btn border border-border bg-white text-text-primary hover:bg-background-tertiary flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Link>
            ) : (
              <span className="p-2 rounded-btn border border-border bg-background-tertiary text-text-secondary/50 flex items-center gap-1 text-xs font-semibold cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </span>
            )}

            <div className="flex items-center gap-1 px-3 text-xs font-semibold text-text-secondary">
              Page <span className="text-text-primary mx-1">{page}</span> of {totalPages}
            </div>

            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                className="p-2 rounded-btn border border-border bg-white text-text-primary hover:bg-background-tertiary flex items-center gap-1 text-xs font-semibold"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="p-2 rounded-btn border border-border bg-background-tertiary text-text-secondary/50 flex items-center gap-1 text-xs font-semibold cursor-not-allowed">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
