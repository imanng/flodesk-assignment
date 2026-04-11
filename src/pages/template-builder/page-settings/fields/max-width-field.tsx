import { Stack, Text, Slider } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { parsePx } from '@/utils/parse-px';
import { usePageSetting } from '@/hooks/use-page-selector';
import type { PageSettingsFieldProps } from '@/types/form';

export const MaxWidthField = ({ templateId }: PageSettingsFieldProps) => {
  const maxWidth = usePageSetting(
    templateId,
    (pageSettings) => pageSettings?.maxWidth ?? '800px',
  );
  const updatePageSettings = useBuilderStore((s) => s.updatePageSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Max width</Text>
      <Slider
        id="max-width-slider"
        min={600}
        max={1200}
        step={20}
        value={parsePx(maxWidth, 800)}
        onChange={(e) =>
          updatePageSettings(templateId, {
            maxWidth: `${e.target.valueAsNumber}px`,
          })
        }
      />
      <Text size="s" color="content3">{maxWidth}</Text>
    </Stack>
  );
};
