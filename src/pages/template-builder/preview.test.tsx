import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuilderStore } from '@/store/builder-store';
import { getTemplate, resetBuilderStore } from '@/test/builder-store-helpers';
import type { PageSettings } from '@/types/template';

const sectionRenderCounts = vi.hoisted(() => new Map<string, number>());
const templateId = 'portfolio';
const template = getTemplate(templateId);
const pageSettings: PageSettings = template.pageSettings;
const sectionIds = template.sections.map((section) => section.id);

vi.mock('@/components/template-preview', async () => {
  const { memo } = await import('react');

  return {
    TemplatePreviewPage: ({ children }: { children: ReactNode }) => (
      <div data-testid="preview-page">{children}</div>
    ),
    TemplatePreviewSection: memo(({
      section,
      onSelectElement,
    }: {
      section: {
        id: string;
        elements?: Array<{ id: string }>;
        columns?: Array<{ elements: Array<{ id: string }> }>;
      };
      onSelectElement?: (id: string) => void;
    }) => {
      sectionRenderCounts.set(
        section.id,
        (sectionRenderCounts.get(section.id) ?? 0) + 1,
      );

      const elements =
        section.elements ?? section.columns?.flatMap((column) => column.elements) ?? [];

      return (
        <div data-testid={`section-${section.id}`}>
          {elements.map((element) => (
            <button
              key={element.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelectElement?.(element.id);
              }}
            >
              {element.id}
            </button>
          ))}
        </div>
      );
    }),
  };
});

import { Preview } from './preview';

const getCount = (sectionId: string) => sectionRenderCounts.get(sectionId) ?? 0;

describe('Preview', () => {
  beforeEach(() => {
    resetBuilderStore();
    sectionRenderCounts.clear();
  });

  it('rerenders only the affected sections when selection changes', () => {
    const onSelectElement = vi.fn();
    const onDeselectAll = vi.fn();
    render(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={sectionIds}
        templateId={templateId}
      />,
    );

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    act(() => {
      useBuilderStore.getState().selectElement(templateId, 'hero-heading');
    });

    expect(getCount('hero')).toBe(2);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    act(() => {
      useBuilderStore.getState().selectElement(templateId, 'hero-subheading');
    });

    expect(getCount('hero')).toBe(3);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    act(() => {
      useBuilderStore.getState().selectElement(templateId, 'about-text');
    });

    expect(getCount('hero')).toBe(4);
    expect(getCount('about')).toBe(2);
    expect(getCount('cta')).toBe(1);
  });

  it('calls the preview callbacks and deselects once on background click', async () => {
    const user = userEvent.setup();
    const onSelectElement = vi.fn();
    const onDeselectAll = vi.fn();

    render(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={sectionIds}
        templateId={templateId}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'hero-heading' }));
    expect(onSelectElement).toHaveBeenCalledWith('hero-heading');

    await user.click(screen.getByTestId('preview-page'));
    expect(onDeselectAll).toHaveBeenCalledTimes(1);
  });

  it('rerenders only the selected section when its form field changes', () => {
    const onSelectElement = vi.fn();
    const onDeselectAll = vi.fn();

    render(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={sectionIds}
        templateId={templateId}
      />,
    );

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    act(() => {
      useBuilderStore.getState().selectElement(templateId, 'about-text');
    });

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(2);
    expect(getCount('cta')).toBe(1);

    act(() => {
      useBuilderStore.getState().updateElementData(templateId, 'about-text', 'text', {
        text: 'Updated about text',
      });
    });

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(3);
    expect(getCount('cta')).toBe(1);
  });

  it('does not rerender sections when page settings change', () => {
    const onSelectElement = vi.fn();
    const onDeselectAll = vi.fn();
    const { rerender } = render(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={sectionIds}
        templateId={templateId}
      />,
    );

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    rerender(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={{
          ...pageSettings,
          backgroundColor: '#f5f5f5',
        }}
        sectionIds={sectionIds}
        templateId={templateId}
      />,
    );

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);
  });
});
