import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Schools",
  description:
    "Work with us to keep your profile accurate. Verified badge, From the School section, and Featured placement. Fair, balanced profiles for parents.",
  alternates: { canonical: "https://international-schools-guide.com/for-schools" },
  openGraph: {
    title: "For Schools - International Schools Guide",
    description:
      "Work with us to keep your profile accurate. Verified badge, From the School section, and Featured placement.",
    url: "https://international-schools-guide.com/for-schools",
  },
};

const TIERS = [
  {
    label: "Verified badge",
    cost: "Free",
    points: [
      "Confirm your school's data is accurate - fees, contact details, curriculum, accreditation - and we'll add a Verified badge to your profile.",
      "Link to your school website from the profile.",
      "Update your data any time by emailing us.",
    ],
    footer: "Cost: Free. Just email us from your school address.",
  },
  {
    label: "From the School",
    cost: "Free",
    points: [
      "Send us photos, a message from the head, or anything you want parents to see alongside our editorial.",
      "We'll add a clearly labelled \"From the School\" section to your profile.",
      "Your content runs alongside our independent review - parents see both perspectives.",
    ],
    footer: "Cost: Free. Send materials to schools@international-schools-guide.com.",
  },
  {
    label: "Featured School",
    cost: "Subscription",
    points: [
      "Your school appears in the Featured Schools section on the homepage and on your city's listing page.",
      "Featured placement is clearly labelled and does not affect your editorial review.",
      "Includes the Verified badge and \"From the School\" section.",
    ],
    footer: "Cost: Annual subscription. Contact us for pricing.",
  },
];

const FAQS = [
  {
    q: "Can we update our fee data?",
    a: "Yes. Email us the current schedule from your school address and we'll update within 48 hours.",
  },
  {
    q: "Can we respond to the editorial review?",
    a: "Yes. Send us a written response and we'll publish it in the 'From the School' section alongside the review.",
  },
  {
    q: "Does a Featured listing affect the review?",
    a: "No. Featured placement is commercial and clearly labelled. Editorial reviews are independent regardless of whether a school is a paying partner.",
  },
  {
    q: "What if something is factually wrong?",
    a: "Email corrections@international-schools-guide.com with the correction and evidence. We take accuracy seriously and will update promptly.",
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
          Work with us to keep your profile accurate
        </h1>
        <p className="text-[1.0625rem] text-charcoal-light leading-relaxed max-w-2xl mb-6">
          Every international school in every city we cover gets a profile - fees,
          data, and an independent editorial review. Our profiles are fair, balanced,
          and written for parents. We want to get it right, and working with schools
          directly helps us do that.
        </p>
      </section>

      {/* ─── Three tiers ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
              What we offer
            </p>
            <h2 className="font-display text-display-lg">Ways to work with us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TIERS.map((tier) => (
              <div key={tier.label} className="border border-warm-border rounded-sm p-6 bg-cream-50">
                <div className="flex items-baseline justify-between gap-2 mb-4">
                  <h3 className="font-display text-display-sm">{tier.label}</h3>
                  <span className="text-[0.75rem] uppercase tracking-wider text-charcoal-muted font-medium">
                    {tier.cost}
                  </span>
                </div>
                <ul className="space-y-3 mb-5">
                  {tier.points.map((point, i) => (
                    <li key={i} className="text-[0.9375rem] text-charcoal-light leading-relaxed flex gap-2">
                      <span className="text-hermes shrink-0">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[0.8125rem] text-charcoal-muted leading-relaxed border-t border-warm-border pt-4">
                  {tier.footer}
                </p>
              </div>
            ))}
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

      {/* ─── CTA ─── */}
      <section className="container-site py-14 text-center">
        <h2 className="font-display text-display-lg mb-4">
          Get started
        </h2>
        <p className="text-[0.9375rem] text-charcoal-light max-w-lg mx-auto mb-8 leading-relaxed">
          Email schools@international-schools-guide.com from your school address.
          Tell us your school name, your role, and whether you&apos;d like to verify
          your profile, add a &quot;From the School&quot; section, or discuss
          Featured placement.
        </p>
        <a
          href="mailto:schools@international-schools-guide.com"
          className="inline-block bg-hermes text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors"
        >
          Email schools@international-schools-guide.com
        </a>
      </section>
    </div>
  );
}
