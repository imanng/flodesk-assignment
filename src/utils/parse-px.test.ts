import { describe, expect, it } from 'vitest';

import { formatSpacing, parsePx, parseSpacing } from './parse-px';

describe('parsePx', () => {
  it('parses px values', () => {
    expect(parsePx('24px', 0)).toBe(24);
  });

  it('returns the fallback for invalid values', () => {
    expect(parsePx(undefined, 8)).toBe(8);
  });
});

describe('parseSpacing', () => {
  it('expands a single value to all sides', () => {
    expect(parseSpacing('16px', 0)).toEqual({
      top: 16,
      right: 16,
      bottom: 16,
      left: 16,
    });
  });

  it('expands two-value shorthand correctly', () => {
    expect(parseSpacing('16px 24px', 0)).toEqual({
      top: 16,
      right: 24,
      bottom: 16,
      left: 24,
    });
  });

  it('expands three-value shorthand correctly', () => {
    expect(parseSpacing('48px 16px 8px', 0)).toEqual({
      top: 48,
      right: 16,
      bottom: 8,
      left: 16,
    });
  });

  it('keeps four-value shorthand intact', () => {
    expect(parseSpacing('1px 2px 3px 4px', 0)).toEqual({
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
    });
  });
});

describe('formatSpacing', () => {
  it('formats sides as CSS padding shorthand', () => {
    expect(formatSpacing({ top: 1, right: 2, bottom: 3, left: 4 })).toBe(
      '1px 2px 3px 4px',
    );
  });
});
