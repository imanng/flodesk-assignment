import { Arrange, Stack, Text } from '@flodesk/grain';

import { selectElementType, useBuilderStore } from '@/store/builder-store';
import type { TemplateElement } from '@/types/template';

import { ElementSettings } from './element-settings';
import { PageSettings } from './page-settings';

interface SidebarProps {
  templateId: string;
}

const getSettingsTitle = (elementType?: TemplateElement['type']): string => {
  if (!elementType) return 'Page Settings';
  return `${elementType.charAt(0).toUpperCase()}${elementType.slice(1)} Settings`;
};

export const Sidebar = ({ templateId }: SidebarProps) => {
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectedElementType = useBuilderStore((state) =>
    selectElementType(state, templateId, state.selectedElementId),
  );

  return (
    <Stack
      backgroundColor="background"
      borderSide="left"
      overflowY="auto"
      width="320px"
      minWidth="320px"
      height="100%"
    >
      <Arrange
        columns="1fr"
        alignItems="center"
        paddingX="l"
        borderSide="bottom"
        height={7}
      >
        <Text weight="medium" size="l" hasEllipsis>{getSettingsTitle(selectedElementType)}</Text>
      </Arrange>

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
