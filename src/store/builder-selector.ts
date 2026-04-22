import {
  type BuilderTemplate,
  findElementInSection,
  getTemplateElement,
  getTemplateName,
  getTemplatePageSettings,
  getTemplateSection,
  getTemplateSectionOrder,
  materializeTemplate,
} from "@/store/builder-template";
import type {
  PageSettings,
  Template,
  TemplateElement,
  TemplateSection,
} from "@/types/template";

import type { BuilderState } from "./builder-store";

const selectBuilderTemplate = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): BuilderTemplate | undefined => state.templateMap[templateId];

const selectSelectedElementId = (
  state: Pick<BuilderState, "session">,
  templateId: string,
): string | null => state.session.selectedElementIds[templateId] ?? null;

/**
 * Page-level settings consumed by preview and page settings panel.
 */
export const selectPageSettings = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): PageSettings | undefined =>
  getTemplatePageSettings(selectBuilderTemplate(state, templateId));

export const selectMaterializedTemplate = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): Template | undefined =>
  materializeTemplate(selectBuilderTemplate(state, templateId));

export const createSelectMaterializedTemplate = (templateId: string) => {
  let cachedTemplate: BuilderTemplate | undefined;
  let cachedMaterializedTemplate: Template | undefined;

  /**
   * Returns the normalized runtime template used by preview/export and
   * memoizes by builder-template identity to avoid redundant rematerialization.
   */
  return (state: Pick<BuilderState, "templateMap">): Template | undefined => {
    const template = selectBuilderTemplate(state, templateId);
    if (template === cachedTemplate) {
      return cachedMaterializedTemplate;
    }

    cachedTemplate = template;
    cachedMaterializedTemplate = template
      ? materializeTemplate(template)
      : undefined;
    return cachedMaterializedTemplate;
  };
};

export const createSelectMaterializedTemplates = () => {
  let cachedTemplateMap: BuilderState["templateMap"] | null = null;
  let cachedTemplates: Template[] = [];

  return (state: Pick<BuilderState, "templateMap">): Template[] => {
    if (state.templateMap === cachedTemplateMap) {
      return cachedTemplates;
    }

    cachedTemplateMap = state.templateMap;
    cachedTemplates = Object.values(state.templateMap).flatMap((template) => {
      const materialized = materializeTemplate(template);
      return materialized ? [materialized] : [];
    });
    return cachedTemplates;
  };
};

export const selectHasTemplate = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string | undefined,
): boolean => {
  if (!templateId) return false;
  return Boolean(selectBuilderTemplate(state, templateId));
};

export const selectTemplateName = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): string | undefined =>
  getTemplateName(selectBuilderTemplate(state, templateId));

export const selectTemplateSectionOrder = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): string[] | undefined =>
  getTemplateSectionOrder(selectBuilderTemplate(state, templateId));

export const selectTemplateSection = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
  sectionId: string,
): TemplateSection | undefined =>
  getTemplateSection(selectBuilderTemplate(state, templateId), sectionId);

export const selectTemplateElement = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
  elementId: string | null,
): TemplateElement | undefined =>
  getTemplateElement(selectBuilderTemplate(state, templateId), elementId);

const findSectionIdInTemplate = (
  template: BuilderTemplate | undefined,
  elementId: string,
): string | null => {
  if (!template) return null;

  for (const sectionId of template.sectionOrder) {
    const section = template.sectionMap[sectionId];
    if (!section) continue;

    if (findElementInSection(section, elementId)) {
      return sectionId;
    }
  }

  return null;
};

export const selectActiveSelection = (
  state: Pick<BuilderState, "session" | "templateMap">,
  templateId: string,
): { elementId: string; element: TemplateElement } | null => {
  const elementId = selectSelectedElementId(state, templateId);
  if (!elementId) return null;

  const element = selectTemplateElement(state, templateId, elementId);
  if (!element) return null;

  return {
    elementId,
    element,
  };
};

/**
 * Active element id for current template, if a valid selection exists.
 */
export const selectActiveElementId = (
  state: Pick<BuilderState, "session" | "templateMap">,
  templateId: string,
): string | null => selectActiveSelection(state, templateId)?.elementId ?? null;

/**
 * Resolves the section containing the currently selected element. This powers
 * section-scoped selection rendering in preview.
 */
export const selectActiveSectionId = (
  state: Pick<BuilderState, "session" | "templateMap">,
  templateId: string,
): string | null => {
  const elementId = selectSelectedElementId(state, templateId);
  if (!elementId) return null;

  return findSectionIdInTemplate(
    selectBuilderTemplate(state, templateId),
    elementId,
  );
};

export const selectActiveElementType = (
  state: Pick<BuilderState, "session" | "templateMap">,
  templateId: string,
): TemplateElement["type"] | undefined =>
  selectActiveSelection(state, templateId)?.element.type;

export const selectIsElementSelected = (
  state: Pick<BuilderState, "session" | "templateMap">,
  templateId: string,
  elementId: string,
): boolean => selectActiveElementId(state, templateId) === elementId;
