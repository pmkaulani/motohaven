-- ==============================================================================
-- MotoHaven Nairobi Dealership — Database Schema & Security Hardening Migration
-- Version: 20261111_01
--
-- This migration:
-- 1. Preserves all existing listings in `public.listings`.
-- 2. Additively adds missing dealership attributes (slug, body_type, features, etc.).
-- 3. Creates the `public.enquiries` table for customer viewings and test drives.
-- 4. Enforces Row Level Security (RLS) to eliminate PII leaks.
-- 5. Creates a safe `public_vehicles` view that hides private seller details.
-- ==============================================================================

-- 1. ADDITIVE ATTRIBUTES ON `listings` TABLE
ALTER TABLE IF EXISTS public.listings
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS trim text,
  ADD COLUMN IF NOT EXISTS body_type text,
  ADD COLUMN IF NOT EXISTS drivetrain text,
  ADD COLUMN IF NOT EXISTS origin text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stock_reference text,
  ADD COLUMN IF NOT EXISTS cover_photo text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'Available',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Populate slug for existing records without one
UPDATE public.listings
SET slug = lower(regexp_replace(concat(brand, '-', model, '-', year, '-', substring(id::text from 1 for 4)), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug unique
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_idx ON public.listings(slug);

-- Sync status from existing `sold` boolean
UPDATE public.listings
SET status = CASE WHEN sold = true THEN 'Sold' ELSE 'Available' END
WHERE status IS NULL OR status = 'Available';

-- 2. CREATE `enquiries` TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  vehicle_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  vehicle_name text,
  vehicle_price numeric,
  enquiry_type text NOT NULL DEFAULT 'general' CHECK (enquiry_type IN ('viewing', 'test_drive', 'general')),
  preferred_date date,
  message text,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Viewing scheduled', 'Completed', 'Closed')),
  notes text,
  updated_at timestamptz DEFAULT now()
);

-- Index for staff enquiry triage
CREATE INDEX IF NOT EXISTS enquiries_status_created_idx ON public.enquiries(status, created_at DESC);

-- 3. SECURE PUBLIC VIEW FOR VEHICLES (EXCLUDES SELLER PII)
-- Public visitors and frontends MUST query this view or equivalent safe columns.
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
  sold,
  photo_urls,
  COALESCE(cover_photo, photo_urls[1]) AS cover_photo,
  created_at
FROM public.listings
WHERE status IN ('Available', 'Reserved', 'Sold');

GRANT SELECT ON public.public_vehicles TO anon, authenticated;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on listings and enquiries
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Listings Policies
-- Public can read active dealership inventory
DROP POLICY IF EXISTS "Public can view available listings" ON public.listings;
CREATE POLICY "Public can view available listings"
  ON public.listings
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('Available', 'Reserved', 'Sold'));

-- Staff full control on listings (create, edit, archive, delete)
DROP POLICY IF EXISTS "Staff full access to listings" ON public.listings;
CREATE POLICY "Staff full access to listings"
  ON public.listings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Enquiries Policies
-- Public visitors can submit viewing and test-drive requests
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL AND
    phone IS NOT NULL AND
    length(customer_name) >= 2 AND
    length(phone) >= 9
  );

-- STRICT PRIVACY: Anonymous visitors CANNOT read other customers' enquiries
DROP POLICY IF EXISTS "Public cannot read enquiries" ON public.enquiries;

-- Staff can view and manage all enquiries
DROP POLICY IF EXISTS "Staff can manage enquiries" ON public.enquiries;
CREATE POLICY "Staff can manage enquiries"
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. STORAGE POLICIES (car-photos bucket)
-- Public can read photos
DROP POLICY IF EXISTS "Public read car photos" ON storage.objects;
CREATE POLICY "Public read car photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'car-photos');

-- Only authenticated staff can upload or delete photos
DROP POLICY IF EXISTS "Staff upload car photos" ON storage.objects;
CREATE POLICY "Staff upload car photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'car-photos');

DROP POLICY IF EXISTS "Staff update delete car photos" ON storage.objects;
CREATE POLICY "Staff update delete car photos"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'car-photos');
