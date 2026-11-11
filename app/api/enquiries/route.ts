import { NextRequest, NextResponse } from "next/server";
import { LocalDB } from "@/lib/db/local-db";
import { isValidKenyanPhone } from "@/lib/config/dealership";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, phone, email, vehicle_id, vehicle_name, vehicle_price, enquiry_type, preferred_date, message } = body;

    if (!customer_name || !phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    if (!isValidKenyanPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid Kenyan phone number format." },
        { status: 400 }
      );
    }

    const enquiry = LocalDB.createEnquiry({
      customer_name,
      phone,
      email,
      vehicle_id,
      vehicle_name,
      vehicle_price,
      enquiry_type: enquiry_type || "general",
      preferred_date,
      message,
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Staff / admin read endpoint
  try {
    const enquiries = LocalDB.getEnquiries();
    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
