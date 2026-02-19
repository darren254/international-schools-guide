import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

interface ContactSectionProps {
  phone?: string;
  email?: string;
  website?: string;
}

export function ContactSection({ phone, email, website }: ContactSectionProps) {
  // Don't render section if no contact data
  if (!phone && !email && !website) return null;

  return (
    <section className="mb-16 pb-16 border-b border-warm-border-light">
      <SectionHeader label="Next Steps" title="Contact & Next Steps" id="contact" />

      <div className="p-6 bg-warm-white border border-warm-border-light">
        <div className="flex flex-wrap gap-6 mb-6">
          {phone && (
            <div className="flex items-center gap-2 text-[0.9375rem] text-charcoal-light">
              <span className="text-charcoal-muted text-sm">☎</span>
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-[0.9375rem]">
              <span className="text-charcoal-muted text-sm">✉</span>
              <a href={`mailto:${email}`} className="text-hermes hover:text-hermes-hover transition-colors">
                {email}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {email && (
            <Button as="a" href={`mailto:${email}`} variant="primary">
              Email this school
            </Button>
          )}
          {website && (
            <Button as="a" href={website} target="_blank" rel="noopener" variant="outline">
              Visit website
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
