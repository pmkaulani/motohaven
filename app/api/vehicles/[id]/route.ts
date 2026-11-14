import { NextRequest, NextResponse } from "next/server";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { requireStaff, getStaffSession, handleAuthError } from "@/lib/auth/guards";
import { Vehicle } from "@/types/vehicle";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isStaff = !!getStaffSession(req);

    let vehicle: Vehicle | null = null;
    if (isStaff) {
      vehicle = await VehiclesRepository.getStaffVehicleById(params.id);
    } else {
      vehicle = await VehiclesRepository.getPublishedVehicleBySlug(params.id);
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Guard endpoint: staff only
    requireStaff(req);

    // 2. Strict allowlist - NEVER spread raw body into record
    const body = await req.json();
    const allowedKeys = [
      "brand",
      "model",
      "trim",
      "year",
      "price",
      "condition",
      "engine_cc",
      "transmission",
      "fuel",
      "mileage",
      "body_type",
      "drivetrain",
      "origin",
      "description",
      "features",
      "stock_reference",
      "status",
      "sold",
      "photo_urls",
      "cover_photo",
      "location",
      "proof_records",
    ];

    const safeUpdates: Partial<Vehicle> = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        safeUpdates[key as keyof Vehicle] = body[key];
      }
    }

    if (safeUpdates.price !== undefined) {
      safeUpdates.price = Number(safeUpdates.price);
      if (isNaN(safeUpdates.price) || safeUpdates.price <= 0) {
        return NextResponse.json({ error: "Invalid vehicle price" }, { status: 400 });
      }
    }

    if (safeUpdates.year !== undefined) {
      safeUpdates.year = Number(safeUpdates.year);
    }

    const updated = await VehiclesRepository.updateVehicle(params.id, safeUpdates);
    if (!updated) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error updating vehicle:", error);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Guard endpoint: staff only
    requireStaff(req);

    const success = await VehiclesRepository.deleteVehicle(params.id);
    if (!success) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
