import { Button, IconDownload } from '@flodesk/grain';

type ExportButtonProps = {
  onExport: () => void | Promise<void>;
};

export const ExportButton = ({ onExport }: ExportButtonProps) => (
  <Button
    variant="accent"
    icon={<IconDownload />}
    onClick={onExport}
  >
    Export
  </Button>
);
