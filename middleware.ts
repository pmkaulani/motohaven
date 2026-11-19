import { NextRequest, NextResponse } from "next/server";

function getMiddlewareSecret(): string {
  const secret = process.env.STAFF_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV !== "production") {
    return "motohaven-local-dev-hmac-secret-key-min32chars";
  }
  return "";
}

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signatureHex] = parts;
  const secret = getMiddlewareSecret();
  if (!secret) return false;

  try {
    // 1. Verify HMAC with Web Crypto API
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const expectedSigBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadB64)
    );

    const expectedHex = Array.from(new Uint8Array(expectedSigBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedHex !== signatureHex) {
      return false;
    }

    // 2. Verify payload expiry and role
    const binaryStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(binaryStr);
    const now = Math.floor(Date.now() / 1000);

    if (!payload.expiresAt || payload.expiresAt < now) {
      return false;
    }

    if (payload.role !== "dealership_staff") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. CSRF Origin Verification on state-changing API and Form submissions
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host") || req.nextUrl.host;
    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "Cross-site request forgery detected. Request rejected." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: "Invalid origin header." }, { status: 403 });
      }
    }
  }

  // 2. Intercept all /admin routes except the public login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("motohaven_staff_session")?.value;
    const isRsc = req.headers.get("rsc") === "1";
    const isValid = await verifyToken(token);

    if (!isValid) {
      if (isRsc) {
        // Return 307 redirect with NO streamed data
        const loginUrl = new URL("/admin/login", req.url);
        return NextResponse.redirect(loginUrl, 307);
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
