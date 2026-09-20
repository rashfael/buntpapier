---
status: waiting
parent: ../beta/spec.md
active: [self]
activity: design
next: assign approved M1 including fixture migration and separate docs smoke coverage to a separate executor
waiting_on: implementation-executor-assignment
profile: current owner-selected Codex session; infrastructure implementation executor unassigned
---

# Infrastructure and verification

Make beta changes verifiable with the existing Playwright setup, shared helpers and useful failure reports. Keep temporary experiments out of the permanent suite. Deliver shared accessibility foundations when their first component needs them.

This quest owns verification policy, fixtures, CI integration, shared accessibility mechanics and the evidence workflow. Packaging owns exports and declarations; subject quests own component behavior; beta owns release requirements. Inherit [beta's constraints](../beta/spec.md#shared-constraints-and-durable-outputs), [accessibility acceptance](../../design/accessibility.md), [architecture](../../design/architecture.md) and [bridge retirement conditions](../../design/js-bridge-inventory.md).

## Authority and decisions

On 2026-09-19 the owner instructed “for the infra work, also create a quest and don't do it yourself” and accepted the readiness review's organization. Infrastructure implementation remains assigned separately. On 2026-09-20 the owner selected infrastructure design and planning, requested a mandatory/future split, chose a minimal first delivery, supplied the green baseline and described available devices. The additional request is to turn papierdrache's ephemeral testing approach into a skill and define when this library should retain tests. The owner subsequently approved the delivery proposal with the amendment that existing tests use owned fixtures and docs smoke tests remain clearly separate, and explicitly approved test-policy. The M1 brief incorporates that amendment; the accepted policy lives in [the internal testing guide](../../design/testing.md). Implementation remains unstarted with no executor assigned; approval of the plan does not establish delivery acceptance or an installed skill.

| Date | Settled decision / evidence |
|---|---|
| 2026-09-20 | Beta keeps reactivity-transform, definitely. `$ref`/`$computed` remain supported authoring conventions; typing work must accommodate them. [Beta](../beta/spec.md#parent-decisions-and-open-questions) owns this decision. |
| 2026-09-20 | Use `e1e0d4b09f59ac4baf3850f29425c2fe4c7ae82b` as the green historical baseline. The supplied CI run was independently retrieved; see starting evidence below. |
| 2026-09-20 | First delivery is minimal. The approved bounded unit is [M1: verification groundwork](work/minimal-verification.md), including migration of docs-dependent behavior tests. |
| 2026-09-20 | Available: Arch Linux, GitHub Actions, attachable Android devices controlled through Chrome, and an iPad inspected through ios-webkit-debug-proxy. Availability is owner-reported; no new device or screen-reader pass was performed. |

The owner adopted the mandatory/deferred split and M1/M2 delivery design on 2026-09-20, with M1 amended as recorded above. The test-policy decision is settled. M3–M5 retain their named local design questions; approving their place in the plan does not settle those mechanisms. Delivered outcomes still need verification and owner acceptance. Forms and observer replacement stay deferred under their own records.

## Starting evidence

Inspected on 2026-09-20 at HEAD `31d3b3675ca81a5aef5342559f024fcc7448ce0a`, with pre-existing documentation changes. No source, dependency, test or CI files were changed during this design.

- [CI run 35319016128](https://github.com/rashfael/buntpapier/actions/runs/35319016128) completed successfully on 2026-09-18 for [commit e1e0d4b](https://github.com/rashfael/buntpapier/commit/e1e0d4b09f59ac4baf3850f29425c2fe4c7ae82b). `gh run view 35319016128 --repo rashfael/buntpapier --json conclusion,headSha,status,url,jobs` confirmed successful lint/library/docs-build and Chromium, Firefox and WebKit jobs. [The workflow](../../.github/workflows/ci.yml) uses Node 24 and `ubuntu-latest`. This closes the missing-baseline question; it establishes neither manual AT nor final-beta evidence.
- `git diff e1e0d4b HEAD -- src tests package.json package-lock.json playwright.config.ts .github vite.config.ts` was empty. Historical CI applies to those unchanged committed inputs; docs and future changes still need their applicable checks. The 2026-09-19 discovery found 162 cases across five suites, 54 per engine; that count is discovery evidence rather than a CI pass count.
- [Playwright configuration](../../playwright.config.ts) already starts docs on port 5173 and the [isolated picker fixture](../../tests/fixtures/vite.config.ts) on 5174. [Picker helpers](../../tests/date-picker-helpers.ts) collect page errors and control the clock. Reuse this infrastructure and retain useful docs smoke cases.
- CI uploads an HTML report on failure, but the Playwright configuration enables neither screenshots nor traces. [Playwright's recording options](https://playwright.dev/docs/test-use-options#recording-options) support failure screenshots and retained failure traces using the existing runner.
- [package.json](../../package.json) has no type-check command, declaration generator, Vitest or axe integration. [Packaging](../packaging/spec.md) owns choosing declaration/consumer checks. Their absence does not justify installing a complete new testing stack first.
- Papierdrache's `CLAUDE.md`, `e2e/README.md`, `e2e/drive.mjs`, `e2e/journeys/stack.mjs` and `.gitignore` were read from `/home/rash/Projects/papierdrache`. It keeps reusable drivers, ignored `e2e/tmp/` scenarios and a small permanent journey suite. Repository-local scratch files resolve dependencies; browser contexts and disposable stacks isolate experiments. Its README and current CLAUDE.md disagree about default ports and which live instance is disposable. Transfer the workflow, deriving commands and process ownership from current project configuration, rather than copying defaults or blanket sandbox instructions.

## Mandatory work

“Mandatory” means required for the approved infrastructure outcome or an inherited beta acceptance requirement. Only M1 belongs in the first delivery. Later units become active when separately selected; they do not block independent design.

| Unit | Outcome and boundary | Evidence / dependency |
|---|---|---|
| M1: minimal verification groundwork | Migrate existing component behavior tests from docs pages to owned fixtures, isolate docs smoke in its own suite, share runtime-error handling and add failure diagnostics plus one accessibility scenario. Preserve existing behavior coverage and three-engine CI. [Bounded brief](work/minimal-verification.md). | Existing native button consumer, keyboard/focus, meaningful ARIA snapshot, scoped axe and media-mode checks. Passing existing/new cases on a named revision; no packaging, observer or forms dependency. |
| M2: ephemeral testing skill and retention policy | A reusable `ephemeral-test` skill and a Buntpapier scratch entry point using the existing runner, following the approved [testing policy](../../design/testing.md). [Design and delivery brief](work/ephemeral-testing.md). | Demonstrate a temporary repro, failure diagnostics, cleanup and promotion into an existing regression suite. Shares M1 helpers; may be designed independently. No second browser framework. |
| M3: package/type checks in CI | Run packaging's selected macro-aware source/Pug and packed-consumer checks locally and in CI. Packaging supplies commands and fixtures; infrastructure integrates them. | A deliberate invalid consumer fails and a valid consumer passes against the packed artifact. Reactivity-transform is settled; packaging feasibility remains the dependency. Add pure-logic unit tooling only with a concrete need. |
| M4: shared accessibility foundations | Establish shared focus/hidden-text rules, reduced-motion/ripple behavior and forced-colour treatment on actual consumers. Audit compact targets and retire deprecated colour-token definitions with consumer/migration evidence. | Existing acceptance governs contrast, target size and exposed states. Components own their remediations and field wiring owns IDs/associations. Live presentation must pass actual stylesheet-change cases even while observer replacement is deferred. |
| M5: announcement behavior and evidence workflow | Settle announcement transport with the first toast, validation or other real consumer. Preserve working picker-local announcements until integration is justified. Record automatic, device and AT observations in the release matrix. | Before shared-service adoption: installation/import use, two-app isolation, SSR/hydration, disposal, repeated messages and native-modal placement. App configuration owns strings; overlays own modal constraints; components/forms own when/what to announce. |

M4 and M5 need their own investigation when selected. Their briefs below identify the decisions and evidence without predesigning mechanisms. Reliable announcements and accessibility outcomes remain required; a particular `useAnnouncer` API, installer host or seven-second clearing timer is not an accepted contract.

## Shared accessibility briefs

| Area | Question / proposal to investigate | Evidence and stopping point |
|---|---|---|
| Focus and hidden text | Start with a visible `:focus-visible` outline and shared visually-hidden utility. Candidate tokens are `--focus-ring-color`, `--focus-ring-width` and `--focus-ring-offset`, with primary/2px/2px defaults. | Native/roving focus, nested surfaces, sticky/overlay obscuring, 3:1 contrast and forced colours. Settle token names with a consumer; use existing Vue IDs and leave field associations with field wiring. |
| Motion and forced colours | Prefer CSS media queries and system colours, coordinating ripple and contrast-bridge behavior. Shared duration/easing tokens need actual consumers. | Suppressed visual motion still completes lifecycle work and does not break observation. Borders/outlines expose states in forced colours. Emulation and real Windows observations remain distinct. |
| Compact targets and legacy tokens | Verify 24px hit areas or explicit accepted exceptions; remove deprecated `--clr-*-text-light` / `--clr-*-text-dark` definitions by beta after auditing consumers. | Test neighboring targets, not just a larger rectangle. Preserve derived replacements and migration references; package/style smoke covers token retirement. |
| Announcement transport | Compare local live regions with app-owned transport on the first shared consumer. Explicit installation, individual imports and native modal placement must compose. | Observe initial/repeated/interrupted messages, two apps, unmount and modal/nested cases with real AT. Resolve duplicate picker announcements before migration. Generalization needs an actual shared responsibility. |

Native-form scenarios must support `FormData`, implicit submit, external form association and reset as field wiring settles their behavior. Draft configuration changes and modal error feedback follow subject contracts. These are component delivery cases, not an M1 fixture framework to build in advance.

## Manual evidence and available coverage

Manual evidence is a short record of someone performing a named interaction and observing the result: revision, device/OS/browser/AT versions, date, steps, expected result, actual result and limitations. For example: on the iPad with VoiceOver enabled, open the picker, navigate dates, select one and close it; record the announced name/state and where focus returns. Remote DOM inspection supports diagnosis but does not record spoken output or gesture usability by itself. Automated scans cover only part of accessibility testing, as [Playwright's accessibility guidance](https://playwright.dev/docs/accessibility-testing) explains.

| Available environment | Useful evidence | Remaining boundary |
|---|---|---|
| Arch Linux + GitHub Actions | Three engine suites, keyboard/focus, ARIA, axe, light/dark and media-mode emulation; viewport/reflow checks and observed desktop browser zoom | A 320px viewport checks reflow; it does not itself record a real 400% browser-zoom pass. CI browser builds do not prove the supported browser floor. |
| Physical Android devices + Chrome | Real touch, viewport/virtual-keyboard and device-browser interaction; TalkBack observations when enabled and operated | Record each device/version. Remote Chrome control alone is not a TalkBack result. |
| Physical iPad + ios-webkit-debug-proxy | Safari/iPadOS interaction and inspection; VoiceOver observations performed on the device | Record the actual iPadOS/Safari/VoiceOver environment. Existing access can be used before researching better tooling. |
| Windows + NVDA/Firefox and contrast themes | Required combinations in the current release plan | Access/tester not supplied. Keep as a beta release gap; no dependency on M1 or M2. |
| macOS + Safari/VoiceOver | Desktop coverage named in the current release plan | Access/tester not supplied. iPad evidence does not fill a desktop result column. |

Use [the release record](../beta/work/release.md#people-and-external-evidence) as the single assignment/result matrix. Infrastructure provides reproducible scenarios; a device operator supplies observations. No request to acquire hardware is implied. Before beta closure, obtain outstanding required observations or have the owner explicitly revise the release evidence commitment. Optional JAWS stays optional.

## Future and deferred work

These items create no beta requirements of their own. A required component behavior cannot be deferred merely because a preferred tool is deferred.

| Topic | Question / outcome and existing evidence | Revisit condition / owning scope |
|---|---|---|
| Better iOS testing workflow | Research how to inspect/repeat Safari/iPadOS cases from Arch Linux while preserving real VoiceOver observations. Compare the current proxy with maintained alternatives, setup cost and automation limits; the owner's iPad/proxy is the starting evidence. | Separate planned `ios-testing` quest when selected or the current workflow blocks a concrete check. Create its record on selection with this quest as parent; inherit Linux/iPad constraints. Deferral starts no research and does not defer iPad checks. |
| Vitest or another pure-logic runner | Faster focused checks for substantial extracted date/state/validation logic | Add when an actual outcome needs non-browser tests and the existing runner is inadequate; macro-aware setup and one real case justify the dependency. Required logic coverage stays with that outcome. |
| Pug accessibility linting | Does an accessibility ESLint plugin catch useful mistakes in this template setup? | Investigate when repeated authoring errors justify it; demonstrate detection on real Pug before adopting. Browser/axe acceptance proceeds without it. |
| Automated AT / Guidepup | Can automation supplement stable manual scenarios in accessible environments? | After manual scenarios and suitable machines exist. No substitution claim without evidence. |
| Broad performance, memory and visual regression suites | Large screens, theme changes, repeated mounting, hidden-subtree recovery and stable screenshot environments | Benchmark when a consumer, observer decision or regression provides a question and budget. Preserve targeted lifecycle/disposal correctness tests in ordinary delivery. Existing large-DOM theme tests and observer spikes are starting evidence. |
| Extra CI matrices and optimization | Minimum-browser installations, dependency-version matrices, sharding, caching or hosted device services | Supported-floor evidence remains a beta obligation; expand infrastructure when a concrete coverage gap or measured cost calls for it. |
| Cross-project skill rollout | Reuse the skill with papierdrache and other projects | Validate Buntpapier first, then select rollout. Papierdrache source is reference evidence; this quest does not alter its runner or reconcile its docs. |

## Alternatives and tradeoffs

| Choice | Strongest alternative / objection | Recommendation |
|---|---|---|
| First delivery | Record the already-green baseline and change nothing; fewer helpers are cheaper. | Use dedicated fixtures for all component tests, separate docs smoke, and add missing diagnostics plus a small accessibility case. The owner explicitly included this migration in M1; existing fixtures remain the starting point. |
| Permanent test level | Copy papierdrache's few broad journeys; fewer tests require less maintenance. | Make component contracts the main permanent browser layer. Independent consumers rely on keyboard, model, focus and CSS behavior that a few application journeys miss. Keep cross-component journeys few. |
| Temporary execution | Write raw Playwright scripts with a custom driver, as papierdrache does. | Use a scratch configuration for the existing runner, sharing fixture/helper logic. Raw scripts remain suitable for tiny standalone browser probes; no duplicate lifecycle runner is needed. |
| Announcement architecture | Build the shared installer service now, avoiding later migration. | Defer the mechanism until a consumer and modal/AT evidence justify it. Local live regions may suffice; global transport can complicate placement/lifetime. |

## Questions and sequencing

| Shortname | Type | Question | Dependency / next action |
|---|---|---|---|
| type-checks | research, prototype | Which macro-aware source/Pug and packed-consumer commands should CI run? | Packaging selects its scope and proves the checks; M3 integrates them. |
| accessibility-foundation | prototype, decide | Which shared CSS primitives satisfy the first consumer? | Select M4 with that consumer; its brief above is the investigation boundary. |
| announcer-lifetime | prototype, decide | Is shared transport needed, and how does it work across app/modal lifetimes? | Select M5 with a consumer and actual AT observation plan. |
| missing-release-environments | unblock, decide | How will required Windows and desktop Safari observations be obtained, or their commitment revised? | Release owner resolves before beta closure; available-device work continues. |

Assign the approved M1 to a separate executor first, then M2 using the same fixture/helpers. M3 follows packaging's commands. M4 and M5 follow their first consumers and can proceed independently of unrelated branches. No separate work specs are needed for their internal designs yet. Owner-approved implementation receives an isolated or captured starting state, a separate executor, appropriate checks and independent review under the quest workflow.

The owner approved this split, amended M1 scope and M2's policy/skill design on 2026-09-20; their proposal-adoption gates are closed. The remaining investigations have the briefs above. Eventual completion requires the selected units' evidence and accepted disposition of findings. Public narrative docs remain human-written. The accepted policy lives in `design/testing.md`; delivered verification instructions will extend it; reusable code lives with the test infrastructure and the skill's selected home. Release publication, observer replacement, forms implementation and unrelated component expansion remain outside this quest.

## Design verification

On 2026-09-20, checked this spec, both work briefs and the four updated parent/index/release/packaging records for local links, heading anchors and whitespace; all passed. `git diff --check` passed. Prose lint was run and its findings reviewed; technical uses of “harness”, “journey” and “navigate” were retained. Compared related-record edits with a captured before-state to preserve prior work. No executable files changed and no product tests were rerun. The CI baseline was independently verified as recorded above; proposed delivery criteria remain untested.
