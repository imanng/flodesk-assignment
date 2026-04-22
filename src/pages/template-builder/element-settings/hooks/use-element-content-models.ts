import { useCallback, useEffect, useState } from 'react';

import { useBuilderActions } from '@/hooks/use-builder-actions';
import { validateLinkUrl } from '@/utils/sanitize';

import { useElementValue } from './use-element-model-core';

export const useTextContentFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const elementType = useElementValue(
    templateId,
    elementId,
    (element) => element?.type,
  );
  const value = useElementValue(
    templateId,
    elementId,
    (element) =>
      element?.type === 'text' || element?.type === 'heading'
        ? element.data.text
        : '',
  );
  const { updateElementData } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      if (elementType === 'text') {
        updateElementData(templateId, elementId, 'text', { text: nextValue });
      }
      if (elementType === 'heading') {
        updateElementData(templateId, elementId, 'heading', { text: nextValue });
      }
    },
    [elementId, elementType, templateId, updateElementData],
  );

  return { onChange, value };
};

export const useHeadingLevelFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) => (element?.type === 'heading' ? element.data.level : 1),
  );
  const { updateElementData } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementData(templateId, elementId, 'heading', {
        level: Number(nextValue) as 1 | 2 | 3,
      });
    },
    [elementId, templateId, updateElementData],
  );

  return { onChange, value };
};

export const useButtonLabelFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) => (element?.type === 'button' ? element.data.label : ''),
  );
  const { updateElementData } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementData(templateId, elementId, 'button', { label: nextValue });
    },
    [elementId, templateId, updateElementData],
  );

  return { onChange, value };
};

export const useButtonHrefFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const href = useElementValue(
    templateId,
    elementId,
    (element) => (element?.type === 'button' ? (element.data.href ?? '') : ''),
  );
  const { updateElementData } = useBuilderActions();
  const [draftValue, setDraftValue] = useState(href);
  const { errorMessage } = validateLinkUrl(draftValue);

  useEffect(() => {
    setDraftValue(href);
  }, [href]);

  const onChange = useCallback(
    (nextValue: string) => {
      setDraftValue(nextValue);

      const nextValidation = validateLinkUrl(nextValue);
      if (nextValidation.sanitizedValue) {
        updateElementData(templateId, elementId, 'button', {
          href: nextValidation.sanitizedValue,
        });
      }
    },
    [elementId, templateId, updateElementData],
  );

  return {
    errorMessage,
    onChange,
    value: draftValue,
  };
};

export const useButtonTargetFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) =>
      element?.type === 'button' ? (element.data.target ?? '_self') : '_self',
  );
  const { updateElementData } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementData(templateId, elementId, 'button', {
        target: nextValue as '_self' | '_blank',
      });
    },
    [elementId, templateId, updateElementData],
  );

  return { onChange, value };
};

export const useImageAltFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) => (element?.type === 'image' ? element.data.alt : ''),
  );
  const { updateElementData } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updateElementData(templateId, elementId, 'image', { alt: nextValue });
    },
    [elementId, templateId, updateElementData],
  );

  return { onChange, value };
};
