import { Event } from "./types";

export function getEventId(event: Event): string {
  return event._id || event.id || event.title;
}

/** Local date as yyyy-mm-dd (never UTC-shifted). */
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function addDaysISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Parse an ISO yyyy-mm-dd as a local date, avoiding UTC drift. */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function isUpcoming(iso: string): boolean {
  if (!iso) return false;
  const value = parseISODate(iso).getTime();
  const today = parseISODate(todayISO()).getTime();
  return value >= today;
}

export function formatEventDate(iso: string): string {
  if (!iso) return "Date to be announced";
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatJoinDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function sortByDate(events: Event[]): Event[] {
  return [...events].sort(
    (a, b) => parseISODate(a.date).getTime() - parseISODate(b.date).getTime()
  );
}
