---
status: waiting
activity: close
next: confirm acceptance of the completed documentation outcome; preserve the already adopted API decisions
waiting_on: owner-acceptance
profile: current owner-selected Codex session; model and effort not exposed
---
# API design continuation

Updated 2026-09-18 after the owner closed and deferred the validation/forms discussion. Phase 1.3's vocabulary and design record are complete under the corrected documentation scope. [Phase 1.4 validation/forms](../../validation-forms/spec.md) is deferred, with proposals, evidence and resume questions preserved.

The adopted decisions in `design/api-design.md` remain binding. The waiting state concerns acceptance of this completed documentation work, not permission to use or reapprove those decisions. The owner accepted this distinction during the beta review on 2026-09-19.

## Completed work

- [API decisions](../../../design/api-design.md) now include the shared field vocabulary and a comparison with the current input, select and date-picker implementations.
- The owner subsequently excluded LLM-generated narrative prose from public docs, allowing mechanical documentation such as component references. The generated public guide and sidebar link were removed; the continuation's edits to `why.md` were reverted while preserving earlier changes.
- At the owner's subsequent request, the guide was restored as [evergreen internal API documentation](../../../design/api-guide.md). `AGENTS.md` links it as the starting point for component API design; the decision record retains alternatives; this work record retains phase history.
- [The roadmap](../spec.md) and [agent-facing project guide](../../../AGENTS.md) use the accepted API philosophy. The blanket behavior-in-props rule is superseded.
- [The contract subquests](../spec.md#subquests) own field wiring, native modality transitions, focus preservation, primed-view attachment/multiple mounts/cancellation and application-scoped locale/strings initialization and updates. The contract pages still need their detailed design and verification.

## Resume

When the owner resumes forms, read [validation/forms](../../validation-forms/spec.md). Buntpapier's own validation stack, `useForm` direction and direct removal of Vuelidate support without a migration phase are settled. Evaluate TypeScript-oriented schemas such as Valibot or Zod before fixing the definition API; no schema dependency is selected. Template binding, scoped slots, the generic `Field` renderer, rule nesting and behavior policies remain proposals. The owner dislikes `bunt-repeat`, mostly its name; do not assume a repeater component is selected. [Composable comparisons](../../validation-forms/composable-research.md) record the requested research.

Implementation was not requested. Follow the [dependency assessment](../../validation-forms/spec.md#what-can-proceed-without-the-template-api): independent Phase 1.5 contracts can proceed with template syntax open; form integration needs its own behavior and control-connection decisions. This is not completion of Phase 1.4 or a change to release criteria. Phase 1.1's style-observer work remains deferred, and the [bridge inventory](../../../design/js-bridge-inventory.md) remains the source for its related retirement conditions.

## Historical workspace and checks

At the end of that session, the remaining changes were internal design records and project instructions; public docs and navigation were restored to their pre-continuation state. Component implementations and exports are unchanged. Existing edits were preserved; no commits were made. Before-state copies of touched existing files are under `/tmp/buntpapier-api-design-before` for this session only.

Verification results are recorded in [the historical verification below](#documentation-verification). The deferred validation record identifies design scenarios that still need eventual implementation tests. [TODOs.md](../../../TODOs.md) retains the parked native i18n and optional button-icon CSS fallback ideas.

## Imported authority and documentation history

Continuation authority: on 2026-09-18 the owner requested the shared field vocabulary, a public API guide and continuation into Phase 1.4, then corrected the documentation scope: “don't put llm generated prose into docs (mechanical docs like for components is fine)”. The generated guide and navigation entry were removed, and the preceding continuation's changes to `why.md` were reverted while preserving earlier edits. Public narrative writing is outside agent scope. The owner subsequently closed and deferred [Phase 1.4 validation/forms](../../validation-forms/spec.md), retaining `useForm` direction and schema-library evaluation for resumption; undecided validation policies remain proposals. Effective executor: current owner-selected Codex session.

The owner then requested restoring the removed guide as evergreen internal documentation in `design/`. It is retained as [api-guide.md](../../../design/api-guide.md), with current/future API distinctions and corrected relative links. Public documentation and navigation remain unchanged.

## Documentation verification

The original documentation pass was checked on 2026-09-18 against the working-tree sources linked above. The results below are historical; the generated public guide was subsequently removed at the owner's direction. No component behavior or exports changed. Before-state copies under `/tmp/buntpapier-api-design-before` preserve the earlier work.

- `npm run build:docs` passed, including the new guide and sidebar entry. Existing VueUse annotation and Sass `unquote()` deprecation warnings remain.
- Local Markdown targets and heading fragments checked across the guide, rationale, design records, roadmap and `CLAUDE.md`; whitespace checked for tracked and untracked edited files.
- `node /home/rash/Projects/prose-style/prose-lint.mjs` run on the guide and affected design/project documents; flagged prose reviewed. New guide and validation/contract drafts have no hard-tell hits. Historical alternatives and unrelated roadmap prose were retained.
- Static review checked current/future API labels, shared vocabulary consistency and Phase 1.4/1.5 ownership. The revised `CLAUDE.md` was checked against source and linked decisions; its effect in a fresh agent session remains untested.

Phase 1.3's design record remains complete under the corrected documentation scope. New Phase 1.4 recommendations remain open decisions in [validation/forms](../../validation-forms/spec.md).

This record preserves prior reported results; the documentation migration did not rerun those builds or establish owner acceptance. The accepted authoring decisions and alternatives are independently readable in [the durable record](../../../design/api-design.md).
