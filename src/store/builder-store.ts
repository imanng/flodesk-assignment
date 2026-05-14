import { current, isDraft } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { TEMPLATES } from "@/constants/templates";
import {
  type BuilderTemplate,
  buildTemplateMap,
  getTemplateElement,
  isSectionOrderPermutation,
  normalizeTemplate,
} from "@/store/builder-template";
import type {
  ElementSettings,
  PageSettings,
  TemplateElement,
} from "@/types/template";

const STORAGE_KEY = "builder-store";
const HISTORY_LIMIT = 50;
const HISTORY_GROUP_WINDOW_MS = 800;

export type BuilderHistoryEntry = {
  selectedElementId: string | null;
  template: BuilderTemplate;
};

export type BuilderHistoryState = {
  future: BuilderHistoryEntry[];
  lastGroup?: {
    key: string;
    updatedAt: number;
  };
  past: BuilderHistoryEntry[];
};

export type BuilderSessionState = {
  historyByTemplateId: Record<string, BuilderHistoryState>;
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
  reorderSections: (
    templateId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  undoTemplate: (templateId: string) => void;
  redoTemplate: (templateId: string) => void;
  clearHistory: (templateId?: string) => void;
  /** Replace section order when rolling back a failed persist or hydrating from API. */
  setSectionOrder: (templateId: string, order: string[]) => void;
};

const cloneTemplate = (template: BuilderTemplate): BuilderTemplate =>
  structuredClone(isDraft(template) ? current(template) : template);

const hasPatchChanges = <T extends Record<string, unknown>>(
  target: T,
  patch: Partial<T>,
): boolean =>
  Object.entries(patch).some(
    ([key, value]) => target[key as keyof T] !== value,
  );

const getHistory = (
  session: BuilderSessionState,
  templateId: string,
): BuilderHistoryState => {
  return (session.historyByTemplateId[templateId] ??= {
    future: [],
    past: [],
  });
};

const toGroupKey = (
  kind: string,
  templateId: string,
  subjectId: string,
  patch: Record<string, unknown>,
): string => {
  const keys = Object.keys(patch).sort().join(",");
  return `${kind}:${templateId}:${subjectId}:${keys}`;
};

const pushPastEntry = (
  history: BuilderHistoryState,
  entry: BuilderHistoryEntry,
) => {
  history.past.push(entry);

  if (history.past.length > HISTORY_LIMIT) {
    history.past.splice(0, history.past.length - HISTORY_LIMIT);
  }
};

const recordTemplateChange = (
  draft: BuilderState,
  templateId: string,
  groupKey?: string,
) => {
  const template = draft.templateMap[templateId];
  if (!template) return;

  const history = getHistory(draft.session, templateId);
  const now = Date.now();

  if (
    groupKey &&
    history.lastGroup?.key === groupKey &&
    now - history.lastGroup.updatedAt <= HISTORY_GROUP_WINDOW_MS
  ) {
    history.lastGroup.updatedAt = now;
    history.future = [];
    return;
  }

  pushPastEntry(history, {
    selectedElementId: draft.session.selectedElementIds[templateId] ?? null,
    template: cloneTemplate(template),
  });
  history.future = [];
  history.lastGroup = groupKey
    ? {
        key: groupKey,
        updatedAt: now,
      }
    : undefined;
};

const templatesEqual = (
  left: BuilderTemplate,
  right: BuilderTemplate,
): boolean =>
  JSON.stringify(isDraft(left) ? current(left) : left) === JSON.stringify(right);

export const useBuilderStore = create<BuilderState>()(
  persist(
    immer((set) => ({
      templateMap: buildTemplateMap(TEMPLATES),
      session: {
        historyByTemplateId: {},
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
          if (!hasPatchChanges(template.pageSettings, patch)) return;
          recordTemplateChange(
            draft,
            templateId,
            toGroupKey("page-settings", templateId, "page", patch),
          );
          Object.assign(template.pageSettings, patch);
        }),

      updateElementSettings: (templateId, elementId, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          const element = getTemplateElement(template, elementId);
          if (!element) return;
          if (!hasPatchChanges(element.settings, patch)) return;
          recordTemplateChange(
            draft,
            templateId,
            toGroupKey("element-settings", templateId, elementId, patch),
          );
          Object.assign(element.settings, patch);
        }),

      updateElementData: (templateId, elementId, elementType, patch) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          const element = getTemplateElement(template, elementId);
          if (!element || element.type !== elementType) return;
          if (!hasPatchChanges(element.data, patch)) return;
          recordTemplateChange(
            draft,
            templateId,
            toGroupKey("element-data", templateId, elementId, patch),
          );
          Object.assign(element.data, patch);
        }),

      updateElementImage: (templateId, elementId, file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          set((draft) => {
            const template = draft.templateMap[templateId];
            const element = getTemplateElement(template, elementId);
            if (!element || element.type !== "image") return;
            if (element.data.src === src && element.data.source === "upload") return;
            recordTemplateChange(draft, templateId);
            Object.assign(element.data, { src, source: "upload" });
          });
        };
        reader.readAsDataURL(file);
      },

      resetTemplate: (templateId) =>
        set((draft) => {
          const original = TEMPLATES.find((t) => t.id === templateId);
          if (!original) return;
          const template = draft.templateMap[templateId];
          if (!template) return;
          const nextTemplate = normalizeTemplate(original);
          if (templatesEqual(template, nextTemplate)) return;
          recordTemplateChange(draft, templateId);
          draft.templateMap[templateId] = nextTemplate;
          draft.session.selectedElementIds[templateId] = null;
        }),

      reorderSections: (templateId, fromIndex, toIndex) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;
          const { sectionOrder } = template;
          if (fromIndex === toIndex) return;
          if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= sectionOrder.length ||
            toIndex >= sectionOrder.length
          ) {
            return;
          }
          recordTemplateChange(draft, templateId);
          const moved = sectionOrder.splice(fromIndex, 1)[0];
          if (moved === undefined) return;
          sectionOrder.splice(toIndex, 0, moved);
        }),

      undoTemplate: (templateId) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;
          const history = getHistory(draft.session, templateId);
          const previous = history.past.pop();
          if (!previous) return;

          history.future.push({
            selectedElementId: draft.session.selectedElementIds[templateId] ?? null,
            template: cloneTemplate(template),
          });
          draft.templateMap[templateId] = cloneTemplate(previous.template);
          draft.session.selectedElementIds[templateId] = previous.selectedElementId;
          history.lastGroup = undefined;
        }),

      redoTemplate: (templateId) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;
          const history = getHistory(draft.session, templateId);
          const next = history.future.pop();
          if (!next) return;

          pushPastEntry(history, {
            selectedElementId: draft.session.selectedElementIds[templateId] ?? null,
            template: cloneTemplate(template),
          });
          draft.templateMap[templateId] = cloneTemplate(next.template);
          draft.session.selectedElementIds[templateId] = next.selectedElementId;
          history.lastGroup = undefined;
        }),

      clearHistory: (templateId) =>
        set((draft) => {
          if (templateId) {
            delete draft.session.historyByTemplateId[templateId];
            return;
          }

          draft.session.historyByTemplateId = {};
        }),

      setSectionOrder: (templateId, order) =>
        set((draft) => {
          const template = draft.templateMap[templateId];
          if (!template) return;
          if (!isSectionOrderPermutation(order, template.sectionOrder)) return;
          template.sectionOrder = [...order];
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
