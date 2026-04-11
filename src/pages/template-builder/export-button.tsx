import { Button, IconDownload } from '@flodesk/grain';
import type { Template } from '@/types/template';
import { downloadHtml } from '@/utils/export-to-html';

interface ExportButtonProps {
  template: Template;
}

export function ExportButton({ template }: ExportButtonProps) {
  return (
    <Button
      variant="accent"
      icon={<IconDownload />}
      onClick={() => downloadHtml(template)}
    >
      Export
    </Button>
  );
}
