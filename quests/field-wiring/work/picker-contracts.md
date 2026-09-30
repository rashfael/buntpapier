---
status: waiting
parent: ../spec.md
activity: verify
next: after the owner authorizes a commit and push, read the WebKit CI job for the picker cases; then present for final acceptance
waiting_on: owner decision on committing and pushing the uncommitted delta to v3 for WebKit CI; owner decision on moving declaration evidence to packaging acceptance; owner's final acceptance after the 2026-09-23 tentative acceptance
profile: Claude Code Opus 5 (1M context) carrying the execution loop; independent review delegated to a fresh agent
review_base: 53d5bb5 test: make tooltip animation checks deterministic
---

# Picker contracts

Applications can name, describe, focus and observe both date pickers in their existing popup and embedded presentations. Readonly permits inspection without value changes; disabled retains one explanation target and blocks operation. Clearing follows the inherited, live CSS policy.

## Authority and boundary

Parent: [existing input contracts](../spec.md). On 2026-09-21 the owner requested “then define the checkbox and picker packages”, which authorized this definition. Later the same day the owner said “execute picker-contracts.md but recheck the tooltip contract, which has changed”. That selects this package for execution and directs the [tooltip reconciliation](#superseded-tooltip-scope-2026-09-21) below. Implementation, verification and applicable review are authorized; outcome acceptance remains the owner's separate decision. Inherit the accepted [routing](../../../design/input-routing.md), [content](../../../design/api-guide.md#input-content), [readonly/clearing](../../../design/api-guide.md#readonly-and-clearing) and [picker interaction](../../../design/date-picker-interaction.md) contracts.

The single-date and range controls share one package because they share calendar internals, focus policy and the clear-token migration. Each must pass in both stable presentations. Preserve `Temporal.PlainDate | null`, nullable range endpoints, current calendar selection and limits, preset behavior, segment editing, Alt+Down entry and the non-trapping popup. Preserve the current Material v2 floating label in popup mode.

[Date-input work](../../beta/work/date-inputs.md) owns locale-sensitive editing and editable range endpoints. [Overlays](../../overlay-lifecycle/spec.md) owns broader lifecycle migration and presentation policy. This package keeps the current presentation API, including `inline`; it does not define switching popup/embedded after mount, a new modality API or locale parsing. It adds no form adapter, external error API, native serialization/reset, new clear actions on other controls or floating-label slots.

Manual screen-reader observations follow the [shared setup deferral](../../beta/work/release.md#people-and-external-evidence). Keep the scenarios ready and mark their results deferred while other verification proceeds.

## Starting point

Source inspected on 2026-09-21: both pickers expose `disabled` and `clearable=false`, but no whole-control readonly prop, hint surface or public focus operation. Popup entries use native disabled. The single-date control owns segmented input and draft parsing; the range display textbox is always readonly while its calendar remains editable. `CalendarPanel` exposes internal `focusDay()` but no public all-days-unavailable fallback. Existing clearing checks disabled state and closes popup mode; range clearing cancels unfinished selection. The current style bridge reads shape/size without guaranteeing arbitrary ancestor CSS updates. This inspection is not browser evidence.

## Superseded tooltip scope, 2026-09-21

This package was defined at 16:10 on 2026-09-21. The owner's [tooltip ownership decision](../spec.md#accepted-tooltip-ownership-2026-09-21) landed afterwards and moved shared behavior into `useTooltip`, removed input/select tooltip integration and the `data-bunt-entry` marker, and rejected wrapper-to-control registration. The owner's reason was that these fields “already have label, placeholder, and hint”. Both pickers gain `label` and `hint` in this package, so the same reason applies to them; the owner's execution request explicitly asked for this recheck.

The original requirement to extend direct tooltip integration to the popup entry or embedded group is therefore withdrawn, and P7 now verifies its absence instead. This removes work rather than adding it, and leaves the focusable-disabled contract intact: hints and caller descriptions carry the explanation for an unavailable control. `v-tooltip` on a picker root is not a supported field integration contract. Day-button disabled reasons in `CalendarMonth.vue` are unaffected: the directive attaches to the day element itself, which the composable design still supports.

## Mechanism probes, 2026-09-21

Both bounded implementation questions the package left open were probed before selecting a mechanism, using Playwright against Chromium 153.0.8010.12 and Firefox 155.0 on isolated static pages under `$TMPDIR/picker-probe`. These probe browser behavior, not the components.

| Question | Observation | Selected mechanism |
|---|---|---|
| Can CSS alone satisfy live clear visibility? | `@container style(--input-clear: none)` hid the action in both engines, matched an ancestor declaration and an ancestor class change, and left unset, `auto` and an unsupported value visible. A component-root default would shadow inheritance, so the fallback chain must not declare the property. | Pure CSS visibility through a style query; no JavaScript read, no `--bunt-will-change` opt-in. |
| What happens to focus when the action is hidden by CSS? | Chromium kept `document.activeElement` on the `display: none` button and fired no `blur` or `focusout`; Firefox moved focus to `body` and fired both with a null `relatedTarget`. Both engines reported `getClientRects().length === 0`, and focusing the entry from a `requestAnimationFrame` callback repaired focus in both. | Extend the existing bounded `useFieldFocus` reconcile loop, which already runs per frame only while the control holds focus, to repair focus away from an unavailable element inside the control. |

Chromium's retained `activeElement` on a hidden button makes focus repair a required behavior rather than a refinement: without it, keyboard focus is stranded on an invisible control.

## Scope and behavior

### Routing, content and focus

Use one stable caller/generated id on the native popup entry or embedded calendar group, never a duplicate on the root or day. Root styling/context attributes apply to the whole control. Route applicable native entry attributes and listeners once; embedded naming/descriptions go on its calendar group and native listeners on the calendar container, preserving the actual event target. Embedded text-entry attributes have no effect and no hidden serialization fields are introduced.

Text-only `label` names the popup entry and appears as the embedded calendar group's caption. Add `hint` and `#hint`, with the slot replacing guidance text and updating when inserted or removed. Merge hint, existing keyboard help and caller description ids. Preserve existing parse feedback and its accessible state; adding hints must not mask it. Respect caller naming precedence and keep normal/compact presentation aligned with the accepted content contract without claiming to solve compact feedback.

Expose `focus(options?: FocusOptions): void` and whole-component focus/blur notifications covering entry, actions and owned popup. Focus alone must not open a popup. Enabled embedded focus targets the current keyboard entry day, with a focusable named-group fallback when no day can receive focus. Embedded `tabindex=-1` removes its normal day/group Tab entry while keeping programmatic focus and calendar keyboard navigation available; it must not assign a tab stop to every day. Disabled embedded mode has only its named group as a focus target. Preserve outside focus during state changes, and never leave focus on a removed clear action or popup. Hidden/inert mounted controls produce boundary departure; unmount cleanup remains silent.

Neither picker gets a tooltip prop or control-level tooltip integration, following the [superseded tooltip scope](#superseded-tooltip-scope-2026-09-21). Explanations reach the entry or embedded group through `hint`, `#hint` and caller descriptions, including while disabled. Internal wiring adds no DOM entry marker and searches no descendants to discover a control. Day buttons keep their existing `v-tooltip` disabled reasons: those are inline directive consumers on their own elements and must not contribute ids to the control's description.

### Readonly and disabled

Add a whole-control `readonly` prop to both pickers. It permits focus, copying, opening and calendar inspection/navigation, but blocks text edits, segment mutation, date/range commits, presets and clearing. Guard handlers as well as rendered controls so stale actions cannot commit. Application model updates still apply. Keep readonly distinct from disabled; do not disable the calendar navigation needed for inspection.

Disabled popup mode retains the display entry as its one focus target and prevents edits, opening, navigation, presets and clearing. Disabled embedded mode exposes `aria-disabled` on the named group and removes internal controls from the Tab sequence while preventing activation. Enter on disabled entries cannot submit. Caller `tabindex=-1` still permits public focus.

Disabling an open picker closes it without a commit. Move focus from its popup or unavailable action to the entry/group; leave outside focus alone. Preserve single-date text drafts until re-enabled unless an application model update supersedes them; cancel unfinished range selection. Re-enabling does not reopen the popup or emit a model update. Verify parser/blur and segment-buffer paths as well as calendar handlers.

### Clearing

Replace `clearable` with `--input-clear: auto | none`; `auto` is the default, including unset, empty and unsupported values. This changes the old default of `clearable=false`. `auto` exposes the action only for a nonempty editable model; a single date is nonempty when non-null and a range when either endpoint is non-null. A draft alone does not expose it. Readonly/disabled block clearing independently of CSS, and `required` permits temporary emptiness.

Clearing emits exactly one `null` or `{ start: null, end: null }` model update, without synthetic native input/change events. It clears draft/segment buffers or unfinished range selection. Popup mode closes and restores entry focus; embedded mode stays mounted. If a focused clear action disappears due to CSS, state or model changes, move focus to the entry or appropriate embedded day/group before removal, without stealing outside focus.

The token inherits and updates live, including while open. Prefer CSS for visibility where it can satisfy the contract; focus repair may require a bounded shared implementation for these two consumers. Mount-only reads, root theme notifications or a caller-provided `--bunt-will-change: all` do not satisfy it. During implementation, probe direct/ancestor declaration and class changes without polling opt-in before selecting the mechanism. A need to replace the general style observer returns to [its deferred scope](../../style-observer/spec.md); do not silently resume that quest or weaken the live contract.

## Acceptance and evidence

| ID | Observable outcome | Consumer evidence |
|---|---|---|
| P1 | Routing and live naming follow each stable presentation. | Both controls × popup/embedded: root context, caller id/ARIA changes, external popup labels, embedded captions, description merging, native listener identity/modifiers; no fabricated native events for calendar/preset/clear commits. |
| P2 | Text and slotted hints retain feedback associations. | Hint precedence, conditional slot insertion/removal, changed descriptions, existing parse-invalid state, keyboard help, normal/compact presentation and text-only labels. |
| P3 | Public focus and boundary events survive internal movement. | Entry/action/calendar/outside transitions, dismissal, null related target, hidden/inert ancestors, silent unmount, `focus(options)`, caller tabindex and all-days-unavailable fallback; no opening from focus alone. |
| P4 | Readonly permits inspection without changing values. | Text, segment keys, paste/drop/composition, day clicks/keyboard commits, partial range selection, presets and clear; calendar navigation remains usable, application updates still apply. |
| P5 | Disabled has one focus target and blocks all operation. | Both modes, open-popup disable, focused action/group transfer, outside focus, preserved text draft, cancelled range draft, no commit on blur/disable/re-enable, native scripted activation, and novalidate SPA submission from an enabled field. |
| P6 | Clearing obeys inherited live policy and exact model semantics. | Empty/nonempty/partial range/draft-only models, required/readonly/disabled, unset/empty/invalid token fallback, direct and ancestor CSS/class changes while open, focused-action disappearance and one model update with complete draft cleanup. |
| P7 | Explanations reach the focus target without control-level tooltip integration. | Both controls × popup/embedded: no tooltip prop, instance or entry marker on the control; disabled explanation through hint and caller descriptions; day disabled reasons still delivered by the directive without entering the control's description; manual name/state/explanation observations deferred. |
| P8 | Shared changes preserve calendar behavior and public APIs. | Existing picker suites plus source typing, multiple-instance single-app SSR/hydration in both modes, source/published date/range props, hint slots, original Event listeners and focus refs; packaging verifies declarations and packed consumers. |

Use meaningful ARIA states, applicable axe scans and the existing calendar keyboard table. Include visible focus, forced colours and light/dark surfaces for new caption/hint/focus states. Retain manual NVDA/Firefox and VoiceOver/Safari scenarios for names/descriptions, readonly versus disabled, date/range state, popup entry/return, embedded navigation/fallback and clearing announcements under the shared deferral.

## Verification, 2026-09-21

Execution started from `4fc44fd`, where `src/` and `tests/` were clean and the uncommitted changes were documentation and quest prose only. A concurrent session was working in the same tree: it changed `tests/components/tooltip-contracts.test.ts` at 19:54 and committed that work as `53d5bb5 test: make tooltip animation checks deterministic` at 20:19, which is now the baseline. `git diff 53d5bb5 -- src tests` is exactly this package's delta: nine modified files plus `picker-contracts.test.ts`, `PickerContracts.vue` and `SsrPickers.vue` untracked.

That suite is not this package's to fix and it does not pass. `tooltip-contracts.test.ts:38` fails in both engines here, and it also fails in an isolated worktree checked out at `53d5bb5` with none of this package's changes present, alongside three more of its cases. The tooltip source files are untouched by this delta.

| ID | Evidence |
|---|---|
| P1 | `picker-contracts.test.ts` “routes attributes to the control of each presentation and keeps one id” and “forwards native listeners once and commits emit no native input or change”: entry `name`/`maxlength`/`autocomplete`, root `lang`/`dir`/`class`, single id per control, no id on the root or a day, changed bindings, naming precedence, one click per listener and no native `input`/`change` from day, preset or clear commits. |
| P2 | “text and slotted hints merge with keyboard help and preserve parse feedback”: caller description, hint text, keyboard help, slot insertion and removal, embedded group description, `aria-invalid` retained with the hint still associated. |
| P3 | “public focus reaches each presentation without opening…”, “caller tabindex moves the embedded tab stop…”, “a caller tabindex leaves the popup textbox reachable…”, “hidden and inert ancestors end the boundary and unmounting stays silent”. Focus alone never opens; internal movement emits no extra pair; embedded focus lands on the keyboard entry day; the disabled embedded group is the only target. |
| P4 | “readonly permits inspection but blocks every value change”: typing, segment arrows, day click, preset, clear and partial range commit all blocked; month navigation and opening still work; `aria-readonly` on the grid; application model updates still apply. |
| P5 | “disabled keeps one focus target…”, “disabling an open picker closes it without committing and returns focus”, “state changes that remove a focused clear action never steal focus from outside”. Draft preserved across disable and re-enable, no model update, Enter blocked from the disabled entry while an enabled field in the same `novalidate` form still submits. |
| P6 | “clearing follows the live token…”, “a focused clear action that CSS hides hands focus back to the textbox”, “embedded clearing stays mounted and moves focus into the calendar”. Ancestor class, ancestor declaration and direct declaration suppress while open; unsupported and empty values fall back to `auto`; readonly and disabled remove the action regardless of CSS; one model update with the draft discarded. |
| P7 | “pickers carry no control-level tooltip while day reasons still explain themselves”: no `data-bunt-entry`, no tooltip element at rest, the explanation comes from the hint, and a disabled day's reason appears without entering the control's description. |
| P8 | Existing `date-picker.test.ts` and `date-range-picker.test.ts` unchanged and passing; “server rendered pickers keep their ids through hydration” over `/ssr-pickers?ssr` in both presentations; `el` and `focus()` exposure asserted; accessibility scan, ARIA snapshot, light/dark and forced-colours cases for the new caption, hint and group focus states. |

Runs on the reviewed and fixed state, Chromium 153.0.8010.12 and Firefox 155.0: the full component suite passed **246/248**, the two failures being the concurrent session's tooltip cases described above. The picker package alone passed **46/46** across both engines. Documentation smoke passed **6/6** on Chromium. `npm run lint` reports 0 errors and 11 warnings, identical to a baseline worktree. `npm run build` succeeds and `git diff --check` is clean. `npm run typecheck` reports 12 pre-existing errors, down from 15 at `4fc44fd`; none are in the picker files, and the three that went away came from typing the routed accessible-name attributes.

An earlier whole-suite run showed six extra failures scattered across unrelated suites, all `browserContext.close: ENOENT` on `test-results/.playwright-artifacts-*`. They came from a concurrent Playwright run clearing that directory, and none reproduced with `--output` pointed at a private directory.

WebKit cannot run on this host and its evidence still depends on CI. Two parts of this delivery are engine-sensitive and have no WebKit evidence at all: the `@container style()` clear policy, which needs Safari 18 or later, and the focus repair, whose trigger differs between Chromium and Firefox already. Treat the first CI run as the gate for both. Manual NVDA/Firefox and VoiceOver/Safari observations stay deferred under the [shared setup deferral](../../beta/work/release.md#people-and-external-evidence). Published declaration and packed-consumer checks remain with [packaging](../../packaging/spec.md).

### Independent review, 2026-09-21

A fresh Claude Code agent (Fable; effort not exposed by the runtime) reviewed the working tree against this package, the inherited contracts and the project conventions, with the boundary above. It reran the gates itself and built its own browser probes.

| Finding | Disposition |
|---|---|
| The popup pickers took focus back after an outside click onto a non-focusable area, and emitted no `blur`. Reproduced in both engines and shown absent at the baseline. | Fixed. `repairFocus` now repairs only when the stranded element's container is still rendered. A suppressed or unmounted action leaves its surroundings in place; an outside click that closes the popup takes the whole popover with it, so focus stays where the user put it. New case “an outside click that closes the popup leaves focus outside and reports the departure” covers both controls. |
| The group focus-ring assertion read `outlineWidth`, which reports the initial `medium` whatever the style, and the pointer route it used draws no ring at all. | Fixed. A separate case reaches the group with Shift+Tab and asserts `:focus-visible` plus both `outline-style` and `outline-width`. Programmatic focus after a pointer activation legitimately shows no ring: that is the engine's `:focus-visible` heuristic, not a component defect. |
| P4 named paste, drop and composition but no case exercised them. | Fixed. Parameterised readonly/disabled case mirrors the input/select one, including the late-composition path. |
| P6 asserted final values, so a double model update would have passed. | Fixed. The fixture counts single-date updates and clearing asserts exactly one. |
| The fixture's “direct” suppression case declared the token on a shared wrapper, not on the picker. | Fixed. It now routes `--input-clear` through the picker's own `style` attribute, so the direct and ancestor cases are genuinely different. |
| The embedded clear action had no token-suppression case. | Fixed inside the clearing case. |
| The ARIA snapshot covered almost nothing. | Fixed. It now includes both navigation buttons, the grid and a disabled selected day, and the editable embedded calendar's `aria-readonly` placement is asserted. |
| Two docs paragraphs were narrative rather than mechanical, and the paired pages placed the clear section differently. | Fixed. Both reduced to API statements and the sections aligned. The pages' existing narrative stays owner-authored. |
| Embedded mode renders caller text-entry attributes such as `name` onto the calendar group div. | Not changed. The routing contract requires only that they have no effect, which holds; filtering them would add a list of native attribute names to maintain. Recorded here rather than fixed. |
| `eslint.config.mjs` declares the type-only `FocusOptions` as a runtime global. | Kept. It is a workaround for `no-undef` running over TypeScript sources; the alternative is annotating three components with `Parameters<HTMLElement['focus']>[0]`. |
| Enter differs between the pickers: the single-date control consumes it unconditionally to commit a draft, so an enabled one never submits, while an enabled range picker does. | Not changed. Both satisfy the contract, which only forbids submission from a disabled entry, and the single-date behaviour predates this package. Named here because it is undocumented. |
| P6's “`required` permits temporary emptiness” is vacuous: neither picker has a `required` prop. | Not actionable in this package. |

Two tests were passing for the wrong reason and were corrected with the fix. “Disabling an open picker” previously relied on the defective repair, because clicking any control outside an open picker dismisses it before the disable lands; it now drives the disable from an application event, which is the only way a picker meets that state while open. The clear-action case relied on repair after unmount, which the recorded parent restores.

The reviewer confirmed clean: P1 routing and naming precedence, the completeness of every readonly and disabled guard, the disabled-while-open focus transfer leaving outside focus alone, the CSS token mechanism including specificity and the absent default declaration, SSR safety, the absence of input/select regressions, project conventions, and that the axe exception matches exactly the two `.today` nodes it names. It could not confirm WebKit behaviour, manual assistive-technology behaviour, packaging declarations, or whether a select dropdown with focusable slotted content could strand focus.

### Second independent review, 2026-09-21

Two sessions executed this package in parallel without knowing about each other, and both wrote to the same files. The verification and first review above came from one of them. This section records the other's independent review, run in fresh context by a Claude Code agent (Opus 5) against the merged working tree after that delivery, and the fixes it produced. The two implementations had converged; what is on disk is the merged state described here.

| Finding | Disposition |
|---|---|
| `npm run build:docs` failed with two dead links: both picker pages linked `../../design/input-routing.md`, which resolves outside the VitePress srcDir. That is a CI step, and `test:docs` cannot catch it because the dev server does not check links. Reproduced. | Fixed. The link is gone and the routing sentence stays. `AGENTS.md` keeps `design/` out of public pages in any case. |
| A caller `tabindex` suppressed the roving day tab stop of a *popup* calendar, so Tab from the entry skipped the open grid entirely. Reproduced. The routing contract scopes that clause to embedded calendars, where the days are the entry's own tab stop; a dialog's internal stop is the component's. | Fixed. `tabbableDays` applies only when `inline`. New case “a caller tabindex leaves a popup calendar its own tab stop”. |
| The container guard that repaired the outside-click focus steal dropped focus to `<body>` when an embedded clear action was removed together with its `.presets` container, which is what happens whenever the picker has no `presets` prop. Reproduced in both engines. Both fixture cases behind the existing assertion carry presets, so the suite missed it. | Fixed. `repairFocus` walks the ancestors recorded while the element held focus and asks whether the nearest one still in the document is rendered. A removed element keeps its detached parent, so testing the live parent alone was not enough. New case “a focused clear action removed together with its container still hands focus back”. |
| `handleInputBlur` discarded an in-progress segment buffer before reaching the `locked` guard, so disabling the picker mid-typing and then tabbing away lost the draft, against P5. | Fixed with an early return while locked. |
| `focusDay`'s fallback to “any non-disabled day” could land on an adjacent-month padding day, and could not serve its stated purpose anyway: per-day unavailability uses `aria-disabled`, so `:not(:disabled)` only filters when the whole calendar is disabled. | Removed. The picker's own named-group fallback already satisfies the contract, and `navigate()`/`selectDay()` get their strict behaviour back. |

Runs after these fixes, Chromium 153.0.8010.12 and Firefox 155.0 at one worker: the full component suite passed **250/252**. Both failures are `tooltip-contracts.test.ts:38`, whose source and spec this delta does not touch — `git diff 53d5bb5` over the tooltip files is empty — and which belongs to the concurrent session's work. Documentation smoke passed 6/6 and `npm run build:docs` now succeeds, which it did not before. `npm run build` succeeds, `npm run lint` reports 0 errors and 11 warnings exactly as at baseline, `npm run typecheck` reports 12 pre-existing errors against 15 at `4fc44fd` with none in the picker files, and `git diff --check` is clean.

### Consolidation and the resting focus state, 2026-09-21

The owner selected the consolidation the second review left open, and separately reported that every picker in the documentation rendered as if focused: floating label raised, 2px accent outline.

Both had the same root. `useFieldFocus` returns `focused` as a ref. Input and select read it only in their templates, where Vue unwraps setup refs, so it worked there. The pickers destructured it in `<script>` and read it inside a `$computed` for their class list, where a bare ref is simply an object and therefore always truthy. The documentation showed it because nothing there ever moves focus into a picker, so the resting state was the only state visible. The fixture suites missed it because every focus case asserts the focused state, and no case asserted the resting one.

`src/components/date-picker/picker-field.ts` now owns what both pickers shared: routing and the caller bindings for whichever element is showing, description merging, the caller-tabindex rules, focus ownership and repair, the public `focus()`, and the watcher that closes an open picker on disable. Each component keeps what genuinely differs — parsing, range selection, what counts as an empty model, and its own class list. Both destructure it with the reactivity transform's `$()`, which unwraps `focused`, `tabbableDays` and `groupTabindex` into plain values, so the original mistake is no longer expressible. The attribute getters stay functions because `useAttrs` is not reactive and they have to run during rendering.

The word “entry” is gone from this package's code and from the two public picker pages, which now name the elements they mean: the textbox, or the calendar's named group under `inline`. `inline` is the prop, so the prose uses it instead of “embedded”. [The routing contract](../../../design/input-routing.md) still uses “entry” throughout as the term for the element a field is built around; renaming it there affects input, select and checkbox as well and needs an owner decision. The owner [renamed it to “control”](#owner-decisions-2026-09-23) on 2026-09-23.

Runs after the consolidation, Chromium 153.0.8010.12 and Firefox 155.0 at one worker: the full component suite passed 250/252 with the same two out-of-scope tooltip failures, documentation smoke 6/6, `npm run build` and `npm run build:docs` both succeed, `npm run lint` reports 0 errors and 11 warnings, and `npm run typecheck` reports the same 12 pre-existing errors with none in the picker files. The resting state was checked directly against the running documentation in both engines: no picker carries `focused` or `floating-label`, and the outline renders at its resting 1px grey.

### Findings not fixed here

The first axe scan over a calendar surfaced a pre-existing contrast failure: `.day-cell .today` paints the current day in `--clr-primary`, 3.12:1 against the light surface. The rule predates this package and recolouring the today marker is a visual decision the owner owns, so the delivery left it alone, scoped one axe exception to that rule and those targets in `picker-contracts.test.ts`, and recorded `calendar-today-contrast` in `TODOs.md`. Removing the exception is that entry's closing condition.

Two API details changed beyond a literal reading of the package, both following the accepted routing contract. The `name` prop was removed from both pickers and now routes as an ordinary attribute, which renders identically in popup mode and matches input and select. `FocusOptions` was added to the ESLint globals because it is a type-only DOM interface that `no-undef` cannot see in a `.vue` block.

Inline hints have no compact rule. A popup picker's root carries `.bunt-input`, so `input.sass` hides its hint at `--input-size: compact`; an inline calendar does not inherit that. Whether an inline calendar's hint should disappear at compact size is a presentation decision rather than a defect. P2 lists normal and compact presentation as evidence, and no case exercises compact for either picker. The owner [decided on 2026-09-23](#owner-decisions-2026-09-23) that it follows input.

## Owner decisions, 2026-09-23

The owner tentatively accepted this package on 2026-09-23 (“otherwise, tentantive accept for both”, together with input/select). Final acceptance waits on WebKit CI, which matters most for the `@container style()` clear rule and the focus repair, and on packaging declaration evidence. Manual AT stays under the shared deferral. The [parent record](../spec.md#owner-decisions-2026-09-23) holds the full decisions.

The inline calendar's hint now follows input: “yes, inline calendar hint should behave just like input”. `date-picker.sass` hides it under `.bunt-input--size-compact` for both pickers, the same class the style bridge already applies from `--input-size` in either presentation. Like input, it follows the bridge's update timing rather than updating live. New case “compact size hides the hint in both presentations, as it does for input” mounts compact popup, inline single and inline range pickers. It failed on the inline hint before the rule was added and passes in Chromium and Firefox with it.

“Entry” is renamed to “control” in the routing contract, the fixtures and the tests. The fixture ids now end in `-control`, and the popup textbox's locator constant is `textbox`. Test titles that named the entry now name the control or textbox; the evidence quotes above follow them.

Runs on this state, Chromium 153.0.8010.12 and Firefox 155.0 at four workers: the full component suite passed 258/260. Both failures are `tooltip-contracts.test.ts:38`, unchanged and outside this delta. Documentation smoke passed 6/6. `npm run build` and `npm run build:docs` succeed, `npm run lint` reports 0 errors and 11 warnings, `npm run typecheck` reports the same 12 pre-existing errors, and `git diff --check` is clean. No independent review was run for these changes: the rename is mechanical and covered by the suite, and the compact rule is one selector with a failing-first test.

## Resume, 2026-09-23

The owner asked to “execute picker-contracts” while this package was waiting. Neither remaining gate can be met from inside the package without a further owner decision.

WebKit evidence only comes from CI: `.github/workflows/ci.yml` runs the component and docs suites per engine on every push to `v3`. This package's delta is uncommitted, and local `v3` is one commit (`53d5bb5`) ahead of `origin/v3`, so CI has never seen any of it. Getting the evidence means committing and pushing, and that needs the owner's explicit go-ahead. The working tree also holds input/select, documentation and quest changes, and one push would cover the input/select WebKit gate too. The last CI run, at `4fc44fd` on 2026-09-21, passed lint/build, Chromium and Firefox. WebKit failed on exactly one case, `tooltip-contracts.test.ts:46` (“slide and fade animation reverses safely and unmount disposes it”), which predates this package, so picker cases would be distinguishable in the next run. A local WebKit run through the Playwright Docker image is not available: the sandbox denies the Docker socket, and the recorded host limitation still applies.

The package publishes no declarations at all. `package.json` exports only `dist/buntpapier.js`, `dist/buntpapier.umd.cjs` and the stylesheet, has no `types` condition, and `vite build` emits no `.d.ts`. [Packaging](../../packaging/spec.md) is `planned` and waiting on scope selection. Declaration evidence therefore does not exist for any component and cannot be produced by this package. P8 already assigns “declarations and packed consumers” to packaging. The recommendation is to take declaration evidence off this package's final-acceptance gate and keep it in packaging's acceptance, so that WebKit CI is the only remaining gate.

## Execution and dependencies

After execution selection, capture the actual baseline and pre-existing changes, load Vue/Vite conventions and establish the review boundary. First exercise the current picker suites and probe embedded focus fallback and live clear visibility/focus repair. These are bounded implementation questions; any contradiction with the accepted public behavior returns for decision before dependent work continues.

Consolidate routing, focus, description and clearing responsibilities where the existing consumers share them; keep date parsing and range selection with their owners. The current field helper assumes a native input focus target, so embedded group/day support needs an intentional extension rather than a type assertion that conceals a different target. Preserve input/select behavior and run affected shared-helper/tooltip regressions.

Extend dedicated picker consumers under the [testing policy](../../../design/testing.md). Run affected Chromium/Firefox cases, obtain WebKit CI evidence, and run applicable lint, library/docs builds and docs smoke. Obtain independent review, resolve findings and record criterion-to-evidence links against the reviewed state. Source runtime checks do not substitute for source typing or [packaging](../../packaging/spec.md) declarations/packed consumers.

Update evergreen routing/API/picker implementation status and mechanical component references, including the `clearable` migration and new default. Public narrative documentation stays human-authored. This package can proceed without date-editing redesign, general overlay migration or manual screen-reader setup; none of those dependencies permits claiming unverified behavior. Definition complete; implementation, verification and owner acceptance remain outstanding.
