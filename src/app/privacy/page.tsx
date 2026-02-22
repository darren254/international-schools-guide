import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How International Schools Guide collects, uses, and protects your data. The Schools Trust Ltd.",
  alternates: { canonical: "https://international-schools-guide.com/privacy" },
  openGraph: {
    title: "Privacy Policy - International Schools Guide",
    description: "How we collect, use, and protect your data.",
    url: "https://international-schools-guide.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div>
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          Last updated: 20 February 2026
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          Privacy Policy
        </h1>
      </section>

      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Who we are</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            International Schools Guide is an independent editorial platform that profiles international schools for expat families. The site is operated by The Schools Trust Ltd, registered in England and Wales. For privacy enquiries, email{" "}
            <a href="mailto:privacy@international-schools-guide.com" className="text-hermes hover:text-hermes-hover transition-colors">
              privacy@international-schools-guide.com
            </a>.
          </p>
        </div>
      </section>

      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">What we collect</h2>
        <ul className="space-y-4 max-w-2xl">
          <li className="flex gap-3">
            <span className="text-hermes font-medium shrink-0">Contact forms and emails</span>
            <span className="text-charcoal-muted">-</span>
            <span className="text-[0.9375rem] text-charcoal-light leading-relaxed">
              Name, email address, message content. Used to respond to enquiries.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-hermes font-medium shrink-0">Analytics</span>
            <span className="text-charcoal-muted">-</span>
            <span className="text-[0.9375rem] text-charcoal-light leading-relaxed">
              Google Analytics 4 with cookies for anonymised usage data (pages visited, time on site, devices). Not used to identify individuals.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-hermes font-medium shrink-0">Technical data</span>
            <span className="text-charcoal-muted">-</span>
            <span className="text-[0.9375rem] text-charcoal-light leading-relaxed">
              Cloudflare automatically logs IP addresses, browser type, and request data for security and performance.
            </span>
          </li>
        </ul>
      </section>

      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">What we don&apos;t collect</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            No payment information, no user accounts required, no social media tracking pixels, no selling or sharing personal data for marketing.
          </p>
        </div>
      </section>

      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Cookies</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          Essential cookies for site functionality and GA4 analytics cookies. Can be disabled in browser settings. The site works without them.
        </p>
      </section>

      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">How we use your data</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            Respond to enquiries, correct school profiles, process profile claims, improve the site, ensure security and performance. Nothing else.
          </p>
        </div>
      </section>

      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Data retention</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl mb-4">
          Contact submissions retained indefinitely unless deletion requested. Analytics data retained 14 months (GA4 default). Cloudflare logs retained up to 72 hours.
        </p>
      </section>

      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Your rights</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            UK/EEA users can access, correct, delete, or export personal data. Email{" "}
            <a href="mailto:privacy@international-schools-guide.com" className="text-hermes hover:text-hermes-hover transition-colors">
              privacy@international-schools-guide.com
            </a>
            ; we will respond within 30 days.
          </p>
        </div>
      </section>

      <section className="container-site py-14">
        <h2 className="font-display text-display-lg mb-5">Third-party services</h2>
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
          Cloudflare (hosting/CDN), Google Analytics 4, Mapbox (campus maps), Neon (database). Each has their own privacy policy.
        </p>
      </section>

      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <h2 className="font-display text-display-lg mb-5">Changes to this policy</h2>
          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed max-w-2xl">
            We may update this policy from time to time. Material changes will be noted with an updated date. We won&apos;t reduce your rights without your consent.
          </p>
        </div>
      </section>

      <section className="container-site py-14 text-center">
        <p className="text-[0.9375rem] text-charcoal-light max-w-lg mx-auto mb-6 leading-relaxed">
          Questions? Email{" "}
          <a href="mailto:privacy@international-schools-guide.com" className="text-hermes hover:text-hermes-hover transition-colors">
            privacy@international-schools-guide.com
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
