# buntpapier issues to fix separately

> **Status 2026-09-19:** Items **1–3**, **6** and **7** are recorded resolved. Item **4** and follow-up **A** belong to [selection delivery](quests/selection/spec.md#delivery-brief); item **5** belongs to the [component delivery brief](quests/beta/work/components.md). Open work outside beta remains **B**, **C**, **D** and the later candidates below. These entries are a backlog, not implementation authorization.

Issues found in `buntpapier@^3.0.0-alpha.17` while building the **Control Room**
(dark) variant (`/f`) of this mock. The mock re-skins the shared components by
overriding CSS tokens (`--surface-*`, `--clr-*-text-light`, etc.) per variant —
see `src/styles/skins.sass` `html[data-skin="f"]`. buntpapier's form controls
don't fully derive from those tokens, so they don't follow a dark skin.

Root cause (common to all below): some control styles **hardcode light-theme
colours** (`var(--clr-white)`, `#00000014`, `var(--clr-primary)`) instead of
deriving from a surface/text token the app can override. A dark (or any
non-default-surface) skin then breaks.

To reproduce: run `npm run dev`, open `/f/devices/11111111-0000-4000-8000-000000000003`,
and interact with the **Target** controls in the config editor.

---

## 1. `bunt-select` dropdown menu is hardcoded white — options unreadable on dark (HIGH)

Opening any Target dropdown shows a **white** menu while the option text inherits
the skin's (light, for dark mode) secondary text colour → light-grey text on a
white menu, effectively invisible.

Rule (`dist/buntpapier.css`):
```css
.bunt-select-dropdown-menu .scrollable-menu { background-color: var(--clr-white); }
```
- Selected/hover also hardcode brand purple: `.bunt-select-dropdown-menu li:hover { background-color: var(--clr-primary); }`
- Suggested fix: derive the menu surface from a themeable token (e.g. a
  `--clr-input-menu-bg` / a surface var) defaulting to `--clr-white`, and base
  option text + hover on the same surface's contrast pair rather than
  `--clr-primary` directly.

## 2. Disabled / read-only input fill is a fixed black alpha (MEDIUM)

Read-only Target fields (e.g. `Relay 1`) set a black-alpha fill that does nothing
visible on a dark surface (and the disabled text colour assumes a light bg).

Rule:
```css
.bunt-input.disabled input { background-color: #00000014; color: var(--clr-disabled-text-light); }
```
- Suggested fix: use an overlay/surface token (e.g. `--overlay-hover`-style mix,
  or `color-mix` against the current surface) so the disabled state reads on both
  light and dark.

## 3. `bunt-button` text-weight default colour is invisible on dark (MEDIUM)

Text-weight buttons (footer **Cancel** / **Save**) default their label colour to
`--clr-primary` (deep purple `#330072`) → invisible on a dark surface.
- Worked around in this mock by setting buntpapier's documented `--button-color`
  prop per skin (`src/styles/skins.sass`), so this is configurable — but the
  default could derive from a text token so it's legible out of the box.

## 4. Selected-value highlight in the closed select (LOW)

The closed `bunt-select` shows the selected value with a native text-selection
highlight (bright blue block) rather than a styled selected state. Cosmetic;
noticeable on dark.

## 5. `bunt-checkbox` needs a lighter / lower-emphasis variant (MEDIUM)

The unchecked box is heavy — a `24px` (or `18px` small) square with a **2px**
border in `--clr-secondary-text-light`. In a data table that's one box per row, a
column of them dominates the layout. (Worked around here by only revealing the
row checkbox on hover/selection — but the box itself is still loud when shown.)

Rule (`dist/buntpapier.css`):
```css
.bunt-checkbox .bunt-checkbox-box { border: 2px solid var(--clr-secondary-text-light); }
```
- Suggested fix: a lighter weight (e.g. `weight="subtle"`) or tokens for the
  unchecked border width/colour (`--checkbox-border-width`, a fainter default like
  `--clr-grey-400`), so dense/table contexts can dial the resting state down without
  losing the checked accent.

## 6. `--input-size: compact` is recognised but unstyled — RESOLVED

Shipped compact rules in `src/styles/components/input.sass`
(`.bunt-input--size-compact`): a flat 28px control, `padding-top: 0` (no
floating-label headroom), 28px input with zeroed vertical padding, `.hint`
hidden. Applies to `bunt-input` and `bunt-select` (both emit the class).
The `DeviceDetails.vue` workaround under `.cfg-target` can now be dropped.

## 7. `bunt-select` drops fallthrough classes — RESOLVED

`bunt-select.my-class(...)` renders a root of
`.bunt-select.bunt-input.bunt-input--shape-*` — the fallthrough `my-class`
never reaches the DOM, so consumers can't target a specific select instance by
class. (Plain `bunt-input` keeps its fallthrough class.) Worked around by
scoping styles/custom-property overrides to the wrapping element instead.

---

## Follow-ups from the dark-mode rework (2026-06-12)

### A. Select overlay migration

Owned by [selection delivery](quests/selection/spec.md#delivery-brief), consuming [overlay lifecycle](quests/overlay-lifecycle/spec.md#delivery-brief). Those records carry scope, dependencies and acceptance; this backlog entry is a pointer.

### B. Sub-emphasis from `currentcolor` (experiment)

Derive label/hint/placeholder inside components from the component's own text
color (`color-mix(in srgb, currentcolor 69%, transparent)` ≈ 60% ink) instead of
the surface tokens, so app-set text colors get matching secondary/disabled
tones automatically. Changes the inference source from "surface decides" to
"nearest text color decides" — needs a design discussion first. (The input
outline stroke and the outlined/text button hover washes already work this way.)

---

### C. Native i18n support (idea, 2026-09-18)

Consider native i18n support in buntpapier. Scope is undecided; it may add too much complexity. The current plan already proposes a dictionary for built-in component strings. Whether native i18n extends beyond that is a separate discussion. Record the idea for now; no implementation or API decision is part of Phase 1.3.

### D. Optional CSS fallback for button icons (idea, 2026-09-18)

Consider a CSS custom property that supplies a button icon when no Vue `icon` prop is defined. Keep the icon prop and slot as the primary content API, with the same reactive behavior as the label. The fallback's token name, treatment of an explicitly empty icon and interaction with the icon slot remain undecided. Parked during Phase 1.3; no implementation planned yet. Checkbox icons continue to use cascading CSS through `--checkbox-icon`.

### E. `bunt-button` disabled is `aria-disabled` only (question, 2026-09-20)

`src/components/button.ts` renders a `<button>` with `ariaDisabled` and no native `disabled` attribute, so a disabled button stays focusable and receives real clicks; only the component's internal `onClick` guard prevents activation. That is a defensible pattern — it keeps the control discoverable by keyboard — but it is currently implicit. Decide whether it is the intended contract, then document it. `tests/components/button-a11y.test.ts` asserts the observable behaviour either way. Surfaced by [M1 verification groundwork](quests/infrastructure/work/minimal-verification.md); belongs to the button and accessibility scope.

### F. `tests/` is outside the lint gate (decision, 2026-09-20)

`npm run lint` is `eslint --ext .js,.ts,.vue src`, so the browser suites, fixtures and helpers have no automated convention enforcement. Extending the gate would surface pre-existing findings in assertions that were migrated byte-identical on purpose, so it was deliberately left alone during M1. Decide whether to widen the gate and fix what it reports, or to leave tests to review.

### Notes / non-issues
- **Closed** `bunt-input` / `bunt-select` fields themselves are fine on dark:
  `.bunt-input input { background-color: transparent }` + the SVG outline, so they
  inherit the skin's text colour correctly. Only the **open menu** (#1) is broken.
- Everything above is buntpapier-internal; per request, this mock does **not**
  hand-roll fixes for them (beyond the documented `--button-color` prop in #3).

## Later-phase candidates

Candidates with a recipe-versus-component assessment; none is a delivery commitment. Every selected entry inherits [component accessibility acceptance](design/accessibility.md).

| capability | scope | call |
|---|---|---|
| Tabs | tablist/tab/panel, roving focus, orientation, manual activation default | component, first after beta |
| Disclosure, Accordion | `<details name>` recipe first; component for grouped expansion with heading structure | recipe, then component |
| Breadcrumbs | navigation landmark, ordered links, current page | component |
| Pagination | named navigation, current page, previous/next, optional page size | component |
| Toolbar | named action group with arrow-key model | component |
| NavigationMenu / Sidebar | link and disclosure recipes; menu semantics only for real application menus | recipe |
| Stepper | ordered steps, current step; progression owned by the app | component, later |
| Link | native anchor plus router integration, current-page state | component |
| ToggleButton, ToggleGroup | pressed state, single/multiple sets | component, later |
| Table, then DataTable | semantic table, caption, `aria-sort` buttons, selectable rows with the subtle checkbox; controlled sorting, selection, pagination on top | component |
| InlineMessage / Alert | persistent info/success/warning/error content | component |
| ProgressLinear | named determinate/indeterminate progress | component |
| Skeleton | decorative placeholder, `aria-hidden`, busy state on the owning region | component |
| Badge, Tag, Chip | non-colour status text; static versus removable tokens | component |
| Avatar | image and fallback with intentional name behaviour | component |
| Icon | decorative versus meaningful, provider integration | recipe, component only if it adds value |
| EmptyState, DescriptionList, List, Timeline, Card, SkipLink, Stack/Grid/Divider | semantic recipes | recipe |
| Listbox, MultiSelect, TagInput | standalone selection, tokens, async search | component after `useListbox` settles |
| Calendar, RangeCalendar, DateField, TimeField, DateTimePicker | public calendar API, popup-less editing, time with `Temporal.PlainTime`, datetime with an explicit zoned-versus-local decision | component, after the date core is sound |
| FileInput / Upload | native file selection, list, removal, progress; app owns transport | component |
| Drawer, ContextMenu, HoverCard, CommandPalette | dialog and menu derivatives | component, on demand |
| Tree, Splitter, ColorPicker, OTP, Rating, month/year pickers, virtualised lists | need a real workflow, bounded scope and an AT plan before entering the roadmap | demand-driven |

## Further date-picker candidates

These remain later candidates, with no delivery commitment. Locale-sensitive editing, editable ranges and responsive presentation belong to [beta's date-input work](quests/beta/work/date-inputs.md) and are excluded from this list. Existing calendar/time and month/year entries above remain the owners of those broader products.

- Multiple independent dates: a `Temporal.PlainDate[]` value and its own selection model.
- Day-content customization: event or availability indicators through a slot or another stable extension point.
- Time and datetime: preserve the choice between a separate time field, local `Temporal.PlainDateTime` and a distinct timezone-aware `Temporal.ZonedDateTime` picker when selecting the existing calendar/time candidate.
- Month/year selection views: revisit with the existing month/year picker candidate, without assuming a public `view` prop.
- Deeper component customization: stable navigation/day-wrapper override points, justified by an actual integration.
- A dedicated Today action: decide whether it only navigates or also selects, and how it differs from the existing preset.
