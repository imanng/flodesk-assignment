import { Box } from '@flodesk/grain';
import { memo } from 'react';

import {
  TemplatePreviewPage,
  TemplatePreviewSection,
} from '@/components/template-preview';
import {
  selectActiveElementId,
  selectActiveSectionId,
  selectTemplateSection,
} from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import type { PageSettings } from '@/types/template';

export type PreviewProps = {
  onDeselectAll: () => void;
  onSelectElement: (elementId: string) => void;
  pageSettings: PageSettings;
  sectionIds: string[];
  templateId: string;
};

type ConnectedPreviewSectionProps = {
  onSelectElement: (elementId: string) => void;
  sectionId: string;
  templateId: string;
};

const ConnectedPreviewSection = memo(({
  onSelectElement,
  sectionId,
  templateId,
}: ConnectedPreviewSectionProps) => {
  const section = useBuilderStore((state) =>
    selectTemplateSection(state, templateId, sectionId),
  );
  // Only highlight selection when the selected element belongs to this section.
  const selectedElementId = useBuilderStore((state) =>
    selectActiveSectionId(state, templateId) === sectionId
      ? selectActiveElementId(state, templateId)
      : null,
  );

  if (!section) return null;

  return (
    <TemplatePreviewSection
      isInteractive
      onSelectElement={onSelectElement}
      section={section}
      selectedElementId={selectedElementId}
    />
  );
});

const PreviewComponent = ({
  onDeselectAll,
  onSelectElement,
  pageSettings,
  sectionIds,
  templateId,
}: PreviewProps) => {
  if (sectionIds.length === 0) return null;

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
      >
        <TemplatePreviewPage pageSettings={pageSettings}>
          {sectionIds.map((sectionId) => (
            <ConnectedPreviewSection
              key={sectionId}
              onSelectElement={onSelectElement}
              sectionId={sectionId}
              templateId={templateId}
            />
          ))}
        </TemplatePreviewPage>
      </Box>
    </Box>
  );
};

export const Preview = memo(PreviewComponent);
