import {
  type BuilderTemplate,
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
): string | undefined => getTemplateName(selectBuilderTemplate(state, templateId));

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

export const selectActiveSelection = (
  state: Pick<BuilderState, "templateMap" | "selectedElementId">,
  templateId: string,
): { elementId: string; element: TemplateElement } | null => {
  const elementId = state.selectedElementId;
  if (!elementId) return null;

  const element = selectTemplateElement(state, templateId, elementId);
  if (!element) return null;

  return {
    elementId,
    element,
  };
};

export const selectActiveElementId = (
  state: Pick<BuilderState, "templateMap" | "selectedElementId">,
  templateId: string,
): string | null => selectActiveSelection(state, templateId)?.elementId ?? null;

export const selectActiveElementType = (
  state: Pick<BuilderState, "templateMap" | "selectedElementId">,
  templateId: string,
): TemplateElement["type"] | undefined =>
  selectActiveSelection(state, templateId)?.element.type;

export const selectIsElementSelected = (
  state: Pick<BuilderState, "templateMap" | "selectedElementId">,
  templateId: string,
  elementId: string,
): boolean => selectActiveElementId(state, templateId) === elementId;
