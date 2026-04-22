import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuilderStore } from '@/store/builder-store';
import { resetBuilderStore } from '@/test/builder-store-helpers';

import {
  useFontSizeFieldModel,
  useTextColorFieldModel,
  useTextContentFieldModel,
} from './field-models';

describe('element settings model subscriptions', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('rerenders only the affected field model when an element setting changes', () => {
    const onTextContentRender = vi.fn();
    const onFontSizeRender = vi.fn();
    const onTextColorRender = vi.fn();

    const TextContentProbe = () => {
      onTextContentRender();
      useTextContentFieldModel('portfolio', 'about-text');
      return null;
    };

    const FontSizeProbe = () => {
      onFontSizeRender();
      useFontSizeFieldModel('portfolio', 'about-text');
      return null;
    };

    const TextColorProbe = () => {
      onTextColorRender();
      useTextColorFieldModel('portfolio', 'about-text');
      return null;
    };

    render(
      <>
        <TextContentProbe />
        <FontSizeProbe />
        <TextColorProbe />
      </>,
    );

    const initialTextContentRenders = onTextContentRender.mock.calls.length;
    const initialFontSizeRenders = onFontSizeRender.mock.calls.length;
    const initialTextColorRenders = onTextColorRender.mock.calls.length;

    act(() => {
      useBuilderStore.getState().updateElementSettings('portfolio', 'about-text', {
        fontSize: '40px',
      });
    });

    expect(onTextContentRender.mock.calls).toHaveLength(initialTextContentRenders);
    expect(onFontSizeRender.mock.calls).toHaveLength(initialFontSizeRenders + 1);
    expect(onTextColorRender.mock.calls).toHaveLength(initialTextColorRenders);
  });
});
