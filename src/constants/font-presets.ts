import type { FontPreset } from '@/types/template';

export const FONT_STACKS: Record<FontPreset, string> = {
  'modern-sans': '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  'editorial-serif': 'Baskerville, Georgia, "Times New Roman", Times, serif',
  'classic-serif': 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

export const FONT_PRESET_OPTIONS: { value: FontPreset; label: string }[] = [
  { value: 'modern-sans', label: 'Modern Sans' },
  { value: 'editorial-serif', label: 'Editorial Serif' },
  { value: 'classic-serif', label: 'Classic Serif' },
  { value: 'mono', label: 'Monospace' },
];
