import React from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl } from "@/lib/config/dealership";
import { MessageCircle } from "lucide-react";

export const metadata = {
  title: `About Us | ${DEALERSHIP_CONFIG.name}`,
  description: "Learn about MotoHaven, an independent car dealership located on Ngong Road, Nairobi, dedicated to verified inventory, transparent pricing, and direct vehicle sales.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb & Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            About MotoHaven
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            An independent car dealership based in Nairobi, Kenya. We focus on genuine showroom stock, transparent pricing, and straightforward customer service.
          </p>
        </div>

        {/* Narrative Content (Unboxed editorial layout, Anti-Card) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-border pt-10">
          <div className="md:col-span-7 space-y-6 text-sm text-text-secondary leading-relaxed">
            <h2 className="text-xl font-bold text-text-primary">
              Our Dealership Approach
            </h2>
            <p>
              Unlike open classifieds and broker marketplaces where listings may be phantom, outdated, or inflated, MotoHaven is a single dealership. Every vehicle displayed on our platform is physically held in our inventory on Ngong Road, Nairobi.
            </p>
            <p>
              We believe car buying should be transparent. That means accurate photographs showing actual vehicle condition, clear year of manufacture, true odometer readings in kilometres, and upfront pricing in Kenyan Shillings.
            </p>
            <p>
              Our sales team is on ground to answer questions, show original documentation, and coordinate physical viewings and test drives at your convenience.
            </p>
          </div>

          <div className="md:col-span-5 space-y-6 border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 md:pl-10 text-sm">
            <h3 className="text-base font-bold text-text-primary">
              Showroom Information
            </h3>

            <div className="space-y-4 text-text-secondary">
              <div>
                <p className="font-semibold text-text-primary">Location</p>
                <p className="mt-0.5">{DEALERSHIP_CONFIG.address}</p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Hours</p>
                <p className="mt-0.5">Monday to Friday: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                <p>Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                <p>Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Direct Contact</p>
                <p className="mt-0.5">Phone: {DEALERSHIP_CONFIG.phone}</p>
                <p>Email: {DEALERSHIP_CONFIG.email}</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-brand-whatsapp text-white text-sm font-semibold hover:bg-brand-whatsappHover transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat with Sales Team</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
