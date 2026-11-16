-- MotoHaven Dealership Schema Migration & Row Level Security (RLS) Hardening
-- Version: 20261111_01_motohaven_schema
-- Description:
--   1. Ensures base listings table exists for fresh projects.
--   2. Adds staff membership table and is_staff() security definer function with explicit search_path.
--   3. Enforces RLS: blocks public SELECT on base listings table; public must use public_vehicles view.
--   4. Replaces broad 'TO authenticated USING (true)' with explicit is_staff() checks.
--   5. Restricts public enquiry inserts (forces status = 'New' and notes IS NULL).
--   6. Hardens storage policies for 'car-photos' bucket to verified staff only.

-- 1. BASE LISTINGS TABLE (If not already present from initial setup)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  condition TEXT NOT NULL DEFAULT 'Foreign Used',
  engine_cc INTEGER NOT NULL DEFAULT 2000,
  transmission TEXT NOT NULL DEFAULT 'Automatic',
  fuel TEXT NOT NULL DEFAULT 'Petrol',
  mileage INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT 'Nairobi Showroom',
  seller_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. STAFF MEMBERSHIP TABLE
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Only authenticated staff can see staff directory (Hardened search_path)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff WHERE staff.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

DROP POLICY IF EXISTS "Staff can read staff members" ON public.staff;
CREATE POLICY "Staff can read staff members"
  ON public.staff
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- 3. ADDITIVE SCHEMA COLUMNS TO 'listings'
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS body_type TEXT,
  ADD COLUMN IF NOT EXISTS drivetrain TEXT,
  ADD COLUMN IF NOT EXISTS origin TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS features TEXT[],
  ADD COLUMN IF NOT EXISTS stock_reference TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Available',
  ADD COLUMN IF NOT EXISTS cover_photo TEXT,
  ADD COLUMN IF NOT EXISTS proof_records JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Backfill slugs for existing records if null (Replaces whitespace with dashes)
UPDATE public.listings
SET slug = lower(replace(regexp_replace(concat_ws('-', brand, model, year, substring(id::text, 1, 4)), '\s+', '-', 'g'), '--', '-'))
WHERE slug IS NULL;

-- 4. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  vehicle_name TEXT,
  vehicle_price NUMERIC,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  enquiry_type TEXT NOT NULL DEFAULT 'Viewing',
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Viewing scheduled', 'Completed', 'Closed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ
);

-- 5. SECURE PUBLIC VIEW FOR VEHICLES (EXCLUDES SELLER PII)
-- Public visitors and frontends MUST query this view.
-- Excludes seller_name, phone, whatsapp.
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
WHERE status IN ('Available', 'Reserved');

GRANT SELECT ON public.public_vehicles TO anon, authenticated;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- STRICT: Drop public SELECT on base listings table (Fixes Finding 6)
-- Public frontend MUST query public_vehicles view.
DROP POLICY IF EXISTS "Public can view available listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public read access to active listings" ON public.listings;

-- Staff full control on listings (Requires is_staff(), Fixes Finding 7)
DROP POLICY IF EXISTS "Staff full access to listings" ON public.listings;
CREATE POLICY "Staff full access to listings"
  ON public.listings
  FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Enquiries Policies
-- Public visitors can submit enquiries, but CANNOT forge status or notes (Fixes Finding 12)
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL AND
    phone IS NOT NULL AND
    length(customer_name) >= 2 AND
    length(customer_name) <= 100 AND
    length(phone) >= 9 AND
    length(phone) <= 30 AND
    status = 'New' AND
    notes IS NULL
  );

-- STRICT PRIVACY: Anonymous visitors CANNOT read enquiries
DROP POLICY IF EXISTS "Public cannot read enquiries" ON public.enquiries;

-- Staff can view and manage all enquiries (Requires is_staff())
DROP POLICY IF EXISTS "Staff can manage enquiries" ON public.enquiries;
CREATE POLICY "Staff can manage enquiries"
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 7. STORAGE POLICIES (car-photos bucket)
-- Public can read car photos
DROP POLICY IF EXISTS "Public read car photos" ON storage.objects;
CREATE POLICY "Public read car photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'car-photos');

-- Only verified staff can upload photos (Requires is_staff())
DROP POLICY IF EXISTS "Staff upload car photos" ON storage.objects;
CREATE POLICY "Staff upload car photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'car-photos' AND public.is_staff());

-- Only verified staff can update or delete photos (Requires is_staff())
DROP POLICY IF EXISTS "Staff update delete car photos" ON storage.objects;
CREATE POLICY "Staff update delete car photos"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'car-photos' AND public.is_staff());
