import { Weekday } from '../domain/types/nutrition.types';

export const WEEKDAY_ORDER_MAP: Record<Weekday, number> = {
  [Weekday.MONDAY]: 1,
  [Weekday.TUESDAY]: 2,
  [Weekday.WEDNESDAY]: 3,
  [Weekday.THURSDAY]: 4,
  [Weekday.FRIDAY]: 5,
  [Weekday.SATURDAY]: 6,
  [Weekday.SUNDAY]: 7,
};

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  [Weekday.MONDAY]: 'Monday',
  [Weekday.TUESDAY]: 'Tuesday',
  [Weekday.WEDNESDAY]: 'Wednesday',
  [Weekday.THURSDAY]: 'Thursday',
  [Weekday.FRIDAY]: 'Friday',
  [Weekday.SATURDAY]: 'Saturday',
  [Weekday.SUNDAY]: 'Sunday',
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  [Weekday.MONDAY]: 'Mon',
  [Weekday.TUESDAY]: 'Tue',
  [Weekday.WEDNESDAY]: 'Wed',
  [Weekday.THURSDAY]: 'Thu',
  [Weekday.FRIDAY]: 'Fri',
  [Weekday.SATURDAY]: 'Sat',
  [Weekday.SUNDAY]: 'Sun',
};

/**
 * Returns the client local date formatted as YYYY-MM-DD using the browser's local timezone.
 * Enforces: ONLY TODAY IS EDITABLE based on local client date.
 */
export function getClientTodayDateString(): string {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Returns the current local weekday of the client.
 */
export function getClientTodayWeekday(): Weekday {
  const dayIndex = new Date().getDay();
  const mapping: Record<number, Weekday> = {
    0: Weekday.SUNDAY,
    1: Weekday.MONDAY,
    2: Weekday.TUESDAY,
    3: Weekday.WEDNESDAY,
    4: Weekday.THURSDAY,
    5: Weekday.FRIDAY,
    6: Weekday.SATURDAY,
  };
  return mapping[dayIndex] || Weekday.MONDAY;
}

/**
 * Converts a Date or ISO string into a local YYYY-MM-DD calendar date string.
 */
export function normalizeCalendarDateString(dateInput: string | Date): string {
  if (!dateInput) return getClientTodayDateString();
  if (typeof dateInput === 'string') {
    // If already YYYY-MM-DD, extract first 10 characters
    if (/^\d{4}-\d{2}-\d{2}/.test(dateInput)) {
      return dateInput.slice(0, 10);
    }
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-CA');
    }
    return dateInput.slice(0, 10);
  }
  return dateInput.toLocaleDateString('en-CA');
}

/**
 * Checks if a given date string corresponds to client local today.
 */
export function isDateToday(dateInput: string | Date): boolean {
  return normalizeCalendarDateString(dateInput) === getClientTodayDateString();
}

/**
 * Checks if a given date string is in the past relative to client local today.
 */
export function isDatePast(dateInput: string | Date): boolean {
  return normalizeCalendarDateString(dateInput) < getClientTodayDateString();
}

/**
 * Checks if a given date string is in the future relative to client local today.
 */
export function isDateFuture(dateInput: string | Date): boolean {
  return normalizeCalendarDateString(dateInput) > getClientTodayDateString();
}

/**
 * Formats a date cleanly for display in the UI.
 */
export function formatReadableDate(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Parses a time string (e.g., "08:00", "08:00 AM", "13:30", "1:30 PM") into minutes from midnight (0..1439).
 * Returns null if the time cannot be parsed.
 */
export function parseMealTimeMinutes(timeOfDay?: string | null): number | null {
  if (!timeOfDay) return null;
  const trimmed = timeOfDay.trim();
  if (!trimmed) return null;

  // Regex matching "HH:mm" or "HH:mm AM/PM" or "H:mm"
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*([APap][Mm]))?$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3]?.toUpperCase();

  if (meridian === 'PM' && hours < 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Checks whether a scheduled meal time has arrived for client local today.
 * If timeOfDay is not specified or unparseable, defaults to true (available).
 * If specified, returns true if current time >= scheduled time.
 */
export function isMealTimeAvailable(
  timeOfDay?: string | null,
  referenceDate: Date = new Date(),
): boolean {
  const targetMinutes = parseMealTimeMinutes(timeOfDay);
  if (targetMinutes === null) return true;

  const currentMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();
  return currentMinutes >= targetMinutes;
}
