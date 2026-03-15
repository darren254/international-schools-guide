import { SectionHeader } from "@/components/ui/SectionHeader";
import { displayValue } from "@/lib/utils/display";

interface HeadOfSchoolProps {
  name: string;
  since: number;
  bio: string;
  photoUrl?: string;
  credentials?: string;
}

export function HeadOfSchool({
  name,
  since,
  bio,
  photoUrl,
  credentials,
}: HeadOfSchoolProps) {
  const displayName = displayValue(name, "Contact the school for leadership details.");
  const displayBio = displayValue(bio, "Contact the school for details.");
  const showSince = since != null && Number(since) > 0;

  return (
    <section id="leadership" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Leadership" title="Head of School" />

      <div className="flex gap-6 items-start">
        <div
          className="w-[88px] h-[88px] bg-cream-300 flex-shrink-0"
          style={
            photoUrl
              ? { backgroundImage: `url(${photoUrl})`, backgroundSize: "cover" }
              : undefined
          }
          aria-label={`Photo of ${displayName}`}
        />

        <div>
          <p className="font-display text-display-sm font-semibold mb-0.5">
            {displayName}
          </p>
          {showSince && (
            <p className="text-body-xs text-charcoal-muted mb-2">
              In post since {since}
            </p>
          )}
          {credentials && (
            <p className="text-body-xs text-charcoal-muted mb-2">
              {credentials}
            </p>
          )}
          <p className="text-sm text-charcoal-light leading-relaxed">{displayBio}</p>
        </div>
      </div>
    </section>
  );
}
