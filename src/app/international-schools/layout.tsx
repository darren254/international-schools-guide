import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore International Schools — Jakarta",
  description:
    "Browse and filter 66 international schools in Jakarta by curriculum, location, and fees. Compare IB, British, Australian and other curricula. Honest editorial reviews.",
};

export default function InternationalSchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
