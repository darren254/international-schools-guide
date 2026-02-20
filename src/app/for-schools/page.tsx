import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Schools",
  description:
    "Claim your school profile, update fee data, and respond to our editorial review. We profile every international school — whether or not you ask us to.",
  alternates: { canonical: "https://international-schools-guide.com/for-schools" },
  openGraph: {
    title: "For Schools — International Schools Guide",
    description:
      "Claim your school profile, update fee data, and respond to our editorial review.",
    url: "https://international-schools-guide.com/for-schools",
  },
};

const CLAIM_STEPS = [
  {
    step: "01",
    title: "Verify your identity",
    desc: "Contact us from your school email address. We need to confirm you're authorised to represent the school — typically a head of school, registrar, or communications director.",
  },
  {
    step: "02",
    title: "Review your profile",
    desc: "We'll give you access to check your factual data: fees, contact details, campus addresses, curriculum information, and accreditation status. If anything is out of date, tell us and we'll update it.",
  },
  {
    step: "03",
    title: "Respond to the editorial",
    desc: "You can submit a written response to our editorial review. We'll publish it alongside the review, unedited, so parents see both perspectives. You cannot edit or remove the review itself.",
  },
];

const FAQS = [
  {
    q: "Can we pay to improve our review?",
    a: "No. Editorial reviews are independent and cannot be influenced by payment. This is non-negotiable.",
  },
  {
    q: "Can we remove our profile?",
    a: "No. We profile every international school in every city we cover. Removal would compromise the completeness of the guide for parents.",
  },
  {
    q: "Can we see the review before it's published?",
    a: "No. Reviews are published without prior approval from schools. You can respond after publication.",
  },
  {
    q: "How do you gather fee data?",
    a: "From published fee schedules, FOI requests, direct enquiries, and parent reports. If your published fees are out of date, send us the current schedule and we'll update within 48 hours.",
  },
  {
    q: "What if something is factually wrong?",
    a: "Email us with the correction and supporting evidence. We take factual accuracy seriously and will update promptly. Editorial opinions are a different matter — those reflect our assessment.",
  },
  {
    q: "Do you offer featured or premium listings?",
    a: "Not yet. When we do, featured listings will be clearly labelled and will never affect editorial content or review scores.",
  },
];

export default function ForSchoolsPage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          For Schools
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          We profile every international school — whether or not you ask us to
        </h1>
        <p className="text-[1.0625rem] text-charcoal-light leading-relaxed max-w-2xl mb-6">
          International Schools Guide is an independent editorial platform. Every
          school in every city we cover gets a profile — including fees, data, and
          an honest written review. Schools don&apos;t pay for listings and
          can&apos;t pay to change their review.
        </p>
        <p className="text-[1.0625rem] text-charcoal-light leading-relaxed max-w-2xl">
          What you can do is claim your profile, correct factual errors, update
          your fee schedule, and publish a response to our editorial review.
        </p>
      </section>

      {/* ─── What claiming gets you ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
              Claim Your Profile
            </p>
            <h2 className="font-display text-display-lg">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {CLAIM_STEPS.map((item) => (
              <div key={item.step}>
                <span className="text-hermes font-display text-[1.75rem] font-medium">
                  {item.step}
                </span>
                <h3 className="font-display text-display-sm mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-[0.9375rem] text-charcoal-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/contact/"
              className="inline-block bg-hermes text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors"
            >
              Claim Your Profile
            </Link>
          </div>
        </div>
      </section>

      {/* ─── What we publish ─── */}
      <section className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start max-w-4xl mx-auto">
          <div>
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
              What We Publish
            </p>
            <h2 className="font-display text-display-lg mb-5">
              Every profile includes
            </h2>
          </div>
          <div>
            <ul className="space-y-3 text-[0.9375rem] text-charcoal-light leading-relaxed">
              <li className="flex gap-3">
                <span className="text-hermes font-medium shrink-0">Fee data</span>
                <span className="text-charcoal-muted">—</span>
                <span>Annual tuition by grade, one-time fees, payment terms</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hermes font-medium shrink-0">Exam results</span>
                <span className="text-charcoal-muted">—</span>
                <span>IB averages, pass rates, A-Level/IGCSE grades where published</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hermes font-medium shrink-0">Campus data</span>
                <span className="text-charcoal-muted">—</span>
                <span>Location, facilities, campus size, student numbers</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hermes font-medium shrink-0">Accreditation</span>
                <span className="text-charcoal-muted">—</span>
                <span>CIS, WASC, BSO, IB authorisation, inspection ratings</span>
              </li>
              <li className="flex gap-3">
                <span className="text-hermes font-medium shrink-0">Editorial review</span>
                <span className="text-charcoal-muted">—</span>
                <span>An honest assessment of who the school suits, what it does well, and where it falls short</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section className="bg-charcoal text-cream py-16">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-label-sm uppercase text-cream-400 tracking-wider mb-3">
              Common Questions
            </p>
            <h2 className="font-display text-display-lg text-cream-50">
              What schools ask us
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-display text-[1.125rem] text-cream-50 mb-2">
                  {faq.q}
                </h3>
                <p className="text-[0.9375rem] text-cream-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <section className="container-site py-14 text-center">
        <h2 className="font-display text-display-lg mb-4">
          Ready to claim your profile?
        </h2>
        <p className="text-[0.9375rem] text-charcoal-light max-w-lg mx-auto mb-8 leading-relaxed">
          Email us from your school address. Include the school name, your role,
          and what you&apos;d like to update. We respond within two working days.
        </p>
        <Link
          href="/contact/"
          className="inline-block bg-hermes text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
