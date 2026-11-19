"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { formatKSh } from "@/lib/config/dealership";
import { Check, Copy, MessageCircle } from "lucide-react";

export function VehicleShareActions({ vehicle }: { vehicle: Vehicle }) {
  const [copied, setCopied] = useState(false);

  const vehicleUrl = typeof window !== "undefined" ? window.location.href : `https://motohaven.co.ke/cars/${vehicle.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vehicleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
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
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-brand-whatsapp text-white hover:bg-brand-whatsappHover transition-colors min-h-[38px]"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-current" />
        <span>Share</span>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy vehicle link to clipboard"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-stone-200 bg-white text-text-primary hover:bg-stone-50 transition-colors min-h-[38px]"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span>Copy link</span>
          </>
        )}
      </button>
    </div>
  );
}
