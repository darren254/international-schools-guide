import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for International Schools Guide.",
};

export default function TermsPage() {
  return (
    <div className="container-site py-16">
      <h1 className="font-display text-display-lg font-medium mb-6">Terms of Use</h1>
      <p className="text-charcoal-muted text-[0.9375rem] leading-relaxed">
        This page will be updated with our terms of use. For questions, contact darren@schoolstrust.co.uk.
      </p>
    </div>
  );
}
