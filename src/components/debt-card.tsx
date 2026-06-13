'use client';

import { Check, CheckCircle2, Clock3 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import clsx from "clsx";
import { useUpdateDebt } from "@/hooks/use-debts";

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
  const updateMutation = useUpdateDebt(id);

  const handleMarkPaid = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await updateMutation.mutateAsync({ status: "paid" });
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Link
        href={`/debts/${id}`}
        className="flex min-w-0 flex-1 items-center justify-between transition hover:opacity-80"
      >
        <div>
          <p className="text-base font-semibold text-slate-900">{partnerName}</p>
          <p className="text-sm text-slate-500">
            {format(new Date(createdAt), "yyyy/MM/dd")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p
            className={clsx(
              "text-lg font-semibold",
              isBorrowed ? "text-red-600" : "text-[var(--color-brand)]",
            )}
          >
            ￥{formatter.format(amount)}
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            {status === "paid" ? (
              <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)]" />
            ) : (
              <Clock3 className="h-4 w-4 text-amber-500" />
            )}
            <span>{statusLabel}</span>
          </div>
        </div>
      </Link>
      {status === "unpaid" && (
        <button
          type="button"
          onClick={handleMarkPaid}
          disabled={updateMutation.isPending}
          aria-label="返済済みにする"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-white transition hover:bg-[var(--color-brand-strong)] active:scale-95 disabled:opacity-60"
        >
          <Check className="h-5 w-5" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
