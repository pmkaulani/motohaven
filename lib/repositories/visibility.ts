import type { VehicleStatus } from "@/types/vehicle";

export const PUBLIC_DETAIL_STATUSES: readonly VehicleStatus[] = [
  "Available",
  "Reserved",
  "Sold",
];

export const PUBLIC_ENQUIRY_STATUSES: readonly VehicleStatus[] = [
  "Available",
  "Reserved",
];

/**
 * Returns true if visitors can view the vehicle's detail page.
 * Strictly FALSE for Draft and Archived.
 */
export function isPublicVehicleStatus(status: VehicleStatus): boolean {
  return PUBLIC_DETAIL_STATUSES.includes(status);
}

/**
 * Returns true if visitors can submit viewing or test-drive booking requests for this vehicle.
 * Strictly FALSE for Sold, Draft, and Archived vehicles.
 */
export function canAcceptVehicleEnquiry(status: VehicleStatus): boolean {
  return PUBLIC_ENQUIRY_STATUSES.includes(status);
}
