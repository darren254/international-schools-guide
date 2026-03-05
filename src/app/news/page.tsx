import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights | The International Schools Guide",
  description:
    "Expert analysis on school fees, admissions, rankings, curriculum and relocation for international families in Jakarta.",
  alternates: { canonical: "https://international-schools-guide.com/insights" },
  robots: { index: false, follow: true },
};

export default function NewsRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/insights/" />
      <main className="max-w-xl mx-auto px-5 py-24 text-center">
        <p className="text-charcoal mb-4">
          News has moved to Insights.
        </p>
        <Link href="/insights/" className="text-primary hover:underline">
          Go to Insights &rarr;
        </Link>
      </main>
    </>
  );
}
