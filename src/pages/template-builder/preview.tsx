import { Box } from '@flodesk/grain';
import { useCallback } from 'react';

import { TemplatePreviewSection } from '@/components/template-preview';
import { FONT_STACKS } from '@/constants/font-presets';
import {
  selectPageSettings,
  selectTemplateSection,
  selectTemplateSectionOrder,
  useBuilderStore,
} from '@/store/builder-store';

type PreviewProps = {
  templateId: string;
};

type ConnectedPreviewSectionProps = {
  templateId: string;
  sectionId: string;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
};

const ConnectedPreviewSection = ({
  templateId,
  sectionId,
  isInteractive,
  onSelectElement,
}: ConnectedPreviewSectionProps) => {
  const section = useBuilderStore((state) =>
    selectTemplateSection(state, templateId, sectionId),
  );

  if (!section) return null;

  return (
    <TemplatePreviewSection
      section={section}
      templateId={templateId}
      isInteractive={isInteractive}
      onSelectElement={onSelectElement}
    />
  );
};

export const Preview = ({ templateId }: PreviewProps) => {
  const pageSettings = useBuilderStore((state) =>
    selectPageSettings(state, templateId),
  );
  const sectionOrder = useBuilderStore((state) =>
    selectTemplateSectionOrder(state, templateId),
  );
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
      backgroundColor="background2"
      overflow="auto"
      padding="l"
      flex="1"
      height="100%"
      onClick={onDeselectAll}
    >
      <Box
        shadow="m"
        radius="m"
        overflow="hidden"
        backgroundColor="background"
        maxWidth="100%"
        margin="0 auto"
        style={pageStyle}
      >
        {sectionOrder.map((sectionId) => (
          <ConnectedPreviewSection
            key={sectionId}
            templateId={templateId}
            sectionId={sectionId}
            isInteractive
            onSelectElement={selectElement}
          />
        ))}
      </Box>
    </Box>
  );
};
