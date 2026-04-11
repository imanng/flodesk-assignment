import type { TemplateElement } from '@/types/template';
import { selectTemplateElement, useBuilderStore } from '@/store/builder-store';

export const useElementSelector = <T,>(
  templateId: string,
  elementId: string,
  selector: (element: TemplateElement | undefined) => T,
): T =>
  useBuilderStore((state) =>
    selector(selectTemplateElement(state, templateId, elementId)),
  );
