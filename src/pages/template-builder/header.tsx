import { useNavigate } from 'react-router-dom';
import { Flex, Arrange, Text, TextButton, IconArrowLeft } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { ExportButton } from './export-button';

export interface TemplateBuilderHeaderProps {
  templateId: string;
}

export const TemplateBuilderHeader = ({ templateId }: TemplateBuilderHeaderProps) => {
  const navigate = useNavigate();
  const selectElement = useBuilderStore((s) => s.selectElement);
  const templateName = useBuilderStore((s) => s.templateMap[templateId]?.name);

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

      <Flex justifyContent="end">
        <ExportButton templateId={templateId} />
      </Flex>
    </Arrange>
  );
};
