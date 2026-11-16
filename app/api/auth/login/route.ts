import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createStaffSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

// Rate limiting: max 5 failed attempts per 15 minutes per IP/email (Finding R3)
const loginFailures = new Map<string, { count: number; lockedUntil: number }>();

function pruneLoginFailures(): void {
  const now = Date.now();
  if (loginFailures.size > 500) {
    loginFailures.forEach((val, key) => {
      if (now > val.lockedUntil) {
        loginFailures.delete(key);
      }
    });
  }
}

function checkRateLimit(key: string): boolean {
  pruneLoginFailures();
  const now = Date.now();
  const record = loginFailures.get(key);
  if (!record) return false;
  if (now > record.lockedUntil) {
    loginFailures.delete(key);
    return false;
  }
  return record.count >= 5;
}

function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const record = loginFailures.get(key);
  if (!record || now > record.lockedUntil) {
    loginFailures.set(key, { count: 1, lockedUntil: now + windowMs });
  } else {
    record.count += 1;
    record.lockedUntil = now + windowMs;
  }
}

function clearFailedAttempts(key: string): void {
  loginFailures.delete(key);
}

/**
 * Constant-time string comparison using fixed-length SHA-256 digests (Finding R3).
 */
function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = req.ip ?? req.headers.get("x-real-ip") ?? (forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1");

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    // Check rate limit by IP and by email
    if (checkRateLimit(ip) || (email && checkRateLimit(email))) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

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

    // Constant-time check using timingSafeEqual
    const emailMatches = safeCompare(email, validEmail);
    const passwordMatches = safeCompare(password, validPassword);

    if (!emailMatches || !passwordMatches) {
      recordFailedAttempt(ip);
      if (email) recordFailedAttempt(email);

      return NextResponse.json(
        { error: "Invalid staff credentials." },
        { status: 401 }
      );
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(ip);
    clearFailedAttempts(email);

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
