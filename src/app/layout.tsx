import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const baseUrl = "https://international-schools-guide.com";

export const metadata: Metadata = {
  title: {
    template: "%s — International Schools Guide",
    default: "International Schools Guide — Find the Right School",
  },
  description:
    "Compare international schools worldwide. Honest profiles, real fee data, and editorial reviews for expat families.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en",
    siteName: "International Schools Guide",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "International Schools Guide" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ClientProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </ClientProviders>
        {gaId ? (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
        ) : null}
        {gaId ? (
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
