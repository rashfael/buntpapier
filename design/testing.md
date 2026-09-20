# Testing policy

The owner approved this policy on 2026-09-20. Component behavior tests use dedicated consumers; documentation integration has a separate smoke suite. Migration of the existing docs-dependent tests and the reusable ephemeral-testing skill are planned tooling work. This page states the accepted policy; it does not claim those tools are installed.

## Retention policy

For this library, **permanent browser tests primarily protect component contracts**. A few application journeys cannot cover independent consumers' reliance on focus, events, models, native form semantics and live CSS presentation. Keep tests focused enough that failures name the broken behavior; related assertions can share one scenario when failure diagnosis stays clear.

| Change or question | Verification now | Retain when / where |
|---|---|---|
| Unsettled interaction/API experiment | Temporary browser consumer; compare observations with the proposed contract | Keep the finding in its work record. Promote assertions after the contract is adopted; speculative API shapes do not become permanent expectations. |
| Reproducible bug in a supported contract | Minimal regression, ideally shown failing before the fix and passing after | Add or extend a focused permanent case if existing coverage misses the cause. Avoid another test when an existing case can protect the same failure. |
| New/changed props, models, events, slots, disabled/readonly state or native form behavior | Consumer-level browser assertions on the public behavior | Permanent component contract tests, including meaningful error/recovery paths. Package types also need packaging-owned consumer checks. |
| Keyboard/focus, dismissal, naming/ARIA, live CSS, reduced motion, forced colours or disposal | Real browser checks; manual AT/device observations where required | Permanent focused browser cases for stable behavior. Browser evidence matters where layout, CSS or native behavior is involved; DOM mocks cannot replace it. |
| Substantial pure date/state/validation logic | Deterministic assertions on representative boundaries and failures | Focused pure-logic tests when they add protection; use the existing runner where adequate, add Vitest only with a concrete benefit. Do not extract code solely to make it testable. |
| Several components cooperate | A small consumer journey across the boundary | Retain a few integrated scenarios, including beta's settings/async-save and searchable-list/edit-dialog cases. Do not repeat each component's full matrix in every journey. |
| Cosmetic spacing, documentation or mechanical refactor | Inspection, targeted probe, existing checks as applicable | No new permanent test by default. Contrast, hit targets or a supported behavioral invariant make the change more than cosmetic. |
| Runner/helper or CI change | Temporary deliberate failure, artifact inspection, affected checks | Retain dedicated harness tests only for meaningful custom logic; avoid tests that merely repeat configuration. |

Prefer roles, accessible names and visible outputs. Test IDs are useful for otherwise inaccessible fixture state. Selectors and assertions should survive internal markup changes that preserve the contract. Avoid broad DOM/style snapshots, tests of private classes or exact timing without a timing contract. ARIA snapshots target meaningful public states.

The [accessibility checklist](accessibility.md) still requires axe tags, meaningful state snapshots, keyboard-pattern rows and three-engine evidence for delivered interactive components. “Few tests” does not reduce that coverage. Parameterize cases or extend an existing suite rather than creating a file per state. Emulation and scans supplement the required observed AT results.

Run focused checks during iteration, then the affected permanent cases and required project gates for delivery. Do not rerun unrelated suites after a documentation-only adjustment unless a required gate calls for it. Quarantine or expected failures need a named owner and removal condition; disabling a whole rule or rewriting a correct expectation is not a regression fix.

