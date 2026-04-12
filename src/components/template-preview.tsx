import { Arrange, Box, Flex } from '@flodesk/grain';
import type { CSSProperties } from 'react';
import { memo } from 'react';

import { FONT_STACKS } from '@/constants/font-presets';
import { selectIsElementSelected, useBuilderStore } from '@/store/builder-store';
import type {
  Template,
  TemplateColumn,
  TemplateElement,
  TemplateSection,
} from '@/types/template';

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
  <Flex direction="column">
    {col.elements.map((el) => (
      <PreviewElement
        key={el.id}
        element={el}
        templateId={templateId}
        isInteractive={isInteractive}
        onSelectElement={onSelectElement}
      />
    ))}
  </Flex>
);

type PreviewSectionProps = {
  section: TemplateSection;
  templateId?: string;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
};

export const TemplatePreviewSection = ({
  section,
  templateId,
  isInteractive,
  onSelectElement,
}: PreviewSectionProps) => {
  const sectionStyle: CSSProperties = {
    padding: section.settings.padding,
    backgroundColor: section.settings.backgroundColor || 'transparent',
    borderRadius: section.settings.borderRadius,
  };

  if (section.layout === 'columns' && section.columns) {
    return (
      <Flex direction="column" style={sectionStyle}>
        <Arrange
          columns={`repeat(${section.columns.length}, minmax(0, 1fr))`}
          gap={section.gap}
        >
          {section.columns.map((col) => (
            <PreviewColumn
              key={col.id}
              col={col}
              templateId={templateId}
              isInteractive={isInteractive}
              onSelectElement={onSelectElement}
            />
          ))}
        </Arrange>
      </Flex>
    );
  }

  return (
    <Box style={sectionStyle}>
      {section.elements?.map((el) => (
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
  const pageStyle: CSSProperties = {
    backgroundColor: template.pageSettings.backgroundColor,
    fontFamily: FONT_STACKS[template.pageSettings.fontPreset],
    maxWidth: template.pageSettings.maxWidth,
    margin: '0 auto',
    minHeight: '100%',
  };

  const handleBackgroundClick = () => {
    if (isInteractive && onDeselectAll) {
      onDeselectAll();
    }
  };

  return (
    <Box
      style={pageStyle}
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
    </Box>
  );
};
