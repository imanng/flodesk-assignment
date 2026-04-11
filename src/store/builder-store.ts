import { create } from 'zustand';
import type {
  Template,
  PageSettings,
  ElementSettings,
  TemplateElement,
  TemplateSection,
  TemplateColumn,
} from '@/types/template';
import { TEMPLATES } from '@/constants/templates';
import { sanitizeContent } from '@/utils/sanitize';

interface BuilderState {
  templateMap: Record<string, Template>;
  selectedElementId: string | null;

  selectElement: (elementId: string | null) => void;
  updatePageSettings: (templateId: string, patch: Partial<PageSettings>) => void;
  updateElementSettings: (templateId: string, elementId: string, patch: Partial<ElementSettings>) => void;
  updateTextLikeData: (templateId: string, elementId: string, patch: Record<string, unknown>) => void;
  updateImageData: (templateId: string, elementId: string, patch: Record<string, unknown>) => void;
  updateElementImage: (templateId: string, elementId: string, file: File) => void;
  resetTemplate: (templateId: string) => void;
}

function buildTemplateMap(templates: Template[]): Record<string, Template> {
  const map: Record<string, Template> = {};
  for (const t of templates) {
    map[t.id] = structuredClone(t);
  }
  return map;
}

function mapElement(
  sections: TemplateSection[],
  elementId: string,
  updater: (el: TemplateElement) => TemplateElement,
): TemplateSection[] {
  return sections.map((section) => {
    if (section.elements) {
      return {
        ...section,
        elements: section.elements.map((el) =>
          el.id === elementId ? updater(el) : el,
        ),
      };
    }
    if (section.columns) {
      return {
        ...section,
        columns: section.columns.map((col: TemplateColumn) => ({
          ...col,
          elements: col.elements.map((el) =>
            el.id === elementId ? updater(el) : el,
          ),
        })),
      };
    }
    return section;
  });
}

export const useBuilderStore = create<BuilderState>((set) => ({
  templateMap: buildTemplateMap(TEMPLATES),
  selectedElementId: null,

  selectElement: (elementId) => set({ selectedElementId: elementId }),

  updatePageSettings: (templateId, patch) =>
    set((state) => {
      const template = state.templateMap[templateId];
      if (!template) return state;
      return {
        templateMap: {
          ...state.templateMap,
          [templateId]: {
            ...template,
            pageSettings: { ...template.pageSettings, ...patch },
          },
        },
      };
    }),

  updateElementSettings: (templateId, elementId, patch) =>
    set((state) => {
      const template = state.templateMap[templateId];
      if (!template) return state;
      return {
        templateMap: {
          ...state.templateMap,
          [templateId]: {
            ...template,
            sections: mapElement(template.sections, elementId, (el) => ({
              ...el,
              settings: { ...el.settings, ...patch },
            } as TemplateElement)),
          },
        },
      };
    }),

  updateTextLikeData: (templateId, elementId, patch) =>
    set((state) => {
      const template = state.templateMap[templateId];
      if (!template) return state;

      const sanitizedPatch: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(patch)) {
        sanitizedPatch[key] =
          typeof val === 'string' && (key === 'text' || key === 'label')
            ? sanitizeContent(val)
            : val;
      }

      return {
        templateMap: {
          ...state.templateMap,
          [templateId]: {
            ...template,
            sections: mapElement(template.sections, elementId, (el) => ({
              ...el,
              data: { ...el.data, ...sanitizedPatch },
            } as TemplateElement)),
          },
        },
      };
    }),

  updateImageData: (templateId, elementId, patch) =>
    set((state) => {
      const template = state.templateMap[templateId];
      if (!template) return state;
      return {
        templateMap: {
          ...state.templateMap,
          [templateId]: {
            ...template,
            sections: mapElement(template.sections, elementId, (el) => ({
              ...el,
              data: { ...el.data, ...patch },
            } as TemplateElement)),
          },
        },
      };
    }),

  updateElementImage: (templateId, elementId, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      set((state) => {
        const template = state.templateMap[templateId];
        if (!template) return state;
        return {
          templateMap: {
            ...state.templateMap,
            [templateId]: {
              ...template,
              sections: mapElement(template.sections, elementId, (el) => ({
                ...el,
                data: { ...el.data, src, source: 'upload' },
              } as TemplateElement)),
            },
          },
        };
      });
    };
    reader.readAsDataURL(file);
  },

  resetTemplate: (templateId) =>
    set((state) => {
      const original = TEMPLATES.find((t) => t.id === templateId);
      if (!original) return state;
      return {
        templateMap: {
          ...state.templateMap,
          [templateId]: structuredClone(original),
        },
        selectedElementId: null,
      };
    }),
}));
