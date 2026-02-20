import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the International Schools Guide team. Corrections, school updates, editorial enquiries, and partnership proposals.",
  alternates: { canonical: "https://international-schools-guide.com/contact" },
  openGraph: {
    title: "Contact Us — International Schools Guide",
    description:
      "Get in touch with the International Schools Guide team.",
    url: "https://international-schools-guide.com/contact",
  },
};

const CONTACT_CHANNELS = [
  {
    label: "Factual corrections",
    email: "corrections@international-schools-guide.com",
    desc: "Wrong fee data, outdated leadership info, incorrect accreditation status. Include the school name and evidence of the correct information.",
    response: "Within 48 hours",
  },
  {
    label: "School profile claims",
    email: "schools@international-schools-guide.com",
    desc: "You represent a school and want to verify your profile, update fee schedules, or submit a response to our editorial review. Email from your school address.",
    response: "Within 2 working days",
  },
  {
    label: "Editorial & press",
    email: "editorial@international-schools-guide.com",
    desc: "Journalists, media enquiries, or parents with tips and school recommendations. We read everything.",
    response: "Within 5 working days",
  },
  {
    label: "General enquiries",
    email: "hello@international-schools-guide.com",
    desc: "Anything else. Feedback on the site, partnership proposals, technical issues, or just to say hello.",
    response: "Within 5 working days",
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          Contact
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          Get in touch
        </h1>
        <p className="text-[1.0625rem] text-charcoal-light leading-relaxed max-w-2xl">
          Whether you&apos;re a parent with a correction, a school claiming your
          profile, or a journalist with a question - email the right address below
          and we&apos;ll get back to you.
        </p>
      </section>

      {/* ─── Contact channels ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {CONTACT_CHANNELS.map((channel) => (
              <div
                key={channel.label}
                className="bg-white border border-warm-border-light p-6"
              >
                <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-2">
                  {channel.label}
                </p>
                <a
                  href={`mailto:${channel.email}`}
                  className="font-display text-[1.125rem] text-hermes hover:text-hermes-hover transition-colors block mb-3"
                >
                  {channel.email}
                </a>
                <p className="text-[0.875rem] text-charcoal-light leading-relaxed mb-3">
                  {channel.desc}
                </p>
                <p className="text-[0.75rem] text-charcoal-muted uppercase tracking-wider">
                  Response time: {channel.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Notes ─── */}
      <section className="container-site py-14">
        <div className="max-w-2xl mx-auto space-y-6 text-[0.9375rem] text-charcoal-light leading-relaxed">
          <h2 className="font-display text-display-lg text-charcoal mb-4">
            A few things to know
          </h2>
          <p>
            We read every email. If you&apos;re reporting a factual error, include
            the school name, what&apos;s wrong, and a source for the correct
            information - this helps us fix things faster.
          </p>
          <p>
            If you&apos;re a school representative, please email from your school
            domain (e.g. @schoolname.sch.id) so we can verify your identity
            without a back-and-forth.
          </p>
          <p>
            We don&apos;t accept requests to remove school profiles or editorial
            reviews. If you believe something is factually inaccurate, we&apos;ll
            investigate and correct it. If you disagree with our editorial
            assessment, you&apos;re welcome to submit a written response which
            we&apos;ll publish alongside the review.
          </p>
        </div>
      </section>
    </div>
  );
}
