import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { TEMPLATES } from "@/constants/templates";
import type {
  ElementSettings,
  PageSettings,
  Template,
  TemplateColumn,
  TemplateElement,
  TemplateSection,
} from "@/types/template";

const STORAGE_KEY = "builder-store";

type BuilderTemplate = Omit<Template, "sections"> & {
  sectionOrder: string[];
  sectionMap: Record<string, TemplateSection>;
};

type BuilderState = {
  templateMap: Record<string, BuilderTemplate>;
  selectedElementId: string | null;

  selectElement: (elementId: string | null) => void;
  updatePageSettings: (
    templateId: string,
    patch: Partial<PageSettings>,
  ) => void;
  updateElementSettings: (
    templateId: string,
    elementId: string,
    patch: Partial<ElementSettings>,
  ) => void;
  updateElementData: (
    templateId: string,
    elementId: string,
    patch: Record<string, unknown>,
  ) => void;
  updateElementImage: (
    templateId: string,
    elementId: string,
    file: File,
  ) => void;
  resetTemplate: (templateId: string) => void;
};

const isBuilderTemplate = (
  template: Template | BuilderTemplate,
): template is BuilderTemplate =>
  "sectionMap" in template && "sectionOrder" in template;

const normalizeTemplate = (
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

const buildTemplateMap = (
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

const findElementInSection = (
  section: TemplateSection,
  elementId: string,
): TemplateElement | undefined => {
  if (section.elements) {
    return section.elements.find((el) => el.id === elementId);
  }

  if (section.columns) {
    for (const col of section.columns) {
      const found = findElementInColumn(col, elementId);
      if (found) return found;
    }
  }

  return undefined;
};

const findElementInColumn = (
  column: TemplateColumn,
  elementId: string,
): TemplateElement | undefined =>
  column.elements.find((el) => el.id === elementId);

const findElementInTemplate = (
  template: BuilderTemplate,
  elementId: string,
): TemplateElement | undefined => {
  for (const sectionId of template.sectionOrder) {
    const section = template.sectionMap[sectionId];
    if (!section) continue;

    const found = findElementInSection(section, elementId);
    if (found) return found;
  }

  return undefined;
};

const selectBuilderTemplate = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): BuilderTemplate | undefined => state.templateMap[templateId];

export const selectMaterializedTemplate = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): Template | undefined =>
  materializeTemplate(selectBuilderTemplate(state, templateId));

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
): string | undefined => selectBuilderTemplate(state, templateId)?.name;

export const selectPageSettings = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): PageSettings | undefined =>
  selectBuilderTemplate(state, templateId)?.pageSettings;

export const selectTemplateSectionOrder = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
): string[] | undefined =>
  selectBuilderTemplate(state, templateId)?.sectionOrder;

export const selectTemplateSection = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
  sectionId: string,
): TemplateSection | undefined =>
  selectBuilderTemplate(state, templateId)?.sectionMap[sectionId];

export const selectTemplateElement = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
  elementId: string | null,
): TemplateElement | undefined => {
  if (!elementId) return undefined;

  const template = selectBuilderTemplate(state, templateId);
  if (!template) return undefined;

  return findElementInTemplate(template, elementId);
};

export const selectElementType = (
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
  elementId: string | null,
): TemplateElement["type"] | undefined =>
  selectTemplateElement(state, templateId, elementId)?.type;

export const selectIsElementSelected = (
  state: Pick<BuilderState, "templateMap" | "selectedElementId">,
  templateId: string,
  elementId: string,
): boolean =>
  state.selectedElementId === elementId &&
  Boolean(selectTemplateElement(state, templateId, elementId));

export const useBuilderStore = create<BuilderState>()(
  persist(
    immer((set) => ({
      templateMap: buildTemplateMap(TEMPLATES),
      selectedElementId: null,

      selectElement: (elementId) =>
        set((draft) => {
          draft.selectedElementId = elementId;
        }),

      updatePageSettings: (templateId, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;
          Object.assign(template.pageSettings, patch);
        }),

      updateElementSettings: (templateId, elementId, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;

          const element = findElementInTemplate(template, elementId);
          if (!element) return;

          Object.assign(element.settings, patch);
        }),

      updateElementData: (templateId, elementId, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;

          const element = findElementInTemplate(template, elementId);
          if (!element) return;

          Object.assign(element.data, patch);
        }),

      updateElementImage: (templateId, elementId, file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          set((draft) => {
            const template = draft.templateMap[templateId];
            if (!template) return;

            const element = findElementInTemplate(template, elementId);
            if (!element || element.type !== "image") return;

            Object.assign(element.data, { src, source: "upload" });
          });
        };
        reader.readAsDataURL(file);
      },

      resetTemplate: (templateId) =>
        set((draft) => {
          const original = TEMPLATES.find((t) => t.id === templateId);
          if (!original) return;
          draft.templateMap[templateId] = normalizeTemplate(original);
          draft.selectedElementId = null;
        }),
    })),
    {
      name: STORAGE_KEY,

      partialize: (state) => ({
        templateMap: state.templateMap,
      }),
    },
  ),
);
