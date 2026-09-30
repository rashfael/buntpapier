---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: compare the select and combobox taxonomy against concrete consumer cases
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Selection and naming

Define value identity, active-item behavior and keyboard selection for selects and calendars. Own select/combobox taxonomy so public names and interaction expectations are decided together. Beta retains the decision on whether multi-select belongs in the milestone.

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

## Required contract and evidence

Inherited: application-owned values and option data remain props/models on ordinary components. A shared workflow uses the logical state bound by its priming composable.

Specify value identity, active versus selected item, disabled items, groups, keyboard navigation and focus ownership. Own select/combobox naming together with this contract; settle that taxonomy before fixing a public signature. Done when the internal selection interface and emitted semantics cover a select and calendar example without inventing a public `useX()` API for every control.

## Questions and dependencies

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| select-taxonomy | Keep a filterable select plus a free-text combobox, or use a noneditable select plus an editable combobox? | decide | Consumer cases and current select API; the original roadmap recommendation is the latter, not an accepted decision |
| value-identity | How do value identity, active versus selected items, disabled items and groups compose? | decide, prototype | Cover both select and calendar cases; different focus strategies may be justified |
| keyboard-selection | Which navigation, typeahead, focus and emitted semantics belong in shared internal behavior? | decide, prototype | Taxonomy before public signatures; overlay lifecycle for focus entry, exit and dismissal |

A calendar may keep disabled dates focusable for inspection while a list control follows another navigation policy. The existing [picker interaction record](../../design/date-picker-interaction.md) is evidence to preserve or explicitly revisit, rather than assume one navigation algorithm fits every control.

Form validation, overlay mechanics and calendar parsing remain with their respective owners. Multi-select and customizable native select remain parent scope questions; discovering a dependency returns that choice to beta.

## Delivery brief

Own the select rewrite and the editable/free-text selection outcome under the selected taxonomy. The owner accepted this routing on 2026-09-19; the public names and exact interaction model remain open.

- Preserve value identity for primitives/objects, groups and disabled options while distinguishing filter drafts, active items and committed selection. Enforce whole-field disabled/readonly behavior through field wiring.
- Compare active-descendant and roving-focus approaches for the actual select/calendar consumers. Candidate shared responsibilities include active-index tracking, disabled-item navigation, grouping, typeahead timing, scroll-into-view and emitted selection semantics. Share `useListbox` or roving behavior only where policies match.
- Once the taxonomy is chosen, specify appropriate combobox/listbox semantics, stable naming, option ids and selection/group relationships. Cover Up/Down, opening shortcuts, Home/End, PageUp/PageDown, Enter, Escape and nonfiltering typeahead as applicable to the chosen pattern. Do not copy a keyboard table that conflicts with the selected editable/noneditable model.
- Preserve ordinary text editing, IME composition, paste/undo, autofill and mobile keyboard behavior; a composition confirmation must not accidentally commit an option. Verify result-count and selection announcements through infrastructure under the component's own feedback policy.
- Consume overlay positioning, dismissal and focus entry/return, ordinary input contracts and the retained floating-label appearance. Remove the teleported menu/theme forwarding and mirrored input only with verified native migration. Revisit the closed select's native text-selection highlight as part of this rewrite.

Beta retains multi-select scope; describing it as a later follow-up is a recommendation until that parent decision is made. Completion requires the chosen public API's declaration/consumer checks, pattern/keyboard/ARIA evidence in three engines and manual AT results. Pure selection/timing logic can use unit tests; native focus and popup behavior require browser scenarios.

Future durable output: selection semantics and the naming decision in `design/`, including alternatives, consumer examples, migration implications and representative keyboard/focus observations. A select rewrite is a later delivery action.

## Enter and SPA submission

The owner asked on 2026-09-20 how native select handles Enter, suggesting that the first press closes an open popup. The form use case is `@submit.prevent` reading reactive application data; native request serialization and reset are excluded. That selected a bounded evidence check without implementation.

Working proposal: when the list is open, Enter accepts the active selectable option and closes the popup, consuming that key so it cannot also submit the form. With no selectable option, consume Enter without a value update. During IME composition, preserve composition confirmation rather than committing an option or submitting. For a closed select-only control, Enter opens its list. A closed editable combobox may allow normal form submission when it has no selection/editing action to perform; finalize that case with the taxonomy and draft contract. On 2026-09-20 the owner tentatively approved the select-only behavior: closed opens; open accepts and closes without submitting. Treat it as the working design pending verification and final acceptance. The closed editable-combobox case remains undecided. This does not authorize implementation or start the rest of this quest.

The [WAI select-only combobox example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/) opens on Enter when closed, then accepts the focused option and closes when open. It is guidance for a custom widget, not a universal description of native select. [Mozilla's engineering discussion](https://bugzilla.mozilla.org/show_bug.cgi?id=1715027) reports platform differences for Enter on a closed native select, including opening, no action and submission; its historical observations do not prove every current browser. There is no reliable cross-browser rule that the second Enter submits.

Source review and bounded probe, 2026-09-20: a Playwright headless page contained a form with a text input, a two-option native select and a submit button; the submit handler prevented navigation and logged calls. Keys were Enter on the closed select, Escape, Alt+Down, ArrowDown, Enter, Enter, Escape, then Enter in the text input. Firefox 155.0 ignored Enter on the closed select and submitted from the text input. Alt+Down reported the native picker open, but synthetic ArrowDown/Enter did not change its value or close it, so the popup probe is inconclusive. Chromium headless-shell launch failed; WebKit lacked host dependencies. These observations are not three-engine native popup evidence. Stop this probe at those limitations; no environment repair or product change is needed for the current design question.

Current bunt-select always prevents Enter on its textbox; its handler commits an active option only while open. Selection delivery must deliberately implement the chosen open/closed/IME policy rather than inherit that blanket prevention.
