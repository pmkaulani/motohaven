import React from "react";
import Link from "next/link";

export function PopularCategories() {
  const categories = [
    { label: "SUVs & 4x4", href: "/cars?body_type=SUV", count: "Cruisers, Prados, CX-5" },
    { label: "Saloons & Sedans", href: "/cars?body_type=Saloon", count: "BMW, Mercedes, Toyota" },
    { label: "Station Wagons", href: "/cars?body_type=Station+Wagon", count: "Subaru Outback, Fielder" },
    { label: "Under KSh 3.5M", href: "/cars?maxPrice=3500000", count: "Quality daily drives" },
    { label: "KSh 3.5M – 7.0M", href: "/cars?minPrice=3500000&maxPrice=7000000", count: "Mid & luxury crossovers" },
    { label: "Foreign Used Imports", href: "/cars?condition=Foreign+Used", count: "Direct Japan & UK imports" },
  ];

  return (
    <section className="py-10 bg-white border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              Popular Showroom Categories
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Browse inventory by your preferred vehicle category
            </p>
          </div>
          <Link
            href="/cars"
            className="text-xs font-semibold text-action hover:underline hidden sm:block"
          >
            View all categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="p-3.5 rounded-card border border-border bg-background-secondary/50 hover:bg-background-secondary hover:border-text-secondary/40 transition-all text-left flex flex-col justify-between group"
            >
              <span className="text-sm font-bold text-text-primary group-hover:text-action">
                {cat.label}
              </span>
              <span className="text-[11px] text-text-secondary mt-1">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
