---
status: waiting
activity: close
next: present the verified documentation organization for owner acceptance
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
