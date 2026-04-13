import DOMPurify from "dompurify";

export type ExportEscapeKind = "body" | "title" | "attribute";

const escapeHtml = (raw: string): string =>
  raw
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const escapeHtmlForExport = (
  raw: string,
  kind: ExportEscapeKind,
): string => {
  switch (kind) {
    case "body":
      return escapeHtml(raw).replace(/\r?\n/g, "<br />");
    case "title":
      return escapeHtml(raw).replace(/\s+/g, " ").trim();
    case "attribute":
      return escapeHtml(raw);
  }
};

export const sanitizeExportDocument = (html: string): string => {
  const sanitized = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel"],
    WHOLE_DOCUMENT: true,
  });

  return sanitized.toLowerCase().startsWith("<!doctype html>")
    ? sanitized
    : `<!DOCTYPE html>\n${sanitized}`;
};

const BLOCKED_PROTOCOLS = ["javascript:", "vbscript:", "data:"];
const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const SAFE_IMAGE_PROTOCOLS = new Set(["http:", "https:"]);

type SanitizeUrlOptions = {
  allowedProtocols: Set<string>;
  relativePrefixes?: string[];
  allowDataUrl?: (lowerValue: string) => boolean;
};

const sanitizeUrl = (
  input: string,
  { allowedProtocols, relativePrefixes = [], allowDataUrl }: SanitizeUrlOptions,
): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("data:")) {
    return allowDataUrl?.(lower) ? trimmed : null;
  }

  if (BLOCKED_PROTOCOLS.some((protocol) => lower.startsWith(protocol))) {
    return null;
  }

  if (relativePrefixes.some((prefix) => trimmed.startsWith(prefix))) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    return allowedProtocols.has(url.protocol) ? trimmed : null;
  } catch {
    return null;
  }
};

export const INVALID_LINK_URL_MESSAGE =
  "Invalid URL. Please use https://, mailto:, tel:, /path, or #anchor.";
export const INVALID_IMAGE_URL_MESSAGE =
  "Invalid URL. Please use an image URL like https://example.com/photo.jpg.";

type UrlValidationResult = {
  sanitizedValue: string | null;
  errorMessage?: string;
};

const getUrlValidationResult = (
  input: string,
  sanitize: (value: string) => string | null,
  invalidMessage: string,
): UrlValidationResult => {
  const sanitizedValue = sanitize(input);

  return {
    sanitizedValue,
    errorMessage: !sanitizedValue ? invalidMessage : undefined,
  };
};

export const sanitizeLinkUrlForHref = (input: string): string | null => {
  return sanitizeUrl(input, {
    allowedProtocols: SAFE_LINK_PROTOCOLS,
    relativePrefixes: ["#", "/", "./", "../", "?"],
  });
};

export const sanitizeImageUrlForImgSrc = (input: string): string | null => {
  return sanitizeUrl(input, {
    allowedProtocols: SAFE_IMAGE_PROTOCOLS,
    relativePrefixes: ["/", "./"],
    allowDataUrl: (value) => value.startsWith("data:image/"),
  });
};

export const validateLinkUrl = (input: string): UrlValidationResult =>
  getUrlValidationResult(
    input,
    sanitizeLinkUrlForHref,
    INVALID_LINK_URL_MESSAGE,
  );

export const validateImageUrl = (input: string): UrlValidationResult =>
  getUrlValidationResult(
    input,
    sanitizeImageUrlForImgSrc,
    INVALID_IMAGE_URL_MESSAGE,
  );
