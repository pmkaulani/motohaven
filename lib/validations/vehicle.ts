import { z } from "zod";

export const VehicleStatusEnum = z.enum(["Available", "Reserved", "Sold", "Draft", "Archived"]);
export const VehicleConditionEnum = z.enum(["Foreign Used", "Locally Used", "Brand New"]);
export const TransmissionEnum = z.enum(["Automatic", "Manual", "CVT"]);
export const FuelTypeEnum = z.enum(["Petrol", "Diesel", "Hybrid", "Electric"]);
export const BodyTypeEnum = z.enum(["SUV", "Saloon", "Hatchback", "Station Wagon", "Pickup", "Van / Minivan", "Coupe"]);

export const CreateVehicleSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required").max(60),
  model: z.string().trim().min(1, "Model is required").max(60),
  trim: z.string().trim().max(60).optional(),
  year: z.coerce.number().int().min(1980, "Year must be 1980 or later").max(new Date().getFullYear() + 2, "Invalid vehicle year"),
  price: z.coerce.number().positive("Price must be a positive number").max(1_000_000_000, "Price exceeds permitted maximum"),
  condition: VehicleConditionEnum,
  engine_cc: z.coerce.number().int().min(500, "Engine cc must be at least 500").max(12_000, "Engine cc exceeds maximum"),
  transmission: TransmissionEnum,
  fuel: FuelTypeEnum,
  mileage: z.coerce.number().int().min(0, "Mileage cannot be negative").max(2_000_000, "Mileage exceeds maximum"),
  body_type: BodyTypeEnum,
  drivetrain: z.string().trim().max(40).optional(),
  origin: z.string().trim().max(60).optional(),
  description: z.string().trim().max(5000).optional(),
  features: z.array(z.string().trim().max(100)).max(50).optional().default([]),
  stock_reference: z.string().trim().max(50).optional(),
  status: VehicleStatusEnum.optional().default("Available"),
  photo_urls: z.array(z.string().trim()).min(1, "At least one photograph is required"),
  cover_photo: z.string().trim().optional(),
  location: z.string().trim().max(100).optional().default("Nairobi Showroom"),
  proof_records: z.record(z.string(), z.string()).optional(),
});

export const UpdateVehicleSchema = z.object({
  brand: z.string().trim().min(1).max(60).optional(),
  model: z.string().trim().min(1).max(60).optional(),
  trim: z.string().trim().max(60).optional(),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 2).optional(),
  price: z.coerce.number().positive().max(1_000_000_000).optional(),
  condition: VehicleConditionEnum.optional(),
  engine_cc: z.coerce.number().int().min(500).max(12_000).optional(),
  transmission: TransmissionEnum.optional(),
  fuel: FuelTypeEnum.optional(),
  mileage: z.coerce.number().int().min(0).max(2_000_000).optional(),
  body_type: BodyTypeEnum.optional(),
  drivetrain: z.string().trim().max(40).optional(),
  origin: z.string().trim().max(60).optional(),
  description: z.string().trim().max(5000).optional(),
  features: z.array(z.string().trim().max(100)).max(50).optional(),
  stock_reference: z.string().trim().max(50).optional(),
  status: VehicleStatusEnum.optional(),
  sold: z.boolean().optional(),
  photo_urls: z.array(z.string().trim()).min(1).optional(),
  cover_photo: z.string().trim().optional(),
  location: z.string().trim().max(100).optional(),
  proof_records: z.record(z.string(), z.string()).optional(),
});
