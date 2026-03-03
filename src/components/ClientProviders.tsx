"use client";

import { ShortlistProvider } from "@/context/ShortlistContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <ShortlistProvider>{children}</ShortlistProvider>
    </CurrencyProvider>
  );
}
