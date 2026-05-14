import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { selectTemplateSectionOrder } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import { getTemplate, resetBuilderStore } from '@/test/builder-store-helpers';
import type { PageSettings } from '@/types/template';

const sectionRenderCounts = vi.hoisted(() => new Map<string, number>());
const templateId = 'portfolio';
const template = getTemplate(templateId);
const pageSettings: PageSettings = template.pageSettings;
const sectionIds = template.sections.map((section) => section.id);

vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({
    children,
    onDragEnd,
  }: {
    children: ReactNode;
    onDragEnd?: (event: {
      canceled: boolean;
      operation: {
        canceled: boolean;
        source: { id: string; index?: number; initialIndex?: number };
        target: { id: string };
      };
    }) => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onDragEnd?.({
            canceled: false,
            operation: {
              canceled: false,
              source: { id: 'hero', initialIndex: 0, index: 2 },
              target: { id: 'hero' },
            },
          })
        }
      >
        Simulate section drag
      </button>
      <button
        type="button"
        onClick={() =>
          onDragEnd?.({
            canceled: false,
            operation: {
              canceled: false,
              source: { id: 'hero', initialIndex: 2, index: 0 },
              target: { id: 'hero' },
            },
          })
        }
      >
        Simulate second section drag
      </button>
      {children}
    </div>
  ),
}));

vi.mock('@dnd-kit/react/sortable', () => ({
  isSortable: () => true,
  useSortable: () => ({
    handleRef: vi.fn(),
    isDragSource: false,
    ref: vi.fn(),
  }),
}));

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

  it('lists sections in store order after reorder when sectionIds prop matches the store', () => {
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

    act(() => {
      useBuilderStore.getState().reorderSections(templateId, 0, sectionIds.length - 1);
    });

    const nextIds =
      selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [];

    rerender(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={nextIds}
        templateId={templateId}
      />,
    );

    const domIds = screen.getAllByTestId(/^section-/).map((el) => {
      const id = el.getAttribute('data-testid');
      return id?.startsWith('section-') ? id.slice('section-'.length) : '';
    });

    expect(domIds).toEqual(nextIds);
  });

  it('does not rerender section bodies when only section order props change', () => {
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

    act(() => {
      useBuilderStore.getState().reorderSections(templateId, 0, sectionIds.length - 1);
    });

    const nextIds =
      selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [];

    rerender(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={nextIds}
        templateId={templateId}
      />,
    );

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);
  });

  it('records drag reorder as undoable history using the latest store order', async () => {
    const user = userEvent.setup();
    const onSelectElement = vi.fn();
    const onDeselectAll = vi.fn();
    const before =
      selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [];

    const { rerender } = render(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={before}
        templateId={templateId}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Simulate section drag' }));

    const firstReorder =
      selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [];
    expect(firstReorder).toEqual([before[1], before[2], before[0]]);

    await user.click(screen.getByRole('button', { name: 'Simulate second section drag' }));

    const secondReorder =
      selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [];
    expect(secondReorder).toEqual([before[0], before[1], before[2]]);

    act(() => {
      useBuilderStore.getState().undoTemplate(templateId);
    });

    const undone =
      selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [];
    expect(undone).toEqual(firstReorder);

    rerender(
      <Preview
        onSelectElement={onSelectElement}
        onDeselectAll={onDeselectAll}
        pageSettings={pageSettings}
        sectionIds={undone}
        templateId={templateId}
      />,
    );

    act(() => {
      useBuilderStore.getState().redoTemplate(templateId);
    });

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual(
      secondReorder,
    );
  });
});
