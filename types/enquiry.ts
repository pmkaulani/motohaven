export type EnquiryType = "viewing" | "test_drive" | "general";
export type EnquiryStatus = "New" | "Contacted" | "Viewing scheduled" | "Completed" | "Closed";

export interface Enquiry {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email?: string;
  vehicle_id?: string;
  vehicle_name?: string;
  vehicle_price?: number;
  enquiry_type: EnquiryType;
  preferred_date?: string;
  message?: string;
  status: EnquiryStatus;
  notes?: string;
}

export interface CreateEnquiryInput {
  customer_name: string;
  phone: string;
  email?: string;
  vehicle_id?: string;
  vehicle_name?: string;
  vehicle_price?: number;
  enquiry_type: EnquiryType;
  preferred_date?: string;
  message?: string;
}
