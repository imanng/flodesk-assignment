import { useCallback } from "react";

import { useBuilderStore } from "@/store/builder-store";

import { useTemplateExport } from "./use-template-export";

type UseTemplateBuilderActionsResult = {
  deselectAll: () => void;
  exportTemplate: () => Promise<void>;
  resetTemplate: () => void;
  selectElement: (elementId: string) => void;
};

export const useTemplateBuilderActions = (
  templateId: string | null,
): UseTemplateBuilderActionsResult => {
  const selectElementInStore = useBuilderStore((state) => state.selectElement);
  const resetTemplateInStore = useBuilderStore((state) => state.resetTemplate);
  const exportTemplate = useTemplateExport(templateId);

  const selectElement = useCallback(
    (elementId: string) => {
      selectElementInStore(elementId);
    },
    [selectElementInStore],
  );

  const deselectAll = useCallback(() => {
    selectElementInStore(null);
  }, [selectElementInStore]);

  const resetTemplate = useCallback(() => {
    if (!templateId) return;
    resetTemplateInStore(templateId);
  }, [templateId, resetTemplateInStore]);

  return {
    selectElement,
    deselectAll,
    resetTemplate,
    exportTemplate,
  };
};
