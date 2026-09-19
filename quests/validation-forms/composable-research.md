# Form composables in other Vue libraries

Research, 2026-09-18. The owner requested examples of libraries offering form composables beyond components. These are authoring references for buntpapier's own stack. Findings come from official documentation; no packages were installed and no runtime, typing or accessibility behavior was tested.

## Relevant APIs

| library | composable surface | field connection | relevance to buntpapier |
|---|---|---|---|
| [VeeValidate](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/) | `useForm`, `useField`; the component APIs use these internally | `defineField(path)` returns a model and binding object; custom inputs can use `useField` | Demonstrates one form core behind ordinary inputs, custom components and slot components. Its per-field declarations still add setup that buntpapier wants to avoid |
| [TanStack Form for Vue](https://tanstack.com/form/latest/docs/framework/vue/guides/basic-concepts) | `useForm` creates a form instance with a bound `form.Field` component | A scoped slot exposes field state and change/blur handlers | Closest reviewed example of a composable returning a bound field component. The documented template still selects and wires the input; this `Field` is not the proposed automatic editor renderer |
| [Regle](https://reglejs.dev/core-concepts/) | `useRegle(state, rules, modifiers)` accepts existing reactive data and returns a validation tree | The application binds values and consumes validation state | Closest reviewed shape to `useForm(data, definition)`. It demonstrates validation following the model independently of a component tree; control rendering and DOM integration remain application work |
| [Formisch for Vue](https://formisch.dev/vue/api/useForm/) | `useForm`, `useField`, `useFieldArray`, with a Valibot schema | A form store feeds either composables or components; fields expose input, errors and binding props | Makes the choice of script or template field access explicit. The schema determines validation/types; the application still chooses the editor |

VeeValidate explicitly recommends its composition API for flexible integration. Its `defineField` bindings can map validation state into a UI library's feedback props. This is useful evidence for separating validation state from the component contract, though it does not solve our desired template brevity by itself. [Composition guide](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/).

Formisch's `Field` is a wrapper around `useField`; both expose the same field store. Its guide shows `v-model="field.input"` plus `v-bind="field.props"`. Our editor-selecting `Field` proposal would take on more responsibility by choosing the control and applying those connections internally. [Field guide](https://formisch.dev/vue/guides/add-form-fields/).

## Arrays without a repeater component

VeeValidate's `useFieldArray(path)` returns entries with generated keys and operations including insert, remove, swap and move. Its example uses ordinary `v-for`; the rendering key and indexed field path are different things. This supports keeping row identity in form state while leaving iteration to Vue. [Array composable](https://vee-validate.logaretm.com/v5/api/use-field-array/).

Formisch's `useFieldArray(form, config)` exposes an array store with item IDs and validation state; insert, move, remove and swap are separate methods. This provides another example of array management that does not require a repeater component. [Array composable](https://formisch.dev/vue/api/useFieldArray/).

Regle declares item rules with `$each` and supports rules on the collection itself. It generates tracking IDs, allows custom keys and demonstrates iteration over its validation entries. Its documentation recommends object arrays because its tracking mechanism cannot attach IDs to primitives. That limitation is specific to its mechanism; buntpapier must still account for JSON Schema arrays of primitive values and duplicates. [Collections](https://reglejs.dev/common-usage/collections/).

## Implications for our design

At closeout, the owner highlighted TypeScript-oriented schema libraries such as Valibot or Zod as another substantial design option to retain. Evaluate schema-derived types and validation together with the definition API when forms resume. Our own form orchestration can consume such schemas; the own-stack decision does not settle the validator implementation or require a bespoke schema language. Library choice, interoperability and editor metadata remain open. The [deferred design record](spec.md#schema-libraries-to-revisit) owns these resume questions.

My assessment: the comparable APIs support keeping logical form/field state independent of the chosen template surface. They differ in who owns values, how fields are declared and how much binding the caller writes. A composable alone does not make templates DRY.

For buntpapier, the useful combination remains application-owned data, a definition that can carry editor metadata, and one control connection shared by direct controls and generated rendering. We can design that connection before choosing prop or slot names. A repeater's existence and name can wait as long as the array model supports stable identities and ordinary loops. These are recommendations, not new accepted contracts.
