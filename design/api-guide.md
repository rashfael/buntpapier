# API design

buntpapier uses props and slots for content, application state and data. CSS custom properties configure appearance and presentation, including policies such as modality and dismissal. Ordinary Vue components are the default; optional primed components bind a workflow once when that makes the caller's work easier.

This evergreen internal guide describes the intended API. Implementation status was checked against `3.0.0-alpha.18` on 2026-09-18. Primed workflow APIs, application locale configuration and the CSS replacements for calendar presentation props are planned. The component pages document the current [input](../docs/components/input.md), [select](../docs/components/select.md), [date picker](../docs/components/date-picker.md) and [date range picker](../docs/components/date-range-picker.md) APIs.

## Ordinary components

A form field takes its value and data through normal Vue bindings:

```pug
bunt-select(v-model="projectId", :options="projects", label="Project", :disabled="!canEdit")
```

The same API works with constant options or options loaded from a server. A label can be a literal today and translated tomorrow. A model backed by a computed getter and setter is still an ordinary `v-model`. These choices don't require a composable per field.

An ordinary component can handle local async work too. The current button observes a promise returned by its click handler and shows loading and error feedback:

```pug
bunt-button(loading="auto", @click="save") Save
```

The handler must return its promise. Calling an async function without returning its result gives the button nothing to observe.

## Primed components

A primed component is a component returned by a composable with useful inputs already bound. It suits work shared beyond one interaction, or an integration such as a document editor that otherwise needs repeated adapter wiring.

For example, a loader API could bind an operation once and return a locally named view:

```ts
const { Loader } = useLoader(loadProjects)
```

```pug
Loader
	ProjectList(:projects="projects")
```

This illustrates the authoring pattern; `useLoader` is not a buntpapier export and its exact signature is not settled. An editor adapter could similarly return an `Editor` already connected to an application document, leaving the template concerned with where to render it.

Each composable call owns one shared logical state. Rendering its returned component again observes that state. A separate call creates a separate workflow. Temporarily hiding the view preserves the operation and its state; remounting shows the current state without restarting it. The composable's owning scope determines the workflow's lifetime.

The returned component is a functional view of that shared state. Local declarations such as `disabled` remain reactive, and the component's CSS remains reachable through the usual classes and cascade. Each API will document whether simultaneous mounts are supported. There is no promise of a matching `useX()` for every ordinary component.

## Props, slots and CSS

The boundary follows what a value means. Its type and how often it changes do not decide where it belongs.

| concern | public API | examples |
|---|---|---|
| Content | Props and slots | Labels, hints, button icons, option labels |
| Application state and data | Props and models | Selected value, options, `disabled`, `required`, date limits, input parser |
| Appearance and layout | CSS custom properties | Color, shape, size, weight, placement, spacing |
| Presentation policy | CSS custom properties, planned where noted below | Modality, dismissal, embedded versus popup calendar, clear-control visibility |
| Shared workflow | Optional composable with a primed view | Loading a resource or connecting an editor to a document |

Text props supply simple content; where a matching slot is supported, it overrides the prop's rendered content. Floating labels use text props only. The component owns label and description associations.

For example, one selector can give every button in a toolbar the same presentation:

```css
.toolbar .bunt-button {
	--button-weight: text;
	--button-size: small;
}
```

Button icons are application content. Keep them beside the label in a prop or custom icon slot, with the same reactive behavior. A checkbox already has a checked-state indicator; `--checkbox-icon` chooses how that indicator looks through the cascade.

Showing a clear button is presentation. Whether the field permits an empty value is an application constraint. Hiding the button cannot establish requiredness.

## Shared field vocabulary

Fields use the same names for the same responsibilities. Support is being brought into alignment; this table describes the target API.

| declaration | meaning |
|---|---|
| `v-model` | The application-owned value, with the control's own value type |
| `label` | Text identifying the field |
| `hint` | Guidance for entering or choosing a value |
| `placeholder` | A short cue in an empty control; the field still needs an accessible name |
| `name` | The form name, separate from the visible label and DOM id |
| `required` | Whether a value is required |
| `disabled` | The control is unavailable for use; value-changing actions are blocked |
| `readonly` | The user can inspect the field but cannot change its value, where the control supports this state |

Labels and hints carry content, so they stay out of CSS. Date models keep their date types; sharing field vocabulary does not turn every model into a string. A picker's internally readonly textbox also does not mean its calendar is readonly.

Input and select currently accept a Vuelidate-shaped `validation` object. The date pickers do not yet accept the shared hint input. The future validation API will define how errors combine, when checks run and how forms collect results. These policies are still being designed.

Attribute targets, accessible naming and focus follow the [input routing contract](input-routing.md). Input and select implement this contract with hint slots, focusable disabled controls and readonly guards. Checkbox implements it with label slots and a focusable disabled state; it has no readonly or hint surface. Picker delivery remains pending. Input supports `text`, `search`, `email`, `url`, `tel`, `password` and `number`; dedicated controls own other interactions.

### Input content

| Control | Label | Hint |
|---|---|---|
| Input, select, both date pickers | `label` text prop | `hint` text prop or `#hint` slot |
| Checkbox | `#label`, then nonempty `label`, then default slot | None |

Content slots have no slot arguments. Checkbox label content is inline and noninteractive; select's default slot renders options. Picker labels name the textbox in popup mode and caption the calendar group in embedded mode. Both picker modes use the text label prop.

Hint slots replace guidance; input/select validation messages retain priority. Hint descriptions merge with keyboard help and caller descriptions. Compact layout hides hints, including validation text in that area.

## Readonly and clearing

Readonly controls allow focus, copying and popup inspection. Navigation can change the viewed options or month, but user editing, selection commits, presets and clearing cannot change the value. Application model updates still apply.

Disabled controls remain focusable for explanations but block opening and navigation as well as value changes. Disabled takes precedence over readonly; checkbox has no readonly contract. [Input routing](input-routing.md#disabled-controls) defines focus targets, state transitions and tooltip access.

`--input-clear: auto | none` controls existing picker clear actions in popup and embedded modes. It inherits and updates live. `auto` shows the action when the model has a value and the control is editable; `none` hides it. Unset, empty and unsupported values resolve to `auto`. Readonly and disabled block clearing regardless of CSS. `required` permits temporary emptiness while editing.

A date model has a value when non-null; a range has a value when either endpoint is non-null. Clearing emits `null` or `{ start: null, end: null }` respectively and discards drafts or unfinished selection. A draft alone does not expose the action. Clearing closes a popup and restores focus; embedded calendars stay mounted. It emits one model update without synthetic native input/change events. Input, select and checkbox have no built-in clear action.

## SPA submission

Forms use `novalidate` and `@submit.prevent` handlers that validate reactive application data before saving. Buntpapier owns validation and feedback; native constraint validation, browser validation messages and native validity synchronization are unsupported. Components do not modify an enclosing form automatically.

Requiredness, invalidity and error associations expose the library's state through appropriate native semantics or ARIA. `aria-invalid` reflects library validation state rather than browser validity. Validation feedback remains accessible by keyboard and assistive technology. Native editing attributes still reach their applicable elements. Browser request submission, composite-value serialization and native form reset are outside the supported contract.

## Live presentation changes

Presentation follows resolved CSS changes, including a dialog's modality while open. Calendar popup and embedded modes are supported individually; switching between them after mount has unspecified behavior. The state-preservation guarantee for live presentation changes excludes that transition.

The following syntax is illustrative. These token names and values are candidates, and no dialog component currently ships:

```css
.confirmation {
	--dialog-modal: true;
	--dialog-dismiss: escape;
}
```

JavaScript applies the native behavior and semantics required by the resolved presentation. Modality must affect interaction with the surrounding page; changing a backdrop color alone cannot provide it. Updates apply when observed, including during an open interaction. Sampling only when the component opens would break that promise.

The existing style bridge does not yet observe every CSS change automatically. Its current polling opt-in is `--bunt-will-change: all`; replacing that observer remains separate work. The live presentation contract above describes the target behavior.

The calendar mapping uses these APIs:

| current prop | intended API |
|---|---|
| `inline` | CSS for embedded versus popup presentation |
| `showWeekNumbers` | CSS for week-number visibility |
| `monthsToShow` | CSS for the number of visible months |
| `clearable` | `--input-clear: auto \| none` |
| `minDate`, `maxDate`, `disabledDates` | Remain props describing permitted values |
| `parseInput` | Remains a prop describing application input parsing |
| `locale` | Application default with a reactive local prop override |

Use the existing props in the current alpha. Locale initialization and later updates will be scoped to each Vue application. The exact configuration API and fallback policy are still open; this does not select an application translation engine.

## Style the exposed state

Use native state and appropriate ARIA state when they describe the control: `:checked`, `:disabled`, `:focus-visible`, `:popover-open`, `:modal`, `[aria-expanded="true"]` or `[aria-selected="true"]`. Prefer native HTML semantics where available. ARIA must match the control's role and behavior; adding an attribute does not implement the interaction. See the [WAI-ARIA authoring guidance](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/).

For example, the current single date picker exposes its input's expanded state:

```css
.bunt-date-picker:has(input[aria-expanded="true"]) .open-calendar-btn {
	color: var(--clr-primary);
}
```

Validation needs the same care. Native `:user-invalid` and application-supplied errors are not interchangeable; style the invalid state that the field actually exposes. The validation design will define when that state becomes visible.

CSS-driven variants can retain modifier classes such as `.bunt-button--shape-rounded` while the bridge needs them. Purely visual states such as a floating label can also have classes. They do not need invented ARIA semantics.
