import { useMemo } from "react";

import {
  selectActiveElementId,
  selectActiveElementType,
} from "@/store/builder-selector";
import { useBuilderStore } from "@/store/builder-store";

const getSettingsTitle = (elementType?: string): string => {
  if (!elementType) return "Page Settings";
  return `${elementType.charAt(0).toUpperCase()}${elementType.slice(1)} Settings`;
};

export const useSidebarModel = (templateId: string) => {
  const activeElementId = useBuilderStore((state) =>
    selectActiveElementId(state, templateId),
  );
  const activeElementType = useBuilderStore((state) =>
    selectActiveElementType(state, templateId),
  );
  const title = useMemo(
    () => getSettingsTitle(activeElementType),
    [activeElementType],
  );

  return {
    activeElementId,
    title,
  };
};
