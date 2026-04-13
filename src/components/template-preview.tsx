import { Arrange, Box } from '@flodesk/grain';
import type { ReactNode } from 'react';
import { memo } from 'react';

import {
  selectIsElementSelected,
  selectPageSettings,
  selectTemplateSection,
  useBuilderStore,
} from '@/store/builder-store';
import type { PageSettings, Template, TemplateColumn, TemplateElement, TemplateSection } from '@/types/template';
import {
  getColumnsLayoutStyle,
  getColumnStyle,
  getPreviewPageStyle,
  getSectionStyle,
} from '@/utils/template-styles';

import { ElementRenderer } from './element-renderer';

type PreviewElementProps = {
  element: TemplateElement;
  templateId?: string;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
};

const PreviewElement = memo(({
  element,
  templateId,
  isInteractive,
  onSelectElement,
}: PreviewElementProps) => {
  const isSelected = useBuilderStore((state) =>
    templateId ? selectIsElementSelected(state, templateId, element.id) : false,
  );

  return (
    <ElementRenderer
      element={element}
      isSelected={isSelected}
      isInteractive={isInteractive}
      onClick={onSelectElement}
    />
  );
});

type PreviewColumnProps = {
  col: TemplateColumn;
  templateId?: string;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
};

const PreviewColumn = ({
  col,
  templateId,
  isInteractive,
  onSelectElement,
}: PreviewColumnProps) => (
  <Box style={getColumnStyle()}>
    {col.elements.map((el) => (
      <PreviewElement
        key={el.id}
        element={el}
        templateId={templateId}
        isInteractive={isInteractive}
        onSelectElement={onSelectElement}
      />
    ))}
  </Box>
);

type PreviewSectionProps = {
  isInteractive: boolean;
  templateId?: string;
  sectionId?: string;
  section?: TemplateSection;
  onSelectElement?: (id: string) => void;
};

export const TemplatePreviewSection = memo(({
  isInteractive,
  onSelectElement,
  templateId,
  sectionId,
  section,
}: PreviewSectionProps) => {
  const savedSection = useBuilderStore((state) =>
    templateId && sectionId
      ? selectTemplateSection(state, templateId, sectionId)
      : undefined,
  );
  const resolvedSection = savedSection ?? section;
  if (!resolvedSection) return null;

  const sectionStyle = getSectionStyle(resolvedSection);

  if (resolvedSection.layout === 'columns' && resolvedSection.columns) {
    return (
      <Box style={sectionStyle}>
        <Arrange style={getColumnsLayoutStyle(resolvedSection.columns.length, resolvedSection.gap)}>
          {resolvedSection.columns.map((col) => (
            <PreviewColumn
              key={col.id}
              col={col}
              templateId={templateId}
              isInteractive={isInteractive}
              onSelectElement={onSelectElement}
            />
          ))}
        </Arrange>
      </Box>
    );
  }

  return (
    <Box style={sectionStyle}>
      {resolvedSection.elements?.map((el) => (
        <PreviewElement
          key={el.id}
          element={el}
          templateId={templateId}
          isInteractive={isInteractive}
          onSelectElement={onSelectElement}
        />
      ))}
    </Box>
  );
});

type TemplatePreviewPageProps = {
  onClick?: () => void;
  templateId?: string;
  pageSettings?: PageSettings;
  children: ReactNode;
};

export const TemplatePreviewPage = ({
  templateId,
  pageSettings,
  onClick,
  children,
}: TemplatePreviewPageProps) => {
  const savedPageSettings = useBuilderStore((state) =>
    templateId ? selectPageSettings(state, templateId) : undefined,
  );
  const resolvedPageSettings = savedPageSettings ?? pageSettings;
  if (!resolvedPageSettings) return null;

  return (
    <Box style={getPreviewPageStyle(resolvedPageSettings)} onClick={onClick}>
      {children}
    </Box>
  );
};

type TemplatePreviewProps = {
  template: Template;
  isInteractive?: boolean;
  onSelectElement?: (id: string) => void;
  onDeselectAll?: () => void;
};

export const TemplatePreview = ({
  template,
  isInteractive = false,
  onSelectElement,
  onDeselectAll,
}: TemplatePreviewProps) => {
  const handleBackgroundClick = () => {
    if (isInteractive && onDeselectAll) {
      onDeselectAll();
    }
  };

  return (
    <TemplatePreviewPage
      pageSettings={template.pageSettings}
      onClick={handleBackgroundClick}
    >
      {template.sections.map((section) => (
        <TemplatePreviewSection
          key={section.id}
          section={section}
          isInteractive={isInteractive}
          onSelectElement={onSelectElement}
        />
      ))}
    </TemplatePreviewPage>
  );
};
