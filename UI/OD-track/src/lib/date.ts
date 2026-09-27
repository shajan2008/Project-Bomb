// All calendars in this app previously mixed two date strategies: plain
// "YYYY-MM-DD" keys for lookups, and `new Date(str)` for display formatting.
// `new Date('2024-10-05')` parses as UTC midnight, then `.toLocaleDateString()`
// renders it in the *browser's local zone* — for any zone behind UTC that
// silently shows the previous day. That's the off-by-one date bug mentioned
// in the brief. The fix used throughout this codebase: never hand a
// "YYYY-MM-DD" string to `new Date()`. Parse the parts manually and only use
// `Date` for pure calendar-grid math (days-in-month / weekday-of-1st), which
// only cares about the local calendar, not an instant in time.

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ymd(year: number, month0: number, day: number): string {
  return `${year}-${String(month0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

export function firstWeekday(year: number, month0: number): number {
  return new Date(year, month0, 1).getDay();
}

/** Parses a "YYYY-MM-DD" key into its numeric parts without going through Date/timezone conversion. */
export function parseYmd(key: string): { year: number; month0: number; day: number } {
  const [y, m, d] = key.split('-').map(Number);
  return { year: y, month0: m - 1, day: d };
}

/** Formats a "YYYY-MM-DD" key as "5 October 2024" with zero timezone risk. */
export function formatLongDate(key: string): string {
  const { year, month0, day } = parseYmd(key);
  return `${day} ${MONTHS_LONG[month0]} ${year}`;
}
