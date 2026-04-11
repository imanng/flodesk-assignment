import { Box, Card, Stack, Text } from '@flodesk/grain';
import type { Template } from '@/types/template';
import { TemplatePreview } from '@/components/template-preview';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card
      className="template-gallery__card"
      borderSide="all"
      cursor="pointer"
      shadowHover="m"
      transition="fast"
      padding={0}
      overflow="hidden"
      radius="m"
      onClick={onClick}
    >
      <Box className="template-gallery__card-preview" overflow="hidden" borderSide="bottom" flex="1" height={40}>
        <Box className="template-gallery__card-preview-inner">
          <TemplatePreview template={template} />
        </Box>
      </Box>
      <Box padding="l">
        <Stack gap="s">
          <Text size="l" weight="medium">
            {template.name}
          </Text>
          <Text size="m" color="content2">
            {template.description}
          </Text>
        </Stack>
      </Box>
    </Card>
  );
}
