type SummaryCardProps = {
  title: string;
  amount: number;
  count: number;
  variant?: "borrowed" | "lent";
};

const formatter = new Intl.NumberFormat("ja-JP");

export function SummaryCard({
  title,
  amount,
  count,
  variant = "borrowed",
}: SummaryCardProps) {
  const isBorrowed = variant === "borrowed";
  const color = isBorrowed ? "text-red-600" : "text-[var(--color-brand)]";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`mt-0.5 text-2xl font-semibold ${color}`}>
        ￥{formatter.format(amount)}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        未{isBorrowed ? "返済" : "回収"} {count}件
      </p>
    </div>
  );
}
