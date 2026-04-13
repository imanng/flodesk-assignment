import { GrainProvider } from '@flodesk/grain';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { useBuilderStore } from '@/store/builder-store';
import { getElement, resetBuilderStore } from '@/test/builder-store-helpers';
import { INVALID_IMAGE_URL_MESSAGE } from '@/utils/sanitize';

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

  it('shows an error for empty and invalid image URLs and disables apply', async () => {
    const user = userEvent.setup();

    renderImageSourceField();

    await user.click(screen.getByRole('button', { name: /set url/i }));

    const input = screen.getByLabelText('Image URL');
    const applyButton = screen.getByRole('button', { name: 'Apply' });

    await user.clear(input);

    expect(screen.getByRole('alert')).toHaveTextContent(INVALID_IMAGE_URL_MESSAGE);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(applyButton).toBeDisabled();

    await user.type(input, 'not a url');

    expect(screen.getByRole('alert')).toHaveTextContent(INVALID_IMAGE_URL_MESSAGE);
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

  it('syncs the draft when the image source changes while the popover is open', async () => {
    const user = userEvent.setup();

    renderImageSourceField();

    await user.click(screen.getByRole('button', { name: /set url/i }));

    const input = screen.getByLabelText('Image URL');

    await user.clear(input);
    await user.type(input, 'https://images.example.com/stale-photo.jpg');

    act(() => {
      useBuilderStore.getState().updateElementData('portfolio', 'about-image', {
        src: 'https://images.example.com/fresh-photo.jpg',
        source: 'url',
      });
    });

    expect(input).toHaveValue('https://images.example.com/fresh-photo.jpg');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
