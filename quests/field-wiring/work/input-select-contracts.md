---
status: waiting
activity: verify
next: obtain WebKit CI and packaging type evidence, then present for final acceptance
waiting_on: WebKit CI results; packaging declaration evidence (C7); owner's final acceptance after the 2026-09-23 tentative acceptance
profile: Codex design partner; Sol high and Astra medium implementations; independent Astra medium comparison reviewer
review_base: 3d429fa6f5f594e4474431af609741e38b49abdb plus verified /tmp/input-select-review/before snapshot
---

# Input and select contracts

An application can name, describe, focus and observe input/select controls without knowing their internal markup. Readonly and disabled work across the whole control, including the select popup. Hints accept text or markup with consistent accessibility associations.

Parent: [existing input contracts](../spec.md). On 2026-09-20 the owner asked “sounds like a work package to define?” following the proposed input/select delivery slice. This authorizes defining the package. The contracts are accepted; component implementation has not started. The originally proposed direct-field-tooltip integration was later removed by the [2026-09-21 ownership decision](../spec.md#accepted-tooltip-ownership-2026-09-21).

On 2026-09-20 the owner accepted the design-review corrections for direct tooltip attachment and hover/focus persistence, and instructed “for 3, add todo, assume single-app for now”. This package assumes one Vue application per document. Multiple-app ID coordination is deferred to [the backlog](../../../TODOs.md#ids-multi-app--generated-ids-across-vue-applications-follow-up-2026-09-20); single-app SSR/hydration remains required. These edits revise the package without starting implementation.

## Scope

Implement the [routing contract](../../../design/input-routing.md), [content coverage](../../../design/api-guide.md#input-content), [readonly/disabled behavior](../../../design/api-guide.md#readonly-and-clearing) and [SPA submission boundary](../../../design/api-guide.md#spa-submission) on the existing input and select. Apply the [product philosophy](../../../design/philosophy.md) and preserve the [floating-label appearance](../../../design/appearance.md).

Primary changes belong in `src/components/input.vue`, `src/components/select.vue` and their styles. Consolidate shared routing, ids or focus tracking where both components need the same responsibility. Keep shared code internal and tied to these consumers; no generic field adapter is needed.

Input and select use `label`, `placeholder` and `hint` for field content. They have no tooltip prop, internal tooltip integration, DOM marker or control registry. The [2026-09-21 ownership decision](../spec.md#accepted-tooltip-ownership-2026-09-21) supersedes the earlier direct `v-tooltip` requirement. The shared composable and inline directive remain in the [tooltip work record](tooltip-regressions.md#composable-refactor-2026-09-21).

The 2026-09-21 approved compatibility repair supersedes the earlier tooltip-hover-persistence requirement. Ordinary tooltips open on trigger hover or keyboard focus; pointer leave or keyboard blur closes the corresponding explanation, and trigger activation dismisses it. Mouse-acquired focus does not pin it open. Tooltip content is unselectable and ignores pointer events, preserving click-through without activating its owner. Escape dismisses without moving focus and stays effective until a new interaction. For remaining tooltip consumers, preserve merged target descriptions, changing text and cleanup. Forced error feedback persists until cleared or explicitly dismissed; an unrelated rerender does not reopen a dismissed error, while a new error may. Hover persistence over tooltip content and geometry tracking are deferred to [overlays](../../overlay-lifecycle/spec.md#deferred-tooltip-interaction-decision). The approved interim behavior does not claim full SC 1.4.13 conformance.

Select retains its current option/value model, grouping, filtering, option/group slots and positioning. Naming and ARIA must describe that existing interaction. [Selection](../../selection/spec.md) owns taxonomy, the rewrite and final editable Enter semantics; this package does not adopt a new enabled-state Enter policy. Disabled activation and implicit submission are blocked as already agreed.

Checkbox, pickers and their clear-token migration are later packages. Forms, new external-error props, Vuelidate removal, compact-feedback design, label slots, Markdown and new input/select clear buttons remain outside this package. Existing validation feedback is preserved and associated accessibly; browser validity does not supply its state.

## Acceptance and evidence

| ID | Observable outcome | Required evidence |
|---|---|---|
| C1 | Root styling/context attributes and native entry attributes reach their accepted targets; changes to caller ids and bindings update associations without duplicates. | Dedicated consumer changes class/style, `lang`/`dir`, `name`, editing attributes, ids and descriptions; external labels and naming precedence remain effective. |
| C2 | Native listeners receive the original event once, with modifiers and internal handlers intact. Model updates retain their value types; option selection fabricates no native input/change event. | Event ledger for typing, option selection and caller listeners; regressions for existing grouped/slotted selection. |
| C3 | Public `focus(options)` focuses the entry without opening the select. Component focus/blur describe boundary crossings, including the owned popup. | Keyboard and pointer scenarios through entry/popup/outside, null `relatedTarget`, dismissal, hide/inert and unmount; disabled focus and caller `tabindex=-1`. |
| C4 | Readonly permits inspection without edits or selection commits. Disabled preserves one focus target, blocks operation and closes an open popup without committing input or stealing outside focus. | Pointer, keyboard, paste/drop and composition cases; live state changes; application model updates; text draft and focus behavior from the accepted contract. |
| C5 | `#hint` overrides hint text; validation messages retain priority. Descriptions merge and update; floating labels remain text-only. | Plain/slotted hints, changing caller descriptions and existing validation feedback. Verify normal and compact presentation without claiming the deferred compact-feedback gap is solved. |
| C6 | Superseded on 2026-09-21: no direct-field-tooltip integration is required. Disabled field guidance uses hints and caller descriptions under C4/C5. | Verify guidance associations through disabled state and binding changes. Shared composable, button and inline-directive checks belong to the [tooltip record](tooltip-regressions.md#composable-refactor-2026-09-21). |
| C7 | Generated ids survive SSR/hydration and remain unique among component instances in one Vue application per document. Changed props, events, hint slots and public focus have usable types. | Source consumer with several input/select instances and single-app SSR/hydration probes; packaging-owned declaration/packed-consumer evidence for the delivered surface. |

Every case uses the supported `novalidate` SPA pattern where a form is needed. Include required disabled fields and submission from an enabled control. Do not reproduce native constraint-validation behavior.

## Execution and dependencies

1. Capture the starting revision and pre-existing changes before code edits. Load Vue/Vite conventions and establish the review boundary under the quest review procedure. Inspect current fixtures and required checks rather than assuming earlier probe failures describe the current environment.
2. Inventory supported `bunt-input` types and probe native editing locks first. If a type cannot meet the accepted disabled/focus contract, return the concrete exception for decision; do not silently narrow the existing `type` API. Probe source SSR and public typing early enough to expose tooling dependencies.
3. Deliver routing, state and content behavior with owned browser consumers. Exercise hint and caller-description associations for disabled controls; no tooltip integration is required. Implementation order and helper boundaries can follow the code; the acceptance matrix is the fixed target.
4. Run affected checks, obtain an independent review and resolve findings before presenting the package for owner acceptance. Record evidence against C1–C7 and the exact revision checked.

Use [the testing policy](../../../design/testing.md): dedicated `.vue` fixtures, shared diagnostics and focused permanent component contract tests. Extend `tests/fixtures/Selects.vue` and `select-groups.test.ts` where cases fit; add an input/contract fixture where needed. Keep docs smoke separate. Run focused Chromium/Firefox checks locally and obtain all three-engine results through the supported environment or CI; do not shim local WebKit dependencies. Run the required lint/build and affected docs-smoke checks before delivery.

[Packaging](../../packaging/spec.md) owns declaration generation and packed-consumer tooling. Supply the changed API cases; a successful source build does not substitute for C7. Coordinate that dependency rather than inventing a declaration pipeline here. The [accessibility policy](../../../design/accessibility.md) requires axe/state checks and manual NVDA/Firefox and VoiceOver/Safari evidence. Missing declaration or manual AT evidence leaves the affected criteria open.

The 2026-09-20 design review inspected this package and its contracts against the working tree at `dc586ed`. Its tooltip attachment and persistence findings are incorporated above; the multiple-app ID finding is deferred by the owner's scope decision. Implementation, implementation-review and acceptance evidence remain outstanding. The parent's Firefox native-element experiment only informs the disabled mapping; it is not component verification. Update evergreen implementation status and mechanical API references when delivery is verified; public narrative documentation remains human-authored.

## Implementation authority and baseline

On 2026-09-20 the owner requested “@quest implement input-select-contracts.md”, authorizing this package through implementation, verification, independent review and fixes, ready for owner acceptance. Acceptance remains pending. The starting tree contains existing design and quest edits; `/tmp/input-select-review/before` preserves all 163 tracked and untracked source files with byte comparisons and SHA-256 fingerprints in `before.json`. The same directory preserves HEAD, status and tracked/staged diffs. Review compares against this captured tree, preserving the owner’s changes.

### Native-type preflight

The [native-type probe](../probes/input-native-types.cjs) ran on Chromium 153.0.8010.12 and Firefox 155.0 on 2026-09-20. Native readonly retained focus and blocked the tested keyboard edits for text, search, email, url, tel, password and number. Firefox readonly date, time and datetime-local entries could not receive focus, including a separate check with `tabindex=0`. Both engines changed a readonly range from 50 to 51 on ArrowRight. Hidden inputs cannot receive focus. This probe establishes native limitations, not component or AT acceptance. Chromium required running outside the sandbox to launch.

On 2026-09-20 the owner decided “since we ship our own date / time components in the future, limit supported types”. Input now targets text, search, email, url, tel, password and number. This explicitly narrows the former arbitrary native `type` API; dedicated date/time controls own those interactions. Native types with focus/locking exceptions are outside this component’s supported surface.

### External verification dependencies

On 2026-09-21 the owner deferred manual screen-reader tests for all quests until their setup is ready. Field accessibility and remaining tooltip manual observations follow the [shared deferral](../../beta/work/release.md#people-and-external-evidence); retain the scenarios without requiring a session now. WebKit and source/package typing evidence remain immediate verification dependencies. This supersedes earlier scheduling language in this package, without marking manual evidence passed or supplying owner acceptance.

Packaging still has no declaration build or `types` export. Its consumer cases must cover input string/number props and native Event listeners; select object/string/number values and option/group slots; readonly/disabled props; `#hint`; and component refs exposing `focus(options?: FocusOptions): void`. This package supplies source consumers and SSR/hydration checks; it does not authorize a declaration pipeline. C7 remains open until packaging verifies the published surface.

The local host cannot supply NVDA/Firefox or VoiceOver/Safari observations. Required manual AT checks remain open under the accessibility policy; removing field tooltips does not waive field naming, description or disabled-state observations. WebKit evidence requires the supported CI environment; this uncommitted state has no CI result.

### Parallel implementation comparison

On 2026-09-20 the owner requested “lets do a test and do a parallel astra medium to compare and contrast (seperate worktree?)”. Sol high continues in the main working tree. Astra medium implements independently in `/tmp/buntpapier-input-astra`, a detached worktree at the same starting commit with the verified before-state restored and the accepted input-type decision copied. Both receive the same package and verification requirements. Astra uses ports 5274/5273 to avoid Sol’s fixture/docs servers. Neither implementation is accepted by this experiment. Compare contract coverage, defects, structure and verification before choosing what to retain; keep the alternative isolated. The owner also requested token usage and runtime comparison. Local Codex session metadata confirms Sol high and Astra medium and supplies cumulative input, cached-input, output and reasoning-output counters. Record each agent’s own start-to-ready duration and separate implementation from review/fix rounds. Cached input is part of total input, and reasoning output is part of output; neither is an additional token category. These counters do not establish billed cost. Sol started at 17:10:43.744 UTC; Astra started at 17:18:28.159 UTC. The tasks began at different times and Sol received parent feedback before the comparison was requested, so this is a task-level comparison, not a controlled model benchmark.

### First ready-for-review measurements

Both implementations are frozen for independent review. On the owner’s instruction “do the comparison with astra”, the initial Sol reviewer was interrupted and replaced by a fresh Astra medium reviewer. The reviewer assesses contract behavior before seeing usage measurements.

| Measurement | Sol high | Astra medium |
|---|---:|---:|
| Start to ready for review | 24m 16.611s | 18m 14.084s |
| Uncached input tokens | 188,508 | 108,890 |
| Cached input tokens | 9,254,272 | 3,941,120 |
| Output tokens, including reasoning | 50,052 | 28,883 |
| Reasoning tokens, subset of output | 15,231 | 7,630 |
| Total input plus output tokens | 9,492,832 | 4,078,893 |

These measurements end at each agent’s ready message and exclude waiting afterward, independent review, parent coordination and review fixes. Wall time includes that agent’s tool/test execution. Sol ran the full component suites in addition to focused checks; Astra concentrated on the affected contract/grouping suites with more dedicated contract cases. Sol received parent feedback before the comparison started. The same task and source baseline do not make the runs a controlled benchmark. Astra used about 42% fewer uncached input and output tokens and reached readiness about 25% sooner; quality assessment remains separate.

The verified snapshots are `/tmp/input-select-review/after` (Sol, manifest `after.json`) and `/tmp/input-select-review/alternative-b` (Astra, manifest `alternative-b.json`). Their complete deltas against the preserved baseline are `quest.diff` (SHA-256 `8ec600d75d5a122726930936d4779294e5666009616a42028003a9f97f453672`) and `alternative-b.diff` (`17ac36983d989a69df91a9f32200035e4ec1aef0649e8d01ea938b6a70e1d331`). Exact usage and timestamp evidence is retained in `/tmp/input-select-review/implementation-comparison-usage.json`, extracted from the two agents’ local Codex session records.

### API-equivalent cost estimate

At the [published API rates](https://developers.openai.com/api/docs/pricing) checked on 2026-09-20, the first-ready usage estimates to $5.4567808 for Sol and $6.47417 for Astra at Standard rates, or $10.9135616 and $12.94834 at Fast/Priority rates. Standard uncached/cached/output rates per million tokens are $4/$0.40/$20 for Sol and $10/$1/$50 for Astra. Reported cache-write tokens are zero. The calculation uses short-context pricing; the largest individual requests were 198,870 input tokens for Sol and 114,523 for Astra. Aggregate input counts span many requests. This is an API-equivalent estimate, not subscription billing or allowance measurement; parent coordination, independent review and subsequent fixes are excluded.

### Independent comparison and retained implementation

The fresh Astra medium reviewer recommended alternative B (Astra) after reading both complete changes and running independent consumer probes. Alternative A (Sol) passed its own 30 focused Chromium/Firefox checks but failed 13 of the 14 independent engine/case combinations. B passed its own 66 checks and all 14 independent cases. The reviewer found no blocking implementation defect in B and independently passed its production and docs builds. The parent retained B’s source and tests in the main workspace after comparing every overwritten path with the frozen A hash. Pre-existing owner changes and the parent’s mechanical API references were preserved; the original Sol snapshot and separate Astra worktree remain available.

| Defect in rejected A | Reproduced evidence | B result |
|---|---|---|
| Inline options reset a disabled search draft | Type a draft, then disable through a parent rerender; text becomes the selected label in Chromium. | Draft preserved. |
| Open popup has invalid listbox/option ancestry | Axe reports `aria-required-children` and `aria-required-parent` in Chromium and Firefox. | Open-state scan passes. |
| Root `hidden` is overridden by component flex layout | The native entry remains visible in both engines. | Entry hides. |
| Hiding an ancestor leaves the focused popup open | No boundary blur and popup remains after ancestor hiding in both engines. | Popup closes and emits one blur. |
| Disabled focus transfer falsely crosses the boundary | Chromium records focus, blur, focus while moving from popup to entry. | One focus boundary retained. |
| Hover-only tooltip ignores Escape with outside focus | Explanation stays open in both engines. | Dismisses without moving focus. |
| Tooltip closes during slow gap travel | Pointer pauses in the 8px positioning gap and explanation disappears in both engines. | Hoverable bridge preserves it. |
| Initially absent hint slot never appears | Conditional slot insertion alone does not invalidate cached slot-presence computation in either engine. | Guidance and association update. |

The independent review evidence is preserved in `/tmp/input-select-review/astra-a-final.log`, `astra-b-final.log`, `astra-b-build.log` and `astra-b-docs-build.log`. The small independent consumer became `tests/fixtures/FieldBoundaries.vue` and `tests/components/field-boundaries.test.ts`; the reviewer separately checked those retained files and found no blocking issue. The extra hint-removal and outside-focus assertions passed. The comparison exposed test coverage gaps despite green self-authored suites; the result supports choosing B for this package without establishing general model equivalence.

### Integrated verification and acceptance state

The delivered source is byte-identical to reviewed B. The main-tree additions after that snapshot are the independently reviewed boundary regressions and documentation/evidence updates. The exact integrated file state is preserved under `/tmp/input-select-review/integrated` with `integrated.json` and `integrated.diff`, against HEAD `3d429fa6f5f594e4474431af609741e38b49abdb` plus the preserved dirty baseline. No commits or index changes were made.

| Criterion | Delivered evidence | Remaining limitation |
|---|---|---|
| C1 | `field-contracts.test.ts` exercises root/entry routing, caller-only changes, names and descriptions; `field-boundaries.test.ts` guards actual hidden presentation. | None found in reviewed browser cases. |
| C2 | Original native event identity, modifiers, entry targets and typed option models; `select-groups.test.ts` preserves grouped/slotted selection. | No defect found in reviewed cases. |
| C3 | Public focus, owned-popup boundary, null related targets, caller tabindex, hidden/inert ancestors and silent unmount; independent popup focus-transfer regressions. | Manual AT remains separate. |
| C4 | Seven supported types, readonly inspection, disabled navigation/edit guards, draft preservation and application updates, supported novalidate submission; paste/drop/composition guard cases. | Composition events are automated probes, not observed real IME sessions. |
| C5 | Hint text/slot precedence, dynamic slot insertion/removal, validation priority and description updates; compact presentation preserved. | Compact-feedback design remains deferred as agreed. |
| C6 | Historical evidence for the former direct-field-tooltip requirement; superseded by the 2026-09-21 ownership decision. | Current field guidance evidence belongs to C4/C5; shared tooltip evidence is retained in its work record. |
| C7 | `SsrFields.vue` verifies stable unique ids and hydration; `FieldApiCases.vue` covers the changed source API at runtime. | Source type checking and packaging-owned declarations/packed-consumer evidence remain unverified. |

Final main-workspace checks on 2026-09-20: 66/66 input/select and grouped-selection cases plus 14/14 retained boundary cases across Chromium and Firefox; 12/12 docs-smoke cases; lint has 0 errors and 69 warnings; production build passes. Logs are `/tmp/input-select-review/integrated-components.log`, `retained-boundaries.log`, `final-docs-smoke.log`, `final-lint.log` and `final-build.log`. The docs production build and final `git diff --check` also pass; docs build evidence is in `final-docs-build.log`.

Local implementation and independent review are complete. Acceptance remains open: obtain supported-environment WebKit results and source/package typing evidence. Manual screen-reader observations are deferred under the owner’s 2026-09-21 setup decision above and do not block continuing other work. Their evidence remains unclaimed. This package does not implement the deferred packaging pipeline. Owner acceptance has not been supplied.

## Tooltip compatibility reopened on 2026-09-21

The owner reported lost animation, tooltip-induced button activation, persistent display after clicking and lost intentional click-through in tight interfaces, and requested historical baseline tests and delegated accessibility research. The [tooltip regression investigation](tooltip-regressions.md) reproduces compatibility failures in Chromium and Firefox, including form submission and link activation. This supersedes the earlier readiness claim for the shared tooltip: the input/select-only evidence did not cover existing button and generic-directive consumers. The earlier tests remain evidence for their named cases, not proof of overall compatibility. Preserve click-through and motion while resolving hover/focus and forced-display semantics; the investigation has not applied a production fix or supplied owner acceptance.

The owner subsequently deferred the broader tooltip interaction decision, expressing willingness to compromise provisionally on native-title-like behavior. The [overlay quest](../../overlay-lifecycle/spec.md#deferred-tooltip-interaction-decision) owns future improvement and the revisit condition. The owner clarified that geometry tracking belongs to that later quest, outside the current compatibility repair and without blocking it. Exact fallback behavior and the regression repair are not settled by this deferral.

On 2026-09-21 the owner approved the [concrete compatibility repair](tooltip-regressions.md#approved-compatibility-repair-2026-09-21), including activation and forced-error behavior and the temporary relaxation of tooltip hover persistence. Implementation and verification are authorized; geometry tracking remains deferred.

The approved tooltip repair is implemented and independently reviewed with no unresolved repair findings. Its [verification record](tooltip-regressions.md#repair-verification-2026-09-21) contains 10/10 historical compatibility checks, 24/24 affected Chromium/Firefox cases and 12/12 docs smoke checks. The broader run exposed five field/SSR locator failures that also reproduce against the captured pre-repair tooltip source; their [baseline attribution](tooltip-regressions.md#existing-broader-field-failures) does not resolve them. Diagnose those cases here before relying on the older integrated field evidence. WebKit and source/package typing evidence remain open, manual AT remains deferred, and owner acceptance has not been supplied. The five failures were [resolved on 2026-09-23](#fieldssr-failures-resolved-2026-09-23).

## Field/SSR failures resolved, 2026-09-23

All five cases pass. Chromium runs in throwaway worktrees place the fix: all five fail at `7693940` and `32f912e` and pass at `4fc44fd` and `53d5bb5`. `4fc44fd` (“oops”) changes one line in `useFieldRouting`: `useId()` ran inside the `id` getter, which is called during rendering, so the generated id changed between reads and the label and description ids no longer matched the control's references. Generating the id once in setup fixed it. The existing cases caught the defect, so no new test is needed.

On the current working tree (`53d5bb5` plus the uncommitted picker package) the five cases pass 10/10 on Chromium 153.0.8010.12 and Firefox 155.0. The older integrated field evidence stands again for these cases. WebKit, source/package typing and manual AT are unchanged by this result.

## Tentative acceptance, 2026-09-23

After the status report on 2026-09-23 the owner said “otherwise, tentantive accept for both”, covering this package and [picker contracts](picker-contracts.md). This is tentative acceptance of the delivered behavior, not final acceptance: WebKit CI results and packaging-owned declaration evidence (C7) remain open, and manual AT stays under the shared deferral. The same exchange renamed “entry” to “control”; see [the parent record](../spec.md#owner-decisions-2026-09-23).
