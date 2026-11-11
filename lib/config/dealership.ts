export const DEALERSHIP_CONFIG = {
  name: "MotoHaven",
  tagline: "Quality Vehicles in Nairobi",
  description: "MotoHaven is an independent car dealership located in Nairobi, Kenya, offering carefully inspected, verified vehicles with direct viewing and honest service.",
  address: "Ngong Road, Karen / Kilimani Corridor, Nairobi, Kenya",
  city: "Nairobi",
  country: "Kenya",
  phone: process.env.NEXT_PUBLIC_DEALERSHIP_PHONE || "+254 798 328039",
  whatsapp: process.env.NEXT_PUBLIC_DEALERSHIP_WHATSAPP || "+254 737 317386",
  email: process.env.NEXT_PUBLIC_DEALERSHIP_EMAIL || "sales@motohaven.co.ke",
  hours: {
    weekdays: "8:00 AM – 6:00 PM",
    saturday: "9:00 AM – 5:00 PM",
    sunday: "Closed (Viewings by appointment)",
  },
  social: {
    facebook: "https://facebook.com/motohavenke",
    instagram: "https://instagram.com/motohavenke",
    twitter: "https://twitter.com/motohavenke",
  },
};

/**
 * Format raw number to Kenyan Shillings display (e.g. KSh 2,500,000)
 */
export function formatKSh(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "KSh 0";
  return `KSh ${Number(amount).toLocaleString("en-KE")}`;
}

/**
 * Normalise any Kenyan phone (0712..., +254712..., 254712...) to standard international digits (254712...)
 */
export function toKenyanInternationalDigits(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

/**
 * Validate standard Kenyan phone number format
 * Accepts: 07..., 01..., +2547..., +2541...
 */
export function isValidKenyanPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(?:(?:\+254)|(?:254)|(?:0))[17]\d{8}$/.test(cleaned);
}

/**
 * Generate official WhatsApp pre-filled chat link for a specific vehicle
 */
export function buildVehicleWhatsAppUrl(vehicle: {
  brand: string;
  model: string;
  year: number;
  price: number;
  stock_reference?: string;
}): string {
  const targetNumber = toKenyanInternationalDigits(DEALERSHIP_CONFIG.whatsapp);
  const refText = vehicle.stock_reference ? ` (Ref: ${vehicle.stock_reference})` : "";
  const message = `Hello MotoHaven, I am interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model}${refText} listed for ${formatKSh(vehicle.price)}. Is it currently available for viewing in Nairobi?`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate general WhatsApp contact link
 */
export function buildGeneralWhatsAppUrl(message?: string): string {
  const targetNumber = toKenyanInternationalDigits(DEALERSHIP_CONFIG.whatsapp);
  const text = message || `Hello MotoHaven, I would like to enquire about your available inventory in Nairobi.`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}
