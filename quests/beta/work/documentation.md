---
status: waiting
activity: close
next: present the reconciled beta plan and documentation checks for owner acceptance
waiting_on: owner-acceptance
profile: current owner-selected Codex session; model and effort not exposed
---

# Internal documentation organization

Owner request, 2026-09-18: organize planning work into quests and evergreen internal documentation in `design/`, keeping the rendered public `docs/` separate. The owner also requested that current documents omit references to the documents they replace.

Scope: organize records, preserve decisions and unresolved questions, repair links and prototype paths, and verify the result. This does not resume deferred product work. The [beta quest](../spec.md) owns product continuation; [the design index](../../../design/README.md) is the evergreen entry point.

## Verification boundary

The dirty starting tree was preserved in `/tmp/buntpapier-quest-migration-before`, with a SHA-256 manifest checked against the copied files and starting commit `e1e0d4b09f59ac4baf3850f29425c2fe4c7ae82b`. This local capture distinguishes the migration from pre-existing untracked design files, project instructions, TODOs, `.claude/` and edits to `docs/guide/why.md`. It is temporary verification material, not a resume dependency.

Acceptance criteria: every planning topic has a discoverable home; decisions and alternatives survive; deferred states and dependencies survive; evergreen pages stand without quest links; local Markdown links and moved prototype paths resolve; public docs, product code and unrelated work remain unchanged. Results below cover the organized tree on 2026-09-18.



## Verification results, 2026-09-18

- Local checker `/tmp/check-buntpapier-quest-migration.py` passed: 178 local Markdown links across 21 documents, target headings, quest state and parent paths, evergreen independence from quest files, retired-reference scan and whitespace. The check also compared preserved files with the before-state hashes, including public docs and unrelated root documents.
- Prototype relocation passed exact-content comparison: the HTML is unchanged; the runner differs only in its usage path and package-resolution depth. `node --check quests/style-observer/prototype/run.mjs` passed, and `createRequire` resolved the project's Playwright installation from the new location. Browser experiments were not rerun.
- `git diff --check` passed. Prose lint ran on the changed indexes, evergreen guidance, beta spec, documentation record and project instructions; flags were reviewed. Existing historical wording and unrelated project-guide text were retained where no edit was needed.
- Independent Codex review, Sol at high effort, compared the captured starting state with the changed scope and checked the final live tree. Observer retirement is conditional on its deferred decision; the interaction record distinguishes implemented keyboard behavior from future range editing. Both findings were fixed; the final review reported no remaining substantive issue.
- The two precursor drafts were removed at the owner's request. Retained planning evidence uses the combined assessment and subsequent subject records.

Project instructions now route durable design, quest state and backlog work to their respective homes. Their links were checked statically; behavior in fresh client sessions was not tested. Product builds and suites were not rerun because product code and rendered documentation are unchanged. The beta's browser and assistive-technology evidence remains with its product work records.

## Readiness reconciliation, 2026-09-19

The owner accepted the [readiness review](../research/2026-09-19-readiness-review.md), requested integration and deletion of the root picker plan, and explicitly discarded the README TODOs. Scope: apply the ownership/dependency and working-format changes, preserve useful date-picker requirements and alternatives, add delivery/release records, repair references and verify the documentation. Infrastructure remains a planned separate quest; no infrastructure implementation or product investigation is authorized by this consolidation. Forms and observation remain deferred.

The starting tree already contained the preceding review, infrastructure quest and navigation edits. A verified before-state of 32 relevant files, content hashes, HEAD, staged/working diffs and untracked inventory is at `/tmp/buntpapier-beta-reconcile-a8134sa_/`, based on `31d3b3675ca81a5aef5342559f024fcc7448ce0a`. This distinguishes the authorized consolidation from those pre-existing edits without changing the index. The capture is local verification material; current knowledge does not depend on its retention.

Required results:

- Beta owns the milestone inventory and actual prerequisites; detailed proposals and implementation candidates have one subject or delivery-brief owner.
- Forms owns logical field semantics; field wiring owns the mounted-control attachment signature. The independent ordinary-field path remains available.
- Infrastructure is planned and unassigned; its shared-style, announcer and verification scope is defined without implementation. Package/type design has its own early outcome and consumer evidence.
- Picker current behavior and rationale stand in `design/`; remaining editing has a focused work record; every substantive root-plan section is accounted for before deletion. Later candidates have one backlog home.
- Release evidence has a component matrix, shared/integrated scenarios, explicit manual/human-doc contributor gaps and artifact/migration requirements.
- All local links and state/parent pointers resolve. Accepted API decisions remain distinct from acceptance of the completed work record. Public docs, product code, tests, configuration and the existing index state remain unchanged.

Documentation was divided into independent edit scopes: picker consolidation and component briefs, with parent ownership/dependency and release work in the main session. A fresh reviewer checked the complete documentation delta against the captured before-state.

Verification results:

- Static checks passed for 302 local Markdown links across 32 documents, heading fragments, parent/active pointers, evergreen independence, root-plan deletion, README TODO removal and preserved deferred/planned states.
- Product code, tests, public docs, package/build/CI configuration and the staged index remain unchanged. No product suites, browser probes, builds or remote CI checks ran during this consolidation.
- `git diff --check` passed. Prose lint ran on the revised parent, subject records, delivery briefs and durable picker guide; flags were reviewed, including literal keyboard/navigation terminology and release-matrix placeholders.
- Independent review by a fresh Sol agent at high effort covered the full 23-file delta from the captured starting tree. It found ambiguous blanket infrastructure wording and an inaccurate description of end-only range initialization. Both were corrected. The final six-file correction review also confirmed the form/field async boundary, single accessibility-checklist authority, decorative-icon requirement and preserved deprecated-token retirement; it reported no remaining substantive findings.
- Before, reviewed and corrected snapshots are fingerprinted under `/tmp/buntpapier-beta-reconcile-a8134sa_/`. The final snapshot has 34 files including unchanged prototype resources. This verification-result append is a subsequent bookkeeping update; it makes no additional product or acceptance claim.

The owner adopted the organization and working format; acceptance of this resulting documentation work remains separate. Product scope selection, infrastructure executor assignment, deferred forms/observer decisions, manual contributors and release evidence remain with their owning records.
