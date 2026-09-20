---
status: waiting
parent: ../spec.md
activity: verify
next: verify the full CI matrix and arrange the remaining manual accessibility evidence when selected
waiting_on: scope-selection-and-external-browser-evidence
profile: current owner-selected Codex session; model and effort not exposed
review_base: /tmp/buntpapier-beta-reconcile-a8134sa_/before with hashes in /tmp/buntpapier-beta-reconcile-a8134sa_/manifest.json for the 2026-09-19 consolidation
---
# Date-picker ground truth

## Delivered outcome

The 2026-09-17 follow-up repaired the single-date and range-picker baseline. The [durable interaction record](../../../design/date-picker-interaction.md) now owns current behavior and rationale. Source and regression scenarios remain authoritative for implementation detail.

The single picker keeps `YYYY-MM-DD` as its committed display. It accepts ISO and dotted day-month-year input by default and retains the `parseInput` override. Focus and opening leave an empty model empty. Pointer opening keeps input focus; Alt+Down enters the calendar; bare Up and Down edit the active segment. Tab follows the input, optional clear action, month navigation, one remembered day per visible month and presets. Leaving closes the popup. Escape discards an input draft, cancels an uncommitted range and returns focus from the calendar.

`CalendarPanel.vue` owns navigation and focus movement for both pickers. `CalendarMonth.vue` gives each grid a unique label, exposes selection on gridcells and leaves unavailable dates focusable for inspection without allowing selection. One live region announces the visible month range; a separate range status announces the first endpoint. Both pickers support popup and inline rendering, clear actions, presets, bounded navigation and adjacent-month selection.

The popovers call `showPopover()` without a `source` option. Firefox 148 repeated the popup in its Tab sequence when the input was passed as the source, so entry and return remain explicit. A running fixed-date test clock is also intentional: freezing `Date.now()` breaks Vue's bubbling-event timestamp guard.

## Review boundary and evidence

The implementation follow-up began from commit `3efdbaf` (`3.0.0-alpha.18`) after Phase 0 found stale table selectors, docs examples and four ineffective or blocked tests. It covered both picker components, `CalendarMonth.vue`, the eventual shared `CalendarPanel.vue`, the two Playwright suites, their fixture, component references and the Showcase cases needed to exercise them.

The repaired suites use role locators, exact model assertions, ARIA snapshots and runtime-error checks against `tests/fixtures/DatePickers.vue`. Playwright serves the fixture through its Vite server on port 5174 and excludes it from the docs build. The docs examples provide explicit model defaults, keep numeric props numeric and reserve the wide layout for inline calendars.

Recorded verification from 2026-09-17:

- All 37 date-picker cases passed in Chromium and Firefox.
- The library and docs production builds passed, including SSR rendering without the earlier observer error.
- Targeted ESLint had no errors; its camel-case attribute warnings conflict with project template conventions.
- Firefox used the verified Playwright archive extracted under `/tmp/buntpapier-date-firefox` after its installer stalled.

WebKit could not run in the local Arch environment because the Playwright build requires Ubuntu libraries such as `libicudata.so.74`; the CI matrix owns that result. Axe integration and recorded NVDA/Firefox and VoiceOver/Safari checks also remain open. The existing browser results do not establish accessibility conformance.

## Criterion evidence

| criterion | evidence | state |
|---|---|---|
| Empty input, pointer opening, Alt+Down entry, dismissal and focus return preserve the model | `tests/components/date-picker.test.ts` opening, Tab and Escape cases | Chromium and Firefox passed 2026-09-17 |
| Single-date text, segment changes, invalid drafts and clearing preserve committed/draft separation | `tests/components/date-picker.test.ts` segment-editing case and exact fixture model output | Chromium and Firefox passed 2026-09-17 |
| Calendar movement and selection work by keyboard across month and year boundaries | Both picker suites' Arrow, Home/End, Page and Shift+Page cases | Chromium and Firefox passed 2026-09-17 |
| Range selection orders endpoints, previews selection and cancels unfinished work | `tests/components/date-range-picker.test.ts` pointer, keyboard and cancellation cases | Chromium and Firefox passed 2026-09-17 |
| A disabled date cannot be committed as a single value or range endpoint | Single-picker restriction case plus source guards in both day-selection handlers | Single-date case passed in Chromium and Firefox; dedicated range-endpoint boundary case remains open |
| Presets reject a disabled single value or disabled range endpoint | Source guards in both preset handlers | Valid preset activation is covered; disabled-preset rejection needs a dedicated regression case |
| Popup and inline renderings support clearing, multiple months, week numbers and adjacent-month dates | Both suites' inline, clear, Tab and adjacent-month cases | Chromium and Firefox passed 2026-09-17 |
| Grid names, selected cells, current date, unique IDs and range status expose the intended ARIA state | ARIA snapshots and role assertions in both suites | Automated evidence passed; manual AT evidence open |
| Docs examples and SSR mount without picker runtime errors | Docs runtime-error cases plus production builds | Passed 2026-09-17 |
| Valid paste, custom `parseInput`, built-in preset calculations, multiple locales, non-navigating outside-day selection and disabled reasons keep their documented behavior | Current source and the retired plan's verification cases | Dedicated regression evidence open |
| Supported browser matrix and manual accessibility checks | CI WebKit, axe, NVDA/Firefox and VoiceOver/Safari results | Waiting on selection and external evidence |

Source verification during the 2026-09-19 consolidation found two limits that the passing suite does not settle. A valid but disallowed single-date draft is refused on commit but is not marked invalid while editing. Range selection and presets validate endpoints only, so a range can enclose a date rejected by `disabledDates`; the desired interior-date policy is undecided. Escape, outside focus, outside pointer dismissal and native popup closure all cancel the provisional endpoint and leave the committed range unchanged; the existing cancellation test covers Escape and focus leaving.

## Remaining product work

Locale-sensitive segment order and display, editable range inputs and responsive/mobile presentation now belong to the planned [date-input work](date-inputs.md). That work owns beta-versus-later scope, draft and focus scenarios and integration with configuration, field wiring, forms and overlays. It is not selected for product execution.

Shared translated strings, target-size and announcement infrastructure remain dependencies of the corresponding beta subquests. Field and form wiring, presentation observation and the full overlay transition contract remain deferred or planned in their owning records. This work does not pre-empt them.

## Retired root-plan reconciliation

The 2026-09-19 consolidation started from the captured `datepicker-plan.md` whose SHA-256 is `db12e2cf48ec9510c8398bdfdc6a177672035f84a393be5a1c7ad9549780507f`; the before-state copy and manifest are under `/tmp/buntpapier-beta-reconcile-a8134sa_/`. The source plan was deleted after each substantive section was assigned a current home:

| root-plan material | disposition |
|---|---|
| Component overview, Temporal package and timezone-free value rationale | Current contract in the interaction record |
| Temporal helpers, grid generation, date comparisons and locale week start | Current source; durable calendar invariants summarized in the interaction record |
| Dialog, grid, keyboard, live-region and navigation accessibility requirements | Current non-modal focus and grid contract plus criterion evidence; obsolete focus trapping discarded |
| `CalendarMonth`, shared props, date limits and outside-month behavior | Current shared-calendar contract and source; accepted future prop/CSS boundary remains in API design |
| Single-date selection, parsing, drafts and segmented input | Current input contract; locale-sensitive continuation owned by date-input work |
| Range selection, formatting and popup behavior | Current readonly/two-click contract; editable endpoints owned by date-input work |
| Built-in preset calculations | Current compatibility behavior in the interaction record and `temporal.ts` |
| Nice-to-have Today action, future picker variants and customization ideas | Preserved in the single backlog under further date-picker candidates |
| Known next-button and CSS defects | Already resolved in the current implementation; not carried forward |
| Verification list | Current scenario groups and criterion-evidence table in the interaction and work records |

The old focus trap, focus-commits-today behavior, bare-Down opening, `formatValue` API, fixed dotted single-date display and presentation props as the intended future API are not retained. They conflict with delivered or accepted behavior. The candidate full-screen mobile layout remains only an unresolved scenario in date-input work.

## Backlog handoff

The later date-picker candidates are preserved in [TODOs](../../../TODOs.md#further-date-picker-candidates). They are outside date-input acceptance and have no execution authority. The ground-truth record keeps only this pointer.
