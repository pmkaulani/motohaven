export type VehicleCondition = "Brand New" | "Foreign Used" | "Locally Used";
export type Transmission = "Automatic" | "Manual";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type VehicleStatus = "Available" | "Reserved" | "Sold" | "Draft" | "Archived";
export type BodyType = "SUV" | "Saloon" | "Hatchback" | "Station Wagon" | "Pickup" | "Coupe";

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
}

export interface PaginatedVehicles {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
