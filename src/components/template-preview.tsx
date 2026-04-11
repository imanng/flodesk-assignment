import { Arrange, Box, Flex } from '@flodesk/grain';
import type { CSSProperties } from 'react';

import { FONT_STACKS } from '@/constants/font-presets';
import type { Template, TemplateColumn,TemplateSection } from '@/types/template';

import { ElementRenderer } from './element-renderer';

type PreviewColumnProps = {
  col: TemplateColumn;
  selectedElementId?: string | null;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
};

const PreviewColumn = ({
  col,
  selectedElementId,
  isInteractive,
  onSelectElement,
}: PreviewColumnProps) => (
  <Flex direction="column">
    {col.elements.map((el) => (
      <ElementRenderer
        key={el.id}
        element={el}
        isSelected={selectedElementId === el.id}
        isInteractive={isInteractive}
        onClick={onSelectElement}
      />
    ))}
  </Flex>
);

type PreviewSectionProps = {
  section: TemplateSection;
  selectedElementId?: string | null;
  isInteractive: boolean;
  onSelectElement?: (id: string) => void;
};

export const TemplatePreviewSection = ({
  section,
  selectedElementId,
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
              selectedElementId={selectedElementId}
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
        <ElementRenderer
          key={el.id}
          element={el}
          isSelected={selectedElementId === el.id}
          isInteractive={isInteractive}
          onClick={onSelectElement}
        />
      ))}
    </Box>
  );
};

type TemplatePreviewProps = {
  template: Template;
  selectedElementId?: string | null;
  isInteractive?: boolean;
  onSelectElement?: (id: string) => void;
  onDeselectAll?: () => void;
};

export const TemplatePreview = ({
  template,
  selectedElementId,
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
          selectedElementId={selectedElementId}
          isInteractive={isInteractive}
          onSelectElement={onSelectElement}
        />
      ))}
    </Box>
  );
};
