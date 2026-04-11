import { Stack, Text } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { ColorPicker } from '@/components/color-picker';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const BackgroundColorField = ({ templateId, elementId }: ElementFieldProps) => {
  const backgroundColor = useElementSelector(templateId, elementId, (element) =>
    element?.settings.backgroundColor ?? '#ffffff',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Background color</Text>
      <ColorPicker
        value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
        onChange={(nextColor) =>
          updateElementSettings(templateId, elementId, { backgroundColor: nextColor })
        }
      />
    </Stack>
  );
};
