import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DEALERSHIP_CONFIG } from "@/lib/config/dealership";

export const metadata: Metadata = {
  title: "Privacy Notice | MotoHaven Nairobi",
  description: "How MotoHaven Nairobi collects, uses, and protects customer enquiry information in compliance with the Kenya Data Protection Act.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium" aria-current="page">
            Privacy Notice
          </span>
        </nav>

        <div className="border-b border-border pb-6 space-y-2">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Customer Privacy Notice
          </h1>
          <p className="text-xs text-text-secondary">
            Last updated: November 2026 · MotoHaven Nairobi
          </p>
        </div>

        <div className="prose prose-neutral max-w-none text-sm text-text-secondary space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Who We Are</h2>
            <p>
              MotoHaven is an independent car dealership located on Ngong Road in Nairobi, Kenya. We operate a physical vehicle showroom offering foreign-used and locally verified vehicles for direct retail purchase.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Information We Collect</h2>
            <p>
              When you submit a viewing request, test-drive booking, or enquiry through this website, we collect only the information necessary to fulfill your request:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Full Name:</strong> To address you and register your viewing appointment.</li>
              <li><strong>Kenyan Telephone Number:</strong> To contact you via call or WhatsApp regarding vehicle availability and showroom appointment times.</li>
              <li><strong>Email Address (optional):</strong> To send formal purchase quotations or vehicle specifications upon your request.</li>
              <li><strong>Specific Vehicle of Interest:</strong> Year, make, and model of the car you wish to inspect.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. How We Use Your Data</h2>
            <p>
              Your contact details are used strictly to coordinate your requested appointment, answer questions about our vehicles, and arrange sales documentation if you choose to purchase. We do not sell, rent, or distribute your personal details to third-party marketing companies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Data Retention and Security</h2>
            <p>
              Enquiries are retained only as long as necessary to complete your vehicle purchase or follow up on your showroom request. Staff access to customer lead data is password-protected, encrypted, and restricted to authorised showroom sales personnel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">5. Your Rights Under the Kenya Data Protection Act 2019</h2>
            <p>
              Under the Kenya Data Protection Act, 2019 and regulations overseen by the Office of the Data Protection Commissioner (ODPC), you have the right to access your personal data, request corrections, or ask for your enquiry record to be permanently deleted from our system at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">6. Contact Us About Privacy</h2>
            <p>
              If you have any questions or wish to exercise your data rights, please contact our showroom desk directly:
            </p>
            <div className="bg-background-secondary p-4 border border-border text-xs space-y-1">
              <p className="font-semibold text-text-primary">MotoHaven Dealership</p>
              <p>Ngong Road, Nairobi, Kenya</p>
              <p>Phone: {DEALERSHIP_CONFIG.phone}</p>
              <p>Email: {DEALERSHIP_CONFIG.email}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
