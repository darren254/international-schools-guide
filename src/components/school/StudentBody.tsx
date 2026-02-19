import { SectionHeader } from "@/components/ui/SectionHeader";

interface InspectionData {
  date: string;
  body: string;
  rating: string;
  findings: string;
}

interface StudentBodyProps {
  paragraphs: string[];
  inspection: InspectionData;
}

export function StudentBody({ paragraphs, inspection }: StudentBodyProps) {
  return (
    <section id="student-body" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader
        label="Community"
        title="Student Body & Academics"
      />

      {paragraphs.map((p, i) => (
        <p key={i} className="text-[0.9375rem] text-charcoal-light leading-relaxed mb-4">
          {p}
        </p>
      ))}

      <h3 className="font-display text-display-sm font-medium mt-8 mb-4">
        Inspection
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 bg-warm-white border border-warm-border-light mb-5">
        <div className="flex flex-col gap-1">
          <span className="text-label-xs uppercase text-charcoal-muted">
            Last Inspected
          </span>
          <span className="text-[0.9375rem] font-medium">{inspection.date}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label-xs uppercase text-charcoal-muted">
            Inspection Body
          </span>
          <span className="text-[0.9375rem] font-medium">{inspection.body}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label-xs uppercase text-charcoal-muted">
            Rating
          </span>
          <span className="text-[0.9375rem] font-medium">
            {inspection.rating}
          </span>
        </div>
      </div>

      <p className="text-[0.9375rem] text-charcoal-light leading-relaxed">
        {inspection.findings}
      </p>
    </section>
  );
}
