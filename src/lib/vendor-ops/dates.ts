/**
 * Event-local calendar dates for vendor offers, deadlines, and refunds.
 * Policy dates are America/Chicago calendar days, not UTC clock times.
 */

export const EVENT_TIME_ZONE = "America/Chicago";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isCalendarDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function addCalendarDays(date: string, days: number): string {
  if (!isCalendarDate(date)) {
    throw new Error("Invalid calendar date.");
  }
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return formatUtcParts(next);
}

export function compareCalendarDates(a: string, b: string): number {
  if (!isCalendarDate(a) || !isCalendarDate(b)) {
    throw new Error("Invalid calendar date.");
  }
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function isOnOrBefore(date: string, limit: string): boolean {
  return compareCalendarDates(date, limit) <= 0;
}

export function isOnOrAfter(date: string, limit: string): boolean {
  return compareCalendarDates(date, limit) >= 0;
}

export function chicagoCalendarDateFromInstant(instant: Date | string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid timestamp.");
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) {
    throw new Error("Could not format Chicago calendar date.");
  }
  return `${year}-${month}-${day}`;
}

export function formatCalendarDateLong(date: string): string {
  if (!isCalendarDate(date)) {
    throw new Error("Invalid calendar date.");
  }
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatUtcParts(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
