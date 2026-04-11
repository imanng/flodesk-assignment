import { Box, Stack, Text } from '@flodesk/grain';
import type { TemplateElement } from '@/types/template';
import { selectTemplateElement, useBuilderStore } from '@/store/builder-store';
import { PageSettings } from './page-settings';
import { ElementSettings } from './element-settings';

interface SidebarProps {
  templateId: string;
}

const getSettingsTitle = (elementType?: TemplateElement['type']): string => {
  if (!elementType) return 'Page Settings';
  return `${elementType.charAt(0).toUpperCase()}${elementType.slice(1)} Settings`;
};

export const Sidebar = ({ templateId }: SidebarProps) => {
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectedElementType = useBuilderStore((s) =>
    selectTemplateElement(s, templateId, s.selectedElementId)?.type,
  );

  return (
    <Stack className="sidebar" backgroundColor="background" borderSide="left" overflowY="auto">
      <Box paddingX="l" paddingY="m" borderSide="bottom">
        <Text size="m" weight="medium">
          {getSettingsTitle(selectedElementType)}
        </Text>
      </Box>

      {selectedElementId ? (
        <ElementSettings
          key={selectedElementId}
          elementId={selectedElementId}
          templateId={templateId}
        />
      ) : (
        <PageSettings templateId={templateId} />
      )}
    </Stack>
  );
};
