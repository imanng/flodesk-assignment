import { type JSX, memo } from 'react';

import type { TemplateElement } from '@/types/template';
import {
  getButtonContentStyle,
  getButtonWrapperStyle,
  getDividerStyle,
  getDividerWrapperStyle,
  getElementStyle,
  getImageStyle,
  getImageWrapperStyle,
  getTextElementStyle,
} from '@/utils/template-styles';

type ElementRendererProps = {
  element: TemplateElement;
  isSelected?: boolean;
  isInteractive?: boolean;
  onClick?: (id: string) => void;
};

export const ElementRenderer = memo(({
  element,
  isSelected = false,
  isInteractive = false,
  onClick,
}: ElementRendererProps) => {
  const style = getElementStyle(element.settings);
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
          style={getTextElementStyle(element.settings)}
          onClick={handleClick}
        >
          {element.data.text}
        </p>
      );

    case 'button':
      return (
        <div
          className={className}
          style={getButtonWrapperStyle(element.settings)}
          onClick={handleClick}
        >
          <button
            style={getButtonContentStyle(
              element.settings,
              isInteractive ? 'pointer' : 'default',
            )}
          >
            {element.data.label}
          </button>
        </div>
      );

    case 'image':
      return (
        <div
          className={className}
          style={getImageWrapperStyle(element.settings)}
          onClick={handleClick}
        >
          <img
            src={element.data.src}
            alt={element.data.alt}
            style={getImageStyle(element.settings)}
          />
        </div>
      );

    case 'divider':
      return (
        <div
          className={className}
          style={getDividerWrapperStyle(element.settings)}
          onClick={handleClick}
        >
          <hr style={getDividerStyle(element.settings)} />
        </div>
      );

    default:
      return null;
  }
});
