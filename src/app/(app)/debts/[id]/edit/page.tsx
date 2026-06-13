'use client';

import { useParams, useRouter } from "next/navigation";
import { DebtForm } from "@/components/forms/debt-form";
import { useDebt, useUpdateDebt } from "@/hooks/use-debts";

export default function EditDebtPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const { data, isLoading } = useDebt(id);
  const updateMutation = useUpdateDebt(id);

  const handleSubmit = async (values: {
    partnerName: string;
    amount: number;
    type: "borrowed" | "lent";
    status?: "unpaid" | "paid";
  }) => {
    await updateMutation.mutateAsync(values);
    router.replace(`/debts/${id}`);
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
        <p className="text-sm text-slate-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
      <h1 className="text-xl font-semibold text-slate-900">編集</h1>
      <p className="text-sm text-slate-500">内容を修正して保存します</p>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <DebtForm
          defaultValues={{
            type: data.type,
            partnerName: data.partnerName,
            amount: data.amount,
            status: data.status,
          }}
          allowStatusChange
          onSubmit={handleSubmit}
          loading={updateMutation.isPending}
          submitLabel="更新する"
        />
      </div>
    </div>
  );
}
