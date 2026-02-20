import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of use for International Schools Guide. The Schools Trust Ltd.",
  alternates: { canonical: "https://international-schools-guide.com/terms" },
  openGraph: {
    title: "Terms of Use — International Schools Guide",
    description: "Terms of use for International Schools Guide.",
    url: "https://international-schools-guide.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          Last updated: 20 February 2026
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          Terms of Use
        </h1>
      </section>

      {/* ─── About this site ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">About this site</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            International Schools Guide is operated by The Schools Trust Ltd, registered in England and Wales. By using this site, you agree to these terms.
          </p>
        </div>
      </section>

      {/* ─── What we provide ─── */}
      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">What we provide</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          Information about international schools including fee data, academic results, campus details, and editorial reviews. Provided for general guidance only. We make every effort to ensure accuracy but cannot guarantee all information is complete, current, or error-free.
        </p>
      </section>

      {/* ─── Editorial content ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Editorial content</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            Our reviews represent the opinions of our editorial team based on research, school visits, parent interviews, and publicly available data. They are not endorsements or recommendations. Every family&apos;s circumstances are different. Visit schools and conduct your own research before making enrolment decisions.
          </p>
        </div>
      </section>

      {/* ─── Fee data ─── */}
      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Fee data</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          Sourced from published fee schedules, direct enquiries, and parent reports. Fees change annually and may vary by nationality, entry point, or payment terms. Always confirm current fees directly with the school. We display fees in USD for comparison; actual invoicing is typically in local currency and exchange rates fluctuate.
        </p>
      </section>

      {/* ─── Accuracy and corrections ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Accuracy and corrections</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            We take accuracy seriously. Every profile shows when it was last updated. If you find an error, contact us with the correction and evidence. We will investigate and update within 48 hours for factual matters.
          </p>
        </div>
      </section>

      {/* ─── Intellectual property ─── */}
      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Intellectual property</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          All content is owned by The Schools Trust Ltd or its licensors. You may not reproduce, distribute, or republish without written permission. Schools may quote brief excerpts from their own profile for internal use, with attribution.
        </p>
      </section>

      {/* ─── User conduct ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">User conduct</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            Don&apos;t submit false corrections, impersonate school representatives, scrape content for commercial use, or interfere with the site&apos;s operation. We reserve the right to block access if these terms are breached.
          </p>
        </div>
      </section>

      {/* ─── Limitation of liability ─── */}
      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Limitation of liability</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          The site is provided &quot;as is&quot; without warranties. We are not liable for decisions made based on information found here, including enrolment decisions or financial commitments.
        </p>
      </section>

      {/* ─── Links to other sites ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Links to other sites</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            We link to school websites and third-party resources. We are not responsible for external content. Links do not imply endorsement.
          </p>
        </div>
      </section>

      {/* ─── Governing law ─── */}
      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Governing law</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          Laws of England and Wales. Disputes subject to exclusive jurisdiction of the English and Welsh courts.
        </p>
      </section>

      {/* ─── Changes ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Changes to these terms</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            We may update these terms from time to time. Continued use constitutes acceptance. Material changes will be noted with an updated date.
          </p>
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="container-site py-14 text-center">
        <p className="text-[0.9375rem] text-charcoal-light max-w-lg mx-auto mb-6 leading-relaxed">
          Questions? Email{" "}
          <a href="mailto:hello@international-schools-guide.com" className="text-hermes hover:text-hermes-hover transition-colors">
            hello@international-schools-guide.com
          </a>{" "}
          or get in touch.
        </p>
        <Link
          href="/contact/"
          className="inline-block border border-charcoal text-charcoal px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors"
        >
          Contact us
        </Link>
      </section>
    </div>
  );
}
