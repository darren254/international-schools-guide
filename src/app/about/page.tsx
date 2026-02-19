import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — International Schools Guide",
  description:
    "Independent, editorially-driven school profiles built for expat families. No sponsored rankings, no school advertising, no commissions.",
};

const TEAM = [
  {
    name: "Mia Windsor",
    role: "Managing Editor",
    bio: "Mia moved her three children through four Jakarta international schools over eight years. She knows the school run, the fee negotiations, and the WhatsApp group politics from the inside. Before launching ISG she was a features editor at a national broadsheet in London.",
  },
  {
    name: "James Chen",
    role: "Head of Development",
    bio: "James builds the platform — the search tools, comparison features, and data pipelines that keep fee information and school profiles accurate. Previously he led product engineering at a Singapore-based edtech company.",
  },
  {
    name: "Emma Torres",
    role: "Content & Research Lead",
    bio: "Emma visits schools, interviews heads, and writes the editorial reviews. She's a former IB teacher who taught in Bangkok, Hong Kong, and Jakarta before joining ISG. She knows what good teaching looks like — and what marketing copy looks like.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "We gather the data",
    desc: "Fee schedules, inspection reports, IB results, accreditation status, admissions policies. We get this from public filings, school websites, FOI requests, and direct enquiries. If a school won't share their fees publicly, we say so.",
  },
  {
    step: "02",
    title: "We visit and research",
    desc: "We visit campuses, sit in on tours, talk to current parents, and interview heads of school. We read the inspection reports cover to cover. We check claims against data.",
  },
  {
    step: "03",
    title: "We write what we think",
    desc: "Every school profile includes an editorial review — our honest assessment of who the school suits, what it does well, and where it falls short. Schools don't get to approve or edit these reviews before publication.",
  },
  {
    step: "04",
    title: "We keep it current",
    desc: "Fee data is updated annually. Editorial reviews are refreshed when there's a leadership change, a new inspection report, or significant developments. Every profile shows when it was last updated.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-4">
          About Us
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-medium tracking-tight leading-[1.15] mb-6 max-w-2xl">
          We help families find the right school. That&apos;s it.
        </h1>
        <p className="text-[1.0625rem] text-charcoal-light leading-relaxed max-w-2xl mb-6">
          International Schools Guide is an independent editorial platform. We
          profile international schools across Asia — fees, results, facilities,
          and an honest written review — so expat families can make informed
          decisions instead of relying on school marketing and word of mouth.
        </p>
        <p className="text-[1.0625rem] text-charcoal-light leading-relaxed max-w-2xl">
          We don&apos;t take money from schools. We don&apos;t run sponsored
          rankings. We don&apos;t earn commissions on enrolments. We visit, we
          research, we write what we think.
        </p>
      </section>

      {/* ─── Why we exist ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            <div>
              <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
                Why We Built This
              </p>
              <h2 className="font-display text-display-lg mb-5">
                The school search is broken
              </h2>
            </div>
            <div className="space-y-4 text-[0.9375rem] text-charcoal-light leading-relaxed">
              <p>
                If you&apos;re an expat family arriving in Jakarta — or Singapore,
                or Bangkok, or Dubai — finding the right school for your child is
                one of the most consequential decisions you&apos;ll make. It&apos;s
                also one of the least well-served by good information.
              </p>
              <p>
                Most &ldquo;school guides&rdquo; are funded by the schools
                themselves. Rankings are paid placements. Relocation agents earn
                commissions. The glossy brochure tells you everything except what
                you actually need to know: is this school worth the money, will my
                child thrive here, and what do parents who are already there really
                think?
              </p>
              <p>
                We started with Jakarta because it&apos;s the city we know best —
                90+ international schools, fee ranges from US$5K to US$36K a year,
                and very little independent information to help parents navigate it
                all. We&apos;re expanding across Southeast Asia and beyond, one
                city at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our principles ─── */}
      <section className="container-site py-16">
        <div className="text-center mb-10">
          <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
            Our Principles
          </p>
          <h2 className="font-display text-display-lg">
            What we promise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Editorially independent",
              desc: "Schools don't pay to be listed, can't pay to improve their review, and don't see our editorial before it's published. Our revenue comes from parents (premium features) and advertising that is clearly labelled — never from schools.",
            },
            {
              title: "Data you can trust",
              desc: "We publish verified fee schedules, IB results, inspection ratings, and accreditation status. Every data point is sourced and dated. If we can't verify something, we say so rather than guess.",
            },
            {
              title: "Written for parents",
              desc: "Our reviews are written by people who've been through the school search themselves. We write the way we'd talk to a friend who just landed in the city and needs to find a school by next term.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-display-sm mb-3">{item.title}</h3>
              <p className="text-[0.9375rem] text-charcoal-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How we work ─── */}
      <section className="bg-charcoal text-cream py-16">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-label-sm uppercase text-cream-400 tracking-wider mb-3">
              Editorial Process
            </p>
            <h2 className="font-display text-display-lg text-cream-50">
              How we research and review schools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PROCESS_STEPS.map((item) => (
              <div key={item.step}>
                <span className="text-hermes font-display text-[1.75rem] font-medium">
                  {item.step}
                </span>
                <h3 className="font-display text-display-sm text-cream-50 mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-[0.875rem] text-cream-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section className="container-site py-16">
        <div className="text-center mb-10">
          <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
            The Team
          </p>
          <h2 className="font-display text-display-lg">
            Who&apos;s behind the reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {TEAM.map((person) => (
            <div key={person.name}>
              {/* Placeholder avatar */}
              <div className="w-20 h-20 bg-cream-300 rounded-full mb-4" />
              <h3 className="font-display text-display-sm mb-1">{person.name}</h3>
              <p className="text-label-xs uppercase text-hermes tracking-wider mb-3">
                {person.role}
              </p>
              <p className="text-[0.875rem] text-charcoal-light leading-relaxed">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-14">
        <div className="container-site text-center">
          <h2 className="font-display text-display-lg mb-4">
            Questions, tips, or corrections?
          </h2>
          <p className="text-[0.9375rem] text-charcoal-light max-w-lg mx-auto mb-8 leading-relaxed">
            If you&apos;re a parent with a school recommendation, a head of school
            who wants to update your profile, or a journalist who wants to talk —
            we&apos;d like to hear from you.
          </p>
          <Link
            href="/contact/"
            className="inline-block bg-hermes text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
