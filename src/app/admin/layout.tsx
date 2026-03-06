"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-warm-border bg-warm-white">
        <div className="container-site flex items-center justify-between h-14">
          <Link href="/admin/schools" className="font-display text-lg font-medium text-charcoal hover:text-primary">
            ISG Admin
          </Link>
          <nav className="flex items-center gap-6 text-body-sm">
            <Link href="/admin/schools" className="text-charcoal-muted hover:text-primary">
              Schools
            </Link>
            {pathname !== "/admin/login" && (
              <button type="button" onClick={handleLogout} className="text-charcoal-muted hover:text-primary">
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="container-site py-8">{children}</main>
    </div>
  );
}
