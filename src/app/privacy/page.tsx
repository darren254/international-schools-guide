import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How International Schools Guide collects, uses, and protects your personal data.",
  alternates: { canonical: "https://international-schools-guide.com/privacy" },
  openGraph: {
    title: "Privacy Policy — International Schools Guide",
    description:
      "How International Schools Guide collects, uses, and protects your personal data.",
    url: "https://international-schools-guide.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div>
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          Legal
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          Privacy Policy
        </h1>
        <p className="text-[0.875rem] text-charcoal-muted mb-12">
          Last updated: 20 February 2026
        </p>

        <div className="max-w-2xl space-y-8 text-[0.9375rem] text-charcoal-light leading-relaxed">
          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Who we are
            </h2>
            <p>
              International Schools Guide is an independent editorial platform
              that profiles international schools for expat families. The site is
              operated by The Schools Trust Ltd, registered in England and Wales.
              For privacy enquiries, email{" "}
              <a
                href="mailto:privacy@international-schools-guide.com"
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                privacy@international-schools-guide.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              What we collect
            </h2>
            <p className="mb-3">
              We collect personal data only when you give it to us directly or
              when it is necessary to operate the site:
            </p>
            <p>
              <strong className="text-charcoal">Contact forms and emails:</strong>{" "}
              When you email us or submit a contact form, we collect your name,
              email address, and the content of your message. We use this to
              respond to your enquiry and may retain correspondence for our
              records.
            </p>
            <p className="mt-3">
              <strong className="text-charcoal">Analytics:</strong> We use Google
              Analytics 4 to understand how visitors use the site - which pages
              are visited, how long people spend, and what devices they use. GA4
              uses cookies and collects anonymised data. We do not use this data
              to identify individual visitors.
            </p>
            <p className="mt-3">
              <strong className="text-charcoal">Technical data:</strong> Our
              hosting provider (Cloudflare) automatically logs IP addresses,
              browser type, and request data for security and performance
              purposes. This data is retained by Cloudflare under their own
              privacy policy.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              What we don&apos;t collect
            </h2>
            <p>
              We don&apos;t collect payment information (we don&apos;t sell
              anything yet). We don&apos;t require user accounts. We don&apos;t
              use tracking pixels from social media platforms. We don&apos;t sell
              or share personal data with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Cookies
            </h2>
            <p>
              We use essential cookies for site functionality and analytics cookies
              (Google Analytics 4) to understand usage patterns. You can disable
              cookies in your browser settings. The site will continue to work
              without them.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              How we use your data
            </h2>
            <p>
              We use personal data to respond to enquiries, correct school
              profiles, process profile claims from schools, improve the site
              based on usage patterns, and ensure the security and performance of
              the platform. We do not use your data for any other purpose.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Data retention
            </h2>
            <p>
              Contact form submissions and email correspondence are retained
              indefinitely for our records unless you request deletion. Analytics
              data is retained for 14 months (Google Analytics default). Technical
              logs are retained by Cloudflare for up to 72 hours.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Your rights
            </h2>
            <p>
              If you are in the UK or European Economic Area, you have the right
              to access, correct, delete, or export your personal data. You can
              also object to processing or request that we restrict it. To
              exercise any of these rights, email{" "}
              <a
                href="mailto:privacy@international-schools-guide.com"
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                privacy@international-schools-guide.com
              </a>
              . We will respond within 30 days.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Third-party services
            </h2>
            <p>
              We use Cloudflare (hosting and CDN), Google Analytics 4 (usage
              analytics), Mapbox (campus maps on school profiles), and Neon
              (database). Each of these services has their own privacy policy. We
              have selected providers with strong data protection practices and,
              where applicable, appropriate data processing agreements in place.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. Material changes will
              be noted on this page with an updated date. We will not reduce your
              rights under this policy without your consent.
            </p>
          </div>

          <div className="pt-6 border-t border-warm-border-light">
            <p className="text-[0.875rem] text-charcoal-muted">
              Questions about this policy? Email{" "}
              <a
                href="mailto:privacy@international-schools-guide.com"
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                privacy@international-schools-guide.com
              </a>{" "}
              or{" "}
              <Link
                href="/contact/"
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                get in touch
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
