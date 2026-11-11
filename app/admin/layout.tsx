import React from "react";
import Link from "next/link";
import { Shield, Car, MessageSquare, PlusCircle, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-secondary min-h-screen">
      {/* Top Admin Sub-bar */}
      <div className="bg-text-primary text-white text-xs px-4 sm:px-8 py-2.5 flex items-center justify-between border-b border-border/20">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold tracking-wide">
            MotoHaven Dealership Staff Portal
          </span>
          <span className="hidden sm:inline text-white/50">• Local Testing Mode</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors"
            target="_blank"
          >
            Preview Public Site ↗
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-white/70 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Admin Nav Strip */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6 overflow-x-auto text-xs font-semibold">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 py-4 text-text-primary hover:text-action border-b-2 border-transparent hover:border-action transition-all"
              >
                <Shield className="w-4 h-4 text-action" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/cars"
                className="flex items-center gap-1.5 py-4 text-text-primary hover:text-action border-b-2 border-transparent hover:border-action transition-all"
              >
                <Car className="w-4 h-4 text-action" />
                <span>Manage Vehicles</span>
              </Link>
              <Link
                href="/admin/enquiries"
                className="flex items-center gap-1.5 py-4 text-text-primary hover:text-action border-b-2 border-transparent hover:border-action transition-all"
              >
                <MessageSquare className="w-4 h-4 text-action" />
                <span>Customer Enquiries</span>
              </Link>
            </div>

            <div>
              <Link
                href="/admin/cars/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Page Content */}
      <main className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
