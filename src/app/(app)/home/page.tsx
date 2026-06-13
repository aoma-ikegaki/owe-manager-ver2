"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { DebtCard } from "@/components/debt-card";
import { Fab } from "@/components/fab";
import { SummaryCard } from "@/components/summary-card";
import { TabSwitcher } from "@/components/tab-switcher";
import {
  prefetchDebtList,
  useDebts,
  usePrefetchDebtLists,
} from "@/hooks/use-debts";
import { useQueryClient } from "@tanstack/react-query";
import { useSplashPhase } from "@/components/app-splash-provider";
import {
  DebtListSkeleton,
  SummaryCardSkeleton,
} from "@/components/ui/loading-skeleton";

export default function HomePage() {
  const [tab, setTab] = useState<"borrowed" | "lent">("borrowed");
  const { phase } = useSplashPhase();
  const prevTabRef = useRef(tab);
  const [fadeInList, setFadeInList] = useState(false);
  const queryClient = useQueryClient();
  usePrefetchDebtLists("unpaid");

  const prefetchTab = (nextTab: "borrowed" | "lent") => {
    void prefetchDebtList(queryClient, { type: nextTab, status: "unpaid" });
  };
  const { data, isPending } = useDebts({ type: tab, status: "unpaid" });
  const showLoading = phase === "done" && isPending && !data;

  useEffect(() => {
    if (phase !== "done") return;
    if (prevTabRef.current === tab) return;

    setFadeInList(true);
    const timer = window.setTimeout(() => setFadeInList(false), 240);
    prevTabRef.current = tab;
    return () => window.clearTimeout(timer);
  }, [tab, phase]);

  const summaries = useMemo(() => {
    if (!data?.summary) {
      return {
        borrowed: { unpaidAmount: 0, unpaidCount: 0 },
        lent: { unpaidAmount: 0, unpaidCount: 0 },
      };
    }
    return data.summary;
  }, [data]);

  const items = data?.items ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 px-5 pb-1 pt-4">
        <h1 className="text-center text-2xl font-semibold text-slate-900">
          OweManager
        </h1>
      </header>

      <div className="shrink-0 grid grid-cols-2 gap-3 px-5 pt-2">
        {showLoading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              title="借りた"
              amount={summaries.borrowed.unpaidAmount}
              count={summaries.borrowed.unpaidCount}
              variant="borrowed"
            />
            <SummaryCard
              title="貸した"
              amount={summaries.lent.unpaidAmount}
              count={summaries.lent.unpaidCount}
              variant="lent"
            />
          </>
        )}
      </div>

      <div className="shrink-0 space-y-2 px-5 pt-3">
        <TabSwitcher value={tab} onChange={setTab} onPrefetch={prefetchTab} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-28 pt-2">
        <div key={tab} className={clsx(fadeInList && "animate-fade-in", "space-y-3")}>
          {showLoading && <DebtListSkeleton showAction />}
          {!showLoading &&
            items.map((debt) => (
              <DebtCard
                key={debt.id}
                id={debt.id}
                partnerName={debt.partnerName}
                amount={debt.amount}
                createdAt={debt.createdAt}
                status={debt.status}
                type={debt.type}
              />
            ))}
          {!showLoading && items.length === 0 && (
            <p className="text-center text-base text-slate-500">
              まだ{tab === "borrowed" ? "借りた" : "貸した"}記録がありません
            </p>
          )}
        </div>
      </div>

      <Fab href={`/debts/new?type=${tab}`} />
    </div>
  );
}
