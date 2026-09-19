# Form authoring alternatives

Exploration, 2026-09-18. The owner considers the `field` prop viable and wants more adventurous alternatives, including nested arrays and template loops. Every API below is a sketch. [Validation/forms](spec.md) owns accepted decisions and the behavior proposals; this note compares authoring shapes without selecting one.

Latest direction: the owner closed and deferred forms, with `useForm` settled in principle. Template authoring and Valibot/Zod-style schema integration remain open for resumption. The owner dislikes `bunt-repeat`, mostly the name. Repeater examples below preserve an explored option, not a naming decision or a required component. The generic `Field` renderer is interesting because the definition can select its editor once. [Other libraries' composables](composable-research.md) offer comparison points; [dependency boundaries](spec.md#what-can-proceed-without-the-template-api) let independent work proceed.

## Scoped slots on the form and children

The owner raised IDE support as a concern with a custom preprocessor and suggested scoped slots on the form and child components. Slots can expose the same field references and state that the composable exposes in script, keeping their lifetime with the form's owning scope. They do not need another copy of the model.

```pug
MyForm(v-slot="{ fields: { email }, errors }", @submit="save")
	bunt-input(:field="email", label="Email")
	SomeErrorBox(:errors="errors")
	bunt-button(type="submit") Save
```

For nested arrays, a repeater's slot can expose the item fields with the same shape as the form slot. The repeater owns keyed rendering; the form model retains row identity and validation state.

```pug
MyForm(v-slot="{ fields, errors }")
	bunt-repeat(:field="fields.organizations", v-slot="{ fields: org }")
		section
			bunt-input(:field="org.name", label="Organization")
			bunt-repeat(:field="org.members", v-slot="{ fields: member, remove }")
				.member
					bunt-input(:field="member.email", label="Email")
					bunt-button(type="button", @click="remove") Remove
	SomeErrorBox(:errors="errors")
```

An ordinary `v-for` over `fields.organizations.$rows` remains another way to consume the same references. Reusable subforms can receive one row or object reference. A control's hint/error slots can expose local field state for custom feedback while ordinary usage keeps its default feedback rendering.

Slots could instead expose binding objects for use with ordinary props and events:

```pug
MyForm(v-slot="{ bindings, errors }")
	bunt-input(v-bind="bindings.email", label="Email")
	SomeErrorBox(:errors="errors")
```

This removes the dedicated `field` prop, but makes the generated prop/event bundle a public API. Model updates and feedback timing need a defined binding contract; explicit props must not silently replace a bound model. Compare this with a field reference before selecting either surface.

Returning primitive values alone is insufficient for editable slot bindings: Vue rejects `v-model="email"` when `email` is a slot parameter. An object member such as `email.value` is a legal model target, provided the field reference supplies a writable connection to application data. Field references or binding objects also carry the feedback and interaction connection that a value alone lacks.

Exposing components through slots does not produce the same concise tag syntax as a top-level script binding. In the installed Vue compiler, `MyForm(v-slot="{ email: Email }")` followed by `Email(label="Email")` resolves a component named `Email`; it does not render the slot's `Email` value. A raw `<fields.email />` tag also does not resolve a slot-local `fields` object. `component(:is="Email")` does read the slot value, but the owner finds that spelling unattractive. Field references passed as props work without that indirection.

Scoped slots use Vue's existing template syntax, and `defineSlots` can describe slot props for tooling. That avoids inventing a new language-server transform, but inference through a generic `useForm` return type and nested Pug slots still needs an editor/type-checking probe. No IDE behavior is established by the compiler checks below. [Vue scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots), [slot types](https://vuejs.org/api/sfc-script-setup.html#defineslots).

## Fields as components

One `useForm` call could expose a tree of bound fields. A leaf could be both a reference to field state and a stable primed component:

```ts
const MyForm = useForm(data, {
	email: {
		view: BuntInput,
		rules: { required, ...emailRules }
	}
})
const { email: Email } = MyForm.$fields
```

```pug
MyForm(@submit="save")
	Email(label="Email")
	SomeErrorBox(:errors="MyForm.$errors")
	bunt-button(type="submit") Save
```

The component binds its value and validation once. Content and unbound control props remain local declarations. A builder could supply the view and label from its UI description. A data type alone cannot choose between every useful control for that type.

An ordinary control could consume the same field reference through `:field="F.email"`, where `F = MyForm.$fields`. This would let handwritten forms choose their controls in the template while generated forms render the field's configured view. The extra public surface is justified only if both uses earn their place.

The bare Pug tag `MyForm.email(label="Email")` compiles to a `MyForm` element with class `email`. The quoted expression in `component(:is="F.email")` works normally, and raw `<MyForm.email label="Email" />` passes through Pug. Quoting the tag itself as `"MyForm.email"(label="Email")` is a syntax error in the installed Pug. A top-level alias such as `Email` also works. These are spelling choices; they do not rule out fields as components. [Vue namespaced components](https://vuejs.org/api/sfc-script-setup.html#namespaced-components).

The primed view must keep a stable component identity per field. Recreating it while looping would risk losing control state and focus. Its validation lifetime belongs to the form's owning scope; each mounted view owns its DOM IDs and focus target.

## Ordinary loops over field references

Nested arrays are the strongest reason to expose field references. For data shaped like `{ organizations: [{ name, members: [{ email }] }] }`, compare repeated string paths with a tree that follows the data:

```ts
const F = MyForm.$fields
```

```pug
MyForm
	section(v-for="org in F.organizations.$rows", :key="org.$key")
		bunt-input(:field="org.name", label="Organization")
		.member(v-for="member in org.members.$rows", :key="member.$key")
			bunt-input(:field="member.email", label="Email")
			bunt-button(type="button", @click="member.$remove()") Remove
```

With fields as components, the inner input could instead be `component(:is="member.email", label="Email")`. Both views would use the same logical field. Reusable row components could receive a row reference and work without knowing their absolute path.

`$rows` is a view of the application's array with field state attached, not another application model. Reordering or removing a row must update the original array. `$remove()` identifies its row independently of the current display index. Metadata spelling is provisional; arbitrary schema property names need an escape from any reserved names.

An array definition needs separate places for its own rules and repeated item definitions. A candidate helper makes that distinction explicit:

```ts
const MyForm = useForm(data, {
	organizations: array({
		key: org => org.id,
		rules: { atLeastOne: minLength(1) },
		items: {
			name: { rules: { required } },
			members: array({
				key: member => member.id,
				rules: { distinctEmails },
				items: {
					email: { rules: { required, ...emailRules } }
				}
			})
		}
	})
})
```

This keeps collection failures, such as duplicate emails, representable even when no individual email is malformed. Object rules also need a place for checks such as a start/end pair; putting every error on a leaf would distort those checks. The helper syntax and rule context remain open.

### Row identity and current position

An index locates a value today. A stable row identity owns its draft, touched state, errors and pending work across reordering. `$key` would be a form-owned identity, with an optional application key for reconciling replacements; it need not be written into submitted data. New unsaved rows need identities before the server supplies IDs. Vue's `:key` preserves view identity, but the validation model also needs its own matching policy. [Vue list keys](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key).

A response for Alice must stay with Alice after sorting the array. Removing Alice invalidates her outstanding result. Even when the row survives, an async result must still match the value and dependencies it checked. A rule that depends on sibling order may need a new check after reordering.

Primitive arrays expose the limit: two identical strings have no identity in the values alone. Distinguishing their moves requires operations that carry identity, a supplied key where values allow one, or a documented reconciliation/reset policy. Replacing an entire array with cloned objects also needs a matching policy; preserving state cannot be promised without evidence that the new row is the same item.

Server errors containing positional paths must be interpreted against the submitted snapshot. Mapping a late `members[2].email` error onto the current third row could blame another person. Field identity and value revisions should be retained for that request.

## Relative field scopes and repeaters

A form-aware repeater could establish a relative field scope for each row:

```pug
MyForm
	bunt-repeat(field="organizations")
		section
			bunt-input(field="name", label="Organization")
			bunt-repeat(field="members", v-slot="{ remove }")
				.member
					bunt-input(field="email", label="Email")
					bunt-button(type="button", @click="remove") Remove
```

The repeater would repeat its slot and supply the row's field scope and stable key. This is concise for recursive layouts and reusable subforms: an address component could always bind `street` and `city`, whether used for billing or shipping. A companion scope wrapper could bind an ordinary object without repeating it.

The cost is a library-specific loop and context that is less explicit at the field. Ordinary `v-for` over row references should remain available. Sorting a display-only view must preserve the original row references; a displayed index is not necessarily the data index.

## A field directive or compiler macro

Keep these options secondary while exploring standard Vue authoring: the owner's IDE-support concern makes a custom preprocessor a larger commitment than its template shorthand suggests.

```pug
MyForm
	bunt-input(v-field="F.email", label="Email")
	section(v-for="person in F.people.$rows", :key="person.$key")
		bunt-input(v-field="person.email", label="Email")
```

This could expand one field connection into model updates, feedback and interaction bindings. It is more useful if adapters let it bind third-party controls too. However, a runtime directive on a component targets its root DOM element; it is a poor general mechanism for a component's model and events, and multiple roots complicate it further. A compiler transform or explicit component integration would be the credible implementation. [Vue directives on components](https://vuejs.org/guide/reusability/custom-directives.html#usage-on-components).

An even more ambitious transform could infer the field from ordinary `v-model="data.email"`. Stock Vue passes a value and update callback; it does not pass the source property's identity. Equal values cannot identify fields. Inference would therefore need a compiler contract for expressions, aliases and loop variables, plus editor support. This convenience has a larger maintenance cost than a field reference. [Vue component models](https://vuejs.org/guide/components/v-model.html).

### Vue Macros check

The owner requested an independent agent investigation. Vue Macros includes template transforms: [`shortVmodel`](https://vue-macros.dev/macros/short-vmodel.html), [`shortBind`](https://vue-macros.dev/features/short-bind.html) and [`booleanProp`](https://vue-macros.dev/features/boolean-prop.html). The agent found no documented transform for rendering slot-local or loop-local components as ordinary tags. A compiler probe with all three installed transforms still emitted component-name lookup for those tags; `component(:is="Email")` used the local variable correctly. `shortVmodel` worked as a positive control, but only shortened model syntax.

[`namedTemplate`](https://vue-macros.dev/features/named-template.html) is explicitly unmaintained and lacks TypeScript/Volar support. [`jsxDirective`](https://vue-macros.dev/features/jsx-directive.html) applies to JSX, not Pug. Native Vue already supplies `defineSlots` and same-name prop binding. These features do not provide the desired component-tag behavior.

The installed umbrella package is `unplugin-vue-macros` v2; current online examples use the v3 `vue-macros` package. Project builds currently enable only standalone `ReactivityTransform`. Vue Macros documents feature-specific Volar integration; editor behavior for this form API remains untested. [Volar integration](https://vue-macros.dev/guide/bundler-integration.html#volar-support), [v3 migration](https://vue-macros.dev/guide/migration-v3.html).

## Remaining Vue syntax

A quick sweep of native Vue syntax found no additional way to treat a component value from a slot or loop as a local tag. There are useful options for exposing state and choosing views:

| syntax | relevance |
|---|---|
| `v-slot`, `#default`, destructuring and aliases | Expose field references, state and actions at form/row scope; aliases do not register components |
| Named slots such as `#email` and dynamic names such as `#[name]` | Override particular fields in a generated form; dynamic names also work in a template loop |
| Object `v-bind` and object `v-on` | Supply a field's props and events; one binding object can include `onUpdate:modelValue` and other listeners |
| Same-name `:field` | Native shorthand for `:field="field"`; useful when a slot exposes a local variable named `field` |
| `v-model:field`, multiple models, dynamic model arguments | Choose model prop/event names; they do not identify the original application field |
| `v-model.form` and other custom modifiers | Supply modifier metadata for a component to interpret; they do not supply field identity or validation wiring |
| `component(:is="Email")` | Resolves the actual component value from a slot or loop |
| `div(:is="Email")`, `is="vue:Email"`, old `v-is` | No shortcut to slot-local component values: the first stays a native element, the second resolves a fixed component name/setup binding, and the old directive has no rendering effect in the installed compiler |
| Top-level script aliases and script-setup namespaces | Render bound components directly; namespace support does not extend to slot-local objects |
| Render functions / JSX | JavaScript scope can supply component values directly, such as `h(Email)`; useful inside a form builder or adapter, but changes the authoring syntax |
| Runtime directives, refs and attribute forwarding | Can support implementation or adapters; they do not add component-variable tag resolution |
| Interpolation / `v-html` / `slot` outlets | Render text, raw HTML or supplied slot content, respectively; they do not instantiate a component value as a tag |
| Conditional rendering, `key`, `KeepAlive`, `Teleport`, `Suspense`, render caching directives | Affect rendering, identity or lifecycle; do not provide another field-binding mechanism |

References: [Vue binding directives](https://vuejs.org/api/built-in-directives.html#v-bind), [model arguments/modifiers](https://vuejs.org/guide/components/v-model.html), [special `is` attribute](https://vuejs.org/api/built-in-special-attributes.html#is), [dynamic slots](https://vuejs.org/guide/components/slots.html#dynamic-slot-names), [render functions](https://vuejs.org/guide/extras/render-function.html#components).

Named field slots and same-name binding compose into this candidate for overriding generated form content:

```pug
MyForm
	template(#email="{ field }")
		bunt-input(:field, label="Email")
```

The shorthand works with Vite's Pug integration, which sets `doctype: 'html'`. Bare `pug.render()` uses a different default and turns `:field` into an attribute value that Vue cannot parse; syntax probes must match the project's preprocessing options.

A normal runtime renderer is another candidate when a field definition selects its control:

```pug
MyForm(v-slot="{ fields }")
	Field(:of="fields.email", label="Email")
```

Here `Field` is an ordinary component imported or bound in script. It renders the field's configured control and forwards local content. This gives dynamic field rendering a form-specific name without extending the compiler. It remains a proposed component, and its relationship to the planned `bunt-field` wrapper needs design. Field references passed to ordinary controls remain useful when the template selects the control type.

The definition could supply label, constraints and a default editor, leaving the template responsible for placement. That avoids repeating the editor choice in handwritten templates and generated forms. A data type alone cannot always select the editor: a string might use a text input, textarea, select or autocomplete. Use definition metadata such as format/options and an explicit editor override where needed. Field references can remain ordinary descriptors; the renderer does not require each field to become a component.

## A form that renders its definition

```ts
const MyForm = useForm(data, fromJsonSchema(schema, ui))
```

```pug
MyForm(@submit="save")
```

The returned component could render the complete form by default, with slots to replace particular fields or rows. The UI description would supply control choices and layout, including the submit action. A handwritten layout would use the same field references and state. This is a useful endpoint for a schema builder, but automatic layout need not be the default behavior of every `useForm` result; it could be a separate returned view.

The schema adapter should produce the same form definition and field references as handwritten setup. UI layout, schema constraints and async application rules would then share one validation workflow. The adapter must preserve schema semantics, including object/array constraints, rather than reducing everything to independent leaf rules.

## Cases to use when comparing the shapes

| case | what it asks of the API |
|---|---|
| Reordered, filtered or paginated rows | Stable field identity independent of display index; a way to reveal an off-screen error target |
| Primitive arrays with duplicates | An explicit identity/reconciliation policy rather than assuming each item has an `id` |
| Reusable billing/shipping address editor | Bind a subtree once; the child knows local field names |
| Conditional person/company details | Declare active rules separately from visibility; decide whether inactive values survive |
| Wizard or virtualized form | Declared validation survives absent views; summaries can request that a step or row become visible |
| Cross-field and collection checks | Object/array errors have their own location; dependencies rerun affected checks |
| Date, money or multi-control field | Preserve invalid drafts and one logical value while adapting the control's representation |
| Third-party editor | A small binding adapter connects model/events and accessible feedback without rebuilding the form |
| Same field shown in two places | Shared value/validation with separate DOM IDs; define draft and focus ownership |
| Save draft versus publish | Each action selects the relevant checks; a single global submit policy may be insufficient |
| Server errors after edits or reordering | Resolve submitted paths against row identities and the values the request checked |
| Recursive schema or arbitrary property names | A renderer can traverse definitions; paths have an unambiguous representation and reserved-name escape |

The most useful next comparison is an organization/member editor using form and row slots, ordinary loops over field references, and bound field components, including a reorder while an email check is pending. Include editor completion and type errors for nested slot fields in that comparison. The experiment should establish whether the extra authoring surfaces save enough code to keep.

## Checks performed

The installed Pug compiler and Vue template compiler were used to inspect bare and quoted namespace tags, quoted `:is` expressions, raw HTML tags, top-level aliases, field props and ordinary `v-model`. The bare-tag class interpretation, rejected quoted tags and value/update expansion were observed directly. The proposed TypeScript and Pug blocks were also compiled for syntax. These are syntax probes only; none of the proposed APIs has an implementation or verified public types, and no runtime form behavior has been tested.

A follow-up compiled slot-exposed component aliases, raw namespace tags, `component(:is)` and field references using script-setup binding metadata. The emitted code resolves slot-local component tags by name, while `:is` expressions and field props read the slot variables. Vue rejected a direct slot-parameter `v-model` and accepted an object-member target and a `v-bind` bundle. Generic slot typing, editor completion and runtime behavior remain untested.

The syntax sweep inspected emitted code for slot shorthand, named/dynamic slots, same-name props, prop/event objects, model arguments/modifiers, native/dynamic `is`, `v-is`, a script-bound renderer and text interpolation. Pug shorthand was checked with the installed Vite plugin's HTML doctype setting. The Vue Macros agent separately tested the installed template transforms; that investigation made no project changes.
