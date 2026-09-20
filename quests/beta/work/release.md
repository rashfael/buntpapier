---
status: planned
activity: verify
next: name the manual-test and narrative-documentation contributors, then attach evidence as each outcome is delivered
waiting_on: contributor-assignment-and-delivery-evidence
profile: release coordination unassigned; owner retains combined acceptance and publication authority
---

# Beta release evidence

Own the combined release evidence and publication preparation for [beta](../spec.md). The owner accepted this record's role with the readiness review recommendations on 2026-09-19. Creating the record does not establish passing tests, accept components or authorize publication.

## Evidence rules

Each delivered outcome must satisfy [accessibility acceptance](../../../design/accessibility.md), its subject contract and the applicable package-consumer checks. Link the actual test/report/manual observation, source revision, environment/version and date. Distinguish historical observations from the current result. Recheck evidence invalidated by relevant changes; an accepted scope reduction must be recorded explicitly before removing a criterion.

The table is the single release matrix. A dash means current evidence has not been attached here, even if the alpha already has an implementation or docs page. The picker baseline work reports historical Chromium/Firefox results. Infrastructure verified the owner-supplied three-engine CI baseline on 2026-09-20; see shared evidence below. Neither establishes remaining picker delivery, manual AT or the final artifact. Add rows if beta adopts additional scope; do not silently treat undecided candidates as delivered or excluded.

## Component evidence

| Outcome | Owning scope | Automatic / browser floor | Manual AT | Docs / migration | Packed consumer |
|---|---|---|---|---|---|
| Button | [Components](components.md) | — | — | — | — |
| Input | [Components](components.md), field wiring | — | — | — | — |
| Checkbox | [Components](components.md), field wiring | — | — | — | — |
| Circular progress | [Components](components.md) | — | — | — | — |
| Scrollbars | [Components](components.md) | — | — | — | — |
| Ripple directive | [Components](components.md) | — | — | — | — |
| Field wrapper | [Field wiring](../../field-wiring/spec.md) | — | — | — | — |
| Form workflow / public form surface | [Forms](../../validation-forms/spec.md) | — | — | — | — |
| Date picker | [Date inputs](date-inputs.md) | [Historical baseline only](date-pickers.md#review-boundary-and-evidence) | — | — | — |
| Date-range picker | [Date inputs](date-inputs.md) | [Historical baseline only](date-pickers.md#review-boundary-and-evidence) | — | — | — |
| Select | [Selection](../../selection/spec.md) | — | — | — | — |
| Editable/free-text selection | [Selection](../../selection/spec.md) | — | — | — | — |
| Tooltip component | [Overlays](../../overlay-lifecycle/spec.md) | — | — | — | — |
| Tooltip directive sugar | [Overlays](../../overlay-lifecycle/spec.md) | — | — | — | — |
| Dialog | [Overlays](../../overlay-lifecycle/spec.md) | — | — | — | — |
| Popover | [Overlays](../../overlay-lifecycle/spec.md) | — | — | — | — |
| Textarea | [Components](components.md) | — | — | — | — |
| Number input | [Components](components.md) | — | — | — | — |
| Radio | [Components](components.md) | — | — | — | — |
| Radio group | [Components](components.md) | — | — | — | — |
| Checkbox group | [Components](components.md) | — | — | — | — |
| Switch | [Components](components.md) | — | — | — | — |
| Slider | [Components](components.md) | — | — | — | — |
| Menu | [Components](components.md) | — | — | — | — |
| Menu item | [Components](components.md) | — | — | — | — |
| Toast and workflow API | [Components](components.md) | — | — | — | — |

Names follow the eventual subject contracts. A shared test can support multiple rows when its scope is explicit; a generic green suite cannot stand in for unexercised states. Record applicable limitations rather than claiming whole-application conformance.

## Shared and integrated evidence

| Outcome | Owner | Required evidence / current state |
|---|---|---|
| Named full baseline and repeatable checks | Infrastructure | [Run 35319016128](https://github.com/rashfael/buntpapier/actions/runs/35319016128) at `e1e0d4b09f59ac4baf3850f29425c2fe4c7ae82b`: lint, library/docs build and Chromium/Firefox/WebKit jobs passed; independently retrieved 2026-09-20. Future/final revisions need their applicable checks |
| Public declarations and package | Packaging | Selected imports, plugin/global components, props/models/events/slots, Pug/editor use, CSS and Node/SSR import from the packed artifact; pending |
| App configuration and strings | Initialization | English/German coverage, live locale/override changes, two-app isolation, disposal and SSR/hydration; pending |
| Shared accessibility styles and announcer | Infrastructure | Media-mode, contrast/target/focus cases, app lifetime, repeated messages and native-modal announcement evidence; pending |
| Live CSS presentation | Observer + overlays + consuming components | Real stylesheet changes while open, reduced motion, consumer transitions, hidden/show recovery and preserved state/focus; deferred prerequisites |
| Form attachment | Forms + field wiring | Ordinary native submission/reset plus bound validation, invalid drafts, async cancellation/stale results, summaries and usable focus targets; deferred forms prerequisite |
| Primed workflow, if published | Primed attachment + packaging | Named beta workflow, stable identity, forwarding, declared mount limit, view absence, scope disposal/cancellation and declarations; workflow selection pending |
| Settings form with validation and async save | Forms + component delivery | Keyboard, NVDA and VoiceOver, pending/invalid/success/recovery states, and human-authored public explanation; pending |
| Searchable record list with edit dialog and confirmation | Selection + overlays + component delivery | Keyboard, NVDA and VoiceOver across combined selection, editing, nested confirmation, dismissal and focus return; pending |
| Locale change during invalid draft and presentation switch | Date inputs + field/forms + overlays | Chosen committed-value/draft/feedback policy followed through failed-submit focus; pending |

## People and external evidence

The owner described the available environments on 2026-09-20. Availability does not establish a completed test or a named operator. [Infrastructure explains the manual evidence format](../../infrastructure/spec.md#manual-evidence-and-available-coverage) and retains a deferred brief for better iOS tooling. Existing device checks can proceed without that research. Required unavailable combinations remain release gaps until supplied or explicitly revised by the owner.

| Responsibility | Contributor / access | Completion condition |
|---|---|---|
| Release coordination | Unassigned; owner selects a coordinator | Maintain this matrix, reconcile scope and evidence, prepare the final artifact for owner acceptance |
| NVDA + Firefox | Tester and Windows machine unassigned | Per-component and integrated scenario results with versions/date; repeat affected cases after fixes |
| VoiceOver + Safari on iPadOS | Owner reports an available iPad with ios-webkit-debug-proxy; device operator/session still to schedule | Observe interactions and spoken output with VoiceOver enabled; record device/versions/date. Remote inspection alone is not an AT pass. |
| VoiceOver + Safari on macOS | Desktop machine/tester not supplied | Per-component and integrated scenario results with versions/date; iPad evidence occupies its own environment column |
| Android + Chrome / TalkBack | Owner reports attachable Android devices controlled via Chrome; device operator/session still to schedule | Real touch and virtual-keyboard observations; TalkBack results only when actually operated. Additional available evidence, not a new release gate. |
| Windows contrast themes | Windows machine/tester not supplied | Real contrast-theme checks; Linux/CI emulation supplements the record |
| Zoom/reflow and automated media modes | Arch Linux and GitHub Actions available per owner, 2026-09-20; manual operator still to schedule | Record real browser 200%/400% zoom separately from viewport/reflow and forced-colour/reduced-motion emulation |
| Optional JAWS | Licence/tester availability unknown | Record observations if available; absence does not add an unagreed release gate |
| Public narrative docs | Human author unassigned | Accessibility guide, validation explanation, migration narrative and explanations for both integrated examples |
| Mechanical references and examples' runnable code | Delivery executor selected per outcome | Component API and accessibility tables, strings inventory and runnable examples aligned with the shipped behavior |
| Publication | Owner retains authority; publisher unassigned | Publish only the specifically accepted artifact under explicit release authorization |

Public component pages need the pattern, roles/attributes, keyboard table, strings, limitations and last named manual test. Extend `ApiDocs` with strings metadata alongside props/style when implementing mechanical references. The human accessibility guide explains guarantees, app responsibilities and configuration. The validation page must stop advertising the missing Vuelidate import once the replacement ships. Keep these authorship/dependency requirements visible while implementation proceeds; assignment does not require starting the writing now.

## Artifact and release closure

1. Reconcile beta's pending scope decisions, including multi-select, slider scope, remaining picker outcomes and the actual primed workflow/public form surface. Preserve explicit exclusions and consciously deferred findings.
2. Check all component and shared evidence against the final source revision. Record failures and fixes; retain human author/manual-test gaps as open requirements.
3. Verify the packed JS, CSS, declarations, exports and runtime/peer dependencies from a consumer. Packaging owns the supported Vue/import contract. Confirm the intended prerelease version and publication channel.
4. Prepare changelog and migration material for alpha-to-beta API/CSS changes, including calendar presentation, selection naming, removed host teleport requirements, deprecated `--clr-*-text-light` / `--clr-*-text-dark` retirement and direct Vuelidate removal. Remove dependencies/exports only under their documented retirement conditions; retain the still-required colour utilities and Temporal runtime.
5. Present the combined outcome and artifact to the owner. Record acceptance separately from check results. Tagging, registry publication and docs deployment occur only under the corresponding release authorization and against the verified artifact.

This work record coordinates delivery evidence; it does not take ownership of component state machines or create a second backlog. Accepted durable contracts go to `design/`; remaining out-of-scope follow-ups go to `TODOs.md` before retirement.
