import type {
  ElementSettings,
  PageSettings,
  Template,
  TemplateColumn,
  TemplateElement,
  TemplateSection,
} from "@/types/template";

export type BuilderTemplate = Omit<Template, "sections"> & {
  sectionOrder: string[];
  sectionMap: Record<string, TemplateSection>;
};

export const isBuilderTemplate = (
  template: Template | BuilderTemplate,
): template is BuilderTemplate =>
  "sectionMap" in template && "sectionOrder" in template;

export const normalizeTemplate = (
  template: Template | BuilderTemplate,
): BuilderTemplate => {
  if (isBuilderTemplate(template)) {
    const { sectionOrder, sectionMap, ...rest } = template;
    return normalizeTemplate({
      ...rest,
      sections: sectionOrder
        .map((sectionId) => sectionMap[sectionId])
        .filter(Boolean) as TemplateSection[],
    });
  }

  const cloned = structuredClone(template);
  const sectionOrder = cloned.sections.map((section) => section.id);
  const sectionMap = Object.fromEntries(
    cloned.sections.map((section) => [section.id, section]),
  ) as Record<string, TemplateSection>;

  const { sections: _sections, ...rest } = cloned;
  return {
    ...rest,
    sectionOrder,
    sectionMap,
  };
};

export const buildTemplateMap = (
  templates: Template[],
): Record<string, BuilderTemplate> =>
  templates.reduce<Record<string, BuilderTemplate>>((map, template) => {
    map[template.id] = normalizeTemplate(template);
    return map;
  }, {});

export const materializeTemplate = (
  template?: BuilderTemplate,
): Template | undefined => {
  if (!template) return undefined;

  const { sectionOrder, sectionMap, ...rest } = template;
  return structuredClone({
    ...rest,
    sections: sectionOrder
      .map((sectionId) => sectionMap[sectionId])
      .filter(Boolean) as TemplateSection[],
  });
};

export const getTemplatePageSettings = (
  template?: BuilderTemplate,
): PageSettings | undefined => template?.pageSettings;

export const getTemplateName = (
  template?: BuilderTemplate,
): string | undefined => template?.name;

export const getTemplateSectionOrder = (
  template?: BuilderTemplate,
): string[] | undefined => template?.sectionOrder;

export const getTemplateSection = (
  template: BuilderTemplate | undefined,
  sectionId: string,
): TemplateSection | undefined => template?.sectionMap[sectionId];

export const findElementInColumn = (
  column: TemplateColumn,
  elementId: string,
): TemplateElement | undefined =>
  column.elements.find((element) => element.id === elementId);

export const findElementInSection = (
  section: TemplateSection,
  elementId: string,
): TemplateElement | undefined => {
  const stackElement = section.elements?.find(
    (element) => element.id === elementId,
  );
  if (stackElement) return stackElement;

  for (const column of section.columns ?? []) {
    const columnElement = findElementInColumn(column, elementId);
    if (columnElement) return columnElement;
  }

  return undefined;
};

export const findElementInTemplate = (
  template: BuilderTemplate,
  elementId: string,
): TemplateElement | undefined => {
  for (const sectionId of template.sectionOrder) {
    const section = template.sectionMap[sectionId];
    if (!section) continue;

    const element = findElementInSection(section, elementId);
    if (element) return element;
  }

  return undefined;
};

export const getTemplateElement = (
  template: BuilderTemplate | undefined,
  elementId: string | null,
): TemplateElement | undefined => {
  if (!template || !elementId) return undefined;
  return findElementInTemplate(template, elementId);
};

export const updateTemplateElement = (
  template: BuilderTemplate | undefined,
  elementId: string,
  updater: (element: TemplateElement) => void,
): TemplateElement | undefined => {
  if (!template) return undefined;

  const element = findElementInTemplate(template, elementId);
  if (!element) return undefined;

  updater(element);
  return element;
};

export const patchTemplateElementSettings = (
  template: BuilderTemplate | undefined,
  elementId: string,
  patch: Partial<ElementSettings>,
): TemplateElement | undefined =>
  updateTemplateElement(template, elementId, (element) => {
    Object.assign(element.settings, patch);
  });

export function patchTemplateElementData(
  template: BuilderTemplate | undefined,
  elementId: string,
  elementType: TemplateElement["type"],
  patch: Partial<TemplateElement["data"]>,
): TemplateElement | undefined {
  return updateTemplateElement(template, elementId, (element) => {
    if (element.type !== elementType) return;
    Object.assign(element.data, patch);
  });
}
