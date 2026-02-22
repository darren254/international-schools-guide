import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore International Schools - Jakarta",
  description:
    "Browse and filter 66 international schools in Jakarta by curriculum, location, and fees. Compare IB, British, Australian and other curricula. Honest editorial reviews.",
  alternates: { canonical: "https://international-schools-guide.com/international-schools" },
  openGraph: {
    title: "Explore International Schools - Jakarta - International Schools Guide",
    description:
      "Browse and filter 66 international schools in Jakarta by curriculum, location, and fees. Compare IB, British, Australian and other curricula. Honest editorial reviews.",
    url: "https://international-schools-guide.com/international-schools",
  },
};

export default function InternationalSchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
