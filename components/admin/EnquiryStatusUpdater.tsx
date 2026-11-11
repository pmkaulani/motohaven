"use client";

import React, { useState } from "react";
import { EnquiryStatus } from "@/types/enquiry";

interface Props {
  enquiryId: string;
  currentStatus: EnquiryStatus;
  currentNotes?: string;
}

export function EnquiryStatusUpdater({ enquiryId, currentStatus, currentNotes }: Props) {
  const [status, setStatus] = useState<EnquiryStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newStatus: EnquiryStatus) => {
    setStatus(newStatus);
    setUpdating(true);

    try {
      await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to update enquiry status", e);
      setStatus(currentStatus);
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
    <select
      value={status}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as EnquiryStatus)}
      className={`text-xs font-semibold py-1.5 px-3 rounded border focus:outline-none cursor-pointer ${getBadgeStyle(
        status
      )}`}
    >
      <option value="New">New Lead</option>
      <option value="Contacted">Contacted</option>
      <option value="Viewing scheduled">Viewing Scheduled</option>
      <option value="Completed">Completed / Deal Done</option>
      <option value="Closed">Closed</option>
    </select>
  );
}
