import { SectionHeader } from "@/components/ui/SectionHeader";

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
  exchangeRate: number;
  exchangeRateDate: string;
  feeCurrency: string;
  note?: string;
}

function formatIDR(amount: number): string {
  return `IDR ${(amount / 1_000_000).toFixed(0)}M`;
}

function formatUSD(amountIDR: number, rate: number): string {
  const usd = Math.round(amountIDR / rate);
  return `US$${usd.toLocaleString("en-US")}`;
}

export function FeesTable({
  academicYear,
  fees,
  oneTimeFees,
  exchangeRate,
  exchangeRateDate,
  note,
}: FeesTableProps) {
  return (
    <section id="fees" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Annual Tuition" title="Fees" />

      <p className="text-sm text-charcoal-muted mb-6">
        {academicYear} fees shown in USD equivalent.{" "}
        <span className="italic">
          Exchange rate updated {exchangeRateDate}
        </span>
      </p>

      {/* Main fee table */}
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
                Total (USD)
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
                  {formatUSD(fee.tuition, exchangeRate)}
                </td>
                <td className="py-3 border-b border-warm-border-light text-[0.9375rem] text-right tabular-nums text-charcoal-light">
                  {formatUSD(fee.capital, exchangeRate)}
                </td>
                <td className="py-3 border-b border-warm-border-light text-[0.9375rem] text-right tabular-nums font-medium">
                  {formatUSD(fee.totalEarlyBird, exchangeRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* One-time fees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-warm-border">
        {oneTimeFees.map((fee) => (
          <div key={fee.name} className="flex flex-col gap-0.5">
            <span className="text-label-sm uppercase text-charcoal-muted">
              {fee.name}
            </span>
            <span className="font-display text-display-sm font-semibold">
              {formatUSD(fee.amount, exchangeRate)}
            </span>
            {fee.note && (
              <span className="text-xs text-charcoal-muted">{fee.note}</span>
            )}
          </div>
        ))}
      </div>

      {note && (
        <p className="text-[0.8125rem] text-charcoal-muted italic mt-6 leading-relaxed">
          {note}
        </p>
      )}
    </section>
  );
}
