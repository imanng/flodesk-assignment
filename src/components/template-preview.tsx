import { Arrange, Box } from '@flodesk/grain';
import type { ReactNode } from 'react';
import { Fragment, memo } from 'react';

import type {
  PageSettings,
  Template,
  TemplateColumn,
  TemplateElement,
  TemplateSection,
} from '@/types/template';
import {
  getColumnsLayoutStyle,
  getColumnStyle,
  getPreviewPageStyle,
  getSectionStyle,
} from '@/utils/template-styles';

import { ElementRenderer } from './element-renderer';

type TemplatePreviewElementProps = {
  element: TemplateElement;
  isInteractive: boolean;
  isSelected?: boolean;
  onSelectElement?: (elementId: string) => void;
};

const TemplatePreviewElement = memo(({
  element,
  isInteractive,
  isSelected = false,
  onSelectElement,
}: TemplatePreviewElementProps) => (
  <ElementRenderer
    element={element}
    isSelected={isSelected}
    isInteractive={isInteractive}
    onClick={onSelectElement}
  />
));

type RenderPreviewElement = (element: TemplateElement) => ReactNode;

type PreviewColumnProps = {
  column: TemplateColumn;
  renderElement: RenderPreviewElement;
};

const PreviewColumn = ({ column, renderElement }: PreviewColumnProps) => (
  <Box style={getColumnStyle()}>
    {column.elements.map((element) => (
      <Fragment key={element.id}>
        {renderElement(element)}
      </Fragment>
    ))}
  </Box>
);

type TemplatePreviewSectionProps = {
  isInteractive: boolean;
  onSelectElement?: (elementId: string) => void;
  renderElement?: RenderPreviewElement;
  section: TemplateSection;
  selectedElementId?: string | null;
};

export const TemplatePreviewSection = memo(({
  isInteractive,
  onSelectElement,
  renderElement,
  section,
  selectedElementId,
}: TemplatePreviewSectionProps) => {
  const renderResolvedElement = renderElement ?? ((element: TemplateElement) => (
    <TemplatePreviewElement
      element={element}
      isInteractive={isInteractive}
      isSelected={selectedElementId === element.id}
      onSelectElement={onSelectElement}
    />
  ));
  const sectionStyle = getSectionStyle(section);

  if (section.layout === 'columns' && section.columns) {
    return (
      <Box style={sectionStyle}>
        <Arrange style={getColumnsLayoutStyle(section.columns.length, section.gap)}>
          {section.columns.map((column) => (
            <PreviewColumn
              key={column.id}
              column={column}
              renderElement={renderResolvedElement}
            />
          ))}
        </Arrange>
      </Box>
    );
  }

  return (
    <Box style={sectionStyle}>
      {section.elements?.map((element) => (
        <Fragment key={element.id}>
          {renderResolvedElement(element)}
        </Fragment>
      ))}
    </Box>
  );
});

type TemplatePreviewPageProps = {
  children: ReactNode;
  onClick?: () => void;
  pageSettings: PageSettings;
};

export const TemplatePreviewPage = ({
  children,
  onClick,
  pageSettings,
}: TemplatePreviewPageProps) => (
  <Box style={getPreviewPageStyle(pageSettings)} onClick={onClick}>
    {children}
  </Box>
);

type TemplatePreviewProps = {
  isInteractive?: boolean;
  onDeselectAll?: () => void;
  onSelectElement?: (elementId: string) => void;
  selectedElementId?: string | null;
  template: Template;
};

export const TemplatePreview = ({
  isInteractive = false,
  onDeselectAll,
  onSelectElement,
  selectedElementId,
  template,
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
          isInteractive={isInteractive}
          onSelectElement={onSelectElement}
          section={section}
          selectedElementId={selectedElementId}
        />
      ))}
    </TemplatePreviewPage>
  );
};
