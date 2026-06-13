import { z } from "zod";

export const debtInputSchema = z.object({
  partnerName: z
    .string()
    .min(1, "相手は1文字以上で入力してください")
    .max(50, "相手は50文字以下で入力してください"),
  amount: z
    .coerce.number()
    .int("金額は整数で入力してください")
    .min(1, "1円以上を入力してください")
    .max(1_000_000, "100万円以下で入力してください"),
  type: z.enum(["borrowed", "lent"]),
  status: z.enum(["unpaid", "paid"]).optional(),
});

export const debtQuerySchema = z.object({
  type: z.enum(["borrowed", "lent"]).optional(),
  status: z.enum(["unpaid", "paid"]).optional(),
});

export type DebtInput = z.infer<typeof debtInputSchema>;
export type DebtQuery = z.infer<typeof debtQuerySchema>;
