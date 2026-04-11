# Flodesk Page Builder Test Strategy

## Summary
This document defines the assignment-focused test strategy for the Flodesk Page Builder. It is designed to validate the implementation against the assignment acceptance criteria and the current implementation plan.

Current repo note:
- The repo does not yet include test dependencies or test scripts.
- This strategy recommends a test stack and command structure, but those are implementation follow-ups rather than part of this document-only step.

## Goals
We want confidence that a user can:
- browse templates,
- customize page-level and element-level settings,
- see changes immediately in the preview,
- export a standalone HTML file that opens correctly in a browser.

We also want confidence that the implementation stays aligned with the planned section-based template model and discriminated element data model.

## Recommended Tooling
Primary recommendation:
- `Vitest` for unit and integration tests
- `@testing-library/react` for component behavior
- `@testing-library/user-event` for realistic interactions
- `jsdom` for browser-like test environment

Optional extra confidence:
- `Playwright` for one end-to-end smoke flow around export/download

Existing required checks:
- `npm run lint`
- `npm run build`

## Recommended Commands
Recommended scripts once test tooling is added:
- `npm run test`
- `npm run test:watch`
- `npm run test:e2e`

Required pre-submit checks:
- `npm run lint`
- `npm run build`

## Test Levels

### P0 Automated
These are the minimum automated tests that should pass before considering the assignment complete.

#### Data Model And Store
Cover the builder store, template fixtures, and export-facing state shape.

Scenarios:
- Template fixtures contain at least 2 templates.
- Each template has valid `pageSettings` and `sections`.
- `stack` sections use `elements`.
- `columns` sections use `columns`, and each column has ordered `elements`.
- `TemplateElement` fixtures respect the discriminated union:
  - text uses `data.text`
  - heading uses `data.text` + `data.level`
  - button uses `data.label` and optional link fields
  - image uses `data.src` + `data.alt`
- Section, column, and element render/export order follows array order.
- `updatePageSettings` updates only the targeted template.
- `updateElementSettings` updates only the targeted leaf element.
- `updateTextLikeData` updates:
  - `text.data.text`
  - `heading.data.text`
  - `button.data.label`
  - optional `button.data.href`
- `updateTextLikeData` sanitizes edited text fields and does not preserve script injection.
- `updateImageData` updates image metadata such as `data.alt`, `data.decorative`, `data.width`, and `data.height`.
- `updateElementImage` stores a data URL in `image.data.src` and marks upload state as expected.
- `resetTemplate` restores original seeded values.

#### Rendering And Interaction
Cover the core UI behavior using React Testing Library.

Scenarios:
- Gallery renders available templates.
- Template cards display name and description.
- Clicking a template navigates to the correct builder route.
- Unknown template id redirects to gallery.
- Preview renders `stack` and `columns` layouts correctly.
- Clicking an element selects it.
- Clicking outside elements deselects it.
- Sidebar shows page controls when no element is selected.
- Sidebar shows type-specific controls when an element is selected.
- Editing page background updates preview immediately.
- Editing page width updates preview immediately.
- Editing text/heading/button copy updates preview immediately.
- Editing heading level updates rendered heading tag.
- Editing button link updates exported link target/source state.
- Replacing an image updates preview immediately.
- Editing image alt text updates state immediately.

#### Export
Cover the export utility with focused assertions on the generated HTML string.

Scenarios:
- Export returns a complete HTML document beginning with `<!DOCTYPE html>`.
- Export contains no external CSS dependency.
- Export contains no Google Fonts or remote web-font dependency.
- Export uses `FONT_STACKS` resolved values for typography.
- Export includes semantic output for:
  - headings
  - paragraphs/text
  - links/buttons
  - images
  - dividers
- Export preserves section and column layout with inline styles.
- Export embeds uploaded images as base64 data URLs.
- Export includes image `alt` values.
- Export allows empty `alt` only for decorative images.
- Exported HTML does not include injected script/event-handler content from edited text fields.

### P1 Manual Acceptance
These checks validate the assignment from the perspective of a reviewer using the app directly.

Scenarios:
- Open the app and choose a template without needing instructions.
- Confirm at least 2 templates feel visually distinct.
- Change page background color and see immediate preview updates.
- Change typography preset and see immediate preview updates.
- Change page width and see immediate preview updates.
- Select and edit a heading.
- Select and edit body text.
- Select and edit a button label.
- Select and edit a button link if supported.
- Replace an image and confirm preview updates.
- Edit image alt text if supported in the sidebar.
- Export the page to HTML.
- Open the exported file directly in a browser without running the dev server.
- Confirm the exported file still renders expected layout, colors, uploaded images, and typography using local/system font stacks.

### P2 Optional Browser Smoke
If time allows, add one Playwright smoke test.

Recommended flow:
- Open gallery
- Select one template
- Change one text field
- Change one page setting
- Trigger export
- Assert the file downloads
- Assert downloaded HTML contains the changed value(s)

## Acceptance Mapping
Map tests directly to the assignment acceptance criteria.

### A user with no instructions can pick a template, make meaningful changes, and export a page within a few minutes
Validated by:
- gallery render/navigation tests
- sidebar interaction tests
- manual end-to-end acceptance run

### Each template has configurable settings at two levels: page and element
Validated by:
- page settings tests
- selected element settings tests
- manual edit coverage for both levels

### Changes are reflected immediately in the preview
Validated by:
- interaction tests for page and element edits
- manual preview checks

### The exported file opens correctly in a browser with no additional tooling
Validated by:
- export utility tests
- manual open-exported-file check
- optional Playwright smoke if implemented

### At least 2 templates are available, each with a different look and feel
Validated by:
- fixture existence tests
- manual visual verification

## Exit Criteria
The assignment is ready when:
- all P0 automated tests pass,
- `npm run lint` passes,
- `npm run build` passes,
- the P1 manual checklist is completed successfully in at least one Chromium-based browser.

## Out Of Scope
Not required for this assignment unless added later:
- visual regression snapshots
- full cross-browser matrix
- performance benchmarking
- accessibility audit automation beyond the targeted alt/semantic checks above
- long-term CI ownership/process documentation

## Assumptions
- Button elements export as links when `data.href` is provided.
- Export validation is primarily string/assertion-based plus one manual browser-open check.
- Array order is the source of truth for sections, columns, and elements.
- This strategy document does not itself add or modify package dependencies, scripts, or config.
