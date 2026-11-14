import { NextRequest, NextResponse } from "next/server";
import { createStaffSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Server environment credentials
    const configuredStaffEmail = process.env.STAFF_ADMIN_EMAIL?.trim().toLowerCase();
    const configuredStaffPassword = process.env.STAFF_ADMIN_PASSWORD;

    // Strict validation: In production, environment credentials must be configured.
    // If not configured, reject with 500 configuration error, NEVER accept built-in backdoors.
    if (!configuredStaffEmail || !configuredStaffPassword) {
      if (process.env.NODE_ENV === "production") {
        console.error("[CRITICAL] Staff authentication attempted, but STAFF_ADMIN_EMAIL or STAFF_ADMIN_PASSWORD is not set.");
        return NextResponse.json(
          { error: "Staff authentication is not configured on this server." },
          { status: 500 }
        );
      }
    }

    // Local development fallback only when explicitly running non-production and env unset
    const validEmail = configuredStaffEmail || (process.env.NODE_ENV !== "production" ? "admin@motohaven.co.ke" : "");
    const validPassword = configuredStaffPassword || (process.env.NODE_ENV !== "production" ? "motohaven-local-dev-pass-2026" : "");

    // Constant-time check where possible
    const emailMatches = email === validEmail;
    const passwordMatches = password === validPassword;

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        { error: "Invalid staff credentials." },
        { status: 401 }
      );
    }

    // Issue cryptographic HMAC session token
    const token = createStaffSessionToken(email);

    const response = NextResponse.json({
      success: true,
      user: { email, role: "dealership_staff" },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Login processing error:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
