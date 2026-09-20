---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: choose an actual workflow and its learning question before fixing a factory signature
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Primed-view attachment

Verify the accepted shared-workflow and functional-view model against an actual workflow. Own view attachment, mount limits, forwarding, disposal and external cancellation; ordinary components remain the default.

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

## Inherited requirements and evidence

The following requirements were carried from Phase 1.3. Shared state, workflow lifetime and functional views are accepted; DOM attachment, multiple-mount support and external cancellation still need contracts and verification. Select an actual workflow before fixing a public factory signature.

The axite examples referenced in [Phase 1.3](../../design/api-design.md#existing-examples) need adaptation: the loader writes into captured state when render-time override props are present, while the Monaco composables attach editor setup/cleanup to the caller's lifecycle. The library contract must preserve the chosen functional view and workflow lifetime while attaching DOM resources to their actual mounts.

## Functional views and workflow lifetime

The `useX()` call creates the reactive state and actions once and returns a stable component function that closes over them. Rendering reads those values and creates fresh VNodes. It does not start tasks, allocate another workflow, register effects or copy props into the shared state. User events can call the actions created by the composable.

Vue's functional components have no state or lifecycle hooks of their own. That fits the proposed returned view; an underlying ordinary component can still own DOM setup and teardown. [Vue functional components](https://vuejs.org/guide/extras/render-function.html#functional-components).

Unmounting the view releases its DOM resources while the workflow continues in the composable's owning scope. Scope disposal cleans up the workflow's effects and subscriptions. `onScopeDispose()` is a suitable mechanism for registering that cleanup; cancelling external work still needs an explicit implementation. [Vue scope disposal](https://vuejs.org/api/reactivity-advanced.html#onscopedispose).

## What a primed component must promise

Shared logical state, lifetime and the functional view model are agreed. The detailed implementation requirements below still need verification:

- Create the returned component once per composable call. Keep its identity stable through state updates.
- Bind one source of truth for each value. If the factory binds the model or options, a template prop must not silently replace that binding. Keep unbound local declarations as props.
- Forward slots, classes, attributes and listeners deliberately. Existing CSS selectors and the styling cascade must continue to reach the library element. Vue's automatic forwarding differs for declared props, events and functional components. [Fallthrough attributes](https://vuejs.org/guide/components/attrs.html), [functional components](https://vuejs.org/guide/extras/render-function.html#functional-components).
- Let ordinary props such as `disabled` remain reactive on the returned component. Do not require rebuilding it when a declaration changes.
- Keep DOM setup and teardown tied to the mounted view. Workflow state and ongoing work survive the view's absence and are owned by the composable's scope.
- Preserve shared logical state on reuse. Every render of a returned component refers to the state bound by its composable call. A loader rendered twice observes the same operation and result. DOM refs, IDs and focus targets remain local to each mount. If an editor or overlay can only support one mount safely, specify that constraint rather than silently creating another logical instance. Overlay open state must follow the chosen ownership contract; it is not automatically independent per mount.
- Preserve useful prop, event and slot types. Verify the returned component in Pug, editor completion and emitted declarations before making it the preferred public API.

These requirements favor a small functional wrapper around an ordinary component for the first prototype. They do not require exporting the internal overlay, focus or selection machinery. The [architecture's behavior primitives](../../design/architecture.md#behavior-layer) stay internal. Public workflow composables can expose primed components selectively; this decision does not promise a matching `useX()` for every component.

Done when the selected workflow demonstrates stable identity, reactive local props, forwarding, temporary view absence, scope disposal and its declared mount limit. Separate logical cleanup from actual cancellation of external work; cancelling a subscription does not automatically cancel a request or editor operation.

## Questions and dependencies

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| workflow-choice | Which actual workflow is worth priming and exposes the attachment questions? | decide | Owner selection before a public factory signature; loader and editor references are examples |
| resource-ownership | Which resources belong to each mount and which belong to the owning workflow scope? | decide, prototype | Selected workflow; overlay lifecycle if it owns an overlay |
| view-reuse | Can reuse, temporary view absence, reactive props and forwarding preserve one source of truth? | prototype | Workflow and mount policy selected |
| external-cancellation | What can disposal actually cancel, and how are late results handled? | decide, prototype | External-operation capabilities of the selected workflow |
| view-types | Do the resulting prop, event and slot types survive Pug, editor use and publication? | prototype | Candidate view API; coordinate emitted declarations with packaging |

Future durable output: a primed-view attachment contract in `design/` and any justified amendments to the API guide. A useful prototype can establish the pattern without committing beta to a new loader or editor product component. Product scope stays with beta.

Beta's accepted review clarification makes this evidence a gate for every published primed surface. The parent must select an actual beta workflow, with the form workflow a candidate once its design resumes, or explicitly decide that beta ships no primed surface. An unrelated loader/editor demonstration cannot silently add a component commitment or satisfy a different workflow's attachment contract. The accepted authoring model remains in force while that scope choice is open.
