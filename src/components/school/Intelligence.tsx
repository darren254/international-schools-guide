import { SectionHeader } from "@/components/ui/SectionHeader";
import { displayValue } from "@/lib/utils/display";

type ConsiderationItem =
  | string
  | { text: string; link: { url: string; label: string } };

interface IntelligenceProps {
  verdict?: string;
  paragraphs: string[];
  positives: string[];
  considerations: ConsiderationItem[];
}


export function Intelligence({
  verdict,
  paragraphs,
  positives,
  considerations,
}: IntelligenceProps) {
  const verdictText = verdict != null ? displayValue(verdict, "") : "";
  const validParagraphs = paragraphs
    .map((p) => displayValue(p, ""))
    .filter((text) => text !== "");
  const validPositives = positives
    .map((p) => displayValue(p, ""))
    .filter((text) => text !== "");
  const validConsiderations = considerations.filter((item) => {
    if (typeof item === "string") return displayValue(item, "") !== "";
    return displayValue(item.text, "") !== "";
  });

  return (
    <section id="intelligence" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Editorial" title="The Intelligence" />

      <p className="text-[0.75rem] text-charcoal-muted italic mb-6">
        Schools don&apos;t pay to be listed here. Our reviews are independent, written for parents, not for schools.
      </p>

      {/* Verdict box - the key takeaway */}
      {verdictText && (
        <div className="bg-amber-bg border-l-[3px] border-amber-highlight px-5 py-4 mb-8">
          <span className="text-[0.6875rem] uppercase tracking-wider text-amber-highlight font-medium block mb-1">
            The Verdict
          </span>
          <p className="text-[0.9375rem] text-charcoal leading-relaxed font-medium">
            {verdictText}
          </p>
        </div>
      )}

      {/* Editorial prose */}
      {validParagraphs.slice(0, 2).map((p, i) => (
        <p key={i} className="text-[0.9375rem] text-charcoal-light leading-[1.7] mb-5">
          {p}
        </p>
      ))}
      {validParagraphs.length > 2 && (
        <div className="text-[0.875rem] text-charcoal-muted leading-[1.7] mb-6">
          {validParagraphs.slice(2).map((p, i) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>
      )}

      {/* Two-column layout for + and - on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Positives */}
        <div>
          <h3 className="text-[0.75rem] uppercase tracking-wider text-verified font-semibold mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-verified-bg flex items-center justify-center text-verified text-xs font-bold">+</span>
            What parents value
          </h3>
          <ul className="space-y-0">
            {validPositives.map((item, i) => (
              <li
                key={i}
                className="py-2.5 border-b border-warm-border-light last:border-b-0 text-[0.8125rem] text-charcoal-light leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Considerations */}
        <div>
          <h3 className="text-[0.75rem] uppercase tracking-wider text-hermes font-semibold mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-hermes-light flex items-center justify-center text-hermes text-xs font-bold">−</span>
            Points of consideration
          </h3>
          <ul className="space-y-0">
            {validConsiderations.map((item, i) => (
              <li
                key={i}
                className="py-2.5 border-b border-warm-border-light last:border-b-0 text-[0.8125rem] text-charcoal-light leading-relaxed"
              >
                {typeof item === "string" ? (
                  item
                ) : (
                  <>
                    {item.text.split(item.link.label).map((part, j, parts) => (
                      <span key={j}>
                        {part}
                        {j < parts.length - 1 ? (
                          <a
                            href={item.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hermes hover:underline"
                          >
                            {item.link.label}
                          </a>
                        ) : null}
                      </span>
                    ))}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
