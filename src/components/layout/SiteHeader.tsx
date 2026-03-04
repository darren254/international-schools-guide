"use client";

import Link from "next/link";
import { useState } from "react";
import { useShortlistOptional } from "@/context/ShortlistContext";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const shortlist = useShortlistOptional();
  const shortlistCount = shortlist?.shortlistedSlugs.length ?? 0;
  const compareHref = "/shortlist";

  const navLinks = [
    { href: "/cities", label: "Schools" },
    { href: compareHref, label: "Compare" },
    { href: "/shortlist", label: shortlistCount > 0 ? `Shortlist (${shortlistCount})` : "Shortlist" },
    { href: "/insights/", label: "Insights" },
    { href: "/about/", label: "About" },
  ];

  return (
    <header className="bg-warm-white border-b border-warm-border sticky top-0 z-50">
      <div className="container-site">
        <div className="flex items-center justify-between h-16 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-0" aria-label="International Schools Guide home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className="h-8 w-auto max-w-[200px] sm:max-w-none" width="380" height="28" />
          </Link>

          {/* Nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6 lg:gap-8">
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
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <CurrencyToggle />

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-7 h-7 relative"
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
          <nav className="lg:hidden border-t border-warm-border py-4">
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
