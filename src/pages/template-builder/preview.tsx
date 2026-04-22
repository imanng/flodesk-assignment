import { Box } from '@flodesk/grain';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';

import { ElementRenderer } from '@/components/element-renderer';
import {
  TemplatePreviewPage,
  TemplatePreviewSection,
} from '@/components/template-preview';
import type { TemplateElement } from '@/types/template';

import {
  usePreviewElementModel,
  usePreviewPageModel,
  usePreviewSectionModel,
} from './hooks/use-preview-model';

type ConnectedPreviewPageProps = {
  children: ReactNode;
  onClick: () => void;
  pageSettings: NonNullable<ReturnType<typeof usePreviewPageModel>["pageSettings"]>;
};

const ConnectedPreviewPage = memo(({
  children,
  onClick,
  pageSettings,
}: ConnectedPreviewPageProps) => {
  return (
    <TemplatePreviewPage pageSettings={pageSettings} onClick={onClick}>
      {children}
    </TemplatePreviewPage>
  );
});

type ConnectedPreviewElementProps = {
  element: TemplateElement;
  onSelectElement: (elementId: string) => void;
  templateId: string;
};

const ConnectedPreviewElement = memo(({
  element,
  onSelectElement,
  templateId,
}: ConnectedPreviewElementProps) => {
  const model = usePreviewElementModel(templateId, element.id);

  return (
    <ElementRenderer
      element={element}
      isInteractive
      isSelected={model.isSelected}
      onClick={onSelectElement}
    />
  );
});

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
  const model = usePreviewSectionModel(templateId, sectionId);
  const renderElement = useCallback(
    (element: TemplateElement) => (
      <ConnectedPreviewElement
        element={element}
        onSelectElement={onSelectElement}
        templateId={templateId}
      />
    ),
    [onSelectElement, templateId],
  );

  if (!model.hasSection || !model.section) return null;

  return (
    <TemplatePreviewSection
      isInteractive
      onSelectElement={onSelectElement}
      renderElement={renderElement}
      section={model.section}
    />
  );
});

type PreviewProps = {
  onDeselectAll: () => void;
  onSelectElement: (elementId: string) => void;
  templateId: string;
};

const PreviewComponent = ({
  onDeselectAll,
  onSelectElement,
  templateId,
}: PreviewProps) => {
  const pageModel = usePreviewPageModel(templateId);

  if (!pageModel.hasRenderableSections || !pageModel.pageSettings) return null;

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
        <ConnectedPreviewPage
          onClick={onDeselectAll}
          pageSettings={pageModel.pageSettings}
        >
          {pageModel.sectionOrder.map((sectionId) => (
            <ConnectedPreviewSection
              key={sectionId}
              onSelectElement={onSelectElement}
              sectionId={sectionId}
              templateId={templateId}
            />
          ))}
        </ConnectedPreviewPage>
      </Box>
    </Box>
  );
};

export const Preview = memo(PreviewComponent);
