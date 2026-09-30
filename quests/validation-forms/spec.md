---
status: waiting
parent: ../beta/spec.md
active: []
activity: design
next: present schema and authoring questions when the owner resumes forms
waiting_on: owner-resumption
profile: current owner-selected Codex session; model and effort not exposed
---
# Validation and forms

Own validation behavior, schema/definition boundaries and form authoring. Inherit the parent API decisions. The owner deferred this discussion on 2026-09-18; this migration preserves that gate. No implementation is authorized. Acceptance requires decided public behavior and authoring APIs, with the scenarios below verified to the depth needed for contract design. Durable accepted outcomes belong in `design/api-design.md` and the API guide.

Status: deferred by the owner, 2026-09-18. This discussion is closed for now; the forms contract is incomplete. Buntpapier will own its validation stack, use `useForm` and remove Vuelidate support without a migration phase. Exact signatures, schema integration, template authoring and remaining behavior below are proposals. This page owns [beta's form outcome](../beta/spec.md#milestone-scope-and-delivery-ownership) under the [shared field vocabulary](../../design/api-design.md). Component implementation has not been requested.

When resumed: consider TypeScript-oriented schemas such as Valibot or Zod together with the form definition and template API. Preserve the handwritten-form and JSON Schema builder use cases. Until then, the [dependency assessment](#what-can-proceed-without-the-template-api) identifies independent work; it is not a request to continue the deferred form design. The [existing input contracts quest](../field-wiring/spec.md) owns ordinary control behavior; this quest owns the deferred field abstractions and their form connection.

## Settled direction

Ordinary fields remain usable through props/models. The owner deferred new standalone `invalid`/`errors` props on 2026-09-20; the small use case is recorded below. Buntpapier owns rule execution and form validation. Remove the Vuelidate-shaped `validation` prop and its `$error`/`$errors`/`$touch` coupling when introducing the replacement, without an adapter, deprecation period or compatibility release.

The owner considers `useForm` settled in direction, with `useForm(data, definition)` as the working shape. DRY templates and JSON Schema form builders remain requirements. This does not settle rule nesting, the return object's members, field rendering or array-helper names. The owner dislikes `bunt-repeat`, mostly its name; no repeater component is selected.

On 2026-09-20 the owner excluded native validation and required library-owned validation with correct accessibility semantics. Inherit the [SPA submission contract](../../design/api-guide.md#spa-submission): `novalidate`, application-data submission, no native constraint-validation or validity-synchronization integration. This narrows the deferred design without resuming it.

## Schema libraries to revisit

The owner identified TypeScript-oriented schemas such as Valibot or Zod as a substantial finding from the [composable research](composable-research.md). Keep this choice open before committing to a custom rules-only definition. Owning the form stack leaves room to consume a schema library for validation and inferred types; it does not require implementing every validator ourselves.

On resumption, compare a native definition, schema-backed definitions and an interoperability interface such as Standard Schema. Decide where types come from, how schema input/output transformations relate to application values and control drafts, and where editor/label metadata belongs. Include async and cross-field checks, nested error paths and JSON Schema integration in that comparison. Schema validation and automatic editor selection are separate capabilities to evaluate. No schema library, mandatory dependency or adapter API is selected.

## Deferred field abstractions

On 2026-09-20 the owner directed that field abstractions wait until the form feature with validation. This quest now owns the optional `bunt-field` wrapper, custom/group control attachment and any `useFormField` helper together with form authoring. The deferral does not remove the beta outcome or resume this discussion. Revisit when the owner selects forms design; the usefulness and public shape of a wrapper must be established by actual form and custom-control cases.

Design one connection for value access, draft/parse reporting, whole-field interaction, feedback and focus targets, consuming the ordinary input contracts. Define registration, participation/reset plumbing and accessible feedback associations without a second logical-field registry. Keep the proposed editor-selecting `Field` renderer distinct from the label/hint/error wrapper until their relationship is decided. Public spelling may be a prop, binding object, slot or renderer; none is selected.

Preserve custom-control and group cases, including slot/text precedence, fieldset/legend semantics, error associations and summary focus. Each stable popup/embedded mode needs a usable focus target. The owner made transitions between those modes unspecified; they require no state-migration contract. The accessibility and failed-submit scenarios below remain required integration evidence; infrastructure owns announcement mechanics and overlays own native transitions.

## Standalone input feedback

On 2026-09-20 the owner deferred external-feedback props because none exist and the future form workflow should cover the main use case. Preserve the smaller case of a “single input where a form isn't worth it”: for example, one input with an application or server error and no form workflow. Revisit when that case is selected or when form design can show a useful shared implementation; do not add props now.

`invalid` and `errors` remain candidate names, not a delivery commitment. The earlier proposal was a boolean invalid flag and messages as `string | string[]`, with nonempty messages implying invalidity, hints alongside errors, and parser failures independent of clearing external messages. Their composition, timing and rendering still need a decision. An error-rendering slot is also unselected. Prefer reusing the form feedback rendering if the case proves useful.

Source inspection: current input/select expose a Vuelidate-shaped `validation` object; no current control exposes standalone `invalid`/`errors` props. This deferral supersedes the earlier plan to add those props ahead of forms and does not remove existing behavior. [Compact feedback](../compact-feedback/spec.md) owns the separate gap caused by intentional hint suppression.

## What can proceed without the template API

This is a dependency assessment and proposed local work order. It does not complete the forms contract or change beta's release criteria.

The 2026-09-20 owner direction supersedes the earlier split of form semantics and control attachment between two quests. This quest owns logical field identity, committed values and draft semantics, validation lifecycle, participation, reset meaning and the single mounted-control attachment signature. [Existing input contracts](../field-wiring/spec.md) supplies ordinary DOM naming, attributes, label/hint content and focus behavior for that integration to consume. Forms remains deferred.

| work | decision needed before it proceeds | template dependency |
|---|---|---|
| Overlay lifecycle, selection, initialization/strings, packaging | Their own contract decisions; validation message keys can follow the error model | None; validation does not block their design |
| Ordinary control labels, hints, attribute routing and readonly behavior | Shared field vocabulary and the relevant accessibility behavior | No choice between slots, a `field` prop and a renderer is needed |
| Connecting controls to `useForm` | Value ownership, draft/parse reporting, whole-field interaction, feedback state, focus targets and reset participation | Define these responsibilities before selecting the public spelling |
| Validation engine and form aggregation | Declared-field lifetime and participation, async result/dependency handling, structured error locations and reset semantics | Can be designed independently of template syntax |
| Nested arrays and schema adapters | Object/array structure, collection-level failures and row identity separate from array position | Ordinary loops, slot helpers and generated rendering can share this model |
| Public form release and preferred examples | Chosen template API, prop/slot types and Pug/IDE verification | Required before publishing that surface; can stay open during independent work |

Recommended boundary: `useForm` owns logical field state; mounted controls attach their DOM resources and interaction reporting. A missing view should not automatically delete a declared field or its value. Whether that field participates in a particular validation request is a separate policy. This extends the accepted workflow-lifetime direction; exact participation rules still need a decision.

Keep committed model values, editing drafts and validation results distinct. A date control must be able to report an unparseable edit even while its last committed model value remains valid. Likewise, keep a logical field's identity separate from its current data path and any rendered DOM id. These choices affect every control adapter, array operation and error summary, so they belong before implementation of form wiring.

The exact `Field` API, direct-control binding, scoped-slot names, array helper component and rule nesting can wait. Ordinary `v-for` should remain possible. The generic renderer is interesting because a field definition can select a default editor once, but its editor registry and local override syntax need not block ordinary controls. The JSON Schema adapter can follow once the form model supports nested objects, arrays and errors at those levels; it must not require a second validation engine.

Feedback defaults, reset behavior and edits during pending submission may wait while unrelated contracts proceed, but must be settled before implementing those operations. Accessible error associations and announcements need verification before shipping field feedback. Deferring template syntax does not defer those correctness requirements indefinitely. [Comparable composable APIs](composable-research.md) provide references for this separation.

## Authoring API under discussion

The owner's starting point is `const MyForm = useForm(data, definition)`, with rules declared in script and a returned form component exposing aggregate errors. Templates should stay DRY. The API must also support builders that construct a component tree from structured data, with JSON Schema as the primary use case.

The owner considers the `field` prop viable and requested broader alternatives. [Form authoring alternatives](authoring-options.md) explores form/child scoped slots, bound field components, nested array references and loops, relative scopes and generated forms. A custom preprocessor remains secondary because of the owner's IDE-support concern. These remain candidates, with row identity, reuse and editor support as the main comparison cases.

The following baseline sketch proposes nested `rules` and a single `field` connection; the final shape remains open:

```ts
const MyForm = useForm(data, {
	email: {
		rules: { required, ...emailRules }
	}
})
```

```pug
MyForm(@submit="save")
	bunt-input(field="email", label="Email")
	SomeErrorBox(:errors="MyForm.$errors")
	bunt-button(type="submit") Save
```

In this candidate, `data` remains the application-owned model. The field connection supplies value updates, validation feedback and interaction tracking together. An explicit `v-model` connection remains an alternative. Decide the connection before fixing field-state access or the returned component's other members.

Explore writable computed values for editable projections and keep rule preprocessing distinct from control parsing and invalid drafts. A schema builder should use the same field connection as handwritten markup, with support for nested paths, changing arrays and checks on whole objects. Whether declared fields participate independently of mounted controls needs a decision; the earlier unmount-based proposal below is under review.

Keep validation pending distinct from the save request's pending state. Submission behavior, error composition/timing, draft handling and reset remain open; their design can proceed while template syntax is undecided.

## Current evidence

| source | observation | consequence |
|---|---|---|
| [input.vue](../../src/components/input.vue) | Reads `$error` and `$errors[].$message`, joins messages into the hint area, calls `$touch()` on input and blur | Feedback and interaction timing are coupled to Vuelidate |
| [select.vue](../../src/components/select.vue) | Same error/hint rendering; touches on blur, with the touch call during filtering commented out; selection emits the model without touching validation | Search drafts, committed selection and blur currently have inconsistent validation triggers |
| [date-picker.vue](../../src/components/date-picker/date-picker.vue) | Local `draftInvalid` sets `aria-invalid`; `commitDraft()` discards an invalid draft and leaves the previous model in place | Model-only validation can accept a previous value after a failed edit |
| [date-range-picker.vue](../../src/components/date-picker/date-range-picker.vue) | Its textbox is always readonly, while calendar interaction changes `DateRange`; embedded mode has no textbox | DOM text-input validity cannot represent the logical field in every presentation |
| [input.sass](../../src/styles/components/input.sass) | Compact layout intentionally hides the hint element, which also contains errors | The [compact-feedback quest](../compact-feedback/spec.md) owns message access within the height constraint |
| [src/index.ts](../../src/index.ts), [package.json](../../package.json) | No form component, form composable or validator exports; no Vuelidate dependency | This is new public behavior, not documentation of an existing form API |
| [current validation page](../../docs/validation.md) | Says Vuelidate is required and imports a nonexistent v3 path | Rewrite when the validation replacement ships; keep future examples clearly marked meanwhile |

Source inspection: current working tree, 2026-09-18. The [v2 validators](../../../buntpapier/src/validators/vuelidate) are useful edge-case references, not a selected runtime dependency.

## Feedback and timing proposal

The direct `invalid`/`errors` inputs below are deferred candidates for [standalone input feedback](#standalone-input-feedback). Form validation still needs its own result and display semantics; this section does not authorize adding those props.

`invalid` adds an application-invalid state; nonempty `errors` imply it too. `invalid=false` does not erase a parser failure or failed rule. Applications that need full external control omit local rules. Empty messages are ignored; invalidity without a message remains representable and needs a summary fallback.

Keep hints available alongside errors. They often explain how to repair the value. Recommend displaying all current messages in supplied order, with external messages followed by local parse/constraint/rule messages. This revises the initial roadmap's “first one shown, all announced on request” proposal, whose request interaction was unspecified. Compact size removes reserved space, not feedback. Announcement timing and the exact description markup belong to the field contract after this display policy is decided.

Keep known invalidity distinct from whether feedback has been revealed. Recommend `validateOn='blur'` as the default: reveal local failures on leaving the whole field, then recheck on value changes once that field has shown a failure, until validation state is reset. Moving focus from a picker input into its calendar is still inside the field. Explicit `input` and `submit` modes remain useful; `submit` mode stays quiet until an explicit validation request. Application-supplied errors are already actionable and appear when supplied.

An explicit `validate()` checks every participating field and reveals failures regardless of its automatic timing mode. A form with checks not yet run must not imply success merely because no error has appeared. Visual invalidity follows our validation state and feedback timing; native user-validity pseudo-classes are not its source. ARIA invalidity must reflect the feedback policy, including its delayed initial presentation. [WAI-ARIA `aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid).

## Accessibility

Expose our validation state and messages through ARIA, independently of native constraint validation. The field component generates associations from bound state so application templates stay DRY. Feedback timing and the exact error relationship below remain proposals.

### Rejected native validity integration

A nonempty `setCustomValidity(message)` sets a native custom error; it does not itself display a popup or announce the message. Chromium's current accessibility code maps that error to an invalid state even without a popup, unless explicit `aria-invalid` overrides it. Its native error-message object depends on a visible or previously created validation popup. This is source evidence for distinguishing invalid state from message exposure, not a screen-reader compatibility result. [Chromium invalid-state mapping](https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/modules/accessibility/ax_node_object.cc), [native error-message exposure](https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/modules/accessibility/ax_object_cache_impl.cc).

The owner excluded native validation integration on 2026-09-20. The source observations above preserve the investigated alternative; they do not create a `setCustomValidity()` or `reportValidity()` delivery requirement. Supported forms use `novalidate` and our own validation state.

### Field feedback

Start with `aria-invalid` on the control and visible error text linked through `aria-describedby`, preserving existing hint references. This is a documented WAI pattern. Set the invalid state when feedback is revealed; remove the error reference on correction. Compact hint suppression is intentional; the [compact-feedback quest](../compact-feedback/spec.md) owns how to expose messages within its height constraint. Composite controls need associations on their interactive controls or an appropriate group, not just a decorative wrapper. [WAI error identification](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21).

Illustrative rendered markup after validation, generated by the component:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" aria-invalid="true" aria-describedby="email-hint email-error">
<p id="email-hint">We use this address for account notifications.</p>
<p id="email-error">Enter a valid email address.</p>
```

`aria-errormessage` is the more specific error relationship; it could leave `aria-describedby` for hints. It requires `aria-invalid="true"` while relevant and a message users can access. Compare it with the description-based pattern on target screen readers before choosing the final mapping. Avoid linking the same error through both attributes by default, which risks duplicate speech. Neither relationship is a live region. [WAI-ARIA `aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage).

### Announcements and focus

Proposal: use a persistent polite live region for meaningful async results or blur feedback that would otherwise go unnoticed. Include the field label when focus has moved away. Pending validation is a checking status, not evidence that the value is invalid. Announce current results at the chosen feedback boundary, avoiding repeated announcements on every keystroke. Live regions can notify users without moving focus. [WAI live-region guidance](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA19).

On failed submission, reveal errors and offer a summary with links to usable field targets. Compare focusing the summary with focusing the first invalid field; coordinate that focus with announcements so the same failure is not spoken twice. Background async completion should preserve focus. [WAI form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/).

Verification still needed: pristine required fields, async completion after focus moves, correction and repeated failed submissions, and picker/group feedback. Compare both error relationships with NVDA on Firefox and Chromium, VoiceOver on Safari, and TalkBack on Android Chrome. Include native constraints with `novalidate` to detect premature invalid announcements. Browser accessibility-tree checks can verify state and associations; actual speech needs screen-reader testing. No browser or screen-reader probe has been run for this proposal.

## Values, rules and failures

Retain the candidate rule shape `(value) => true | string | Promise<true | string>` until dependency and cancellation requirements are decided. Rules receive the field's typed model. A select's filter text is not its selected value. An unparseable date edit must be handled before model rules can declare the field valid.

Recommend retaining invalid date drafts for correction and preventing a successful submit of the previous model while that draft remains. This changes the current picker behavior and requires an owner decision. The alternative is to keep reverting failed drafts, with explicit feedback explaining that the edit was not accepted.

An async result must apply only to the value and dependencies it checked. A late result cannot replace a newer result or revive a removed field's error. Reset or disposal invalidates outstanding results. Submission must never succeed for an outdated value; whether a changed value restarts a pending submit check or cancels that submit attempt remains a choice below. This quest owns async execution and stale-result handling; the field adapter reports interaction and attaches feedback under that policy.

A rejected promise or thrown exception means the check could not complete. Recommend blocking submission with retry feedback rather than treating it as a valid value or displaying an arbitrary exception as a validation message. Rules should return strings for expected invalid values. External server errors remain application-owned; typing or resetting local validation does not silently mutate those props.

Cross-field checks need explicit dependency behavior. A `sameAs` rule can read another field, but the API must also say when a change to that field reruns the check. Decide this before fixing validator helpers or adding boolean combinators. The first useful cases are required/email/length, date bounds, confirmation matching and one async uniqueness check; combinator naming can follow those cases.

## Form participation and reset

Owner scope amendment, 2026-09-20: native form reset and browser request serialization are unsupported. The form workflow serves SPA submit handlers reading reactive data. The application/form API reset proposals below remain separate from native reset behavior.


Recommend aggregating logical fields once, with messages linked to a usable focus target. Composite controls and groups must not register both their shell and each internal input as separate copies of the same value. Summary order follows the visible form order. This quest owns logical registration, identity and duplicate-name semantics; the form attachment designed here connects mounted views and the focus targets supplied by ordinary controls under that policy.

Disabled fields should be excluded from active form validation. The earlier recommendation to unregister unmounted fields by default is under review: a script-defined form or schema builder may need declared fields to retain validation while their views are absent. Compare those lifetimes using a wizard and conditional fields. CSS hiding alone does not mean unmounting. Whether user-facing readonly fields participate still needs a choice; the range picker's internal readonly textbox must never exclude its editable logical field.

Recommend `resetValidation()` for clearing local results, interaction history and pending checks while preserving application models and external errors. This avoids the initial proposal's ambiguous `reset()`. Resetting values is a separate application action. Native reset and any future value-reset convenience need an explicit model/draft policy before implementation.

## Decisions still needed

| question | type | recommendation / alternatives | blocks |
|---|---|---|---|
| Schema and type source | investigate, then decide | Native definitions, Valibot/Zod-style schemas or schema interoperability; retain the JSON Schema builder use case | Definition API, inferred types, validator boundary and transformations |
| Template authoring | decide, then prototype | `useForm` direction accepted; compare direct field binding, slots and a definition-driven `Field`, including a JSON Schema builder | Published template API and preferred examples |
| Logical-field handoff | decide | Define identity, value/draft state, participation and reset semantics; this quest owns the attachment signature under the [deferred field brief](#deferred-field-abstractions) | Finalizing the control adapter and form integration |
| Error composition and timing | decide | Additive invalidity, hints alongside all errors, blur then correction checks; alternatives: controlled override, first error only, submit-only default | Field display and validation state |
| Accessible feedback | decide, then verify | [ARIA feedback proposal](#accessibility); compare error relationships, announcements and failed-submit focus; native synchronization excluded | Field accessibility wiring |
| Invalid date draft | decide | Retain and block submit; alternative: revert with explicit feedback | Picker validation correctness |
| Edits during pending submit | decide | Cancel that submit attempt and require resubmission; alternative: restart checks against new values | Async submit outcome |
| Rule dependencies | decide, then prototype | Explicit reactive dependencies or explicit revalidation; compare with tracked rule reads using `sameAs` | Cross-field helpers and stale-result handling |
| Readonly/hidden field participation | decide | Distinguish logical readonly, CSS-hidden, unmounted and internally readonly controls; choose exclusions and focus behavior | Form aggregation and summaries |
| Reset scope | decide | `resetValidation()` preserves values and external errors; alternative: separately named model reset with a supplied baseline | Form methods |

Template authoring can remain open while independent contract work proceeds. The remaining proposals can change without reopening the own-stack decision, `useForm` direction, direct Vuelidate removal or the adopted field names and CSS/props decisions.

## Verification scenarios for the eventual contract

- A pristine required input stays quiet, reports failure after the chosen trigger, and clears feedback after correction.
- A server error appears on an otherwise valid value; `invalid=false`, local revalidation and local reset cannot erase the application's message.
- A date draft cannot produce a successful submit of an older committed date without the chosen recovery behavior being visible to the user.
- Opening a calendar and moving focus inside it does not count as leaving the field. Verify each stable popup/embedded mode; switching between them is outside the supported transition contract.
- An older uniqueness response cannot override a newer value; changing a value during submit follows the selected cancel/retry policy; a rejected check cannot count as success.
- Disabled, readonly, hidden and unmounted fields follow their stated participation policy, including error-summary focus behavior.
- Reset clears only its documented state, and a late promise cannot restore a cleared error.
- Error feedback remains usable inside a native modal; changing locale during an invalid draft and requesting submission in each supported presentation preserves the chosen value/draft and focus policy.

These are design scenarios, not passing tests. No validation implementation or browser prototype was produced in this session. The forms design completes when its public API and behavior choices are accepted. Independent subject contracts can proceed when selected; this quest finalizes form integration against the ordinary input contracts and its own behavior decisions.
