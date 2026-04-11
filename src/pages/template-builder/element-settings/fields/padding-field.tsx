import { Stack, Text, Slider } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { parsePx } from '@/utils/parse-px';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const PaddingField = ({ templateId, elementId }: ElementFieldProps) => {
  const padding = useElementSelector(templateId, elementId, (element) =>
    element?.settings.padding ?? '0px',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Padding</Text>
      <Slider
        id={`padding-${elementId}`}
        min={0}
        max={64}
        value={parsePx(padding, 0)}
        onChange={(e) =>
          updateElementSettings(templateId, elementId, {
            padding: `${e.target.valueAsNumber}px`,
          })
        }
      />
      <Text size="s" color="content3">{padding}</Text>
    </Stack>
  );
};
