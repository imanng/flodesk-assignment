import { useCallback, useEffect, useState } from 'react';

import { useBuilderActions } from '@/hooks/use-builder-actions';
import { validateImageUrl } from '@/utils/sanitize';

import { useElementValue } from './use-element-model-core';

export const useImageSourceFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const src = useElementValue(
    templateId,
    elementId,
    (element) => (element?.type === 'image' ? element.data.src : ''),
  );
  const { updateElementData, updateElementImage } = useBuilderActions();
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);
  const {
    sanitizedValue: sanitizedUrlDraft,
    errorMessage,
  } = validateImageUrl(urlDraft);

  useEffect(() => {
    setUrlDraft(src);
  }, [src]);

  const openUrlPopover = useCallback(() => {
    setUrlDraft(src);
    setIsUrlOpen(true);
  }, [src]);

  const closeUrlPopover = useCallback(() => {
    setIsUrlOpen(false);
  }, []);

  const applyUrl = useCallback(() => {
    if (!sanitizedUrlDraft) return;

    updateElementData(templateId, elementId, 'image', {
      src: sanitizedUrlDraft,
      source: 'url',
    });
    setIsUrlOpen(false);
  }, [elementId, sanitizedUrlDraft, templateId, updateElementData]);

  const onUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        updateElementImage(templateId, elementId, file);
      }
    };
    input.click();
  }, [elementId, templateId, updateElementImage]);

  return {
    applyUrl,
    canApplyUrl: Boolean(sanitizedUrlDraft),
    closeUrlPopover,
    errorMessage,
    isUrlOpen,
    onUpload,
    openUrlPopover,
    setUrlDraft,
    src,
    urlDraft,
  };
};
