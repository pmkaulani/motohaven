"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { formatKSh, isValidKenyanPhone } from "@/lib/config/dealership";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

interface EnquiryModalProps {
  vehicle: Vehicle;
  initialType?: "viewing" | "test_drive" | "general";
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({
  vehicle,
  initialType = "viewing",
  isOpen,
  onClose,
}: EnquiryModalProps) {
  const [enquiryType, setEnquiryType] = useState<"viewing" | "test_drive" | "general">(initialType);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!isValidKenyanPhone(phone)) {
      setErrorMessage("Please enter a valid Kenyan phone number (e.g. 0712 345678 or +254 712 345678).");
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
          vehicle_name: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
          vehicle_price: vehicle.price,
          enquiry_type: enquiryType,
          preferred_date: preferredDate || undefined,
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setSuccess(true);
    } catch {
      setErrorMessage("An error occurred while submitting your enquiry. Please try again or WhatsApp our sales desk directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-card max-w-lg w-full p-6 shadow-2xl border border-border relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text-primary">
                Viewing Request Received
              </h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-text-primary">{customerName}</strong>. Our sales desk has received your request for the{" "}
                <strong className="text-text-primary">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </strong>
                . A representative will contact you via phone or WhatsApp shortly to confirm appointment details and vehicle availability.
              </p>
              <p className="text-[11px] text-text-secondary/80 italic">
                * Note: Submitting a request does not reserve the vehicle until confirmed by dealership staff.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-text-primary">
                {enquiryType === "viewing" && "Request Vehicle Viewing"}
                {enquiryType === "test_drive" && "Book a Test Drive"}
                {enquiryType === "general" && "Ask About This Vehicle"}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {vehicle.year} {vehicle.brand} {vehicle.model} • {formatKSh(vehicle.price)}
              </p>
            </div>

            {/* Enquiry Type Switcher */}
            <div className="grid grid-cols-3 gap-2 mb-4 p-1 bg-background-secondary rounded-btn text-xs font-semibold">
              <button
                type="button"
                onClick={() => setEnquiryType("viewing")}
                className={`py-1.5 rounded transition-colors ${
                  enquiryType === "viewing"
                    ? "bg-white text-action shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Viewing
              </button>
              <button
                type="button"
                onClick={() => setEnquiryType("test_drive")}
                className={`py-1.5 rounded transition-colors ${
                  enquiryType === "test_drive"
                    ? "bg-white text-action shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Test Drive
              </button>
              <button
                type="button"
                onClick={() => setEnquiryType("general")}
                className={`py-1.5 rounded transition-colors ${
                  enquiryType === "general"
                    ? "bg-white text-action shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Question
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Your Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenneth Otieno"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Phone / WhatsApp Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0712 345678 or +254 712 345678"
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
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                />
              </div>

              {enquiryType !== "general" && (
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Message or Specific Question <span className="text-text-secondary font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us if you have a trade-in, preferred time, or questions about the logbook / inspection."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending Request..." : "Send Request to MotoHaven"}
                </button>
                <p className="text-[10px] text-text-secondary text-center mt-2">
                  We respect your privacy. Your details are used strictly to coordinate your viewing.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
