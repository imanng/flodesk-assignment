import { Stack, Text, Select } from '@flodesk/grain';
import type { PageSettings } from '@/types/template';
import { useBuilderStore } from '@/store/builder-store';
import { FONT_PRESET_OPTIONS } from '@/constants/font-presets';
import { usePageSetting } from '@/hooks/use-page-selector';
import type { PageSettingsFieldProps } from '@/types/form';

export const TypographyField = ({ templateId }: PageSettingsFieldProps) => {
  const fontPreset = usePageSetting(
    templateId,
    (pageSettings) => pageSettings?.fontPreset ?? 'modern-sans',
  );
  const updatePageSettings = useBuilderStore((s) => s.updatePageSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Typography</Text>
      <Select
        options={FONT_PRESET_OPTIONS.map((option) => ({
          value: option.value,
          content: option.label,
        }))}
        value={fontPreset}
        onChange={(option) =>
          updatePageSettings(templateId, {
            fontPreset: option.value as PageSettings['fontPreset'],
          })
        }
      />
    </Stack>
  );
};
