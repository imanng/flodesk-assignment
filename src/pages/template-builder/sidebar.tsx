import { Arrange, Stack, Text } from '@flodesk/grain';

import { ElementSettings } from './element-settings';
import { useSidebarModel } from './hooks/use-sidebar-model';
import { PageSettings } from './page-settings';

type SidebarProps = {
  templateId: string;
};

export const Sidebar = ({
  templateId,
}: SidebarProps) => {
  const model = useSidebarModel(templateId);

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
        <Text weight="medium" size="l" hasEllipsis>{model.title}</Text>
      </Arrange>

      {model.activeElementId ? (
        <ElementSettings
          key={model.activeElementId}
          elementId={model.activeElementId}
          templateId={templateId}
        />
      ) : (
        <PageSettings templateId={templateId} />
      )}
    </Stack>
  );
};
