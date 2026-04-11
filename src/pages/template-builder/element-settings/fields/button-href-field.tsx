import { Stack, Text, TextInput } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const ButtonHrefField = ({ templateId, elementId }: ElementFieldProps) => {
  const href = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'button' ? (element.data.href ?? '') : '',
  );
  const updateTextData = useBuilderStore((s) => s.updateTextData);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Link URL</Text>
      <TextInput
        id={`href-${elementId}`}
        value={href}
        onChange={(e) => updateTextData(templateId, elementId, { href: e.target.value })}
      />
    </Stack>
  );
};
