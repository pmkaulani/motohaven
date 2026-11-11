import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen">
      {/* Light Clean Top Bar (Anti-Card, No Dark Strip) */}
      <header className="border-b border-border bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-extrabold text-lg text-text-primary">
                MotoHaven Admin
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/admin"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/cars"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Vehicles
                </Link>
                <Link
                  href="/admin/enquiries"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Enquiries
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/"
                className="text-text-secondary hover:text-text-primary hidden sm:inline"
                target="_blank"
              >
                View Public Site ↗
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-text-secondary hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
