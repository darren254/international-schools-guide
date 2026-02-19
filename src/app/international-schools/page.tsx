import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse International Schools",
  description: "Explore international schools in cities worldwide.",
};

export default function SchoolsIndexPage() {
  return (
    <div className="container-site py-16">
      <h1 className="font-display text-display-xl font-medium mb-4">
        Explore Schools
      </h1>
      <p className="text-charcoal-light">Schools index — city grid. Coming next.</p>
    </div>
  );
}
