import { useNavigate } from 'react-router-dom';
import { Flex, Text, TextButton } from '@flodesk/grain';

export interface NotFoundProps {
  title?: string;
  description?: string;
}

export const NotFound = ({
  title = 'Page not found',
  description = "The page you're looking for doesn't exist or was removed.",
}: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      className="not-found"
      width="100%"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor="background2"
      wrap="nowrap"
    >
      <Flex alignItems="center" justifyContent="center" padding="xxl" gap="m" direction="column" margin="0 auto" maxWidth={50}>
        <Text size="l" weight="bold" color="contentDanger" align="center">
          404
        </Text>
        <Text size="xxl" weight="medium" align="center">
          {title}
        </Text>
        <Text size="m" color="content2" align="center">
          {description}
        </Text>
        <TextButton type="button" onClick={() => navigate('/')}>
          Back to templates
        </TextButton>
      </Flex>
    </Flex>
  );
};
