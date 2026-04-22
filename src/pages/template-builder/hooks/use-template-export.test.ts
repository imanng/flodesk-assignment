import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSelectMaterializedTemplate } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import { resetBuilderStore } from '@/test/builder-store-helpers';
import type { Template, TemplateElement } from '@/types/template';

import { useTemplateExport } from './use-template-export';

const downloadHtml = vi.fn();

vi.mock('@/utils/export-to-html', () => ({
  downloadHtml,
}));

const findElementById = (
  template: Template,
  elementId: string,
): TemplateElement | undefined => {
  for (const section of template.sections) {
    const stackElement = section.elements?.find((element) => element.id === elementId);
    if (stackElement) return stackElement;

    for (const column of section.columns ?? []) {
      const columnElement = column.elements.find((element) => element.id === elementId);
      if (columnElement) return columnElement;
    }
  }

  return undefined;
};

describe('useTemplateExport', () => {
  beforeEach(() => {
    resetBuilderStore();
    downloadHtml.mockClear();
  });

  it('materializes the latest edited template before downloading', async () => {
    const selectTemplate = createSelectMaterializedTemplate('portfolio');

    act(() => {
      useBuilderStore.getState().updateElementData('portfolio', 'about-text', 'text', {
        text: 'Exported about copy',
      });
    });

    const { result } = renderHook(() => useTemplateExport(selectTemplate));

    await act(async () => {
      await result.current();
    });

    expect(downloadHtml).toHaveBeenCalledTimes(1);

    const exportedTemplate = downloadHtml.mock.calls[0]?.[0] as Template;
    const aboutText = findElementById(exportedTemplate, 'about-text');

    expect(aboutText).toBeDefined();
    expect(aboutText?.type).toBe('text');
    if (aboutText?.type !== 'text') {
      throw new Error('Expected about-text to be a text element');
    }

    expect(aboutText.data.text).toBe('Exported about copy');
  });

  it('exports the template matching the active template context', async () => {
    const selectTemplate = createSelectMaterializedTemplate('event-launch');

    act(() => {
      useBuilderStore.getState().updateElementData('event-launch', 'event-heading', 'heading', {
        text: 'Event launch hero heading',
      });
      useBuilderStore.getState().updateElementData('portfolio', 'hero-heading', 'heading', {
        text: 'Portfolio hero heading',
      });
    });

    const { result } = renderHook(() => useTemplateExport(selectTemplate));

    await act(async () => {
      await result.current();
    });

    expect(downloadHtml).toHaveBeenCalledTimes(1);

    const exportedTemplate = downloadHtml.mock.calls[0]?.[0] as Template;
    const heroHeading = findElementById(exportedTemplate, 'event-heading');

    expect(exportedTemplate.id).toBe('event-launch');
    expect(heroHeading).toBeDefined();
    expect(heroHeading?.type).toBe('heading');
    if (heroHeading?.type !== 'heading') {
      throw new Error('Expected hero-heading to be a heading element');
    }

    expect(heroHeading.data.text).toBe('Event launch hero heading');
  });

  it('keeps a stable export callback while using the latest template value', async () => {
    const selectTemplate = createSelectMaterializedTemplate('portfolio');
    const { result, rerender } = renderHook(
      ({ selector }: {
        selector:
          | ((state: { templateMap: Record<string, unknown> }) => Template | undefined)
          | null;
      }) => useTemplateExport(selector as ReturnType<typeof createSelectMaterializedTemplate>),
      {
        initialProps: {
          selector: selectTemplate,
        },
      },
    );
    const initialCallback = result.current;

    act(() => {
      useBuilderStore.getState().updateElementData('portfolio', 'about-text', 'text', {
        text: 'Stable callback export copy',
      });
    });

    rerender({ selector: selectTemplate });

    expect(result.current).toBe(initialCallback);

    await act(async () => {
      await result.current();
    });

    expect(downloadHtml).toHaveBeenCalledTimes(1);

    const exportedTemplate = downloadHtml.mock.calls[0]?.[0] as Template;
    const aboutText = findElementById(exportedTemplate, 'about-text');

    expect(aboutText).toBeDefined();
    expect(aboutText?.type).toBe('text');
    if (aboutText?.type !== 'text') {
      throw new Error('Expected about-text to be a text element');
    }

    expect(aboutText.data.text).toBe('Stable callback export copy');
  });
});
