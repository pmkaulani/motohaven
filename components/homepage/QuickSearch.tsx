"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

export function QuickSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (brand) params.set("brand", brand);
    if (bodyType) params.set("body_type", bodyType);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section className="bg-background-secondary py-8 border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 sm:p-5 rounded-card border border-border shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Keyword / Model */}
            <div className="lg:col-span-2">
              <label htmlFor="quick-q" className="block text-xs font-semibold text-text-primary mb-1">
                Search Make or Model
              </label>
              <div className="relative">
                <input
                  id="quick-q"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Prado, BMW 320i, CX-5..."
                  className="w-full px-3.5 py-2.5 text-sm bg-background-secondary rounded-btn border border-border focus:border-action focus:bg-white focus:outline-none transition-colors"
                />
                <Search className="w-4 h-4 text-text-secondary absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Brand Dropdown */}
            <div>
              <label htmlFor="quick-brand" className="block text-xs font-semibold text-text-primary mb-1">
                Make
              </label>
              <select
                id="quick-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-background-secondary rounded-btn border border-border focus:border-action focus:bg-white focus:outline-none transition-colors"
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

            {/* Body Type Dropdown */}
            <div>
              <label htmlFor="quick-body" className="block text-xs font-semibold text-text-primary mb-1">
                Body Type
              </label>
              <select
                id="quick-body"
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-background-secondary rounded-btn border border-border focus:border-action focus:bg-white focus:outline-none transition-colors"
              >
                <option value="">All Types</option>
                <option value="SUV">SUV & 4x4</option>
                <option value="Saloon">Saloon / Sedan</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label htmlFor="quick-budget" className="block text-xs font-semibold text-text-primary mb-1">
                Max Budget (KSh)
              </label>
              <select
                id="quick-budget"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-background-secondary rounded-btn border border-border focus:border-action focus:bg-white focus:outline-none transition-colors"
              >
                <option value="">Any Budget</option>
                <option value="2500000">Up to 2.5M</option>
                <option value="3500000">Up to 3.5M</option>
                <option value="5000000">Up to 5.0M</option>
                <option value="8000000">Up to 8.0M</option>
                <option value="15000000">Up to 15.0M</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push("/cars")}
              className="text-xs text-text-secondary hover:text-action flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Open Advanced Inventory Filters</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-btn bg-action text-white text-sm font-semibold hover:bg-action-hover transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Available Cars</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
