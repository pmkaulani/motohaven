import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, LayoutDashboard, Car, MessageSquare, ExternalLink } from "lucide-react";
import { getStaffSession } from "@/lib/auth/guards";

export default function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: verify staff session on EVERY admin page request
  const session = getStaffSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Light Clean Top Bar (Anti-Card, Unboxed) */}
      <header className="border-b border-border bg-white sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-extrabold text-lg text-text-primary tracking-tight">
                MotoHaven Admin
              </Link>
              <nav aria-label="Staff Navigation" className="flex items-center gap-4 sm:gap-6 text-sm font-medium overflow-x-auto py-2">
                <Link
                  href="/admin"
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/cars"
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Car className="w-4 h-4" />
                  <span>Vehicles</span>
                </Link>
                <Link
                  href="/admin/enquiries"
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquiries</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs">
              <Link
                href="/"
                className="text-text-secondary hover:text-text-primary hidden md:inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  aria-label="Log out of staff portal"
                  className="text-text-secondary hover:text-red-700 flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-background-secondary transition-colors font-medium min-h-[36px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Page Content (AX1 Landmark Fix) */}
      <main id="main-content" className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1">
        {children}
      </main>
    </div>
  );
}
