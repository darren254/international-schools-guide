"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/lib/currency/rates";
import Link from "next/link";

interface FeeRow {
  gradeLevel: string;
  ages?: string;
  tuition: number;
  capital: number;
  totalEarlyBird: number;
  totalStandard: number;
}

interface OneTimeFee {
  name: string;
  amount: number;
  note?: string;
}

interface FeesTableProps {
  academicYear: string;
  fees: FeeRow[];
  oneTimeFees: OneTimeFee[];
  feeCurrency: CurrencyCode;
  note?: string;
}

const FEE_DISCLAIMER =
  "Fees are indicative. Confirm directly with the school; amounts and exchange rates may change.";

/** Renders note text, converting [label](url) markdown links to Next.js links */
function FeeNoteContent({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    parts.push(
      <Link key={m.index} href={m[2]} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">
        {m[1]}
      </Link>
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts.length ? parts : text}</>;
}

export function FeesTable({
  fees,
  oneTimeFees,
  feeCurrency,
  note,
}: FeesTableProps) {
  const { currency, fmt } = useCurrency();
  const hasAnnualRows = fees.length > 0;

  const f = (amount: number) => fmt(amount, feeCurrency);

  return (
    <section id="fees" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label={hasAnnualRows ? "Annual Tuition" : undefined} title="Fees" />

      {hasAnnualRows ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                    Year Group
                  </th>
                  <th className="text-left text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                    Age
                  </th>
                  <th className="text-right text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                    <span className="block text-label-xs font-normal normal-case tracking-normal text-charcoal-muted/80">
                      {currency}
                    </span>
                    Total Annual Tuition
                  </th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.gradeLevel}>
                    <td className="py-3 border-b border-warm-border-light text-body-sm text-charcoal-light">
                      {fee.gradeLevel}
                    </td>
                    <td className="py-3 border-b border-warm-border-light text-body-sm text-charcoal-light">
                      {fee.ages ?? "—"}
                    </td>
                    <td className="py-3 border-b border-warm-border-light text-body-sm text-right tabular-nums font-medium text-charcoal-light">
                      {f(fee.totalStandard)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-label-xs text-charcoal-muted mt-4 leading-relaxed">
            {FEE_DISCLAIMER}
          </p>
          {note && (
            <p className="text-body-sm text-charcoal-light mt-3 leading-relaxed">
              <FeeNoteContent text={note} />
            </p>
          )}
        </>
      ) : (
        <>
          {note && (
            <p className="text-body-sm text-charcoal-light leading-relaxed">
              <FeeNoteContent text={note} />
            </p>
          )}
          <p className="text-label-xs text-charcoal-muted mt-4 leading-relaxed">
            {FEE_DISCLAIMER}
          </p>
        </>
      )}

      {oneTimeFees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-warm-border">
          {oneTimeFees.map((fee) => (
            <div key={fee.name} className="flex flex-col gap-0.5">
              <span className="text-label-sm uppercase text-charcoal-muted">
                {fee.name}
              </span>
              <span className="font-display text-display-sm font-semibold">
                {f(fee.amount)}
              </span>
              {fee.note && (
                <span className="text-xs text-charcoal-muted">{fee.note}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
