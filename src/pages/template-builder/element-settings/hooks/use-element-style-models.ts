import { useCallback } from 'react';

import { useBuilderActions } from '@/hooks/use-builder-actions';

import { useElementValue } from './use-element-model-core';

export const useFontSizeFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) =>
      element?.type && element.type !== 'image' && element.type !== 'divider'
        ? element.settings.fontSize
        : '12px',
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: number) => {
      updateElementSettings(templateId, elementId, {
        fontSize: `${nextValue}px`,
      });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};

export const useTextColorFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) =>
      element?.type && element.type !== 'image'
        ? element.settings.color
        : '#000000',
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementSettings(templateId, elementId, { color: nextValue });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};

export const useBackgroundColorFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) => element?.settings.backgroundColor ?? 'transparent',
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementSettings(templateId, elementId, {
        backgroundColor: nextValue,
      });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};

export const useDividerColorFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) => (element?.type === 'divider' ? element.settings.color : '#000000'),
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementSettings(templateId, elementId, { color: nextValue });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};

export const useAlignmentFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) =>
      element?.type && element.type !== 'image' && element.type !== 'divider'
        ? element.settings.textAlign
        : 'left',
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: 'left' | 'center' | 'right') => {
      updateElementSettings(templateId, elementId, { textAlign: nextValue });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};

export const useFontWeightFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) =>
      element?.type && element.type !== 'image' && element.type !== 'divider'
        ? (element.settings.fontWeight ?? 'normal')
        : 'normal',
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementSettings(templateId, elementId, { fontWeight: nextValue });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};
