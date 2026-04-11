import { Stack, Text, Slider } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { parsePx } from '@/utils/parse-px';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const FontSizeField = ({ templateId, elementId }: ElementFieldProps) => {
  const fontSize = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' && element.type !== 'divider'
      ? element.settings.fontSize
      : '12px',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Font size</Text>
      <Slider
        id={`font-size-${elementId}`}
        min={12}
        max={72}
        value={parsePx(fontSize, 12)}
        onChange={(e) =>
          updateElementSettings(templateId, elementId, {
            fontSize: `${e.target.valueAsNumber}px`,
          })
        }
      />
      <Text size="s" color="content3">{fontSize}</Text>
    </Stack>
  );
};
