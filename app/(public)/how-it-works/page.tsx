import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DEALERSHIP_CONFIG } from "@/lib/config/dealership";
import { Search, Eye, Wrench, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Showroom Experience & Acquisition | MotoHaven Nairobi",
  description: "The bespoke, transparent step-by-step acquisition journey at MotoHaven on Ngong Road, Nairobi.",
};

export default function HowItWorksPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium" aria-current="page">
            Showroom Experience
          </span>
        </nav>

        <div className="border-b border-border pb-6 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">
            The MotoHaven Client Journey
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            The Showroom Experience & Acquisition
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
            A bespoke, transparent acquisition process designed around your schedule, from private gallery consultation to white-glove handover.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Explore Available Showroom Inventory
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Review verified photographs, exact mileage, engine specifications, and genuine showroom prices published directly on our website. All motorcars are physically present in our Nairobi showroom.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                In-Person Walkaround & Test Drive
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Contact our showroom team via WhatsApp or schedule your visit. We prepare your chosen car at our Ngong Road yard and take it for an unhurried test drive along the Southern Bypass.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Inspect Original Paperwork & Mechanic Review
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We review original export certificates, Japanese/UK auction sheets, chassis verification, and diagnostic reports together in our office. You are welcome to bring an independent mechanic or book an AA Kenya inspection.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Sale Agreement, Direct Bank Payment & NTSA Transfer
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Once satisfied, we sign the formal sale contract. Payments are made directly to our verified dealership bank account. We initiate the NTSA TIMS logbook transfer immediately and hand over keys and original documents.
              </p>
            </div>
          </div>
        </div>

        {/* Showroom CTA */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-text-primary">Ready to experience the showroom?</p>
            <p className="text-xs text-text-secondary">Open Monday to Saturday on Ngong Road, Nairobi.</p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors self-start sm:self-auto min-h-[44px]"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
