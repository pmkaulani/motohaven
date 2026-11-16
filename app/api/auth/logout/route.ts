import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, revokeStaffSessionToken } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    revokeStaffSessionToken(token);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
