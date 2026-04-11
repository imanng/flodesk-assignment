import { Arrange, Box, Flex, Stack, Text } from '@flodesk/grain';
import { useNavigate } from 'react-router-dom';

import { materializeTemplate, useBuilderStore } from '@/store/builder-store';

import { TemplateCard } from './template-card';

export const TemplateGallery = () => {
  const navigate = useNavigate();
  const templateMap = useBuilderStore((s) => s.templateMap);
  const templates = Object.values(templateMap).flatMap((template) => {
    const materialized = materializeTemplate(template);
    return materialized ? [materialized] : [];
  });

  return (
    <Flex direction="column" width="100%" minHeight="100vh">
      <Arrange
        paddingX="l"
        borderSide="bottom"
        backgroundColor="background"
        alignItems="center"
        columns="1fr auto"
        width="100%"
        height={7}
        minHeight={7}
      >
        <img src="/logo.svg" alt="Flodesk" style={{ height: 32, width: 'auto' }} />
      </Arrange>

      <Box
        backgroundColor="background2"
        padding="xxl"
        flex="1"
        width="100%"
      >
        <Box
          maxWidth="1100px"
          margin="0 auto"
          width="100%"
        >
          <Stack gap="xs" marginBottom="xl">
            <Text size="xxl" weight="medium" align="center">
              Choose a template
            </Text>
            <Text size="m" color="content2" align="center">
              Pick a starting point for your page
            </Text>
          </Stack>

          <Arrange columns="repeat(auto-fill, minmax(300px, 1fr))" gap="l" alignItems="stretch">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => navigate(`/${template.id}`)}
              />
            ))}
          </Arrange>
        </Box>
      </Box>
    </Flex>
  );
};
