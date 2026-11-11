import React from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from "lucide-react";

export function DealershipInfo() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Visit Us in Person
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1">
                MotoHaven Nairobi Showroom
              </h2>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                We invite you to inspect any vehicle in person. Our sales specialists are on ground to walk you through the vehicle specs, logbook details, and provide guided test drives.
              </p>
            </div>

            <div className="space-y-3.5 text-sm text-text-secondary">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Showroom Location</p>
                  <p className="text-xs">{DEALERSHIP_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Working Hours</p>
                  <p className="text-xs">Monday – Friday: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                  <p className="text-xs">Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                  <p className="text-xs">Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Telephone & Sales Desk</p>
                  <a
                    href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                    className="text-xs text-action font-semibold hover:underline block"
                  >
                    {DEALERSHIP_CONFIG.phone}
                  </a>
                  <a
                    href={`mailto:${DEALERSHIP_CONFIG.email}`}
                    className="text-xs text-text-secondary hover:underline block"
                  >
                    {DEALERSHIP_CONFIG.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={buildGeneralWhatsAppUrl("Hello MotoHaven, I would like directions to your showroom on Ngong Road.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-brand-whatsapp text-white text-xs font-semibold hover:bg-brand-whatsappHover transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Request Directions on WhatsApp</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-background-secondary text-text-primary text-xs font-semibold border border-border hover:bg-background-tertiary transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Contact Page</span>
              </Link>
            </div>
          </div>

          {/* Location Map Placeholder / Card */}
          <div className="lg:col-span-6">
            <div className="rounded-card border border-border bg-background-secondary p-6 sm:p-8 flex flex-col justify-between min-h-[320px]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white text-xs font-semibold text-text-primary border border-border">
                  <MapPin className="w-3.5 h-3.5 text-action" />
                  <span>Nairobi Showroom</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  Prime Ngong Road Access
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Located along the Ngong Road corridor with secure on-site customer parking. Easily accessible from Kilimani, Karen, Westlands, and Nairobi CBD.
                </p>
              </div>

              <div className="pt-6 border-t border-border/80 flex items-center justify-between text-xs">
                <span className="text-text-secondary">Walk-in viewings welcome daily</span>
                <span className="font-semibold text-action">Open today until 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
