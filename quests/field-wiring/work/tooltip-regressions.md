---
status: waiting
activity: verify
next: review the subsequent composable refactor before owner acceptance; retain deferred overlay work and external verification limits
waiting_on: owner acceptance
profile: current Codex session for historical and browser investigation; Sol medium requested for accessibility research
review_base: 3d429fa6f5f594e4474431af609741e38b49abdb tooltip files versus captured working-tree tooltip files
---

# Tooltip regression investigation

The input/select rewrite removed the tooltip animation and broke intentional click-through behavior. Tooltip pixels and an invisible surrounding area can now press, focus and activate the owning button or link. The earlier input/select checks did not cover this compatibility surface. The historical findings below describe the unrepaired rewrite; the approved repair and final verification are recorded later in this document.

Parent: [input/select work package](input-select-contracts.md). Related owner: [overlay lifecycle](../../overlay-lifecycle/spec.md). On 2026-09-21 the owner requested an in-depth investigation, a baseline for the previous version, earlier history and delegated accessibility/usability research. The owner explicitly identified click-through in tight interfaces as intentional. This record covers investigation and executable characterization; it does not adopt a new tooltip interaction design or claim a repaired implementation.

## Owner deferral on 2026-09-21

After reviewing the findings, the owner said they would compromise on native-title-like behavior with future improvement, but did not want to spend time settling that interaction decision now. The [overlay quest](../../overlay-lifecycle/spec.md#deferred-tooltip-interaction-decision) owns the deferred decision and its revisit condition. Native-title-like behavior is a provisional fallback direction; the geometry-tracking and activation-dismissal recommendations below remain unadopted proposals. No literal `title` replacement, exact native behavior, production repair or acceptance is claimed. Preserve the confirmed regressions and executable baseline without treating the broader interaction decision as work to pursue now.

## Approved compatibility repair, 2026-09-21

The owner approved the concrete repair proposal after separating geometry tracking into the later overlay quest. This authorizes implementation, regression verification and independent review of the repair below; owner acceptance remains separate. Restore the existing slide/fade animation, reversal and safe teardown with compatible Popper coordinate handling. Restore `pointer-events: none` and remove the invisible hit area so tooltip pixels cannot press, focus or activate their owner and clicks reach the underlying control.

Ordinary tooltips open while the trigger is hovered and close when the pointer leaves. Trigger activation dismisses the ordinary explanation, and mouse-acquired focus does not keep it open. Keyboard focus opens it; blur or Escape closes it, with Escape remaining effective until a new interaction. Retain direct input/select attachment, actual-entry descriptions, merged `aria-describedby`, changing text and cleanup. Forced error feedback may open without hover/focus and remains until cleared or explicitly dismissed. Unrelated rerenders do not reopen a dismissed error; a new error may open again.

The owner explicitly approved temporarily relaxing the earlier tooltip-hover-persistence contract. Geometry tracking, persistence over tooltip content, broader timing/touch/positioning redesign and the fuller accessibility/usability decision belong to the later overlay quest. This repair does not substitute native `title`, migrate overlays or claim full hover-content accessibility compliance. Preserve the field accessibility improvements that do not depend on the deferred hover behavior.

Verification covers the historical compatibility baseline and permanent button/form/link activation, click-through, animation reversal/disposal, keyboard dismissal, forced-error feedback and input/select description regressions. The implementation is delegated to Sol medium; an independent reviewer assesses the completed change against this approved boundary. The dirty before-state is captured in `/tmp/tooltip-repair-before`: relevant file contents, SHA-256 fingerprints, HEAD, status and working-tree/index diffs. The repair does not modify the index.

## Comparison boundary

The browser comparison holds the rest of the current library constant and changes only `src/directives/tooltip.ts` and `src/styles/components/tooltip.sass`. The baseline takes those files from commit `3d429fa6f5f594e4474431af609741e38b49abdb`; the current side captures the working tree, including the owner's unrelated 64% tooltip background mixture. Both run the same Vue consumer with the currently installed dependencies. This isolates the tooltip change; it is not an execution of the entire historical application or the old Vue 2/Popper 1 dependency stack.

The [manifest](../probes/tooltip-regressions/manifest.json) records source hashes and the lockfile hash. The previous comparison's `/tmp/input-select-review` snapshots are no longer present, so this investigation does not claim to have reconstructed those snapshots. Git shows the directive unchanged since its 2023 TypeScript conversion until the staged rewrite. No production files or index entries were changed by this investigation.

The retained [consumer](../probes/tooltip-regressions/TooltipAudit.vue), [main probe](../probes/tooltip-regressions/probe.cjs), [activation probe](../probes/tooltip-regressions/activation.cjs) and [compatibility assertions](../probes/tooltip-regressions/check.cjs) live outside the permanent component suite while the repair contract is being settled. Raw observations are in [results.json](../probes/tooltip-regressions/results.json) and [activation.json](../probes/tooltip-regressions/activation.json). These are measured characterizations, not 100 passing acceptance tests.

## Confirmed regressions

| Behavior | Previous tooltip | Current tooltip | Evidence and consequence |
| --- | --- | --- | --- |
| Opening animation | 200ms opacity and 32px movement animation | No animation is created | `hover-animation` records the actual Web Animations calls in both engines. Source also removes the reverse animation on closing. |
| Click through visible tooltip | Underlying control receives the click | Underlying control receives none; owner gains focus | `click-through-tooltip`, both engines. Uses a forced error tooltip so the baseline remains visible while clicking through it. |
| Click just outside visible tooltip | Underlying control receives the click | Invisible tooltip pseudo-element receives the click | `click-invisible-halo` targets 4px below the visible box. The new `inset: -8px` expands the hit surface on every side, rather than only across the trigger gap. |
| Click ordinary tooltip over a button | Does not press or focus its owner | Owner matches `:active`, receives focus and can activate | Separate activation probe covers Buntpapier and native buttons. Firefox activates on the first click; Chromium activates on the second click after the first focuses the owner. |
| Tooltip outside a submit button | Does not submit | Can submit the owning form | Firefox submits on both sampled clicks; Chromium submits on the second. This is an action regression, not only visual feedback. |
| Tooltip outside a link | Does not navigate | Can activate the owning link | Native anchor probe changes the hash to `#destination` on Firefox's first click and Chromium's second click. Router-specific integration was not exercised. |
| Click trigger, then leave | Ordinary tooltip closes despite the button retaining focus | Ordinary tooltip remains open | `click-trigger-then-leave`, both engines. This follows the rewrite's undifferentiated focus state. |

The five compatibility checks run on both engines pass **10/10 on the previous tooltip and 0/10 on the current tooltip**. They protect motion, visible-box click-through, surrounding-area click-through, lack of tooltip-induced activation/focus and the previous mouse-activation dismissal behavior. The last behavior now conflicts with the broad focus-persistence wording of the input/select package, so its repair needs an explicit activation/modality policy rather than blindly enforcing the historical assertion.

The event path explains the dangerous coupling. `create()` still appends the tooltip inside its trigger. The stylesheet now makes it a pointer target. Pointer presses therefore acquire the button/link's native active and focus states, and generated clicks bubble through the same activating ancestor. Stopping only `click` propagation would not restore click-through or prevent the earlier native pressed/focus effects. After focus, `refresh()` keeps the explanation open even when the pointer leaves. Chromium's first sampled press produces pointerdown, mousedown, focusin and mouseup without click; the second press activates. The probe establishes that distinction without claiming a browser-internal explanation for it.

Forced error feedback is a separate case: it already stayed open without hovering in the old implementation. That is not itself a new regression. The ordinary-tooltip activation probe prevents confusing this existing error-feedback behavior with the new focus-pinning problem.

## Other behavior checked

The main matrix contains 22 scenarios on two implementations and two engines, giving 88 observations. The separate three-consumer activation matrix adds 12 observations, each with two presses. The final run records browser versions in the JSON. WebKit was not run on this host; native operating-system tooltip behavior and manual assistive-technology output were not tested.

- CSS top, right and bottom placement, a viewport-edge flip and scrolling retained matching final viewport geometry in the sampled cases. Popper's style properties changed, especially top/bottom anchoring, but those style differences alone are not evidence of broken placement. This is not a full positioning acceptance matrix.
- Plain hover/leave still closes. Text changes update the displayed text and size. Unmounting during opening leaves no tooltip or observed page exception. Restoring temporarily empty text while hovered worked in these cases.
- Keyboard focus now opens and describes the control, hover-only Escape now dismisses, pointer travel onto the tooltip now persists, and blur/refocus allows a new explanation. Those are intended additions that a repair must retain.
- Turning forced display off while still hovering now leaves the tooltip open; the old implementation hid it. This is a compatibility change caused by combining forced and interaction-driven display. Its desired semantics need to be stated for button error recovery.
- Escape hides a forced tooltip, but changing its text with no hover/focus immediately reopens it: `refresh()` clears `dismissed` whenever no interaction is active. The old tooltip did not support Escape at all. This is an incomplete new dismissal policy, not a newly lost old behavior.
- Changing `fixed` before first opening is picked up by the new implementation and ignored by the old instance. Changing positioning options while already open still does not call `popper.setOptions()` in the new code. The latter is a source-level limitation shared with the old behavior; this run does not claim live-presentation compliance.

The default 300ms delayed refresh also replaces the previous immediate start of a 200ms exit animation. Its delay is not evidence that the animation was preserved. Opening has no replacement CSS or Web Animations transition.

## Earlier history and the custom Popper writer

The behavior predates this work by years. Inspect these commits with `git show <hash> -- '*tooltip*'`; the history is available locally.

| Commit | Historical evidence |
| --- | --- |
| `552fee2` / `7a1be92` (December 2016), `ec48172` / `ab239c1` (March 2017) | Original tooltip work, above/below placement and alignment fixes. The component immediately preceding the 2018 replacement already had `pointer-events: none`, `user-select: none`, and 200ms opacity/transform transitions. |
| `43bcc53` (August 2018), “replace tooltip completely” | Introduces the Popper directive while preserving click-through and slide/fade behavior. Disables Popper's style application, writes its own rounded translate3d coordinates and animates to those same coordinates. |
| `17ba8be` (December 2018), “only create and place tooltip on hover” | Moves construction/positioning to opening and destroys after reversed exit animation completes. This was deliberate lifecycle work, not redundant scaffolding. |
| `f8eae6c` (April 2019), “make tooltips on buttons more configurable” | Adds `boundariesElement` propagation and overflow-boundary configuration. |
| `14e3228` (February 2020) | Guards animation teardown against a race. Any restoration must preserve safe reversal and disposal. |
| `8baf94b` (November 2021), fixes #12 | Updates continuously displayed text and avoids hiding on every ordinary update by comparing old/new forced-display state. |
| `ff73cf5` (January 2022) | Migrates to Popper 2, retaining disabled `applyStyles` plus `applyTooltipStyle` and the coordinate animation. |
| `284e005` (January 2022) | Adds CSS placement; unconditionally overwrites the option with the computed property or `auto`. That old precedence bug should not be restored as an intended contract. |
| `8c4ecd7` (October 2022), `0d3237d` (July 2023) | Export/render-function integration and TypeScript conversion preserve the mechanism. |

The strongest supported rationale for the custom writer is the shared coordinate system with the transform animation. The history does not contain a separate architectural essay saying why every modifier was chosen. It does show the writer and animation introduced together and deliberately carried through the major Popper migration. Removing both discarded behavior. Restoring the old animation on top of the new default adaptive top/bottom style writer without reconciling coordinates would also be unsafe.

Offset, `fixed` strategy and `boundariesElement` were not simply deleted: their equivalents remain in the rewrite. The former `options.boundary` fallback disappeared, but the old directive never forwarded `binding.value.boundary` into that options object, so this investigation does not count that textual deletion as a demonstrated public API regression. The button's unused `tooltipPlacement` prop also predates this rewrite.

## Accessibility and the repair boundary

The delegated [source research](tooltip-accessibility-research.md) separates normative requirements from implementation choices. [WCAG 2.2 SC 1.4.13](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus) requires custom hover content to remain visible when the pointer moves over it. It does not require the tooltip to intercept clicks, accept focus or allow text selection. Native user-agent tooltips are explicitly exempt from that criterion. APG's tooltip pattern is informative work in progress, not an additional normative mandate.

Keeping `pointer-events: none` while tracking the pointer's location over the visible tooltip and a travel corridor is a plausible way to meet the observable requirement and preserve the owner's click-through contract. This is an inference from the criterion, not an implementation explicitly certified by W3C. The magnification, pointer-driven AT and overlapping-control trade-offs are recorded in the research. Manual evidence remains deferred under the project's existing setup policy.

The current compatibility repair covers restoring motion and click-through and preventing tooltip pixels from pressing or focusing their trigger. Geometry tracking and the fuller hover-persistence design belong to the [later overlay quest](../../overlay-lifecycle/spec.md#deferred-tooltip-interaction-decision), as clarified by the owner on 2026-09-21. They are not prerequisites for repairing the confirmed regressions under the provisional native-title-like compromise. Actual-entry descriptions and keyboard access remain required; activation and forced-error behavior are now settled by the approved compatibility repair above.

The repair should promote the relevant baseline checks into permanent behavioral tests and verify combined input/select/button/link behavior, animation reversal and disposal. The later quest owns geometry-tracking experiments and their positioning, zoom and assistive-technology evidence. The earlier green input/select review is superseded for shared-tooltip compatibility by the reproduced failures; this scope clarification neither repairs them nor claims full tooltip accessibility compliance.

## Reproduce

Run from the repository root. The setup creates isolated copies under `/tmp/bunt-tooltip-audit`, pins the old tooltip to the commit above and snapshots current source; it does not change production files. The fixture servers and browsers may need the same local execution permission as the existing Playwright suite.

```sh
python quests/field-wiring/probes/tooltip-regressions/setup.py
```

Start each server in its own terminal:

```sh
node node_modules/vite/bin/vite.js --config /tmp/bunt-tooltip-audit/baseline/tests/fixtures/vite.config.ts --port 5374
node node_modules/vite/bin/vite.js --config /tmp/bunt-tooltip-audit/current/tests/fixtures/vite.config.ts --port 5375
```

Run observations, then assert the historical compatibility baseline:

```sh
node quests/field-wiring/probes/tooltip-regressions/probe.cjs
node quests/field-wiring/probes/tooltip-regressions/activation.cjs
node quests/field-wiring/probes/tooltip-regressions/check.cjs baseline /tmp/bunt-tooltip-audit/results.json
node quests/field-wiring/probes/tooltip-regressions/check.cjs current /tmp/bunt-tooltip-audit/results.json
```

The last command intentionally exits nonzero against the unrepaired rewrite. Without the results-path argument, the assertion script reads the retained observations, which is useful for inspecting this record but does not rerun a browser. Do not report checking that stored JSON as fresh browser verification.

## Repair verification, 2026-09-21

The repaired directive and stylesheet were frozen for independent review under `/tmp/tooltip-repair-review`. At that boundary, the directive SHA-256 is `8bf4919123a41d9aab700c6c8c976765b45d255c1dc3ba775ac1b20e1fc568a6` and the stylesheet SHA-256 is `cffb2c6b479ff152adcaeb3a74b21f90e5b076999ded23365abeb9887c88f9dc`. The owner's 64% background mixture is preserved. Source changes restore the rounded Popper coordinate writer and 200ms slide/fade with reversal/disposal, remove pointer interception and the invisible halo, distinguish pointer-acquired focus, and retain descriptions and forced-error dismissal across updates.

The parent independently reran the historical consumer on Chromium 153.0.8010.12 and Firefox 155.0. All 88 observations completed without page errors or scenario failures. The previous version still passes 10/10 compatibility assertions; the repaired version now passes 10/10, compared with 0/10 for the unrepaired rewrite. The separate 12-observation activation matrix confirms no tooltip-induced active state, focus, button activation, form submission or link navigation in either engine. These observations include two presses per consumer.

Retained evidence: [repaired source manifest](../probes/tooltip-regressions/repaired-manifest.json), [repaired observations](../probes/tooltip-regressions/repaired-results.json) and [repaired activation observations](../probes/tooltip-regressions/repaired-activation.json). The original unrepaired observations remain intact. Fresh execution used `TOOLTIP_AUDIT_DIR=/tmp/bunt-tooltip-repair-audit` with the same setup and probe scripts described above, followed by `check.cjs baseline /tmp/bunt-tooltip-repair-audit/results.json` and `check.cjs current /tmp/bunt-tooltip-repair-audit/results.json`.

Final source SHA-256 is `c01535f4caddb0b58f77426bdbe70871317857ca744f661890eefc482395a199`; the final snapshot manifest at `/tmp/tooltip-repair-review` is `ce68f6befdfeb31eab767b467c207a29f95c715308d25aa8106990b79920b997`. The historical matrix was refreshed after consolidating description visibility into the display state (runtime source `b3eccc537c04526ce5e86ee4fa063cf52cb43de61ba2a007398a5f61e488f61a`), again yielding 10/10 compatibility assertions and no observation errors. The only subsequent production change was the erased TypeScript annotation `text: any` to `text: unknown`; that does not change the tested runtime. The repaired manifest records both boundaries.

Independent Astra medium review closed with no unresolved findings. Final-runtime independent checks passed 18/18 across Chromium and Firefox, including modality, dismissal, forced errors, animation reversal/disposal, 50 immediate focus/blur cycles per engine, and caller-description mutation/cleanup. Earlier external-label focus probes also passed both engines. [Independent main-case results](../probes/tooltip-regressions/independent-review-results.json) are retained; the full temporary consumer and edge probes live in `/tmp/tooltip-independent-review`. Review requested permanent invisible-halo coverage and waiting for the restored opening animation to finish before measuring its geometry; both corrections are incorporated.

The affected permanent matrix passed 24/24 across Chromium and Firefox. The final settled-geometry halo test passed another 2/2 targeted checks. Documentation smoke passed 12/12. Lint reports 0 errors and 69 existing warnings; production build and `git diff --check` pass. No index changes or commits were made. Geometry tracking and tooltip-content hover persistence remain deferred; WebKit and manual AT evidence are not claimed. Source/package typing evidence remains outside this repair's completed checks.

### Existing broader field failures

The broader Chromium run passed 92/98 before the final exit-teardown test adjustment. One failure was the open-select axe scan observing the restored outgoing tooltip; the test now waits for tooltip removal and passes in both engines. The remaining five failures also reproduce against the captured pre-repair tooltip source and stylesheet, holding the other source and test fixtures constant. They are not attributed to this tooltip delta, and the full suite is not claimed green.

| Existing case | Reproduced failure |
| --- | --- |
| Disabled focus/draft/application updates | Missing textbox named `Enabled submit`. |
| Single-app SSR/hydration associations | Missing textbox named `First`. |
| Caller naming/external labels/tabindex | Missing textbox named `Disabled required`. |
| Disabled implicit Enter prevention | Missing textbox named `Disabled required`. |
| Source API consumer | Missing textbox named `Text`. |

[Before-state failure results](../probes/tooltip-regressions/pre-repair-field-failures.json) retain all five outcomes. The comparison used `/tmp/tooltip-before-gate/current`, restored tooltip hashes `de635ff80f580d7c8b6c82729123ffd75ba57cedce87065d09092057ab5c60e2` and `e1dba10572f28db1a588d938f72399e14c797b33eacd0f8080207e7582b6fc75`, and `npx playwright test --config=/tmp/tooltip-before-gate/current/playwright.gate.config.ts --project=chromium --workers=1 --grep='disabled keeps focus|source SSR|caller naming|disabled input blocks|source API consumer'`. Screenshots, traces and error contexts remain under `/tmp/tooltip-before-gate/test-results/`. These cases remain with the parent input/select work package for diagnosis; this comparison establishes baseline attribution, not their underlying cause or resolution. The input/select package [resolved them on 2026-09-23](input-select-contracts.md#fieldssr-failures-resolved-2026-09-23): a generated-id defect in `useFieldRouting`, fixed in `4fc44fd`, unrelated to the tooltip.

## Composable refactor, 2026-09-21

The [owner's tooltip ownership decision](../spec.md#accepted-tooltip-ownership-2026-09-21) moves shared behavior into `src/tooltip.ts` as the exported `useTooltip` composable. Buttons call it directly. `src/directives/tooltip.ts` supplies binding values through an effect scope and stops that scope on unmount. The composable handles reactive content, element replacement and disposal. Explicit refs can separate the positioning anchor from the focus/description target without DOM discovery.

Input/select tooltip integration and `data-bunt-entry` are removed. No field tooltip prop or control-registration helper remains. Field tests now exercise disabled hint/description associations; tooltip hover and dismissal cases live in `tests/components/tooltip-contracts.test.ts` against inline consumers. Existing motion, click-through, Escape and forced-error behavior remain the intended contract. Geometry tracking, content-hover persistence and manual AT retain their earlier deferrals.

Verification in this session used the uncommitted working tree after the refactor. `npx playwright test tests/components/tooltip-contracts.test.ts --project=chromium --project=firefox --workers=2` passed 22/22. The preceding broader run passed 69/70 after excluding the five known field cases in each engine; its Firefox animation observation failed once and passed in the focused rerun. All five excluded cases reproduced in Chromium in the isolated pre-refactor comparison at `/tmp/tooltip-baseline-nbn656g7`; they remain unresolved. The production build, targeted source lint, targeted TypeScript check for the composable/directive and `git diff --check` passed. Existing lint/build warnings remain. No fresh WebKit, docs-smoke, packaged-consumer or manual AT evidence is claimed for this refactor.

The earlier independent review covers the compatibility repair at its recorded source boundary, not this subsequent refactor. Recording the API decision supplies neither a fresh independent implementation review nor owner acceptance of the delivered behavior or the whole field package.
