import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions for using the International Schools Guide website.",
  alternates: { canonical: "https://international-schools-guide.com/terms" },
  openGraph: {
    title: "Terms of Use — International Schools Guide",
    description:
      "Terms and conditions for using the International Schools Guide website.",
    url: "https://international-schools-guide.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div>
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          Legal
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          Terms of Use
        </h1>
        <p className="text-[0.875rem] text-charcoal-muted mb-12">
          Last updated: 20 February 2026
        </p>

        <div className="max-w-2xl space-y-8 text-[0.9375rem] text-charcoal-light leading-relaxed">
          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              About this site
            </h2>
            <p>
              International Schools Guide (the &ldquo;Site&rdquo;) is operated by
              The Schools Trust Ltd, a company registered in England and Wales. By
              using this Site, you agree to these terms. If you don&apos;t agree,
              please don&apos;t use the Site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              What we provide
            </h2>
            <p>
              The Site provides information about international schools including
              fee data, academic results, campus details, and editorial reviews.
              This information is provided for general guidance only. While we make
              every effort to ensure accuracy, we cannot guarantee that all
              information is complete, current, or error-free.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Editorial content
            </h2>
            <p>
              Our editorial reviews represent the opinions of our editorial team
              based on research, school visits, parent interviews, and publicly
              available data. They are not endorsements or recommendations. Every
              family&apos;s circumstances are different, and you should visit
              schools and conduct your own research before making enrolment
              decisions.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Fee data
            </h2>
            <p>
              Fee information is sourced from published school fee schedules,
              direct enquiries, and parent reports. Fees change annually and may
              vary depending on nationality, entry point, or payment terms. Always
              confirm current fees directly with the school before making financial
              commitments. We display fees in USD for comparison purposes; actual
              invoicing is typically in local currency and exchange rates
              fluctuate.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Accuracy and corrections
            </h2>
            <p>
              We take accuracy seriously. Every school profile shows when it was
              last updated. If you find an error, please{" "}
              <Link
                href="/contact/"
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                contact us
              </Link>{" "}
              with the correction and supporting evidence. We will investigate and
              update within 48 hours for factual matters.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Intellectual property
            </h2>
            <p>
              All content on this Site - including text, design, data
              compilations, and editorial reviews - is owned by The Schools Trust
              Ltd or its licensors. You may not reproduce, distribute, or
              republish our content without written permission. Schools may quote
              brief excerpts from their own profile for internal use, with
              attribution.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              User conduct
            </h2>
            <p>
              You agree not to use the Site to submit false corrections or
              misleading information, impersonate a school representative,
              scrape or bulk-download content for commercial use, or attempt to
              interfere with the Site&apos;s operation or security. We reserve the
              right to block access if these terms are breached.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Limitation of liability
            </h2>
            <p>
              The Site is provided &ldquo;as is&rdquo; without warranties of any
              kind. We are not liable for any decisions you make based on
              information found on this Site, including school enrolment decisions
              or financial commitments. Our total liability to you for any claim
              arising from use of the Site is limited to the amount you have paid
              us (which, for most users, is zero).
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Links to other sites
            </h2>
            <p>
              The Site contains links to school websites and other third-party
              resources. We are not responsible for the content, accuracy, or
              privacy practices of external sites. Links do not imply endorsement.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Governing law
            </h2>
            <p>
              These terms are governed by the laws of England and Wales. Any
              disputes will be subject to the exclusive jurisdiction of the courts
              of England and Wales.
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-sm text-charcoal mb-3">
              Changes to these terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              Site after changes constitutes acceptance of the updated terms.
              Material changes will be noted on this page with an updated date.
            </p>
          </div>

          <div className="pt-6 border-t border-warm-border-light">
            <p className="text-[0.875rem] text-charcoal-muted">
              Questions about these terms? Email{" "}
              <a
                href="mailto:hello@international-schools-guide.com"
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                hello@international-schools-guide.com
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
