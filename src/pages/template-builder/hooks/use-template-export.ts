import { useCallback } from "react";

import { selectMaterializedTemplate } from "@/store/builder-selector";
import { useBuilderStore } from "@/store/builder-store";

const exportTemplateById = async (templateId: string): Promise<void> => {
  const template = selectMaterializedTemplate(
    useBuilderStore.getState(),
    templateId,
  );
  if (!template) return;

  const { downloadHtml } = await import("@/utils/export-to-html");
  downloadHtml(template);
};

export const useTemplateExport = (templateId: string | null) =>
  useCallback(async () => {
    if (!templateId) return;
    await exportTemplateById(templateId);
  }, [templateId]);
