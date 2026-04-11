import { Box, Card, Stack, Text } from '@flodesk/grain';

import { TemplatePreview } from '@/components/template-preview';
import type { Template } from '@/types/template';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

export const TemplateCard = ({ template, onClick }: TemplateCardProps) => (
  <Card
    borderSide="all"
    backgroundColor="background"
    cursor="pointer"
    height="100%"
    shadowHover="m"
    transition="fast"
    padding={0}
    overflow="hidden"
    radius="m"
    onClick={onClick}
  >
    <Box
      position="relative"
      overflow="hidden"
      borderSide="bottom"
      flex="1"
      height={40}
    >
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
