import { Arrange, Stack, Text } from '@flodesk/grain';

import { selectElementType, useBuilderStore } from '@/store/builder-store';
import type { TemplateElement } from '@/types/template';

import { ElementSettings } from './element-settings';
import { PageSettings } from './page-settings';

type SidebarProps = {
  templateId: string;
};

const getSettingsTitle = (elementType?: TemplateElement['type']): string => {
  if (!elementType) return 'Page Settings';
  return `${elementType.charAt(0).toUpperCase()}${elementType.slice(1)} Settings`;
};

export const Sidebar = ({ templateId }: SidebarProps) => {
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectedElementType = useBuilderStore((state) =>
    selectElementType(state, templateId, state.selectedElementId),
  );
  const activeElementId = selectedElementType ? selectedElementId : null;

  return (
    <Stack
      backgroundColor="background"
      borderSide="left"
      overflowY="auto"
      width={{
        default: '320px',
        mobile: '100%',
      }}
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

      {activeElementId ? (
        <ElementSettings
          key={activeElementId}
          elementId={activeElementId}
          templateId={templateId}
        />
      ) : (
        <PageSettings templateId={templateId} />
      )}
    </Stack>
  );
};
