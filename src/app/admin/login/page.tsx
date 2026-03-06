"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace("/admin/schools");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <div className="bg-warm-white border border-warm-border rounded-lg p-8 shadow-sm">
        <h1 className="font-display text-display-md text-charcoal mb-2">Admin login</h1>
        <p className="text-body-sm text-charcoal-muted mb-6">
          Sign in to edit school profiles and images.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-label-sm text-charcoal mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-label-sm text-charcoal mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error ? (
            <p className="text-body-sm text-red-600">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-body text-body-sm font-medium rounded hover:bg-primary-hover disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
