import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  selectActiveElementId,
  selectActiveElementType,
  selectTemplateName,
} from "@/store/builder-selector";
import { useBuilderStore } from "@/store/builder-store";

import { useTemplateBuilderActions } from "./use-template-builder-actions";

type TemplateBuilderState = {
  activeElementId: string | null;
  activeElementType?: ReturnType<typeof selectActiveElementType>;
  templateId: string | null;
  templateName?: string;
};

type TemplateBuilderActions = {
  deselectAll: () => void;
  exportTemplate: () => Promise<void>;
  goBack: () => void;
  resetTemplate: () => void;
  selectElement: (elementId: string) => void;
};

type TemplateBuilderModel = {
  actions: TemplateBuilderActions;
  state: TemplateBuilderState;
};

export const useTemplateBuilder = (): TemplateBuilderModel => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const templateId = id ?? null;
  const {
    deselectAll,
    exportTemplate,
    resetTemplate,
    selectElement,
  } = useTemplateBuilderActions(templateId);

  const activeElementId = useBuilderStore((state) =>
    templateId ? selectActiveElementId(state, templateId) : null,
  );
  const activeElementType = useBuilderStore((state) =>
    templateId ? selectActiveElementType(state, templateId) : undefined,
  );
  const templateName = useBuilderStore((state) =>
    templateId ? selectTemplateName(state, templateId) : undefined,
  );

  useEffect(() => {
    deselectAll();
  }, [templateId, deselectAll]);

  const goBack = useCallback(() => {
    deselectAll();
    navigate("/");
  }, [deselectAll, navigate]);

  return {
    state: {
      templateId,
      templateName,
      activeElementId,
      activeElementType,
    },
    actions: {
      selectElement,
      deselectAll,
      resetTemplate,
      exportTemplate,
      goBack,
    },
  };
};
