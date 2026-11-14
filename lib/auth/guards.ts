import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyStaffSessionToken,
  SESSION_COOKIE_NAME,
  StaffSessionPayload,
} from "./session";

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Reads and verifies the staff session from request cookies or Next.js cookies() store.
 */
export function getStaffSession(req?: NextRequest): StaffSessionPayload | null {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Called outside request context
      return null;
    }
  }

  return verifyStaffSessionToken(token);
}

/**
 * Shared staff authentication guard for API route handlers.
 * Throws AuthError(401) if unauthenticated or invalid session.
 * Throws AuthError(403) if authenticated user is not authorized staff.
 */
export function requireStaff(req: NextRequest): StaffSessionPayload {
  const session = getStaffSession(req);

  if (!session) {
    throw new AuthError("Authentication required: No valid staff session.", 401);
  }

  if (session.role !== "dealership_staff") {
    throw new AuthError("Forbidden: User does not possess dealership staff permissions.", 403);
  }

  return session;
}

/**
 * Convenience helper to return standard JSON error responses for AuthError.
 */
export function handleAuthError(error: unknown): NextResponse | null {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message, code: error.statusCode === 401 ? "UNAUTHORIZED" : "FORBIDDEN" },
      { status: error.statusCode }
    );
  }
  return null;
}
