import type {
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
import {
  getButtonContentStyle,
  getButtonWrapperStyle,
  getColumnsLayoutStyle,
  getColumnStyle,
  getDividerStyle,
  getDividerWrapperStyle,
  getElementStyle,
  getExportBodyStyle,
  getExportPageContentStyle,
  getImageStyle,
  getImageWrapperStyle,
  getSectionStyle,
  serializeInlineStyle,
} from "@/utils/template-styles";

const elementToHtml = (el: TemplateElement): string => {
  const style = serializeInlineStyle(getElementStyle(el.settings));

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
      const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
      const wrapperStyle = serializeInlineStyle(getButtonWrapperStyle(el.settings));
      const btnStyle = serializeInlineStyle(getButtonContentStyle(el.settings, "pointer"));
      return `<div style="${wrapperStyle}"><a href="${href}" target="${target}"${rel} style="${btnStyle}">${escapeHtmlForExport(el.data.label, "body")}</a></div>`;
    }

    case "image": {
      const src = sanitizeImageUrlForImgSrc(el.data.src) || "";
      const wrapperStyle = serializeInlineStyle(getImageWrapperStyle(el.settings));
      const imgStyle = serializeInlineStyle(getImageStyle(el.settings));
      return `<div style="${wrapperStyle}"><img src="${src}" alt="${escapeHtmlForExport(el.data.alt, "attribute")}" style="${imgStyle}" /></div>`;
    }

    case "divider":
      return `<div style="${serializeInlineStyle(getDividerWrapperStyle(el.settings))}"><hr style="${serializeInlineStyle(getDividerStyle(el.settings))}" /></div>`;

    default:
      return "";
  }
};

const columnToHtml = (col: TemplateColumn): string =>
  `<div style="${serializeInlineStyle(getColumnStyle())}">${col.elements.map(elementToHtml).join("\n")}</div>`;

const sectionToHtml = (section: TemplateSection): string => {
  const sectionStyle = serializeInlineStyle(getSectionStyle(section));

  if (section.layout === "columns" && section.columns) {
    const gridStyle = serializeInlineStyle(
      getColumnsLayoutStyle(section.columns.length, section.gap),
    );
    return `<div style="${sectionStyle}"><div style="${gridStyle}">${section.columns.map(columnToHtml).join("\n")}</div></div>`;
  }

  const elements = section.elements?.map(elementToHtml).join("\n") ?? "";
  return `<div style="${sectionStyle}">${elements}</div>`;
};

export const exportToHtml = (template: Template): string => {
  const bodyContent = template.sections.map(sectionToHtml).join("\n");
  const bodyStyle = serializeInlineStyle(getExportBodyStyle(template.pageSettings));
  const pageContentStyle = serializeInlineStyle(
    getExportPageContentStyle(template.pageSettings),
  );
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtmlForExport(template.name, "title")}</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { ${bodyStyle}; }
        img { max-width: 100%; }
      </style>
    </head>
    <body>
      <div style="${pageContentStyle}">
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
