import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white"
    >
      <div className="max-w-md space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">404 Error</p>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-text-secondary">
          The page or vehicle you are looking for may have been moved, sold, or is no longer available in our showroom inventory.
        </p>
        <div className="pt-4">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Available Showroom Stock</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
