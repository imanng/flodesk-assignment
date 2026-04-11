import type { CSSProperties } from 'react';
import type { Template, TemplateSection, TemplateColumn } from '@/types/template';
import { FONT_STACKS } from '@/constants/font-presets';
import { ElementRenderer } from './element-renderer';

interface TemplatePreviewProps {
  template: Template;
  selectedElementId?: string | null;
  isInteractive?: boolean;
  onSelectElement?: (id: string) => void;
  onDeselectAll?: () => void;
}

function renderColumn(
  col: TemplateColumn,
  selectedElementId: string | null | undefined,
  isInteractive: boolean,
  onSelectElement?: (id: string) => void,
) {
  return (
    <div key={col.id} style={{ display: 'flex', flexDirection: 'column' }}>
      {col.elements.map((el) => (
        <ElementRenderer
          key={el.id}
          element={el}
          isSelected={selectedElementId === el.id}
          isInteractive={isInteractive}
          onClick={onSelectElement}
        />
      ))}
    </div>
  );
}

function renderSection(
  section: TemplateSection,
  selectedElementId: string | null | undefined,
  isInteractive: boolean,
  onSelectElement?: (id: string) => void,
) {
  const sectionStyle: CSSProperties = {
    padding: section.settings.padding,
    backgroundColor: section.settings.backgroundColor || 'transparent',
    borderRadius: section.settings.borderRadius,
  };

  if (section.layout === 'columns' && section.columns) {
    return (
      <div key={section.id} style={sectionStyle}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${section.columns.length}, minmax(0, 1fr))`,
            gap: section.gap,
          }}
        >
          {section.columns.map((col) =>
            renderColumn(col, selectedElementId, isInteractive, onSelectElement),
          )}
        </div>
      </div>
    );
  }

  return (
    <div key={section.id} style={sectionStyle}>
      {section.elements?.map((el) => (
        <ElementRenderer
          key={el.id}
          element={el}
          isSelected={selectedElementId === el.id}
          isInteractive={isInteractive}
          onClick={onSelectElement}
        />
      ))}
    </div>
  );
}

export function TemplatePreview({
  template,
  selectedElementId,
  isInteractive = false,
  onSelectElement,
  onDeselectAll,
}: TemplatePreviewProps) {
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
    <div
      className="template-preview"
      style={pageStyle}
      onClick={handleBackgroundClick}
    >
      {template.sections.map((section) =>
        renderSection(section, selectedElementId, isInteractive, onSelectElement),
      )}
    </div>
  );
}
