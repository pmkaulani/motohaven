import crypto from "crypto";

const SESSION_COOKIE_NAME = "motohaven_staff_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Use configured secret or derive a fallback based on machine-environment
function getSessionSecret(): string {
  const secret = process.env.STAFF_SESSION_SECRET || process.env.STAFF_ADMIN_PASSWORD;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // Deterministic local development fallback; logs warning in production
  if (process.env.NODE_ENV === "production" && !process.env.STAFF_SESSION_SECRET) {
    console.warn("[SECURITY WARNING] STAFF_SESSION_SECRET is not configured in production environment!");
  }
  return secret || "motohaven-local-dev-hmac-secret-key-32b";
}

export interface StaffSessionPayload {
  email: string;
  role: "dealership_staff";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed HMAC session token.
 * Token format: base64(payload).hex(hmacSignature)
 */
export function createStaffSessionToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: StaffSessionPayload = {
    email,
    role: "dealership_staff",
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("hex");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a signed HMAC session token.
 * Returns payload if valid and unexpired; returns null otherwise.
 */
export function verifyStaffSessionToken(token: string | undefined | null): StaffSessionPayload | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadB64, signature] = parts;

  // Constant-time HMAC comparison
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload: StaffSessionPayload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.expiresAt || payload.expiresAt < now) {
      return null;
    }

    if (payload.role !== "dealership_staff") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
