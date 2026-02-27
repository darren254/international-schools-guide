import Link from "next/link";
import { CITIES } from "@/data/cities";
import { FAQAccordion } from "./FAQAccordion";

export type FAQItem = {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
};

const cityList = CITIES.map((c) => c.name).join(", ");

function buildFAQs(): FAQItem[] {
  return [
    {
      question: "How much do international schools cost?",
      answer: `Fees vary widely - from around US$5,000 to over US$40,000 per year depending on the city, curriculum, and age group. Jakarta and Kuala Lumpur tend to be more affordable, while Singapore and Hong Kong are among the most expensive in Asia. We break down the fees for every school in our directory so you can compare easily.`,
      links: CITIES.map((c) => ({
        label: c.name,
        href: `/international-schools/${c.slug}/`,
      })),
    },
    {
      question: `What are the best international schools in ${CITIES[0]?.name ?? "your city"}?`,
      answer: `It depends on what matters most to your family - curriculum, budget, location, or community. We rank and review schools across ${cityList} based on multiple factors so you can find the right fit, not just the most expensive option.`,
      links: CITIES.map((c) => ({
        label: c.name,
        href: `/international-schools/${c.slug}/`,
      })),
    },
    {
      question: "What's the difference between IB, British, and American curricula?",
      answer:
        "The IB Diploma focuses on breadth and independent thinking. British schools follow IGCSEs and A-Levels with more specialisation. American schools use a GPA and AP credit system. Each has strengths depending on your child's learning style and where they might go to university.",
      links: [
        {
          label: "Curriculum comparison",
          href: "/insights/ib-vs-a-levels-international-schools",
        },
      ],
    },
    {
      question: "How do I choose an international school?",
      answer:
        "Start with your budget and preferred curriculum, then shortlist by location and age range. Visit schools, ask about teacher turnover, check accreditation, and talk to other parents. We've built our directory to help you filter and compare so you don't have to do it all manually.",
      links: [
        {
          label: "Compare schools",
          href: "/compare",
        },
      ],
    },
  ];
}

export default function FAQ() {
  const faqs = buildFAQs();

  return (
    <section className="bg-cream py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-display-lg text-center mb-10">
          Frequently asked questions
        </h2>
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  );
}

export function buildFAQJsonLd() {
  const faqs = buildFAQs();

  const staticEntries = [faqs[0], faqs[2], faqs[3]].filter(Boolean).map((faq) => ({
    "@type": "Question" as const,
    name: faq!.question,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: faq!.answer,
    },
  }));

  const perCityEntries = CITIES.map((city) => ({
    "@type": "Question" as const,
    name: `What are the best international schools in ${city.name}?`,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: `It depends on what matters most to your family - curriculum, budget, location, or community. We rank and review schools in ${city.name} based on multiple factors so you can find the right fit, not just the most expensive option. See our full ${city.name} guide at international-schools-guide.com/international-schools/${city.slug}/`,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...staticEntries, ...perCityEntries],
  };
}
