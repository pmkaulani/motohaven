"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { ArrowRight, Search } from "lucide-react";

interface ShowroomFloorProps {
  vehicles: Vehicle[];
  totalCount: number;
}

export function ShowroomFloor({ vehicles, totalCount }: ShowroomFloorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isStuck, setIsStuck] = useState<boolean>(false);
  const stickyToolbarRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "All", label: "All Cars" },
    { id: "SUV", label: "SUVs & 4x4" },
    { id: "Saloon", label: "Saloons & Sedans" },
    { id: "Station Wagon", label: "Station Wagons" },
  ];

  // Track when the toolbar reaches the sticky threshold beneath the header
  useEffect(() => {
    const handleScroll = () => {
      if (!stickyToolbarRef.current) return;
      const rect = stickyToolbarRef.current.getBoundingClientRect();
      const headerOffset = window.innerWidth >= 640 ? 76 : 68;
      // When the toolbar reaches the bottom of the header, it is stuck
      setIsStuck(rect.top <= headerOffset + 2);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "SUV" && v.body_type !== "SUV") return false;
        if (selectedCategory === "Saloon" && v.body_type !== "Saloon") return false;
        if (selectedCategory === "Station Wagon" && v.body_type !== "Station Wagon") return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesBrand = v.brand.toLowerCase().includes(query);
        const matchesModel = v.model.toLowerCase().includes(query);
        const matchesTrim = v.trim?.toLowerCase().includes(query);
        const matchesYear = v.year.toString().includes(query);
        if (!matchesBrand && !matchesModel && !matchesTrim && !matchesYear) {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, selectedCategory, searchQuery]);

  return (
    <section id="collection" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
              The Showroom Collection
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              Every motorcar is physically on ground at our Ngong Road showroom. Verified paperwork, genuine odometers, and ready for an unhurried viewing.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-900 transition-colors self-start sm:self-auto min-h-[40px]"
          >
            <span>Explore all cars ({totalCount})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sticky Filter & Search Toolbar: 
            Appears locked at the top beneath the header as you scroll into/across the inventory section.
            Disappears as you scroll back up away from the inventory. */}
        <div
          ref={stickyToolbarRef}
          className={`sticky top-[68px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-md py-3.5 border-b border-stone-200 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8 sm:mb-10 transition-shadow duration-200 ${
            isStuck ? "shadow-md bg-white" : ""
          }`}
        >
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] shrink-0 ${
                      isActive
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input & Result Count */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search make or model..."
                  className="w-full h-10 pl-9 pr-8 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-stone-900 text-stone-900 placeholder:text-stone-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-900 p-1"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              <span className="hidden md:inline-block text-xs text-stone-500 whitespace-nowrap font-medium">
                {filteredVehicles.length} {filteredVehicles.length === 1 ? "car" : "cars"}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicles Grid: Open Brochure Catalog */}
        {filteredVehicles.length === 0 ? (
          <div className="py-12 sm:py-16 text-center rounded-lg bg-stone-50 p-6 sm:p-8 border border-stone-200">
            <p className="text-base font-semibold text-stone-900">
              No vehicles found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try searching for a different make or model, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium min-h-[40px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
