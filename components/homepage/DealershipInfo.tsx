import React from "react";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MessageCircle } from "lucide-react";

export function DealershipInfo() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Showroom Coordinates & Contact */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Visit Our Showroom
              </h2>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                We invite you to inspect any vehicle in person. Our sales team is available on ground to assist with physical viewings and test drives.
              </p>
            </div>

            <div className="space-y-4 text-sm text-text-secondary">
              <div>
                <p className="font-semibold text-text-primary">Showroom Location</p>
                <p className="mt-0.5">{DEALERSHIP_CONFIG.address}</p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Working Hours</p>
                <p className="mt-0.5">Monday – Friday: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                <p>Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                <p>Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Direct Contact</p>
                <p className="mt-0.5">
                  Phone:{" "}
                  <a
                    href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                    className="text-text-primary font-medium hover:underline"
                  >
                    {DEALERSHIP_CONFIG.phone}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${DEALERSHIP_CONFIG.email}`}
                    className="text-text-primary font-medium hover:underline"
                  >
                    {DEALERSHIP_CONFIG.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildGeneralWhatsAppUrl("Hello MotoHaven, I would like directions to your showroom on Ngong Road.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-brand-whatsapp text-white text-sm font-semibold hover:bg-brand-whatsappHover transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp for Directions</span>
              </a>
            </div>
          </div>

          {/* Location & Appointment Note */}
          <div className="space-y-4 text-sm text-text-secondary border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 md:pl-12">
            <h3 className="text-base font-bold text-text-primary">
              Planning Your Visit
            </h3>
            <p className="leading-relaxed">
              Our showroom is conveniently situated along the Ngong Road corridor, accessible from Kilimani, Karen, and Nairobi CBD.
            </p>
            <p className="leading-relaxed">
              Walk-in visitors are welcome during regular business hours. If you wish to test drive a specific vehicle, we recommend booking in advance so we can ensure the vehicle is staged and ready.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-text-secondary">
                Vehicle viewings and test-drive appointments can also be scheduled directly through each car&apos;s detail page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
