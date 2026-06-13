'use client';

import { Suspense, useState } from "react";
import { flushSync } from "react-dom";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DebtForm } from "@/components/forms/debt-form";
import { PageHeader } from "@/components/page-header";
import { toDateInputValue } from "@/lib/date-utils";
import { useDebt, useUpdateDebt } from "@/hooks/use-debts";
import { DebtFormSkeleton } from "@/components/ui/loading-skeleton";
import type { DebtInput } from "@/lib/validation";

function EditDebtPageContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id ?? "";
  const fromHistory = searchParams.get("from") === "history";
  const { data } = useDebt(id);
  const updateMutation = useUpdateDebt(id);
  const [submitting, setSubmitting] = useState(false);

  const listHref = fromHistory ? "/history" : "/home";

  const handleSubmit = (values: DebtInput) => {
    if (!data || submitting) return;

    setSubmitting(true);
    flushSync(() => {
      updateMutation.mutate(values);
    });
    router.replace(listHref);
  };

  if (!data) {
    return (
      <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
        <PageHeader title="編集" />
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <DebtFormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <PageHeader title="編集" />

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
          submitLabel="更新する"
          loading={submitting}
        />
      </div>
    </div>
  );
}

export default function EditDebtPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
          <PageHeader title="編集" />
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <DebtFormSkeleton />
          </div>
        </div>
      }
    >
      <EditDebtPageContent />
    </Suspense>
  );
}
