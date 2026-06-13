import { CheckCircle2, Clock3 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import clsx from "clsx";

export type DebtCardProps = {
  id: string;
  partnerName: string;
  amount: number;
  createdAt: Date | string;
  status: "unpaid" | "paid";
  type: "borrowed" | "lent";
};

const formatter = new Intl.NumberFormat("ja-JP");

export function DebtCard({
  id,
  partnerName,
  amount,
  createdAt,
  status,
  type,
}: DebtCardProps) {
  const isBorrowed = type === "borrowed";
  const statusLabel = status === "paid" ? "返済済み" : "未返済";

  return (
    <Link
      href={`/debts/${id}`}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px]"
    >
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {partnerName.at(0)}
        </div>
        <div>
            <p className="text-sm font-semibold text-slate-900">
              {partnerName}
            </p>
          <p className="text-xs text-slate-500">
            {format(new Date(createdAt), "yyyy/MM/dd")}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p
          className={clsx(
            "text-base font-semibold",
            isBorrowed ? "text-red-600" : "text-[var(--color-brand)]",
          )}
        >
          ￥{formatter.format(amount)}
        </p>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          {status === "paid" ? (
            <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)]" />
          ) : (
            <Clock3 className="h-4 w-4 text-amber-500" />
          )}
          <span>{statusLabel}</span>
        </div>
      </div>
    </Link>
  );
}
