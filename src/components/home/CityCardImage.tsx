import type { CityConfig } from "@/data/cities";

type CityCardImageProps = {
  city: CityConfig;
  /** Optional photo credit (e.g. Jakarta Pexels). Rendered as subtle caption. */
  photoCredit?: { label: string; href: string };
};

/**
 * City card image block: responsive aspect ratio, subtle gradient,
 * readable badges. Used on home and /cities.
 */
export function CityCardImage({ city, photoCredit }: CityCardImageProps) {
  return (
    <div className="aspect-[4/3] md:aspect-[16/8] bg-cream-300 group-hover:bg-cream-400 transition-colors relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/cities/${city.slug}.webp${city.slug === "jakarta" ? "?v=2" : ""}`}
        alt={`${city.name} skyline`}
        className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105"
        loading="lazy"
        width={800}
        height={400}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
      />
      {/* Subtle bottom gradient for depth and badge readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 40%)",
        }}
      />
      {photoCredit && (
        <a
          href={photoCredit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1.5 left-2 text-[9px] text-white/80 hover:text-white font-body no-underline z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        >
          {photoCredit.label}
        </a>
      )}
      {!city.live && city.comingNext && (
        <span className="absolute top-2 right-2 bg-charcoal/90 text-white text-[0.625rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded z-10 backdrop-blur-sm">
          Coming next
        </span>
      )}
      {!city.live && !city.comingNext && (
        <span className="absolute top-2 right-2 text-[0.625rem] uppercase tracking-wider text-charcoal-muted bg-warm-white/95 px-2 py-0.5 rounded z-10 font-semibold backdrop-blur-sm">
          Coming soon
        </span>
      )}
    </div>
  );
}
