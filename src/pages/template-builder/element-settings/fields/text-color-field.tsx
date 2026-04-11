import { Stack, Text } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { ColorPicker } from '@/components/color-picker';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const TextColorField = ({ templateId, elementId }: ElementFieldProps) => {
  const color = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' ? element.settings.color : '#000000',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Text color</Text>
      <ColorPicker
        value={color}
        onChange={(nextColor) =>
          updateElementSettings(templateId, elementId, { color: nextColor })
        }
      />
    </Stack>
  );
};
