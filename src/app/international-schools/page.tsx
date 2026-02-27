import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "International Schools | Browse by City",
  description: "Browse international schools by city. Find the right school for your family in Jakarta, Singapore, Bangkok and more.",
  alternates: { canonical: "https://international-schools-guide.com/cities" },
  robots: { index: false, follow: true },
};

export default function InternationalSchoolsIndexPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/cities" />
      <main className="max-w-xl mx-auto px-5 py-24 text-center">
        <p className="text-charcoal mb-4">
          Browse international schools by city.
        </p>
        <Link href="/cities" className="text-hermes hover:underline">
          Choose a city &rarr;
        </Link>
      </main>
    </>
  );
}
