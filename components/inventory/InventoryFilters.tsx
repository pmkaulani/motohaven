"use client";

import React, { useState, useEffect, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";

interface InventoryFiltersProps {
  totalCount: number;
}

export function InventoryFilters({ totalCount }: InventoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Unique IDs for accessibility
  const searchId = useId();
  const sortId = useId();
  const brandId = useId();
  const bodyTypeId = useId();
  const conditionId = useId();
  const minPriceId = useId();
  const maxPriceId = useId();
  const transmissionId = useId();
  const fuelId = useId();

  // URL state
  const q = searchParams.get("q") || "";
  const brand = searchParams.get("brand") || "";
  const bodyType = searchParams.get("body_type") || "";
  const condition = searchParams.get("condition") || "";
  const transmission = searchParams.get("transmission") || "";
  const fuel = searchParams.get("fuel") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minYear = searchParams.get("minYear") || "";
  const maxYear = searchParams.get("maxYear") || "";
  const sort = searchParams.get("sort") || "recent";

  // Local draft state for drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localQ, setLocalQ] = useState(q);
  const [localBrand, setLocalBrand] = useState(brand);
  const [localBodyType, setLocalBodyType] = useState(bodyType);
  const [localCondition, setLocalCondition] = useState(condition);
  const [localTransmission, setLocalTransmission] = useState(transmission);
  const [localFuel, setLocalFuel] = useState(fuel);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localMinYear, setLocalMinYear] = useState(minYear);
  const [localMaxYear, setLocalMaxYear] = useState(maxYear);
  const [localSort, setLocalSort] = useState(sort);

  // Sync when searchParams change
  useEffect(() => {
    setLocalQ(q);
    setLocalBrand(brand);
    setLocalBodyType(bodyType);
    setLocalCondition(condition);
    setLocalTransmission(transmission);
    setLocalFuel(fuel);
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    setLocalMinYear(minYear);
    setLocalMaxYear(maxYear);
    setLocalSort(sort);
  }, [q, brand, bodyType, condition, transmission, fuel, minPrice, maxPrice, minYear, maxYear, sort]);

  // Close drawer on Escape key (Accessibility fix)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const applyFilters = (overrides?: Record<string, string>) => {
    const params = new URLSearchParams();

    const merged = {
      q: localQ,
      brand: localBrand,
      body_type: localBodyType,
      condition: localCondition,
      transmission: localTransmission,
      fuel: localFuel,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      minYear: localMinYear,
      maxYear: localMaxYear,
      sort: localSort,
      ...overrides,
    };

    Object.entries(merged).forEach(([key, val]) => {
      if (val && val !== "all" && val !== "recent") {
        params.set(key, val);
      } else if (key === "sort" && val && val !== "recent") {
        params.set(key, val);
      }
    });

    router.push(`/cars?${params.toString()}`);
    setDrawerOpen(false);
  };

  const handleReset = () => {
    setLocalQ("");
    setLocalBrand("");
    setLocalBodyType("");
    setLocalCondition("");
    setLocalTransmission("");
    setLocalFuel("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalMinYear("");
    setLocalMaxYear("");
    setLocalSort("recent");
    router.push("/cars");
    setDrawerOpen(false);
  };

  const removeFilter = (key: string) => {
    applyFilters({ [key]: "" });
  };

  // Atomic price filter removal (Fixes Defect D8)
  const removePriceFilter = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    applyFilters({ minPrice: "", maxPrice: "" });
  };

  const activeCount = [
    q, brand, bodyType, condition, transmission, fuel,
    minPrice, maxPrice, minYear, maxYear
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Calm Search & Filter Toolbar (Unboxed) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">
            Search cars by make, model or keyword
          </label>
          <input
            id={searchId}
            type="text"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
            placeholder="Search by make, model, or keyword..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-field text-text-primary placeholder:text-text-secondary text-sm focus:border-text-primary"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3.5 pointer-events-none" />
          {localQ && (
            <button
              type="button"
              onClick={() => {
                setLocalQ("");
                applyFilters({ q: "" });
              }}
              aria-label="Clear search input"
              className="absolute right-3 top-3 text-text-secondary hover:text-text-primary p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button & Sort Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="filter-drawer"
            className="h-11 px-4 border border-field bg-white text-text-primary text-xs font-semibold hover:bg-background-secondary transition-colors flex items-center gap-2 min-h-[44px]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-text-primary text-white text-[11px] font-bold flex items-center justify-center ml-1">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative">
            <label htmlFor={sortId} className="sr-only">
              Sort vehicle inventory
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => {
                setLocalSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="h-11 px-3 pr-8 border border-field bg-white text-text-primary text-xs font-medium focus:border-text-primary min-h-[44px]"
            >
              <option value="recent">Recently Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest First</option>
              <option value="year_asc">Year: Oldest First</option>
              <option value="mileage_asc">Mileage: Lowest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips (Light text chips, not heavy cards) */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-text-secondary font-medium mr-1">Active filters:</span>
          {q && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              Keyword: &quot;{q}&quot;
              <button
                type="button"
                onClick={() => removeFilter("q")}
                aria-label={`Remove keyword filter ${q}`}
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {brand && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              Make: {brand}
              <button
                type="button"
                onClick={() => removeFilter("brand")}
                aria-label={`Remove make filter ${brand}`}
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {bodyType && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              Body: {bodyType}
              <button
                type="button"
                onClick={() => removeFilter("body_type")}
                aria-label={`Remove body type filter ${bodyType}`}
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {condition && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              {condition}
              <button
                type="button"
                onClick={() => removeFilter("condition")}
                aria-label={`Remove condition filter ${condition}`}
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {transmission && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              {transmission}
              <button
                type="button"
                onClick={() => removeFilter("transmission")}
                aria-label={`Remove transmission filter ${transmission}`}
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {fuel && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              {fuel}
              <button
                type="button"
                onClick={() => removeFilter("fuel")}
                aria-label={`Remove fuel filter ${fuel}`}
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border text-text-primary">
              Price: {minPrice ? `KSh ${Number(minPrice).toLocaleString("en-KE")}` : "0"} – {maxPrice ? `KSh ${Number(maxPrice).toLocaleString("en-KE")}` : "Any"}
              <button
                type="button"
                onClick={removePriceFilter}
                aria-label="Remove price range filter"
                className="hover:text-red-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-text-secondary hover:text-text-primary underline ml-1 flex items-center gap-1 py-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset all</span>
          </button>
        </div>
      )}

      {/* Filter Drawer (Accessible Dialog) */}
      {drawerOpen && (
        <div
          id="filter-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-drawer-title"
          className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40"
        >
          <div className="relative w-full max-w-md bg-white h-full flex flex-col justify-between border-l border-border shadow-xl">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 id="filter-drawer-title" className="text-base font-bold text-text-primary">
                  Filter Inventory
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Refine {totalCount} vehicles in showroom
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close Filter Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Fields */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              <div>
                <label htmlFor={brandId} className="block font-medium text-text-primary mb-1.5 text-xs">
                  Make / Manufacturer
                </label>
                <select
                  id={brandId}
                  value={localBrand}
                  onChange={(e) => setLocalBrand(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                >
                  <option value="">All Makes</option>
                  <option value="Toyota">Toyota</option>
                  <option value="BMW">BMW</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Honda">Honda</option>
                </select>
              </div>

              <div>
                <label htmlFor={bodyTypeId} className="block font-medium text-text-primary mb-1.5 text-xs">
                  Body Type
                </label>
                <select
                  id={bodyTypeId}
                  value={localBodyType}
                  onChange={(e) => setLocalBodyType(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                >
                  <option value="">All Body Types</option>
                  <option value="SUV">SUV & 4x4</option>
                  <option value="Saloon">Saloon / Sedan</option>
                  <option value="Station Wagon">Station Wagon</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

              <div>
                <label htmlFor={conditionId} className="block font-medium text-text-primary mb-1.5 text-xs">
                  Condition
                </label>
                <select
                  id={conditionId}
                  value={localCondition}
                  onChange={(e) => setLocalCondition(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                >
                  <option value="">All Conditions</option>
                  <option value="Foreign Used">Foreign Used (Import)</option>
                  <option value="Locally Used">Locally Used (Kenyan)</option>
                  <option value="Brand New">Brand New</option>
                </select>
              </div>

              <div>
                <p className="block font-medium text-text-primary mb-1.5 text-xs">
                  Price Range (KSh)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={minPriceId} className="sr-only">Minimum price in KSh</label>
                    <input
                      id={minPriceId}
                      type="number"
                      placeholder="Min KSh"
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor={maxPriceId} className="sr-only">Maximum price in KSh</label>
                    <input
                      id={maxPriceId}
                      type="number"
                      placeholder="Max KSh"
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={transmissionId} className="block font-medium text-text-primary mb-1.5 text-xs">
                    Transmission
                  </label>
                  <select
                    id={transmissionId}
                    value={localTransmission}
                    onChange={(e) => setLocalTransmission(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                  >
                    <option value="">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={fuelId} className="block font-medium text-text-primary mb-1.5 text-xs">
                    Fuel Type
                  </label>
                  <select
                    id={fuelId}
                    value={localFuel}
                    onChange={(e) => setLocalFuel(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-field text-text-primary text-sm focus:border-text-primary"
                  >
                    <option value="">All</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-border bg-background-secondary flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-4 text-xs font-semibold text-text-secondary hover:text-text-primary min-h-[44px]"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => applyFilters()}
                className="py-2.5 px-6 text-xs font-semibold bg-action text-white hover:bg-action-hover transition-colors min-h-[44px]"
              >
                Show {totalCount} Vehicles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
