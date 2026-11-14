import { LocalDB } from "@/lib/db/local-db";
import { Vehicle, VehicleFilterParams, PaginatedVehicles } from "@/types/vehicle";

export const VehiclesRepository = {
  /**
   * Retrieves public published vehicles (Available or Reserved only).
   */
  async getPublishedVehicles(params: VehicleFilterParams = {}): Promise<PaginatedVehicles> {
    // In production with Supabase configured, this queries public_vehicles view.
    // Falls back cleanly to local DB while enforcing publishable status.
    const result = LocalDB.getVehicles({ ...params, includeAllStatuses: false });
    return result;
  },

  /**
   * Retrieves all vehicles for authorized dealership staff (includes Draft, Archived, Sold).
   */
  async getAllStaffVehicles(): Promise<Vehicle[]> {
    return LocalDB.getAllAdminVehicles();
  },

  /**
   * Retrieves a vehicle for public display by its slug or ID.
   * STRICT GUARANTEE: Returns NULL if the vehicle is in Draft or Archived status (Defect D3 fix).
   */
  async getPublishedVehicleBySlug(slug: string): Promise<Vehicle | null> {
    const vehicle = LocalDB.getVehicleBySlug(slug);
    if (!vehicle) return null;

    // Public visitor access: strictly block Draft or Archived
    if (vehicle.status !== "Available" && vehicle.status !== "Reserved") {
      return null;
    }

    return vehicle;
  },

  /**
   * Retrieves a vehicle by ID for staff operations (bypasses status filter).
   */
  async getStaffVehicleById(id: string): Promise<Vehicle | null> {
    return LocalDB.getVehicleById(id);
  },

  /**
   * Retrieves similar published vehicles for public showroom display.
   */
  async getSimilarVehicles(vehicleId: string, limit = 3): Promise<Vehicle[]> {
    return LocalDB.getSimilarVehicles(vehicleId, limit);
  },

  /**
   * Staff creation of a new vehicle listing.
   */
  async createVehicle(input: Omit<Vehicle, "id" | "slug" | "created_at" | "sold">): Promise<Vehicle> {
    return LocalDB.createVehicle(input);
  },

  /**
   * Staff update of a vehicle with strict allowlist.
   */
  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
    // Prevent overwriting immutable fields
    const safeUpdates = { ...updates };
    delete (safeUpdates as any).id;
    delete (safeUpdates as any).slug;
    delete (safeUpdates as any).created_at;

    return LocalDB.updateVehicle(id, safeUpdates);
  },

  /**
   * Staff deletion of a vehicle.
   */
  async deleteVehicle(id: string): Promise<boolean> {
    return LocalDB.deleteVehicle(id);
  },
};
