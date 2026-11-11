import fs from "fs";
import path from "path";
import { Vehicle, VehicleFilterParams, PaginatedVehicles } from "@/types/vehicle";
import { Enquiry, CreateEnquiryInput, EnquiryStatus } from "@/types/enquiry";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "motohaven_db.json");

interface DatabaseSchema {
  vehicles: Vehicle[];
  enquiries: Enquiry[];
}

// Initial seed data including verified live Supabase vehicles and realistic Nairobi inventory
const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "558d48d9-ddb3-4733-a190-5d78423749d2",
    slug: "bmw-320i-2007-558d",
    brand: "BMW",
    model: "320i",
    trim: "Executive",
    year: 2007,
    price: 2000000,
    location: "Nairobi Showroom",
    condition: "Foreign Used",
    engine_cc: 2500,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 12000,
    body_type: "Saloon",
    drivetrain: "RWD",
    origin: "Japan Import",
    description: "Verified BMW 320i in immaculate condition. Smooth 6-cylinder 2500cc engine, pristine grey fabric interior, alloy wheels, and low verified mileage. Fully serviced and ready to drive.",
    features: ["Alloy Wheels", "Air Conditioning", "Power Windows", "Central Locking", "Anti-Lock Braking", "Dual Airbags"],
    stock_reference: "MH-2007-BMW3",
    status: "Available",
    sold: false,
    photo_urls: [
      "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794243666938-oqapywixu6.jpg"
    ],
    cover_photo: "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794243666938-oqapywixu6.jpg",
    created_at: "2026-11-09T17:01:08.531Z"
  },
  {
    id: "6a5d8580-d7ed-4326-b969-56b9ff61a1a4",
    slug: "bmw-m5-2023-6a5d",
    brand: "BMW",
    model: "M5",
    trim: "Competition",
    year: 2023,
    price: 15000000,
    location: "Nairobi Showroom",
    condition: "Foreign Used",
    engine_cc: 3500,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 45000,
    body_type: "Saloon",
    drivetrain: "AWD",
    origin: "UK Import",
    description: "High performance BMW M5 Competition. Twin-turbo powertrain, M xDrive all-wheel drive, carbon roof, Merino leather upholstery, head-up display, and Harman Kardon audio system.",
    features: ["M xDrive AWD", "Carbon Fiber Roof", "Head-Up Display", "Harman Kardon Audio", "Merino Leather", "360 Camera", "Adaptive LED Headlights"],
    stock_reference: "MH-2023-BMWM5",
    status: "Available",
    sold: false,
    photo_urls: [
      "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794248603531-pr17p468u49.jpg",
      "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794248605282-9n2h6o6rcse.jpg",
      "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794248606050-p59rjdg89c.jpg"
    ],
    cover_photo: "https://dfswwtrwoyqzirmyeqht.supabase.co/storage/v1/object/public/car-photos/1794248603531-pr17p468u49.jpg",
    created_at: "2026-11-09T18:23:27.863Z"
  },
  {
    id: "7c3f9102-12a4-4f81-9b12-8924b1a8d001",
    slug: "toyota-land-cruiser-prado-tx-2019-7c3f",
    brand: "Toyota",
    model: "Land Cruiser Prado",
    trim: "TX L-Package",
    year: 2019,
    price: 6850000,
    location: "Nairobi Showroom",
    condition: "Foreign Used",
    engine_cc: 2800,
    transmission: "Automatic",
    fuel: "Diesel",
    mileage: 62000,
    body_type: "SUV",
    drivetrain: "4WD",
    origin: "Japan Import",
    description: "Toyota Land Cruiser Prado TX L-Package 2.8L turbo diesel. 7-seater, beige leather interior, sunroof, roof rails, push start, reverse camera, multi-terrain select, and full service history.",
    features: ["7-Seater", "Leather Interior", "Sunroof", "Reverse Camera", "Push Start", "Roof Rails", "Multi-Terrain ABS"],
    stock_reference: "MH-2019-PRADO",
    status: "Available",
    sold: false,
    photo_urls: [
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80"
    ],
    cover_photo: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1200&auto=format&fit=crop&q=80",
    created_at: "2026-11-10T09:15:00.000Z"
  },
  {
    id: "8d4e0213-23b5-4a92-ac23-9035c2b9e112",
    slug: "mazda-cx-5-2018-8d4e",
    brand: "Mazda",
    model: "CX-5",
    trim: "2.2D XD L-Package",
    year: 2018,
    price: 3250000,
    location: "Nairobi Showroom",
    condition: "Foreign Used",
    engine_cc: 2200,
    transmission: "Automatic",
    fuel: "Diesel",
    mileage: 58000,
    body_type: "SUV",
    drivetrain: "AWD",
    origin: "Japan Import",
    description: "Mazda CX-5 XD L-Package SkyActiv-D twin-turbo diesel. Soul red crystal metallic, black leather seats with heating, Bose premium audio, head-up display, blind-spot monitoring, radar cruise control.",
    features: ["Bose Sound System", "Heated Leather Seats", "Head-Up Display", "Lane Departure Alert", "Power Tailgate", "Radar Cruise Control"],
    stock_reference: "MH-2018-CX5",
    status: "Available",
    sold: false,
    photo_urls: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80"
    ],
    cover_photo: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80",
    created_at: "2026-11-10T11:30:00.000Z"
  },
  {
    id: "9e5f1324-34c6-4b03-bd34-0146d3caf223",
    slug: "subaru-outback-2017-9e5f",
    brand: "Subaru",
    model: "Outback",
    trim: "2.5i Limited EyeSight",
    year: 2017,
    price: 2950000,
    location: "Nairobi Showroom",
    condition: "Foreign Used",
    engine_cc: 2500,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 74000,
    body_type: "Station Wagon",
    drivetrain: "AWD",
    origin: "Japan Import",
    description: "Subaru Outback 2.5i Limited with EyeSight Driver Assist. Symmetrical All-Wheel Drive, X-Mode with hill descent control, leather seats, power sunroof, paddle shifters, spacious luggage capacity.",
    features: ["Symmetrical AWD", "EyeSight Driver Assist", "X-Mode", "Sunroof", "Paddle Shifters", "Power Driver Seat"],
    stock_reference: "MH-2017-OUTBK",
    status: "Available",
    sold: false,
    photo_urls: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80"
    ],
    cover_photo: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80",
    created_at: "2026-11-10T14:00:00.000Z"
  },
  {
    id: "0f6a2435-45d7-4c14-ce45-1257e4db0334",
    slug: "mercedes-benz-c200-2019-0f6a",
    brand: "Mercedes-Benz",
    model: "C200",
    trim: "AMG Line",
    year: 2019,
    price: 4950000,
    location: "Nairobi Showroom",
    condition: "Foreign Used",
    engine_cc: 1500,
    transmission: "Automatic",
    fuel: "Petrol",
    mileage: 39000,
    body_type: "Saloon",
    drivetrain: "RWD",
    origin: "UK Import",
    description: "Mercedes-Benz C200 AMG Line with EQ Boost mild-hybrid technology. Polar white exterior, panoramic sliding sunroof, digital widescreen cockpit, ambient lighting, AMG alloy wheels.",
    features: ["AMG Line Body Styling", "Panoramic Sunroof", "Digital Cockpit", "Ambient Lighting 64 Colors", "LED High Performance Lights", "Active Parking Assist"],
    stock_reference: "MH-2019-C200",
    status: "Available",
    sold: false,
    photo_urls: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=80"
    ],
    cover_photo: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=80",
    created_at: "2026-11-11T08:20:00.000Z"
  }
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-101",
    created_at: "2026-11-11T10:15:00.000Z",
    customer_name: "Kenneth Otieno",
    phone: "0722123456",
    email: "kotieno@gmail.com",
    vehicle_id: "7c3f9102-12a4-4f81-9b12-8924b1a8d001",
    vehicle_name: "Toyota Land Cruiser Prado 2019",
    vehicle_price: 6850000,
    enquiry_type: "viewing",
    preferred_date: "2026-11-14",
    message: "I would like to come view the Prado this Friday afternoon at the Ngong Road showroom. Please let me know if 2 PM works.",
    status: "New"
  },
  {
    id: "enq-102",
    created_at: "2026-11-11T11:45:00.000Z",
    customer_name: "Wanjiku Mwangi",
    phone: "0711987654",
    email: "wanjiku.m@outlook.com",
    vehicle_id: "8d4e0213-23b5-4a92-ac23-9035c2b9e112",
    vehicle_name: "Mazda CX-5 2018",
    vehicle_price: 3250000,
    enquiry_type: "test_drive",
    preferred_date: "2026-11-15",
    message: "Interested in a test drive for the CX-5. Does the price include logbook transfer and NTSA inspection?",
    status: "Contacted"
  }
];

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      vehicles: INITIAL_VEHICLES,
      enquiries: INITIAL_ENQUIRIES,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (!data.vehicles || !Array.isArray(data.vehicles)) {
      data.vehicles = INITIAL_VEHICLES;
    }
    if (!data.enquiries || !Array.isArray(data.enquiries)) {
      data.enquiries = INITIAL_ENQUIRIES;
    }
    return data;
  } catch (err) {
    console.error("Error reading local db file, resetting to initial data:", err);
    const initialData: DatabaseSchema = {
      vehicles: INITIAL_VEHICLES,
      enquiries: INITIAL_ENQUIRIES,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function writeDbFile(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

export const LocalDB = {
  getVehicles(params: VehicleFilterParams = {}): PaginatedVehicles {
    const db = ensureDbFile();
    let list = [...db.vehicles];

    // Filter by status: public queries only see Available & Reserved (or explicit)
    // If not in admin mode, do not show Draft or Archived
    list = list.filter((v) => v.status !== "Archived" && v.status !== "Draft");

    // Keyword search
    if (params.q && params.q.trim()) {
      const q = params.q.toLowerCase().trim();
      list = list.filter((v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        `${v.brand} ${v.model}`.toLowerCase().includes(q) ||
        (v.description && v.description.toLowerCase().includes(q)) ||
        (v.trim && v.trim.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (params.brand && params.brand.trim()) {
      const b = params.brand.toLowerCase().trim();
      list = list.filter((v) => v.brand.toLowerCase() === b);
    }

    // Body type filter
    if (params.body_type && params.body_type.trim()) {
      const bt = params.body_type.toLowerCase().trim();
      list = list.filter((v) => v.body_type?.toLowerCase() === bt);
    }

    // Condition filter
    if (params.condition && params.condition.trim()) {
      const cond = params.condition.toLowerCase().trim();
      list = list.filter((v) => v.condition.toLowerCase() === cond);
    }

    // Transmission filter
    if (params.transmission && params.transmission.trim()) {
      const trans = params.transmission.toLowerCase().trim();
      list = list.filter((v) => v.transmission.toLowerCase() === trans);
    }

    // Fuel filter
    if (params.fuel && params.fuel.trim()) {
      const f = params.fuel.toLowerCase().trim();
      list = list.filter((v) => v.fuel.toLowerCase() === f);
    }

    // Price range
    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      list = list.filter((v) => v.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      list = list.filter((v) => v.price <= params.maxPrice!);
    }

    // Year range
    if (params.minYear !== undefined && !isNaN(params.minYear)) {
      list = list.filter((v) => v.year >= params.minYear!);
    }
    if (params.maxYear !== undefined && !isNaN(params.maxYear)) {
      list = list.filter((v) => v.year <= params.maxYear!);
    }

    // Max mileage
    if (params.maxMileage !== undefined && !isNaN(params.maxMileage)) {
      list = list.filter((v) => v.mileage <= params.maxMileage!);
    }

    // Sorting
    switch (params.sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "year_desc":
        list.sort((a, b) => b.year - a.year);
        break;
      case "year_asc":
        list.sort((a, b) => a.year - b.year);
        break;
      case "mileage_asc":
        list.sort((a, b) => a.mileage - b.mileage);
        break;
      case "recent":
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    const total = list.length;
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const limit = params.limit && params.limit > 0 ? Number(params.limit) : 12;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      vehicles: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  },

  getAllAdminVehicles(): Vehicle[] {
    const db = ensureDbFile();
    return [...db.vehicles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getVehicleBySlug(slug: string): Vehicle | null {
    const db = ensureDbFile();
    return db.vehicles.find((v) => v.slug === slug || v.id === slug) || null;
  },

  getVehicleById(id: string): Vehicle | null {
    const db = ensureDbFile();
    return db.vehicles.find((v) => v.id === id) || null;
  },

  getSimilarVehicles(vehicleId: string, limit: number = 3): Vehicle[] {
    const db = ensureDbFile();
    const current = db.vehicles.find((v) => v.id === vehicleId);
    if (!current) return [];

    return db.vehicles
      .filter((v) => v.id !== vehicleId && v.status === "Available")
      .sort((a, b) => {
        // Boost same brand or body type
        const aScore = (a.brand === current.brand ? 2 : 0) + (a.body_type === current.body_type ? 1 : 0);
        const bScore = (b.brand === current.brand ? 2 : 0) + (b.body_type === current.body_type ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, limit);
  },

  createVehicle(input: Omit<Vehicle, "id" | "slug" | "created_at" | "sold">): Vehicle {
    const db = ensureDbFile();
    const id = `veh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const slugBase = `${input.brand}-${input.model}-${input.year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = `${slugBase}-${id.slice(-4)}`;

    const newVehicle: Vehicle = {
      ...input,
      id,
      slug,
      sold: input.status === "Sold",
      cover_photo: input.cover_photo || input.photo_urls[0] || "",
      created_at: new Date().toISOString(),
    };

    db.vehicles.unshift(newVehicle);
    writeDbFile(db);
    return newVehicle;
  },

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const db = ensureDbFile();
    const index = db.vehicles.findIndex((v) => v.id === id);
    if (index === -1) return null;

    const existing = db.vehicles[index];
    const updated: Vehicle = {
      ...existing,
      ...updates,
      id: existing.id,
      slug: existing.slug,
      sold: updates.status ? updates.status === "Sold" : existing.sold,
      cover_photo: updates.cover_photo || updates.photo_urls?.[0] || existing.cover_photo,
      updated_at: new Date().toISOString(),
    };

    db.vehicles[index] = updated;
    writeDbFile(db);
    return updated;
  },

  deleteVehicle(id: string): boolean {
    const db = ensureDbFile();
    const initialLen = db.vehicles.length;
    db.vehicles = db.vehicles.filter((v) => v.id !== id);
    if (db.vehicles.length !== initialLen) {
      writeDbFile(db);
      return true;
    }
    return false;
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    const db = ensureDbFile();
    return [...db.enquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createEnquiry(input: CreateEnquiryInput): Enquiry {
    const db = ensureDbFile();
    const newEnquiry: Enquiry = {
      ...input,
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      status: "New",
    };

    db.enquiries.unshift(newEnquiry);
    writeDbFile(db);
    return newEnquiry;
  },

  updateEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): Enquiry | null {
    const db = ensureDbFile();
    const enq = db.enquiries.find((e) => e.id === id);
    if (!enq) return null;

    enq.status = status;
    if (notes !== undefined) {
      enq.notes = notes;
    }

    writeDbFile(db);
    return enq;
  },

  getDashboardMetrics() {
    const db = ensureDbFile();
    const total = db.vehicles.length;
    const available = db.vehicles.filter((v) => v.status === "Available").length;
    const reserved = db.vehicles.filter((v) => v.status === "Reserved").length;
    const sold = db.vehicles.filter((v) => v.status === "Sold").length;
    const archived = db.vehicles.filter((v) => v.status === "Archived").length;
    const newEnquiries = db.enquiries.filter((e) => e.status === "New").length;
    const totalEnquiries = db.enquiries.length;

    return {
      total,
      available,
      reserved,
      sold,
      archived,
      newEnquiries,
      totalEnquiries,
      recentVehicles: db.vehicles.slice(0, 5),
      recentEnquiries: db.enquiries.slice(0, 5),
    };
  },
};
