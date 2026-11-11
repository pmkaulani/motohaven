import React from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { ShieldCheck, CheckCircle2, MapPin, Users, Phone, MessageCircle } from "lucide-react";

export const metadata = {
  title: `About Us | ${DEALERSHIP_CONFIG.name} Nairobi`,
  description: "Learn about MotoHaven, an independent car dealership located on Ngong Road, Nairobi, dedicated to verified inventory, transparent pricing, and trustworthy vehicle sales.",
};

export default function AboutPage() {
  return (
    <div className="bg-background-secondary min-h-screen py-10 sm:py-16">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:text-action">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            About MotoHaven Dealership
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            MotoHaven is a licensed independent car dealership established in Nairobi, Kenya. We focus on physically verified stock, transparent documentation, and straightforward customer service.
          </p>
        </div>

        {/* Narrative & Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-card border border-border shadow-sm space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text-primary">
                A Single-Dealership Standard
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Unlike open classifieds and broker marketplaces where listings may be phantom, outdated, or inflated, MotoHaven is a single dealership. Every vehicle displayed on our platform is physically held in our Nairobi inventory or arriving directly through our verified import channels.
              </p>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                We believe car buying in Kenya should be transparent. That means accurate photographs showing actual vehicle condition, clear year of manufacture, true odometer readings in kilometres, and upfront pricing in Kenyan Shillings without hidden markup.
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Our Core Operating Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real Stock Only</span>
                  </div>
                  <p className="pl-5.5">We do not list fictitious cars or borrow photos from international websites.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <ShieldCheck className="w-4 h-4 text-action shrink-0" />
                    <span>Legal Due Diligence</span>
                  </div>
                  <p className="pl-5.5">Logbook verification, NTSA TIMS checks, and clean duty documentation.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <Users className="w-4 h-4 text-action shrink-0" />
                    <span>Direct Staff Support</span>
                  </div>
                  <p className="pl-5.5">You speak directly with our Nairobi sales desk, not anonymous third parties.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <MapPin className="w-4 h-4 text-action shrink-0" />
                    <span>Physical Showroom</span>
                  </div>
                  <p className="pl-5.5">Accessible showroom on Ngong Road with secure on-site parking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom & Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-card border border-border shadow-sm space-y-5">
              <h3 className="text-base font-bold text-text-primary">
                Showroom Operations
              </h3>

              <div className="space-y-3 text-xs text-text-secondary">
                <div>
                  <p className="font-semibold text-text-primary">Physical Location</p>
                  <p>{DEALERSHIP_CONFIG.address}</p>
                </div>

                <div>
                  <p className="font-semibold text-text-primary">Operating Hours</p>
                  <p>Monday to Friday: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                  <p>Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                  <p>Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
                </div>

                <div>
                  <p className="font-semibold text-text-primary">Direct Contact</p>
                  <p>Phone: {DEALERSHIP_CONFIG.phone}</p>
                  <p>Email: {DEALERSHIP_CONFIG.email}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex flex-col gap-2.5">
                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-btn bg-brand-whatsapp text-white text-xs font-semibold hover:bg-brand-whatsappHover transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat with Sales Team</span>
                </a>
                <Link
                  href="/cars"
                  className="w-full py-2.5 px-4 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors text-center"
                >
                  Browse Available Stock
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
