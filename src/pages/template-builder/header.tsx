import {
  Arrange,
  Flex,
  IconArrowLeft,
  Text,
  TextButton,
} from '@flodesk/grain';
import { memo } from "react";

import { ExportButton } from './export-button';
import { ResetTemplateButton } from './reset-template-button';

export type TemplateBuilderHeaderProps = {
  templateName?: string;
  onExportTemplate: () => void | Promise<void>;
  onGoBack: () => void;
  onResetTemplate: () => void;
};

const TemplateBuilderHeaderComponent = ({
  onExportTemplate,
  onGoBack,
  onResetTemplate,
  templateName,
}: TemplateBuilderHeaderProps) => {
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
          onClick={onGoBack}
        >
          Back
        </TextButton>
      </Flex>

      <Text weight="medium" size="l" hasEllipsis>{templateName}</Text>

      <Flex justifyContent="end" alignItems="center" gap="s" wrap="nowrap">
        <ResetTemplateButton onReset={onResetTemplate} />
        <ExportButton onExport={onExportTemplate} />
      </Flex>
    </Arrange>
  );
};

export const TemplateBuilderHeader = memo(TemplateBuilderHeaderComponent);
