import crypto from "crypto";

const SESSION_COOKIE_NAME = "motohaven_staff_session";
// Shortened session lifetime to 24 hours (Finding R12)
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

// Token hash revocation set (Finding R12 / Residual Section 5)
const revokedTokenHashes = new Set<string>();

/**
 * Computes a SHA-256 hash of a session token for secure storage & indexing.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Revokes a session token so it cannot be used again before natural expiry.
 * Stores only token hash, never raw token.
 */
export function revokeStaffSessionToken(token: string | undefined | null): void {
  if (!token || typeof token !== "string") return;
  const hash = hashToken(token);
  revokedTokenHashes.add(hash);
  const parts = token.split(".");
  if (parts.length === 2 && parts[1]) {
    revokedTokenHashes.add(parts[1]);
  }
}

/**
 * Checks whether a token has been revoked.
 */
export function isTokenRevoked(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return true;
  const hash = hashToken(token);
  if (revokedTokenHashes.has(hash)) return true;
  const parts = token.split(".");
  if (parts.length === 2 && parts[1] && revokedTokenHashes.has(parts[1])) return true;
  return false;
}

/**
 * Retrieves the cryptographic signing key for staff sessions (Finding R2).
 * STRICT SECURITY REQUIREMENT:
 * - In production: Refuses to start/sign unless STAFF_SESSION_SECRET is configured with >= 32 characters.
 * - Never reuses STAFF_ADMIN_PASSWORD as the HMAC key.
 */
function getSessionSecret(): string {
  const configuredSecret = process.env.STAFF_SESSION_SECRET?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!configuredSecret || configuredSecret.length < 32) {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION ERROR: STAFF_SESSION_SECRET must be configured with at least 32 random characters in production environment."
      );
    }
    return configuredSecret;
  }

  // Development/Test fallback only when NODE_ENV is not production
  if (configuredSecret && configuredSecret.length >= 32) {
    return configuredSecret;
  }

  return "motohaven-local-dev-hmac-secret-key-min32chars";
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
 * Returns payload if valid, unexpired and unrevoked; returns null otherwise.
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

  // Check revocation list
  if (isTokenRevoked(token)) {
    return null;
  }

  try {
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
