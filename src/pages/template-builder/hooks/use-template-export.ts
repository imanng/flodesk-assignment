import { useCallback } from "react";

import { type BuilderState, useBuilderStore } from "@/store/builder-store";
import type { Template } from "@/types/template";

const exportTemplate = async (template: Template): Promise<void> => {
  const { downloadHtml } = await import("@/utils/export-to-html");
  downloadHtml(template);
};

export const useTemplateExport = (
  selectTemplate:
    | ((state: Pick<BuilderState, "templateMap">) => Template | undefined)
    | null,
) => {
  return useCallback(async () => {
    if (!selectTemplate) return;

    const template = selectTemplate(useBuilderStore.getState());
    if (!template) return;

    await exportTemplate(template);
  }, [selectTemplate]);
};
