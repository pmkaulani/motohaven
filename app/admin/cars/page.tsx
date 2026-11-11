import React from "react";
import Link from "next/link";
import { LocalDB } from "@/lib/db/local-db";
import { formatKSh } from "@/lib/config/dealership";
import { PlusCircle, ExternalLink, Edit } from "lucide-react";
import { VehicleStatusUpdater } from "@/components/admin/VehicleStatusUpdater";

export const revalidate = 0; // Dynamic server query

export default function AdminCarsPage() {
  const vehicles = LocalDB.getAllAdminVehicles();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-secondary border-b border-border text-text-secondary font-semibold uppercase tracking-wider text-[10px]">
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
                        className="w-14 h-10 object-cover rounded bg-background-tertiary shrink-0 border border-border"
                      />
                      <div>
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="font-bold text-text-primary hover:text-action block leading-tight"
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
                      className="p-1.5 inline-flex text-text-secondary hover:text-action hover:bg-background-secondary rounded"
                      title="View on Public Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/admin/cars/${car.id}/edit`}
                      className="p-1.5 inline-flex text-text-secondary hover:text-action hover:bg-background-secondary rounded"
                      title="Edit Vehicle Details"
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
