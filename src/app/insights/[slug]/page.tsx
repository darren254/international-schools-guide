import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SortableSchoolsTableSection1, SortableSchoolsTableSection2 } from "@/components/insights/SortableSchoolsTable";
import { ShareButton } from "@/components/share/ShareButton";
import {
  SECTION1_POPULAR_SCHOOLS,
  SECTION2_ALL_SCHOOLS,
} from "./jakarta-guide-data";

const BASE_URL = "https://international-schools-guide.com";

const INSIGHT_SLUGS = ["best-international-schools-jakarta"] as const;

export async function generateStaticParams() {
  return INSIGHT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${BASE_URL}/insights/${slug}`;
  
  if (slug === "best-international-schools-jakarta") {
    return {
      title: "International Schools in Jakarta — A Practical Guide for Expat Families (2026)",
      description:
        "More than 60 international schools in Jakarta; most families choose between five. Compare fees, curricula, and locations. Honest guide to JIS, BSJ, ISJ, AIS, and 60+ options.",
      alternates: { canonical },
      openGraph: {
        title: "International Schools in Jakarta — A Practical Guide for Expat Families (2026)",
        description:
          "More than 60 international schools in Jakarta; most families choose between five. Compare fees, curricula, and locations. Honest guide to JIS, BSJ, ISJ, AIS, and 60+ options.",
        url: canonical,
        type: "article",
      },
    };
  }
  
  return {
    title: "Insight Article",
    alternates: { canonical },
  };
}

// ═══════════════════════════════════════════════════════
// Image placeholders — bg #e8e4df, label #999 13px, rounded 4px. Mobile: floats clear, full width, mb-20
// ═══════════════════════════════════════════════════════

function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded bg-[#e8e4df] font-sans text-[13px] text-[#999] ${className}`}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// JAKARTA GUIDE CONTENT — 2026 Edition
// ═══════════════════════════════════════════════════════

function JakartaGuide() {
  return (
    <>
      <div className="container-site pt-6">
        <Link
          href="/insights"
          className="text-sm text-charcoal-muted hover:text-hermes transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> Back to Insights
        </Link>
      </div>

      <article className="w-full">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[680px] px-5 md:px-8 pt-6 pb-16">
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-tight mb-2">
              International Schools in Jakarta
            </h1>
            <p className="font-display text-xl text-charcoal-muted mb-8">
              A Practical Guide for Expat Families — 2026 Edition
            </p>

            {/* Share */}
            <ShareButton
              variant="article"
              url={`${BASE_URL}/insights/best-international-schools-jakarta`}
              title="International Schools in Jakarta — A Practical Guide for Expat Families (2026)"
            />

            {/* Author */}
            <div className="flex items-center gap-4 mt-8 mb-10 pb-8 border-b border-warm-border">
              <Image
                src="/images/mia-windsor.png"
                alt="Mia Windsor"
                width={80}
                height={80}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-sans font-semibold text-charcoal">Mia Windsor</p>
                <p className="font-sans text-sm text-charcoal-muted">Managing Editor</p>
                <a
                  href="https://bsky.app/profile/mia-isg.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-hermes hover:underline mt-1 inline-flex items-center gap-1"
                >
                  @mia-isg.bsky.social
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 4.278c0 1.197.378 2.042.646 2.481.268.439 1.072.878 2.392 1.757C4.273 9.505 6.006 10.794 12 15.689c5.994-4.895 7.727-6.184 8.962-7.173 1.32-.879 2.124-1.318 2.392-1.757.268-.439.646-1.284.646-2.481 0-1.198-.139-2.37-.902-2.713-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Hero image placeholder */}
            <ImagePlaceholder
              label="Hero — Jakarta aerial or school campus"
              className="mb-10 w-full max-w-[800px] h-[220px] md:h-[450px]"
            />

            {/* TL;DR */}
            <div className="bg-cream-50 border-l-4 border-hermes py-4 px-5 mb-10 font-sans">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-2">TL;DR</p>
              <p className="text-charcoal leading-relaxed">
                Jakarta has 60+ international schools but geography and school community narrows most families to four or five. Pick your school first, then find a house within 20–25 minutes. The traffic is brutal. JIS is the American behemoth with the best facilities. Top British options are ISJ (new and expanding) and BSJ (full K-12 but a punishing commute from Bintaro). AIS might be the warmest culture and best for SEN. Fees run US$9K–$37K.
              </p>
            </div>

            {/* Table of contents */}
            <nav className="font-sans mb-10 pb-8 border-b border-warm-border" aria-label="Article contents">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">Contents</p>
              <ul className="space-y-2 text-sm text-charcoal">
                <li><a href="#schools-popular" className="text-hermes hover:underline">Schools Popular with Expats</a></li>
                <li><a href="#jis" className="text-hermes hover:underline">JIS</a> · <a href="#bsj" className="text-hermes hover:underline">BSJ</a> · <a href="#isj" className="text-hermes hover:underline">ISJ</a> · <a href="#ais" className="text-hermes hover:underline">AIS</a> · <a href="#nas" className="text-hermes hover:underline">NAS</a> · <a href="#nzsj" className="text-hermes hover:underline">NZSJ</a></li>
                <li><a href="#compare-all" className="text-hermes hover:underline">Compare All 66 Schools</a></li>
                <li><a href="#neighbourhoods" className="text-hermes hover:underline">Popular Expat Neighbourhoods</a></li>
                <li><a href="#faq" className="text-hermes hover:underline">Frequently Asked Questions</a></li>
                <li><a href="#final-note" className="text-hermes hover:underline">A Final Note</a></li>
              </ul>
            </nav>

            <div className="article-content">
              {/* Intro */}
              <p>
                More than 60 international schools, and most families end up choosing between five. That's the first thing worth saying about Jakarta's school market. The complexity dissolves pretty quickly once you understand that geography eliminates most of your options before curriculum even enters the conversation. As is the case in most places nowadays the international label doesn't necessarily mean an internationally diverse student body. Not a problem in itself but worth knowing before you drive 45 minutes or more for a campus tour. Fees are a surprise to some. Although not as high as regional hubs such as Singapore or Hong Kong, some parents still sometimes flinch. Annual tuition can run past US$35,000 a year. Before various other fees are added.
              </p>
              <p>
                Three things usually determine which school you end up at. Jakarta's traffic is uniquely punishing, worse consistently than Bangkok, KL, or Singapore. A school 10 kilometres away can mean a 90-minute school run at 7.30am. The rule veterans live by: nothing over 20 to 30 minutes each way. Of course you choose the school before you choose the house. Second is school vibe and curriculum. Among the most common choices are JIS which is the most American, ISJ and BSJ both British, and the Australian school. Another is size. Jakarta has 2,500 student mega-campuses and 300 to 500 student schools where the head knows every child's name.
              </p>

              {/* Schools Popular with Expats — interactive table */}
              <section>
                <h2 id="schools-popular" className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 first:mt-0 uppercase tracking-wider scroll-mt-24">
                  Schools Popular with Expats
                </h2>
                <SortableSchoolsTableSection1 rows={SECTION1_POPULAR_SCHOOLS} />
              </section>

              {/* School profiles: JIS, BSJ, ISJ, AIS, NAS, NZSJ */}
              <section>
                <h2 id="jis" className="font-display text-2xl text-charcoal mt-12 mb-4 scroll-mt-24">
                  Jakarta Intercultural School (JIS)
                </h2>
                <p>
                  Founded in 1951, now around 2,500 students across three South Jakarta campuses, 60-plus nationalities, an IB average of 35.8 with a 97.5 per cent pass rate. Facilities that wouldn't embarrass a small American university. Multiple pools, theatres, a purpose-built special education centre. For families on a full corporate package.
                </p>
                <ImagePlaceholder
                  label="JIS — campus scale or facilities"
                  className="mb-5 w-full h-[220px] max-md:clear-both max-md:float-none md:ml-6 md:h-[280px] md:w-[400px] md:float-right md:flex-shrink-0"
                />
                <p>
                  Two caveats deserve attention. For many, JIS is at its core, an American-culture school. The campus atmosphere reflects that: loud, confident, sports-obsessed in the American sense, with homecoming, prom, and a social hierarchy that will feel immediately familiar to some. For quiet children the cultural adjustment is worth factoring in. The second issue is the campus geography itself. Three separate sites may mean an awkward commute for some families with children across different sites. Alumni reach Stanford, Cornell, Berkeley with some regularity.
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm font-sans sm:grid-cols-2 sm:gap-x-6">
                  <dt className="font-medium text-charcoal">Curriculum</dt>
                  <dd className="text-charcoal-muted">American (JIS Diploma) / IB Diploma / AP</dd>
                  <dt className="font-medium text-charcoal">Ages</dt>
                  <dd className="text-charcoal-muted">3–18 (Pre-K to Grade 12)</dd>
                  <dt className="font-medium text-charcoal">Fees</dt>
                  <dd className="text-charcoal-muted">US$23,000 – US$37,000 + annual capital levy approx. US$4,100</dd>
                  <dt className="font-medium text-charcoal">Location</dt>
                  <dd className="text-charcoal-muted">Cilandak / Pondok Indah / Pattimura, South Jakarta</dd>
                </dl>
              </section>

              <section>
                <h2 id="bsj" className="font-display text-2xl text-charcoal mt-12 mb-4 scroll-mt-24">
                  British School Jakarta (BSJ)
                </h2>
                <p>
                  BSJ sits on an 18-hectare campus in Bintaro. A hybrid British-to-IB dual pathway, CIS-accredited, and COBIS-affiliated. Sport and performing arts taken seriously alongside academics. A community warmth that doesn't always exist at larger schools.
                </p>
                <ImagePlaceholder
                  label="BSJ — Bintaro campus"
                  className="mb-5 w-full h-[220px] max-md:clear-both max-md:float-none md:mr-6 md:h-[280px] md:w-[400px] md:float-left md:flex-shrink-0"
                />
                <p>
                  Bintaro, though. That's the conversation that follows. Located in South Tangerang, about 18 kilometres from the Kemang and Pondok Indah expat heartlands. Those 18 kilometres translate to 60 to 90 minutes each way in Jakarta traffic. Many families who love BSJ endure the commute. Some burn out and switch schools after a year. BSJ has seen leadership turbulence in recent years, with a newer senior team than the school's established reputation might suggest. Worth asking about directly. And on wellbeing culture: BSJ markets it prominently, but some teacher voices suggest the reality is more variable than the branding implies.
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm font-sans sm:grid-cols-2 sm:gap-x-6">
                  <dt className="font-medium text-charcoal">Curriculum</dt>
                  <dd className="text-charcoal-muted">British (EYFS / National Curriculum) / IB Diploma</dd>
                  <dt className="font-medium text-charcoal">Ages</dt>
                  <dd className="text-charcoal-muted">2–18</dd>
                  <dt className="font-medium text-charcoal">Fees</dt>
                  <dd className="text-charcoal-muted">US$9,200 – US$30,000 + enrollment deposit IDR 30M</dd>
                  <dt className="font-medium text-charcoal">Location</dt>
                  <dd className="text-charcoal-muted">Bintaro Sektor 9, South Tangerang (NOT central Jakarta)</dd>
                </dl>
              </section>

              <section>
                <h2 id="isj" className="font-display text-2xl text-charcoal mt-12 mb-4 scroll-mt-24">
                  The Independent School of Jakarta (ISJ)
                </h2>
                <p>
                  The most recent addition to Jakarta's premium school set. Around 200 students and growing. Very much a British independent school ethos and faculty. Parents have raved about the teachers. Part of The Schools Trust (UK), 100% British-qualified teacher body, fees that include materials and capital contribution in a single all-in figure.
                </p>
                <ImagePlaceholder
                  label="ISJ — classroom or teacher with student"
                  className="mb-5 w-full h-[220px] max-md:clear-both max-md:float-none md:ml-6 md:h-[280px] md:w-[400px] md:float-right md:flex-shrink-0"
                />
                <p>
                  ISJ is still growing, and with that comes the smaller school experience. The tight-knit community, the teachers who know every child, the sense that nothing falls through the cracks. On the other hand, there is a more limited range of sports, activities, and social breadth that a larger campus naturally provides. For many families that trade off is worth it, particularly for younger children. And the trajectory is clearly upward: a second campus next door is planned, extending all the way through to A-Levels, backed by The Schools Trust's long track record of placing students at leading universities across the UK, the US and Australia.
                </p>
                <div className="flex flex-wrap gap-4 max-md:clear-both md:gap-[4%]">
                  <ImagePlaceholder
                    label="ISJ — football pitch"
                    className="mb-5 h-[220px] w-full md:mb-0 md:w-[48%]"
                  />
                  <ImagePlaceholder
                    label="ISJ — swimming pool"
                    className="mb-5 h-[220px] w-full md:mb-0 md:w-[48%]"
                  />
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm font-sans sm:grid-cols-2 sm:gap-x-6">
                  <dt className="font-medium text-charcoal">Curriculum</dt>
                  <dd className="text-charcoal-muted">British (EYFS / English National Curriculum)</dd>
                  <dt className="font-medium text-charcoal">Ages</dt>
                  <dd className="text-charcoal-muted">2–13 (Pre-Nursery to Year 8)</dd>
                  <dt className="font-medium text-charcoal">Fees</dt>
                  <dd className="text-charcoal-muted">US$9,200 – US$30,000 (all-in, including materials and capital contribution)</dd>
                  <dt className="font-medium text-charcoal">Location</dt>
                  <dd className="text-charcoal-muted">Pondok Indah, South Jakarta</dd>
                </dl>
              </section>

              <section>
                <h2 id="ais" className="font-display text-2xl text-charcoal mt-12 mb-4 scroll-mt-24">
                  Australian Independent School Jakarta (AIS)
                </h2>
                <p>
                  Three conversations bring AIS up reliably: when parents have children with additional learning needs, when families are certain they're heading back to Australia, and when someone asks which school in Jakarta has the warmest, least pretentious culture. The Australian curriculum through Year 10 transitions into IB Diploma for senior years. CIS-accredited since 2015. Class sizes averaging 18 to 22.
                </p>
                <ImagePlaceholder
                  label="AIS — school culture or outdoor activity"
                  className="mb-5 w-full h-[220px] max-md:clear-both max-md:float-none md:mr-6 md:h-[280px] md:w-[400px] md:float-left md:flex-shrink-0"
                />
                <p>
                  Lots of people like the demographic mix at AIS. Less self consciously international than some schools, with a genuine spread of Indonesian, and other families. Most schools in Jakarta have moved this way, but AIS wears it more naturally than most. Facilities are solid without being resort-level, and the school culture is most often described as 'friendly, low-key.' Not a euphemism for mediocre. An honest description of the atmosphere. And for inclusion and SEN support specifically, it's arguably the leading choice in the city. Ask about resource teachers, educational psychologist access, and IEP processes, and you'll get clear answers.
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm font-sans sm:grid-cols-2 sm:gap-x-6">
                  <dt className="font-medium text-charcoal">Curriculum</dt>
                  <dd className="text-charcoal-muted">Australian Curriculum (ACARA) / IB Diploma</dd>
                  <dt className="font-medium text-charcoal">Ages</dt>
                  <dd className="text-charcoal-muted">3–18</dd>
                  <dt className="font-medium text-charcoal">Fees</dt>
                  <dd className="text-charcoal-muted">US$9,300 – US$27,000</dd>
                  <dt className="font-medium text-charcoal">Location</dt>
                  <dd className="text-charcoal-muted">Pejaten, South Jakarta (near Kemang)</dd>
                </dl>
              </section>

              <section>
                <h2 id="nas" className="font-display text-2xl text-charcoal mt-12 mb-4 scroll-mt-24">
                  Nord Anglia School Jakarta (NAS)
                </h2>
                <p>
                  Leafy and well worn campus below Kemang. Perhaps around 200 or so students. Compact enough that you'll know people quickly. The Nord Anglia global network brings things that sound like marketing. Some of it delivers. A school with real charm, and the community forms easily at this size.
                </p>
                <ImagePlaceholder
                  label="NAS — leafy campus"
                  className="mb-5 w-full h-[220px] max-md:clear-both max-md:float-none md:ml-6 md:h-[280px] md:w-[400px] md:float-right md:flex-shrink-0"
                />
                <p>
                  NAS is part of the Nord Anglia Education corporate group, and since March 2025 ultimately owned by a consortium led by Swedish private equity firm EQT, which completed a US$14.5 billion acquisition of the entire network. Decisions are made with group-level business logic in mind, and the teaching community fairly consistently describes that reality as 'corporate.' Not a dealbreaker for most families, but worth understanding clearly when you're weighing a school that markets itself primarily on warmth and community.
                </p>
                <p>
                  The more immediately relevant point: NAS is launching secondary provision for the first time, with a Year 7 cohort expected in 2026–27. Exciting for families who love the school and don't want to leave at Year 6. Worth tracking closely if continuity matters to your planning.
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm font-sans sm:grid-cols-2 sm:gap-x-6">
                  <dt className="font-medium text-charcoal">Curriculum</dt>
                  <dd className="text-charcoal-muted">British (EYFS / National Curriculum) / IPC</dd>
                  <dt className="font-medium text-charcoal">Ages</dt>
                  <dd className="text-charcoal-muted">18 months–12 (secondary from 2026–27)</dd>
                  <dt className="font-medium text-charcoal">Fees</dt>
                  <dd className="text-charcoal-muted">US$7,200 – US$22,000</dd>
                  <dt className="font-medium text-charcoal">Location</dt>
                  <dd className="text-charcoal-muted">Cilandak, South Jakarta</dd>
                </dl>
              </section>

              <section>
                <h2 id="nzsj" className="font-display text-2xl text-charcoal mt-12 mb-4 scroll-mt-24">
                  New Zealand School Jakarta (NZSJ)
                </h2>
                <p>
                  While trite the phrase "hidden gem" feels apt. Around 200 or so students in Kemang. A strong pastoral focus using the Te Whariki early childhood framework. Genuine commitment to wellbeing over grade pressure. Fees at the lower end for a full K-12 offering in Jakarta. The families who end up here tend not to be looking for Ivy League positioning, and they tend to be quite content with that.
                </p>
                <p>
                  The NZ curriculum is arguably less portable than others. This may matter if you're likely to move again soon. Worth thinking through before you fall in love with the school. That said, if community, a sane school run, and an environment that doesn't make children anxious about academic performance are the criteria, NZSJ deserves a proper visit, not just a browse of the website.
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm font-sans sm:grid-cols-2 sm:gap-x-6">
                  <dt className="font-medium text-charcoal">Curriculum</dt>
                  <dd className="text-charcoal-muted">New Zealand Curriculum / Te Whariki / British Curriculum</dd>
                  <dt className="font-medium text-charcoal">Ages</dt>
                  <dd className="text-charcoal-muted">1–18</dd>
                  <dt className="font-medium text-charcoal">Fees</dt>
                  <dd className="text-charcoal-muted">US$6,900 – US$22,000</dd>
                  <dt className="font-medium text-charcoal">Location</dt>
                  <dd className="text-charcoal-muted">Kemang, South Jakarta</dd>
                </dl>
              </section>

              {/* Compare All 66 — interactive table */}
              <section>
                <h2 id="compare-all" className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider scroll-mt-24">
                  Compare All 66 International Schools in Jakarta
                </h2>
                <SortableSchoolsTableSection2 rows={SECTION2_ALL_SCHOOLS} />
                <p className="text-sm text-charcoal-muted font-sans mt-4">
                  Fees are approximate annual tuition only. Excludes registration, transport, uniforms, and activity costs. May include errors. Verify directly with each school. Exchange rate used: US$1 = IDR 16,000
                </p>
              </section>

              {/* Popular Expat Neighbourhoods */}
              <section>
                <h2 id="neighbourhoods" className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider scroll-mt-24">
                  Popular Expat Neighbourhoods
                </h2>

                <ImagePlaceholder
                  label="Pondok Indah / Cilandak"
                  className="mb-5 w-full max-w-[700px] h-[200px] md:h-[380px]"
                />
                <h3 className="font-display text-lg text-charcoal mt-8 mb-3">Pondok Indah / Cilandak</h3>
                <p>
                  Suburbia. Gated compounds, better air quality than most of Jakarta, large houses with gardens, JIS and ISJ nearby. For corporate expats on full packages, Pondok Indah is where many searches begin and end. Rental for a decent three-bed house runs from around US$3,000 to US$5,000 a month. It's safe, and walkable. You'll never be far from another family navigating the same situation.
                </p>
                <p>
                  The area has good infrastructure by Jakarta standards. Reliable roads, established supermarkets, decent air quality relative to the north and west of the city, and a concentration of medical clinics and international hospitals within reasonable reach. Restaurant and café options have grown significantly in recent years, and the Saturday market at Kemang is only 15 minutes away on a quiet morning. For families arriving mid-year with children to settle quickly, the density of other recently arrived families in the same situation is genuinely useful.
                </p>

                <ImagePlaceholder
                  label="Kemang"
                  className="mb-5 w-full max-w-[700px] h-[200px] md:h-[380px]"
                />
                <h3 className="font-display text-lg text-charcoal mt-8 mb-3">Kemang</h3>
                <p>
                  Kemang is a well established, mixed residential and commercial neighbourhood in South Jakarta. Lively and vibrant, sometimes slightly on the rough side. A good density of restaurants and cafés. NAS, AIS, and NZSJ all within reasonable reach. Rents run slightly lower than Pondok Indah at around US$2,000 to US$4,000 for a three-bed property.
                </p>
                <p>
                  Worth researching carefully before you commit to a specific property… Kemang floods. Not occasionally — the area has genuine, recurring flooding risk during rainy season, and ground-floor properties and basements bear the brunt of it. Check the flood history of any specific address before signing a lease. It's not a reason to avoid the area, but it's the kind of thing that's much better to know in advance than in January.
                </p>

                <ImagePlaceholder
                  label="Bintaro / BSD City"
                  className="mb-5 w-full max-w-[700px] h-[200px] md:h-[380px]"
                />
                <h3 className="font-display text-lg text-charcoal mt-8 mb-3">Bintaro / BSD City</h3>
                <p>
                  Bintaro and BSD are planned suburban areas in Greater Jakarta. Newer builds, bigger gardens, significantly cheaper than central South Jakarta. If BSJ is your school, living in Bintaro makes obvious sense. The housing is genuinely good value for the money.
                </p>
                <p>
                  Both areas sit a long way from central Jakarta, though. The social infrastructure of Pondok Indah and Kemang requires a commitment to get to. If one or both parents are working in the SCBD financial district, add that commute on top of everything else. Bintaro to SCBD in morning traffic is a serious daily undertaking. And perhaps surprisingly given how far out they sit, air quality in Bintaro and BSD is actually worse than parts of South Jakarta closer to the city. The industrial and transport corridor effects outweigh the distance from the urban core. Plenty of families weigh all of that and still choose Bintaro happily. But go in with eyes open about what the geography means for the whole household, not just the school run.
                </p>

                <ImagePlaceholder
                  label="Menteng (Central Jakarta)"
                  className="mb-5 w-full max-w-[700px] h-[200px] md:h-[380px]"
                />
                <h3 className="font-display text-lg text-charcoal mt-8 mb-3">Menteng (Central Jakarta)</h3>
                <p>
                  The embassy district. Colonial architecture, tree-lined streets, a prestigious address by Jakarta standards. Popular with diplomatic families and senior executives. Rents are high and commute times to South Jakarta schools can be significant. Works well for families whose work keeps them in central Jakarta and who aren't tethered to a specific school zone. Gandhi Memorial International School, one of the city's oldest and most affordable international schools, is nearby.
                </p>

                <ImagePlaceholder
                  label="Kelapa Gading (North Jakarta)"
                  className="mb-5 w-full max-w-[700px] h-[200px] md:h-[380px]"
                />
                <h3 className="font-display text-lg text-charcoal mt-8 mb-3">Kelapa Gading (North Jakarta)</h3>
                <p>
                  Kelapa Gading is a growing commercial and residential area in North Jakarta. Built around one of the city's most significant Chinese-Indonesian communities and increasingly home to a growing number of mainland Chinese expats as well. That shapes the neighbourhood distinctly: the food is excellent, the commercial infrastructure is efficient, and the community has a character you won't find in other parts of the city. Rents are noticeably lower than the south. Schools serving the area include North Jakarta Intercultural School, SIS Kelapa Gading, and Beacon Academy nearby in BSD.
                </p>
                <p>
                  Worth being clear about the fit: if your working or social life is anchored in South Jakarta or SCBD, the daily cross-city travel will wear. For families whose schools, work, and lives align with the north, particularly those with Mandarin language in the household, it can be a genuinely good fit that most expat guides don't give enough credit to.
                </p>
              </section>

              {/* FAQ */}
              <section>
                <h2 id="faq" className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider scroll-mt-24">
                  Frequently Asked Questions
                </h2>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">How much does international school cost in Jakarta?</h3>
                <p>
                  The range is genuinely vast — from around US$4,500 per year at budget schools up to US$37,000 or more at JIS. Most schools that corporate-package expat families use sit in the US$9,000 to US$30,000 band. What catches nearly everyone off guard is the capital levy — an additional annual charge, typically IDR 54 to 65 million (around US$3,400 to US$4,100) at top schools, on top of tuition, and not a one-off. Budget for it every year. Factor in registration fees, uniforms, school trips, and transport if you're not driving. The total cost of a JIS education can easily exceed US$40,000 per child per year.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">British vs IB vs American — which is right for us?</h3>
                <p>
                  Think backwards from your next destination, not forwards from here. British curriculum (IGCSEs then A-Levels) is the most portable across Commonwealth countries and widely recognised internationally. IB is globally transferable and works well for families who genuinely don't know where they're heading next — but check whether the school offers both MYP and DP rather than just one. American pathway makes sense if you're returning to the US. Australian curriculum at AIS is the obvious choice for Australian families. If you're undecided, IB is the lowest-risk option for international mobility.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">School first or house first?</h3>
                <p>
                  School first. Always. Find your shortlist, secure a place, then house-hunt within 20 to 25 minutes of the campus. The families who do it the other way — find a house they love in Kemang, discover their preferred school is in Bintaro — regret it with a consistency that's striking. Jakarta's traffic is unforgiving. This is the single most consistent piece of advice from experienced expats here, and it's worth taking more seriously than it sounds.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">How bad is the commute really?</h3>
                <p>
                  Worse than you think, and then worse still in Term 2 when the novelty has worn off. Jakarta traffic ranks among the worst in Asia — consistently worse than Bangkok, KL, or Singapore in community comparisons. A school 10km away can mean 60 to 90 minutes in the morning. The '20-minute rule' is almost a mantra: more than 20 to 25 minutes each way will eventually grind you down. Families with toddlers feel it most acutely. Take the rule seriously before you dismiss it.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">Can my child start mid-year?</h3>
                <p>
                  Yes, but it's harder at the top schools. JIS and BSJ operate waitlists, especially for popular year groups, and mid-year arrival is a known pain point — apply before you arrive if at all possible. AIS, ISJ, NAS, and mid-tier schools tend to be considerably more flexible. Arriving in Jakarta without a school place and ending up at your second or third choice initially, then transferring later, is common enough that it shouldn't feel like failure.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">How far ahead should we plan?</h3>
                <p>
                  For JIS and BSJ, six to twelve months in advance ideally, especially for primary years. Other schools can often accommodate two to three months' notice, though popular year groups fill. The moment your Jakarta posting is confirmed, start the process — even registering tentative interest costs nothing and buys you time.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">We're only here for one or two years — does that change anything?</h3>
                <p>
                  It changes curriculum choice significantly. IB is the most transferable globally. British curriculum works fine if you're heading to another British-aligned school next. For a short posting, avoid schools where settling in will consume most of your time — smaller schools with stronger pastoral support (ISJ, AIS, NAS, NZSJ) tend to make that adjustment easier than giant campuses where a new child can genuinely get lost in the crowd.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">My child has additional learning needs — which schools can help?</h3>
                <p>
                  AIS is consistently the strongest recommendation for SEN and inclusion support. JIS has the JIS Learning Center — a dedicated SEN programme, though it comes at premium fees. ISJ's small class sizes (capped at 16) and high teacher-to-student ratio mean more individual attention as a structural reality, not a marketing claim. NZSJ's wellbeing focus also makes it worth visiting. Ask specific questions about resource teachers, educational psychologist access, and IEP processes at any school you're seriously considering.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">How do I know if teachers are properly qualified?</h3>
                <p>
                  At CIS-accredited schools (JIS, BSJ, AIS, SPH), teacher qualification standards are externally audited. ISJ sources teachers through The Schools Trust (UK) and specifically markets its 100% British-qualified teacher body. For non-accredited schools, ask directly: what percentage of teachers are qualified in their subject, and what qualification standard — UK QTS, Australian TRB, or equivalent? Be appropriately sceptical of any school that can't answer that question with specifics.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">Are the expensive schools actually better?</h3>
                <p>
                  Not automatically, and the data makes this reasonably clear. JIS's IB average of 35.8 is excellent. Sinarmas's 38.2 is better — and SWA isn't the most expensive school. Binus Simprug posts an IB average of 34 at roughly a third of JIS fees. What premium fees buy is brand recognition, facilities, and the social network that comes from other corporate-package families in the same situation as you. Whether those things matter depends on your family, not on any objective quality measure.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">What does admissions look like?</h3>
                <p>
                  Online application form, application fee (IDR 4 to 7 million depending on school), document submission (passports, previous school reports, immunisation records), assessment (reading and maths, typically informal at primary level and more formal at secondary), and a family interview. Then an offer letter, followed by an enrollment deposit to secure the place — IDR 30 million at BSJ. Top schools may add an enrollment guarantee fee on top. Budget around IDR 5 to 10 million in one-time costs beyond the deposit itself.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">Will my child's education transfer when we move again?</h3>
                <p>
                  IB transfers cleanly to almost anywhere in the world. British curriculum (IGCSE/A-Level) transfers well to Commonwealth countries and is recognised in the US and Europe. Australian curriculum transfers cleanly within Australia. American pathway works best for US-bound students. If you have genuinely no idea where you're heading next, lean towards IB or British curriculum at CIS-accredited schools — that accreditation is the most widely recognised external quality mark internationally.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">Is Jakarta safe for school-age children?</h3>
                <p>
                  In practical terms: yes. Street crime targeting expat children at school isn't a significant concern. Traffic is the primary physical risk — and a real one. Most schools have secure campuses and vetted transport. Air pollution is consistently underplayed in school guides, though: Jakarta has genuinely poor air quality on many days, and it's worth asking any school what their AQI threshold is for cancelling outdoor sports and whether classrooms have air filtration. Matters more for children with respiratory conditions, but worth knowing regardless.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">My child doesn't speak much English yet — what are the options?</h3>
                <p>
                  Most top international schools offer EAL (English as an Additional Language) support, though quality varies. JIS charges a significant additional fee for EAL (IDR 71 million). BSJ, AIS, and ISJ include some EAL support within their programmes. For primarily Mandarin-speaking children, Sinarmas World Academy's trilingual (English/Bahasa/Mandarin) environment is worth considering specifically. For Korean families, the Jakarta Indonesia Korean School (JIKS) serves the Korean-language community.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">I've heard the JIS incident mentioned online — should I be concerned?</h3>
                <p>
                  This refers to a 2014 safeguarding case involving staff that resulted in criminal convictions. JIS's response at the time was broadly considered appropriate, and the school has undergone significant leadership and policy changes since. It continues to surface in online expat discussions eleven years on. Raise it directly with the admissions team and ask about current safeguarding protocols. Form your own view with current information rather than headlines from 2014.
                </p>

                <h3 className="font-display text-lg text-charcoal mt-6 mb-2">Are the 'international' schools actually international in their student body?</h3>
                <p>
                  Not always — and this catches newly arriving families off guard more than almost anything else. Several well-regarded schools have student bodies that are predominantly local Indonesian, Korean, or Chinese-Indonesian rather than globally diverse. Not inherently a problem. But if your child's prior school had 40 nationalities in one classroom, the adjustment can be noticeable. Ask each school directly about nationality breakdown before you visit; most will give you an honest answer.
                </p>
              </section>

              {/* Final note */}
              <section id="final-note" className="mt-12 scroll-mt-24">
                <h2 className="font-display text-xl text-charcoal mb-4">A Final Note</h2>
                <p>
                  No guide replaces a campus visit. Read the profiles, study the fee schedules, ask the hard questions — and then go and sit in the school for an hour. Talk to the head of admissions, walk the corridors, watch how staff interact with children. The school that reads well on paper sometimes doesn't feel right in person; occasionally the reverse is true. Jakarta has genuinely good schools across a wide range of sizes, curricula, and fee levels. The right one for your family exists. Find it.
                </p>
              </section>

              {/* Footer */}
              <footer className="mt-12 pt-8 border-t border-warm-border text-sm text-charcoal-muted font-sans">
                <p>
                  This guide is published by International Schools Guide (international-schools-guide.com) with a commitment to factual accuracy and editorial independence. We don't accept payment for school rankings or placements. Fee data and school details are verified at time of publication but change frequently - always confirm directly with each school before making decisions. If you find an error or a significant change, we'd genuinely like to know.
                </p>
                <p className="mt-4">
                  Contact us through the website.
                </p>
                <p className="mt-4">
                  Exchange rate used throughout: US$1 = IDR 16,000 (February 2026 estimate). | © 2026 International Schools Guide. All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (slug === "best-international-schools-jakarta") {
    return <JakartaGuide />;
  }
  
  return (
    <div className="container-site pt-6 pb-16">
      <h1>Insight not found</h1>
    </div>
  );
}
