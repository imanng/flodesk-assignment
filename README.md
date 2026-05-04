# Page Builder

A React + Vite template builder for selecting a starting page, editing page and element settings, previewing the result, and exporting the current template as standalone HTML.

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run test` runs the Vitest suite.

## Builder Flow

The builder is intentionally split into a few layers so the data path is easier to follow:

```text
Route / template id
  -> useTemplateBuilder()
  -> builder store selectors and actions
  -> header, preview, and sidebar props
  -> page or element settings panels
  -> store updates
  -> preview rerender and export materialization
```

### 1. Template Data Starts Normalized

Initial templates live in `src/constants/templates.ts` as runtime `Template` objects. On store creation, `src/store/builder-template.ts` normalizes them into a `BuilderTemplate` shape:

- `templateMap` stores templates by id.
- Each template stores `sectionOrder` plus `sectionMap` for stable section lookup.
- Page settings stay on the template.
- Element lookup and mutation helpers live beside the normalization logic.

This keeps the store optimized for editing, while selectors can still materialize a regular `Template` when preview or export needs one.

### 2. Store Owns State and Mutations

`src/store/builder-store.ts` is the single write surface for builder state. It owns:

- persisted template edits through Zustand `persist`;
- transient selection state in `session.selectedElementIds`;
- actions such as `selectElement`, `clearSelection`, `updatePageSettings`, `updateElementSettings`, `updateElementData`, `updateElementImage`, and `resetTemplate`.

Only `templateMap` is persisted. Selection is session-only, so reopening the app keeps edits without restoring an old active element.

### 3. Selectors Own Read Shapes

`src/store/builder-selector.ts` keeps read logic out of components. It exposes small selectors for:

- page settings, template names, section ids, sections, and elements;
- active element id/type and the section that contains the active element;
- materialized `Template` objects for gallery cards, preview, and export.

The materialized-template selectors memoize by normalized template identity, which avoids rebuilding the runtime tree when unrelated state changes.

### 4. `useTemplateBuilder` Wires the Page

`src/pages/template-builder/hooks/use-template-builder.ts` is the composition point for the builder route. It reads the template id from the URL, pulls the minimum store state needed by the shell, creates event handlers, and returns a view model:

- `header` gets the template name, back/reset handlers, and export handler.
- `preview` gets page settings, ordered section ids, selection handlers, and the template id.
- `sidebar` gets the current mode (`page` or `element`), title, template id, and active element id.

`src/pages/template-builder/template-builder.tsx` stays presentational: it asks for the model and renders `TemplateBuilderHeader`, `Preview`, and `Sidebar`.

### 5. Preview Subscribes by Section

`src/pages/template-builder/preview.tsx` receives the page-level props from the builder hook, then each connected preview section subscribes to its own section with `selectTemplateSection`.

That means page setting changes can update the page wrapper without forcing every section to rerender, while section or selection changes only affect the relevant connected section.

### 6. Sidebar Chooses the Settings Surface

`src/pages/template-builder/sidebar.tsx` switches between:

- `PageSettings` when no element is selected;
- `ElementSettings` when the preview selects an element.

Both settings surfaces are schema driven:

- page settings use `src/pages/template-builder/page-settings/schema.tsx`;
- element settings use `src/pages/template-builder/element-settings/schema.tsx`.

The schema files describe which fields appear. Field model hooks in each settings folder read the current value from the store and call the appropriate store action when the user changes a control. Shared form rendering lives in `src/components/form`.

### 7. Export Reads the Latest Template at Click Time

The export button calls the handler from `src/pages/template-builder/hooks/use-template-export.ts`. That hook receives a materialized-template selector from `useTemplateBuilder`, then reads `useBuilderStore.getState()` only when export is clicked.

The export pipeline is:

```text
Export button
  -> useTemplateExport callback
  -> createSelectMaterializedTemplate(templateId)
  -> current Template
  -> src/utils/export-to-html.ts
  -> sanitized standalone HTML download
```

`export-to-html.ts` is responsible for HTML generation, inline style serialization, URL sanitization, HTML escaping, and triggering the file download.

## Separation of Concerns

- Store files own state shape, persistence, and mutation.
- Selector files own read models and materialization.
- `useTemplateBuilder` owns route-level composition and cross-component wiring.
- Preview components own visual rendering and selection interaction.
- Settings schemas own field layout; field model hooks own store subscriptions and updates.
- Export utilities own HTML generation and download behavior.

When adding a new setting or element type, prefer following that split: add the type/data shape, update store helpers/selectors if needed, add settings field models and schema entries, render it in preview/export, then cover the behavior with focused tests.
