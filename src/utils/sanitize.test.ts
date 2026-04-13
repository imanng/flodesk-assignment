import { describe, expect, it } from 'vitest';

import { sanitizeLinkUrlForHref } from './sanitize';

describe('sanitizeLinkUrlForHref', () => {
  it('accepts safe absolute and relative link targets', () => {
    expect(sanitizeLinkUrlForHref('#')).toBe('#');
    expect(sanitizeLinkUrlForHref('#contact')).toBe('#contact');
    expect(sanitizeLinkUrlForHref('/contact')).toBe('/contact');
    expect(sanitizeLinkUrlForHref('./contact')).toBe('./contact');
    expect(sanitizeLinkUrlForHref('../contact')).toBe('../contact');
    expect(sanitizeLinkUrlForHref('?ref=cta')).toBe('?ref=cta');
    expect(sanitizeLinkUrlForHref('https://example.com')).toBe('https://example.com');
    expect(sanitizeLinkUrlForHref('mailto:hello@example.com')).toBe('mailto:hello@example.com');
    expect(sanitizeLinkUrlForHref('tel:+15551234567')).toBe('tel:+15551234567');
  });

  it('rejects unsafe and malformed link targets', () => {
    expect(sanitizeLinkUrlForHref('')).toBeNull();
    expect(sanitizeLinkUrlForHref('not a url')).toBeNull();
    expect(sanitizeLinkUrlForHref('example.com')).toBeNull();
    expect(sanitizeLinkUrlForHref('javascript:alert(1)')).toBeNull();
    expect(sanitizeLinkUrlForHref('data:text/html;base64,abcd')).toBeNull();
    expect(sanitizeLinkUrlForHref('ftp://example.com')).toBeNull();
  });
});
