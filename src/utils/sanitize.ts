import sanitizeHtml from "sanitize-html";

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: ["b", "i", "em", "strong", "br", "u", "span"],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

/** No tags: plain text safe for static HTML export (see sanitize-html escaping rules). */
const EXPORT_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

export type SanitizeExportKind = "body" | "title" | "attribute";

export const sanitizeHtmlForExport = (
  raw: string,
  kind: SanitizeExportKind,
): string => {
  const base = sanitizeHtml(raw, EXPORT_CONFIG);
  switch (kind) {
    case "body":
      return base.replace(/\n/g, "<br />");
    case "title":
      return base.replace(/\s+/g, " ").trim();
    case "attribute":
      return base;
  }
};

export const sanitizeContent = (dirty: string): string => {
  return sanitizeHtml(dirty, SANITIZE_CONFIG);
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
