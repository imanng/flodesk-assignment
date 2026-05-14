import {
  Arrange,
  Button,
  Flex,
  IconArrowLeft,
  IconRedo,
  IconUndo,
  Text,
  TextButton,
} from '@flodesk/grain';
import { memo } from "react";

import { ExportButton } from './export-button';
import { ResetTemplateButton } from './reset-template-button';

export type TemplateBuilderHeaderProps = {
  templateName?: string;
  canRedo: boolean;
  canUndo: boolean;
  onExportTemplate: () => void | Promise<void>;
  onGoBack: () => void;
  onRedoTemplate: () => void;
  onResetTemplate: () => void;
  onUndoTemplate: () => void;
};

const TemplateBuilderHeaderComponent = ({
  canRedo,
  canUndo,
  onExportTemplate,
  onGoBack,
  onRedoTemplate,
  onResetTemplate,
  onUndoTemplate,
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
        <Button
          type="button"
          variant="neutral"
          aria-label="Undo"
          aria-keyshortcuts="Control+Z Meta+Z"
          title="Undo (Ctrl/Cmd+Z)"
          icon={<IconUndo />}
          disabled={!canUndo}
          onClick={onUndoTemplate}
        />
        <Button
          type="button"
          variant="neutral"
          aria-label="Redo"
          aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y Meta+Y"
          title="Redo (Ctrl/Cmd+Shift+Z)"
          icon={<IconRedo />}
          disabled={!canRedo}
          onClick={onRedoTemplate}
        />
        <ResetTemplateButton onReset={onResetTemplate} />
        <ExportButton onExport={onExportTemplate} />
      </Flex>
    </Arrange>
  );
};

export const TemplateBuilderHeader = memo(TemplateBuilderHeaderComponent);
