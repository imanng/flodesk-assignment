import { FONT_STACKS } from "@/constants/font-presets";
import type {
  ElementSettings,
  Template,
  TemplateColumn,
  TemplateElement,
  TemplateSection,
} from "@/types/template";
import {
  escapeHtmlForExport,
  sanitizeExportDocument,
  sanitizeImageUrlForImgSrc,
  sanitizeLinkUrlForHref,
} from "@/utils/sanitize";

const cssFromSettings = (settings: ElementSettings): string => {
  const parts: string[] = [
    `font-size: ${settings.fontSize}`,
    `color: ${settings.color}`,
    `text-align: ${settings.textAlign}`,
    `padding: ${settings.padding}`,
    `background-color: ${settings.backgroundColor}`,
  ];

  if (settings.borderRadius)
    parts.push(`border-radius: ${settings.borderRadius}`);
  if (settings.fontWeight) {
    parts.push(
      `font-weight: ${settings.fontWeight === "medium" ? "500" : settings.fontWeight}`,
    );
  }
  if (settings.letterSpacing)
    parts.push(`letter-spacing: ${settings.letterSpacing}`);
  if (settings.lineHeight) parts.push(`line-height: ${settings.lineHeight}`);

  return parts.join("; ");
};

const elementToHtml = (el: TemplateElement): string => {
  const style = cssFromSettings(el.settings);

  switch (el.type) {
    case "heading": {
      const tag = `h${el.data.level}`;
      return `<${tag} style="${style}">${escapeHtmlForExport(el.data.text, "body")}</${tag}>`;
    }

    case "text":
      return `<p style="${style}">${escapeHtmlForExport(el.data.text, "body")}</p>`;

    case "button": {
      const href = sanitizeLinkUrlForHref(el.data.href ?? "") || "#";
      const target = el.data.target || "_self";
      const wrapperStyle = `text-align: ${el.settings.textAlign}; padding: ${el.settings.padding}`;
      const btnStyle = `display: inline-block; font-size: ${el.settings.fontSize}; color: ${el.settings.color}; background-color: ${el.settings.backgroundColor}; padding: ${el.settings.padding}; border-radius: ${el.settings.borderRadius || "0"}; font-weight: ${el.settings.fontWeight === "medium" ? "500" : el.settings.fontWeight || "normal"}; text-decoration: none; border: none; cursor: pointer`;
      return `<div style="${wrapperStyle}"><a href="${href}" target="${target}" style="${btnStyle}">${escapeHtmlForExport(el.data.label, "body")}</a></div>`;
    }

    case "image": {
      const src = sanitizeImageUrlForImgSrc(el.data.src) || "";
      const imgStyle = `display: block; width: 100%; height: auto; border-radius: ${el.settings.borderRadius || "0"}; object-fit: cover`;
      return `<div style="padding: ${el.settings.padding}"><img src="${src}" alt="${escapeHtmlForExport(el.data.alt, "attribute")}" style="${imgStyle}" /></div>`;
    }

    case "divider":
      return `<div style="padding: ${el.settings.padding}"><hr style="border: none; border-top: 1px solid ${el.settings.color}; margin: 0;" /></div>`;

    default:
      return "";
  }
};

const columnToHtml = (col: TemplateColumn): string =>
  `<div style="display: flex; flex-direction: column;">${col.elements.map(elementToHtml).join("\n")}</div>`;

const sectionToHtml = (section: TemplateSection): string => {
  const sectionStyle = [
    `padding: ${section.settings.padding}`,
    section.settings.backgroundColor
      ? `background-color: ${section.settings.backgroundColor}`
      : "",
    section.settings.borderRadius
      ? `border-radius: ${section.settings.borderRadius}`
      : "",
  ]
    .filter(Boolean)
    .join("; ");

  if (section.layout === "columns" && section.columns) {
    const gridStyle = `display: grid; grid-template-columns: repeat(${section.columns.length}, minmax(0, 1fr)); gap: ${section.gap}`;
    return `<div style="${sectionStyle}"><div style="${gridStyle}">${section.columns.map(columnToHtml).join("\n")}</div></div>`;
  }

  const elements = section.elements?.map(elementToHtml).join("\n") ?? "";
  return `<div style="${sectionStyle}">${elements}</div>`;
};

export const exportToHtml = (template: Template): string => {
  const fontStack = FONT_STACKS[template.pageSettings.fontPreset];
  const bodyContent = template.sections.map(sectionToHtml).join("\n");
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtmlForExport(template.name, "title")}</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: ${fontStack}; background-color: ${template.pageSettings.backgroundColor}; }
        img { max-width: 100%; }
      </style>
    </head>
    <body>
      <div style="max-width: ${template.pageSettings.maxWidth}; margin: 0 auto;">
    ${bodyContent}
      </div>
    </body>
    </html>
  `;

  return sanitizeExportDocument(html);
};

export const downloadHtml = (template: Template): void => {
  const html = exportToHtml(template);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${template.id}-page.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
