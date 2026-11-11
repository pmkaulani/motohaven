"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function QuickSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (brand) params.set("brand", brand);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section className="bg-white border-b border-border py-6 sm:py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
        >
          {/* Make Dropdown */}
          <div>
            <label htmlFor="quick-brand" className="block text-xs font-semibold text-text-primary mb-1.5">
              Make
            </label>
            <select
              id="quick-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-11 px-3 text-sm bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
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

          {/* Model / Keyword */}
          <div>
            <label htmlFor="quick-q" className="block text-xs font-semibold text-text-primary mb-1.5">
              Model or Keyword
            </label>
            <input
              id="quick-q"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Prado, 320i, CX-5"
              className="w-full h-11 px-3 text-sm bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
            />
          </div>

          {/* Max Budget */}
          <div>
            <label htmlFor="quick-budget" className="block text-xs font-semibold text-text-primary mb-1.5">
              Max Budget
            </label>
            <select
              id="quick-budget"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-11 px-3 text-sm bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="2500000">Up to KSh 2.5M</option>
              <option value="3500000">Up to KSh 3.5M</option>
              <option value="5000000">Up to KSh 5.0M</option>
              <option value="8000000">Up to KSh 8.0M</option>
              <option value="15000000">Up to KSh 15.0M</option>
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full h-11 px-5 rounded-btn bg-action text-white text-sm font-semibold hover:bg-action-hover transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Cars</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
