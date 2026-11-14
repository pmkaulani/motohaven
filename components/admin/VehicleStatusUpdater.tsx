"use client";

import React, { useState } from "react";
import { VehicleStatus } from "@/types/vehicle";
import { AlertCircle } from "lucide-react";

interface Props {
  vehicleId: string;
  currentStatus: VehicleStatus;
}

export function VehicleStatusUpdater({ vehicleId, currentStatus }: Props) {
  const [status, setStatus] = useState<VehicleStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = async (newStatus: VehicleStatus) => {
    const previousStatus = status;
    setStatus(newStatus);
    setUpdating(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          sold: newStatus === "Sold",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }
    } catch (e: any) {
      console.error("Failed to update status:", e);
      // Revert to previous status (Fixes Defect D10)
      setStatus(previousStatus);
      setErrorMsg(e?.message || "Failed to save status change.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (s: VehicleStatus) => {
    switch (s) {
      case "Available":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "Reserved":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "Sold":
        return "bg-red-50 text-red-800 border-red-300";
      case "Draft":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "Archived":
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <select
        value={status}
        disabled={updating}
        aria-label="Update vehicle status"
        onChange={(e) => handleChange(e.target.value as VehicleStatus)}
        className={`text-xs font-semibold py-1 px-2 border cursor-pointer ${getStatusStyle(
          status
        )}`}
      >
        <option value="Available">Available</option>
        <option value="Reserved">Reserved</option>
        <option value="Sold">Sold</option>
        <option value="Draft">Draft</option>
        <option value="Archived">Archived</option>
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
