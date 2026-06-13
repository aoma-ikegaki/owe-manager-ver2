import { format, isValid, parse, startOfDay } from "date-fns";

export function toDateInputValue(date?: Date | string | null): string {
  if (!date) return format(new Date(), "yyyy-MM-dd");
  const parsed = typeof date === "string" ? new Date(date) : date;
  return format(parsed, "yyyy-MM-dd");
}

export function parseDateInput(value: string): Date {
  return parse(value, "yyyy-MM-dd", new Date());
}

export function isDateInputValid(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseDateInput(value);
  return isValid(date) && startOfDay(date) <= startOfDay(new Date());
}
