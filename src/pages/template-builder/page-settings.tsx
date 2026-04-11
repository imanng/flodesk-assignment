import { Box, Stack, Text, Select, Slider } from '@flodesk/grain';
import type { Template } from '@/types/template';
import { useBuilderStore } from '@/store/builder-store';
import { FONT_PRESET_OPTIONS } from '@/constants/font-presets';
import { ColorPicker } from '@/components/color-picker';

interface PageSettingsProps {
  template: Template;
}

export function PageSettings({ template }: PageSettingsProps) {
  const updatePageSettings = useBuilderStore((s) => s.updatePageSettings);

  const fontPresetOption = FONT_PRESET_OPTIONS.find(
    (o) => o.value === template.pageSettings.fontPreset,
  );

  return (
    <Stack gap="l" paddingX="l" paddingY="m">
      <Stack gap="xs">
        <Text size="s" weight="medium" color="content2">Background color</Text>
        <ColorPicker
          value={template.pageSettings.backgroundColor}
          onChange={(color) =>
            updatePageSettings(template.id, { backgroundColor: color })
          }
        />
      </Stack>

      <Box borderSide="bottom" />

      <Stack gap="xs">
        <Text size="s" weight="medium" color="content2">Typography</Text>
        <Select
          options={FONT_PRESET_OPTIONS.map((o) => ({
            value: o.value,
            content: o.label,
          }))}
          value={fontPresetOption?.value ?? 'modern-sans'}
          onChange={(option) =>
            updatePageSettings(template.id, {
              fontPreset: option.value as Template['pageSettings']['fontPreset'],
            })
          }
        />
      </Stack>

      <Box borderSide="bottom" />

      <Stack gap="xs">
        <Text size="s" weight="medium" color="content2">Max width</Text>
        <Slider
          id="max-width-slider"
          min={600}
          max={1200}
          step={20}
          value={parseInt(template.pageSettings.maxWidth, 10)}
          onChange={(e) =>
            updatePageSettings(template.id, {
              maxWidth: `${e.target.valueAsNumber}px`,
            })
          }
        />
        <Text size="s" color="content3">{template.pageSettings.maxWidth}</Text>
      </Stack>
    </Stack>
  );
}
