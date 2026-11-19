"use client";

import React, { useState, useEffect, useId, useCallback } from "react";
import { Vehicle } from "@/types/vehicle";
import { formatKSh, isValidKenyanPhone } from "@/lib/config/dealership";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

interface EnquiryModalProps {
  vehicle: Vehicle;
  initialType?: "Viewing" | "Test Drive" | "General Question";
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({
  vehicle,
  initialType = "Viewing",
  isOpen,
  onClose,
}: EnquiryModalProps) {
  const [enquiryType, setEnquiryType] = useState<"Viewing" | "Test Drive" | "General Question">(initialType);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const dateId = useId();
  const timeId = useId();
  const messageId = useId();
  const honeypotId = useId();

  const modalRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);

  // Reset state and trap initial focus when opening (Finding R7)
  useEffect(() => {
    if (isOpen) {
      setEnquiryType(initialType);
      setSuccess(false);
      setErrorMessage("");
      previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);
    }
  }, [isOpen, initialType]);

  const handleClose = useCallback(() => {
    setSuccess(false);
    setErrorMessage("");
    setCustomerName("");
    setPhone("");
    setEmail("");
    setPreferredDate("");
    setPreferredTime("");
    setMessage("");
    setHoneypot("");
    onClose();

    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  }, [onClose]);

  // Handle Escape key and Tab focus trap (Finding R7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!isValidKenyanPhone(phone)) {
      setErrorMessage("Please enter a valid Kenyan phone number (e.g. 0712 345 678 or +254 712 345 678).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          vehicle_id: vehicle.id,
          enquiry_type: enquiryType,
          preferred_date: preferredDate || undefined,
          preferred_time: preferredTime || undefined,
          message: message.trim() || undefined,
          honeypot: honeypot || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting your enquiry. Please try again or WhatsApp our sales desk directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (enquiryType) {
      case "Viewing":
        return "Schedule a Showroom Viewing";
      case "Test Drive":
        return "Book a Showroom Test Drive";
      case "General Question":
      default:
        return "Ask About This Vehicle";
    }
  };

  const getSuccessTitle = () => {
    switch (enquiryType) {
      case "Viewing":
        return "Viewing Request Received";
      case "Test Drive":
        return "Test Drive Request Received";
      case "General Question":
      default:
        return "Enquiry Received";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div ref={modalRef} className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-2xl shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close enquiry dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-text-secondary hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div role="status" className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 id="enquiry-modal-title" className="text-xl font-bold text-text-primary">
                {getSuccessTitle()}
              </h2>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-text-primary">{customerName}</strong>. Our sales desk has received your request for the{" "}
                <strong className="text-text-primary">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </strong>
                . A representative will contact you via phone or WhatsApp shortly to confirm appointment details and vehicle availability.
              </p>
              <p className="text-[11px] text-text-secondary italic">
                * Note: Submitting a request does not reserve the vehicle until confirmed by dealership staff.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-action text-white text-xs font-semibold hover:bg-action-hover min-h-[44px]"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <h2 id="enquiry-modal-title" className="text-lg font-bold text-text-primary">
                {getModalTitle()}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {vehicle.year} {vehicle.brand} {vehicle.model} • {formatKSh(vehicle.price)}
              </p>
            </div>

            {/* Enquiry Type Switcher */}
            <div className="grid grid-cols-3 gap-1.5 mb-4 p-1 rounded-xl bg-stone-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setEnquiryType("Viewing")}
                className={`py-2 px-2 rounded-lg transition-all min-h-[36px] ${
                  enquiryType === "Viewing"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Viewing
              </button>
              <button
                type="button"
                onClick={() => setEnquiryType("Test Drive")}
                className={`py-2 px-2 rounded-lg transition-all min-h-[36px] ${
                  enquiryType === "Test Drive"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Test Drive
              </button>
              <button
                type="button"
                onClick={() => setEnquiryType("General Question")}
                className={`py-2 px-2 rounded-lg transition-all min-h-[36px] ${
                  enquiryType === "General Question"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Question
              </button>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Bot Honeypot field (hidden from users) */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor={honeypotId}>Do not fill this</label>
                <input
                  id={honeypotId}
                  type="text"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor={nameId} className="block font-medium text-text-primary mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  required
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kenneth Otieno"
                  className="w-full h-11 px-3 bg-white border border-stone-200 rounded-xl text-text-primary text-sm focus:border-text-primary"
                />
              </div>

              <div>
                <label htmlFor={phoneId} className="block font-medium text-text-primary mb-1">
                  Kenyan Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  id={phoneId}
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  className="w-full h-11 px-3 bg-white border border-stone-200 rounded-xl text-text-primary text-sm focus:border-text-primary"
                />
                <span className="text-[11px] text-text-secondary mt-0.5 block">
                  Kenyan format: 07XX or 01XX or +254
                </span>
              </div>

              <div>
                <label htmlFor={emailId} className="block font-medium text-text-primary mb-1">
                  Email Address <span className="text-text-secondary font-normal">(Optional)</span>
                </label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kenneth@example.com"
                  className="w-full h-11 px-3 bg-white border border-stone-200 rounded-xl text-text-primary text-sm focus:border-text-primary"
                />
              </div>

              {enquiryType !== "General Question" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={dateId} className="block font-medium text-text-primary mb-1">
                      Preferred Date
                    </label>
                    <input
                      id={dateId}
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-stone-200 rounded-xl text-text-primary text-sm focus:border-text-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor={timeId} className="block font-medium text-text-primary mb-1">
                      Preferred Time
                    </label>
                    <select
                      id={timeId}
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-stone-200 rounded-xl text-text-primary text-sm focus:border-text-primary"
                    >
                      <option value="">Any time</option>
                      <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                      <option value="Afternoon (12pm - 3pm)">Afternoon (12pm - 3pm)</option>
                      <option value="Late Afternoon (3pm - 6pm)">Late Afternoon (3pm - 6pm)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor={messageId} className="block font-medium text-text-primary mb-1">
                  Questions or Special Requests <span className="text-text-secondary font-normal">(Optional)</span>
                </label>
                <textarea
                  id={messageId}
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about vehicle history, logbook, or arrange an inspection..."
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-text-primary text-sm focus:border-text-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                >
                  <span>{submitting ? "Sending Request..." : "Send Request to MotoHaven"}</span>
                </button>
              </div>

              <p className="text-[11px] text-text-secondary text-center">
                Your contact details are used solely to coordinate your showroom visit or answer your inquiry. See our{" "}
                <a href="/privacy" target="_blank" className="underline hover:text-text-primary">
                  Privacy Notice
                </a>
                .
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
