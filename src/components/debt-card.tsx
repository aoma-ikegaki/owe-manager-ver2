"use client";

import { useEffect, useRef, useState } from "react";
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
const COMPLETION_HOLD_MS = 360;
const CARD_EXIT_DURATION_MS = 380;
const CARD_FADE_DURATION_MS = 140;
const EXIT_EASING = "cubic-bezier(0.33, 1, 0.68, 1)";

function measureCollapse(el: HTMLElement): CollapseMetrics {
  const computed = getComputedStyle(el);
  return {
    height: el.offsetHeight,
    marginTop: Number.parseFloat(computed.marginTop) || 0,
  };
}

type CollapseMetrics = {
  height: number;
  marginTop: number;
};

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasMutatedRef = useRef(false);
  const [paidFeedbackActive, setPaidFeedbackActive] = useState(false);
  const [isPressingCheck, setIsPressingCheck] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [collapseFrom, setCollapseFrom] = useState<CollapseMetrics | null>(null);
  const [collapseActive, setCollapseActive] = useState(false);
  const showPaidFeedback = paidFeedbackActive || isExiting;

  const handlePrefetchDetail = () => {
    void prefetchDebtDetail(queryClient, id);
  };

  const handleMarkPaid = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isExiting || paidFeedbackActive) return;

    setIsPressingCheck(false);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(12);
    }
    setPaidFeedbackActive(true);

    window.setTimeout(() => {
      const el = wrapperRef.current;
      if (!el) return;

      const metrics = measureCollapse(el);
      setCollapseFrom(metrics);
      setCollapseActive(false);
      setIsExiting(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setCollapseActive(true));
      });
    }, CHECK_FEEDBACK_MS + COMPLETION_HOLD_MS);
  };

  useEffect(() => {
    if (!collapseActive || hasMutatedRef.current) return;

    const el = wrapperRef.current;
    if (!el) return;

    const completeExit = () => {
      if (hasMutatedRef.current) return;
      hasMutatedRef.current = true;
      updateMutation.mutate({ status: "paid" });
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== el || event.propertyName !== "height") return;
      completeExit();
    };

    el.addEventListener("transitionend", onTransitionEnd);
    const fallbackTimer = window.setTimeout(
      completeExit,
      CARD_EXIT_DURATION_MS + 100,
    );

    return () => {
      el.removeEventListener("transitionend", onTransitionEnd);
      window.clearTimeout(fallbackTimer);
    };
  }, [collapseActive, updateMutation]);

  const isCollapsing = collapseFrom !== null;

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden"
      style={
        isCollapsing
          ? {
              height: collapseActive ? 0 : collapseFrom.height,
              marginTop: collapseActive ? 0 : collapseFrom.marginTop,
              transition: `height ${CARD_EXIT_DURATION_MS}ms ${EXIT_EASING}, margin-top ${CARD_EXIT_DURATION_MS}ms ${EXIT_EASING}`,
              pointerEvents: "none",
              contain: "layout",
              willChange: "height, margin-top",
            }
          : undefined
      }
    >
      <div
        className={clsx(
          "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-colors duration-300",
          paidFeedbackActive && "pointer-events-none border-emerald-200 bg-emerald-50/60 opacity-80",
          isExiting && "border-emerald-200 bg-emerald-50/60",
          !showPaidFeedback && "border-slate-200",
        )}
        style={
          isCollapsing
            ? {
                opacity: collapseActive ? 0 : undefined,
                transition: collapseActive
                  ? `opacity ${CARD_FADE_DURATION_MS}ms ease-out`
                  : undefined,
              }
            : undefined
        }
      >
        <Link
          href={detailHref}
          prefetch
          onMouseEnter={handlePrefetchDetail}
          onTouchStart={handlePrefetchDetail}
          onFocus={handlePrefetchDetail}
          className="tap-press flex min-w-0 flex-1 items-center justify-between rounded-xl transition hover:opacity-80 active:opacity-100"
        >
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">
              {partnerName}
            </p>
            <p className="text-sm text-slate-500">
              {format(new Date(createdAt), "yyyy/MM/dd")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 pl-2">
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
            onPointerDown={() => {
              if (isExiting || paidFeedbackActive) return;
              setIsPressingCheck(true);
            }}
            onPointerUp={() => setIsPressingCheck(false)}
            onPointerLeave={() => setIsPressingCheck(false)}
            onPointerCancel={() => setIsPressingCheck(false)}
            aria-label="返済済みにする"
            aria-disabled={paidFeedbackActive || isExiting}
            tabIndex={isExiting ? -1 : undefined}
            aria-hidden={isExiting}
            className={clsx(
              "tap-press btn-icon flex h-10 w-10 shrink-0 touch-manipulation select-none items-center justify-center rounded-full text-white shadow-md transition-[transform,background-color,box-shadow] duration-150",
              isPressingCheck && !paidFeedbackActive && "scale-[0.88] shadow-sm",
              paidFeedbackActive || isExiting
                ? "bg-emerald-600"
                : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-strong)]",
              paidFeedbackActive && "animate-pop-in ring-2 ring-emerald-300/70 ring-offset-1",
              (paidFeedbackActive || isExiting) && "pointer-events-none",
              isExiting && "invisible",
            )}
          >
            <Check className="h-5 w-5" strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}
