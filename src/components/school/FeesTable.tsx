"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/lib/currency/rates";

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

export function FeesTable({
  academicYear,
  fees,
  oneTimeFees,
  feeCurrency,
  note,
}: FeesTableProps) {
  const { currency, fmt, exchangeRateDate } = useCurrency();

  const f = (amount: number) => fmt(amount, feeCurrency);

  return (
    <section id="fees" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Annual Tuition" title="Fees" />

      <p className="text-sm text-charcoal-muted mb-6">
        {academicYear} fees shown in {currency} equivalent.{" "}
        <span className="italic">
          Exchange rate updated {exchangeRateDate}
        </span>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                Year Group
              </th>
              <th className="text-right text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                Tuition
              </th>
              <th className="text-right text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                Capital Fee
              </th>
              <th className="text-right text-label-xs uppercase text-charcoal-muted font-medium pb-2 border-b border-warm-border">
                Total ({currency})
              </th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.gradeLevel}>
                <td className="py-3 border-b border-warm-border-light text-[0.9375rem] text-charcoal-light">
                  {fee.gradeLevel}
                  {fee.ages && (
                    <span className="text-[0.8125rem] text-charcoal-muted ml-2">
                      ({fee.ages})
                    </span>
                  )}
                </td>
                <td className="py-3 border-b border-warm-border-light text-[0.9375rem] text-right tabular-nums text-charcoal-light">
                  {f(fee.tuition)}
                </td>
                <td className="py-3 border-b border-warm-border-light text-[0.9375rem] text-right tabular-nums text-charcoal-light">
                  {f(fee.capital)}
                </td>
                <td className="py-3 border-b border-warm-border-light text-[0.9375rem] text-right tabular-nums font-medium">
                  {f(fee.totalEarlyBird)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      <p className="text-[0.75rem] text-charcoal-muted mt-6 leading-relaxed">
        Approximate conversion. Schools invoice in local currency.
      </p>

      {note && (
        <p className="text-[0.8125rem] text-charcoal-muted italic mt-2 leading-relaxed">
          {note}
        </p>
      )}
    </section>
  );
}
