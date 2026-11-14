import { NextRequest, NextResponse } from "next/server";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";
import { VehicleCondition, Transmission, FuelType, VehicleStatus, BodyType } from "@/types/vehicle";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const body_type = searchParams.get("body_type") || undefined;
    const condition = searchParams.get("condition") || undefined;
    const transmission = searchParams.get("transmission") || undefined;
    const fuel = searchParams.get("fuel") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minYear = searchParams.get("minYear") ? Number(searchParams.get("minYear")) : undefined;
    const maxYear = searchParams.get("maxYear") ? Number(searchParams.get("maxYear")) : undefined;
    const sort = searchParams.get("sort") as any;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const data = await VehiclesRepository.getPublishedVehicles({
      q,
      brand,
      body_type,
      condition,
      transmission,
      fuel,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      sort,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Guard endpoint: staff only
    requireStaff(req);

    // 2. Validate input
    const body = await req.json();
    const {
      brand,
      model,
      trim,
      year,
      price,
      condition,
      engine_cc,
      transmission,
      fuel,
      mileage,
      body_type,
      drivetrain,
      origin,
      description,
      features,
      stock_reference,
      status,
      photo_urls,
      cover_photo,
      location,
      proof_records,
    } = body;

    if (!brand || !model || !year || !price) {
      return NextResponse.json(
        { error: "Make, model, year and price are required." },
        { status: 400 }
      );
    }

    const numYear = Number(year);
    const numPrice = Number(price);
    const numMileage = Number(mileage) || 0;
    const numEngineCc = Number(engine_cc) || 2000;

    if (isNaN(numYear) || numYear < 1980 || numYear > new Date().getFullYear() + 2) {
      return NextResponse.json({ error: "Invalid vehicle year." }, { status: 400 });
    }

    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json({ error: "Invalid vehicle price." }, { status: 400 });
    }

    const vehicle = await VehiclesRepository.createVehicle({
      brand: String(brand).trim(),
      model: String(model).trim(),
      trim: trim ? String(trim).trim() : undefined,
      year: numYear,
      price: numPrice,
      condition: (condition as VehicleCondition) || "Foreign Used",
      engine_cc: numEngineCc,
      transmission: (transmission as Transmission) || "Automatic",
      fuel: (fuel as FuelType) || "Petrol",
      mileage: numMileage,
      body_type: (body_type as BodyType) || "Saloon",
      drivetrain: drivetrain ? String(drivetrain).trim() : undefined,
      origin: origin ? String(origin).trim() : undefined,
      description: description ? String(description).trim() : undefined,
      features: Array.isArray(features) ? features.map(String) : [],
      stock_reference: stock_reference ? String(stock_reference).trim() : undefined,
      status: (status as VehicleStatus) || "Available",
      photo_urls: Array.isArray(photo_urls) && photo_urls.length > 0 ? photo_urls : ["/images/car-placeholder.jpg"],
      cover_photo: cover_photo || (photo_urls && photo_urls[0]) || "/images/car-placeholder.jpg",
      location: location || "Nairobi Showroom",
      proof_records: proof_records || undefined,
    });

    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
