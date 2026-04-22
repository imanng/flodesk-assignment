import { Stack } from '@flodesk/grain';

import { type ElementBuilderSettingsProps, SettingsSections } from '@/components/form';

import { useElementSettingsModel } from './hooks/field-models';
import { ELEMENT_SETTINGS_SECTIONS } from './schema';

export const ElementSettings = ({
  elementId,
  templateId,
}: ElementBuilderSettingsProps) => {
  const model = useElementSettingsModel(templateId, elementId);
  const { elementType } = model;

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
