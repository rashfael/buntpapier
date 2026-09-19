# API decisions and alternatives

Accepted authoring direction, recorded 2026-09-18. The [API guide](api-guide.md) explains the intended model. Implementation gaps and candidate token spellings below remain explicit; this record preserves rationale without implying that planned APIs already ship.

Ordinary components are the default. Primed components are optional for async workflows and complex integrations such as an editor. Async work alone does not require a composable: a button accepting an async click handler and showing its own loading and error states remains a natural ordinary component.

Props support content, current state and data, whether static or reactive. CSS custom properties configure presentation, including modality and dismissal policy. Primed components bind one shared state per composable call. They are views of that state; rendering them again does not create an independent workflow, and unmounting a view does not reset the workflow.

## Agreed authoring model

- Use ordinary components for ordinary form fields. A form with many selects should not need a `useSelect()` call for each field.
- Keep async convenience inside an ordinary component when it handles the interaction naturally. Loading and error feedback for one button click is the existing example.
- Offer primed components where binding a workflow or complex integration removes meaningful setup and repeated wiring. Loaders and document editors are the references.
- Keep data shape and frequency of change out of the eligibility rules for props. `disabled` remains a prop whether it is a literal or follows permissions; options remain valid props whether constant or reactive.
- One composable call binds one shared logical state. Create another primed instance with another call; app-owned inputs may still be shared explicitly. Local DOM resources belong to their mounted elements; multiple-mount support needs a contract for each kind of primed component.
- The composable's owning scope controls workflow lifetime. Temporarily unmounting the returned component preserves the operation and its state; remounting shows the current state without restarting the work.
- Prefer a functional returned component that reads state from the `useX()` closure. Create state, effects and actions in the composable; rendering produces a view of that existing state.

Presentation includes `dismiss` and `modal`, just as it includes shape, size and weight. Their effect on interaction does not move them into props. This supersedes the initial plan's broad rule that behavior belongs in props. `disabled` remains a prop for current application state.

## Existing examples

The axite sources are available under `/home/rash/rashraid/sober-council/home/rash/ax/axite/studio-frontend/src/`.

- `components/loader.ts` exports a generic `Loader` and `useLoader(asyncFn)`, which returns a `Loader` closing over loading and error state. `views/pipeline/index.vue` uses `const { Loader } = useLoader(...)` and `Loader: router-view`. The caller names one component and supplies the work once.
- `components/MonacoEditor/composable.ts` returns `Component` alongside the editor ref. `useLoroMonacoEditor()` binds a document and text object; `usePlainMonacoEditor()` binds a value ref and change callback. `components/QueryBuilder/QueryBuilder.vue` chooses the adapter in script. The template does not need to know which document integration it received.
- buntpapier already uses the same idea in [useInputOutline](../src/utils/input-outline.ts): it accepts label/radius refs and returns `Outline` plus `updateOutline`. [input.vue](../src/components/input.vue) renders `Outline` directly.

These examples establish a useful authoring pattern. Adapting them into a public component factory still needs the primed-component attachment contract (still to be designed), particularly for rendering, DOM attachment and multiple mounts.

## Alternatives considered

| alternative | example | benefit | cost |
|---|---|---|---|
| Props and events for all component inputs | `bunt-select(v-model="projectId", :options="projects", label="Project")` | Familiar Vue API, dependencies visible at the call site, works naturally in repeated templates | Complex controls accumulate bindings for state, data adapters and callbacks; apps write their own wrappers |
| Composable returning a binding object | `bunt-select(v-bind="projectSelect.bindings", label="Project")` | One template binding, ordinary component identity, logic usable separately | The binding object becomes a public API; spreads can hide collisions with explicit props and listeners |
| Composable returning a controller passed through one prop | `bunt-select(:controller="projectSelect", label="Project")` | One named object for data and actions; clear controller identity | Every renderer depends on a library-specific controller shape; an ordinary select may need setup code before it can be used |
| Composable returning a primed component | `ProjectSelect(label="Project")` | Binds data and behavior once, exposes a meaningful local component name, removes repeated state wiring | Must define state ownership, lifetime, forwarding, typing and what happens on multiple mounts |
| Compound components with context or scoped slots | `SelectRoot` with trigger, content and option children | Caller controls markup and composition; useful for custom layouts | More template structure and component names; this does little for the stated goal of reducing wiring in ordinary controls |

Chosen direction: ordinary components plus optional primed components for workflows and complex integrations. Making primed components mandatory or the default for ordinary controls would add setup to forms with many fields. Binding objects and controller props remain considered alternatives; neither is selected as the public authoring convention. Where both component forms exist, they should share the underlying implementation. Both public surfaces still need documentation and types.

## Where async work belongs

The existing button handles a promise returned by its click callback when `loading="auto"` is set:

```pug
bunt-button(loading="auto", @click="save") Save
```

That component can own the interaction feedback. A composable becomes useful when the operation has callers or consumers beyond the button: a keyboard shortcut starts the same save, another part of the screen displays its error, or loading continues while the button is absent. This is a design criterion for optional APIs, not a plan for a general task runner.

The current [button implementation](../src/components/button.ts) calls `props.onClick` directly and inspects its return value. That callback return contract must survive any refactor of the event wiring. The exact policy for concurrent calls, error propagation and cancellation belongs to a later workflow contract.

An ordinary select stays concise even if its options arrive asynchronously:

```pug
bunt-select(v-model="projectId", :options="projects", label="Project")
```

Backing `projectId` with a get/set computed does not by itself justify another composable. An adapter earns its place if it takes over useful work, such as mapping between a document value and its editor. Moving the same getter and setter into a new function can leave the amount of code unchanged. Judge the call site by the work it asks the author to do, including names and wiring, rather than line count alone.

## Content and state in props, presentation in CSS

Content and state can be declared statically or passed reactively through props. `disabled` can start as a literal and later depend on permissions. `label` can become translated. An options array can be constant while the selected value changes. Changing any of those facts should not require a new component API. Vue supports both static and reactive props, including object and array values. [Vue props](https://vuejs.org/guide/components/props.html#static-vs-dynamic-props).

The useful distinction is who owns the value and where declaring it is convenient:

| concern | working classification | example |
|---|---|---|
| Appearance and layout | CSS custom properties | size, shape, color, placement and spacing |
| Presentation policy | CSS custom properties | modality and dismissal policy; exact token names and values still open |
| Built-in controls and indicators | CSS custom properties | clear-button visibility and `--checkbox-icon` |
| Application-supplied button content | Props and slots, with the same reactive behavior for icon and label | `icon`, text and custom icon markup |
| Local content and current state | Props and slots, with reactive bindings supported | `label`, `name`, `required`, `disabled` |
| App-owned data and values | Props/models on ordinary components; bound inputs where a primed component is useful | options, selected project, date limits, external errors |
| Workflow state and actions | Local to an ordinary component or shared through a composable, according to scope | loading, retry, open/close requests, validation orchestration |
| Rendered interaction resources | Owned by each mounted component | element refs, focus targets, DOM IDs, observers |
| State that CSS and assistive technology consume | Native state or appropriate ARIA | checked, expanded, selected, invalid |

Callbacks belong with the operation or data they describe. They are not automatically reactive inputs just because they are functions. A getter for options and a predicate for filtering need distinct contracts. Vue composables can accept refs and getters to retain reactive dependencies; reading a plain value at setup captures that value. [Vue composable inputs](https://vuejs.org/guide/reusability/composables.html#input-arguments).

Modality and dismissal follow selectors and the cascade, including changes while an overlay is open. JavaScript reads the resolved configuration and applies the corresponding native behavior and semantics. Changing a backdrop's appearance alone would not implement modality. This extends the CSS bridge to presentation policies that require JavaScript even after native CSS replaces the visual variant classes.

The considered alternative was to keep every setting with interaction or accessibility consequences in props. That boundary was rejected: presentation itself can have those consequences. The implementation must keep native behavior and semantics consistent with the resolved CSS configuration.

Candidate syntax, with names and value grammar still to decide:

```sass
.confirmation
	--dialog-modal: true
	--dialog-dismiss: escape
```

CSS presentation settings apply live. Resolve the current policy before opening, then react to changes while open. Immediate updates mean applying observed changes without deliberately deferring them to the next opening; the bridge's detection latency remains part of the observer design. Reading policy only at opening was considered and rejected because it would make these CSS properties stop following the cascade for the duration of the interaction.

Live updates are the chosen API contract. Defaults, invalid-value handling, native transitions, focus and observer verification belong to the overlay lifecycle contract (still to be designed).

## Clear controls and icons

Agreed: clear-button visibility belongs in CSS. The existing `clearable` prop in the date pickers shows a control for clearing the value. It does not decide whether an empty value is allowed: [the single picker's `commitDraft()`](../src/components/date-picker/date-picker.vue) already emits `null` for empty input independently of `clearable`. Requiredness and validation remain separate from presenting that control. Exact CSS token names and the prop migration are still to be designed; the current components have not changed.

Button icons are content, like labels. Keep the `icon` prop and custom icon slot. Icon and label can both be literal or reactive and should update through the same normal component mechanisms. Showing the icon in the template also keeps an icon-only button understandable without requiring a class and a stylesheet lookup to identify its content.

Checkbox icons remain CSS presentation through `--checkbox-icon`. The component already knows it needs an indicator for the checked state; the cascade should choose that indicator's appearance for one checkbox or an entire context.

| alternative | outcome | reason |
|---|---|---|
| Clear-button visibility as a prop | Move to CSS in the future API | The setting presents a built-in action; it does not constrain the model |
| All named icons as props | Not selected | Checkbox indicators should follow the cascade |
| All named icons in CSS | Not selected | Button icons pair with labels as application content; moving them out of templates reduces readability and can require an otherwise unnecessary class |
| Button icon in props/slots, checkbox indicator in CSS | Agreed | Preserves reactive content authoring and cascading presentation |
| Optional CSS fallback for a button icon | Parked | Could supply a glyph when no Vue icon prop is defined; details are deferred |

The optional fallback does not change the primary button API. Its token name, handling of an explicitly empty icon and interaction with the icon slot remain undecided. It is recorded in [TODOs.md](../TODOs.md) with no implementation planned in this discussion.

## Calendar presentation and locale

Agreed mapping:

| current setting | future API | reason |
|---|---|---|
| `inline` | CSS custom property | Embedded versus popup presentation |
| `showWeekNumbers` | CSS custom property | Which calendar information is displayed |
| `monthsToShow` | CSS custom property | How much calendar is visible |
| `minDate`, `maxDate`, `disabledDates` | Props | Which values the application permits |
| `locale` | Application configuration with a local prop override | Formatting context is usually shared by the application but can vary per component |
| `parseInput` | Prop | Application-supplied interpretation of input |

The CSS settings update live while preserving the selected value. Changes between embedded and popup presentation need focus handling in the field/overlay contracts. Exact token names and migration details remain implementation work; the current props still ship.

The locale direction is an application default supplied through Buntpapier initialization, overridden by a component's `locale` prop. Initialization should establish the shared configuration, with a way to change the locale later; local overrides also remain reactive. The exact configuration/update API and fallback policy, including server rendering, need definition. [The current plugin](../src/index.ts) only registers components and directives and does not yet accept configuration. Its implementation must remain scoped to a Vue application rather than a process-wide singleton.

Locale configuration does not select a translation engine or expand the parked native i18n idea. The plan's existing built-in strings dictionary and a locale for formatting are related configuration concerns; their exact connection belongs to the initialization/strings contract.

## Shared field vocabulary

Use the existing input/select names and the validation names selected for the intended API. A field is one logical value with a name, guidance and validity feedback; its control may contain several interactive elements. Ordinary components expose these declarations directly. A future `bunt-field` can supply the same vocabulary for custom controls and groups without becoming mandatory around an ordinary input.

| name | meaning | boundary |
|---|---|---|
| `modelValue` / `v-model` | The application-owned value | Each control retains its value type; a date's editing draft is distinct from its committed model |
| `label` | Text identifying the field | Content; the accessible name stays stable when its popup opens |
| `hint` | Guidance for entering or choosing a value | Content distinct from validation feedback; visibility alongside errors belongs to validation design |
| `placeholder` | A short cue shown while the entry is empty | Optional content; the field still needs an accessible name |
| `name` | The field's form name | Distinct from its DOM id and visible label; serialization and registration belong to later contracts |
| `required` | Whether the field requires a value | An application constraint; clear-control visibility remains CSS presentation |
| `disabled` | The field is unavailable for interaction | Current application state; applies to the whole control, including its built-in actions |
| `readonly` | The user can inspect the field but cannot change its value | Meaningful on editable fields; a readonly textbox inside a picker does not make the whole picker readonly |
| `invalid` | Application-supplied invalid state | A boolean; combining it with other validation sources belongs to validation design |
| `errors` | Application-supplied validation messages | `string \| string[]`; message order, display and announcements belong to validation design |

All of these remain reactive declarations. No distinction is made between a literal `disabled` and one derived from permissions. `rules` and `validateOn` describe validation execution and stay in validation design. Rich label/hint/error slot contracts, generated ids, attribute routing and group semantics stay in component contract design.

### Comparison with the current source

Checked against this working tree on 2026-09-18. This comparison records the implementation gaps at that date.

| concern | input | select | date picker / date range picker | intended common API |
|---|---|---|---|---|
| Value | String/number model | String/object/number model | `Temporal.PlainDate \| null` / `DateRange` | Keep each value type and `v-model` |
| Label and empty cue | `label`, `placeholder` | `label`, `placeholder` | Both props on both pickers | Keep names; stable accessible naming belongs to field wiring |
| Guidance | `hint` text | `hint` text | No `hint` prop; single picker has fixed keyboard/format help | Add the same `hint` declaration to the picker family |
| Form name and requiredness | Neither explicitly reaches the inner input | Neither explicitly reaches the inner input | `name` reaches the popup input; no `required` prop | Wire common declarations to the logical control; embedded pickers need a submission contract |
| Availability | `disabled` reaches input | `disabled` reaches input; selection handlers need enforcement | Both expose `disabled` | Apply state across all interaction paths |
| Readonly | Native input attribute | Native input attribute, with selection handlers still able to change value | No public prop; range textbox is always readonly while the calendar remains editable | Support whole-field readonly for input/select/pickers; define popup inspection in the field/overlay contract |
| Validation feedback | Vuelidate-shaped `validation`; joins messages into hint area | Same coupling | Single picker has local `draftInvalid` and `aria-invalid`; neither accepts external errors | Use `invalid` and `errors`; remove Vuelidate support without a migration phase, per [validation direction](#validation-direction) |

Source: [input](../src/components/input.vue), [select](../src/components/select.vue), [single picker](../src/components/date-picker/date-picker.vue), [range picker](../src/components/date-picker/date-range-picker.vue). The input docs advertise a hint slot, but the current template renders text directly; a shared slot API is future work.

`readonly` is a shared term where the control supports it, not a requirement to invent it for every native control. The planned removal of the ineffective checkbox `readonly` prop remains unchanged. `disabled` is not a substitute for a readable, focusable readonly text field.

### Alternatives and scope

Keeping separate names such as `helperText`, `errorMessage` or a library-specific `validation` object would preserve incompatible field APIs. Requiring a new field wrapper around every control would add markup to ordinary forms. The vocabulary keeps existing names, adds library-independent feedback inputs, and lets the field contract share their implementation.

This settles names and responsibilities. Error precedence, hint/error coexistence, when invalidity is shown, pending checks, form aggregation and reset behavior remain explicit validation design questions. No component implementation changed as part of this vocabulary work.


## Validation direction

Accepted 2026-09-18: Buntpapier owns form and validation orchestration. `useForm` is the chosen direction; `useForm(data, definition)` remains a working shape. Ordinary controls remain usable through props/models, with `invalid` and `errors` carrying application feedback independently of a validation library. Handwritten forms and JSON Schema builders are required use cases.

Remove the Vuelidate-shaped `validation` prop and its `$error`/`$errors`/`$touch` coupling when the replacement lands, without an adapter, deprecation period or compatibility release. Owning orchestration leaves room for a schema library; Valibot, Zod and schema interoperability remain candidates. No validator dependency, template binding, field renderer, repeater, rule nesting or timing/reset policy is selected by this decision.

## Remaining contract boundaries

Field wiring must define accessible naming, attribute routing, whole-field readonly behavior and validation attachment. Overlay contracts must preserve focus and logical state through live presentation changes. Primed-component contracts must specify DOM attachment, forwarding, types, mount limits and external cancellation. Initialization must keep reactive locale and strings scoped to a Vue application. Those mechanics remain undesigned; the accepted authoring model does not settle their signatures.

The broader native i18n idea and optional CSS fallback for button icons remain in [TODOs](../TODOs.md). Built-in strings and locale configuration do not select an application translation engine.
