import React from "react";
import Link from "next/link";

export function PopularCategories() {
  const categories = [
    { label: "SUVs & 4x4", href: "/cars?body_type=SUV" },
    { label: "Saloons & Sedans", href: "/cars?body_type=Saloon" },
    { label: "Station Wagons", href: "/cars?body_type=Station+Wagon" },
    { label: "Hatchbacks", href: "/cars?body_type=Hatchback" },
    { label: "Pickups", href: "/cars?body_type=Pickup" },
  ];

  return (
    <section className="py-8 bg-white border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Browse by body type:
          </span>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.label}>
                <Link
                  href={cat.href}
                  className="text-text-primary hover:underline transition-colors"
                >
                  {cat.label}
                </Link>
                {idx < categories.length - 1 && (
                  <span className="text-text-secondary/40 select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
