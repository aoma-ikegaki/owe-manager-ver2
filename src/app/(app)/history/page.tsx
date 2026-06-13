'use client';

import { useState } from "react";
import { DebtCard } from "@/components/debt-card";
import { TabSwitcher } from "@/components/tab-switcher";
import { useDebts, usePrefetchDebtLists } from "@/hooks/use-debts";
import { DebtListSkeleton } from "@/components/ui/loading-skeleton";

export default function HistoryPage() {
  const [tab, setTab] = useState<"borrowed" | "lent">("borrowed");
  usePrefetchDebtLists("paid");
  const { data, isPending } = useDebts({ type: tab, status: "paid" });
  const showLoading = isPending && !data;
  const items = data?.items ?? [];

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-900">履歴</h1>
      </div>

      <div className="mt-4 space-y-2">
        <TabSwitcher value={tab} onChange={setTab} />
      </div>

      <div className="mt-4 space-y-3">
        {showLoading && <DebtListSkeleton />}
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
              detailFrom="history"
            />
          ))}
        {!showLoading && items.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            返済済みの{tab === "borrowed" ? "借金" : "貸付"}はまだありません
          </p>
        )}
      </div>
    </div>
  );
}
