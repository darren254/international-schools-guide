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
}: HeadOfSchoolProps) {
  return (
    <section className="flex gap-6 items-start py-6 border-b border-warm-border-light">
      {/* Photo — square, no placeholder shown if unavailable */}
      <div
        className="w-[88px] h-[88px] bg-cream-300 flex-shrink-0"
        style={
          photoUrl
            ? { backgroundImage: `url(${photoUrl})`, backgroundSize: "cover" }
            : undefined
        }
        aria-label={`Photo of ${name}`}
      />

      <div>
        <span className="text-label-xs uppercase text-charcoal-muted block mb-1">
          Head of School
        </span>
        <p className="font-display text-display-sm font-semibold mb-0.5">
          {name}
        </p>
        <p className="text-[0.8125rem] text-charcoal-muted mb-2">
          In post since {since}
        </p>
        <p className="text-sm text-charcoal-light leading-relaxed">{bio}</p>
      </div>
    </section>
  );
}
