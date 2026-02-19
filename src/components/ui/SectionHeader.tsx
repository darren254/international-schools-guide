interface SectionHeaderProps {
  label: string;
  title: string;
  id?: string;
}

export function SectionHeader({ label, title, id }: SectionHeaderProps) {
  return (
    <div id={id} className="mb-6">
      <span className="text-label-xs uppercase text-charcoal-muted block mb-2">
        {label}
      </span>
      <h2 className="font-display text-display-md font-medium">{title}</h2>
    </div>
  );
}
