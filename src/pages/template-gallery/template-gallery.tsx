import { useNavigate } from 'react-router-dom';
import { Box, Flex, Arrange, Stack, Text } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { TemplateCard } from './template-card';

export function TemplateGallery() {
  const navigate = useNavigate();
  const templateMap = useBuilderStore((s) => s.templateMap);
  const templates = Object.values(templateMap);

  return (
    <Flex direction="column" className="template-gallery" width="100%">
      <Arrange
        className="template-gallery__header"
        paddingX="l"
        borderSide="bottom"
        backgroundColor="background"
        alignItems="center"
        columns="1fr auto"
        width="100%"
        height={7}
      >
        <img src="/logo.svg" alt="Flodesk" className="template-gallery__logo" />
      </Arrange>

      <Box
        className="template-gallery__content"
        backgroundColor="background2"
        padding="xxl"
        flex="1"
      >
        <Box className="template-gallery__container" maxWidth="1100px" margin="0 auto">
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
}
