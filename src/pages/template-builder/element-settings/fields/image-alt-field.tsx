import { Stack, Text, TextInput } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const ImageAltField = ({ templateId, elementId }: ElementFieldProps) => {
  const alt = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'image' ? element.data.alt : '',
  );
  const updateImageData = useBuilderStore((s) => s.updateImageData);

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Alt text</Text>
      <TextInput
        id={`alt-${elementId}`}
        value={alt}
        onChange={(e) => updateImageData(templateId, elementId, { alt: e.target.value })}
      />
    </Stack>
  );
};
