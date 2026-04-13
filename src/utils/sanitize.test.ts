import { describe, expect, it } from 'vitest';

import {
  INVALID_IMAGE_URL_MESSAGE,
  INVALID_LINK_URL_MESSAGE,
  sanitizeImageUrlForImgSrc,
  sanitizeLinkUrlForHref,
  validateImageUrl,
  validateLinkUrl,
} from './sanitize';

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

  it('returns shared validation metadata for invalid link targets', () => {
    expect(validateLinkUrl('not a url')).toEqual({
      sanitizedValue: null,
      errorMessage: INVALID_LINK_URL_MESSAGE,
    });
    expect(validateLinkUrl('')).toEqual({
      sanitizedValue: null,
      errorMessage: INVALID_LINK_URL_MESSAGE,
    });
  });
});

describe('sanitizeImageUrlForImgSrc', () => {
  it('accepts safe absolute, relative, and data image URLs', () => {
    expect(sanitizeImageUrlForImgSrc('/image.png')).toBe('/image.png');
    expect(sanitizeImageUrlForImgSrc('./image.png')).toBe('./image.png');
    expect(sanitizeImageUrlForImgSrc('https://example.com/image.png')).toBe(
      'https://example.com/image.png',
    );
    expect(sanitizeImageUrlForImgSrc('data:image/png;base64,abcd')).toBe(
      'data:image/png;base64,abcd',
    );
  });

  it('rejects unsafe image sources and returns shared validation metadata', () => {
    expect(sanitizeImageUrlForImgSrc('javascript:alert(1)')).toBeNull();
    expect(sanitizeImageUrlForImgSrc('data:text/html;base64,abcd')).toBeNull();
    expect(validateImageUrl('not a url')).toEqual({
      sanitizedValue: null,
      errorMessage: INVALID_IMAGE_URL_MESSAGE,
    });
    expect(validateImageUrl('')).toEqual({
      sanitizedValue: null,
      errorMessage: INVALID_IMAGE_URL_MESSAGE,
    });
  });
});
