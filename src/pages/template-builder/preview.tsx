import { useCallback } from 'react';
import { Box } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { TemplatePreviewSection } from '@/components/template-preview';
import { FONT_STACKS } from '@/constants/font-presets';

interface PreviewProps {
  templateId: string;
}

interface ConnectedPreviewSectionProps {
  templateId: string;
  sectionId: string;
  selectedElementId: string | null;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
}

const ConnectedPreviewSection = ({
  templateId,
  sectionId,
  selectedElementId,
  isInteractive,
  onSelectElement,
}: ConnectedPreviewSectionProps) => {
  const section = useBuilderStore(
    (s) => s.templateMap[templateId]?.sectionById[sectionId],
  );

  if (!section) return null;

  return (
    <TemplatePreviewSection
      section={section}
      selectedElementId={selectedElementId}
      isInteractive={isInteractive}
      onSelectElement={onSelectElement}
    />
  );
};

export const Preview = ({ templateId }: PreviewProps) => {
  const pageSettings = useBuilderStore((s) => s.templateMap[templateId]?.pageSettings);
  const sectionOrder = useBuilderStore((s) => s.templateMap[templateId]?.sectionOrder);
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectElement = useBuilderStore((s) => s.selectElement);

  const onDeselectAll = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  if (!pageSettings || !sectionOrder) return null;

  const pageStyle = {
    backgroundColor: pageSettings.backgroundColor,
    fontFamily: FONT_STACKS[pageSettings.fontPreset],
    maxWidth: pageSettings.maxWidth,
    margin: '0 auto',
    minHeight: '100%',
  } as const;

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
        backgroundColor="background"
        style={pageStyle}
      >
        {sectionOrder.map((sectionId) => (
          <ConnectedPreviewSection
            key={sectionId}
            templateId={templateId}
            sectionId={sectionId}
            selectedElementId={selectedElementId}
            isInteractive
            onSelectElement={selectElement}
          />
        ))}
      </Box>
    </Box>
  );
};
