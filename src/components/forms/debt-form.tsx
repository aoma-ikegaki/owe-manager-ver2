'use client';

import { useState } from "react";
import { debtInputSchema, type DebtInput } from "@/lib/validation";
import { TabSwitcher } from "@/components/tab-switcher";

type DebtFormProps = {
  defaultValues?: Partial<DebtInput>;
  submitLabel?: string;
  onSubmit: (values: DebtInput) => Promise<void> | void;
  loading?: boolean;
  allowStatusChange?: boolean;
};

const defaultState: DebtInput = {
  type: "borrowed",
  partnerName: "",
  amount: 0,
  status: "unpaid",
};

export function DebtForm({
  defaultValues,
  submitLabel = "登録する",
  onSubmit,
  loading = false,
  allowStatusChange = false,
}: DebtFormProps) {
  const [values, setValues] = useState<DebtInput>({
    ...defaultState,
    ...defaultValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof DebtInput>(
    key: K,
    value: DebtInput[K],
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
      });
      return;
    }
    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900">種別</label>
        <TabSwitcher
          value={values.type}
          onChange={(tab) => handleChange("type", tab)}
        />
        {errors.type && (
          <p className="text-xs text-red-500">{errors.type}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900">相手</label>
        <input
          type="text"
          value={values.partnerName}
          onChange={(e) => handleChange("partnerName", e.target.value)}
          placeholder="田中さん"
          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none ring-[var(--color-brand)]/40 focus:ring-2"
        />
        {errors.partnerName && (
          <p className="text-xs text-red-500">{errors.partnerName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900">金額</label>
        <input
          type="number"
          min={1}
          max={1_000_000}
          inputMode="numeric"
          value={values.amount}
          onChange={(e) => handleChange("amount", Number(e.target.value))}
          placeholder="0"
          className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none ring-[var(--color-brand)]/40 focus:ring-2"
        />
        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      {allowStatusChange && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900">
            ステータス
          </label>
          <div className="flex gap-3">
            {(["unpaid", "paid"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleChange("status", status)}
                className={`flex-1 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
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
        className="mt-2 w-full rounded-xl bg-[var(--color-brand)] py-3 text-base font-semibold text-white shadow-md transition hover:bg-[var(--color-brand-strong)] disabled:opacity-60"
      >
        {loading ? "送信中..." : submitLabel}
      </button>
    </form>
  );
}
