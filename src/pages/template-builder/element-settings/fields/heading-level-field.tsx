import { Stack, Text, Select } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { HEADING_LEVEL_OPTIONS } from '@/constants/element-settings';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const HeadingLevelField = ({ templateId, elementId }: ElementFieldProps) => {
  const level = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'heading' ? element.data.level : 1,
  );
  const updateTextData = useBuilderStore((s) => s.updateTextData);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Level</Text>
      <Select
        options={HEADING_LEVEL_OPTIONS}
        value={String(level)}
        onChange={(option) =>
          updateTextData(templateId, elementId, { level: Number(option.value) })
        }
      />
    </Stack>
  );
};
