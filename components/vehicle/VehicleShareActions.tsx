"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { formatKSh } from "@/lib/config/dealership";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";

export function VehicleShareActions({ vehicle }: { vehicle: Vehicle }) {
  const [copied, setCopied] = useState(false);

  const vehicleUrl = typeof window !== "undefined" ? window.location.href : `https://motohaven.co.ke/cars/${vehicle.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vehicleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const shareText = `Check out this ${vehicle.year} ${vehicle.brand} ${vehicle.model} (${formatKSh(vehicle.price)}) at MotoHaven Nairobi:\n${vehicleUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share vehicle on WhatsApp"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-whatsapp text-white hover:bg-brand-whatsappHover transition-colors min-h-[36px]"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-current" />
        <span>Share</span>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy vehicle link to clipboard"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-field bg-white text-text-primary hover:bg-background-secondary transition-colors min-h-[36px]"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-brand-whatsapp" />
            <span className="text-brand-whatsapp">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-text-secondary" />
            <span>Copy link</span>
          </>
        )}
      </button>
    </div>
  );
}
