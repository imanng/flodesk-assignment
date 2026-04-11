import { describe, expect, it } from 'vitest';

import { FONT_STACKS } from '@/constants/font-presets';
import { TEMPLATES } from '@/constants/templates';
import type {
  HeadingElement,
  ImageElement,
  Template,
  TemplateElement,
  TextElement,
} from '@/types/template';

import { exportToHtml } from './export-to-html';

function findElementById(
  template: Template,
  elementId: string,
): TemplateElement | undefined {
  for (const section of template.sections) {
    const hit = section.elements?.find((el) => el.id === elementId);
    if (hit) return hit;
    for (const col of section.columns ?? []) {
      const colHit = col.elements.find((el) => el.id === elementId);
      if (colHit) return colHit;
    }
  }
  return undefined;
}

describe('exportToHtml', () => {
  it('returns a standalone HTML document with semantic content and inline styles', () => {
    const portfolio = TEMPLATES[0];
    expect(portfolio).toBeDefined();
    const template = structuredClone(portfolio as Template);
    const aboutImage = findElementById(template, 'about-image');

    expect(aboutImage, 'portfolio fixture must include about-image').toBeDefined();
    expect(aboutImage!.type).toBe('image');
    (aboutImage as ImageElement).data.src = 'data:image/png;base64,ZmFrZS1pbWFnZQ==';

    const html = exportToHtml(template);

    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain(`<title>${template.name}</title>`);
    expect(html).toContain(`font-family: ${FONT_STACKS[template.pageSettings.fontPreset]}`);
    expect(html).toContain('<h1');
    expect(html).toContain('<p');
    expect(html).toContain('<a href="#" target="_self"');
    expect(html).toContain('<img src="data:image/png;base64,ZmFrZS1pbWFnZQ=="');
    expect(html).toContain('<hr');
    expect(html).not.toContain('fonts.googleapis.com');
  });

  it('preserves column layout styles for multi-column sections', () => {
    const eventLaunch = TEMPLATES[1];
    expect(eventLaunch).toBeDefined();
    const html = exportToHtml(eventLaunch as Template);

    expect(html).toContain('display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px');
  });

  it('sanitizes exported text content into safe body HTML', () => {
    const portfolio = TEMPLATES[0];
    expect(portfolio).toBeDefined();
    const template = structuredClone(portfolio as Template);
    const heroHeading = findElementById(template, 'hero-heading');
    const aboutText = findElementById(template, 'about-text');

    expect(heroHeading, 'portfolio fixture must include hero-heading').toBeDefined();
    expect(heroHeading!.type).toBe('heading');

    expect(aboutText, 'portfolio fixture must include about-text').toBeDefined();
    expect(aboutText!.type).toBe('text');

    (heroHeading as HeadingElement).data.text =
      'Hello <img src=x onerror="alert(1)"> world';
    (aboutText as TextElement).data.text =
      'Line one\n<script>alert(1)</script>Line two';

    const html = exportToHtml(template);

    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    // Tag stripped; spacing depends on sanitize-html output — allow one or more spaces
    expect(html).toMatch(/Hello\s+world/);
    expect(html).toContain('Line one<br />');
    expect(html).toContain('Line two');
  });
});
