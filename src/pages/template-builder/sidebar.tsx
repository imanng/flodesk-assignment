import { Arrange, Stack, Text } from '@flodesk/grain';
import { memo } from 'react';

import { ElementSettings } from './element-settings';
import { PageSettings } from './page-settings';

export type SidebarProps = {
  elementId: string | null;
  mode: 'page' | 'element';
  templateId: string;
  title: string;
};

const SidebarComponent = ({
  elementId,
  mode,
  templateId,
  title,
}: SidebarProps) => {
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
        <Text weight="medium" size="l" hasEllipsis>{title}</Text>
      </Arrange>

      {/* Sidebar switches between page-level and selected-element settings. */}
      {mode === 'element' && elementId ? (
        <ElementSettings
          key={elementId}
          elementId={elementId}
          templateId={templateId}
        />
      ) : (
        <PageSettings templateId={templateId} />
      )}
    </Stack>
  );
};

export const Sidebar = memo(SidebarComponent);
