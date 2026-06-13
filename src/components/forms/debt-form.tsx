'use client';

import { useState } from "react";
import { debtInputSchema, type DebtInput } from "@/lib/validation";
import { toDateInputValue } from "@/lib/date-utils";
import { TabSwitcher } from "@/components/tab-switcher";
type DebtFormProps = {
  defaultValues?: Partial<DebtInput>;
  submitLabel?: string;
  onSubmit: (values: DebtInput) => Promise<void> | void;
  loading?: boolean;
  allowStatusChange?: boolean;
};

type FormValues = {
  type: DebtInput["type"];
  partnerName: string;
  amount: string;
  occurredOn: string;
  status: NonNullable<DebtInput["status"]>;
};

function toFormValues(defaultValues?: Partial<DebtInput>): FormValues {
  return {
    type: defaultValues?.type ?? "borrowed",
    partnerName: defaultValues?.partnerName ?? "",
    amount:
      defaultValues?.amount != null ? String(defaultValues.amount) : "",
    occurredOn: defaultValues?.occurredOn ?? toDateInputValue(),
    status: defaultValues?.status ?? "unpaid",
  };
}
export function DebtForm({
  defaultValues,
  submitLabel = "登録する",
  onSubmit,
  loading = false,
  allowStatusChange = false,
}: DebtFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(defaultValues),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = debtInputSchema.safeParse(values);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      setErrors({
        partnerName: flattened.fieldErrors.partnerName?.[0] ?? "",
        amount: flattened.fieldErrors.amount?.[0] ?? "",
        type: flattened.fieldErrors.type?.[0] ?? "",
        occurredOn: flattened.fieldErrors.occurredOn?.[0] ?? "",
      });      return;
    }
    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <TabSwitcher
          value={values.type}
          onChange={(tab) => handleChange("type", tab)}
        />
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-base font-semibold text-slate-900">相手</label>
        <input
          type="text"
          value={values.partnerName}
          onChange={(e) => handleChange("partnerName", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-[var(--color-brand)]/40 focus:ring-2"
        />
        {errors.partnerName && (
          <p className="text-sm text-red-500">{errors.partnerName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-base font-semibold text-slate-900">金額</label>
        <input
          type="number"
          min={1}
          max={1_000_000}
          inputMode="numeric"
          placeholder="金額を入力"
          value={values.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-[var(--color-brand)]/40 focus:ring-2"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-base font-semibold text-slate-900">
          {values.type === "borrowed" ? "借りた日" : "貸した日"}
        </label>
        <input
          type="date"
          value={values.occurredOn}
          max={toDateInputValue()}
          onChange={(e) => handleChange("occurredOn", e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-[var(--color-brand)]/40 focus:ring-2"
        />
        {errors.occurredOn && (
          <p className="text-sm text-red-500">{errors.occurredOn}</p>
        )}
      </div>

      {allowStatusChange && (        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-900">
            ステータス
          </label>
          <div className="flex gap-3">
            {(["unpaid", "paid"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleChange("status", status)}
                className={`flex-1 rounded-xl border px-3 py-3 text-base font-semibold transition ${
                  values.status === status
                    ? "border-[var(--color-brand)] bg-emerald-50 text-[var(--color-brand-strong)]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status === "unpaid" ? "未返済" : "返済済み"}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-[var(--color-brand)] py-3.5 text-lg font-semibold text-white shadow-md transition hover:bg-[var(--color-brand-strong)] disabled:opacity-60"
      >
        {loading ? "送信中..." : submitLabel}
      </button>
    </form>
  );
}
