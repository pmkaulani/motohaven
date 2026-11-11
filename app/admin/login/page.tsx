"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@motohaven.co.ke");
  const [password, setPassword] = useState("motohaven2026");
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
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-card border border-border p-6 sm:p-8 max-w-md w-full shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-background-secondary border border-border flex items-center justify-center mx-auto text-action">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Staff Portal Sign In
          </h1>
          <p className="text-xs text-text-secondary">
            Authorized dealership personnel access only.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@motohaven.co.ke"
                className="w-full pl-9 pr-3 py-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
              <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Staff Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-background-secondary rounded-btn border border-border focus:bg-white focus:border-action focus:outline-none"
              />
              <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="p-3 rounded bg-background-secondary border border-border text-[11px] text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">Pre-configured Test Credentials:</p>
            <p>Email: <code className="font-mono text-action font-bold">admin@motohaven.co.ke</code></p>
            <p>Password: <code className="font-mono text-action font-bold">motohaven2026</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-btn bg-action text-white text-xs font-semibold hover:bg-action-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign in to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
