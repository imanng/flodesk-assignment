import { Stack } from '@flodesk/grain';

import { type ElementBuilderSettingsProps,SettingsSections } from '@/components/form';
import { useElementSelector } from '@/hooks/use-element-selector';

import { ELEMENT_SETTINGS_SECTIONS } from './schema';

export const ElementSettings = ({
  elementId,
  templateId,
}: ElementBuilderSettingsProps) => {
  const elementType = useElementSelector(
    templateId,
    elementId,
    (element) => element?.type,
  );

  if (!elementType) return null;

  return (
    <Stack gap="l" paddingX="l" paddingY="m" width="100%">
      <SettingsSections
        sections={ELEMENT_SETTINGS_SECTIONS[elementType]}
        props={{ templateId, elementId }}
      />
    </Stack>
  );
};
