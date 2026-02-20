import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Schools",
  description:
    "Compare international schools in Jakarta side by side. Fees, curricula, exam results, and our editorial verdict. Select up to 4 schools.",
  alternates: { canonical: "https://international-schools-guide.com/compare" },
  openGraph: {
    title: "Compare Schools — International Schools Guide",
    description:
      "Compare international schools in Jakarta side by side. Fees, curricula, exam results, and our editorial verdict. Select up to 4 schools.",
    url: "https://international-schools-guide.com/compare",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
