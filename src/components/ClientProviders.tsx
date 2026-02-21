"use client";

import { ShortlistProvider } from "@/context/ShortlistContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ShortlistProvider>{children}</ShortlistProvider>;
}
