import { NextRequest, NextResponse } from "next/server";
import { EnquiriesRepository } from "@/lib/repositories/enquiries";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";
import { isValidKenyanPhone } from "@/lib/config/dealership";

// Simple in-memory rate limiter per IP: max 5 requests per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
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
    // 1. Rate limiting by IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many enquiries submitted. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      customer_name,
      phone,
      email,
      vehicle_id,
      enquiry_type,
      preferred_date,
      preferred_time,
      message,
      honeypot,
      hp_contact,
    } = body;

    // 2. Bot prevention: Honeypot check (Defect D6)
    if ((honeypot && String(honeypot).trim().length > 0) || (hp_contact && String(hp_contact).trim().length > 0)) {
      return NextResponse.json({ error: "Bot submission detected." }, { status: 400 });
    }

    // 3. Validate phone number format (Kenyan numbers)
    if (!phone || !isValidKenyanPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid Kenyan phone number (e.g. 0712 345 678 or +254 712 345 678)." },
        { status: 400 }
      );
    }

    // 3. Delegate to repository (enforces field caps, honeypot, server-side vehicle resolution, status=New, notes=null)
    const enquiry = await EnquiriesRepository.createPublicEnquiry({
      customer_name,
      phone,
      email,
      vehicle_id,
      enquiry_type,
      preferred_date,
      preferred_time,
      message,
      honeypot: honeypot || hp_contact,
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
    requireStaff(req);
    const enquiries = await EnquiriesRepository.getStaffEnquiries();
    return NextResponse.json({ enquiries });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
