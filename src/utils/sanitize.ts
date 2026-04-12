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
    ADD_ATTR: ["target"],
    WHOLE_DOCUMENT: true,
  });

  return sanitized.toLowerCase().startsWith("<!doctype html>")
    ? sanitized
    : `<!DOCTYPE html>\n${sanitized}`;
};

// Validate image URL for use in img src attribute
export const sanitizeImageUrlForImgSrc = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("vbscript:"))
    return null;
  if (lower.startsWith("data:")) {
    return lower.startsWith("data:image/") ? trimmed : null;
  }
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:" ? trimmed : null;
  } catch {
    if (trimmed.startsWith("/") || trimmed.startsWith("./")) return trimmed;
    return null;
  }
};
