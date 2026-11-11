"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEALERSHIP_CONFIG, buildGeneralWhatsAppUrl, isValidKenyanPhone } from "@/lib/config/dealership";
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

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
    <div className="bg-background-secondary min-h-screen py-10 sm:py-16">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link href="/" className="hover:text-action">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Contact</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Contact MotoHaven Dealership
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Reach our sales desk in Nairobi directly via WhatsApp, phone, or visit our Ngong Road showroom for vehicle inspections and test drives.
          </p>
        </div>

        {/* Contact Grid: Details on Left, Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-card border border-border shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-text-primary">
                Showroom Coordinates
              </h2>

              <div className="space-y-4 text-xs text-text-secondary">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Physical Showroom</p>
                    <p className="mt-0.5">{DEALERSHIP_CONFIG.address}</p>
                    <p className="text-[11px] text-text-secondary/80 mt-1">
                      Located along Ngong Road with secure on-site parking for customers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Opening Hours</p>
                    <p className="mt-0.5">Mon – Fri: {DEALERSHIP_CONFIG.hours.weekdays}</p>
                    <p>Saturday: {DEALERSHIP_CONFIG.hours.saturday}</p>
                    <p>Sunday: {DEALERSHIP_CONFIG.hours.sunday}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Telephone</p>
                    <a
                      href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
                      className="text-action font-semibold hover:underline mt-0.5 block"
                    >
                      {DEALERSHIP_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-background-secondary border border-border text-action shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Official Email</p>
                    <a
                      href={`mailto:${DEALERSHIP_CONFIG.email}`}
                      className="text-text-secondary hover:underline mt-0.5 block"
                    >
                      {DEALERSHIP_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-btn bg-brand-whatsapp text-white text-xs font-bold hover:bg-brand-whatsappHover transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Message Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-card border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-1">
              Send an Enquiry
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Looking for a specific model, trade-in enquiry, or financing consultation? Fill out the form below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  Enquiry Submitted Successfully
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Thank you for reaching out. A MotoHaven sales representative will contact you via phone or WhatsApp shortly.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="px-5 py-2 text-xs font-semibold bg-action text-white rounded-btn hover:bg-action-hover"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Your Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kenneth Otieno"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-text-primary mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0712 345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-text-primary mb-1">
                      Email Address <span className="text-text-secondary font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Message or Enquiry Details <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please specify what car you are interested in, your budget, or any questions regarding financing / trade-in."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Submit Message to MotoHaven"}
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
