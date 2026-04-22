import { useCallback } from 'react';

import { useBuilderActions } from '@/hooks/use-builder-actions';
import type { PageSettings } from '@/types/template';

import { usePageSettingsValue } from './use-page-model-core';

export const usePageBackgroundColorFieldModel = (templateId: string) => {
  const value = usePageSettingsValue(
    templateId,
    (pageSettings) => pageSettings?.backgroundColor ?? '#ffffff',
  );
  const { updatePageSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: string) => {
      updatePageSettings(templateId, { backgroundColor: nextValue });
    },
    [templateId, updatePageSettings],
  );

  return { onChange, value };
};

export const usePageTypographyFieldModel = (templateId: string) => {
  const value = usePageSettingsValue(
    templateId,
    (pageSettings) => pageSettings?.fontPreset ?? 'modern-sans',
  );
  const { updatePageSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: PageSettings['fontPreset']) => {
      updatePageSettings(templateId, { fontPreset: nextValue });
    },
    [templateId, updatePageSettings],
  );

  return { onChange, value };
};

export const usePageMaxWidthFieldModel = (templateId: string) => {
  const value = usePageSettingsValue(
    templateId,
    (pageSettings) => pageSettings?.maxWidth ?? '800px',
  );
  const { updatePageSettings } = useBuilderActions();
  const onChange = useCallback(
    (nextValue: number) => {
      updatePageSettings(templateId, { maxWidth: `${nextValue}px` });
    },
    [templateId, updatePageSettings],
  );

  return { onChange, value };
};
