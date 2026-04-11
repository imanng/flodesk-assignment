import { Box } from '@flodesk/grain';
import type { Template } from '@/types/template';
import { TemplatePreview } from '@/components/template-preview';

interface PreviewProps {
  template: Template;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeselectAll: () => void;
}

export function Preview({
  template,
  selectedElementId,
  onSelectElement,
  onDeselectAll,
}: PreviewProps) {
  return (
    <Box
      className="template-builder__preview"
      backgroundColor="background2"
      overflow="auto"
      padding="xl"
      onClick={onDeselectAll}
    >
      <Box
        shadow="m"
        radius="m"
        overflow="hidden"
        className="template-builder__preview-canvas"
      >
        <TemplatePreview
          template={template}
          selectedElementId={selectedElementId}
          isInteractive
          onSelectElement={onSelectElement}
          onDeselectAll={onDeselectAll}
        />
      </Box>
    </Box>
  );
}
