'use client';

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DebtForm } from "@/components/forms/debt-form";
import { PageHeader } from "@/components/page-header";
import { useCreateDebt } from "@/hooks/use-debts";
import type { DebtInput } from "@/lib/validation";

function NewDebtPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const defaultType =
    params.get("type") === "lent" ? "lent" : "borrowed";

  const createMutation = useCreateDebt();

  const handleSubmit = (values: DebtInput) => {
    createMutation.mutate(values);
    router.replace("/home");
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <PageHeader title="新しい記録"/>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <DebtForm
          defaultValues={{ type: defaultType }}
          onSubmit={handleSubmit}
          submitLabel="登録する"
        />
      </div>
    </div>
  );
}

export default function NewDebtPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-slate-50 px-5 text-sm text-slate-500">
          読み込み中...
        </div>
      }
    >
      <NewDebtPageContent />
    </Suspense>
  );
}
