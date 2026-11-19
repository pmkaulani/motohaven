import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";
import { CreateVehicleSchema } from "@/lib/validations/vehicle";

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

    // Finding R17: Clamp limit strictly between 1 and 50
    const rawLimit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;
    const limit = isNaN(rawLimit) ? 12 : Math.min(Math.max(rawLimit, 1), 50);

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
    const staff = requireStaff(req);

    // 2. Validate input with Zod schema (Finding R6)
    const body = await req.json();
    const parseResult = CreateVehicleSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid vehicle data.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const vehicleData: any = { ...parseResult.data };
    if (vehicleData.proof_records) {
      const records = vehicleData.proof_records;
      const nowIso = new Date().toISOString();
      const updatedProof: any = { ...records };
      const auditEntries: any[] = [];

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
      vehicleData.proof_records = updatedProof;
    }

    const vehicle = await VehiclesRepository.createVehicle(vehicleData);

    // Finding R15: On-demand cache revalidation
    revalidatePath("/cars");
    revalidatePath("/");

    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
