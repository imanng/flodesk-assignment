import sanitizeHtml from 'sanitize-html';

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'br', 'u', 'span'],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};

export function sanitizeContent(dirty: string): string {
  return sanitizeHtml(dirty, SANITIZE_CONFIG);
}

/** Allow only safe values for `<img src>` (http(s), data:image/*, same-origin paths). */
export function sanitizeImageUrlForImgSrc(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return null;
  if (lower.startsWith('data:')) {
    return lower.startsWith('data:image/') ? trimmed : null;
  }
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:' ? trimmed : null;
  } catch {
    if (trimmed.startsWith('/') || trimmed.startsWith('./')) return trimmed;
    return null;
  }
}
