import { Stack, Text, Slider } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { parsePx } from '@/utils/parse-px';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const BorderRadiusField = ({ templateId, elementId }: ElementFieldProps) => {
  const borderRadius = useElementSelector(templateId, elementId, (element) =>
    element?.settings.borderRadius ?? '0px',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Border radius</Text>
      <Slider
        id={`radius-${elementId}`}
        min={0}
        max={32}
        value={parsePx(borderRadius, 0)}
        onChange={(e) =>
          updateElementSettings(templateId, elementId, {
            borderRadius: `${e.target.valueAsNumber}px`,
          })
        }
      />
      <Text size="s" color="content3">{borderRadius}</Text>
    </Stack>
  );
};
