import { describe, expect, it } from 'vitest';

import { FONT_STACKS } from '@/constants/font-presets';
import { TEMPLATES } from '@/constants/templates';
import type {
  ButtonElement,
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
    expect(html).toContain('<style>');
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

  it('preserves raw text in exported content by escaping it into safe HTML', () => {
    const portfolio = TEMPLATES[0];
    expect(portfolio).toBeDefined();
    const template = structuredClone(portfolio as Template);
    const heroHeading = findElementById(template, 'hero-heading');
    const aboutText = findElementById(template, 'about-text');
    const ctaButton = findElementById(template, 'cta-button');

    expect(heroHeading, 'portfolio fixture must include hero-heading').toBeDefined();
    expect(heroHeading!.type).toBe('heading');

    expect(aboutText, 'portfolio fixture must include about-text').toBeDefined();
    expect(aboutText!.type).toBe('text');

    expect(ctaButton, 'portfolio fixture must include cta-button').toBeDefined();
    expect(ctaButton!.type).toBe('button');

    (heroHeading as HeadingElement).data.text =
      'Hello <img src=x onerror="alert(1)"> world';
    (aboutText as TextElement).data.text =
      'Line one\n<script>alert(1)</script>Line two';
    (ctaButton as ButtonElement).data.label =
      'Click <span onclick="alert(1)">me</span>';

    const html = exportToHtml(template);

    expect(html).toContain(
      'Hello &lt;img src=x onerror="alert(1)"&gt; world',
    );
    expect(html).toContain(
      'Line one<br>&lt;script&gt;alert(1)&lt;/script&gt;Line two',
    );
    expect(html).toContain(
      'Click &lt;span onclick="alert(1)"&gt;me&lt;/span&gt;',
    );
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<span onclick="alert(1)">me</span>');
  });

  it('adds rel attributes for links that open in a new tab', () => {
    const portfolio = TEMPLATES[0];
    expect(portfolio).toBeDefined();
    const template = structuredClone(portfolio as Template);
    const ctaButton = findElementById(template, 'cta-button');

    expect(ctaButton, 'portfolio fixture must include cta-button').toBeDefined();
    expect(ctaButton!.type).toBe('button');

    (ctaButton as ButtonElement).data.href = 'https://example.com';
    (ctaButton as ButtonElement).data.target = '_blank';

    const html = exportToHtml(template);

    expect(html).toContain(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer"',
    );
  });

  it('sanitizes generated export HTML with DOMPurify before returning it', () => {
    const portfolio = TEMPLATES[0];
    expect(portfolio).toBeDefined();
    const template = structuredClone(portfolio as Template);
    const ctaButton = findElementById(template, 'cta-button');
    const aboutImage = findElementById(template, 'about-image');

    expect(ctaButton, 'portfolio fixture must include cta-button').toBeDefined();
    expect(ctaButton!.type).toBe('button');

    expect(aboutImage, 'portfolio fixture must include about-image').toBeDefined();
    expect(aboutImage!.type).toBe('image');

    (ctaButton as ButtonElement).data.href = 'javascript:alert(1)';
    (aboutImage as ImageElement).data.src = 'javascript:alert(1)';
    (aboutImage as ImageElement).data.alt = '" onerror="alert(1)';

    const html = exportToHtml(template);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).not.toContain('href="javascript:alert(1)"');
    expect(html).not.toContain('src="javascript:alert(1)"');
    expect(html).toContain('<img src=""');
    expect(html).toContain('<a href="#" target="_self"');
    expect(html).toContain('alt="&quot; onerror=&quot;alert(1)"');
  });
});
