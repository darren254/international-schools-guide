import type { Metadata } from "next";
import Link from "next/link";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { SCHOOL_PROFILES } from "@/data/schools";
import { getPublishedArticle } from "@/lib/insights/registry";

const BASE_URL = "https://international-schools-guide.com";

// Static params for export — generated from published articles
export async function generateStaticParams() {
  const { getPublishedArticles } = await import("@/lib/insights/registry");
  const articles = await getPublishedArticles();
  
  // Always include hardcoded articles
  const hardcoded = [{ slug: "best-international-schools-jakarta" }];
  
  // Add published articles from drafts
  const published = articles.map((a) => ({ slug: a.slug }));
  
  return [...hardcoded, ...published];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${BASE_URL}/insights/${slug}`;
  
  // Hardcoded articles
  if (slug === "best-international-schools-jakarta") {
    return {
      title: "Best International Schools in Jakarta (2025) - The Expat Family Guide",
      description:
        "Jakarta has 66 international schools serving expat families. Compare fees, curricula, and locations. Honest guide to JIS, BSJ, AIS, and 60+ other options.",
      alternates: { canonical },
      openGraph: {
        title: "Best International Schools in Jakarta (2025) - The Expat Family Guide",
        description:
          "Jakarta has 66 international schools serving expat families. Compare fees, curricula, and locations. Honest guide to JIS, BSJ, AIS, and 60+ other options.",
        url: canonical,
        type: "article",
      },
    };
  }
  
  // Published articles from drafts
  const article = await getPublishedArticle(slug);
  if (article) {
    return {
      title: article.title,
      description: article.summary,
      alternates: { canonical },
      openGraph: {
        title: article.title,
        description: article.summary,
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
// JAKARTA GUIDE CONTENT
// ═══════════════════════════════════════════════════════

function JakartaGuide() {
  // Group schools by category
  const mostRecommended = JAKARTA_SCHOOLS.filter(
    (s) => ["jakarta-intercultural-school", "british-school-jakarta", "sinarmas-world-academy", "australian-independent-school-jakarta"].includes(s.slug)
  );
  
  const britishSchools = JAKARTA_SCHOOLS.filter((s) =>
    s.curricula.some((c) => c.toLowerCase().includes("british") || c.toLowerCase().includes("cambridge") || c.toLowerCase().includes("igcse") || c.toLowerCase().includes("a-level"))
  ).slice(0, 8);
  
  const mostAccessible = JAKARTA_SCHOOLS.filter((s) => {
    const fees = s.feeRange.match(/\$(\d+\.?\d*)K/);
    if (!fees) return false;
    const low = parseFloat(fees[1]);
    return low >= 5 && low <= 12;
  }).slice(0, 6);
  
  const earlyYears = JAKARTA_SCHOOLS.filter((s) => {
    const ageStart = parseInt(s.ageRange.split("–")[0]);
    return ageStart <= 2;
  }).slice(0, 6);
  
  const mostAffordable = JAKARTA_SCHOOLS.filter((s) => {
    const fees = s.feeRange.match(/\$(\d+\.?\d*)K/);
    if (!fees) return false;
    const low = parseFloat(fees[1]);
    return low < 5;
  }).slice(0, 5);

  return (
    <>
      {/* ─── Back link ─── */}
      <div className="container-site pt-6">
        <Link
          href="/insights"
          className="text-sm text-charcoal-muted hover:text-hermes transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> Back to Insights
        </Link>
      </div>

      {/* ─── Article ─── */}
      <article className="w-full">
        {/* NYT Style: Narrow Centered Column */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[680px] px-5 md:px-8 pt-6 pb-16">
            {/* Headline */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-tight mb-8">
              Best International Schools in Jakarta (2025) - The Expat Family Guide
            </h1>

            {/* Article body */}
            <div className="article-content">
              {/* Jakarta for Expat Families */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 first:mt-0 uppercase tracking-wider">
                Jakarta for Expat Families
              </h2>
              <p>
                Jakarta is home to 66 international schools, the largest concentration in Southeast Asia outside Singapore. The city has 10.5 million residents, with an expat population estimated at 100,000. Bahasa Indonesia is the official language, but English is widely spoken in business districts and international schools. Most expat families live in South Jakarta — Kemang, Pondok Indah, Cilandak — or in Greater Jakarta developments like BSD City and Bintaro.
              </p>
              <p>
                Jakarta sits in a tropical climate zone. The wet season runs from November to March, bringing daily afternoon storms and occasional flooding. Air quality is poor year-round, with AQI readings often above 150. Traffic congestion is severe. A 10-kilometre drive can take 90 minutes during rush hour. Most expat families choose a school first, then find housing nearby to minimise commute time.
              </p>
              <p>
                Cost of living is moderate compared to Singapore or Hong Kong. A three-bedroom house in Kemang rents for US$2,500 to US$4,500 per month. Groceries cost roughly 30% less than London or Sydney. School fees range from US$2,400 to US$37,000 per year. Corporate relocation packages typically cover JIS or BSJ. Self-funding families often choose mid-tier options like AIS, Mentari, or Global Jaya.
              </p>
            </section>

            {/* Where Expat Families Live */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                Where Expat Families Live in Jakarta
              </h2>
              <p>
                <strong>Kemang</strong> is the most popular area for expat families. It sits in South Jakarta, 15 minutes from JIS and 20 minutes from AIS. Rent for a three-bedroom house ranges from US$3,000 to US$5,500 per month. The area has international restaurants, English-speaking GPs, and a strong expat community. Traffic to central Jakarta is heavy, but families rarely need to leave the area for daily needs. The tradeoff: Kemang is expensive and lacks green space.
              </p>
              <p>
                <strong>Pondok Indah</strong> offers larger houses and better value than Kemang. A three-bedroom house rents for US$2,500 to US$4,500 per month. The area is 10 minutes from JIS Pattimura campus and 15 minutes from AIS. Pondok Indah Mall provides shopping and dining. The school run is easier than Kemang, but the area feels less connected to Jakarta's expat scene. Families here tend to socialise through school networks rather than neighbourhood groups.
              </p>
              <p>
                <strong>BSD City</strong> sits in South Tangerang, 30 kilometres south of central Jakarta. Rent is lower (US$1,500 to US$3,000 for a three-bedroom house) and the area has newer infrastructure. BSJ, Sinarmas World Academy, and Binus School Serpong are nearby. The commute to central Jakarta takes 60 to 90 minutes during rush hour. Families who work in BSD or can work remotely find it suits them. Those with central Jakarta offices often find the commute unsustainable.
              </p>
              <p>
                <strong>Cilandak</strong> is close to JIS Cilandak campus and sits in South Jakarta. Rent ranges from US$2,000 to US$4,000 per month. The area is quieter than Kemang and has better air quality. Families here are mostly JIS families who prioritise a short commute. The tradeoff: Cilandak has fewer international amenities and feels isolated from Jakarta's expat hubs.
              </p>
              <p>
                <strong>Bintaro</strong> is home to BSJ and sits in South Tangerang. Rent is US$1,800 to US$3,500 per month. The area has good schools, shopping malls, and a growing expat community. The commute to central Jakarta takes 40 to 60 minutes. Families choose Bintaro for BSJ proximity and lower costs than South Jakarta. The area lacks the density of expat services found in Kemang.
              </p>
            </section>

            {/* The Best International Schools */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                The Best International Schools in Jakarta
              </h2>
              <p className="mb-6">
                Jakarta has 66 international schools. The following are the ones expat families most often recommend, grouped by what they offer.
              </p>

              <h3 className="font-display text-xl md:text-2xl text-charcoal mb-4 mt-8">
                Most Recommended
              </h3>
              
              {mostRecommended.map((school) => {
                const hasProfile = school.slug in SCHOOL_PROFILES;
                return (
                  <div key={school.slug} className="mb-6">
                    <p>
                      {hasProfile ? (
                        <Link href={`/international-schools/jakarta/${school.slug}/`} className="font-semibold text-hermes hover:underline">
                          {school.name}
                        </Link>
                      ) : (
                        <strong>{school.name}</strong>
                      )}{" "}
                      ({school.area}) offers {school.curricula.join(", ")} for ages {school.ageRange}. Fees range from {school.feeRange} per year. {school.editorialSummary}
                    </p>
                  </div>
                );
              })}

              <h3 className="font-display text-xl md:text-2xl text-charcoal mb-4 mt-8">
                Best British Curriculum Schools in Jakarta
              </h3>
              
              {britishSchools.map((school) => {
                const hasProfile = school.slug in SCHOOL_PROFILES;
                return (
                  <div key={school.slug} className="mb-6">
                    <p>
                      {hasProfile ? (
                        <Link href={`/international-schools/jakarta/${school.slug}/`} className="font-semibold text-hermes hover:underline">
                          {school.name}
                        </Link>
                      ) : (
                        <strong>{school.name}</strong>
                      )}{" "}
                      ({school.area}) offers {school.curricula.join(", ")} for ages {school.ageRange}. Fees range from {school.feeRange} per year. {school.editorialSummary}
                    </p>
                  </div>
                );
              })}

              <h3 className="font-display text-xl md:text-2xl text-charcoal mb-4 mt-8">
                Most Accessible - Realistic Admissions
              </h3>
              
              {mostAccessible.map((school) => {
                const hasProfile = school.slug in SCHOOL_PROFILES;
                return (
                  <div key={school.slug} className="mb-6">
                    <p>
                      {hasProfile ? (
                        <Link href={`/international-schools/jakarta/${school.slug}/`} className="font-semibold text-hermes hover:underline">
                          {school.name}
                        </Link>
                      ) : (
                        <strong>{school.name}</strong>
                      )}{" "}
                      ({school.area}) offers {school.curricula.join(", ")} for ages {school.ageRange}. Fees range from {school.feeRange} per year. {school.editorialSummary}
                    </p>
                  </div>
                );
              })}

              <h3 className="font-display text-xl md:text-2xl text-charcoal mb-4 mt-8">
                Best for Early Years
              </h3>
              
              {earlyYears.map((school) => {
                const hasProfile = school.slug in SCHOOL_PROFILES;
                return (
                  <div key={school.slug} className="mb-6">
                    <p>
                      {hasProfile ? (
                        <Link href={`/international-schools/jakarta/${school.slug}/`} className="font-semibold text-hermes hover:underline">
                          {school.name}
                        </Link>
                      ) : (
                        <strong>{school.name}</strong>
                      )}{" "}
                      ({school.area}) accepts children from age {school.ageRange.split("–")[0]}. Fees range from {school.feeRange} per year. {school.editorialSummary}
                    </p>
                  </div>
                );
              })}

              <h3 className="font-display text-xl md:text-2xl text-charcoal mb-4 mt-8">
                Most Affordable
              </h3>
              
              {mostAffordable.map((school) => {
                const hasProfile = school.slug in SCHOOL_PROFILES;
                return (
                  <div key={school.slug} className="mb-6">
                    <p>
                      {hasProfile ? (
                        <Link href={`/international-schools/jakarta/${school.slug}/`} className="font-semibold text-hermes hover:underline">
                          {school.name}
                        </Link>
                      ) : (
                        <strong>{school.name}</strong>
                      )}{" "}
                      ({school.area}) offers {school.curricula.join(", ")} for ages {school.ageRange}. Fees range from {school.feeRange} per year. {school.editorialSummary}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Fees */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                International School Fees in Jakarta
              </h2>
              <p>
                Premium schools charge US$23,000 to US$37,000 per year. JIS tops the range at US$23,000 to US$37,000. BSJ charges US$9,200 to US$30,000. Sinarmas World Academy charges US$9,300 to US$28,000. These fees typically include tuition, technology, and basic activities. Registration fees range from US$500 to US$2,000. Building or development fees add US$2,000 to US$5,000 as a one-time payment. Sibling discounts are rare. Most schools charge full fees for each child.
              </p>
              <p>
                Mid-range schools charge US$5,000 to US$15,000 per year. AIS charges US$9,300 to US$27,000. Mentari Intercultural School charges US$5,600 to US$14,000. Global Jaya School charges US$4,900 to US$13,000. Fees include tuition and basic facilities. Registration fees are US$300 to US$1,000. Some schools waive building fees for early payment or offer payment plans.
              </p>
              <p>
                Accessible schools charge US$2,400 to US$8,000 per year. SIS Kelapa Gading charges US$2,400 to US$10,000. Sampoerna Academy charges US$1,600 to US$11,000 and does not charge building fees. Gandhi Memorial International School charges US$3,000 to US$8,600. Fees are lower, but facilities and teacher qualifications may be more limited. Always visit before enrolling.
              </p>
            </section>

            {/* Waiting Lists */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                Waiting Lists and Admissions Reality
              </h2>
              <p>
                JIS uses a three-lane application system. Lanes 1 and 2 have no deadlines. Apply anytime. Lane 3 has a fixed deadline of March 1st for August enrollment. If a grade level is full, applications are held until space opens. JIS prioritises children of US, UK, and Australian embassy employees, then siblings of current students, then alumni children.
              </p>
              <p>
                ISJ recommends applying early to secure preferred start dates. Entry to Pre-Nursery, Nursery, and Reception is non-selective. Year 1 and above require entrance assessments. Applications can be submitted up to two years in advance. If no immediate space is available, children are placed on a waiting list.
              </p>
              <p>
                [RESEARCH NEEDED: Specific wait times by year group from Jakarta Expats Facebook group and Reddit threads as of early 2025. Need verified reports of actual wait durations, not just school policy statements.]
              </p>
            </section>

            {/* Life Outside School */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                Life Outside School: Hospitals, Activities and Where Families Go
              </h2>
              <p>
                Premier Jatinegara Hospital is the most recommended for expat families. It has international accreditation and International Patient Relations officers who handle communication with foreign patients. The hospital offers cardiology, neurosurgery, digestive care, and pediatrics. Rumah Sakit Pondok Indah Group operates multiple locations (Pondok Indah, Puri Indah, Bintaro) with English-speaking staff and family-friendly care. Siloam Hospitals has branches in Kebon Jeruk, Mampang, Semanggi, and South Jakarta, offering 24-hour emergency service, maternity wards, pediatrics, ICU, and NICU. Most expat families register with a GP clinic before emergencies arise. International Wellbeing Center provides counseling and therapy in English, French, Indonesian, and Korean.
              </p>
              <p>
                Swimming lessons and water activities are available at The Wave Water Park in Pondok Indah, plus water parks in Lippo Cikarang and Pantai Indah Kapuk. Indoor activities include SuperPark Indonesia in Pondok Indah, a Finnish activity park with trampolines, climbing walls, and obstacle courses. KidZania Jakarta at Pacific Place offers 100-plus job simulations in an immersive mini-city. Houbii Spot in Pondok Indah has ropes courses and trampolines. Pororo Park and Kidzooona suit younger children with soft play areas. Sky Rink at Mall Taman Anggrek offers ice skating lessons and hockey teams. JIS Academy runs after-school programs in badminton, baseball, basketball, and soccer. Jakarta Cricket Association runs the JCA Colts League for children's inter-school competitions. Ragunan Zoo in Pasar Minggu is best visited early morning to see the Schmutzer Primate Center.
              </p>
              <p>
                Kemang is the main expat social hub. Restaurants cluster along Jalan Kemang Raya, making it easy to socialise without driving between venues. Amigos serves Tex-Mex and is famous for margaritas. El Asador offers South American cuisine with 50-plus wine options. Warung Turki serves authentic Turkish food with live music. Mamma Rosy serves casual Italian in a traditional Balinese house. Eastern Promise is a long-established Irish pub with sports bar, pool tables, beer garden, and live music. It is described as the favorite hangout for the expat community. Pondok Indah Mall provides shopping and dining for families in that area. Kemang traffic is heavy, especially Friday evenings from 5pm to 8pm and during rainstorms.
              </p>
              <p>
                InterNations Jakarta has 29,489 members and offers 17 interest-based groups plus monthly events. International Schools Parents' Association operates a Facebook group for international school parents. AIS has an active Parents & Friends Association that organises Family Fun Days and Quiz Nights, plus language-specific parent groups for European, Japanese, Korean, and Malaysian families. Most international schools offer bus services, but coverage varies by area. JIS bus service availability depends on residence location. BSJ offers bus services but adds cost. Factor bus routes into your housing decision if you plan to use school transport.
              </p>
            </section>

            {/* Cost of Living */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                Cost of Living in Jakarta for Expat Families
              </h2>
              <p>
                A three-bedroom house in Kemang or Pondok Indah rents for US$2,500 to US$5,500 per month. In BSD or Bintaro, the same house costs US$1,500 to US$3,500. Groceries cost roughly 30% less than London or Sydney. A weekly shop for a family of four costs US$150 to US$200 at supermarkets like Ranch Market or Kem Chicks. Eating out is affordable. A meal at a mid-range restaurant costs US$15 to US$30 per person. Domestic help costs US$200 to US$400 per month for a live-in helper. A driver costs US$300 to US$500 per month. School fees are the largest expense. Expect to spend US$10,000 to US$30,000 per child per year. A typical expat package covers housing, school fees for two children, and a car allowance. Self-funding families should budget US$4,000 to US$6,000 per month excluding school fees.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 mt-12 uppercase tracking-wider">
                Frequently Asked Questions
              </h2>
              
              <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 mt-6">
                What is the best international school in Jakarta?
              </h3>
              <p>
                JIS is the largest and most established, with strong IB results and extensive facilities. BSJ offers British curriculum with IB Diploma options. Sinarmas World Academy has the highest IB average scores. The best school depends on your child's needs, your budget, and your location. Visit multiple schools before deciding.
              </p>

              <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 mt-6">
                How much do international schools cost in Jakarta?
              </h3>
              <p>
                Fees range from US$2,400 to US$37,000 per year. Premium schools like JIS charge US$23,000 to US$37,000. Mid-range schools charge US$5,000 to US$15,000. Affordable options start at US$2,400. Registration fees add US$300 to US$2,000. Building fees add US$2,000 to US$5,000 as a one-time payment.
              </p>

              <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 mt-6">
                Which curriculum is better: IB or British?
              </h3>
              <p>
                British curriculum travels better for mobile families. GCSEs and A-Levels are understood by universities worldwide and transfer easily between schools. IB offers a broader, inquiry-based approach but can be harder to transfer mid-programme. Most Jakarta schools offer IB. British curriculum options include BSJ, ISJ, and several Cambridge schools.
              </p>

              <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 mt-6">
                Where do expat families live in Jakarta?
              </h3>
              <p>
                Most expat families live in South Jakarta (Kemang, Pondok Indah, Cilandak) or in Greater Jakarta developments like BSD City and Bintaro. Kemang is the most popular but expensive. BSD offers better value but a longer commute. Choose a school first, then find housing nearby to minimise commute time.
              </p>

              <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 mt-6">
                Do Jakarta schools have waiting lists?
              </h3>
              <p>
                JIS and ISJ both maintain waiting lists when grade levels are full. JIS prioritises embassy employees, siblings, and alumni children. ISJ allows applications up to two years in advance. Apply early to secure preferred start dates. [RESEARCH NEEDED: Specific wait times by year group from Jakarta Expats Facebook group and Reddit as of early 2025.]
              </p>

              <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 mt-6">
                What is the traffic like for school commutes?
              </h3>
              <p>
                Traffic congestion is severe. A 10-kilometre drive can take 90 minutes during rush hour. Most expat families choose a school first, then find housing within 15 minutes to avoid long commutes. School bus services exist but add cost and time. Factor traffic into your school choice.
              </p>
            </section>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

function PublishedArticleView({ article }: { article: PublishedArticle }) {
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
        {/* NYT Style: Narrow Centered Column */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[680px] px-5 md:px-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3 block font-sans">
              {article.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-charcoal-muted leading-relaxed mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {article.summary}
            </p>
            <div className="flex items-center gap-3 text-sm text-charcoal-muted border-b border-warm-border pb-6 mb-8 font-sans">
              {article.author && (
                <>
                  <span className="font-medium text-charcoal">{article.author}</span>
                  <span>·</span>
                </>
              )}
              <time>{article.date}</time>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px',
                lineHeight: '1.8',
                color: '#1A1A1A',
              }}
            />
          </div>
        </div>
      </article>
    </>
  );
}

interface PublishedArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  images?: string[];
  author?: string;
  publishedAt: string;
  date: string;
  readTime: string;
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Hardcoded articles
  if (slug === "best-international-schools-jakarta") {
    return <JakartaGuide />;
  }
  
  // Check published articles from drafts
  const { getPublishedArticle } = await import("@/lib/insights/registry");
  const publishedArticle = await getPublishedArticle(slug);
  
  if (publishedArticle) {
    return <PublishedArticleView article={publishedArticle} />;
  }
  
  return (
    <div className="container-site pt-6 pb-16">
      <h1>Insight not found</h1>
    </div>
  );
}
