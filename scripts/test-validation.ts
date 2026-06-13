import { format } from "date-fns";
import { debtInputSchema, debtQuerySchema } from "../src/lib/validation";

const today = format(new Date(), "yyyy-MM-dd");

const inputCases: Array<{ label: string; data: unknown; ok: boolean }> = [
  {
    label: "正常: 相手・金額・種別・日付",
    data: { partnerName: "田中", amount: "1000", type: "borrowed", occurredOn: today },
    ok: true,
  },
  {
    label: "相手が空",
    data: { partnerName: "", amount: "1000", type: "borrowed", occurredOn: today },
    ok: false,
  },
  {
    label: "金額が0",
    data: { partnerName: "田中", amount: "0", type: "borrowed", occurredOn: today },
    ok: false,
  },
  {
    label: "金額が空",
    data: { partnerName: "田中", amount: "", type: "borrowed", occurredOn: today },
    ok: false,
  },
  {
    label: "金額が100万円超",
    data: { partnerName: "田中", amount: "1000001", type: "borrowed", occurredOn: today },
    ok: false,
  },
  {
    label: "相手が51文字",
    data: { partnerName: "あ".repeat(51), amount: "100", type: "lent", occurredOn: today },
    ok: false,
  },
  {
    label: "種別が不正",
    data: { partnerName: "田中", amount: "100", type: "invalid", occurredOn: today },
    ok: false,
  },
  {
    label: "未来の日付",
    data: { partnerName: "田中", amount: "100", type: "borrowed", occurredOn: "2099-01-01" },
    ok: false,
  },
];

const queryCases: Array<{ label: string; data: unknown; ok: boolean }> = [
  { label: "type=borrowed", data: { type: "borrowed" }, ok: true },
  { label: "status=paid", data: { status: "paid" }, ok: true },
  { label: "不正なtype", data: { type: "foo" }, ok: false },
];

let failed = 0;

for (const c of inputCases) {
  const r = debtInputSchema.safeParse(c.data);
  const pass = r.success === c.ok;
  if (!pass) failed++;
  console.log(`${pass ? "OK" : "NG"} ${c.label}`);
}

for (const c of queryCases) {
  const r = debtQuerySchema.safeParse(c.data);
  const pass = r.success === c.ok;
  if (!pass) failed++;
  console.log(`${pass ? "OK" : "NG"} [query] ${c.label}`);
}

process.exit(failed === 0 ? 0 : 1);
