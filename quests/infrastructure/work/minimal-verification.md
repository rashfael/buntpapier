---
status: planned
activity: design
next: assign the approved fixture migration and verification groundwork to a separate executor
waiting_on: implementation-executor-assignment
profile: implementation executor unassigned
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

Design approved with fixture-migration amendment on 2026-09-20; delivery evidence pending. No new fixture, helper, dependency or CI configuration has been implemented or tested. The historical green run is linked from the parent; it does not verify this proposal.
