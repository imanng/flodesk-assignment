import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSelectMaterializedTemplate,
  selectActiveElementId,
  selectActiveElementType,
  selectPageSettings,
  selectTemplateName,
  selectTemplateSectionOrder,
} from "@/store/builder-selector";
import { useBuilderStore } from "@/store/builder-store";
import type { TemplateElement } from "@/types/template";

import type { TemplateBuilderHeaderProps } from "../header";
import type { PreviewProps } from "../preview";
import type { SidebarProps } from "../sidebar";
import { useTemplateExport } from "./use-template-export";

const EMPTY_SECTION_IDS: PreviewProps["sectionIds"] = [];

const getSidebarTitle = (elementType?: TemplateElement["type"]): string => {
  if (!elementType) return "Page Settings";
  return `${elementType.charAt(0).toUpperCase()}${elementType.slice(1)} Settings`;
};

type TemplateBuilderModel = {
  header: TemplateBuilderHeaderProps;
  preview: PreviewProps;
  sidebar: SidebarProps;
};

export const useTemplateBuilder = (): TemplateBuilderModel | null => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const templateId = id ?? null;
  const clearSelection = useBuilderStore((state) => state.clearSelection);
  const resetTemplate = useBuilderStore((state) => state.resetTemplate);
  const selectElementInStore = useBuilderStore((state) => state.selectElement);
  const selectMaterializedTemplate = useMemo(
    () => (templateId ? createSelectMaterializedTemplate(templateId) : null),
    [templateId],
  );

  const activeElementId = useBuilderStore((state) =>
    templateId ? selectActiveElementId(state, templateId) : null,
  );
  const activeElementType = useBuilderStore((state) =>
    templateId ? selectActiveElementType(state, templateId) : undefined,
  );
  const pageSettings = useBuilderStore((state) =>
    templateId ? selectPageSettings(state, templateId) : undefined,
  );
  const sectionIds = useBuilderStore((state) =>
    templateId
      ? (selectTemplateSectionOrder(state, templateId) ?? EMPTY_SECTION_IDS)
      : EMPTY_SECTION_IDS,
  );
  const templateName = useBuilderStore((state) =>
    templateId ? selectTemplateName(state, templateId) : undefined,
  );
  const exportTemplate = useTemplateExport(selectMaterializedTemplate);

  useEffect(() => {
    if (!templateId) return;
    clearSelection(templateId);
  }, [clearSelection, templateId]);

  const goBack = useCallback(() => {
    if (!templateId) return;
    clearSelection(templateId);
    navigate("/");
  }, [clearSelection, navigate, templateId]);

  const deselectAll = useCallback(() => {
    if (!templateId) return;
    clearSelection(templateId);
  }, [clearSelection, templateId]);

  const selectElement = useCallback(
    (elementId: string) => {
      if (!templateId) return;
      selectElementInStore(templateId, elementId);
    },
    [selectElementInStore, templateId],
  );

  const handleResetTemplate = useCallback(() => {
    if (!templateId) return;
    resetTemplate(templateId);
  }, [resetTemplate, templateId]);

  if (!templateId || !pageSettings) {
    return null;
  }

  const sidebarMode: SidebarProps["mode"] = activeElementId
    ? "element"
    : "page";

  return {
    header: {
      templateName,
      onExportTemplate: exportTemplate,
      onGoBack: goBack,
      onResetTemplate: handleResetTemplate,
    },
    preview: {
      onDeselectAll: deselectAll,
      onSelectElement: selectElement,
      pageSettings,
      sectionIds,
      templateId,
    },
    sidebar: {
      elementId: activeElementId,
      mode: sidebarMode,
      templateId,
      title: getSidebarTitle(activeElementType),
    },
  };
};
