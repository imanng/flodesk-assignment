import { describe, expect, it } from 'vitest';

import { clampNumber } from './clamp';

describe('clampNumber', () => {
  it('returns the original value when it is in range', () => {
    expect(clampNumber(24, 0, 64)).toBe(24);
  });

  it('clamps values above the max', () => {
    expect(clampNumber(999, 0, 32)).toBe(32);
  });

  it('clamps values below the min', () => {
    expect(clampNumber(-10, 12, 72)).toBe(12);
  });
});
