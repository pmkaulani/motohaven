"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { DEALERSHIP_CONFIG, buildVehicleWhatsAppUrl } from "@/lib/config/dealership";
import { EnquiryModal } from "@/components/vehicle/EnquiryModal";
import { Phone, MessageCircle, Calendar, Car } from "lucide-react";

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
    <div className="bg-white p-5 sm:p-6 rounded-card border border-border shadow-sm space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-primary">
          Interested in this vehicle?
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Contact our Nairobi sales desk directly or schedule an on-site viewing and test drive at our Ngong Road showroom.
        </p>
      </div>

      <div className="space-y-2.5 pt-2">
        {/* WhatsApp Official CTA */}
        {isAvailable && (
          <a
            href={buildVehicleWhatsAppUrl(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-btn bg-brand-whatsapp text-white text-xs font-bold hover:bg-brand-whatsappHover transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp (Instant Reply)</span>
          </a>
        )}

        {/* Direct Call CTA */}
        <a
          href={`tel:${DEALERSHIP_CONFIG.phone.replace(/\s+/g, "")}`}
          className="w-full py-3 px-4 rounded-btn border border-border bg-background-secondary text-text-primary text-xs font-bold hover:bg-background-tertiary transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>Call Sales Desk: {DEALERSHIP_CONFIG.phone}</span>
        </a>

        {/* Request Viewing Form Trigger */}
        {isAvailable && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => openEnquiry("viewing")}
              className="py-2.5 px-3 rounded-btn border border-border bg-white text-text-primary text-xs font-semibold hover:bg-background-secondary flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-action" />
              <span>Book Viewing</span>
            </button>
            <button
              type="button"
              onClick={() => openEnquiry("test_drive")}
              className="py-2.5 px-3 rounded-btn border border-border bg-white text-text-primary text-xs font-semibold hover:bg-background-secondary flex items-center justify-center gap-1.5 transition-colors"
            >
              <Car className="w-3.5 h-3.5 text-action" />
              <span>Test Drive</span>
            </button>
          </div>
        )}
      </div>

      {/* Showroom Hours Note */}
      <div className="pt-3 border-t border-border text-[11px] text-text-secondary space-y-1">
        <p>
          <strong className="text-text-primary font-medium">Showroom Location:</strong> {DEALERSHIP_CONFIG.address}
        </p>
        <p>
          <strong className="text-text-primary font-medium">Hours:</strong> Mon–Fri 8:00 AM – 6:00 PM | Sat 9:00 AM – 5:00 PM
        </p>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        vehicle={vehicle}
        initialType={enquiryType}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
