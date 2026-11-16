import { NextRequest, NextResponse } from "next/server";
import { EnquiriesRepository } from "@/lib/repositories/enquiries";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";
import { CreateEnquirySchema } from "@/lib/validations/enquiry";

// In-memory rate limiter per IP / phone: max 5 requests per 10 minutes (Finding R5)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function pruneRateLimitMap(): void {
  const now = Date.now();
  if (rateLimitMap.size > 1000) {
    rateLimitMap.forEach((val, key) => {
      if (now > val.resetAt) {
        rateLimitMap.delete(key);
      }
    });
  }
}

function isRateLimited(key: string): boolean {
  pruneRateLimitMap();
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;

  const record = rateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP and Phone (Finding R5)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = req.ip ?? req.headers.get("x-real-ip") ?? (forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1");

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many enquiries submitted. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Bot prevention: Honeypot check (Defect D6)
    const honeypot = body?.honeypot || body?.hp_contact;
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({ error: "Bot submission detected." }, { status: 400 });
    }

    // 3. Schema validation with Zod (Finding R6)
    const parseResult = CreateEnquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid enquiry submission.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    // Rate limit by phone number
    if (isRateLimited(validData.phone)) {
      return NextResponse.json(
        { error: "Too many enquiries submitted for this phone number. Please wait a few minutes." },
        { status: 429 }
      );
    }

    // 4. Delegate to repository (enforces server-side vehicle resolution, status=New, notes=null)
    const enquiry = await EnquiriesRepository.createPublicEnquiry({
      customer_name: validData.customer_name,
      phone: validData.phone,
      email: validData.email || undefined,
      vehicle_id: validData.vehicle_id,
      enquiry_type: validData.enquiry_type,
      preferred_date: validData.preferred_date,
      preferred_time: validData.preferred_time,
      message: validData.message,
      honeypot: validData.honeypot || validData.hp_contact,
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit enquiry" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Staff-only protected read endpoint
  try {
    const session = requireStaff(req);
    const enquiries = await EnquiriesRepository.getStaffEnquiries(session);
    return NextResponse.json({ enquiries });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
