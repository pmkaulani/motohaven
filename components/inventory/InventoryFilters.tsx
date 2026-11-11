"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw, Search } from "lucide-react";

interface FilterProps {
  totalResults: number;
}

export function InventoryFilters({ totalResults }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Active filter values from URL
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

  // Local drawer state for editing before apply
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
  React.useEffect(() => {
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

  // Active filters count
  const activeCount = [
    q, brand, bodyType, condition, transmission, fuel,
    minPrice, maxPrice, minYear, maxYear
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Top Bar: Search Input, Quick Sort, Mobile Filter Trigger */}
      <div className="bg-white p-4 rounded-card border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
            placeholder="Search make, model, or keywords..."
            className="w-full pl-9 pr-20 py-2.5 text-sm bg-background-secondary rounded-btn border border-border focus:border-action focus:bg-white focus:outline-none"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3 pointer-events-none" />
          <button
            type="button"
            onClick={() => applyFilters()}
            className="absolute right-1.5 top-1.5 px-3 py-1 text-xs font-semibold bg-action text-white rounded-btn hover:bg-action-hover"
          >
            Search
          </button>
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-2">
          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <span className="text-xs font-semibold text-text-secondary hidden sm:inline">
              Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setLocalSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="w-full sm:w-auto px-3 py-2 text-xs font-medium bg-background-secondary rounded-btn border border-border focus:outline-none cursor-pointer"
            >
              <option value="recent">Recently Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest</option>
              <option value="year_asc">Year: Oldest</option>
              <option value="mileage_asc">Lowest Mileage</option>
            </select>
          </div>

          {/* Trigger Mobile Filters Drawer */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-background-secondary border border-border rounded-btn hover:bg-background-tertiary transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-action" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-action text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-text-secondary font-medium">Active filters:</span>
          {q && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              Keyword: &quot;{q}&quot;
              <button type="button" onClick={() => removeFilter("q")} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {brand && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              Make: {brand}
              <button type="button" onClick={() => removeFilter("brand")} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {bodyType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              Type: {bodyType}
              <button type="button" onClick={() => removeFilter("body_type")} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {condition && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              {condition}
              <button type="button" onClick={() => removeFilter("condition")} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {transmission && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              {transmission}
              <button type="button" onClick={() => removeFilter("transmission")} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {fuel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              {fuel}
              <button type="button" onClick={() => removeFilter("fuel")} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-background-secondary border border-border text-text-primary">
              Price: {minPrice ? `KSh ${Number(minPrice).toLocaleString("en-KE")}` : "0"} – {maxPrice ? `KSh ${Number(maxPrice).toLocaleString("en-KE")}` : "Any"}
              <button type="button" onClick={() => { removeFilter("minPrice"); removeFilter("maxPrice"); }} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-text-secondary hover:text-action underline ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Filter Modal / Drawer (Responsive for Mobile and Desktop) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Filter Vehicle Inventory
                </h3>
                <p className="text-xs text-text-secondary">
                  Showing {totalResults} matching vehicles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-btn"
                aria-label="Close Filter Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Fields */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Make / Brand */}
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">
                  Make / Manufacturer
                </label>
                <select
                  value={localBrand}
                  onChange={(e) => setLocalBrand(e.target.value)}
                  className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                >
                  <option value="">All Makes</option>
                  <option value="Toyota">Toyota</option>
                  <option value="BMW">BMW</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Honda">Honda</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Land Rover">Land Rover</option>
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">
                  Body Type
                </label>
                <select
                  value={localBodyType}
                  onChange={(e) => setLocalBodyType(e.target.value)}
                  className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                >
                  <option value="">All Body Types</option>
                  <option value="SUV">SUV & 4x4</option>
                  <option value="Saloon">Saloon / Sedan</option>
                  <option value="Station Wagon">Station Wagon</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">
                  Vehicle Condition
                </label>
                <select
                  value={localCondition}
                  onChange={(e) => setLocalCondition(e.target.value)}
                  className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                >
                  <option value="">All Conditions</option>
                  <option value="Foreign Used">Foreign Used (Import)</option>
                  <option value="Locally Used">Locally Used (Kenyan)</option>
                  <option value="Brand New">Brand New</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">
                  Price Range (KSh)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min KSh"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max KSh"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                  />
                </div>
              </div>

              {/* Transmission & Fuel */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-text-primary mb-1.5">
                    Transmission
                  </label>
                  <select
                    value={localTransmission}
                    onChange={(e) => setLocalTransmission(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1.5">
                    Fuel Type
                  </label>
                  <select
                    value={localFuel}
                    onChange={(e) => setLocalFuel(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block font-semibold text-text-primary mb-1.5">
                  Year of Manufacture
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="From (e.g. 2016)"
                    value={localMinYear}
                    onChange={(e) => setLocalMinYear(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="To (e.g. 2024)"
                    value={localMaxYear}
                    onChange={(e) => setLocalMaxYear(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-border bg-background-secondary flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 text-xs font-semibold border border-border rounded-btn bg-white text-text-primary hover:bg-background-tertiary transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => applyFilters()}
                className="flex-1 py-2.5 px-4 text-xs font-semibold bg-action text-white rounded-btn hover:bg-action-hover transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
