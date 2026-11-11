# MotoHaven — Nairobi Dealership Website & Staff Portal

MotoHaven is a production-ready website and inventory management system built specifically for an independent car dealership located on Ngong Road, Nairobi, Kenya.

---

## 🚗 Features Overview

### 1. Customer Website
- **Homepage (`/`):**
  - Brand-consistent light neutral design (white surfaces, `#F6F6F5` sections, `#292C2E` charcoal text).
  - Hero showcasing genuine showroom vehicle with live price and specs.
  - Multi-parameter vehicle search (Make, Model, Body Type, Budget in KSh).
  - Available stock grid (3-column desktop, 2-column tablet, 1-column mobile).
  - Factual "Why MotoHaven" and Nairobi showroom coordinates.
- **Inventory Catalog (`/cars`):**
  - Keyword search and combinable filters (Make, Body Type, Condition, Transmission, Fuel, Year range, Price range).
  - Responsive filter drawer on mobile with active filter chips and one-click reset.
  - Shareable URL parameters (`/cars?body_type=SUV&maxPrice=5000000`).
  - Six sorting options (Recently added, Price Low/High, Year New/Old, Lowest Mileage).
- **Dedicated Vehicle Pages (`/cars/[slug]`):**
  - High-resolution gallery with thumbnail switcher and full-screen lightbox.
  - Complete technical specifications table (engine cc, transmission, fuel, drivetrain, origin, condition).
  - Pre-filled WhatsApp button identifying exact vehicle and price.
  - In-person viewing & test-drive booking modal with Kenyan phone validation (07, 01, +254).
  - Similar vehicles from actual available stock.
  - Sticky desktop enquiry panel and fixed mobile bottom action bar.
- **About Us (`/about`) & Contact (`/contact`):**
  - Nairobi showroom hours, map coordinates, direct phone/WhatsApp desk, and customer lead form.

### 2. Dealership Administration Portal (`/admin`)
- **Staff Sign In (`/admin/login`):**
  - Secure staff portal authentication.
  - Default local test credentials: `admin@motohaven.co.ke` / `motohaven2026`.
- **Operations Dashboard (`/admin`):**
  - Real-time stock counts: Total Stock, Available, Reserved, Sold, New Enquiries.
  - Recent inventory additions and incoming customer leads.
- **Inventory Management (`/admin/cars`):**
  - Interactive inventory table with inline status dropdown (`Available`, `Reserved`, `Sold`, `Draft`, `Archived`).
  - Add new vehicles (`/admin/cars/new`) and edit existing vehicles (`/admin/cars/[id]/edit`).
  - High-resolution multi-photo uploader with drag-and-drop, star-to-set cover image, and photo reordering.
- **Customer Enquiries Inbox (`/admin/enquiries`):**
  - Manage viewing and test-drive requests.
  - Status pipeline (`New`, `Contacted`, `Viewing scheduled`, `Completed`, `Closed`).
  - Direct call and WhatsApp buttons for rapid customer follow-up.

---

## 💻 Running Locally

### Prerequisites
- Node.js v18+ (tested on Node.js v22)
- npm v9+

### Quick Start
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run local development server
npm run dev

# 3. Or run production build
npm run build
npm run start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🗄️ Local Database & Testing

- The local database is stored at **`data/motohaven_db.json`**.
- It is pre-seeded with:
  - The **2 verified live BMW listings** from Supabase with their real Supabase storage photos.
  - Realistic Nairobi showroom inventory (Toyota Land Cruiser Prado TX, Mazda CX-5, Subaru Outback, Mercedes-Benz C200, Toyota Harrier).
  - Test customer enquiries.
- Any changes made in the admin portal (adding cars, changing prices, updating statuses) or via the enquiry forms persist immediately to `data/motohaven_db.json`.

---

## 🔒 Supabase Production Migration

When you are ready to apply database schema and Row Level Security to your live Supabase project:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/dfswwtrwoyqzirmyeqht).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the contents of:
   `supabase/migrations/20261111_01_motohaven_schema.sql`
4. Run the query.

### What the Migration Does:
1. **Preserves Existing Stock:** Safely adds missing columns to `listings` without dropping any data.
2. **Creates `enquiries` Table:** Stores viewing and test-drive leads securely.
3. **Eliminates Seller PII Leaks:** Creates `public_vehicles` view and RLS policies ensuring anonymous users cannot view private seller contacts or other customers' enquiries.
4. **Protects Storage:** Restricts upload and delete operations on `car-photos` to authenticated staff only.

---

## 📁 Repository Structure

```text
├── app/
│   ├── page.tsx                    # Nairobi Dealership Homepage
│   ├── layout.tsx                  # Root layout & SEO metadata
│   ├── globals.css                 # Tailwind directives & design tokens
│   ├── cars/
│   │   ├── page.tsx                # Inventory catalog with filters & sorting
│   │   └── [slug]/page.tsx         # Dedicated vehicle detail & gallery
│   ├── about/page.tsx              # About MotoHaven
│   ├── contact/page.tsx            # Contact, showroom hours & lead form
│   ├── admin/
│   │   ├── layout.tsx              # Staff sub-bar & navigation
│   │   ├── page.tsx                # Operations dashboard
│   │   ├── login/page.tsx          # Staff login
│   │   ├── cars/
│   │   │   ├── page.tsx            # Vehicle inventory table
│   │   │   ├── new/page.tsx        # Add vehicle
│   │   │   └── [id]/edit/page.tsx  # Edit vehicle
│   │   └── enquiries/page.tsx      # Customer leads inbox
│   └── api/
│       ├── vehicles/               # GET & POST vehicles
│       ├── vehicles/[id]/          # GET, PATCH & DELETE vehicle
│       ├── enquiries/              # GET & POST enquiries
│       ├── enquiries/[id]/         # PATCH enquiry status
│       ├── auth/                   # Staff login/logout session
│       └── upload/                 # Local high-res photo upload
├── components/
│   ├── navigation/                 # Header & mobile drawer
│   ├── layout/                     # Light footer
│   ├── homepage/                   # Hero, QuickSearch, Categories, WhyMotoHaven
│   ├── inventory/                  # Search & filter drawer
│   ├── vehicle/                    # VehicleCard, VehicleGallery, EnquiryModal
│   └── admin/                      # VehicleForm, StatusUpdaters
├── data/
│   └── motohaven_db.json           # Local test database
├── lib/
│   ├── config/dealership.ts        # Dealership details, KSh & phone formatters
│   ├── db/local-db.ts              # Local database engine & queries
│   └── supabase/client.ts          # Supabase client connector
├── supabase/
│   └── migrations/                 # Production SQL migration scripts
└── legacy/                         # Preserved original files (index.html, etc.)
```
