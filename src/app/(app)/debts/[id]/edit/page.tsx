'use client';

import { useParams, useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { DebtForm } from "@/components/forms/debt-form";
import { PageHeader } from "@/components/page-header";
import { toDateInputValue } from "@/lib/date-utils";
import { useDebt, useUpdateDebt } from "@/hooks/use-debts";
import type { DebtInput } from "@/lib/validation";

export default function EditDebtPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const { data, isLoading } = useDebt(id);
  const updateMutation = useUpdateDebt(id);

  const handleSubmit = async (values: DebtInput) => {
    await updateMutation.mutateAsync(values);
    router.replace(`/debts/${id}`);
  };

  if (isLoading || !data) {
    return (
      <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
        <BackButton />
        <p className="mt-4 text-center text-base text-slate-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <PageHeader
        title="編集"
        subtitle="内容を修正して保存します"
        onBack={() => router.push(`/debts/${id}`)}
      />

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <DebtForm
          defaultValues={{
            type: data.type,
            partnerName: data.partnerName,
            amount: data.amount,
            status: data.status,
            occurredOn: toDateInputValue(data.createdAt),
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
