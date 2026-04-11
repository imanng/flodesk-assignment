import { Stack } from '@flodesk/grain';

import { type PageBuilderSettingsProps,SettingsSections } from '@/components/form';
import { usePageSelector } from '@/hooks/use-page-selector';

import { PAGE_SETTINGS_SECTIONS } from './schema';

export const PageSettings = ({ templateId }: PageBuilderSettingsProps) => {
  const hasPageSettings = usePageSelector(
    templateId,
    (pageSettings) => Boolean(pageSettings),
  );

  if (!hasPageSettings) return null;

  return (
    <Stack gap="l" paddingX="l" paddingY="m" width="100%">
      <SettingsSections sections={PAGE_SETTINGS_SECTIONS} props={{ templateId }} />
    </Stack>
  );
};
