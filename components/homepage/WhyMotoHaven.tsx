import React from "react";

export function WhyMotoHaven() {
  const points = [
    {
      title: "Real Showroom Inventory",
      desc: "Every vehicle displayed on our website is physically in stock at our Nairobi showroom. No phantom listings or generic third-party reposts.",
    },
    {
      title: "Clear, Upfront Pricing",
      desc: "All prices are stated clearly in Kenyan Shillings (KSh) with genuine mileage, manufacture year, and verified specifications.",
    },
    {
      title: "Direct Customer Service",
      desc: "You deal directly with our showroom sales desk on Ngong Road. In-person inspections and guided test drives are welcome.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-background-secondary border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Why MotoHaven
          </h2>
          <p className="text-sm text-text-secondary mt-1.5">
            A straightforward dealership experience focused on authentic inventory and direct communication.
          </p>
        </div>

        {/* 3 Unboxed Columns with subtle separators (Anti-Card) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {points.map((pt, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">
                {pt.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
