"use client";

import React, { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="font-extrabold text-xl text-text-primary tracking-tight">
            MotoHaven Nairobi
          </Link>
        </div>

        <div className="bg-white border border-border p-6 sm:p-8 w-full shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Staff Portal Sign In
            </h1>
            <p className="text-xs text-text-secondary">
              Authorised dealership personnel access only.
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label htmlFor={emailId} className="block font-medium text-text-primary mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  id={emailId}
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@motohaven.co.ke"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-field text-text-primary placeholder:text-text-secondary text-sm focus:border-text-primary focus:outline-none"
                />
                <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor={passwordId} className="block font-medium text-text-primary mb-1">
                Staff Password
              </label>
              <div className="relative">
                <input
                  id={passwordId}
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-field text-text-primary placeholder:text-text-secondary text-sm focus:border-text-primary focus:outline-none"
                />
                <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-action text-white text-sm font-semibold hover:bg-action-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
            >
              <span>{loading ? "Authenticating..." : "Sign in to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
              ← Return to public showroom
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
