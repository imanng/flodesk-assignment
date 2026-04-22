import {
  Arrange,
  Button,
  Flex,
  IconArrowLeft,
  IconReset,
  Modal,
  Text,
  TextButton,
} from '@flodesk/grain';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectTemplateName, useBuilderStore } from '@/store/builder-store';

import { ExportButton } from './export-button';

export type TemplateBuilderHeaderProps = {
  templateId: string;
};

export const TemplateBuilderHeader = ({ templateId }: TemplateBuilderHeaderProps) => {
  const navigate = useNavigate();
  const selectElement = useBuilderStore((s) => s.selectElement);
  const resetTemplate = useBuilderStore((s) => s.resetTemplate);
  const templateName = useBuilderStore((state) => selectTemplateName(state, templateId));

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const confirmReset = () => {
    resetTemplate(templateId);
    setIsResetConfirmOpen(false);
  };

  return (
    <>
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

        <Flex justifyContent="end" alignItems="center" gap="s" wrap="nowrap">
          <Button
            type="button"
            variant="neutral"
            icon={<IconReset />}
            onClick={() => setIsResetConfirmOpen(true)}
          >
            Reset to defaults
          </Button>
          <ExportButton templateId={templateId} />
        </Flex>
      </Arrange>

      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        hasCloseButton={false}
        title="Reset to defaults?"
        description="This will replace your current edits with the original template defaults. You can't undo this action."
        cardMaxWidth="narrow"
        cardPadding="var(--grn-card-padding)"
        cardRadius="var(--grn-card-radius)"
      >
        <Arrange gap="s" justifyContent="end" marginTop="l">
          <Button
            type="button"
            variant="neutral"
            onClick={() => setIsResetConfirmOpen(false)}
            autoFocus
          >
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={confirmReset}>
            Reset
          </Button>
        </Arrange>
      </Modal>
    </>
  );
};
