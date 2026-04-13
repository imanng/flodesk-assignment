import type { CSSProperties } from 'react';

import { FONT_STACKS } from '@/constants/font-presets';
import type {
  ElementSettings,
  PageSettings,
  TemplateSection,
} from '@/types/template';

const toKebabCase = (value: string): string =>
  value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const normalizeFontWeight = (
  fontWeight?: string,
): CSSProperties['fontWeight'] | undefined => {
  if (!fontWeight) return undefined;
  return fontWeight === 'medium' ? 500 : fontWeight;
};

export const serializeInlineStyle = (style: CSSProperties): string =>
  Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([property, value]) => `${toKebabCase(property)}: ${String(value)}`)
    .join('; ');

export const getPreviewPageStyle = (
  pageSettings: PageSettings,
): CSSProperties => ({
  backgroundColor: pageSettings.backgroundColor,
  fontFamily: FONT_STACKS[pageSettings.fontPreset],
  maxWidth: pageSettings.maxWidth,
  margin: '0 auto',
  minHeight: '100%',
});

export const getExportBodyStyle = (
  pageSettings: PageSettings,
): CSSProperties => ({
  fontFamily: FONT_STACKS[pageSettings.fontPreset],
  backgroundColor: pageSettings.backgroundColor,
});

export const getExportPageContentStyle = (
  pageSettings: PageSettings,
): CSSProperties => ({
  maxWidth: pageSettings.maxWidth,
  margin: '0 auto',
});

export const getSectionStyle = (section: TemplateSection): CSSProperties => {
  const style: CSSProperties = {
    padding: section.settings.padding,
    backgroundColor: section.settings.backgroundColor || 'transparent',
    borderRadius: section.settings.borderRadius,
  };

  if (section.layout === 'stack') {
    style.display = 'flex';
    style.flexDirection = 'column';
    style.gap = section.gap;
  }

  return style;
};

export const getColumnsLayoutStyle = (
  columnCount: number,
  gap: string,
): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
  gap,
});

export const getColumnStyle = (): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
});

export const getElementStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  fontSize: settings.fontSize,
  color: settings.color,
  textAlign: settings.textAlign,
  padding: settings.padding,
  backgroundColor: settings.backgroundColor,
  borderRadius: settings.borderRadius,
  fontWeight: normalizeFontWeight(settings.fontWeight),
  letterSpacing: settings.letterSpacing,
  lineHeight: settings.lineHeight,
});

export const getTextElementStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  ...getElementStyle(settings),
  whiteSpace: 'pre-line',
});

export const getButtonWrapperStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  textAlign: settings.textAlign,
  padding: settings.padding,
});

export const getButtonContentStyle = (
  settings: ElementSettings,
  cursor: CSSProperties['cursor'],
): CSSProperties => ({
  display: 'inline-block',
  fontSize: settings.fontSize,
  color: settings.color,
  backgroundColor: settings.backgroundColor,
  padding: settings.padding,
  borderRadius: settings.borderRadius || '0',
  fontWeight: normalizeFontWeight(settings.fontWeight) ?? 'normal',
  cursor,
  textDecoration: 'none',
  border: 'none',
});

export const getImageWrapperStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  padding: settings.padding,
});

export const getImageStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: settings.borderRadius || '0',
  objectFit: 'cover',
});

export const getDividerWrapperStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  padding: settings.padding,
});

export const getDividerStyle = (
  settings: ElementSettings,
): CSSProperties => ({
  border: 'none',
  borderTop: `1px solid ${settings.color}`,
  margin: 0,
});
