import { Button, IconDownload } from '@flodesk/grain';

import { selectMaterializedTemplate, useBuilderStore } from '@/store/builder-store';
import { downloadHtml } from '@/utils/export-to-html';

interface ExportButtonProps {
  templateId: string;
}

export const ExportButton = ({ templateId }: ExportButtonProps) => (
  <Button
    variant="accent"
    icon={<IconDownload />}
    onClick={() => {
      const template = selectMaterializedTemplate(useBuilderStore.getState(), templateId);
      if (template) downloadHtml(template);
    }}
  >
    Export
  </Button>
);
