"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "success" | "error">("idle");
  const [publishMsg, setPublishMsg] = useState("");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin/login";
  }

  async function handlePublish() {
    if (publishState === "publishing") return;
    setPublishState("publishing");
    setPublishMsg("");
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPublishState("success");
        setPublishMsg("Triggered! Live in ~5 min.");
        setTimeout(() => setPublishState("idle"), 15000);
      } else {
        setPublishState("error");
        setPublishMsg(data.error || "Publish failed");
        setTimeout(() => setPublishState("idle"), 8000);
      }
    } catch {
      setPublishState("error");
      setPublishMsg("Network error");
      setTimeout(() => setPublishState("idle"), 8000);
    }
  }

  const publishLabel =
    publishState === "publishing" ? "Publishing\u2026" :
    publishState === "success" ? publishMsg :
    publishState === "error" ? publishMsg :
    "Publish";

  const publishClasses =
    publishState === "publishing" ? "bg-amber-100 text-amber-800 border-amber-300 cursor-wait" :
    publishState === "success" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
    publishState === "error" ? "bg-red-100 text-red-800 border-red-300" :
    "bg-primary text-white border-primary hover:bg-primary/90";

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
            <Link href="/admin/image-scraper" className="text-charcoal-muted hover:text-primary">
              Image Scraper
            </Link>
            {pathname !== "/admin/login" && (
              <>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishState === "publishing"}
                  className={`px-3 py-1 rounded border text-body-sm font-medium transition-colors ${publishClasses}`}
                >
                  {publishLabel}
                </button>
                <button type="button" onClick={handleLogout} className="text-charcoal-muted hover:text-primary">
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container-site py-8">{children}</main>
    </div>
  );
}
