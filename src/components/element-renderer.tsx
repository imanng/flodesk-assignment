import type { CSSProperties, JSX } from 'react';
import type { TemplateElement, ElementSettings } from '@/types/template';

interface ElementRendererProps {
  element: TemplateElement;
  isSelected?: boolean;
  isInteractive?: boolean;
  onClick?: (id: string) => void;
}

const settingsToStyle = (settings: ElementSettings): CSSProperties => {
  const style: CSSProperties = {
    fontSize: settings.fontSize,
    color: settings.color,
    textAlign: settings.textAlign,
    padding: settings.padding,
    backgroundColor: settings.backgroundColor,
  };

  if (settings.borderRadius) style.borderRadius = settings.borderRadius;
  if (settings.fontWeight) style.fontWeight = settings.fontWeight === 'medium' ? 500 : settings.fontWeight;
  if (settings.letterSpacing) style.letterSpacing = settings.letterSpacing;
  if (settings.lineHeight) style.lineHeight = settings.lineHeight;

  return style;
};

export const ElementRenderer = ({
  element,
  isSelected = false,
  isInteractive = false,
  onClick,
}: ElementRendererProps) => {
  const style = settingsToStyle(element.settings);
  const className = [
    'element-renderer',
    isInteractive ? 'element-renderer--interactive' : '',
    isSelected ? 'element-renderer--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent) => {
    if (!isInteractive || !onClick) return;
    e.stopPropagation();
    onClick(element.id);
  };

  switch (element.type) {
    case 'heading': {
      const Tag = `h${element.data.level}` as keyof JSX.IntrinsicElements;
      return (
        <Tag className={className} style={style} onClick={handleClick}>
          {element.data.text}
        </Tag>
      );
    }

    case 'text':
      return (
        <p
          className={className}
          style={{ ...style, whiteSpace: 'pre-line' }}
          onClick={handleClick}
        >
          {element.data.text}
        </p>
      );

    case 'button':
      return (
        <div
          className={className}
          style={{ textAlign: style.textAlign, padding: style.padding }}
          onClick={handleClick}
        >
          <button
            style={{
              display: 'inline-block',
              fontSize: style.fontSize,
              color: style.color,
              backgroundColor: style.backgroundColor,
              padding: style.padding,
              borderRadius: style.borderRadius,
              fontWeight: style.fontWeight,
              cursor: isInteractive ? 'pointer' : 'default',
              textDecoration: 'none',
              border: 'none',
            }}
          >
            {element.data.label}
          </button>
        </div>
      );

    case 'image':
      return (
        <div className={className} style={{ padding: style.padding }} onClick={handleClick}>
          <img
            src={element.data.src}
            alt={element.data.alt}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: style.borderRadius,
              objectFit: 'cover',
            }}
          />
        </div>
      );

    case 'divider':
      return (
        <div className={className} style={{ padding: style.padding }} onClick={handleClick}>
          <hr
            style={{
              border: 'none',
              borderTop: `1px solid ${style.color}`,
              margin: 0,
            }}
          />
        </div>
      );

    default:
      return null;
  }
};
