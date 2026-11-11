import React from "react";
import Link from "next/link";
import { LocalDB } from "@/lib/db/local-db";
import { formatKSh } from "@/lib/config/dealership";
import { PlusCircle, ArrowRight } from "lucide-react";

export const revalidate = 0; // Dynamic server query

export default function AdminDashboardPage() {
  const metrics = LocalDB.getDashboardMetrics();

  return (
    <div className="space-y-10">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Dealership Operations
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of live Nairobi showroom inventory and customer enquiries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-white border border-border text-text-primary text-xs font-semibold hover:bg-background-secondary transition-colors"
          >
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Single Aligned Metrics Band (Anti-Card, No 5 Floating Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-card bg-white py-2">
        <div className="p-4 sm:p-5 text-center sm:text-left">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Stock</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">{metrics.total}</p>
          <p className="text-xs text-text-secondary mt-0.5">Vehicles in system</p>
        </div>

        <div className="p-4 sm:p-5 text-center sm:text-left">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Available</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{metrics.available}</p>
          <p className="text-xs text-text-secondary mt-0.5">On public website</p>
        </div>

        <div className="p-4 sm:p-5 text-center sm:text-left">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Reserved</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">{metrics.reserved}</p>
          <p className="text-xs text-text-secondary mt-0.5">Deposit held</p>
        </div>

        <div className="p-4 sm:p-5 text-center sm:text-left">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Sold Units</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">{metrics.sold}</p>
          <p className="text-xs text-text-secondary mt-0.5">Completed</p>
        </div>

        <div className="p-4 sm:p-5 text-center sm:text-left col-span-2 md:col-span-1">
          <p className="text-xs font-semibold text-action uppercase tracking-wider">New Enquiries</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-action mt-1">{metrics.newEnquiries}</p>
          <p className="text-xs text-text-secondary mt-0.5">Pending follow-up</p>
        </div>
      </div>

      {/* Grid: Recent Vehicles & Recent Enquiries (Clean Tables/Lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Recent Inventory Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-text-primary">
              Recent Inventory Additions
            </h2>
            <Link
              href="/admin/cars"
              className="text-xs font-semibold text-text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage all ({metrics.total})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {metrics.recentVehicles.map((car) => (
              <div key={car.id} className="py-3.5 flex items-center justify-between gap-4">
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
                      className="text-sm font-bold text-text-primary hover:underline block leading-tight"
                    >
                      {car.year} {car.brand} {car.model}
                    </Link>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {formatKSh(car.price)} · {car.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      car.status === "Available"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : car.status === "Reserved"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : car.status === "Sold"
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {car.status}
                  </span>
                  <Link
                    href={`/admin/cars/${car.id}/edit`}
                    className="text-xs font-medium text-text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-text-primary">
              Recent Leads & Viewing Requests
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-text-primary hover:underline flex items-center gap-1"
            >
              <span>Inbox ({metrics.totalEnquiries})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {metrics.recentEnquiries.length === 0 ? (
              <p className="text-sm text-text-secondary py-6 text-center">
                No customer enquiries yet.
              </p>
            ) : (
              metrics.recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text-primary">
                      {enq.customer_name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        enq.status === "New"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : enq.status === "Contacted"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {enq.phone} · {enq.vehicle_name || "General Enquiry"}
                  </p>
                  {enq.message && (
                    <p className="text-xs text-text-secondary italic line-clamp-1 mt-0.5">
                      &quot;{enq.message}&quot;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
