import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuilderStore } from '@/store/builder-store';
import { resetBuilderStore } from '@/test/builder-store-helpers';

import {
  usePageBackgroundColorFieldModel,
  usePageMaxWidthFieldModel,
  usePageTypographyFieldModel,
} from './field-models';

describe('page settings model subscriptions', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('rerenders only the affected field model when a page setting changes', () => {
    const onBackgroundColorRender = vi.fn();
    const onTypographyRender = vi.fn();
    const onMaxWidthRender = vi.fn();

    const BackgroundColorProbe = () => {
      onBackgroundColorRender();
      usePageBackgroundColorFieldModel('portfolio');
      return null;
    };

    const TypographyProbe = () => {
      onTypographyRender();
      usePageTypographyFieldModel('portfolio');
      return null;
    };

    const MaxWidthProbe = () => {
      onMaxWidthRender();
      usePageMaxWidthFieldModel('portfolio');
      return null;
    };

    render(
      <>
        <BackgroundColorProbe />
        <TypographyProbe />
        <MaxWidthProbe />
      </>,
    );

    const initialBackgroundColorRenders = onBackgroundColorRender.mock.calls.length;
    const initialTypographyRenders = onTypographyRender.mock.calls.length;
    const initialMaxWidthRenders = onMaxWidthRender.mock.calls.length;

    act(() => {
      useBuilderStore.getState().updatePageSettings('portfolio', {
        maxWidth: '920px',
      });
    });

    expect(onBackgroundColorRender.mock.calls).toHaveLength(initialBackgroundColorRenders);
    expect(onTypographyRender.mock.calls).toHaveLength(initialTypographyRenders);
    expect(onMaxWidthRender.mock.calls).toHaveLength(initialMaxWidthRenders + 1);
  });
});
