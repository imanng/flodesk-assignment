export const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', content: 'Normal' },
  { value: 'medium', content: 'Medium' },
  { value: 'bold', content: 'Bold' },
] as const;

export const HEADING_LEVEL_OPTIONS = [
  { value: '1', content: 'H1' },
  { value: '2', content: 'H2' },
  { value: '3', content: 'H3' },
] as const;

export const TARGET_OPTIONS = [
  { value: '_self', content: 'Same tab' },
  { value: '_blank', content: 'New tab' },
] as const;
