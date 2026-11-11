"use client";

import React, { useState } from "react";
import { VehicleStatus } from "@/types/vehicle";

interface Props {
  vehicleId: string;
  currentStatus: VehicleStatus;
}

export function VehicleStatusUpdater({ vehicleId, currentStatus }: Props) {
  const [status, setStatus] = useState<VehicleStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newStatus: VehicleStatus) => {
    setStatus(newStatus);
    setUpdating(true);

    try {
      await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          sold: newStatus === "Sold",
        }),
      });
    } catch (e) {
      console.error("Failed to update status", e);
      setStatus(currentStatus);
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
    <select
      value={status}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as VehicleStatus)}
      className={`text-xs font-semibold py-1 px-2 rounded border focus:outline-none cursor-pointer ${getStatusStyle(
        status
      )}`}
    >
      <option value="Available">Available</option>
      <option value="Reserved">Reserved</option>
      <option value="Sold">Sold</option>
      <option value="Draft">Draft</option>
      <option value="Archived">Archived</option>
    </select>
  );
}
