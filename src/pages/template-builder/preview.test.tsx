import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetBuilderStore } from '@/test/builder-store-helpers';

const sectionRenderCounts = vi.hoisted(() => new Map<string, number>());

vi.mock('@/components/template-preview', () => ({
  TemplatePreviewSection: ({
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
});
