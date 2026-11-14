import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DEALERSHIP_CONFIG } from "@/lib/config/dealership";
import { Search, Eye, Wrench, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How Buying Works | MotoHaven Nairobi",
  description: "The direct, transparent step-by-step process of purchasing a car at MotoHaven on Ngong Road, Nairobi.",
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
            How buying works
          </span>
        </nav>

        <div className="border-b border-border pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            How Buying Works at MotoHaven
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
            A clear, straightforward purchasing process from initial viewing to logbook handover at our Ngong Road showroom.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 bg-background-secondary border border-border flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Explore Available Showroom Inventory
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Review photographs, mileage, transmission, engine specifications, and genuine showroom prices published directly on our website. All published cars are physically present at our Nairobi yard.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 bg-background-secondary border border-border flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Book a Physical Showroom Viewing or Test Drive
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Contact our sales desk directly via WhatsApp, call us, or use the website booking form to schedule an on-site viewing. We prepare the car for your inspection on Ngong Road.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 bg-background-secondary border border-border flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Independent Mechanical & Paperwork Inspection
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                You are fully welcome to bring your trusted mechanic or book an AA Kenya vehicle inspection. We lay out the vehicle paperwork, export sheet (if available), and verify the chassis numbers in the engine bay together.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-10 h-10 bg-background-secondary border border-border flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-text-primary">
                Agreement, Direct Bank Payment & NTSA TIMS Transfer
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Once satisfied, we complete the formal sale agreement. Payments are made directly to our verified dealership bank account. We initiate the official NTSA TIMS transfer immediately and hand over the logbook, keys, and documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Showroom CTA */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-text-primary">Ready to view our vehicles?</p>
            <p className="text-xs text-text-secondary">Open Monday to Saturday on Ngong Road, Nairobi.</p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors self-start sm:self-auto min-h-[44px]"
          >
            <span>View cars for sale</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
