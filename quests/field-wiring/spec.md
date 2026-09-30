---
status: active
parent: ../beta/spec.md
active: [self]
activity: design
next: obtain WebKit CI and packaging declaration evidence for final acceptance of input/select, pickers and checkbox; owner reviews checkbox for acceptance
waiting_on: WebKit CI results; packaging declaration evidence; owner's final acceptance after the 2026-09-23 tentative acceptance; owner acceptance of checkbox
profile: Claude Code, Opus 5.5 (1M context), for the 2026-09-23 record updates, rename and compact-hint change; earlier work in owner-selected Codex sessions
---

# Existing input contracts

Make the current input, checkbox, select and date pickers predictable to use without a form framework. An application should be able to pass a name, label, input attributes and listeners, make a control readonly, or supply hint markup without knowing its internal markup. Floating labels use text props only. This quest specifies that consumer contract and identifies the changes each current component needs.

The deliverable is a component contract matrix with representative consumer examples and explicit exceptions. It gives component delivery a concrete target and prevents each input from inventing its own forwarding, feedback and focus behavior. Keep the existing `field-wiring` path for incoming links.

## Authority and boundary

On 2026-09-20 the owner selected `@quest design field-wiring`, asked for a concrete goal and benefit, and directed that field abstractions wait until the form feature with validation: “standalone field is useless”. This authorizes reframing the quest and moving the wrapper and form connection into [validation/forms](../validation-forms/spec.md#deferred-field-abstractions). Forms remains deferred. The request authorized design, not component implementation.

On 2026-09-20 the owner accepted the input-contract scope with the amendment that the current floating-label look stays, requested a separate quest for future label placements such as labels on the left, and said “go for next step”. That accepted the scope and appearance constraint and selected attribute/event routing design without authorizing implementation.

On 2026-09-20 the owner said “agree on your routing proposal”, adopting its attribute targets, naming/id rules, native-event forwarding, whole-component focus notifications and public focus operation. The accepted contract is in [input routing](../../design/input-routing.md). This accepts the design; component implementation and the unrun probes below remain outstanding. Content slots and external feedback were selected as the next design topic.

On 2026-09-20 the owner accepted text props for simple content with matching slots overriding rendered content. Markdown support is a future idea. The owner also deferred new external-feedback props unless already present, retaining the use case “single input where a form isn't worth it”. Source inspection confirms no standalone `invalid`/`errors` props; input/select instead have the existing `validation` object. This supersedes their addition in the earlier shared-vocabulary direction. Compact hint suppression is intentional; its feedback gap is assigned to the future [compact-feedback quest](../compact-feedback/spec.md).

On 2026-09-20 the owner accepted readonly inspection and clearing behavior, while reopening the need for separate readonly/disabled states and rejecting the assumption that disabled means no tooltip access. No prop removal or replacement was decided. The owner narrowed forms to SPA `@submit` handlers reading reactive data: no default POST/GET serialization work or native reset support. Popup/embedded switching after mount has unspecified behavior for now; this explicitly supersedes the earlier live-transition guarantee for that particular change, without reopening other live CSS policies. The owner asked for native select Enter evidence; the proposal remains with [selection](../selection/spec.md#enter-and-spa-submission).

On 2026-09-20 the owner said “lets mark your proposals as tentantive approved”. Disabled discoverability while blocking activation, with control-specific focus handling, and the select-only Enter proposal are provisionally adopted. The working distinction remains readonly inspection versus unavailable actions. The proposed delivery order is also tentative: input/select first, consumer verification, then checkbox/pickers. This records design direction, not build authorization or final acceptance. Clear-token names and slot coverage still need concrete proposals; editable-combobox Enter remains with selection.

Inherit beta's [API guide](../../design/api-guide.md), [shared vocabulary](../../design/api-design.md#shared-field-vocabulary), [accessibility criteria](../../design/accessibility.md) and [testing policy](../../design/testing.md). The adopted vocabulary is the starting point; this quest specifies where declarations take effect and what behavior they promise. New control families consume applicable decisions when selected, but do not need their internal designs completed here.

On 2026-09-20 the owner said “go”, selecting the concrete clear-control and content-slot proposal below. The owner subsequently approved it with the amendment “lets not do slots for floating labels now”, citing complexity for maintainers and users. Input/select/picker labels use text props only; hint slots, checkbox label-slot precedence and the clear-control contract are accepted. This accepts design, not component implementation.

## Starting gaps

Source inspection before the input/select implementation on 2026-09-20; the table preserves the baseline observations. The [input/select work package](work/input-select-contracts.md) now records its delivered implementation, independent comparison and remaining external evidence.

| Source | Baseline behavior | Consumer benefit of settling it |
|---|---|---|
| [Input](../../src/components/input.vue) | Undeclared attributes fall through to the root div; the inner input has no forwarding binding. Only `update:modelValue` is declared as an event. | `name`, `autocomplete`, consumer ids and listeners reach their documented target. |
| [Select](../../src/components/select.vue) | Attributes are explicitly forwarded to the root; `readonly` reaches the textbox but selection handlers still emit values. | Attribute behavior matches input where meaningful; readonly prevents value changes through every built-in action. |
| [Both date pickers](../../src/components/date-picker/date-picker.vue), [range picker](../../src/components/date-picker/date-range-picker.vue) | `name` is on the display textbox, which is absent when embedded. No public whole-control readonly prop or shared external-feedback inputs. | Each supported presentation has a naming and focus target; transitions between popup and embedded are unspecified. |
| [Input styles](../../src/styles/components/input.sass) | Compact is 28px high and intentionally hides `.hint`, including validation text rendered there. | [Compact feedback](../compact-feedback/spec.md) owns the unresolved way to expose feedback within the height constraint. |
| [Checkbox](../../src/components/checkbox.vue) | Has its own name/label wiring and a readonly prop already slated for removal by the accepted API decision. | Shared rules state exceptions instead of promising the same interaction states on every native control. |

## Required contract and evidence

| Area | Recommended direction | Decision still needed |
|---|---|---|
| Props, models and content slots | [Content coverage](../../design/api-guide.md#input-content) is accepted: text-only floating labels, hint slots and checkbox label-slot precedence. | Consumer evidence outstanding; an errors slot is not selected. Vuelidate removal remains tied to the forms replacement. |
| Attributes and listeners | [Input routing](../../design/input-routing.md) is accepted. | Browser/consumer evidence outstanding; selection owns its eventual component taxonomy. |
| Names, descriptions and focus | Ids, naming precedence, description merging and the public focus operation are accepted in [input routing](../../design/input-routing.md). | Validation error association belongs to forms; compact feedback has its own future quest. Embedded tabindex/focus and SSR/hydration need verification. |
| Readonly and clearing | Readonly allows focus, copying and popup/navigation inspection; editing, selection commits, presets and clearing are blocked. The picker token `--input-clear: auto \| none` and its defaults are accepted. Required permits temporary emptiness. | Disabled focus handling is accepted. Live clear visibility, focus and browser/AT behavior need verification. |
| SPA form behavior | `@submit.prevent` handlers read reactive application data. Default request submission, composite serialization and native reset are outside support scope. Existing native attributes need no extra serialization machinery. | Selection owns Enter consumption for open versus closed controls; no FormData or hidden-input work. |

New application-supplied `invalid`/`errors` props and error-rendering slots are outside current input delivery. The [standalone feedback brief](../validation-forms/spec.md#standalone-input-feedback) preserves the small use case for later. Existing validation behavior and parser feedback remain; this deferral does not remove them.

Retaining today's per-component behavior is the lowest-change option, but would preserve wrapper-dependent attributes and readonly inconsistencies. A generic field adapter could centralize these concerns, but its responsibilities depend on the deferred form model. Specify observable control behavior now and consolidate shared implementation only where current components need the same responsibility.

## Floating-label appearance

The owner confirmed the current floating-label look on 2026-09-20 and clarified it as [Material v2 floating labels](../../design/appearance.md#label-appearance). Preserve its appearance while designing and delivering the input contracts. The SVG helper can stay; replacing it is no longer a prerequisite for this quest or new controls. An internal replacement would need to preserve that appearance and satisfy the [bridge inventory](../../design/js-bridge-inventory.md#outline-decision).

[Future label placement](../label-placement/spec.md) asks which additional placements to offer, including labels on the left. That quest is deferred and adds no beta gate. Its alternatives supplement the floating label. Selection and overlays must preserve the current appearance during their own changes unless the owner separately approves a visual change.

## Accepted routing

The owner accepted the [input routing contract](../../design/input-routing.md) on 2026-09-20. The evergreen document owns the contract and rationale; this record owns outstanding decisions and verification.

### Remaining evidence

Evidence checked on 2026-09-20: input/checkbox expose only root `el`; pickers have no public focus method; `CalendarPanel` exposes an internal `focusDay`; select declares `focus`/`blur` but never emits them. Vue supports explicit attribute routing, and declared events are consumed rather than inherited. Attribute splitting must read fresh attrs during rendering because `useAttrs()` is not reactive. See [Vue fallthrough attributes](https://vuejs.org/guide/components/attrs.html), [component events](https://vuejs.org/guide/components/events.html) and [public exposure](https://vuejs.org/api/sfc-script-setup.html#defineexpose).

Required probes before delivery: verify external labels and changing id/description bindings; listener delivery once with modifiers and internal handlers intact; textbox/action/popup focus transitions including null `relatedTarget`, dismissal and disable/hide; naming and focus in each stable popup/embedded presentation; embedded `tabindex` and focus when all days are unavailable; SSR/hydration ids. Use the current input, checkbox, select and both pickers in consumers. These are unrun checks; ARIA naming precedence follows the [accessible name algorithm](https://www.w3.org/TR/accname-1.2/#computation-steps), while actual spoken feedback still needs the project's AT evidence.

## Readonly, disabled and clearing

The accepted readonly behavior permits focus, copying and popup inspection, including navigation that changes only the viewed options/month. User edits, selection commits, presets and clearing are blocked; application model updates still apply. Clearing defaults to visible only for a nonempty editable control. CSS cannot authorize a blocked action, and `required` does not forbid a temporarily empty edit. These rules are in the [API guide](../../design/api-guide.md#readonly-and-clearing).

### Accepted disabled focus behavior

On 2026-09-20 the owner said “approved, next”, adopting the proposed control mapping and selecting the next design investigation. The [disabled contract](../../design/input-routing.md#disabled-controls) now defines one focus target per disabled control, blocked operation, state transitions and explanation access. This supersedes the disabled `focus()` no-op. The approval does not authorize component implementation or establish browser/AT acceptance.

The accepted trade-off is an extra Tab stop for every unavailable field and more activation guards than native `disabled`. Native disabling is simpler and lets users skip unavailable fields, but needs a separate reachable explanation. [APG guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols) describes the trade-off; [ARIA in HTML](https://www.w3.org/TR/html-aria/#att-disabled) permits ARIA disabled semantics with scripted behavior.

Source inspection on 2026-09-20: current entries use native `disabled`; tooltip listeners only cover mouseenter/mouseleave; select and picker handlers need guards beyond the textbox. `bunt-input` passes through arbitrary native types, while native `readonly` applies only to certain types. Verify each supported type before claiming the mapping, and return non-text types without a reliable focusable editing lock as an explicit exception for decision.

Remaining probes: editing through paste, drop and composition; disabled select/picker actions; disabling while focused/open without committing drafts; equivalent hover and keyboard explanations; visible focus; state and description announcements in the project's screen-reader combinations. Tooltip delivery remains an overlay dependency. The native checkbox probe below is partial evidence only.

### Native disabled and SPA submission probe

On 2026-09-20, `node quests/field-wiring/probes/disabled-native.cjs` exercised isolated native elements with Playwright in headless Firefox 155.0. [The probe](probes/disabled-native.cjs) cancels checkbox click activation, counts input/change/invalid/submit events, types into a readonly entry and calls `requestSubmit()` under four configurations. It does not mount Buntpapier or emulate a screen reader.

Pointer click, label click, Space and scripted `.click()` left the unchecked checkbox unchanged with zero input/change events. Typing left the readonly text value unchanged. Scripted activation is not AT evidence.

| Unchecked required checkbox configuration | Submit event | Invalid event |
|---|---|---|
| `aria-disabled="true"` | 0 | 1 |
| Native `disabled` | 1 | 0 |
| ARIA disabled, form `novalidate` | 1 | 0 |
| ARIA disabled, native `required` suppressed | 1 | 0 |

Chromium exited during launch; WebKit could not launch because host dependencies are missing. No results are claimed for those engines, actual components, focus transitions or AT.

### Accepted native validation boundary

On 2026-09-20 the owner accepted native validation as unsupported: “rely on our own, just making sure that a11y is set correctly”. The owner also stated the product goal: a complete UX and DX for SPAs, rather than MPA enhancement or decorated native inputs. [Product philosophy](../../design/philosophy.md) and the [SPA submission contract](../../design/api-guide.md#spa-submission) record these decisions.

Supported forms use `novalidate` with a submit handler reading reactive data. Buntpapier owns validation and feedback; native constraint validation, browser validation messages and native validity synchronization are outside support scope. Requiredness, invalidity and error associations must expose our state accessibly. This does not resume deferred forms design or add standalone feedback props.

The native checkbox probe above explains the boundary: browser validation can block the submit handler before it runs. Suppressing native `required` while disabled worked in that probe, but reproducing native validation participation would add an unsupported integration. Ordinary native editing and attribute routing remain in scope.

## SPA form scope and presentation transitions

Submit handlers read the application-owned model. Native `FormData`/request serialization, hidden inputs for composite values and native reset behavior are not delivery requirements. This does not remove submit buttons, form grouping, keyboard submission or event cancellation. Future `useForm` reset operations are a separate design question.

Popup and embedded modes each remain supported. Switching between them after mount is unspecified: no value/draft/focus/open-state migration contract or dedicated probe is required. This owner decision narrows the former shared live-presentation promise; [overlays](../overlay-lifecycle/spec.md) and [date input work](../beta/work/date-inputs.md) retain other lifecycle requirements. A concrete responsive use case can reopen it. This is not a new implementation task or permission to break either stable mode.

## Accepted tooltip ownership, 2026-09-21

Tooltips use a shared `useTooltip` composable. Buttons call it directly; the inline `v-tooltip` directive adapts its binding and lifecycle to the same implementation. Input and select have no tooltip prop or internal tooltip integration. Their field content remains `label`, `placeholder` and `hint`, with existing accessible naming and description associations.

Source: the owner discussion in this session on 2026-09-21. The owner requested “lets create a composable tooltip” while retaining inline directives for users, rejected the separate control-registration composable, and clarified: “input and select have no reason to get an external tooltip, no? they already have label, placeholder, and hint”. The subsequent request to record the decision adopts this scope. It does not accept the entire field-wiring implementation or close outstanding verification.

Internal wiring must not add DOM markers or search descendants to discover a component's control. The `data-bunt-entry` marker is removed. Renaming it, replacing it with a class, or introducing a separate wrapper-to-control registry would preserve integration that these fields do not need. Composable consumers pass element refs explicitly; the inline directive uses its attached element. Direct `v-tooltip` on input/select is no longer a supported field integration contract.

This supersedes the earlier direct-field-tooltip scope and C6 requirement in [input/select contracts](work/input-select-contracts.md#acceptance-and-evidence), and the equivalent P7 requirement in [picker contracts](work/picker-contracts.md#superseded-tooltip-scope-2026-09-21), which the owner asked to recheck when selecting that package for execution on 2026-09-21. A calendar day's disabled reason keeps its inline `v-tooltip`: the directive attaches to the day element itself, which the composable design still supports. It leaves the focusable-disabled decision intact: hints and caller descriptions can explain unavailable controls. Hidden compact guidance remains with [compact feedback](../compact-feedback/spec.md); this decision does not resolve that gap. The [shared tooltip record](work/tooltip-regressions.md#composable-refactor-2026-09-21) retains implementation evidence and the existing overlay deferrals.

## Content decisions and deferred work

Text-prop/slot precedence is accepted in the [API guide](../../design/api-guide.md#props-slots-and-css). The component owns naming and description associations when a slot supplies markup. This rule does not add an errors slot or a Markdown renderer.

Markdown support is deferred here. Revisit when a real label/hint authoring case warrants it; decide supported content, opt-in syntax, safe rendering and its relationship to slots before adding an API. Plain text remains plain text in the meantime.

[Compact feedback](../compact-feedback/spec.md) owns guidance/error access in the intentionally height-constrained layout. [Forms](../validation-forms/spec.md#standalone-input-feedback) owns the deferred standalone-input feedback use case. Neither investigation starts with this record update.

## Accepted clear-control and content-slot API

### Clear visibility

The accepted [clearing contract](../../design/api-guide.md#readonly-and-clearing) uses `--input-clear: auto | none`, inherited like `--input-size`, with `auto` as the fallback. Readonly and disabled block the action independently of CSS; `required` does not block clearing.

Both pickers expose a clear action today, in popup and embedded presentations. Replace their `clearable` prop with this token: callers wanting suppression use `--input-clear: none`; callers wanting the action use the default. This changes the current default of `clearable=false`. Input/select have no built-in clear action; adding one is a separate component decision. Checkbox has no clear action.

| Control | Model has a value when | Clear emits |
|---|---|---|
| Date picker | Model is non-null | `null` |
| Date range picker | Either endpoint is non-null | `{ start: null, end: null }` |

Clearing also discards the picker's draft or unfinished range selection. A draft alone does not expose the action. Preserve popup closing and focus restoration; embedded calendars stay mounted. Emit one model update, with no synthetic native input/change event.

```css
.booking-filters {
	--input-clear: none;
}
```

A shared token lets a container configure both pickers. Separate picker tokens duplicate the same policy. An `always` value would expose an action with nothing to clear; it has no selected use case. During delivery, verify inherited/live changes, invalid-value fallback, readonly/disabled guards and focus when the clear button disappears. The current style bridge does not establish arbitrary live CSS observation by itself.

### Content slots

| Control | Accepted label content | Accepted hint content |
|---|---|---|
| Input | `label` text only | `hint` / `#hint` |
| Select | `label` text only | `hint` / `#hint` |
| Date picker and range picker | `label` text only in both modes | `hint` / `#hint`; picker hints are already part of the adopted vocabulary |
| Checkbox | `label` / `#label`, with its existing default-slot fallback | No new hint surface |

Named slots take precedence over their text props and have no slot arguments. For checkbox, precedence is `#label`, then a nonempty `label` prop, then the default slot; this preserves existing default-slot behavior. Select's default slot continues to render options.

The checkbox label slot contains inline, noninteractive content. The component supplies the label element and association. Picker text labels name the textbox in popup mode and appear as the calendar group's caption in embedded mode. Hints belong to the same control description, merged with existing keyboard help and caller descriptions. A hint slot replaces guidance only; input/select validation messages retain their current priority. Compact hint suppression remains intentional and unresolved in its own quest.

```pug
bunt-input(v-model="reference", label="Booking reference", hint="From your confirmation")
	template(#hint)
		| Example:
		code AB-123
```

Source inspection on 2026-09-20 found that `useInputOutline` measures the label prop as text and select duplicates its visual label in the dropdown. The rejected floating-label slot proposal would require rendered-content measurement and additional authoring constraints. The owner's amendment removes that work from delivery. Revisit floating-label slots only for a concrete content need, potentially during [future label-placement design](../label-placement/spec.md). No browser or assistive-technology evidence has been collected for the accepted content contract.

## Deferred to forms

The [forms brief](../validation-forms/spec.md#deferred-field-abstractions) now owns `bunt-field`, custom/group control attachment, any `useFormField` helper, registration, logical field identity, draft/parse reporting to validation, participation and reset integration. It also owns the relationship between a label/hint/error wrapper and an editor-selecting `Field` renderer. Revisit together when the owner resumes form design; there is no standalone field deliverable in this quest.

## Open questions and completion

### First work package

On 2026-09-21 the owner deferred manual screen-reader tests across all quests until their setup is ready, then requested “define the checkbox and picker packages”. The [shared deferral](../beta/work/release.md#people-and-external-evidence) retains that evidence for later. This request authorizes the two package definitions below, not implementation or acceptance. Their definitions are complete and ready for execution selection; they need not wait for manual testing of input/select.

| Package | Outcome | State |
|---|---|---|
| [Checkbox contracts](work/checkbox-contracts.md) | Native checkbox routing, naming, label slots, focus and disabled behavior; remove ineffective readonly | Implemented and verified on Chromium/Firefox 2026-09-23; review findings fixed; awaiting owner acceptance |
| [Picker contracts](work/picker-contracts.md) | Both existing pickers in stable popup/embedded modes: routing, hints, focus, readonly/disabled and live clear policy | Implemented and verified on Chromium/Firefox; tentatively accepted 2026-09-23 |

Checkbox is the smaller next delivery. Both pickers share one package because they share the calendar and clearing contract; verify each control and each presentation separately. Their broader date-editing and overlay work stays with its existing owners.

The owner requested a work package on 2026-09-20. [Input and select contracts](work/input-select-contracts.md) defines its scope, acceptance matrix, execution boundary and evidence dependencies. Its original direct-field-tooltip requirement is superseded by the [tooltip ownership decision](#accepted-tooltip-ownership-2026-09-21). The owner selected implementation on 2026-09-20; the package owns its execution and evidence. Checkbox and pickers follow in later packages.

### Remaining questions

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| routing-evidence | Does the adopted routing work through focus transitions, live bindings and SSR/hydration? | prototype | Bounded execution selection; selection/overlays supply control and focus-transition policies |
| disabled-evidence | Does the accepted focusable disabled behavior work for supported input types and actual components? | prototype | [Accepted mapping](#accepted-disabled-focus-behavior); native checkbox probe is partial evidence; component and AT checks remain |
| select-enter | Verify the tentatively approved select-only Enter behavior and settle the editable case. | prototype, decide | [Selection evidence and proposal](../selection/spec.md#enter-and-spa-submission); editable/noneditable taxonomy |
| inline-naming | Is `inline` the right public name for the picker presentation that renders the calendar in the page without a textbox or popup? | decide | Raised by the owner on 2026-09-23; presentation policy belongs to [overlays](../overlay-lifecycle/spec.md); no rename decided |

Design is complete when the contract matrix covers input, checkbox, select and both pickers; examples expose the consequential choices; remaining browser/AT questions have bounded probes; and the owner has decided the API proposals. Floating-label appearance is already settled; future placements do not block completion. Delivery must then verify the selected contract in actual consumers under the testing policy. No passing behavior is claimed by this document.

Expected durable output is the accepted input contract in `design/`. Scope, floating-label appearance, routing, content coverage, clearing and SPA-only submission are accepted. Disabled focus handling is accepted; select-only Enter remains tentatively approved. Native validation is unsupported; editable-combobox Enter remains with selection; compact feedback, standalone external feedback, floating-label slots and Markdown are deferred to their linked homes.

### Shared-tooltip compatibility investigation

On 2026-09-21 the owner reopened tooltip compatibility after observing lost motion, lost intentional click-through, button activation and persistent display after clicking. The [tooltip investigation](work/tooltip-regressions.md) retains historical and current browser baselines and delegated accessibility research. The owner approved the compatibility repair, now implemented and independently reviewed. The earlier field-focused tests did not establish compatibility for buttons or generic directive consumers. The repair record also attributes five broader field/SSR failures to the captured before-state; they were [resolved on 2026-09-23](work/input-select-contracts.md#fieldssr-failures-resolved-2026-09-23) as a generated-id defect fixed in `4fc44fd`. The remaining input/select acceptance evidence stays open.

## Owner decisions, 2026-09-23

After the status report on 2026-09-23 the owner made four decisions in one reply.

The term “entry” is renamed: “yes, rename all occurrences of "entry" (afaik "control" is the replacement, but have a quick think for even better options)”. “Control” is adopted. HTML uses it for exactly this element: a label's labeled control, exposed as `HTMLLabelElement.control`. `src/utils/field.ts` already used it. The alternatives each fail somewhere: “focus target” splits under `inline`, where focus lands on a day while naming sits on the group; “native element” excludes the calendar group; “input” collides with `bunt-input` and `input` events; “widget” is ARIA-specific and the group has no widget role. The whole Vue component is called the “component”, so “control” no longer means both. Where “control” already meant a whole component next to the new sense, as in the routing contract and the pickers' `focus`/`blur` descriptions, it becomes “component”; loose uses such as “ordinary controls” stay. The rename covers evergreen design documents, public API pages, source, tests and open briefs such as the checkbox package. Records of delivered packages, dated evidence, owner quotes and archived research keep their original wording, where “entry” means the control. Other senses stay: option entries, build entry points, backlog entries and focus entry into a popup.

The inline calendar's hint follows input at compact size: “yes, inline calendar hint should behave just like input”. `--input-size: compact` hides it, as it does the popup picker's hint. The owner also found the `inline` name confusing, reading it as the textbox with a dropdown; it is recorded as `inline-naming` above.

Input/select and pickers are tentatively accepted: “otherwise, tentantive accept for both”. Final acceptance waits on WebKit CI and packaging declaration evidence; manual AT stays under the shared deferral. Neither package is retired.

The owner starts checkbox in a separate session (“I'll start checkbox separately”) and asked for the stale records to be updated first. The [checkbox package](work/checkbox-contracts.md#superseded-tooltip-scope-2026-09-23) no longer requires direct tooltip integration, and the five field/SSR failures are [resolved](work/input-select-contracts.md#fieldssr-failures-resolved-2026-09-23).
