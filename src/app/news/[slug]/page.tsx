import type { Metadata } from "next";
import { notFound } from "next/navigation";

const BASE_URL = "https://international-schools-guide.com";

// Static params for export - add articles as we publish them
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const canonical = `${BASE_URL}/news/${slug}`;
  return {
    title: "News",
    description:
      "The latest news and analysis on international schools.",
    alternates: { canonical },
    openGraph: {
      title: "News - International Schools Guide",
      description:
        "The latest news and analysis on international schools.",
      url: canonical,
      type: "article",
    },
  };
}

export default function ArticlePage() {
  notFound();
}
