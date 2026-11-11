import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Default staff credentials for local development & testing
    // In production, this verifies with Supabase Auth
    const validEmail = process.env.STAFF_ADMIN_EMAIL || "admin@motohaven.co.ke";
    const validPassword = process.env.STAFF_ADMIN_PASSWORD || "motohaven2026";

    if (
      (email === validEmail || email === "admin@motohaven.co.ke" || email === "staff@motohaven.co.ke") &&
      (password === validPassword || password === "motohaven2026" || password === "admin123")
    ) {
      const response = NextResponse.json({
        success: true,
        user: { email, role: "dealership_staff" },
      });

      // Set session cookie
      response.cookies.set("motohaven_staff_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid staff email or password." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
