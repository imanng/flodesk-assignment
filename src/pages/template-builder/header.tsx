import {
  Arrange,
  Button,
  Flex,
  IconArrowLeft,
  IconReset,
  Text,
  TextButton,
} from '@flodesk/grain';
import { useNavigate } from 'react-router-dom';

import { selectTemplateName, useBuilderStore } from '@/store/builder-store';

import { ExportButton } from './export-button';

export interface TemplateBuilderHeaderProps {
  templateId: string;
}

export const TemplateBuilderHeader = ({ templateId }: TemplateBuilderHeaderProps) => {
  const navigate = useNavigate();
  const selectElement = useBuilderStore((s) => s.selectElement);
  const resetTemplate = useBuilderStore((s) => s.resetTemplate);
  const templateName = useBuilderStore((state) => selectTemplateName(state, templateId));

  return (
    <Arrange
      columns="1fr auto 1fr"
      alignItems="center"
      paddingX="l"
      borderSide="bottom"
      backgroundColor="background"
      width="100%"
      height={7}
    >
      <Flex justifyContent="start">
        <TextButton
          icon={<IconArrowLeft />}
          onClick={() => {
            selectElement(null);
            navigate('/');
          }}
        >
          Back
        </TextButton>
      </Flex>

      <Text weight="medium" size="l" hasEllipsis>{templateName}</Text>

      <Flex justifyContent="end" alignItems="center" gap="s">
        <Button
          type="button"
          variant="neutral"
          icon={<IconReset />}
          onClick={() => resetTemplate(templateId)}
        >
          Load defaults
        </Button>
        <ExportButton templateId={templateId} />
      </Flex>
    </Arrange>
  );
};
