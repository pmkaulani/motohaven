export type VehicleCondition = "Brand New" | "Foreign Used" | "Locally Used";
export type Transmission = "Automatic" | "Manual";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type VehicleStatus = "Available" | "Reserved" | "Sold" | "Draft" | "Archived";
export type BodyType = "SUV" | "Saloon" | "Hatchback" | "Station Wagon" | "Pickup" | "Coupe";

export type EvidenceStatus =
  | "not_checked"
  | "pending"
  | "verified"
  | "not_supplied"
  | "not_applicable";

export interface VehicleEvidenceRecord {
  status: EvidenceStatus;
  evidencePath?: string; // object path, never a public URL for private documents
  sourceLabel?: string;
  checkedAt?: string;
  checkedBy?: string; // assigned from the verified server session, not trusted from form input
  internalNote?: string;
}

export interface VerificationAuditEntry {
  timestamp: string;
  actor: string;
  action: string;
  field?: string;
  details?: Record<string, any>;
}

export interface VehicleProofRecords {
  mileage?: VehicleEvidenceRecord;
  exportSheet?: VehicleEvidenceRecord;
  chassisCheck?: VehicleEvidenceRecord;
  inspection?: VehicleEvidenceRecord;
  logbook?: VehicleEvidenceRecord;
  dutyStatus?: VehicleEvidenceRecord;

  // Backwards compatibility with existing data
  odometer_photo?: string;
  mileage_source?: string;
  mileage_checked_date?: string;
  export_sheet_status?: string;
  chassis_check_status?: string;
  chassis_checked_date?: string;
  inspection_status?: string;
  inspector_name?: string;
  logbook_status?: string;
  first_registration_date?: string;
  duty_status?: string;
  history?: VerificationAuditEntry[];
}

export const EMPTY_VEHICLE_PROOF_RECORDS: VehicleProofRecords = {
  mileage: { status: "not_checked" },
  exportSheet: { status: "not_supplied" },
  chassisCheck: { status: "not_checked" },
  inspection: { status: "not_checked" },
  logbook: { status: "not_checked" },
  dutyStatus: { status: "not_checked" },
};

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim?: string;
  year: number;
  price: number;
  location: string;
  condition: VehicleCondition;
  engine_cc: number;
  transmission: Transmission;
  fuel: FuelType;
  mileage: number;
  body_type?: BodyType;
  drivetrain?: string;
  origin?: string;
  description?: string;
  features?: string[];
  stock_reference?: string;
  status: VehicleStatus;
  sold: boolean;
  photo_urls: string[];
  cover_photo?: string;
  proof_records?: VehicleProofRecords;
  created_at: string;
  updated_at?: string;
}

export interface VehicleFilterParams {
  q?: string;
  brand?: string;
  model?: string;
  condition?: string;
  transmission?: string;
  fuel?: string;
  body_type?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  sort?: "recent" | "price_asc" | "price_desc" | "year_desc" | "year_asc" | "mileage_asc";
  page?: number;
  limit?: number;
  includeAllStatuses?: boolean; // Only for staff queries
}

export interface PaginatedVehicles {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
