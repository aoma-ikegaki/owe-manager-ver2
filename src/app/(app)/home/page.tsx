'use client';

import { useMemo, useState } from "react";
import { DebtCard } from "@/components/debt-card";
import { DefaultUserAvatar } from "@/components/default-user-avatar";
import { Fab } from "@/components/fab";
import { SummaryCard } from "@/components/summary-card";
import { TabSwitcher } from "@/components/tab-switcher";
import { useDebts, usePrefetchDebtLists } from "@/hooks/use-debts";
import {
  DebtListSkeleton,
  SummaryCardSkeleton,
} from "@/components/ui/loading-skeleton";

export default function HomePage() {
  const [tab, setTab] = useState<"borrowed" | "lent">("borrowed");
  usePrefetchDebtLists("unpaid");
  const { data, isPending } = useDebts({ type: tab, status: "unpaid" });
  const showLoading = isPending && !data;

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
      <header className="shrink-0 bg-white px-5 pb-3 pt-4 shadow-sm">
        <div className="relative flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            OweManager
          </h1>
          <DefaultUserAvatar className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100" />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
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
      </header>

      <div className="shrink-0 space-y-2 px-5 pt-2">
        <TabSwitcher value={tab} onChange={setTab} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-28 pt-2">
        <div key={tab} className="animate-fade-in space-y-3">
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
