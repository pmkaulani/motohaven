import { z } from "zod";
import { isValidKenyanPhone } from "@/lib/config/dealership";

export const EnquiryTypeEnum = z.enum(["Viewing", "Test Drive", "General Question"]);
export const EnquiryStatusEnum = z.enum(["New", "Contacted", "Viewing scheduled", "Completed", "Closed"]);

export const CreateEnquirySchema = z.object({
  customer_name: z.string().trim().min(1, "Customer name is required").max(100, "Customer name must not exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .min(9, "Phone number is too short")
    .max(30, "Phone number must not exceed 30 characters")
    .refine((val) => isValidKenyanPhone(val), {
      message: "Please enter a valid Kenyan phone number (e.g. 0712 345678, 0110 123456, or +254 712 345678)",
    }),
  email: z
    .string()
    .trim()
    .max(120, "Email must not exceed 120 characters")
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address format",
    }),
  vehicle_id: z.string().trim().max(100).optional(),
  enquiry_type: EnquiryTypeEnum.optional().default("General Question"),
  preferred_date: z.string().trim().max(50, "Preferred date must not exceed 50 characters").optional(),
  preferred_time: z.string().trim().max(50, "Preferred time must not exceed 50 characters").optional(),
  message: z.string().trim().max(2000, "Message must not exceed 2000 characters").optional(),
  honeypot: z.string().max(100).optional(),
  hp_contact: z.string().max(100).optional(),
});

export const UpdateEnquiryStatusSchema = z.object({
  status: EnquiryStatusEnum,
  notes: z.string().trim().max(2000).optional(),
});
