/**
 * Product-specific visual values that cake& does not currently expose.
 *
 * Keep exceptions centralized here so identical Figma values do not drift
 * across components. Prefer a cake& CSS token whenever an exact match exists.
 */

/** Figma `gradient/ai/surface` (indigo/30 → violet/60). */
export const AI_SURFACE_GRADIENT =
  'linear-gradient(9.46deg, rgba(32, 52, 183, 0.15) 0%, rgba(160, 120, 255, 0.15) 100%)';

/** Suggestion and status text gradient (indigo/70 → purple/70). */
export const AI_TEXT_GRADIENT =
  'linear-gradient(5.69deg, rgb(152, 164, 255) 0%, rgb(221, 138, 255) 100%)';

/** Figma indigo/alphaLighter; cake& exposes 22%, not this 12% wash. */
export const SPORTS_INDIGO_ALPHA_LIGHTER = 'rgba(80, 102, 255, 0.12)';

/** Shared black/50 glass fill used where an opaque surface would hide video. */
export const SPORTS_GLASS_BACKGROUND = 'rgba(0, 0, 0, 0.5)';
