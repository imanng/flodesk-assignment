export const clampNumber = (
  value: number,
  min: number,
  max: number,
): number => Math.max(min, Math.min(max, value));
