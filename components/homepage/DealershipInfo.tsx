import React from "react";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MessageCircle, MapPin, Clock, Phone, Navigation } from "lucide-react";

export function DealershipInfo() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Showroom Details */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Our Showroom on Ngong Road.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              We welcome in-person walkarounds, mechanic inspections, and test drives along the Southern Bypass corridor. Drop by during showroom hours—no strict appointment required, though letting us know in advance ensures your preferred car is staged and fueled.
            </p>

            {/* Clean metadata list (No cards, no boxes) */}
            <div className="pt-2 space-y-4 text-xs sm:text-sm divide-y divide-stone-100">
              <div className="flex items-start gap-3 pt-3">
                <MapPin className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Physical Address</p>
                  <p className="text-stone-600 mt-0.5">{DEALERSHIP_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3">
                <Clock className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Opening Hours</p>
                  <p className="text-stone-600 mt-0.5">
                    Monday – Friday: {DEALERSHIP_CONFIG.hours.weekdays} · Saturday: {DEALERSHIP_CONFIG.hours.saturday}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3">
                <Phone className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Sales Desk</p>
                  <p className="text-stone-600 mt-0.5">
                    <a
                      href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                      className="text-stone-900 font-medium hover:underline"
                    >
                      {DEALERSHIP_CONFIG.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons (Clean standard buttons) */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={buildGeneralWhatsAppUrl("Hello MotoHaven, I would like directions to your showroom on Ngong Road.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-stone-900 text-white text-xs sm:text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp for Directions</span>
              </a>

              <a
                href="https://maps.google.com/?q=Ngong+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                <Navigation className="w-4 h-4 text-stone-600" />
                <span>Google Maps Location</span>
              </a>
            </div>
          </div>

          {/* Right Column: Showroom Visit Checklist (No card background, no borders) */}
          <div className="lg:col-span-5 space-y-5 pt-2">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              Visiting the Showroom
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Take all the time you need. We provide the vehicle keys, review Japanese and UK paperwork openly, and answer every technical question with zero sales pressure.
            </p>

            <ul className="space-y-3 text-sm text-stone-600 border-t border-stone-200 pt-4">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                <span>Dedicated customer parking on premises</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                <span>Southern Bypass test-drive corridor</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                <span>Original import sheets & chassis inspection welcome</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                <span>Complimentary tea, coffee & Wi-Fi in client desk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
