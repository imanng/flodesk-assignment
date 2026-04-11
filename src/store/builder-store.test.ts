import { beforeEach, describe, expect, it } from 'vitest';

import { getElement, getTemplate, resetBuilderStore } from '@/test/builder-store-helpers';

import { useBuilderStore } from './builder-store';

describe('useBuilderStore', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('updates page settings only for the targeted template', () => {
    useBuilderStore
      .getState()
      .updatePageSettings('portfolio', { backgroundColor: '#123456' });

    expect(getTemplate('portfolio').pageSettings.backgroundColor).toBe('#123456');
    expect(getTemplate('restaurant').pageSettings.backgroundColor).toBe('#faf7f2');
  });

  it('updates only the targeted leaf element, including elements inside column sections', () => {
    useBuilderStore.getState().updateElementSettings('event-launch', 'talks-heading', {
      fontSize: '30px',
      color: '#ffffff',
    });

    const updatedHeading = getElement('event-launch', 'talks-heading');
    if (updatedHeading.type !== 'heading') {
      throw new Error('Expected talks-heading to be a heading');
    }

    const untouchedHeading = getElement('event-launch', 'workshops-heading');
    if (untouchedHeading.type !== 'heading') {
      throw new Error('Expected workshops-heading to be a heading');
    }

    expect(updatedHeading.settings.fontSize).toBe('30px');
    expect(updatedHeading.settings.color).toBe('#ffffff');
    expect(untouchedHeading.settings.fontSize).toBe('22px');
    expect(untouchedHeading.settings.color).toBe('#f8fafc');
  });

  it('sanitizes edited text fields and can reset seeded content', () => {
    useBuilderStore.getState().updateElementData('portfolio', 'about-text', {
      text: 'Intro <b onclick="alert(1)">Bold</b><script>alert(1)</script>',
    });
    useBuilderStore.getState().updateElementData('portfolio', 'cta-button', {
      label: 'Click <span onmouseover="alert(1)">me</span>',
    });

    const textElement = getElement('portfolio', 'about-text');
    if (textElement.type !== 'text') {
      throw new Error('Expected about-text to be a text element');
    }

    const buttonElement = getElement('portfolio', 'cta-button');
    if (buttonElement.type !== 'button') {
      throw new Error('Expected cta-button to be a button element');
    }

    expect(textElement.data.text).toContain('<b>Bold</b>');
    expect(textElement.data.text).not.toContain('onclick');
    expect(textElement.data.text).not.toContain('<script');
    expect(buttonElement.data.label).toContain('<span>me</span>');
    expect(buttonElement.data.label).not.toContain('onmouseover');

    useBuilderStore.getState().resetTemplate('portfolio');

    const resetTextElement = getElement('portfolio', 'about-text');
    if (resetTextElement.type !== 'text') {
      throw new Error('Expected about-text to be a text element after reset');
    }

    expect(resetTextElement.data.text).toContain('multidisciplinary designer');
  });

  it('stores uploaded images as data URLs and marks them as uploads', () => {
    const originalFileReader = globalThis.FileReader;
    const dataUrl = 'data:image/png;base64,ZmFrZS1pbWFnZQ==';

    class MockFileReader {
      result: string | ArrayBuffer | null = null;

      onload:
        | ((this: FileReader, event: ProgressEvent<FileReader>) => void)
        | null = null;

      readAsDataURL() {
        this.result = dataUrl;
        this.onload?.call(
          this as unknown as FileReader,
          new ProgressEvent('load') as ProgressEvent<FileReader>,
        );
      }
    }

    Object.defineProperty(globalThis, 'FileReader', {
      configurable: true,
      writable: true,
      value: MockFileReader,
    });

    try {
      const file = new File(['image'], 'hero.png', { type: 'image/png' });
      useBuilderStore
        .getState()
        .updateElementImage('portfolio', 'about-image', file);

      const imageElement = getElement('portfolio', 'about-image');
      if (imageElement.type !== 'image') {
        throw new Error('Expected about-image to be an image element');
      }

      expect(imageElement.data.src).toBe(dataUrl);
      expect(imageElement.data.source).toBe('upload');
    } finally {
      Object.defineProperty(globalThis, 'FileReader', {
        configurable: true,
        writable: true,
        value: originalFileReader,
      });
    }
  });
});
