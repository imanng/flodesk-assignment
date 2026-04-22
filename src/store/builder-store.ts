import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { TEMPLATES } from "@/constants/templates";
import {
  type BuilderTemplate,
  buildTemplateMap,
  normalizeTemplate,
  patchTemplateElementData,
  patchTemplateElementSettings,
  updateTemplateElement,
} from "@/store/builder-template";
import type {
  ElementSettings,
  PageSettings,
  TemplateElement,
} from "@/types/template";

const STORAGE_KEY = "builder-store";

export type BuilderSessionState = {
  selectedElementIds: Record<string, string | null>;
};

export type BuilderState = {
  templateMap: Record<string, BuilderTemplate>;
  session: BuilderSessionState;

  clearSelection: (templateId: string) => void;
  selectElement: (templateId: string, elementId: string | null) => void;
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
    elementType: TemplateElement["type"],
    patch: Partial<TemplateElement["data"]>,
  ) => void;
  updateElementImage: (
    templateId: string,
    elementId: string,
    file: File,
  ) => void;
  resetTemplate: (templateId: string) => void;
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    immer((set) => ({
      templateMap: buildTemplateMap(TEMPLATES),
      session: {
        selectedElementIds: {},
      },

      selectElement: (templateId, elementId) =>
        set((draft) => {
          draft.session.selectedElementIds[templateId] = elementId;
        }),

      clearSelection: (templateId) =>
        set((draft) => {
          draft.session.selectedElementIds[templateId] = null;
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
          patchTemplateElementSettings(template, elementId, patch);
        }),

      updateElementData: (templateId, elementId, elementType, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          patchTemplateElementData(template, elementId, elementType, patch);
        }),

      updateElementImage: (templateId, elementId, file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          set((draft) => {
            const template = draft.templateMap[templateId];
            updateTemplateElement(template, elementId, (element) => {
              if (element.type !== "image") return;
              Object.assign(element.data, { src, source: "upload" });
            });
          });
        };
        reader.readAsDataURL(file);
      },

      resetTemplate: (templateId) =>
        set((draft) => {
          const original = TEMPLATES.find((t) => t.id === templateId);
          if (!original) return;
          draft.templateMap[templateId] = normalizeTemplate(original);
          draft.session.selectedElementIds[templateId] = null;
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
