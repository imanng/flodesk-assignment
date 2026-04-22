import { useMemo } from "react";

import {
  selectIsElementSelected,
  selectPageSettings,
  selectTemplateSection,
  selectTemplateSectionOrder,
} from "@/store/builder-selector";
import { useBuilderStore } from "@/store/builder-store";
import type { TemplateSection } from "@/types/template";

type PreviewPageModel = {
  hasPageSettings: boolean;
  hasRenderableSections: boolean;
  pageSettings: ReturnType<typeof selectPageSettings>;
  sectionOrder: string[];
};

type PreviewSectionModel = {
  hasSection: boolean;
  section: TemplateSection | undefined;
};

type PreviewElementModel = {
  isSelected: boolean;
};

export const usePreviewPageModel = (templateId: string): PreviewPageModel => {
  const pageSettings = useBuilderStore((state) =>
    selectPageSettings(state, templateId),
  );
  const sectionOrder = useBuilderStore(
    (state) => selectTemplateSectionOrder(state, templateId) ?? [],
  );

  return useMemo(
    () => ({
      pageSettings,
      sectionOrder,
      hasPageSettings: Boolean(pageSettings),
      hasRenderableSections: sectionOrder.length > 0,
    }),
    [pageSettings, sectionOrder],
  );
};

export const usePreviewSectionModel = (
  templateId: string,
  sectionId: string,
): PreviewSectionModel => {
  const section = useBuilderStore((state) =>
    selectTemplateSection(state, templateId, sectionId),
  );

  return useMemo(
    () => ({
      section,
      hasSection: Boolean(section),
    }),
    [section],
  );
};

export const usePreviewElementModel = (
  templateId: string,
  elementId: string,
): PreviewElementModel => {
  const isSelected = useBuilderStore((state) =>
    selectIsElementSelected(state, templateId, elementId),
  );

  return { isSelected };
};
