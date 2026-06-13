'use client';

import { DebtCard } from "@/components/debt-card";
import { useDebts } from "@/hooks/use-debts";

export default function HistoryPage() {
  const { data, isLoading } = useDebts({ status: "paid" });
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
      <h1 className="text-xl font-semibold text-slate-900">返済済み一覧</h1>
      <p className="mt-1 text-sm text-slate-500">
        返済済みの記録を確認できます
      </p>

      <div className="mt-4 space-y-3">
        {isLoading && (
          <p className="text-sm text-slate-500">読み込み中...</p>
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
          <p className="text-sm text-slate-500">
            返済済みの記録はまだありません
          </p>
        )}
      </div>
    </div>
  );
}
