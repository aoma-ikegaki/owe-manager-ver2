import { isValid } from "date-fns";

const APP_TIME_ZONE = "Asia/Tokyo";

function formatDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function todayInAppTimeZone(): string {
  return formatDateInTimeZone(new Date(), APP_TIME_ZONE);
}

export function toDateInputValue(date?: Date | string | null): string {
  if (!date) return todayInAppTimeZone();
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return todayInAppTimeZone();
  return formatDateInTimeZone(parsed, APP_TIME_ZONE);
}

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isDateInputValid(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!isValid(date)) return false;

  const normalized = `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  return normalized <= todayInAppTimeZone();
}
