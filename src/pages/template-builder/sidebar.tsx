import { Box, Stack, Text } from '@flodesk/grain';
import type { Template, TemplateElement } from '@/types/template';
import { PageSettings } from './page-settings';
import { ElementSettings } from './element-settings';

interface SidebarProps {
  template: Template;
  selectedElementId: string | null;
}

function findElement(
  template: Template,
  elementId: string,
): TemplateElement | undefined {
  for (const section of template.sections) {
    if (section.elements) {
      const found = section.elements.find((el) => el.id === elementId);
      if (found) return found;
    }
    if (section.columns) {
      for (const col of section.columns) {
        const found = col.elements.find((el) => el.id === elementId);
        if (found) return found;
      }
    }
  }
  return undefined;
}

function getSettingsTitle(element?: TemplateElement): string {
  if (!element) return 'Page Settings';
  return `${element.type.charAt(0).toUpperCase()}${element.type.slice(1)} Settings`;
}

export function Sidebar({ template, selectedElementId }: SidebarProps) {
  const selectedElement = selectedElementId
    ? findElement(template, selectedElementId)
    : undefined;

  return (
    <Stack className="sidebar" backgroundColor="background" borderSide="left" overflowY="auto">
      <Box paddingX="l" paddingY="m" borderSide="bottom">
        <Text size="m" weight="medium">
          {getSettingsTitle(selectedElement)}
        </Text>
      </Box>

      {selectedElement ? (
        <ElementSettings element={selectedElement} templateId={template.id} />
      ) : (
        <PageSettings template={template} />
      )}
    </Stack>
  );
}
