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
  const bg = isBorrowed ? "bg-red-50" : "bg-emerald-50";

  return (
    <div className={`rounded-2xl ${bg} p-4 shadow-sm`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`mt-1 text-2xl font-semibold ${color}`}>
        ￥{formatter.format(amount)}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        未{isBorrowed ? "返済" : "回収"} {count}件
      </p>
    </div>
  );
}
