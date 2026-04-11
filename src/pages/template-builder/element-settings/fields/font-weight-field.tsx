import { Stack, Text, Box, TextToggleGroup, TextToggle } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { FONT_WEIGHT_OPTIONS } from '@/constants/element-settings';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const FontWeightField = ({ templateId, elementId }: ElementFieldProps) => {
  const fontWeight = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' && element.type !== 'divider'
      ? (element.settings.fontWeight ?? 'normal')
      : 'normal',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs" width="100%">
      <Text size="s" weight="medium" color="content2">Font weight</Text>
      <Box className="element-settings__text-toggles" width="100%">
        <TextToggleGroup hasFullWidth>
          {FONT_WEIGHT_OPTIONS.map((option) => (
            <TextToggle
              key={option.value}
              isActive={fontWeight === option.value}
              onClick={() =>
                updateElementSettings(templateId, elementId, { fontWeight: option.value })
              }
            >
              {option.content}
            </TextToggle>
          ))}
        </TextToggleGroup>
      </Box>
    </Stack>
  );
};
