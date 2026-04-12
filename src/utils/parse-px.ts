export const parsePx = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export type SpacingSides = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const parseSpacing = (
  value: string | undefined,
  fallback: number,
): SpacingSides => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length === 0) {
    return {
      top: fallback,
      right: fallback,
      bottom: fallback,
      left: fallback,
    };
  }

  const [first, second = first, third = first, fourth = second] = parts;

  if (parts.length === 1) {
    const all = parsePx(first, fallback);
    return { top: all, right: all, bottom: all, left: all };
  }

  if (parts.length === 2) {
    const vertical = parsePx(first, fallback);
    const horizontal = parsePx(second, fallback);
    return {
      top: vertical,
      right: horizontal,
      bottom: vertical,
      left: horizontal,
    };
  }

  if (parts.length === 3) {
    return {
      top: parsePx(first, fallback),
      right: parsePx(second, fallback),
      bottom: parsePx(third, fallback),
      left: parsePx(second, fallback),
    };
  }

  return {
    top: parsePx(first, fallback),
    right: parsePx(second, fallback),
    bottom: parsePx(third, fallback),
    left: parsePx(fourth, fallback),
  };
};

export const formatSpacing = ({ top, right, bottom, left }: SpacingSides): string =>
  `${top}px ${right}px ${bottom}px ${left}px`;
