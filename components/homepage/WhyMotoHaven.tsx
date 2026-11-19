import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function WhyMotoHaven() {
  const points = [
    {
      num: "01",
      title: "Physical inventory you can touch and drive",
      desc: "Every car listed on our website is physically parked on ground at our Ngong Road showroom. No third-party reposts, phantom listings, or meeting brokers at fuel stations.",
    },
    {
      num: "02",
      title: "Verifiable Japanese & UK documentation",
      desc: "We verify genuine mileage, Japanese auction grading sheets, and UK export certificates before importing. Original paperwork and chassis numbers are available for your physical review.",
    },
    {
      num: "03",
      title: "Direct dealership transaction & NTSA transfer",
      desc: "You deal directly with our showroom staff on ground. Payment goes directly to our verified corporate dealership account, and we initiate the formal NTSA TIMS logbook transfer immediately.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Headline & Intro (No labels, no cards) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              Why buy from our physical showroom.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Nairobi’s car market is flooded with brokers, altered odometers, and photos of cars that don’t exist. MotoHaven was founded as an independent physical showroom where you can walk in, inspect real inventory in person, and buy with total confidence.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="text-xs font-semibold text-stone-900 hover:text-stone-600 inline-flex items-center gap-1.5"
              >
                <span>Read our full dealership approach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Editorial List (No cards, no borders, no boxes) */}
          <div className="lg:col-span-7 space-y-8 divide-y divide-stone-200">
            {points.map((pt, idx) => (
              <div key={idx} className={idx > 0 ? "pt-8" : ""}>
                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono font-bold text-stone-400 mt-1 shrink-0">
                    {pt.num}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      {pt.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
