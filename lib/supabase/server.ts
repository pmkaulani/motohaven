import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverClient: SupabaseClient | null = null;

/**
 * Returns a server-only Supabase client.
 *
 * CRITICAL SECURITY CONSTRAINTS:
 * 1. Reads SUPABASE_SERVICE_ROLE_KEY exclusively on the server.
 * 2. Never exposed to browser or client components (no NEXT_PUBLIC_ prefix).
 * 3. In production, fails closed if credentials are missing.
 */
export function getServerSupabase(): SupabaseClient | null {
  if (serverClient) return serverClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL DATABASE CONFIGURATION ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in production."
      );
    }
    return null;
  }

  serverClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}

/**
 * Returns a restricted public Supabase client for reading published inventory.
 */
export function getPublicSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL DATABASE CONFIGURATION ERROR: Supabase public credentials must be configured in production."
      );
    }
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}
