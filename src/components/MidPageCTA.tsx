import Link from "next/link";

export default function MidPageCTA() {
  return (
    <section className="bg-charcoal py-14 px-6 text-center mb-20">
      <h2 className="font-display text-display-lg text-cream-50 mb-3">
        Not sure where to start?
      </h2>
      <p className="text-cream-400 text-[0.9375rem] max-w-lg mx-auto mb-8 leading-relaxed">
        Use our side-by-side comparison tool to weigh fees, results, and
        reviews - or save schools to your shortlist and come back later.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/compare"
          className="bg-hermes hover:bg-hermes-hover text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-colors"
        >
          Compare Schools
        </Link>
        <Link
          href="/shortlist"
          className="border border-cream-400 hover:border-cream-50 text-cream-50 px-8 py-3.5 text-sm font-medium uppercase tracking-wider transition-colors"
        >
          Start Your Shortlist
        </Link>
      </div>
    </section>
  );
}
