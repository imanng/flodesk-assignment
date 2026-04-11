import { Stack, Text } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { ColorPicker } from '@/components/color-picker';
import { usePageSetting } from '@/hooks/use-page-selector';
import type { PageSettingsFieldProps } from '@/types/form';

export const BackgroundColorField = ({ templateId }: PageSettingsFieldProps) => {
  const backgroundColor = usePageSetting(
    templateId,
    (pageSettings) => pageSettings?.backgroundColor ?? '#ffffff',
  );
  const updatePageSettings = useBuilderStore((s) => s.updatePageSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Background color</Text>
      <ColorPicker
        value={backgroundColor}
        onChange={(color) => updatePageSettings(templateId, { backgroundColor: color })}
      />
    </Stack>
  );
};
