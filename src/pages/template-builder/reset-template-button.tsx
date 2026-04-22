import { Arrange, Button, IconReset, Modal } from '@flodesk/grain';
import { useState } from 'react';

type ResetTemplateButtonProps = {
  onReset: () => void;
};

export const ResetTemplateButton = ({ onReset }: ResetTemplateButtonProps) => {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const openConfirm = () => {
    setIsResetConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsResetConfirmOpen(false);
  };

  const confirmReset = () => {
    onReset();
    closeConfirm();
  };

  return (
    <>
      <Button
        type="button"
        variant="neutral"
        icon={<IconReset />}
        onClick={openConfirm}
      >
        Reset to defaults
      </Button>

      <Modal
        isOpen={isResetConfirmOpen}
        onClose={closeConfirm}
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
            onClick={closeConfirm}
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
