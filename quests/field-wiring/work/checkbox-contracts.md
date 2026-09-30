---
status: waiting
parent: ../spec.md
activity: verify
next: owner reviews the result for acceptance and confirms the disabled-explanation route; WebKit CI and packaging declaration checks remain
waiting_on: owner acceptance; WebKit CI results; packaging declaration evidence
profile: Claude Code, Opus 5.5 (claude-opus-5-5), owner-selected session; reviewer a fresh Opus subagent (effort not exposed)
review_base: 53d5bb5 plus the captured dirty before-state (see Execution, 2026-09-23)
---

# Checkbox contracts

An application can name, focus, describe and observe a checkbox through its public API. A disabled checkbox remains reachable for an explanation and cannot toggle. Label markup has the same naming behavior as label text.

## Authority and boundary

Parent: [existing input contracts](../spec.md). On 2026-09-21 the owner requested “then define the checkbox and picker packages”. This authorizes this definition, ending with a package ready for execution selection. Implementation and outcome acceptance have not been requested. The contracts below inherit the accepted [routing](../../../design/input-routing.md), [content](../../../design/api-guide.md#input-content), [disabled behavior](../../../design/input-routing.md#disabled-controls) and [checkbox readonly removal](../../../design/api-design.md#shared-field-vocabulary).

Manual screen-reader tests follow the owner’s [setup-dependent deferral across all quests](../../beta/work/release.md#people-and-external-evidence). Keep the cases ready and their evidence marked deferred; automated checks and other delivery work continue.

## Starting point

Source inspected on 2026-09-21: `src/components/checkbox.vue` uses a native checkbox inside a label, emits a boolean on change, exposes only the root `el`, and lets undeclared attributes fall through to the root. Native `disabled` removes it from the Tab sequence. The `readonly` prop is bound to a native attribute that does not prevent checkbox activation. Label text wins over the default slot; there is no named label slot. This inspection is not browser evidence.

## Superseded tooltip scope, 2026-09-23

This package was defined on 2026-09-21 before the [tooltip ownership decision](../spec.md#accepted-tooltip-ownership-2026-09-21) landed, and it still required direct `v-tooltip` integration. That decision rejects DOM markers, descendant searches and wrapper-to-control registration. A `v-tooltip` on `bunt-checkbox` attaches to the root label, so describing and focusing the native checkbox would need exactly the discovery the decision rejects. [Picker contracts](picker-contracts.md#superseded-tooltip-scope-2026-09-21) received the same recheck. On 2026-09-23 the status report flagged this record as stale and recommended dropping the requirement; the owner replied “update the stale records first”.

The direct tooltip requirement is withdrawn and B6 now verifies its absence. A disabled checkbox's explanation reaches the checkbox through caller descriptions (`aria-describedby`), which the ownership decision already names as a route. Unlike input, select and the pickers, checkbox has no hint surface: the accepted [content contract](../../../design/api-guide.md#input-content) adds none. Confirm when starting execution that caller descriptions are enough. Adding a checkbox hint would amend the accepted content contract and needs an owner decision.

## Scope and behavior

Keep the boolean model and native checkbox. Route styling/context attributes to the root and native attributes/listeners to the checkbox. Caller ids take precedence over generated ids; naming follows `aria-labelledby`, then `aria-label`, then component label content. Retain the component-owned label association and external `label(for)` support. Read changing caller bindings at render time and merge caller description ids without duplicates.

Add `#label` with precedence over a nonempty `label` prop, then the existing default-slot fallback. Content is inline and noninteractive; the component supplies the label element. Conditional slot insertion/removal updates the rendered label and accessible name. No hint, error or floating-label surface is added.

Expose `focus(options?: FocusOptions): void` and whole-component `focus`/`blur` notifications without payloads. Keep `el` as the root reference. Hidden, inert and unmounted components cannot receive programmatic focus; hiding or making a focused mounted component inert emits one boundary blur, while unmount cleanup is silent.

Replace native disabling of the checkbox with the accepted focusable `aria-disabled` behavior and activation guards. Checked and unchecked disabled checkboxes retain their values through pointer, label, Space and scripted native activation. Disabled Enter cannot submit implicitly. Preserve one visible focus target, respect caller `tabindex=-1`, and allow application model updates. Do not fabricate input/change events; actual native events are delivered once with their original identity and Vue modifiers intact. Enabled activation emits one boolean model update.

Remove the ineffective `readonly` prop and its native binding, as already accepted. Do not replace it with simulated readonly checkbox behavior or an alias to disabled. Mechanical API references must make the removal visible.

Checkbox gets no tooltip prop or component-level tooltip integration, following the [superseded tooltip scope](#superseded-tooltip-scope-2026-09-23). Extend the current shared field helper only where checkbox and existing consumers have the same responsibility. Preserve input/select behavior when doing so.

Out of scope: array/custom-value models, indeterminate state, checkbox groups, validation/form registration, new presentation weights, new icons and shared accessibility infrastructure. [Component delivery](../../beta/work/components.md) continues to own the broader checkbox outcome. This package must preserve its existing styles and provide the visible focus/state behavior required for the changed interaction.

## Acceptance and evidence

| ID | Observable outcome | Consumer evidence |
|---|---|---|
| B1 | Root/control routing and live naming work without duplicate ids or attributes. | Change class/style/context attributes, id, name/form, caller ARIA and descriptions; verify external labels and naming precedence. |
| B2 | Enabled activation preserves native behavior and the boolean model. | Pointer, label and Space activation with original input/change events delivered once, native listener modifiers, internal handlers and application model updates. |
| B3 | Disabled checkboxes remain focusable and cannot toggle or submit. | Checked/unchecked cases through pointer, internal/external label, Space, Enter and native `.click()`; live disable/re-enable while focused; no model update from blocked actions; `novalidate` SPA submission from an enabled field still works. |
| B4 | Public focus and boundary events describe the component once. | `focus({ preventScroll: true })`, Tab and `tabindex=-1`, null related target, hidden/inert ancestors and unmount; visible focus on the visual checkbox. |
| B5 | Named label content wins and stays associated. | Named slot, text prop, default fallback, changing text and conditional slot insertion/removal; no loss of native label activation. |
| B6 | A disabled checkbox's explanation reaches it without component-level tooltip integration. | No tooltip prop, instance or marker on the component; a caller description stays associated through disable, re-enable and binding changes; screen-reader naming/state/explanation observations deferred. |
| B7 | Ids and public APIs work in source and published consumers. | Multiple instances within one Vue application, SSR/hydration, boolean model/native Event listeners, label/default slots and component ref focus; source type checks and packaging-owned declaration/packed-consumer checks. |

Run applicable axe scans, meaningful ARIA state snapshots and keyboard cases on enabled/disabled and checked/unchecked checkboxes. Cover focus and state visibility in forced colours and normal themes. Manual NVDA/Firefox and VoiceOver/Safari cases retain checkbox name, checked state, unavailable state, label activation and explanation discovery as expected observations; automation does not fill those deferred results.

## Execution and dependencies

After execution selection, capture the actual baseline and pre-existing changes, load Vue/Vite conventions and establish a complete review boundary. Reuse `src/utils/field.ts` where applicable; add focused consumer cases under the [testing policy](../../../design/testing.md). Run affected input/select regressions if their shared code changes. Obtain independent implementation review and resolve findings within the authorized package.

Verify Chromium/Firefox locally and WebKit in the supported CI environment. Run applicable lint, library/docs builds and affected docs smoke. Supply source type cases to [packaging](../../packaging/spec.md); a runtime fixture is not type evidence. Update evergreen implementation status and mechanical checkbox API references, preserving human authorship of public narrative documentation.

No consequential product decision remains within this slice. New model forms, indeterminate behavior or a failure of the accepted native focus/activation mapping must return to their owning design scope. Definition complete; implementation, verification and owner acceptance remain outstanding.

## Execution, 2026-09-23

On 2026-09-23 the owner invoked `/quest execute checkbox-contracts` in this session. This authorizes implementation, verification, review and fixes within the package above, ending at a result ready for owner acceptance. The owner did not separately answer the disabled-explanation question under [superseded tooltip scope](#superseded-tooltip-scope-2026-09-23). Execution follows the accepted content contract, which needs no amendment: caller descriptions explain a disabled checkbox and no hint surface is added. Confirmation stays open for acceptance; adding a checkbox hint remains an owner decision.

### Review boundary

`HEAD` was `53d5bb5` with a dirty tree from earlier sessions; `src/components/checkbox.vue` and `src/styles/components/checkbox.sass` were unmodified. The before-state was captured outside the repository without touching the index: `git diff --binary HEAD`, the untracked-file archive and the status list, with fingerprint `6b47095c…0b1da00` over the patch and untracked contents. A throwaway worktree rebuilt from that capture served as the baseline for comparison and was removed after review. Its `git worktree prune` also removed part of the metadata of two stale entries from earlier sessions, `buntpapier-input-astra` and `picker-base`, whose directories were already gone; the rest failed with “Device or resource busy”. The quest delta covers `src/components/checkbox.vue`, `src/styles/components/checkbox.sass`, a type widening in `src/utils/field.ts`, `docs/components/checkbox.md`, `tests/components/checkbox-contracts.test.ts`, `tests/fixtures/CheckboxContracts.vue`, `tests/fixtures/SsrCheckboxes.vue` and checkbox cases added to `tests/fixtures/FieldApiCases.vue`, plus status updates in `design/input-routing.md`, `design/api-guide.md` and `design/testing.md`.

### Implementation

The checkbox now uses `useFieldRouting` and `useFieldFocus` from `src/utils/field.ts`, like input: root receives styling and context attributes, the native checkbox receives id, name, form, ARIA, tabindex and undeclared listeners. `nameAttrs`/`inputAttrs` accept a boolean for whether label content renders, since a slot has no text to pass. The label content is wrapped in `span#<id>-label`, which names the checkbox through `aria-labelledby` unless the caller names it. The box is `aria-hidden`, so the icon font's generated character stays out of the name.

Declared events are `update:modelValue` (boolean), native `input`/`change`, and payload-free `focus`/`blur`. The model updates on `change`, as native checkbox v-model does, and is emitted before `change` is forwarded, so a change listener reads the new value. A caller `aria-checked` is dropped because the model owns checked state. Empty or whitespace-only label content counts as absent, so an external label still names the checkbox; a child component that renders nothing still counts as content. The `name` and `readonly` props are gone; `name` routes as a native attribute, and a passed `readonly` reaches the native checkbox, where it has no effect. Disabled uses `aria-disabled="true"`, a click guard and an Enter keydown guard. If a caller stops the click before the guard runs, `change` reverts the toggle and neither `input` nor `change` is forwarded. The native checkbox now precedes the box so `input:focus-visible + .bunt-checkbox-box` can show the focus ring, and `z-index: 1` keeps its pixel above the box for pointer hits and test-runner `check()`. The root honours `hidden` because `display: flex` would otherwise override it. Under `forced-colors: active` the disabled label, box and glyph use `GrayText`. The empty Stylus style block was removed.

### Verification

Chromium 1243 and Firefox 1543 through Playwright 1.63.0 on the owner's Arch host, against the working tree at the review boundary above. WebKit cannot run locally; its evidence is outstanding in CI.

| ID | Evidence | Result |
|---|---|---|
| B1 | `checkbox-contracts.test.ts` “routes root and control attributes…”, including `title`; “readonly attribute is routed natively…”; “empty label content leaves naming to an external label…” | Pass, both engines |
| B2 | “enabled activation forwards original native events once…”: box, internal label, Space and external label; capture-listener identity, `@click.self` and `@keyup.a` modifiers; the model is current inside `@change` | Pass, both engines |
| B3 | “disabled unchecked/checked checkbox stays focusable…” and “initially disabled checked checkbox…”: box, label, external label, forced input click, Space, Enter, `.click()`, live disable/re-enable while focused, application model update, SPA submit from an enabled field; “a disabled toggle that bypasses the click guard…” | Pass, both engines |
| B4 | “public focus and whole-component boundaries…”; “keyboard focus is visible on the box…”; forced-colours case, including checked versus unchecked glyphs | Pass, both engines |
| B5 | “label slot wins over the prop…”, including live slot removal/insertion and label activation after changes | Pass, both engines |
| B6 | “disabled explanation reaches the checkbox through caller descriptions…”: no tooltip element or `data-bunt*` marker, description kept through disable, re-enable and binding changes | Pass, both engines; screen-reader observations deferred |
| B7 | “source SSR hydrates unique stable checkbox IDs…”; “source API consumer binds the boolean model…” in `FieldApiCases.vue`; `vue-tsc --noEmit` reports no errors in the changed files | Pass, both engines; packaging declaration and packed-consumer checks outstanding |

A temporary probe on 2026-09-23 showed that Enter on an enabled checkbox submits its form in both engines and that the keydown guard stops it, so the B3 Enter assertion is not vacuous. A before/after element screenshot of the Theming fixture's checkbox showed the same box rendering; differences were limited to text anti-aliasing and the icon font's load timing in the baseline shot.

Gates on the final state: `checkbox-contracts.test.ts` has 16 cases, 32 of 32 on both engines and 128 of 128 with `--repeat-each=4`. The full component suite on Chromium and Firefox passed 290 and failed 2. The failures are `tooltip-contracts.test.ts:38`, “slide and fade animation reverses in place during playback”, in both engines. The baseline worktree reproduces them, so they predate this package; they belong to the [tooltip record](tooltip-regressions.md). Docs smoke passed 12 of 12 on both engines. `npm run build` and `npm run build:docs` succeeded. `vue-tsc --noEmit` reports the same 12 errors as the baseline, none in checkbox files. ESLint on the changed files reports one warning, `vue/no-template-shadow` in `FieldApiCases.vue`'s existing select slot, also present before.

Manual NVDA/Firefox and VoiceOver/Safari observations of name, checked and unavailable state, label activation and explanation discovery remain under the [shared deferral](../../beta/work/release.md#people-and-external-evidence).

### Independent review

A fresh Opus subagent reviewed the delta against this spec, the routing contract, the API guide, the testing policy and project conventions, with a patch fingerprint and the baseline worktree. It ran the checkbox suite, affected regressions and docs smoke on Chromium and Firefox, plus its own temporary probes. Its second pass verified the fixes on the final delta.

| Finding | Severity | Disposition |
|---|---|---|
| `change` was forwarded before `update:modelValue`, so `@change="save"` read the old value; the baseline's root fallthrough ran after the model update | Major, reproduced | Fixed: model first; asserted in the fixture |
| A caller stopping the click before the guard let a disabled toggle forward `input`/`change` | Minor, reproduced | Fixed: reverted on `change` without forwarding; new test |
| An empty default slot or whitespace label pointed `aria-labelledby` at an empty span and hid an external label's name | Minor, reproduced | Fixed: empty content counts as absent; new test |
| Evergreen implementation status missing | Minor | Fixed after the first pass; the `api-guide.md` edit was then narrowed to checkbox |
| Evidence gaps: `title`, forced-colours checked state, external-only naming | Minor | Added; scroll behavior of `preventScroll` and inert or stale-ref `focus()` rely on the shared `useFieldFocus` coverage |
| A caller `aria-checked` reached the native checkbox | Nit | Fixed: dropped; asserted |
| One focus-ring failure in Chromium | Unresolved, then explained | The box's existing `transition: all` animates `outline-width` (3px, then 2px, in both engines); the assertions now poll |
| `labelSource()` runs the label slot several times per render | Nit | Deferred; harmless for inline label content |
| A default-slot child component that renders nothing still counts as content | Nit, known limit | Accepted limitation; cannot be known without rendering |

### Findings outside this package

`src/styles/components/checkbox.sass` has no `@layer buntpapier.components` wrapper, so its rules are unlayered and outrank host layers, unlike input and button. Wrapping it changes cascade precedence for consumers, so this package leaves it for [component delivery](../../beta/work/components.md). `design/api-guide.md` still says the date pickers do not yet accept the shared hint input and that picker delivery is pending, which the picker package's record contradicts. `src/components/input.vue` forwards `input` before `update:modelValue`, so an input's `@input` listener reads the previous model value; the checkbox review found the same ordering in checkbox's `change`.

### Acceptance state

Ready for owner acceptance on Chromium and Firefox evidence. Outstanding: WebKit CI, packaging declaration and packed-consumer checks, deferred manual screen-reader cases, and owner confirmation that caller descriptions are enough to explain a disabled checkbox. The owner has not accepted this package.
