# Testing policy

The owner approved this policy on 2026-09-20. Component behavior tests use dedicated consumers; documentation integration has a separate smoke suite. The fixture migration and suite split described under [Suites and commands](#suites-and-commands) are delivered; the reusable ephemeral-testing skill remains planned tooling work.

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

## Suites and commands

Browser tests are split into two suites that never share a server, each with its own configuration.

| Suite | Specs | Consumers | Server | Configuration | Results |
|---|---|---|---|---|---|
| Component behavior | `tests/components/` | `tests/fixtures/` | fixture Vite server on 5174 | `playwright.config.ts` | `playwright-report/`, `test-results/` |
| Documentation smoke | `tests/docs/` | the documentation pages | VitePress dev server on 5173 | `playwright.docs.config.ts` | `playwright-report-docs/`, `test-results-docs/` |

Both use the plain engine project names `chromium`, `firefox` and `webkit`. Component runs start the fixture server only and pass with the docs server stopped; the docs base URL and its startup belong to the docs configuration alone. The diagnostics options and the engine list are shared through `tests/support/playwright-shared.ts`.

WebKit cannot run on Arch, so its evidence comes from CI. Playwright's WebKit is built against Ubuntu 24.04's ICU: `~/.cache/ms-playwright/webkit-*/minibrowser-gtk/bin/MiniBrowser` fails with `error while loading shared libraries: libicudata.so.74`, and Playwright asks for `libicu74`, `libxml2` and `libflite1`, none of which Arch ships. Do not shim it.

| Command | Runs |
|---|---|
| `npm test` | the component suite on every engine — locally this fails on webkit, so pass a project |
| `npm test -- --project=chromium` | the component suite on one engine (`firefox` also runs locally) |
| `npm run test:docs` | docs smoke, same project names |
| `npm run test:docs -- --project=chromium` | docs smoke on one engine |
| `npm run test:report` | open the last component report (`npx playwright show-report playwright-report-docs` for the docs one) |

The two suites are two steps of the e2e matrix job in [the workflow](../.github/workflows/ci.yml), the docs step guarded by `if: !cancelled()` so a component failure cannot hide the docs result. That is where omission protection lives: dropping a suite means deleting a step, which is a visible diff in `ci.yml`, not a silent runtime condition.

## Fixtures

`tests/fixtures/` is a small Vite application with its own `vite.config.ts` and the reactivity transform enabled. It imports the library source and styles; it must never import docs examples, VitePress theme code or documentation content.

**A fixture is one `.vue` file.** A plugin in `tests/fixtures/vite.config.ts` generates the page around it: a request for `/<name>` (or `/<name>.html`) is matched against the `.vue` files present, served as the shared HTML through `transformIndexHtml`, and pointed at a virtual entry module that imports `mount.ts` and the component. Names match case-insensitively and ignore dashes, `/` lists the available fixtures, and an unknown name returns a 404 naming them. Only the dev server does this; nothing builds these pages.

| URL | Consumer | Used by |
|---|---|---|
| `/date-pickers` | `DatePickers.vue` | `date-picker.test.ts`, `date-range-picker.test.ts` |
| `/theming` | `Theming.vue` | `dark-mode.test.ts`, `light-dark-tokens.test.ts` |
| `/selects` | `Selects.vue` | `select-groups.test.ts` |
| `/buttons` | `Buttons.vue` | `button-a11y.test.ts` |

The shared host styling lives in `tests/fixtures/host.sass`: it declares `@layer typography, buntpapier` and sets the body surface from the public token. `mount.ts` imports it before `../../src`, so the fixtures establish the layer order the way a host application does. A consumer that teleports carries its own `#bunt-teleport-target`. Fixtures own their data; add a component rather than a switchable fixture registry.

The documentation sets `--bunt-will-change: all`, which re-reads computed styles every frame. Fixtures do not, so a JS-bridge value refreshes at mount and on a theme notification, which is a `class`, `style` or `data-theme` change on `<html>` or `<body>`. Writing the same value back produces no notification, so order fixture setup to end with the write that should trigger the re-read.

## Shared helpers

`tests/support/fixtures.ts` exports the `test` and `expect` both groups use.

- `pageLog` is an automatic fixture. It fails any test whose page threw an uncaught error and exposes `consoleErrors`, `vueWarnings` and `matching(pattern)` for the checks a suite owns, such as the colour-parse and `Extraneous non-props attributes` assertions.
- `axeScan(page, selector)` runs axe over one consumer with the tags the [accessibility checklist](accessibility.md) requires, exported as `WCAG_TAGS`.
- `violationFingerprints(violations)` reduces a result to `{ rule, targets }`, so an accepted known finding can be listed by rule and target without blinding the scan to a new violation of the same rule.

One criterion is explicitly **unmet**: item 8 of the [accessibility acceptance](accessibility.md) list asks for `prefers-reduced-motion` handling, and the library has none — `src/` contains no `prefers-reduced-motion` rule. The reduced-motion case in `button-a11y.test.ts` therefore only shows that activation and the async lifecycle still complete under the emulation, which the default context already shows; it is a placeholder until there is behavior to assert, and M4 owns the remediation. The forced-colours case in the same file is a real guard: `forced-color-adjust` must stay `auto`.

One runner detail costs time when rediscovered: Playwright treats `aria-disabled="true"` as disabled for actionability, so a click that must reach a component's own guard needs `click({ force: true })` (checked on 1.63.0).

## Failure diagnostics

Both configurations use `screenshot: 'only-on-failure'` and `trace: 'retain-on-failure'`, keep video off and add no retries. A failing run leaves an openable screenshot and trace without rerunning anything.

Locally the attachments land in `test-results/` and the HTML report in `playwright-report/`, with `-docs` suffixes for the docs suite so the two runs do not overwrite each other. Open a report with `npm run test:report`, or a single trace with `npx playwright show-trace test-results/<case>/trace.zip`. CI uploads all four directories on failure and keeps them for 14 days.
