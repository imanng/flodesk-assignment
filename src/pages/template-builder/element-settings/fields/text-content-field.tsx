import { Stack, Text, Textarea } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import type { TextContentFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const TextContentField = ({
  templateId,
  elementId,
  rows,
}: TextContentFieldProps) => {
  const text = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'text' || element?.type === 'heading'
      ? element.data.text
      : '',
  );
  const updateTextData = useBuilderStore((s) => s.updateTextData);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Content</Text>
      <Textarea
        id={`content-${elementId}`}
        value={text}
        onChange={(e) => updateTextData(templateId, elementId, { text: e.target.value })}
        rows={rows}
      />
    </Stack>
  );
};
