import { GrainProvider } from '@flodesk/grain';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { resetBuilderStore } from '@/test/builder-store-helpers';

import { ButtonHrefField } from './field-components';

const renderButtonHrefField = () =>
  render(
    <GrainProvider>
      <ButtonHrefField templateId="portfolio" elementId="cta-button" />
    </GrainProvider>,
  );

describe('ButtonHrefField', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('treats anchor links as valid', () => {
    renderButtonHrefField();

    expect(screen.getByLabelText('Link URL')).toHaveValue('#');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an error for invalid links and clears it for valid ones', async () => {
    const user = userEvent.setup();

    renderButtonHrefField();

    const input = screen.getByLabelText('Link URL');

    await user.clear(input);
    await user.type(input, 'not a url');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Use https://, mailto:, tel:, /path, or #anchor.',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');

    await user.clear(input);
    await user.type(input, 'https://example.com');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});
