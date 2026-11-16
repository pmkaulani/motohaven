import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { requireStaff, getStaffSession, handleAuthError } from "@/lib/auth/guards";
import { UpdateVehicleSchema } from "@/lib/validations/vehicle";
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

    // 2. Validate input using Zod schema (Finding R6)
    const body = await req.json();
    const parseResult = UpdateVehicleSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid update parameters.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updated = await VehiclesRepository.updateVehicle(params.id, parseResult.data as any);
    if (!updated) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Finding R15: On-demand cache revalidation
    revalidatePath("/cars");
    revalidatePath("/");
    if (updated.slug) {
      revalidatePath(`/cars/${updated.slug}`);
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

    // Finding R15: On-demand cache revalidation
    revalidatePath("/cars");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
