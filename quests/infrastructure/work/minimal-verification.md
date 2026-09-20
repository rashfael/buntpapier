---
status: done
activity: close
next: none; M2 is the next unit and is selected separately
waiting_on: null
profile: Claude Code Opus 5 design partner; implementation executor is a separate Opus agent
review_base: d50ae6a79df1c5d7eec78a2fa9d3afe1d885f3f6
---

# M1: minimal verification groundwork

Move existing component tests onto dedicated fixtures and give failures useful diagnostics. Keep docs smoke tests in a separate suite. Extend shared accessibility checks on one native button consumer. Keep the delivery small enough to review without resolving packaging, forms, observation or announcement design.

Parent: [infrastructure](../spec.md). On 2026-09-20 the owner approved the delivery proposal with the amendment: “minimal-verification should rework the existing tests to not use the docs but own fixtures and make the docs smoke test clearly separate”. This brief incorporates that approved scope. Implementation is unstarted and belongs to a separate executor; outcome acceptance follows verification. Full-suite accessibility remediation remains outside M1.

## Starting point and allowed changes

Use [the verified historical baseline](../spec.md#starting-evidence). Before editing, capture the actual starting revision and any pre-existing changes or work in isolation. Keep reactivity-transform in the library and fixture toolchain. Load the Vue/Vite conventions before editing code/configuration.

Reuse `tests/fixtures/` and its Vite server for all component behavior tests. Add the small consumers needed by the existing theming and grouped-select cases, plus the native button accessibility scenario. Preserve picker scenarios and their clock behavior. Extract the existing page-error collector from `tests/date-picker-helpers.ts` into a shared fixture used by component tests and docs smoke tests; retain the colour-parse and attribute-warning checks where relevant. Add focused keyboard/focus and axe helpers only where consumers need them. Avoid a fixture registry or a component-testing framework migration.

Component runs must start only the fixture server and pass with the docs server stopped. Keep docs smoke tests under `tests/docs/` with a separately selectable command/configuration and clearly named results. A combined CI invocation must run both groups on all three engines. Share common browser/diagnostic options; docs startup and its base URL belong only to the smoke configuration.

## Existing-test migration

| Existing suite | Approved destination / preserved evidence |
|---|---|
| `dark-mode.spec.ts` | Dedicated button, checkbox, select and picker consumers for scheme changes, ink contrast, nested surfaces and teleported/popover surfaces. Retain the existing 10k-node check on an owned fixture; this does not start a broader benchmark project. |
| `light-dark-tokens.spec.ts` | Owned token/button fixture for colour parsing and browser colour-resolution cases, preserving the error assertions. |
| `select-groups.spec.ts` | Owned grouped and slotted-select consumers with their data, styles and current teleport host. Preserve header filtering, keyboard selection, attribute forwarding and slot behavior. |
| `date-picker.spec.ts` and `date-range-picker.spec.ts` | Keep component cases on the existing dedicated picker fixture. Move the docs-mount cases currently embedded in `date-range-picker.spec.ts` into the separate smoke suite. |
| Docs smoke | Verify representative docs pages mount without runtime errors and their examples are usable. Preserve the existing picker docs checks and cover the button/checkbox/select pages previously visited by behavioral suites, without duplicating their full contract assertions. |

Fixtures own their data and host styling and import library source/styles through the existing toolchain; they must not import docs examples, VitePress theme code or documentation content. Make required CSS layers, surfaces and current teleport containers explicit. Preserve each existing behavioral assertion or record its justified equivalent in the migration review; test counts alone cannot prove coverage survived.

Allowed areas: test helpers/specs/fixtures, Playwright configuration, CI diagnostic settings, the axe development dependency and lockfile, convenient verification commands if needed, and internal verification instructions. Production component/style fixes discovered by the new assertions belong to their subject scope and require separate execution authority.

## Approved behavior

| Scenario | Expected result |
|---|---|
| Run component suites | All existing behavior is exercised through dedicated fixtures on all three engines, with no docs-server dependency. Picker clock-dependent cases remain intact. |
| Run docs smoke separately | Only docs integration checks run; results identify the smoke suite. Combined CI runs both suites and cannot omit either silently. |
| Exercise a native button in a small consumer | Tab exposes keyboard focus, Space/Enter produce the expected activation, and a disabled button does not activate. Assert public behavior and rendered semantics. |
| Inspect accessibility | A scoped axe scan uses `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; a compact ARIA snapshot covers relevant enabled/disabled semantics. This demonstrates the helper, not completion of the button's entire beta checklist. |
| Change media settings | Explicit forced-colour and reduced-motion cases exercise the consumer's applicable focus/state/interaction behavior. A media query matching is only setup evidence, not proof of visual correctness. |
| A page throws or an assertion fails | The run fails, reports the page error and keeps a screenshot/trace that can be opened from the local or CI report. |

Use `screenshot: 'only-on-failure'` and `trace: 'retain-on-failure'` so diagnostics exist even without retries. Keep video off. Ensure CI retains the report and referenced attachments, including `test-results/` if needed, under the existing 14-day failure-artifact policy. Do not add retries merely to produce a trace.

Known alpha accessibility failures must be visible: preserve a narrowly scoped expected fingerprint with its rule, target, owning work and removal condition, or leave the criterion explicitly unmet. A global rule disable, whole-page exclusion or fabricated passing expectation cannot satisfy this brief. New unexpected violations fail. Any accepted known finding remains open in component release evidence.

## Verification and handoff

1. Run lint, library/docs builds and all existing/new browser cases on the candidate revision. All three engines need passing evidence; use CI or a compatible environment for engines unavailable locally on Arch Linux. Record commands, versions and revision. A CI upload/trigger uses existing authorization; an unavailable result remains an unfinished check.
2. Use a temporary intentional page error and assertion failure to verify failure status, screenshot and trace attachment. Remove the fault afterwards; this does not justify a permanent test of the runner itself.
3. Map old cases to their migrated equivalents, verify component runs with the docs server stopped, and run the separately selected smoke suite. Inspect CI discovery/results for both groups on every engine. Check the diff for unchanged product code and no docs imports in component fixtures. Record any known alpha finding by owner and criterion. Obtain the quest's independent implementation review and resolve findings within scope.
4. Prepare the named outcome for owner acceptance. Publish the repeatable commands and fixture usage in an internal `design/testing.md`, with an index pointer. That page already contains the approved retention policy; extend it with verified commands and delivered fixture usage.

Stop and return the affected choice if this requires a new runner, public behavior change, fixture API framework or blanket accessibility exception. Other authorized work can continue. The stopping point is verified minimal groundwork ready for acceptance, with each unresolved product finding visible. M2 and the remaining beta infrastructure are separate deliveries.

## Evidence

Design approved with fixture-migration amendment on 2026-09-20. Delivered uncommitted in the working tree on 2026-09-20 from `review_base` `d50ae6a79df1c5d7eec78a2fa9d3afe1d885f3f6`, by a separate implementation executor, with one independent review in fresh context, one fix round and one owner-revision round.

### Owner revisions during execution

| Revision | Effect on this brief |
|---|---|
| Test files use `.test.ts`, not `.spec.ts` | Naming only; `testMatch` is pinned to `**/*.test.ts` so a stray file cannot be picked up or missed silently. |
| Fixture pages are generated from the component | Supersedes “add a page rather than a switchable fixture registry”. A fixture is now one `.vue` file; a Vite dev-server plugin generates the page and entry module. Per-page `.html` and `.ts` entries are gone. |
| No unified run | Supersedes “a combined CI invocation must run both groups on all three engines”. The two suites are two configurations, two commands and two steps of the existing e2e matrix job. The group-coverage reporter, `playwright.all.config.ts` and `PLAYWRIGHT_ENGINES` were removed. |

The last revision trades a runtime guard for a structural one: dropping a suite now means deleting a CI step, which is a visible diff in [the workflow](../../../.github/workflows/ci.yml). The removed reporter also had a `--reporter=` hole by construction. The accepted residual risk is that a checked-in skip emptying a suite reports `5 skipped` and exits 0 rather than failing.

| Criterion | Evidence | State checked |
|---|---|---|
| Existing behavior exercised through dedicated fixtures | Case-by-case migration mapping; the reviewer diffed each pre-migration suite against its replacement and found no dropped, weakened or vacuous assertion. Picker suites are byte-identical apart from imports and their `goto` URL. | Working tree, chromium |
| Component runs need no docs server | `npx playwright test --project=chromium` → 59 passed; only the fixture server is configured, and port sampling through the run observed `:5174` alone, never `:5173`. | Working tree, chromium |
| Docs smoke separately selectable | `npm run test:docs -- --project=chromium` → 5 passed, written to `playwright-report-docs/` and `test-results-docs/` so it cannot overwrite the component run's artifacts. | Working tree, chromium |
| Both suites run on every engine in CI | Two steps of the e2e matrix job, the docs step guarded by `if: ${{ !cancelled() }}` so a component failure cannot hide it, while a cancelled workflow still stops. Failure upload covers all four result directories at 14 days. | Workflow file; not yet executed |
| Native button keyboard, activation and semantics | `tests/components/button-a11y.test.ts`: Tab focus and `:focus-visible`, Space/Enter/pointer activation, disabled does not activate, compact ARIA snapshot of enabled/disabled. | Working tree, chromium |
| Scoped axe scan with the required tags | Zero violations, so no expected fingerprint was recorded. A reviewer probe confirmed the scan is genuinely scoped — an injected violation outside the consumer is not reported, inside it is — and that it evaluates 12 rules including `target-size`, proving `wcag22aa` applies. Nothing disabled or excluded. | Working tree, chromium |
| Failure diagnostics | A deliberate page error and a deliberate assertion failure each failed the run and left `test-failed-1.png`, a valid `trace.zip` and `error-context.md`, reachable from the HTML report. Both faults removed; no probe file remains. | Working tree, chromium on Node 24 |
| Project gates | `npm run lint`, `npm run build`, `npm run build:docs` all pass. | Working tree |

Commands and fixture usage are published in [the internal testing guide](../../../design/testing.md). Environment: Playwright 1.63.0, Node 26.8.2.

**Runner bumped.** On 2026-09-20 the owner chose to move `@playwright/test` from `^1.59.1` to `^1.63.0` rather than install the older browser builds, after an out-of-project `npx playwright install` had fetched 1.63's browsers and pruned 1.59's firefox. Chromium `1243`, firefox `1543` and webkit `2359` are the matching builds. No suite, helper or configuration needed changing for the bump; the version-specific notes in the testing guide were re-verified against 1.63.0.

**Engine availability.** Chromium and firefox both run locally and are verified. WebKit is not runnable on this host and that is settled, not an open gap: the Ubuntu 24.04 build fails to load with `error while loading shared libraries: libicudata.so.74`, and Playwright asks for `libicu74`, `libxml2` and `libflite1` against Arch's much newer ICU. WebKit evidence comes from CI only.

| Engine | Components | Docs smoke | Source |
|---|---|---|---|
| chromium | 59 passed | 5 passed | local and [CI run 35521385395](https://github.com/rashfael/buntpapier/actions/runs/35521385395) |
| firefox | 59 passed | 5 passed | local and the same CI run |
| webkit | 59 passed | 5 passed | that CI run at `dc586ed`; not runnable on Arch, so CI is its only source |

**WebKit findings from that run, both test defects.** `forced-color-adjust` was read through the `forcedColorAdjust` IDL alias, which WebKit does not expose, so the read was `undefined` before the assertion could say anything about the page; it now reads the property and asserts the guard's intent, that the value must not be `none`. The date-picker docs smoke case installed a frozen clock it did not need — nothing in either docs case asserts a date — and that call is removed. The forced-colours fix is near-certain: chromium and firefox both return `auto` from the property, and `getPropertyValue` returns `''` for a property an engine does not implement, so the case cannot fail again for that reason. The clock removal is a hypothesis, not a verified cause: the same case passed on WebKit at `e1e0d4b` with a clock installed, so the trigger may instead be the move from Playwright 1.59.1 and webkit-2272 to 1.63.0 and webkit-2359, whose clock implementation differs. One migration difference is that the docs page is now the first navigation under the frozen clock rather than the second. If WebKit still fails, the next step is waiting on a hydration signal, not a longer timeout and not an engine skip.

Both fixes were confirmed by [CI run 35521385395](https://github.com/rashfael/buntpapier/actions/runs/35521385395) at `dc586ed`, where all three engines and the lint/build job passed. That closes the three-engine criterion.

## Outcome

Accepted by the owner on 2026-09-20 with the instruction to mark the work done, after they added `23f3ec8` simplifying the test code and making the button fixture's async case deterministic — a promise resolved by an explicit control instead of a 50 ms timeout, the generated page's entry module inlined in place of the virtual-module plumbing, and the unused `violationFingerprints` helper removed. That commit passes both suites on chromium and firefox locally and has not itself been through CI; the engine evidence above is from `dc586ed`.

Delivered in `46766e7`, `dc586ed` and `23f3ec8` on `v3`. Durable output is [the internal testing guide](../../../design/testing.md), which carries the retention policy, the suites and commands, the fixture arrangement, the shared helpers and the failure diagnostics. Accepted follow-ups are in [the backlog](../../../TODOs.md).

One acceptance criterion remains explicitly unmet by agreement rather than by omission: [accessibility](../../../design/accessibility.md) item 8 asks for `prefers-reduced-motion` handling, and the library has none, so the reduced-motion case is a placeholder. The brief scoped this delivery as a demonstration of the accessibility helper rather than completion of the button's beta checklist, and M4 owns the remediation.

**Outside the brief's allowed areas.** `.gitignore` gained `test-results-docs` and `playwright-report-docs`; without it the docs run's generated artifacts would show as untracked. `design/date-picker-interaction.md` and `quests/beta/work/date-pickers.md` had stale `tests/*.spec.ts` paths repaired, with their evidence claims untouched.

**Recorded, not fixed.** `bunt-button`'s `disabled` is `aria-disabled` only, so the control stays focusable and clickable with activation blocked by an internal guard; whether that is the intended contract belongs to the button and accessibility scope. `src/` has no `prefers-reduced-motion` handling, so the reduced-motion case asserts applicable behavior and [accessibility](../../../design/accessibility.md) item 8 is explicitly unmet for the button, with remediation owned by M4. `tests/` sits outside the `npm run lint` gate; extending it would require touching deliberately byte-identical migrated assertions, so it is left as an owner decision.
