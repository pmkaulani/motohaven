"use client";

import React, { useState } from "react";
import { EnquiryStatus } from "@/types/enquiry";
import { AlertCircle } from "lucide-react";

interface Props {
  enquiryId: string;
  currentStatus: EnquiryStatus;
  currentNotes?: string;
}

export function EnquiryStatusUpdater({ enquiryId, currentStatus }: Props) {
  const [status, setStatus] = useState<EnquiryStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = async (newStatus: EnquiryStatus) => {
    const previousStatus = status;
    setStatus(newStatus);
    setUpdating(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }
    } catch (e: any) {
      console.error("Failed to update enquiry status:", e);
      // Revert to previous status (Fixes Defect D10)
      setStatus(previousStatus);
      setErrorMsg(e?.message || "Failed to save status change.");
    } finally {
      setUpdating(false);
    }
  };

  const getBadgeStyle = (s: EnquiryStatus) => {
    switch (s) {
      case "New":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "Contacted":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "Viewing scheduled":
        return "bg-purple-50 text-purple-800 border-purple-300";
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <select
        value={status}
        disabled={updating}
        aria-label="Update customer enquiry status"
        onChange={(e) => handleChange(e.target.value as EnquiryStatus)}
        className={`text-xs font-semibold py-1.5 px-3 border cursor-pointer ${getBadgeStyle(
          status
        )}`}
      >
        <option value="New">New Lead</option>
        <option value="Contacted">Contacted</option>
        <option value="Viewing scheduled">Viewing Scheduled</option>
        <option value="Completed">Completed / Deal Done</option>
        <option value="Closed">Closed</option>
      </select>

      {errorMsg && (
        <span
          role="alert"
          className="text-[11px] text-red-600 flex items-center gap-1 font-normal"
        >
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMsg}</span>
        </span>
      )}
    </div>
  );
}
