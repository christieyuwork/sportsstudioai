/**
 * Canonical clip title — `23′ · YELLOW CARD · Alex Rivera`. Detected events and
 * agent-generated clips share one shape, so compose every title here instead of
 * writing the separators by hand.
 */

export interface ClipTitleParts {
  /** Match minute, e.g. `23` or `'45+2'`. Omitted for moments without one. */
  minute?: number | string;
  /** Event type; rendered in caps, e.g. `'yellow card'`. */
  eventType: string;
  /** Player credited with the moment, when one applies. */
  player?: string;
}

export function formatClipTitle({ minute, eventType, player }: ClipTitleParts) {
  return [formatMatchMinute(minute), eventType.toLocaleUpperCase(), player]
    .filter(Boolean)
    .join(' · ');
}

/** `23` → `23′`. Empty when the moment has no match minute. */
function formatMatchMinute(minute?: number | string) {
  return minute === undefined || minute === '' ? '' : `${minute}′`;
}
