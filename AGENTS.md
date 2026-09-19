# Buntpapier v3 — Developer Guide

## Documentation

Keep narrative prose in public docs human-written. Agent edits in `docs/` are limited to mechanical documentation, such as component API references. Evergreen internal guides and accepted design decisions belong in `design/`; start with [the internal design index](design/README.md). Plans, unresolved investigations, prototypes and execution state belong in `quests/`; use [the quest index](quests/README.md) to find the owning record. `TODOs.md` is the single backlog for work outside quest scope.

## API design

Buntpapier is a Vue 3 component library. Props/models and slots carry content, application state and data. CSS custom properties configure appearance and presentation policy, including modality and dismissal. Those policies update live, including while open; JavaScript applies the corresponding native behavior. `disabled` remains application state in a prop.

Ordinary components are the default, including form fields and local async button feedback. Optional primed components bind a shared workflow or complex integration once per composable call. Their returned component is a functional view of that state; workflow lifetime belongs to the owning scope and survives view unmounts.

When designing a component API, read [the evergreen internal API guide](design/api-guide.md) for the authoring model and shared field vocabulary. [The decision record](design/api-design.md) preserves accepted decisions and alternatives. For unresolved design, follow [beta's subquest map](quests/beta/spec.md#subquests) to the owning scope. Its briefs preserve planned and deferred work; unresolved details remain proposals until decided.

## CSS architecture

Users set public component properties on the element or an ancestor. One declaration can configure several derived values:

```css
.sidebar .bunt-button { --button-weight: text; }
.btn-primary { --button-color: var(--clr-primary); --button-size: large; }
```

The variable tiers are global tokens (`--clr-primary`, `--clr-surface`, `--font-stack`), public component properties (`--button-color`, `--input-shape`) and private resolved/computed properties prefixed with `--_`. User code sets the public tiers. Private properties may come from stylesheet fallback chains or component calculations; they are not all inline JavaScript outputs.

In `buntpapier.derived`, connect public properties to a documented default or global token. Current button color fallbacks and filled-label contrast live in [button.sass](src/styles/components/button.sass). Relative colors derive hover/pressed states in CSS. JavaScript still corrects accents used as text or outlined ink against the surrounding surface; the old HSL channel decomposition is no longer used. See [the theming guide](docs/guide/theming.md) for the token system.

### The Vue/CSS bridge

[src/computedStyle.ts](src/computedStyle.ts) reads resolved computed styles from an element using a property-name map and a callback returning `{ style, classes }`. It applies the results to the element. Its returned `style` and `classes` are deliberately non-reactive containers that preserve those updates across Vue renders; `customProps` is reactive.

The current bridge still maps keyword properties such as `--button-shape` to modifier classes. It reads at mount and on theme notifications. Setting `--bunt-will-change: all` at mount opts the element into per-frame polling. The replacement observer remains deferred; planned live presentation settings must satisfy the API's live-update promise.

When changing a JavaScript/CSS responsibility, consult [the bridge inventory](design/js-bridge-inventory.md) for its native replacement and retirement conditions. The public custom-property API remains stable as native CSS takes over each calculation.

## CSS Layers

Styles are organized across four `buntpapier.*` sub-layers declared in order:

```
buntpapier.reset       box-sizing reset
buntpapier.colors      :root color palette (--clr-*)
buntpapier.derived     component fallback chain (Tier 3 defaults)
buntpapier.components  all component rules
```

The host app must declare layers before importing buntpapier styles:

```html
<!-- index.html -->
<style>@layer typography, buntpapier;</style>
```

```sass
// main.sass
@layer typography, buntpapier
```

Import order in `main.ts`:
```typescript
import './assets/main.sass'   // app styles first
import 'buntpapier/style'     // library styles after
```

## Sass Conventions

- Indented Sass syntax (`.sass`), never SCSS
- Tabs for indentation
- Per-component files in `src/styles/components/`, imported via `src/styles/components/index.sass`
- Variant classes follow the pattern `bunt-{component}--{property}-{value}`:
  - `.bunt-button--shape-rounded`
  - `.bunt-button--weight-outlined`
  - `.bunt-button--size-large`
- Select semantic state through native state or appropriate ARIA where available. Current components still use some mirrored state classes; keep classes for CSS-driven variants and purely visual states such as `.floating-label`.

## TypeScript Style

Rely on inference — add explicit types only when the compiler can't infer or when a public API needs to be documented. Avoid annotating variables, return types, and parameters that are obvious from context.

## Component File Conventions

- SFC components: Pug template, script setup, indented Sass, no scoped styles
- Render-function components (e.g. button): plain `.ts` file, `setup()` returns a render function
- SFC block order: script → template → style
- Root class: `.bunt-{name}` — no scoped styles, styles live in `src/styles/components/{name}.sass`
- No style attribute in template — `style` and `classes` from `useComputedStyle` are applied to the root element programmatically

## Utilities

- `src/utils/colors.ts` — accent contrast correction against the resolved surface and color utilities
- `src/utils/icon.ts` — `getIconClass(name)`: maps icon name to `mdi-*` class
- `src/utils/input-outline.ts` — computes SVG dash-array for the animated input border, sets `--label-gap`
- `src/utils/text-metrics.ts` — measures text width for label gap calculation

## Key Dependencies

- `color` — runtime color parsing and contrast correction
- `@floating-ui/vue` — current select dropdown positioning; the tooltip currently uses `@popperjs/core`
- `@vue-macros/reactivity-transform` — `$ref()`, `$computed()` sugar
