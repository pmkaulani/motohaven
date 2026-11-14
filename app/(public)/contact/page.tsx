"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl, isValidKenyanPhone } from "@/lib/config/dealership";
import { MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!isValidKenyanPhone(phone)) {
      setErrorMsg("Please enter a valid Kenyan phone number (e.g. 0712 345678).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          enquiry_type: "general",
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setErrorMsg("Could not submit enquiry. Please try WhatsApp or telephone directly.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className="text-text-primary">Contact</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Contact MotoHaven
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Reach our sales desk directly via WhatsApp, phone, or visit our Ngong Road showroom in Nairobi.
          </p>
        </div>

        {/* Contact Grid: Details on Left, Form on Right (Unboxed, Anti-Card) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-border pt-10">
          {/* Details Column */}
          <div className="md:col-span-5 space-y-6 text-sm">
            <h2 className="text-lg font-bold text-text-primary">
              Showroom Coordinates
            </h2>

            <div className="space-y-4 text-text-secondary">
              <div>
                <p className="font-semibold text-text-primary">Physical Showroom</p>
                <p className="mt-0.5">{DEALERSHIP_CONFIG.address}</p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Opening Hours</p>
                <p className="mt-0.5">Mon – Fri: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                <p>Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                <p>Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Telephone</p>
                <p className="mt-0.5">
                  <a
                    href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                    className="text-text-primary font-medium hover:underline"
                  >
                    {DEALERSHIP_CONFIG.phone}
                  </a>
                </p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Email</p>
                <p className="mt-0.5">
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
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-brand-whatsapp text-white text-sm font-semibold hover:bg-brand-whatsappHover transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Message Form Column (Clean Unboxed Form) */}
          <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 md:pl-10">
            <h2 className="text-lg font-bold text-text-primary mb-1">
              Send a Message
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Have questions about a vehicle, trade-in, or viewing? Fill out the form below.
            </p>

            {submitted ? (
              <div className="py-8 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="text-base font-bold text-text-primary">
                    Message Sent Successfully
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Thank you for reaching out. A MotoHaven sales representative will contact you via phone or WhatsApp shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="text-xs font-semibold text-text-primary underline hover:no-underline"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {errorMsg && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    Your Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kenneth Otieno"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0712 345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">
                      Email Address <span className="text-text-secondary font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what car you are interested in or any questions regarding viewing."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-white rounded-btn border border-border focus:border-text-primary focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto h-11 px-6 rounded-btn bg-action text-white text-sm font-semibold hover:bg-action-hover transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Submit Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
