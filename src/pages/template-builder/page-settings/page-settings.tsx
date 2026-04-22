import { Stack } from '@flodesk/grain';
import { memo } from 'react';

import { type PageBuilderSettingsProps, SettingsSections } from '@/components/form';

import { useHasPageSettings } from './hooks/field-models';
import { PAGE_SETTINGS_SECTIONS } from './schema';

const PageSettingsComponent = ({ templateId }: PageBuilderSettingsProps) => {
  const hasPageSettings = useHasPageSettings(templateId);

  if (!hasPageSettings) return null;

  return (
    <Stack gap="l" paddingX="l" paddingY="m" width="100%">
      <SettingsSections sections={PAGE_SETTINGS_SECTIONS} props={{ templateId }} />
    </Stack>
  );
};

export const PageSettings = memo(PageSettingsComponent);
