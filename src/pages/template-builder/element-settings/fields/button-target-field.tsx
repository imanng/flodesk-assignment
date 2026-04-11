import { Stack, Text, Select } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { TARGET_OPTIONS } from '@/constants/element-settings';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const ButtonTargetField = ({ templateId, elementId }: ElementFieldProps) => {
  const target = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'button' ? (element.data.target ?? '_self') : '_self',
  );
  const updateTextData = useBuilderStore((s) => s.updateTextData);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Open in</Text>
      <Select
        options={TARGET_OPTIONS}
        value={target}
        onChange={(option) => updateTextData(templateId, elementId, { target: option.value })}
      />
    </Stack>
  );
};
