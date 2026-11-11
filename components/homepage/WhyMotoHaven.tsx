import React from "react";
import { CheckCircle2, Eye, MapPin, MessageSquare } from "lucide-react";

export function WhyMotoHaven() {
  const points = [
    {
      icon: Eye,
      title: "Real Showroom Inventory",
      desc: "Every car listed on our website is physically available at our Nairobi premises. No phantom listings or generic broker reposts.",
    },
    {
      icon: CheckCircle2,
      title: "Clear, Transparent Pricing",
      desc: "All prices are stated clearly in Kenyan Shillings (KSh) with explicit condition, engine displacement, and mileage data.",
    },
    {
      icon: MapPin,
      title: "Convenient Nairobi Location",
      desc: "Easily accessible showroom on Ngong Road, Nairobi. View vehicles in person, inspect documentation, and arrange test drives.",
    },
    {
      icon: MessageSquare,
      title: "Direct WhatsApp & Phone Communication",
      desc: "Direct communication with our sales staff. Quick responses, walkaround video requests, and upfront assistance without hassle.",
    },
  ];

  return (
    <section className="py-14 bg-background-secondary border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Why Buy from MotoHaven
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            A straightforward, trustworthy dealership experience tailored for car buyers in Nairobi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-card border border-border shadow-sm flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded bg-background-secondary flex items-center justify-center text-action mb-4 border border-border">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">
                  {pt.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
