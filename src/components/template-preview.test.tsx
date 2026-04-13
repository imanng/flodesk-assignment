import { GrainProvider } from '@flodesk/grain';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { TemplateSection } from '@/types/template';

import { TemplatePreviewSection } from './template-preview';

const stackSection: TemplateSection = {
  id: 'stack-gap-section',
  layout: 'stack',
  gap: '24px',
  settings: {
    padding: '0px',
    backgroundColor: 'transparent',
  },
  elements: [
    {
      id: 'first-text',
      type: 'text',
      settings: {
        fontSize: '16px',
        color: '#111111',
        textAlign: 'left',
        padding: '0px',
        backgroundColor: 'transparent',
      },
      data: {
        text: 'First block',
      },
    },
    {
      id: 'second-text',
      type: 'text',
      settings: {
        fontSize: '16px',
        color: '#111111',
        textAlign: 'left',
        padding: '0px',
        backgroundColor: 'transparent',
      },
      data: {
        text: 'Second block',
      },
    },
  ],
};

describe('TemplatePreviewSection', () => {
  it('applies gap to stack sections', () => {
    render(
      <GrainProvider>
        <TemplatePreviewSection section={stackSection} isInteractive={false} />
      </GrainProvider>,
    );

    const container = screen.getByText('First block').parentElement;

    expect(container).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    });
  });
});
