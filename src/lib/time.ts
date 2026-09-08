/**
 * Parse the clock labels used by mocked media (`m:ss` or `h:mm:ss`).
 *
 * Invalid labels return the caller-provided fallback so UI surfaces can choose
 * whether an unknown duration means zero or a demo-safe preview length.
 */
export function parseClock(label: string, fallback = 0): number {
  const parts = label.split(':').map(Number);
  if (
    (parts.length !== 2 && parts.length !== 3) ||
    parts.some((part) => !Number.isFinite(part) || part < 0)
  ) {
    return fallback;
  }

  return parts.length === 2
    ? parts[0] * 60 + parts[1]
    : parts[0] * 3600 + parts[1] * 60 + parts[2];
}

/** Format seconds as the `m:ss` labels shared by players and trim controls. */
export function formatClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`;
}
