import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { getStaffSession } from "@/lib/auth/guards";
import { formatKSh } from "@/lib/config/dealership";
import { PlusCircle, ExternalLink, Edit } from "lucide-react";
import { VehicleStatusUpdater } from "@/components/admin/VehicleStatusUpdater";

export const revalidate = 0; // Dynamic server query

export default async function AdminCarsPage() {
  const session = getStaffSession();
  if (!session) {
    redirect("/admin/login");
  }
  const vehicles = await VehiclesRepository.getAllStaffVehicles(session);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Vehicle Inventory Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Total of {vehicles.length} vehicles registered in dealership stock.
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors self-start sm:self-auto min-h-[40px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Mobile Stacked View (< 768px): No horizontal overflow, touch friendly */}
      <div className="md:hidden divide-y divide-border border border-border bg-white">
        {vehicles.map((car) => (
          <div key={car.id} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={car.cover_photo || car.photo_urls[0]}
                alt={car.model}
                className="w-20 h-16 object-cover bg-background-secondary shrink-0 border border-border"
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/cars/${car.id}/edit`}
                  className="font-bold text-sm text-text-primary hover:underline truncate block"
                >
                  {car.year} {car.brand} {car.model}
                </Link>
                <p className="text-xs text-text-secondary">
                  {car.mileage.toLocaleString("en-KE")} km · {car.transmission} · {car.fuel}
                </p>
                <p className="text-sm font-extrabold text-text-primary mt-1">
                  {formatKSh(car.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-subtle gap-2">
              <div>
                <VehicleStatusUpdater
                  vehicleId={car.id}
                  currentStatus={car.status}
                />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/cars/${car.slug}`}
                  target="_blank"
                  className="p-2 text-text-secondary hover:text-text-primary border border-field min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label={`View ${car.brand} ${car.model} on public site`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/cars/${car.id}/edit`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-action text-white text-xs font-semibold hover:bg-action-hover min-h-[36px]"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table (>= 768px) */}
      <div className="hidden md:block bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-secondary border-b border-border text-text-secondary font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Year & Specs</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Photos</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((car) => (
                <tr key={car.id} className="hover:bg-background-secondary/40 transition-colors">
                  {/* Vehicle Name & Image */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={car.cover_photo || car.photo_urls[0]}
                        alt={car.model}
                        className="w-14 h-10 object-cover bg-background-secondary shrink-0 border border-border"
                      />
                      <div>
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="font-bold text-text-primary hover:underline block leading-tight text-sm"
                        >
                          {car.brand} {car.model}
                        </Link>
                        <span className="text-[11px] text-text-secondary">
                          {car.trim || car.condition}
                        </span>
                        {car.stock_reference && (
                          <span className="text-[10px] font-mono text-text-secondary block">
                            Ref: {car.stock_reference}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Year & Specs */}
                  <td className="py-3.5 px-4 text-text-secondary">
                    <p className="font-semibold text-text-primary">{car.year}</p>
                    <p>{car.mileage.toLocaleString("en-KE")} km • {car.transmission}</p>
                    <p>{car.engine_cc}cc • {car.fuel}</p>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-primary text-sm">
                      {formatKSh(car.price)}
                    </span>
                  </td>

                  {/* Status Updater Component */}
                  <td className="py-3.5 px-4">
                    <VehicleStatusUpdater
                      vehicleId={car.id}
                      currentStatus={car.status}
                    />
                  </td>

                  {/* Photos count */}
                  <td className="py-3.5 px-4 text-text-secondary">
                    <span>{car.photo_urls?.length || 0} photos</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/cars/${car.slug}`}
                      target="_blank"
                      className="p-1.5 inline-flex text-text-secondary hover:text-text-primary hover:bg-background-secondary min-w-[32px] min-h-[32px] items-center justify-center"
                      title="View on Public Website"
                      aria-label={`View ${car.brand} ${car.model} publicly`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/admin/cars/${car.id}/edit`}
                      className="p-1.5 inline-flex text-text-secondary hover:text-text-primary hover:bg-background-secondary min-w-[32px] min-h-[32px] items-center justify-center"
                      title="Edit Vehicle Details"
                      aria-label={`Edit ${car.brand} ${car.model}`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
