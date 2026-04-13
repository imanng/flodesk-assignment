import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuilderStore } from '@/store/builder-store';
import { resetBuilderStore } from '@/test/builder-store-helpers';

const sectionRenderCounts = vi.hoisted(() => new Map<string, number>());

vi.mock('@/components/template-preview', () => ({
  TemplatePreviewPage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="preview-page">{children}</div>
  ),
  TemplatePreviewSection: ({
    section,
    sectionId,
    onSelectElement,
  }: {
    section?: {
      id: string;
      elements?: Array<{ id: string }>;
      columns?: Array<{ elements: Array<{ id: string }> }>;
    };
    sectionId?: string;
    onSelectElement?: (id: string) => void;
  }) => {
    const resolvedSection =
      section ??
      (sectionId
        ? {
            id: sectionId,
            elements:
              sectionId === 'hero'
                ? [{ id: 'hero-heading' }, { id: 'hero-subheading' }]
                : sectionId === 'about'
                  ? [
                      { id: 'about-divider' },
                      { id: 'about-text' },
                      { id: 'about-image' },
                    ]
                  : [{ id: 'cta-heading' }, { id: 'cta-button' }, { id: 'footer-text' }],
          }
        : undefined);

    if (!resolvedSection) return null;

    sectionRenderCounts.set(
      resolvedSection.id,
      (sectionRenderCounts.get(resolvedSection.id) ?? 0) + 1,
    );

    const elements =
      resolvedSection.elements ??
      resolvedSection.columns?.flatMap((column) => column.elements) ??
      [];

    return (
      <div data-testid={`section-${resolvedSection.id}`}>
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
  },
}));

import { Preview } from './preview';

const getCount = (sectionId: string) => sectionRenderCounts.get(sectionId) ?? 0;

describe('Preview', () => {
  beforeEach(() => {
    sectionRenderCounts.clear();
    resetBuilderStore();
  });

  it('does not rerender connected sections when selection changes', async () => {
    const user = userEvent.setup();

    render(<Preview templateId="portfolio" />);

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    await user.click(screen.getByRole('button', { name: 'hero-heading' }));

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    await user.click(screen.getByRole('button', { name: 'about-text' }));

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    await user.click(screen.getByRole('button', { name: 'about-image' }));

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);
  });

  it('does not rerender connected sections when page settings change', () => {
    render(<Preview templateId="portfolio" />);

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);

    act(() => {
      useBuilderStore.getState().updatePageSettings('portfolio', {
        backgroundColor: '#f5f5f5',
      });
    });

    expect(getCount('hero')).toBe(1);
    expect(getCount('about')).toBe(1);
    expect(getCount('cta')).toBe(1);
  });
});
