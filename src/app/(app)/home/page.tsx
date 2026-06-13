'use client';

import { useMemo, useState } from "react";
import { DebtCard } from "@/components/debt-card";
import { Fab } from "@/components/fab";
import { SummaryCard } from "@/components/summary-card";
import { TabSwitcher } from "@/components/tab-switcher";
import { useDebts } from "@/hooks/use-debts";

export default function HomePage() {
  const [tab, setTab] = useState<"borrowed" | "lent">("borrowed");
  const { data, isLoading } = useDebts({ type: tab, status: "unpaid" });

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
    <div className="relative min-h-screen bg-slate-50">
      <header className="bg-white px-5 pb-5 pt-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-brand)]">
              OweManager
            </h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
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
        </div>
      </header>

      <main className="space-y-4 px-5 pb-28 pt-4">
        <section className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              未返済の{tab === "borrowed" ? "借金" : "貸付"}
            </p>
            <p className="text-xs text-slate-500">
              タップで詳細・返済操作ができます
            </p>
          </div>
          <TabSwitcher value={tab} onChange={setTab} />
        </section>

        <div className="space-y-3">
          {isLoading && (
            <p className="text-center text-sm text-slate-500">読み込み中...</p>
          )}
          {!isLoading &&
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
          {!isLoading && items.length === 0 && (
            <p className="text-center text-sm text-slate-500">
              まだ{tab === "borrowed" ? "借りた" : "貸した"}記録がありません
            </p>
          )}
        </div>
      </main>

      <Fab href={`/debts/new?type=${tab}`} />
    </div>
  );
}
