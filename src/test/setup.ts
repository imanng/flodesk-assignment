import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/** jsdom — required by @dnd-kit/dom observers used by the preview DragDropProvider */
globalThis.ResizeObserver ??= class ResizeObserver {
  disconnect(): void {}

  observe(): void {}

  unobserve(): void {}
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
