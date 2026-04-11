import { describe, expect, it } from 'vitest';

import { TEMPLATES } from './templates';

describe('TEMPLATES', () => {
  it('provides at least two valid templates with consistent section shapes', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(2);

    for (const template of TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.pageSettings.backgroundColor).toBeTruthy();
      expect(template.pageSettings.fontPreset).toBeTruthy();
      expect(template.pageSettings.maxWidth).toMatch(/px$/);
      expect(template.sections.length).toBeGreaterThan(0);

      for (const section of template.sections) {
        if (section.layout === 'stack') {
          expect(section.elements).toBeDefined();
          expect(section.columns).toBeUndefined();
        } else {
          expect(section.columns).toBeDefined();
          expect(section.elements).toBeUndefined();
          expect(section.columns?.length).toBeGreaterThan(0);
        }

        const elements = section.elements ?? section.columns?.flatMap((column) => column.elements) ?? [];
        expect(elements.length).toBeGreaterThan(0);

        for (const element of elements) {
          switch (element.type) {
            case 'text':
              expect(element.data.text).toBeTypeOf('string');
              break;
            case 'heading':
              expect(element.data.text).toBeTypeOf('string');
              expect([1, 2, 3]).toContain(element.data.level);
              break;
            case 'button':
              expect(element.data.label).toBeTypeOf('string');
              break;
            case 'image':
              expect(element.data.src).toBeTypeOf('string');
              expect(element.data.alt).toBeTypeOf('string');
              break;
            case 'divider':
              expect(element.data).toEqual({});
              break;
          }
        }
      }
    }
  });
});
