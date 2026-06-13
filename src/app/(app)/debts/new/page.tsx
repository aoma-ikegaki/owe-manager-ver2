'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { DebtForm } from "@/components/forms/debt-form";
import { useCreateDebt } from "@/hooks/use-debts";

export default function NewDebtPage() {
  const params = useSearchParams();
  const router = useRouter();
  const defaultType =
    params.get("type") === "lent" ? "lent" : "borrowed";

  const createMutation = useCreateDebt();

  const handleSubmit = async (values: {
    partnerName: string;
    amount: number;
    type: "borrowed" | "lent";
    status?: "unpaid" | "paid";
  }) => {
    await createMutation.mutateAsync(values);
    router.replace("/home");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
      <h1 className="text-xl font-semibold text-slate-900">新しい記録</h1>
      <p className="text-sm text-slate-500">3ステップでサッと登録</p>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <DebtForm
          defaultValues={{ type: defaultType }}
          onSubmit={handleSubmit}
          loading={createMutation.isPending}
          submitLabel="登録する"
        />
      </div>
    </div>
  );
}
