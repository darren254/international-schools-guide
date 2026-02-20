import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for International Schools Guide.",
};

export default function PrivacyPage() {
  return (
    <div className="container-site py-16">
      <h1 className="font-display text-display-lg font-medium mb-6">Privacy Policy</h1>
      <p className="text-charcoal-muted text-[0.9375rem] leading-relaxed">
        This page will be updated with our privacy policy. For questions, contact darren@schoolstrust.co.uk.
      </p>
    </div>
  );
}
