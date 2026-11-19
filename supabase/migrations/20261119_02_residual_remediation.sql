-- MotoHaven Residual Remediation Schema Patch
-- Version: 20261119_02_residual_remediation
-- Description:
--   1. Updates public_vehicles view to include Sold listings (Defect D3 / Residual Spec Section 2).
--   2. Adds staff_sessions table for distributed, multi-instance session revocation by token hash.
--   3. Adds rate_limits table for atomic multi-replica enquiry & login rate-limiting.
--   4. Adds audit_logs table for tracking staff CRUD & proof verification actions.
--   5. Sets up private evidence storage bucket ('evidence-docs') policies.
--   6. Adds performance indexes for search, filtering, and foreign keys.

-- 1. UPDATE PUBLIC VIEW (ALLOWS SOLD DETAIL VISIBILITY)
CREATE OR REPLACE VIEW public.public_vehicles AS
SELECT
  id,
  slug,
  brand,
  model,
  trim,
  year,
  price,
  location,
  condition,
  engine_cc,
  transmission,
  fuel,
  mileage,
  body_type,
  drivetrain,
  origin,
  description,
  features,
  stock_reference,
  status,
  photo_urls,
  COALESCE(cover_photo, photo_urls[1]) AS cover_photo,
  proof_records,
  created_at
FROM public.listings
WHERE status IN ('Available', 'Reserved', 'Sold');

GRANT SELECT ON public.public_vehicles TO anon, authenticated;

-- 2. DISTRIBUTED STAFF SESSIONS & REVOCATIONS (By SHA-256 Token Hash)
CREATE TABLE IF NOT EXISTS public.staff_sessions (
  token_hash TEXT PRIMARY KEY,
  staff_email TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_staff_sessions_email ON public.staff_sessions(staff_email);
CREATE INDEX IF NOT EXISTS idx_staff_sessions_expires ON public.staff_sessions(expires_at);

ALTER TABLE public.staff_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff session access" ON public.staff_sessions;
CREATE POLICY "Staff session access"
  ON public.staff_sessions
  FOR ALL
  TO authenticated
  USING (public.is_staff());

-- 3. DISTRIBUTED RATE LIMITS (ATOMIC THROTTLING ACROSS REPLICAS)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Atomic increment function for rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_window_seconds INTEGER,
  p_max_requests INTEGER
)
RETURNS boolean AS $$
DECLARE
  v_now TIMESTAMPTZ := timezone('utc'::text, now());
  v_record RECORD;
BEGIN
  -- Clean up expired keys opportunistically
  DELETE FROM public.rate_limits WHERE reset_at < v_now - interval '1 hour';

  SELECT * INTO v_record FROM public.rate_limits WHERE key = p_key FOR UPDATE;

  IF NOT FOUND OR v_record.reset_at < v_now THEN
    INSERT INTO public.rate_limits (key, count, reset_at)
    VALUES (p_key, 1, v_now + (p_window_seconds || ' seconds')::interval)
    ON CONFLICT (key) DO UPDATE
    SET count = 1, reset_at = v_now + (p_window_seconds || ' seconds')::interval;
    RETURN true;
  END IF;

  IF v_record.count >= p_max_requests THEN
    RETURN false;
  END IF;

  UPDATE public.rate_limits
  SET count = count + 1
  WHERE key = p_key;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. STAFF AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff read audit logs" ON public.audit_logs;
CREATE POLICY "Staff read audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- 5. PRIVATE EVIDENCE STORAGE BUCKET POLICIES ('evidence-docs')
-- Strictly staff-only access. Anonymous visitors get zero access.
DROP POLICY IF EXISTS "Staff select private evidence" ON storage.objects;
CREATE POLICY "Staff select private evidence"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'evidence-docs' AND public.is_staff());

DROP POLICY IF EXISTS "Staff insert private evidence" ON storage.objects;
CREATE POLICY "Staff insert private evidence"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'evidence-docs' AND public.is_staff());

DROP POLICY IF EXISTS "Staff delete private evidence" ON storage.objects;
CREATE POLICY "Staff delete private evidence"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'evidence-docs' AND public.is_staff());

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_listings_slug ON public.listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_brand ON public.listings(brand);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_year ON public.listings(year);
CREATE INDEX IF NOT EXISTS idx_enquiries_vehicle_id ON public.enquiries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
