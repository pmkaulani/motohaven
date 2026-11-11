import { NextRequest, NextResponse } from "next/server";
import { LocalDB } from "@/lib/db/local-db";

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

    const data = LocalDB.getVehicles({
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
    } = body;

    if (!brand || !model || !year || !price) {
      return NextResponse.json(
        { error: "Make, model, year and price are required." },
        { status: 400 }
      );
    }

    const vehicle = LocalDB.createVehicle({
      brand,
      model,
      trim,
      year: Number(year),
      price: Number(price),
      condition: condition || "Foreign Used",
      engine_cc: Number(engine_cc) || 2000,
      transmission: transmission || "Automatic",
      fuel: fuel || "Petrol",
      mileage: Number(mileage) || 0,
      body_type: body_type || "Saloon",
      drivetrain,
      origin,
      description,
      features: features || [],
      stock_reference,
      status: status || "Available",
      photo_urls: photo_urls && photo_urls.length > 0 ? photo_urls : ["/images/car-placeholder.jpg"],
      cover_photo: cover_photo || (photo_urls ? photo_urls[0] : ""),
      location: location || "Nairobi Showroom",
    });

    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
