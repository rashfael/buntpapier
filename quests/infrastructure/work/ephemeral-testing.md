---
status: planned
activity: design
next: assign the approved ephemeral-testing delivery after M1 supplies shared fixtures and helpers
waiting_on: M1-and-implementation-executor-assignment
profile: implementation executor unassigned
---

# M2: ephemeral testing and permanent-test policy

Use disposable scenarios to investigate unfinished work, then retain only tests that protect useful behavior. The reusable skill supplies the workflow; Buntpapier supplies its runner commands and the rule for retaining component regressions.

Parent: [infrastructure](../spec.md). On 2026-09-20 the owner requested a skill based on papierdrache's ephemeral setup and a guideline for this component library. The owner subsequently approved the delivery proposal and test-policy on 2026-09-20. The retention policy is adopted in the internal testing guide; skill implementation and installation remain unstarted and belong to a separate executor. The approved design is not evidence of an installed skill.

## What transfers from papierdrache

Keep a committed harness, ignored scenario/output directories within the repository, fresh browser contexts, explicit ownership of test processes, and a decision to delete or promote each scenario. In-repository scratch files can resolve project dependencies. Papierdrache's `e2e/tmp/` and `e2e/drive.mjs` demonstrate that division; its permanent `e2e/journeys/` suite is a separate retention choice.

Buntpapier needs no backend, storage seeding, websocket instrumentation or system-Chromium-only runner. Use the existing Playwright/Vite fixture and pinned browser projects. A disposable repro may run in one engine first; delivery still needs the applicable three-engine evidence. Browser probes can use `page.setContent` when no Vue/library behavior is involved.

## Approved skill design

Name: `ephemeral-test`. Description: “Verify in-development behavior or investigate a bug with disposable test scenarios; use the project's harness and decide whether the result needs a permanent regression test.” Keep implicit selection available as well as explicit invocation. General rules live in the skill; project commands and retention criteria live in the project's testing guide.

Place the reusable skill in the existing dotfiles skill collection, alongside `test`; validate a draft with Buntpapier before installing it. A draft can be prepared inside this work's directory until the target is writable. Installation outside this workspace is a separate filesystem action under the execution session's permissions. Cross-project rollout is deferred. The existing `test` skill owns explicitly requested permanent test generation; this skill serves investigation and verification without automatically adding permanent files. Avoid changing the global `test` skill as an incidental part of this delivery.

| Step | Required behavior and observable stopping point |
|---|---|
| Select the question | Read project instructions and testing guidance. Identify the behavior, affected source state, smallest useful runtime and expected observation. A cosmetic adjustment can finish with inspection; a browser interaction needs browser evidence. |
| Select the harness | Derive commands and paths from current project configuration. Use existing scratch support and shared helpers. If it is missing, prepare a bounded local scenario; installing a new framework requires its own task. Establish which server/process belongs to this run. |
| Run the probe | Put scenarios and output in ignored repository-local locations. Use fresh state and bounded assertions. Capture failures and relevant diagnostics. Start/stop only processes owned by the probe; reuse a user server only under project/session authorization. |
| Interpret the result | Record the source revision or dirty-state boundary, environment, command, expected/observed behavior and limitation in the owning work record. A failing check is a finding; assertions change when the expected contract was wrong, not to conceal a product defect. Fix production code only within existing task authority. |
| Retain or clean up | Apply the project retention policy. Promote a valuable contract/regression check into the existing suite, deduplicating overlapping assertions; otherwise delete the scenario. Preserve a minimal repro while its bug remains unresolved and link its location. Stop only when findings have a home, owned resources are released and temporary material has an explicit disposition. |

The skill must work without a quest: report evidence in the current task when there is no owning record. It must not create quests, demand permission already supplied, or carry papierdrache's stale ports and blanket sandbox exceptions into another project. Durable results must remain understandable after temporary scripts and screenshots are deleted.

## Buntpapier runner design

Planned layout: committed scratch Playwright configuration/helper code under `tools/testing/`, ignored scenarios under `scratch/testing/`, and ignored diagnostic output under `scratch/testing/results/`. These are paths to implement, not current commands. Keep scratch files outside normal `tests/` discovery and outside build/package inputs. Prefer a thin second configuration over a custom driver; share browser options, fixture startup and M1 helpers rather than duplicating them.

The scratch command selects a scenario and engine, launches the existing fixture in an owned process, runs with failure diagnostics and exits nonzero on failure. Persistent tests continue through the ordinary configuration. An in-development Vue consumer can live beside its scratch scenario and be served by a scratch entry point using the same Vite plugins; it must not require a tracked edit to the permanent picker fixture for each experiment. Confirm dependency resolution and source/style imports when implementing this entry point.

No scratch files are discovered by ordinary CI, lint/build/package checks or retained browser suites. The committed scratch harness itself receives the applicable configuration checks. Do not create a second permanent registry of scenarios. Physical devices may use a selected fixture under the current device-access workflow; automatically provisioning devices is outside M2.

## Accepted retention policy

The owner approved test-policy on 2026-09-20. [Testing policy](../../../design/testing.md) is now the authoritative guide for choosing temporary probes, permanent component regressions and integrated scenarios. Docs smoke checks stay separate from fixture-based component coverage.

## Delivery acceptance

1. A documented command runs a scratch browser scenario against a scratch Vue consumer using the project's existing macro-aware toolchain and shared helpers. An intentional assertion/page error produces nonzero status and useful diagnostics. Failure and interruption release owned resources; pre-existing user processes remain running.
2. The scenario stays outside ordinary permanent-test discovery, CI, builds and package output. Normal discovery is unchanged. Bare imports work, the probe can select the required engine, and removing scratch material leaves the retained suite runnable.
3. Demonstrate promotion with a real useful regression if one is available: extend an existing suite, prove the broken/fixed behavior and remove the temporary duplicate. If no real regression is available, use a disposable validation patch and retain only the evaluation result, not a manufactured product test.
4. Evaluate the skill on an ephemeral-only investigation, a stable-contract regression, a cosmetic change and a failed probe. Check both explicit use and natural-language selection in the available client; record client/version and any untested client as a limitation. Follow writing-for-agents' evaluation procedure for the delivered skill. A fresh session can discover the installed skill and its project-policy pointer.
5. Extend the accepted `design/testing.md` policy with verified commands and add a short AGENTS.md pointer for test selection/verification. Point back to that policy from the skill; do not duplicate the table in global instructions. Review the skill and harness together, then present the named result for owner acceptance.

Acceptance evidence is pending. M1 supplies shared helpers, but does not authorize M2 implementation. A draft under the quest is review material until installed and evaluated; neither a plan nor a generated SKILL.md alone completes this outcome.
