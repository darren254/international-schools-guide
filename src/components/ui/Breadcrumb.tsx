import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="pt-6 pb-2 text-body-xs text-charcoal-muted font-body" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-0 gap-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-50" aria-hidden>›</span>}
            {item.href != null ? (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-charcoal">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
