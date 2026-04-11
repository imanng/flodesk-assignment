import { Stack, Text, Textarea } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const ButtonLabelField = ({ templateId, elementId }: ElementFieldProps) => {
  const label = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'button' ? element.data.label : '',
  );
  const updateTextData = useBuilderStore((s) => s.updateTextData);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Label</Text>
      <Textarea
        id={`label-${elementId}`}
        value={label}
        onChange={(e) => updateTextData(templateId, elementId, { label: e.target.value })}
        rows={3}
      />
    </Stack>
  );
};
