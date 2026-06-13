'use client';

import { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { DebtForm } from "@/components/forms/debt-form";
import { PageHeader } from "@/components/page-header";
import { toDateInputValue } from "@/lib/date-utils";
import { useDebt, useUpdateDebt } from "@/hooks/use-debts";
import { DebtFormSkeleton, Skeleton } from "@/components/ui/loading-skeleton";
import type { DebtInput } from "@/lib/validation";

function EditDebtPageContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id ?? "";
  const fromHistory = searchParams.get("from") === "history";
  const { data } = useDebt(id);
  const updateMutation = useUpdateDebt(id);

  const detailHref = fromHistory
    ? `/debts/${id}?from=history`
    : `/debts/${id}`;
  const listHref = fromHistory ? "/history" : "/home";

  const handleSubmit = (values: DebtInput) => {
    updateMutation.mutate(values);
    router.replace(listHref);
  };

  if (!data) {
    return (
      <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
        <BackButton />
        <div className="mt-6 text-center">
          <Skeleton className="mx-auto h-7 w-16" />
        </div>
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <DebtFormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <PageHeader
        title="編集"
        subtitle="内容を修正して保存します"
        onBack={() => router.push(detailHref)}
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
          submitLabel="更新する"
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
          <BackButton />
          <div className="mt-6 text-center">
            <Skeleton className="mx-auto h-7 w-16" />
          </div>
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
