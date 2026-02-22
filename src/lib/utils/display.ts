/**
 * Helpers so we never show broken or placeholder data to visitors.
 * Use for any user-facing string or number that might be null, "0", or "null".
 */

const BROKEN_VALUES = ["", "null", "0"];

function isBroken(value: string | number | null | undefined): boolean {
  if (value == null) return true;
  const s = String(value).trim().toLowerCase();
  return BROKEN_VALUES.includes(s);
}

/** Use for display in UI. Returns fallback when value is null, empty, "0", or literal "null". */
export function displayValue(
  value: string | number | null | undefined,
  fallback: string = "Not available"
): string {
  if (isBroken(value)) return fallback;
  return String(value).trim();
}

/** Returns true if the value should be treated as missing for display. */
export function isMissing(value: string | number | null | undefined): boolean {
  return isBroken(value);
}
