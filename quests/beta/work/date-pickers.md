---
status: waiting
activity: verify
next: verify the full CI matrix and arrange remaining manual evidence when selected
waiting_on: scope-selection-and-external-browser-evidence
profile: current owner-selected Codex session; model and effort not exposed
---
# Date-picker ground truth

## Follow-up status, 2026-09-17

The six follow-up steps below are implemented. The remaining sections preserve the original Phase 0 observations; their fixme markers and defect descriptions are historical.

This pass keeps `YYYY-MM-DD` for the single-date input, including when blurred. Dotted day-month-year input and `parseInput` remain supported; the obsolete `formatValue` docs entry is removed. Focus and opening leave an empty model empty. Pointer opening keeps input focus; Alt+Down enters the calendar, while bare Up/Down retain segment editing. Tab follows DOM order: input, clear when present, month navigation, one remembered day per visible month, then presets. Leaving the picker closes it; Escape cancels the uncommitted range and returns input focus. The component docs contain the current keyboard tables and supersede the input-only keyboard decision in `design/date-picker-interaction.md`.

`CalendarPanel.vue` now owns shared month navigation and focus movement for both pickers. `CalendarMonth.vue` gives each grid a unique label and puts selection on gridcells. Disabled dates remain focusable for inspection but cannot be selected. Both pickers call `showPopover()` without a `source` option: Firefox 148 repeated the popover in its Tab sequence when the source was the input, so focus entry and return stay explicit. One live region announces month changes; a separate range status announces the first endpoint. Both pickers support inline rendering and clear actions, with the input classes on the root. `useInputOutline` tolerates an absent outline. The SSR observer error came from `scrollbars.vue`; its observers are now constructed on mount.

The restored docs examples supply explicit model defaults through Showcase, keep ordinary examples side by side, reserve the wide layout for inline calendars, and keep numeric props numeric. Tests use `tests/fixtures/DatePickers.vue`, role locators, a running clock initialized to a fixed date, exact model assertions, ARIA snapshots, and runtime-error checks. Playwright serves the fixture through its own Vite server on port 5174; it is excluded from the docs build. Tests no longer use `networkidle` or fixme markers. A fully frozen `Date.now()` breaks Vue's bubbling-event timestamp guard; keep the test clock running.

Validation: 37 tests pass in Chromium. The library and docs production builds pass, including SSR rendering without the previous observer error. Targeted ESLint has no errors; its camelCase-attribute warnings conflict with the project conventions. Firefox also passes all 37 tests. Its installer stalled after downloading the archive; the verified archive was extracted to `/tmp/buntpapier-date-firefox`, and the suite ran with `PLAYWRIGHT_BROWSERS_PATH=/tmp/buntpapier-date-firefox`.

Remaining work belongs to later phases: shared translated strings, locale-aware segment order and display, two editable range inputs, the mobile modal, axe integration, and recorded NVDA/Firefox and VoiceOver/Safari checks. WebKit still needs the CI environment described below. This pass does not establish accessibility conformance.

## Original Phase 0 handoff

Status: written 2026-09-16 at the end of the Phase 0 session, against the working tree on top of `3efdbaf` (alpha.18). Scope of the follow-up session: `bunt-date-picker`, `bunt-date-range-picker`, `CalendarMonth.vue`, their two Playwright suites, their two docs pages and the `Showcase` harness where it breaks them. Everything below was observed in this session, either by running the suites or from screenshots and aria snapshots of the docs pages in Chromium.

## What Phase 0 already changed

Tests (`tests/date-picker.spec.ts`, `tests/date-range-picker.spec.ts`):

- All `td`, `th` and `table[role=grid]` selectors became role-based (`[role="gridcell"] button`, `getByRole('grid')`, `getByRole('columnheader', { name: 'Week' })`). The calendar has been a `div` grid with ARIA roles since `f87869d`; the tests predate that.
- The date-picker value assertion now expects the canonical ISO string (`YYYY-MM-DD`). Provisional decision, see the table below.
- The "day cells have aria-label" test asserts the gridcell's accessible name instead of the attribute. The label sits on the button inside the cell, and the name computes correctly either way.
- Four date-picker tests are `test.fixme` with the blocker in a comment above each: clearable, keyboard navigation, inline mode, week numbers. The keyboard test also gained the assertions it was missing (focus must land inside the dialog, value must change). The old version passed vacuously: Tab left the component, the popover closed, Enter hit the docs page.

Components:

- `date-picker.vue`: `@click="openPopover"` moved from the root to `.label-input-container`. The popover is a child of the root, so every click on a day bubbled up and reopened the popover it had just closed. This is why "clicking a day closes dialog" failed.
- `date-range-picker.vue`: Escape is now handled on the popover element too, not only on the input, and hands focus back to the input. The four copies of the anchor/hover/selecting reset became `cancelSelection()`.
- The old `func-call-spacing` false positive is fixed in `.eslintrc.cjs`, so `disabledDates?: (d) => ...` may have a space again.

Result on Chromium: 15 passed, 4 fixme, 0 failed across the two date suites. Firefox and WebKit results are in the Phase 0 summary; anything date-picker-specific from those runs is appended at the bottom of this file.

## Per-assertion decisions

| test | what it assumed | what the component does | decision |
|---|---|---|---|
| day cells `td`, grid `table` | table markup | `div` grid with `role=grid/row/gridcell/columnheader` | markup is intentional, tests follow (done) |
| value matches `dd. MM. yyyy` | `formatDMY` display per `datepicker-plan.md` | canonical ISO; `segmented-date-input.ts` is built on the ISO layout and says locale reordering is a later enhancement | **provisional: ISO.** Revisit together with `formatValue` below. If locale display returns, the segment parser has to become locale-aware first |
| clearable, second picker on the page | docs page with several showcases | `clearable` declared, no clear button in the template, `handleClear` dead; docs page has one showcase | fixme. Implement (the range picker has the pattern) or drop the prop from props and docs |
| Tab reaches the grid, arrows move, Enter selects | roving tabindex per `datepicker-plan.md` | every control in the popover is `tabindex=-1`; `autoFocus` never passed to `CalendarMonth`; `handleOutsideFocus` closes the popover as soon as Tab leaves | fixme. Needs the keyboard model decided (below) |
| inline picker exists | `inline` branch | declared, template has none (range picker has one) | fixme. Implement or drop |
| week numbers, sixth picker | docs section | section commented out | fixme until the docs page is restored; the assertion itself is fine |
| gridcell has `aria-label` | label on the cell | label and `aria-selected` on the button inside | assert accessible name (done). Where `aria-selected` belongs is part of the grid-pattern decision |
| Escape closes the range popover after a day click | Escape handled on the dialog | was input-only | fixed in the component |

## Defects and oddities found beyond the suites

1. **Focusing the input commits today.** `handleInputFocus` emits today when there is no value. On the docs page a click on the empty field immediately shows `2026-09-16` with the day segment selected. The "Escape does not change the value" test only passes because today was committed before Escape. Decide whether an empty picker may stay empty while focused.
2. **The calendar is mouse-only.** Every button in the popover has `tabindex=-1`, including prev/next and presets; Tab leaves the component and `handleOutsideFocus` closes the popover.
3. **Escape inside the date-picker popover does nothing** once focus sits on a day button after a mouse click. Left alone here because focus return interacts with item 1; fix together with the keyboard model.
4. **Range picker inline mode throws on mount.** `Cannot read properties of null (reading 'getBoundingClientRect')` from `useInputOutline`/`updateOutline`; the inline branch has no `.label-input-container` and no `Outline`. Shows up as "Unhandled error during execution of mounted hook" on the docs page.
5. **Range picker input layout.** On the docs page the calendar icon wraps under the input. The range picker puts the `bunt-input` classes on `.label-input-container` and keeps the root as `inline-flex column`; the date picker puts them on the root. Pick one structure for both.
6. **Docs `Showcase` passes `''` as the model** (`value = $ref('')`). Both pickers log prop type warnings, and `getBasisDate()` already carries a workaround comment for it. The harness needs a per-component initial value (`null`, `{ start: null, end: null }`).
7. **Showcase pane too narrow for pickers.** The date-picker input is clipped on the left ("ick a date"), the inline range picker overlaps the auto/light/dark surface buttons and squeezes the template pane. Editable `monthsToShow` is a text input, so an edit turns the prop into a string and `v-for="i in monthsToShow"` would iterate characters.
8. **Docs content.** Date-picker sections for min/max, disabled weekends, presets, week numbers and inline are commented out. `formatValue` is listed in the API table but was removed from the component; `parseInput` still accepts the dotted format the display no longer uses.
9. **Two live regions say the same thing.** The visible `.month-label` and `CalendarMonth`'s `.sr-only` label both carry `aria-live` and both read "September 2026". `id="dp-month-label"` is static and `gridLabelId` is keyed by month only, so two pickers on one page collide.
10. **SSR noise.** `npm run build:docs` logs `ReferenceError: ResizeObserver is not defined` during page rendering and still exits 0. Likely `v-resize-observer` or `useInputOutline` running in `setup` on the docs pages. Not date-picker-only, but this is where it surfaced.
11. **Strings are hardcoded English** (weekday headers, "Choose date", "Previous month", presets). Wait for the Phase 2 strings mechanism rather than solving it locally.

## Suggested order for the session

1. Decide the three open questions first, they shape everything else: display format and `formatValue`; focus-commits-today; keyboard model (initial focus on open, roving tabindex in the grid, Tab order across nav/grid/presets, Escape and focus return on close, where `aria-selected` lives).
2. Fix the range picker inline crash and unify the input structure of both pickers.
3. Implement or remove `inline` and `clearable` on the date picker so props, docs and template agree.
4. Fix the `Showcase` harness (initial model per component, wide-pane variant, numeric prop inputs), then restore the commented-out docs sections.
5. Un-fixme the four tests, then move both suites toward the shared testing requirements: role-based locators, `toMatchAriaSnapshot()` per state, one keyboard test per keyboard-table row. Consider dedicated fixture pages instead of `nth()` on docs showcases.
6. Ids and live regions from item 9.

## Firefox and WebKit notes

Firefox 148 (Playwright build 1511): both date suites pass with the same four fixme markers, nothing Firefox-specific. One run hit a `waitForLoadState('networkidle')` timeout in the range picker's `beforeEach`; the rerun passed. The docs pages load the GitHub icon from `api.iconify.design`, which the sandbox blocks, so `networkidle` depends on a third-party request. All five suites use that wait (15 call sites); waiting for the component root instead would remove the flake source.

WebKit could not run locally: the Playwright build links against Ubuntu libraries (`libicudata.so.74`) that Arch does not ship, and installing them needs root. WebKit results come from the CI matrix.

## Continuation

The 2026-09-17 results above supersede the original defect list. No new picker work is selected. Phase 0 still requires the full three-engine CI result, and later accessibility acceptance still requires the named manual checks. Current behavior and rationale are preserved in [the interaction record](../../../design/date-picker-interaction.md); implementation and regression scenarios live in the source and tests linked by the parent quest.
