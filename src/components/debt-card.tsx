"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock3 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchDebtDetail, useUpdateDebt } from "@/hooks/use-debts";

export type DebtCardProps = {
  id: string;
  partnerName: string;
  amount: number;
  createdAt: Date | string;
  status: "unpaid" | "paid";
  type: "borrowed" | "lent";
  detailFrom?: "history";
};

const formatter = new Intl.NumberFormat("ja-JP");
const CHECK_FEEDBACK_MS = 320;
const CARD_EXIT_DURATION_MS = 360;

export function DebtCard({
  id,
  partnerName,
  amount,
  createdAt,
  status,
  type,
  detailFrom,
}: DebtCardProps) {
  const isBorrowed = type === "borrowed";
  const statusLabel = status === "paid" ? "返済済み" : "未返済";
  const detailHref =
    detailFrom === "history" ? `/debts/${id}?from=history` : `/debts/${id}`;
  const updateMutation = useUpdateDebt(id);
  const queryClient = useQueryClient();
  const [justPaid, setJustPaid] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const showPaidFeedback = justPaid || isExiting;

  const handlePrefetchDetail = () => {
    void prefetchDebtDetail(queryClient, id);
  };

  const handleMarkPaid = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isExiting || justPaid) return;

    setJustPaid(true);

    window.setTimeout(() => {
      setIsExiting(true);
    }, CHECK_FEEDBACK_MS);

    window.setTimeout(() => {
      updateMutation.mutate({ status: "paid" });
    }, CHECK_FEEDBACK_MS + CARD_EXIT_DURATION_MS);
  };

  return (
    <div
      className={clsx(
        "card-exit-wrapper overflow-hidden",
        isExiting && "animate-card-exit",
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors duration-300",
          showPaidFeedback && "border-emerald-200 bg-emerald-50/60",
        )}
      >
        <Link
          href={detailHref}
          prefetch
          onMouseEnter={handlePrefetchDetail}
          onTouchStart={handlePrefetchDetail}
          onFocus={handlePrefetchDetail}
          className="tap-press flex min-w-0 flex-1 items-center justify-between rounded-xl transition hover:opacity-80 active:opacity-100"
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
              {showPaidFeedback || status === "paid" ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)]" />
              ) : (
                <Clock3 className="h-4 w-4 text-amber-500" />
              )}
              <span
                className={clsx(
                  showPaidFeedback && "font-semibold text-[var(--color-brand)]",
                )}
              >
                {showPaidFeedback ? "返済済み" : statusLabel}
              </span>
            </div>
          </div>
        </Link>
        {status === "unpaid" && (
          <button
            type="button"
            onClick={handleMarkPaid}
            aria-label="返済済みにする"
            className={clsx(
              "btn-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
              justPaid
                ? "bg-emerald-600"
                : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-strong)]",
            )}
          >
            {justPaid ? (
              <Check className="animate-pop-in h-5 w-5" strokeWidth={3} />
            ) : (
              <Check className="h-5 w-5" strokeWidth={3} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
