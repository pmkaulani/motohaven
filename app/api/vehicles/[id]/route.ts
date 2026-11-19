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
      vehicle =
        (await VehiclesRepository.getPublishedVehicleBySlug(params.id)) ||
        (await VehiclesRepository.getPublishedVehicleById(params.id));
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
    const staff = requireStaff(req);

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

    const updateData: any = { ...parseResult.data };
    if (updateData.proof_records) {
      const records = updateData.proof_records;
      const nowIso = new Date().toISOString();
      const existing = await VehiclesRepository.getStaffVehicleById(params.id);
      const auditEntries: any[] = Array.isArray(existing?.proof_records?.history)
        ? [...existing.proof_records.history]
        : [];

      const updatedProof: any = { ...existing?.proof_records, ...records };
      for (const [key, val] of Object.entries(records)) {
        if (val && typeof val === "object" && "status" in val && (val as any).status === "verified") {
          updatedProof[key] = {
            ...(val as any),
            checkedBy: staff.email,
            checkedAt: (val as any).checkedAt || nowIso,
          };
          auditEntries.push({
            timestamp: nowIso,
            actor: staff.email,
            action: "VERIFY_PROOF",
            field: key,
          });
        }
      }
      updatedProof.history = auditEntries;
      updateData.proof_records = updatedProof;
    }

    const updated = await VehiclesRepository.updateVehicle(params.id, updateData);
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
