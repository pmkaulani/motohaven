import { LocalDB } from "@/lib/db/local-db";
import { Enquiry, EnquiryStatus, CreateEnquiryInput } from "@/types/enquiry";
import { VehiclesRepository } from "./vehicles";
import { StaffSessionPayload } from "@/lib/auth/session";
import { AuthError } from "@/lib/auth/guards";

const ALLOWED_STATUSES: EnquiryStatus[] = [
  "New",
  "Contacted",
  "Viewing scheduled",
  "Completed",
  "Closed",
];

export const EnquiriesRepository = {
  /**
   * Retrieves all customer enquiries for authorized staff only (Finding R1).
   * STRICT REQUIREMENT: Requires valid verified staff session.
   */
  async getStaffEnquiries(session?: StaffSessionPayload | null): Promise<Enquiry[]> {
    if (!session || session.role !== "dealership_staff") {
      throw new AuthError("Staff authentication required to access customer enquiries.", 401);
    }
    return LocalDB.getEnquiries();
  },

  /**
   * Public enquiry submission with strict validation and server-side vehicle resolution.
   */
  async createPublicEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
    // 1. Bot prevention: Honeypot check
    if (input.honeypot && input.honeypot.trim().length > 0) {
      throw new Error("Invalid submission.");
    }

    // 2. Field length caps (Defect D6)
    const customer_name = input.customer_name?.trim();
    if (!customer_name || customer_name.length > 100) {
      throw new Error("Customer name is required and must not exceed 100 characters.");
    }

    const phone = input.phone?.trim();
    if (!phone || phone.length > 30) {
      throw new Error("Valid phone number is required.");
    }

    const email = input.email?.trim() || undefined;
    if (email && email.length > 120) {
      throw new Error("Email must not exceed 120 characters.");
    }

    const message = input.message?.trim() || undefined;
    if (message && message.length > 2000) {
      throw new Error("Message must not exceed 2000 characters.");
    }

    // 3. Server-side lookup of published vehicle details (Finding R9 fix: published-only lookup)
    let vehicle_name: string | undefined = undefined;
    let vehicle_price: number | undefined = undefined;

    if (input.vehicle_id) {
      const vehicle = await VehiclesRepository.getPublishedVehicleById(input.vehicle_id);
      if (vehicle) {
        vehicle_name = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
        vehicle_price = vehicle.price;
      }
    }

    // 4. Force default workflow state: status = "New", notes = undefined
    const enquiry = LocalDB.createEnquiry({
      vehicle_id: input.vehicle_id,
      vehicle_name,
      vehicle_price,
      customer_name,
      phone,
      email,
      enquiry_type: input.enquiry_type || "General Question",
      preferred_date: input.preferred_date,
      preferred_time: input.preferred_time,
      message,
    });

    return enquiry;
  },

  /**
   * Staff update of enquiry status and internal notes.
   */
  async updateStaffEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    notes?: string
  ): Promise<Enquiry | null> {
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new Error(`Invalid enquiry status: ${status}. Permitted statuses: ${ALLOWED_STATUSES.join(", ")}`);
    }

    return LocalDB.updateEnquiryStatus(id, status, notes);
  },
};
