import sanitizeHtml from 'sanitize-html';

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'br', 'u', 'span'],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};

export function sanitizeContent(dirty: string): string {
  return sanitizeHtml(dirty, SANITIZE_CONFIG);
}
