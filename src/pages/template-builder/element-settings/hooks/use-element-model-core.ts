import { selectTemplateElement } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import type { TemplateElement } from '@/types/template';

export const useElementValue = <T,>(
  templateId: string,
  elementId: string,
  selector: (element: TemplateElement | undefined) => T,
): T =>
  useBuilderStore((state) =>
    selector(selectTemplateElement(state, templateId, elementId)),
  );

export const useElementSettingsModel = (
  templateId: string,
  elementId: string,
) => ({
  elementType: useElementValue(
    templateId,
    elementId,
    (element) => element?.type,
  ),
});
