import { NextRequest, NextResponse } from "next/server";
import { EnquiriesRepository } from "@/lib/repositories/enquiries";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";
import { EnquiryStatus } from "@/types/enquiry";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Guard endpoint: staff only
    requireStaff(req);

    const body = await req.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json({ error: "Enquiry status is required." }, { status: 400 });
    }

    const updated = await EnquiriesRepository.updateStaffEnquiryStatus(
      params.id,
      status as EnquiryStatus,
      typeof notes === "string" ? notes.trim() : undefined
    );

    if (!updated) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error updating enquiry:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update enquiry" },
      { status: 400 }
    );
  }
}
