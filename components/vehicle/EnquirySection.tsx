"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { DEALERSHIP_CONFIG, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import { EnquiryModal } from "@/components/vehicle/EnquiryModal";
import { Phone, MessageCircle, Calendar } from "lucide-react";

interface EnquirySectionProps {
  vehicle: Vehicle;
}

export function EnquirySection({ vehicle }: EnquirySectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [enquiryType, setEnquiryType] = useState<"viewing" | "test_drive" | "general">("viewing");

  const openEnquiry = (type: "viewing" | "test_drive" | "general") => {
    setEnquiryType(type);
    setModalOpen(true);
  };

  const isAvailable = vehicle.status === "Available" && !vehicle.sold;

  return (
    <div className="bg-white p-6 rounded-card border border-border space-y-5">
      <div>
        <h3 className="text-base font-bold text-text-primary">
          Enquire About This Vehicle
        </h3>
        <p className="text-sm text-text-secondary mt-1 leading-relaxed">
          Contact our showroom desk on Ngong Road directly or schedule an on-site viewing.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {/* Official WhatsApp Button */}
        {isAvailable && (
          <a
            href={buildVehicleWhatsAppUrl(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 px-4 rounded-btn bg-brand-whatsapp text-white text-sm font-semibold hover:bg-brand-whatsappHover transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        )}

        {/* Direct Phone Call Button */}
        <a
          href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
          className="w-full h-11 px-4 rounded-btn border border-border bg-white text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4 text-text-secondary" />
          <span>Call: {DEALERSHIP_CONFIG.phone}</span>
        </a>

        {/* Request Viewing / Test Drive Modal Trigger */}
        {isAvailable && (
          <button
            type="button"
            onClick={() => openEnquiry("viewing")}
            className="w-full h-11 px-4 rounded-btn border border-border bg-white text-text-primary text-sm font-medium hover:bg-background-secondary transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span>Schedule Viewing / Test Drive</span>
          </button>
        )}
      </div>

      {/* Showroom Working Hours */}
      <div className="pt-4 border-t border-border text-xs text-text-secondary space-y-1">
        <p className="font-medium text-text-primary">Showroom Details:</p>
        <p>{DEALERSHIP_CONFIG.address}</p>
        <p>Mon–Fri: {DEALERSHIP_CONFIG.hours.weekdays} · Sat: {DEALERSHIP_CONFIG.hours.saturday}</p>
      </div>

      <EnquiryModal
        vehicle={vehicle}
        initialType={enquiryType}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
