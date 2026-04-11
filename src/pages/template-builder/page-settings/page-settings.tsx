import { Stack } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import {
  BackgroundColorField,
  FieldSeparator,
  MaxWidthField,
  TypographyField,
} from './fields';

interface PageSettingsProps {
  templateId: string;
}

export const PageSettings = ({ templateId }: PageSettingsProps) => {
  const hasPageSettings = useBuilderStore((state) =>
    Boolean(state.templateMap[templateId]?.pageSettings),
  );

  if (!hasPageSettings) return null;

  return (
    <Stack gap="l" paddingX="l" paddingY="m">
      <BackgroundColorField templateId={templateId} />
      <FieldSeparator />
      <TypographyField templateId={templateId} />
      <FieldSeparator />
      <MaxWidthField templateId={templateId} />
    </Stack>
  );
};
