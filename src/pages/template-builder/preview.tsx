import { Box } from '@flodesk/grain';
import { useCallback } from 'react';

import {
  TemplatePreviewPage,
  TemplatePreviewSection,
} from '@/components/template-preview';
import {
  selectTemplateSectionOrder,
  useBuilderStore,
} from '@/store/builder-store';

type PreviewProps = {
  templateId: string;
};

export const Preview = ({ templateId }: PreviewProps) => {
  const sectionOrder = useBuilderStore((state) =>
    selectTemplateSectionOrder(state, templateId),
  );
  const selectElement = useBuilderStore((s) => s.selectElement);

  const onDeselectAll = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  if (!sectionOrder) return null;

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
        <TemplatePreviewPage templateId={templateId}>
          {sectionOrder.map((sectionId) => (
            <TemplatePreviewSection
              key={sectionId}
              templateId={templateId}
              sectionId={sectionId}
              isInteractive
              onSelectElement={selectElement}
            />
          ))}
        </TemplatePreviewPage>
      </Box>
    </Box>
  );
};
