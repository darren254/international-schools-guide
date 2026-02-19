interface CurriculumTagProps {
  label: string;
}

export function CurriculumTag({ label }: CurriculumTagProps) {
  return (
    <span className="text-label-sm uppercase font-medium px-3.5 py-1 border border-warm-border text-charcoal-light bg-warm-white">
      {label}
    </span>
  );
}
