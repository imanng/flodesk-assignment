import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Template,
  PageSettings,
  ElementSettings,
  TemplateElement,
  TemplateSection,
} from "@/types/template";
import { TEMPLATES } from "@/constants/templates";
import { sanitizeContent } from "@/utils/sanitize";

const STORAGE_KEY = "builder-store";
const STORE_VERSION = 2;

interface BuilderTemplate extends Omit<Template, "sections"> {
  sectionOrder: string[];
  sectionById: Record<string, TemplateSection>;
}

interface BuilderState {
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
  updateTextData: (
    templateId: string,
    elementId: string,
    patch: Record<string, unknown>,
  ) => void;
  updateImageData: (
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
}

type PersistedBuilderState = Pick<
  BuilderState,
  "templateMap" | "selectedElementId"
>;

interface LegacyPersistedBuilderState {
  templateMap?: Record<string, Template>;
  selectedElementId?: string | null;
}

function isBuilderTemplate(
  template: Template | BuilderTemplate,
): template is BuilderTemplate {
  return "sectionById" in template && "sectionOrder" in template;
}

function normalizeTemplate(
  template: Template | BuilderTemplate,
): BuilderTemplate {
  if (isBuilderTemplate(template)) {
    const { sectionOrder, sectionById, ...rest } = template;
    return normalizeTemplate({
      ...rest,
      sections: sectionOrder
        .map((sectionId) => sectionById[sectionId])
        .filter(Boolean) as TemplateSection[],
    });
  }

  const cloned = structuredClone(template);
  const sectionOrder = cloned.sections.map((section) => section.id);
  const sectionById = Object.fromEntries(
    cloned.sections.map((section) => [section.id, section]),
  ) as Record<string, TemplateSection>;

  const { sections: _sections, ...rest } = cloned;
  return {
    ...rest,
    sectionOrder,
    sectionById,
  };
}

export function materializeTemplate(
  template?: BuilderTemplate,
): Template | undefined {
  if (!template) return undefined;

  const { sectionOrder, sectionById, ...rest } = template;
  return structuredClone({
    ...rest,
    sections: sectionOrder
      .map((sectionId) => sectionById[sectionId])
      .filter(Boolean) as TemplateSection[],
  });
}

function normalizeTemplateMap(
  templateMap?: Record<string, Template | BuilderTemplate>,
): Record<string, BuilderTemplate> {
  if (!templateMap || Object.keys(templateMap).length === 0) {
    return buildTemplateMap(TEMPLATES);
  }

  const map: Record<string, BuilderTemplate> = {};
  for (const [templateId, template] of Object.entries(templateMap)) {
    map[templateId] = normalizeTemplate(template);
  }
  return map;
}

function buildTemplateMap(
  templates: Template[],
): Record<string, BuilderTemplate> {
  const map: Record<string, BuilderTemplate> = {};
  for (const template of templates) {
    map[template.id] = normalizeTemplate(template);
  }
  return map;
}

function findElementInSection(
  section: TemplateSection,
  elementId: string,
): TemplateElement | undefined {
  if (section.elements) {
    return section.elements.find((el) => el.id === elementId);
  }

  if (section.columns) {
    for (const col of section.columns) {
      const found = col.elements.find((el) => el.id === elementId);
      if (found) return found;
    }
  }

  return undefined;
}

function findElementInTemplate(
  template: BuilderTemplate,
  elementId: string,
): TemplateElement | undefined {
  for (const sectionId of template.sectionOrder) {
    const section = template.sectionById[sectionId];
    if (!section) continue;

    const found = findElementInSection(section, elementId);
    if (found) return found;
  }

  return undefined;
}

export function selectTemplateElement(
  state: Pick<BuilderState, "templateMap">,
  templateId: string,
  elementId: string | null,
): TemplateElement | undefined {
  if (!elementId) return undefined;

  const template = state.templateMap[templateId];
  if (!template) return undefined;

  return findElementInTemplate(template, elementId);
}

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

      updateTextData: (templateId, elementId, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;

          const sanitizedPatch: Record<string, unknown> = {};
          for (const [key, val] of Object.entries(patch)) {
            sanitizedPatch[key] =
              typeof val === "string" && (key === "text" || key === "label")
                ? sanitizeContent(val)
                : val;
          }

          const element = findElementInTemplate(template, elementId);
          if (!element) return;

          Object.assign(element.data, sanitizedPatch);
        }),

      updateImageData: (templateId, elementId, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;

          const element = findElementInTemplate(template, elementId);
          if (!element || element.type !== "image") return;

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
      version: STORE_VERSION,
      migrate: (persistedState) => {
        const state = persistedState as
          | PersistedBuilderState
          | LegacyPersistedBuilderState
          | undefined;

        return {
          templateMap: normalizeTemplateMap(state?.templateMap),
          selectedElementId: state?.selectedElementId ?? null,
        };
      },
      partialize: (state) => ({
        templateMap: state.templateMap,
        selectedElementId: state.selectedElementId,
      }),
    },
  ),
);
