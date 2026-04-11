import { Button, IconDownload } from '@flodesk/grain';
import { materializeTemplate, useBuilderStore } from '@/store/builder-store';
import { downloadHtml } from '@/utils/export-to-html';

interface ExportButtonProps {
  templateId: string;
}

/** Reads template in `onClick` so edits do not re-render this button. */
export const ExportButton = ({ templateId }: ExportButtonProps) => (
  <Button
    variant="accent"
    icon={<IconDownload />}
    onClick={() => {
      const template = materializeTemplate(
        useBuilderStore.getState().templateMap[templateId],
      );
      if (template) downloadHtml(template);
    }}
  >
    Export
  </Button>
);
