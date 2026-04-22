import { TEMPLATES } from '@/constants/templates';
import { selectMaterializedTemplate } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import type { Template, TemplateElement, TemplateSection } from '@/types/template';

const findElementInSection = (
  section: TemplateSection,
  elementId: string,
): TemplateElement | undefined => {
  const stackElement = section.elements?.find((element) => element.id === elementId);
  if (stackElement) return stackElement;

  for (const column of section.columns ?? []) {
    const columnElement = column.elements.find((element) => element.id === elementId);
    if (columnElement) return columnElement;
  }

  return undefined;
};

export const resetBuilderStore = () => {
  localStorage.clear();

  const { resetTemplate, selectElement } = useBuilderStore.getState();
  for (const template of TEMPLATES) {
    resetTemplate(template.id);
  }

  selectElement(null);
};

export const getTemplate = (templateId: string): Template => {
  const template = selectMaterializedTemplate(useBuilderStore.getState(), templateId);
  if (!template) {
    throw new Error(`Expected template "${templateId}" to exist`);
  }

  return template;
};

export const getElement = (
  templateId: string,
  elementId: string,
): TemplateElement => {
  const template = getTemplate(templateId);

  for (const section of template.sections) {
    const element = findElementInSection(section, elementId);
    if (element) return element;
  }

  throw new Error(
    `Expected element "${elementId}" to exist in template "${templateId}"`,
  );
};
