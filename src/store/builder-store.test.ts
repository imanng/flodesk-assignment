import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  selectCanRedo,
  selectCanUndo,
  selectTemplateSectionOrder,
} from '@/store/builder-selector';
import {
  getElement,
  getSelectedElementId,
  getTemplate,
  resetBuilderStore,
} from '@/test/builder-store-helpers';

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

  it('tracks selection per template and clearSelection only affects the targeted template', () => {
    useBuilderStore.getState().selectElement('portfolio', 'hero-heading');
    useBuilderStore.getState().selectElement('event-launch', 'event-heading');

    expect(getSelectedElementId('portfolio')).toBe('hero-heading');
    expect(getSelectedElementId('event-launch')).toBe('event-heading');

    useBuilderStore.getState().clearSelection('portfolio');

    expect(getSelectedElementId('portfolio')).toBeNull();
    expect(getSelectedElementId('event-launch')).toBe('event-heading');
  });

  it('keeps raw edited text fields in state and can reset seeded content', () => {
    useBuilderStore.getState().updateElementData('portfolio', 'about-text', 'text', {
      text: 'Intro <b onclick="alert(1)">Bold</b><script>alert(1)</script>',
    });
    useBuilderStore.getState().updateElementData('portfolio', 'cta-button', 'button', {
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

    expect(textElement.data.text).toBe(
      'Intro <b onclick="alert(1)">Bold</b><script>alert(1)</script>',
    );
    expect(buttonElement.data.label).toBe(
      'Click <span onmouseover="alert(1)">me</span>',
    );

    useBuilderStore.getState().selectElement('portfolio', 'hero-heading');
    useBuilderStore.getState().selectElement('event-launch', 'event-heading');

    useBuilderStore.getState().resetTemplate('portfolio');

    const resetTextElement = getElement('portfolio', 'about-text');
    if (resetTextElement.type !== 'text') {
      throw new Error('Expected about-text to be a text element after reset');
    }

    expect(resetTextElement.data.text).toContain('multidisciplinary designer');
    expect(getSelectedElementId('portfolio')).toBeNull();
    expect(getSelectedElementId('event-launch')).toBe('event-heading');
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

  it('reorderSections moves a section by index and leaves other templates unchanged', () => {
    const templateId = 'portfolio';
    const otherId = 'restaurant';
    const beforePortfolio = selectTemplateSectionOrder(
      useBuilderStore.getState(),
      templateId,
    );
    if (!beforePortfolio) throw new Error('Expected portfolio section order');

    const beforeRestaurant = selectTemplateSectionOrder(
      useBuilderStore.getState(),
      otherId,
    );
    if (!beforeRestaurant) throw new Error('Expected restaurant section order');

    useBuilderStore.getState().reorderSections(templateId, 0, beforePortfolio.length - 1);

    const afterPortfolio = selectTemplateSectionOrder(
      useBuilderStore.getState(),
      templateId,
    );
    expect(afterPortfolio).toEqual([
      ...beforePortfolio.slice(1),
      beforePortfolio[0],
    ]);
    expect(selectTemplateSectionOrder(useBuilderStore.getState(), otherId)).toEqual(
      beforeRestaurant,
    );
  });

  it('reorderSections no-ops for invalid or equal indices', () => {
    const templateId = 'portfolio';
    const before = selectTemplateSectionOrder(useBuilderStore.getState(), templateId);
    if (!before) throw new Error('Expected portfolio section order');

    useBuilderStore.getState().reorderSections(templateId, 0, 0);
    useBuilderStore.getState().reorderSections(templateId, -1, 1);
    useBuilderStore.getState().reorderSections(templateId, 0, 999);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual(
      before,
    );
  });

  it('setSectionOrder restores order after reorderSections (rollback simulation)', () => {
    const templateId = 'portfolio';
    const previous = [...(selectTemplateSectionOrder(useBuilderStore.getState(), templateId) ?? [])];
    useBuilderStore.getState().reorderSections(templateId, 0, previous.length - 1);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).not.toEqual(
      previous,
    );

    useBuilderStore.getState().setSectionOrder(templateId, previous);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual(previous);
  });

  it('setSectionOrder rejects orders that are not a permutation', () => {
    const templateId = 'portfolio';
    const before = selectTemplateSectionOrder(useBuilderStore.getState(), templateId);
    if (!before) throw new Error('Expected portfolio section order');

    useBuilderStore.getState().setSectionOrder(templateId, [
      before[0],
      before[0],
      before[2],
    ]);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual(before);

    useBuilderStore.getState().setSectionOrder(templateId, [...before.slice(1), 'nonexistent-section']);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual(before);
  });

  it('preserves section content in sectionMap after reorderSections', () => {
    const templateId = 'portfolio';
    const heroBefore = JSON.stringify(getTemplate(templateId).sections.find((s) => s.id === 'hero'));

    useBuilderStore.getState().reorderSections(templateId, 1, 0);

    const heroAfter = JSON.stringify(getTemplate(templateId).sections.find((s) => s.id === 'hero'));

    expect(heroAfter).toBe(heroBefore);
  });

  it('undoes and redoes page edits, and clears redo after a new edit', () => {
    const templateId = 'portfolio';
    const initialBackground = getTemplate(templateId).pageSettings.backgroundColor;

    useBuilderStore
      .getState()
      .updatePageSettings(templateId, { backgroundColor: '#123456' });

    expect(getTemplate(templateId).pageSettings.backgroundColor).toBe('#123456');
    expect(selectCanUndo(useBuilderStore.getState(), templateId)).toBe(true);
    expect(selectCanRedo(useBuilderStore.getState(), templateId)).toBe(false);

    useBuilderStore.getState().undoTemplate(templateId);

    expect(getTemplate(templateId).pageSettings.backgroundColor).toBe(initialBackground);
    expect(selectCanUndo(useBuilderStore.getState(), templateId)).toBe(false);
    expect(selectCanRedo(useBuilderStore.getState(), templateId)).toBe(true);

    useBuilderStore.getState().redoTemplate(templateId);

    expect(getTemplate(templateId).pageSettings.backgroundColor).toBe('#123456');

    useBuilderStore.getState().undoTemplate(templateId);
    useBuilderStore.getState().updatePageSettings(templateId, { maxWidth: '920px' });

    expect(selectCanRedo(useBuilderStore.getState(), templateId)).toBe(false);
  });

  it('groups rapid repeated edits to the same field into one history step', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(0));

    try {
      const templateId = 'portfolio';
      const initialText = getElement(templateId, 'about-text');
      if (initialText.type !== 'text') {
        throw new Error('Expected about-text to be a text element');
      }

      useBuilderStore.getState().updateElementData(templateId, 'about-text', 'text', {
        text: 'Draft 1',
      });
      vi.setSystemTime(new Date(400));
      useBuilderStore.getState().updateElementData(templateId, 'about-text', 'text', {
        text: 'Draft 2',
      });

      expect(
        useBuilderStore.getState().session.historyByTemplateId[templateId]?.past,
      ).toHaveLength(1);

      useBuilderStore.getState().undoTemplate(templateId);

      const undoneText = getElement(templateId, 'about-text');
      if (undoneText.type !== 'text') {
        throw new Error('Expected about-text to be a text element after undo');
      }

      expect(undoneText.data.text).toBe(initialText.data.text);

      useBuilderStore.getState().redoTemplate(templateId);

      const redoneText = getElement(templateId, 'about-text');
      if (redoneText.type !== 'text') {
        throw new Error('Expected about-text to be a text element after redo');
      }

      expect(redoneText.data.text).toBe('Draft 2');
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps undo stacks isolated per template', () => {
    useBuilderStore
      .getState()
      .updatePageSettings('portfolio', { backgroundColor: '#111111' });
    useBuilderStore
      .getState()
      .updatePageSettings('restaurant', { backgroundColor: '#222222' });

    useBuilderStore.getState().undoTemplate('portfolio');

    expect(getTemplate('portfolio').pageSettings.backgroundColor).not.toBe('#111111');
    expect(getTemplate('restaurant').pageSettings.backgroundColor).toBe('#222222');
    expect(selectCanRedo(useBuilderStore.getState(), 'portfolio')).toBe(true);
    expect(selectCanUndo(useBuilderStore.getState(), 'restaurant')).toBe(true);
  });

  it('undoes and redoes reset while restoring the previous selection', () => {
    const templateId = 'portfolio';

    useBuilderStore.getState().updateElementData(templateId, 'about-text', 'text', {
      text: 'Resettable draft copy',
    });
    useBuilderStore.getState().selectElement(templateId, 'about-text');
    useBuilderStore.getState().resetTemplate(templateId);

    expect(getSelectedElementId(templateId)).toBeNull();
    expect(getTemplate(templateId).sections.some((section) =>
      JSON.stringify(section).includes('Resettable draft copy'),
    )).toBe(false);

    useBuilderStore.getState().undoTemplate(templateId);

    const restoredText = getElement(templateId, 'about-text');
    if (restoredText.type !== 'text') {
      throw new Error('Expected about-text to be a text element after undo');
    }

    expect(restoredText.data.text).toBe('Resettable draft copy');
    expect(getSelectedElementId(templateId)).toBe('about-text');

    useBuilderStore.getState().redoTemplate(templateId);

    expect(getSelectedElementId(templateId)).toBeNull();
    expect(getTemplate(templateId).sections.some((section) =>
      JSON.stringify(section).includes('Resettable draft copy'),
    )).toBe(false);
  });

  it('undoes and redoes section reorder', () => {
    const templateId = 'portfolio';
    const before = selectTemplateSectionOrder(useBuilderStore.getState(), templateId);
    if (!before) throw new Error('Expected portfolio section order');

    useBuilderStore.getState().reorderSections(templateId, 0, before.length - 1);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual([
      ...before.slice(1),
      before[0],
    ]);

    useBuilderStore.getState().undoTemplate(templateId);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual(before);

    useBuilderStore.getState().redoTemplate(templateId);

    expect(selectTemplateSectionOrder(useBuilderStore.getState(), templateId)).toEqual([
      ...before.slice(1),
      before[0],
    ]);
  });

  it('undoes and redoes uploaded images', () => {
    const originalFileReader = globalThis.FileReader;
    const dataUrl = 'data:image/png;base64,ZmFrZS1pbWFnZQ==';
    const templateId = 'portfolio';
    const originalImage = getElement(templateId, 'about-image');
    if (originalImage.type !== 'image') {
      throw new Error('Expected about-image to be an image element');
    }

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
        .updateElementImage(templateId, 'about-image', file);

      expect((getElement(templateId, 'about-image') as typeof originalImage).data.src).toBe(dataUrl);

      useBuilderStore.getState().undoTemplate(templateId);

      expect((getElement(templateId, 'about-image') as typeof originalImage).data.src).toBe(
        originalImage.data.src,
      );

      useBuilderStore.getState().redoTemplate(templateId);

      expect((getElement(templateId, 'about-image') as typeof originalImage).data.src).toBe(dataUrl);
    } finally {
      Object.defineProperty(globalThis, 'FileReader', {
        configurable: true,
        writable: true,
        value: originalFileReader,
      });
    }
  });

  it('does not create history for selection changes or no-op edits', () => {
    const templateId = 'portfolio';
    const heading = getElement(templateId, 'hero-heading');
    if (heading.type !== 'heading') {
      throw new Error('Expected hero-heading to be a heading element');
    }

    useBuilderStore.getState().selectElement(templateId, 'hero-heading');
    useBuilderStore.getState().clearSelection(templateId);
    useBuilderStore.getState().updateElementSettings(templateId, 'hero-heading', {
      fontSize: heading.settings.fontSize,
    });
    useBuilderStore.getState().reorderSections(templateId, 0, 0);

    expect(selectCanUndo(useBuilderStore.getState(), templateId)).toBe(false);
  });
});
