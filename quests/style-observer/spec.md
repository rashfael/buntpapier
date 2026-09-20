---
status: waiting
parent: ../beta/spec.md
active: []
activity: explore
next: present the missing WebKit evidence and prototype options when the owner resumes observation
waiting_on: owner-resumption
profile: current owner-selected Codex session; model and effort not exposed
---
# Style observer

Choose a replacement or bounded improvement for computed-style observation while preserving the `useComputedStyle` signature and live presentation contract. The decision was deferred on 2026-09-18; this migration does not resume experiments. Acceptance needs the browser evidence, integration observations and public-token registration decision below. Promote the chosen mechanism and rejected alternatives into `design/` before retirement.

Status: decision deferred, 2026-09-18. The spike ran against `3.0.0-alpha.18` on Chromium 147.0.7727.15 and Firefox 148.0.2. WebKit did not run locally, see section 7. Plan references: the parent beta quest, former Phase 1.1; the initial analysis is preserved in its historical merged plan.

## 1. What we'd be replacing

`useComputedStyle` reads the mapped custom properties with `getComputedStyle()` once on mount, again when `<html>` or `<body>` change `class`, `style` or `data-theme` or the OS scheme flips (`themeWatcher.ts`), and once per animation frame if the element opts in with `--bunt-will-change: all` (`requestAnimationFrameMuxxer.ts`). A theme toggle on a wrapper deeper in the tree is invisible, and the theming guide tells apps to call `refreshComputedStyles()` by hand. That footgun is what this spike is about.

Seven components go through the bridge. What they observe today:

| component | keyword tokens, unset by default | registered `<color>` mirrors |
|---|---|---|
| button | `--button-shape`, `--button-weight`, `--button-size`, `--icon-placement`, `--button-text-color` | `--_button-color`, `--_button-color-error`, `--_button-color-success`, `--_clr-surface` |
| checkbox | `--checkbox-size`, `--checkbox-icon`, `--checkbox-weight` | `--_checkbox-color`, `--_clr-surface` |
| input, select, date-picker, date-range-picker | `--input-shape`, `--input-size`, `--input-layout` | none |
| progress-circular | `--progress-size`, `--progress-layout` | none |

The mirrors are registered in `derived.sass` and re-declared on `*`, so each element resolves `light-dark()` against its own `color-scheme`. The keyword tokens are unregistered and inherit as token streams. Both facts matter below.

## 2. How style-observer works

Read from the published source of `style-observer` 0.1.2, not the README. The whole package is about 1200 lines including JSDoc, no dependencies, MIT, importable without a DOM.

1. Per observed element it calls `getComputedStyle()` once and stores the current value of every observed property. It never fires for initial values.
2. It writes two inline styles on the element: the element's computed `transition` plus `var(--style-observer-transition, --style-observer-noop)`, and that variable set to one `<prop> 1ms step-start allow-discrete` entry per observed property. The variable is registered `inherits: false` so children don't pick up the list. Properties already in the element's own transition list are skipped.
3. It listens for `transitionstart` and `transitionend` on the element. On an event for an observed property it re-reads computed style, diffs every observed property against the stored values and hands over `{ target, property, value, oldValue }` records. The diff dedupes the double event.
4. Chrome used to not start transitions on unregistered custom properties ([crbug 360159391](https://issues.chromium.org/issues/360159391)). The library feature-detects that and, if present, registers each observed custom property through an adopted stylesheet: `@property` with `syntax: "*"`, `inherits: true`, no initial value, inside `@layer style-observer-registered-properties`. A `*` plus `inherits: true` registration behaves like an unregistered property, so token streams stay intact.
5. An IntersectionObserver per document re-checks each target when it reconnects or leaves `display: none`, because transitions don't run on elements that aren't rendered.
6. Three bug probes append dummy elements to `document.body` at import time and resolve after 30 to 50 ms. Until then every bug is assumed present.

The `inherits: false` in step 2 caused a scare: it is only the bookkeeping variable. Observed properties get `inherits: true` when registered at all, and inheritance of the observed value is a browser matter anyway (section 6.1).

## 3. What our browser floor makes dead

We ship for Chrome 147, Firefox 147 and Safari 26.

| workaround in the library | exists for | for us |
|---|---|---|
| `transitionrun` listener plus debounce | Safari < 18.2 transition loop ([WebKit 279012](https://bugs.webkit.org/show_bug.cgi?id=279012)) | dead code |
| adopted-stylesheet `:host` path and its Safari probe | shadow DOM hosts | we have none |
| probe for the Chrome unregistered-property bug | deciding whether to register | fixed in 147, see 6.3, and we register ourselves anyway |
| `updateTransition()` inline-style juggling | unknown host CSS overwriting `transition` | we own the Sass |

## 4. Maintenance state

Version 0.1.2 was published 2025-10-08, the last push to `main` was 2025-12-04. Two contributors, Lea Verou and Dmitry Sharabin. The issues page lists 13 open issues; the ones from May 2025 ([#113](https://github.com/LeaVerou/style-observer/issues/113), Firefox overwriting a multi-property transition), June 2025 ([#133](https://github.com/LeaVerou/style-observer/issues/133), observed property must be set before observing), March 2026 ([#141](https://github.com/LeaVerou/style-observer/issues/141), inline-style clutter) and June 2026 ([#142](https://github.com/LeaVerou/style-observer/issues/142), `unobserve` semantics) have no maintainer reply. Not dead, not tended.

The alternatives use the same trick. Bramus's `@bramus/style-observer` 2.0.2 dates from 2025-02-06 and overwrites the element's transition. `css-variable-observer` 1.0.1 is from 2022 and used a `font-variation-settings` hack before `allow-discrete` existed. The native `ComputedStyleObserver` proposal ([csswg-drafts #8982](https://github.com/w3c/csswg-drafts/issues/8982)) has been open since June 2023, has 24 comments, the latest from 2026-09-09 about worklets, and no resolution or implementer position that I could find.

## 5. The experiment

Files: [observe-test.html](prototype/observe-test.html) and [run.mjs](prototype/run.mjs). Run with `node quests/style-observer/prototype/run.mjs [chromium|firefox|webkit]`.

Every case builds a fresh `html > body > div.sidebar > div > button`. The button carries `transition: <prop> 1ms step-start allow-discrete`, inline or from a stylesheet rule depending on the case. The mutation happens on `:root`, on the `.sidebar` ancestor or on the button itself. The page records every `transitionrun`, `transitionstart` and `transitionend` for the property, how many rAF ticks passed before the first `transitionstart`, and the button's computed value before, synchronously after and 300 ms after the mutation. The `light-dark()` cases model the derived layer: unregistered token on `html`, registered `<color>` mirror re-declared on `*`.

Results, Chromium 147 and Firefox 148 identical unless noted:

| case | what changes | result |
|---|---|---|
| A, B, C | `:root` value `rounded` to `pill`, unregistered / registered `*` / registered `<custom-ident>` | fires |
| G, G2 | class toggle on the ancestor sets the token, unregistered / registered `*` | fires |
| L, M | transition declared in a stylesheet rule, alone or next to `background-color .2s` | fires |
| K | value change on the button itself | fires |
| P | quoted string value `'check'` to `'close'` | fires |
| I2 | mirror on `*`, token on `html`, `color-scheme` flipped on the ancestor | fires |
| I3, I4 | mirror on `*`, token changed on `:root` / set on the ancestor via class | fires |
| J | registered `<color>` changed directly on `:root` | fires |
| D, E, N | `:root` unset to `pill`, unregistered or registered `*` without initial value | silent |
| F | `:root` unset to `pill`, registered `<custom-ident>` with `initial-value: none` | fires |
| E2 | `:root` unset to `pill`, registered `*` with `initial-value: rounded` | fires |
| T | `:root` `pill` to unset (`removeProperty`), unregistered | silent |
| T2 | `:root` `pill` to unset, registered `*` with `initial-value: rounded` | fires, value `rounded` |
| O | token changed while the ancestor is `display: none`, ancestor shown 80 ms later | silent |
| H | registered `<color>` with `light-dark()` declared on `:root` itself, `color-scheme` flipped on `:root` | Chromium fires; Firefox silent, computed value stays white |

Every firing case produced exactly one `transitionrun`, one `transitionstart` and one `transitionend`. No loops in either engine.

## 6. Findings

### 6.1 Inheritance is not the problem

A transition starts whenever an element's own computed value differs between two style change events, wherever the change came from in the cascade. Changing `--button-shape` on `:root` reaches every button that has the transition declared, registered or not. The objection that the observer "doesn't inherit" is off the table.

### 6.2 The unset gap affects every engine

Unset to set and set to unset are silent in Chromium and Firefox alike unless the property has a computed initial value. This is the open spec question [csswg-drafts #10962](https://github.com/w3c/csswg-drafts/issues/10962), filed 2024-09-27 after the Firefox report [bugzilla 1916214](https://bugzilla.mozilla.org/show_bug.cgi?id=1916214), zero comments since. The plan treated it as a Firefox bug. It isn't.

Every keyword token we observe is unset by default, so a first-time `.sidebar { --button-weight: text }` would be missed by any transition-based observer, ours or the library's. The library's issue #133 is this report. The fix that worked in both engines is a registration with an initial value. `syntax: '*'` is enough, keeps token-stream semantics and accepts quoted strings like `--checkbox-icon: 'check'`, which `<custom-ident>` rejects:

```sass
@property --button-shape
	syntax: '*'
	inherits: true
	initial-value: rounded
```

This is an API change, not an implementation detail. Once registered with an initial value the token is never unset on any element. App CSS that relied on `var(--button-shape, something)` falling through stops doing so, the bridge's `if (shape)` guards become dead, and an app that registers the same name itself gets whichever `@property` wins in the cascade. It also gives the plan's "documented default per Tier-2 property" rule a mechanical form. Needs its own decision.

### 6.3 The Chrome bug is fixed

Unregistered custom properties transition in Chromium 147 (case A). The library's main workaround is moot for us, and with the bug gone the library would not register anything on our behalf, so as a dependency it would miss every first set on every engine unless we register ourselves.

### 6.4 Hidden subtrees are missed

A change made while an ancestor is `display: none` produces no event when the subtree is shown again (case O). The computed value is readable the whole time, so the fix is a re-read when the element becomes rendered. The library's IntersectionObserver piece does this; anything we write needs the same 30 lines.

### 6.5 Latency

The event arrives at the start of the next frame, before that frame's rAF callbacks, about 17 ms after the mutation in headless at 60 Hz. The observed property already carries the new value inside the handler because of `step-start`. Sass that consumes the token directly is never late; only the bridge's outputs (modifier classes, `--_button-text-color`) lag one painted frame. Whether that flash is visible on a real theme flip is untested, see section 7.

### 6.6 No inline style needed

Transitions declared from a stylesheet rule work (cases L, M). Since the observed set per component is static, the per-component Sass can carry the transition list through a mixin and JS only attaches the listener. That avoids the inline `transition` and `--style-observer-transition` attributes the library writes on every component root, which is exactly what issue #141 complains about.

### 6.7 One engine difference, outside our pattern

Case H is the only split: a registered `<color>` holding `light-dark()` declared on `:root` and flipped there re-resolves in Chromium and not in Firefox. Our derived layer re-declares the mirrors on `*`, and that pattern (I2) fires in both. Worth remembering when someone proposes declaring a mirror once on `:root` to save work.

## 7. Not verified

- **WebKit.** The Playwright WebKit build links against Ubuntu 24.04's ICU 74, `libxml2.so.2` and flite, which the Arch host lacks. The CI runner can run it; the spec is not wired into CI yet.
- **The flash.** Section 6.5 is theory plus a timing measurement. A prototype behind `useComputedStyle` run through the dark-mode and light-dark suites would show whether a one-frame stale text colour is visible.
- **Cost at scale.** One transition declaration and one listener per component root. No measurement with a few hundred observed buttons in a table.
- **Registration side effects.** Section 6.2 lists the API consequences; none were tested against the docs examples or an app.
- **Vue interaction.** Whether a `style` fallthrough on a component root clobbers an inline transition was not tested. Only relevant to the dependency or any inline-style variant.

## 8. Options

| option | solves the footgun | costs | unknowns |
|---|---|---|---|
| **`style-observer` as a dependency**, wrapped in `useComputedStyle` | yes, plus hidden-subtree re-check | inline styles on every root, import-time probes, dead Safari and shadow-DOM paths, 0.x with unanswered issues, our own registrations still required (6.2, 6.3) | WebKit |
| **Adopt the code** with attribution, strip what section 3 lists | same | after stripping, what remains is the diff loop and the rendered-observer, about 150 to 200 lines plus tests, and we own the bug matrix on three engines | WebKit, flash, cost at scale |
| **In-house from scratch** informed by the library | same as adopt | same as adopt; differs only in provenance | same |
| **Subtree-aware `themeWatcher`**: one MutationObserver on the document for `class`, `style` and `data-theme`, re-run all bridges dirty-checked | catches class and inline-style toggles anywhere, which is the reported footgun | every mutation re-reads every component; misses stylesheet swaps and media queries other than the scheme; keeps `refreshComputedStyles()` for those | how much it costs on a busy page |
| **Wait for a native observer** | eventually | no movement in three years (section 4) | when |
| **Shrink the observed set with CSS** | reduces the problem rather than solving it | `if(style(--button-shape: pill): …)` retires every keyword-to-class case but is Chromium 137+ only, Firefox in progress, Safari roadmap 2026 to 2027 ([caniuse](https://caniuse.com/css-if)); a candidate-list `contrast-color()` would retire the ink guard and doesn't exist | dates |

The last row reframes the others: whatever we build for observation is transitional. The keyword cases go when `if()` reaches Baseline, the colour cases when `contrast-color()` grows a target contrast. That argues for the smallest thing, but "smallest" could be the fourth row just as well as the second.

## 9. What the evidence settles, and what it doesn't

Settled: inheritance works, the Chrome bug is gone, no engine loops, stylesheet-declared transitions are fine, the unset gap is real on both tested engines and a registration with an initial value closes it.

Not settled: whether a transition-based observer is worth owning at all versus the subtree-aware MutationObserver, whether we want to register the public keyword tokens (an API change with cascade consequences), WebKit behaviour on every row of the results table, and whether the one-frame lag shows.

Decision deferred. To pick it up: wire `observe-test.html` into the CI Playwright job for the WebKit column, prototype the transition observer behind `useComputedStyle` and run the dark-mode and light-dark suites on three engines, and write the registration question up as its own ADR since it changes the public styling contract.

## Open questions and resumption

| Shortname | Type | Question | Dependency / revisit |
|---|---|---|---|
| webkit-evidence | unblock, prototype | Do all observation cases behave as required in WebKit? | Owner resumes this quest; a compatible CI or local runtime supplies the missing engine |
| public-registration | decide | May public keyword tokens gain initial values, changing `var()` fallback and competing registrations? | Owner decision informed by the documented cascade consequences |
| integration | prototype | Does the candidate preserve theme correctness, hidden-subtree recovery, SSR imports and acceptable latency/cost behind `useComputedStyle`? | Selected candidate and registration policy; three-engine theme suites |
| observer-choice | decide | Adopt the library, own a reduced observer, or improve subtree mutation observation? | Missing browser and integration evidence; compare limitations in section 8 |

The parent migration request preserves this record only. Experiments, implementation and retirement need the selected scope's existing or new authority. Future output: an evergreen observation decision with rejected alternatives, plus the unchanged public bridge signature and criterion-to-test evidence.

The owner accepted the beta readiness review's additional integration cases on 2026-09-19: reduced-motion overrides, consumer transition declarations, a hidden subtree becoming visible, repeated disposal and a realistic screen with many observed controls. Coordinate the harness with infrastructure. A transition-based candidate must prove it still detects policy changes when visual motion is disabled; this is a verification requirement, not a reproduced defect. Native overlay probes with injected policies do not satisfy the live-CSS delivery gate. This clarification leaves the owner-resumption deferral intact.
