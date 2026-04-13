import { GrainProvider } from '@flodesk/grain';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { getElement, resetBuilderStore } from '@/test/builder-store-helpers';

import { ImageSourceField } from './image-source-field';

const renderImageSourceField = () =>
  render(
    <GrainProvider>
      <ImageSourceField templateId="portfolio" elementId="about-image" />
    </GrainProvider>,
  );

describe('ImageSourceField', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('shows an error for invalid image URLs and disables apply', async () => {
    const user = userEvent.setup();

    renderImageSourceField();

    await user.click(screen.getByRole('button', { name: /set url/i }));

    const input = screen.getByLabelText('Image URL');
    const applyButton = screen.getByRole('button', { name: 'Apply' });

    await user.clear(input);
    await user.type(input, 'not a url');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Use an image URL like https://example.com/photo.jpg.',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(applyButton).toBeDisabled();
  });

  it('applies a valid image URL and closes the popover', async () => {
    const user = userEvent.setup();

    renderImageSourceField();

    await user.click(screen.getByRole('button', { name: /set url/i }));

    const input = screen.getByLabelText('Image URL');
    const applyButton = screen.getByRole('button', { name: 'Apply' });

    await user.clear(input);
    await user.type(input, 'https://images.example.com/photo.jpg');
    await user.click(applyButton);

    const imageElement = getElement('portfolio', 'about-image');
    if (imageElement.type !== 'image') {
      throw new Error('Expected about-image to be an image element');
    }

    expect(imageElement.data.src).toBe('https://images.example.com/photo.jpg');
    expect(imageElement.data.source).toBe('url');
    expect(screen.queryByLabelText('Image URL')).not.toBeInTheDocument();
  });
});
