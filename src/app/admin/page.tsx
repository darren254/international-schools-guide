"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/admin/login", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/admin/schools");
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);
  return (
    <div className="flex items-center justify-center py-24">
      <p className="text-charcoal-muted">Loading…</p>
    </div>
  );
}
