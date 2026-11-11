import React from "react";
import Link from "next/link";
import { LocalDB } from "@/lib/db/local-db";
import { formatKSh } from "@/lib/config/dealership";
import { Car, CheckCircle2, Clock, DollarSign, MessageSquare, PlusCircle, ArrowRight } from "lucide-react";

export const revalidate = 0; // Dynamic server query

export default function AdminDashboardPage() {
  const metrics = LocalDB.getDashboardMetrics();

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Dealership Operations Dashboard
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Overview of live Nairobi showroom inventory and incoming customer leads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Vehicle</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-white border border-border text-text-primary text-xs font-semibold hover:bg-background-tertiary transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-action" />
            <span>View All Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold">Total Stock</span>
            <Car className="w-4 h-4 text-action" />
          </div>
          <p className="text-2xl font-extrabold text-text-primary">{metrics.total}</p>
          <p className="text-[11px] text-text-secondary">Vehicles in system</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold">Available</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{metrics.available}</p>
          <p className="text-[11px] text-text-secondary">On public website</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold">Reserved</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700">{metrics.reserved}</p>
          <p className="text-[11px] text-text-secondary">Deposit holding</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold">Sold Units</span>
            <DollarSign className="w-4 h-4 text-action" />
          </div>
          <p className="text-2xl font-extrabold text-text-primary">{metrics.sold}</p>
          <p className="text-[11px] text-text-secondary">Completed sales</p>
        </div>

        <div className="bg-white p-5 rounded-card border border-border shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold">New Enquiries</span>
            <MessageSquare className="w-4 h-4 text-brand-whatsapp" />
          </div>
          <p className="text-2xl font-extrabold text-action">{metrics.newEnquiries}</p>
          <p className="text-[11px] text-text-secondary">Requires follow-up</p>
        </div>
      </div>

      {/* Grid: Recent Vehicles & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inventory Column */}
        <div className="lg:col-span-7 bg-white rounded-card border border-border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">
              Recent Inventory Additions
            </h2>
            <Link
              href="/admin/cars"
              className="text-xs font-semibold text-action hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {metrics.recentVehicles.map((car) => (
              <div key={car.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.cover_photo || car.photo_urls[0]}
                    alt={car.model}
                    className="w-12 h-9 object-cover rounded bg-background-tertiary shrink-0"
                  />
                  <div>
                    <Link
                      href={`/admin/cars/${car.id}/edit`}
                      className="text-xs font-bold text-text-primary hover:text-action leading-tight block"
                    >
                      {car.year} {car.brand} {car.model}
                    </Link>
                    <p className="text-[11px] text-text-secondary">
                      {formatKSh(car.price)} • {car.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      car.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : car.status === "Reserved"
                        ? "bg-amber-100 text-amber-800"
                        : car.status === "Sold"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {car.status}
                  </span>
                  <Link
                    href={`/admin/cars/${car.id}/edit`}
                    className="p-1 text-xs text-text-secondary hover:text-action"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries Column */}
        <div className="lg:col-span-5 bg-white rounded-card border border-border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">
              Recent Customer Leads
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-action hover:underline flex items-center gap-1"
            >
              <span>Inbox ({metrics.totalEnquiries})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {metrics.recentEnquiries.length === 0 ? (
              <p className="text-xs text-text-secondary py-6 text-center">
                No customer enquiries yet.
              </p>
            ) : (
              metrics.recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      {enq.customer_name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enq.status === "New"
                          ? "bg-blue-100 text-blue-800"
                          : enq.status === "Contacted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    {enq.phone} • {enq.vehicle_name || "General Enquiry"}
                  </p>
                  {enq.message && (
                    <p className="text-[11px] text-text-secondary italic line-clamp-1">
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
