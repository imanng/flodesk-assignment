import { Button, IconDownload } from '@flodesk/grain';

import { selectMaterializedTemplate, useBuilderStore } from '@/store/builder-store';

type ExportButtonProps = {
  templateId: string;
};

export const ExportButton = ({ templateId }: ExportButtonProps) => (
  <Button
    variant="accent"
    icon={<IconDownload />}
    onClick={async () => {
      const template = selectMaterializedTemplate(useBuilderStore.getState(), templateId);
      if (!template) return;

      const { downloadHtml } = await import('@/utils/export-to-html');
      downloadHtml(template);
    }}
  >
    Export
  </Button>
);
