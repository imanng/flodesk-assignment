import { useCallback } from 'react';

import { useBuilderActions } from '@/hooks/use-builder-actions';
import { selectTemplateElement } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import {
  formatSpacing,
  parseSpacing,
  type SpacingSides,
} from '@/utils/parse-px';

import { useElementValue } from './use-element-model-core';

export const usePaddingFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const padding = useElementValue(
    templateId,
    elementId,
    (element) => element?.settings.padding ?? '0px',
  );
  const { updateElementSettings } = useBuilderActions();
  const paddingSides = parseSpacing(padding, 0);

  const onChange = useCallback(
    (side: keyof SpacingSides, nextValue: number) => {
      const currentPadding =
        selectTemplateElement(useBuilderStore.getState(), templateId, elementId)
          ?.settings.padding ?? '0px';
      const currentPaddingSides = parseSpacing(currentPadding, 0);

      updateElementSettings(templateId, elementId, {
        padding: formatSpacing({
          ...currentPaddingSides,
          [side]: nextValue,
        }),
      });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, paddingSides };
};

export const useBorderRadiusFieldModel = (
  templateId: string,
  elementId: string,
) => {
  const value = useElementValue(
    templateId,
    elementId,
    (element) => element?.settings.borderRadius ?? '0px',
  );
  const { updateElementSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: number) => {
      updateElementSettings(templateId, elementId, {
        borderRadius: `${nextValue}px`,
      });
    },
    [elementId, templateId, updateElementSettings],
  );

  return { onChange, value };
};
