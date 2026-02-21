"use client";

import Link from "next/link";
import { useState } from "react";
import { useShortlistOptional } from "@/context/ShortlistContext";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const shortlist = useShortlistOptional();
  const shortlistCount = shortlist?.shortlistedSlugs.length ?? 0;
  const compareHref =
    shortlist && shortlistCount >= 2
      ? `/compare?schools=${shortlist.shortlistedSlugs.slice(0, 4).join(",")}`
      : "/compare";

  const navLinks = [
    { href: "/international-schools/", label: "Schools" },
    { href: "/shortlist", label: shortlistCount > 0 ? `Shortlist (${shortlistCount})` : "Shortlist" },
    { href: compareHref, label: "Compare" },
    { href: "/insights/", label: "Insights" },
    { href: "/news/", label: "News" },
    { href: "/about/", label: "About" },
  ];

  return (
    <header className="bg-warm-white border-b border-warm-border sticky top-0 z-50">
      <div className="container-site">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            International Schools{" "}
            <span className="text-hermes">Guide</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-light text-sm uppercase tracking-wider hover:text-charcoal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-xs text-charcoal-muted">EN</button>
            <button className="text-xs text-charcoal-muted border border-warm-border px-3 py-1.5 hover:border-charcoal-muted transition-colors">
              USD
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-7 h-7 relative"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span
                className={`block absolute left-1 w-5 h-[1.5px] bg-charcoal transition-all ${
                  mobileOpen ? "top-[13px] rotate-45" : "top-[8px]"
                }`}
              />
              <span
                className={`block absolute left-1 w-5 h-[1.5px] bg-charcoal transition-all top-[13px] ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block absolute left-1 w-5 h-[1.5px] bg-charcoal transition-all ${
                  mobileOpen ? "top-[13px] -rotate-45" : "top-[18px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-warm-border py-4">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-charcoal-light text-sm uppercase tracking-wider"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
