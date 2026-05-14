import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  selectPageSettings,
  selectTemplateSectionOrder,
} from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import { getElement, resetBuilderStore } from '@/test/builder-store-helpers';

import { useTemplateBuilder } from './use-template-builder';

const exportTemplateSpy = vi.fn();

vi.mock('./use-template-export', () => ({
  useTemplateExport: () => exportTemplateSpy,
}));

type RouterWrapperProps = {
  children: ReactNode;
  initialEntry?: string;
};

const RouterWrapper = ({
  children,
  initialEntry = '/portfolio',
}: RouterWrapperProps) => (
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/:id" element={<>{children}</>} />
      <Route path="/" element={<>{children}</>} />
    </Routes>
  </MemoryRouter>
);

describe('useTemplateBuilder', () => {
  beforeEach(() => {
    resetBuilderStore();
    exportTemplateSpy.mockClear();
  });

  it('maps preview inputs from store selectors', () => {
    const { result } = renderHook(() => useTemplateBuilder(), {
      wrapper: ({ children }) => <RouterWrapper>{children}</RouterWrapper>,
    });

    expect(result.current).not.toBeNull();
    if (!result.current) {
      throw new Error('Expected builder model to be defined');
    }

    const state = useBuilderStore.getState();
    expect(result.current.preview.pageSettings).toEqual(
      selectPageSettings(state, 'portfolio'),
    );
    expect(result.current.preview.sectionIds).toEqual(
      selectTemplateSectionOrder(state, 'portfolio'),
    );
    expect(result.current.preview.templateId).toBe('portfolio');
  });

  it('derives sidebar mode and title from active element selection', () => {
    const { result, rerender } = renderHook(() => useTemplateBuilder(), {
      wrapper: ({ children }) => <RouterWrapper>{children}</RouterWrapper>,
    });

    expect(result.current?.sidebar.mode).toBe('page');
    expect(result.current?.sidebar.title).toBe('Page Settings');

    useBuilderStore.getState().selectElement('portfolio', 'hero-heading');
    rerender();

    expect(result.current?.sidebar.mode).toBe('element');
    expect(result.current?.sidebar.title).toBe('Heading Settings');
    expect(result.current?.sidebar.elementId).toBe('hero-heading');
  });

  it('exposes export callback from the export hook', async () => {
    const { result } = renderHook(() => useTemplateBuilder(), {
      wrapper: ({ children }) => <RouterWrapper>{children}</RouterWrapper>,
    });

    expect(result.current).not.toBeNull();
    if (!result.current) {
      throw new Error('Expected builder model to be defined');
    }

    await result.current.header.onExportTemplate();

    expect(exportTemplateSpy).toHaveBeenCalledTimes(1);
  });

  it('exposes undo and redo callbacks with their availability state', () => {
    const { result, rerender } = renderHook(() => useTemplateBuilder(), {
      wrapper: ({ children }) => <RouterWrapper>{children}</RouterWrapper>,
    });

    expect(result.current?.header.canUndo).toBe(false);
    expect(result.current?.header.canRedo).toBe(false);

    act(() => {
      useBuilderStore.getState().updateElementData('portfolio', 'about-text', 'text', {
        text: 'Undoable draft',
      });
    });
    rerender();

    expect(result.current?.header.canUndo).toBe(true);
    expect(result.current?.header.canRedo).toBe(false);

    act(() => {
      result.current?.header.onUndoTemplate();
    });
    rerender();

    const undoneText = getElement('portfolio', 'about-text');
    if (undoneText.type !== 'text') {
      throw new Error('Expected about-text to be a text element');
    }

    expect(undoneText.data.text).not.toBe('Undoable draft');
    expect(result.current?.header.canUndo).toBe(false);
    expect(result.current?.header.canRedo).toBe(true);

    act(() => {
      result.current?.header.onRedoTemplate();
    });

    const redoneText = getElement('portfolio', 'about-text');
    if (redoneText.type !== 'text') {
      throw new Error('Expected about-text to be a text element after redo');
    }

    expect(redoneText.data.text).toBe('Undoable draft');
  });
});
