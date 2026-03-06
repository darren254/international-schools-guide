"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function FooterAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/login", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setAuthenticated(data.authenticated === true))
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
    window.location.href = "/";
  }

  if (authenticated === null) return null;

  return (
    <>
      {authenticated ? (
        <span className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-cream-400 transition-colors">
            Admin
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="hover:text-cream-400 transition-colors bg-transparent border-none cursor-pointer text-inherit text-xs font-inherit p-0"
          >
            Log out
          </button>
        </span>
      ) : (
        <Link href="/admin/login" className="hover:text-cream-400 transition-colors">
          Log in
        </Link>
      )}
    </>
  );
}
