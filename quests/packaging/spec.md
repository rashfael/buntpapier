---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: propose the export surface and TypeScript/SSR consumer cases
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Packaging and declarations

Define the published package contract for plugin installation, component imports, styles and TypeScript declarations. Own package entry points, declaration delivery and SSR-safe imports; runtime locale behavior belongs to initialization and strings.

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

## Starting evidence

At `e1e0d4b09f59ac4baf3850f29425c2fe4c7ae82b`, [package.json](../../package.json) exports the library and style entry points but has no declaration build or `types` entry. [src/index.ts](../../src/index.ts) installs the component plugin and exports selected utilities and date types, without individual component exports. These observations identify the design gap; they are not consumer verification.

## Questions and boundaries

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| export-surface | Which plugin, component and utility imports should the package support? | decide | Existing authoring model and compatibility consequences; compare named exports and component subpaths |
| declarations | How should declarations expose props, models, events, slots and global components? | research, prototype, decide | Current Vue/Pug/toolchain behavior; primed API types follow a selected workflow |
| ssr-imports | What must importing and rendering the package support without browser globals? | decide, prototype | Existing SSR guards; app configuration owns locale defaults and hydration behavior |
| consumer-evidence | Which consumer cases prove the packed artifact contains working JS, styles and declarations? | prototype | Chosen export contract and declaration approach |
| vue-compatibility | Which Vue versions and runtime/peer dependencies does the package require? | decide, prototype | The current build externalizes Vue while the package lists it only as a development dependency |
| migration-surface | Which alpha-to-beta exports, props and CSS policies change, and what migration evidence accompanies them? | research, decide | Accepted subject contracts; retain direct Vuelidate removal without a compatibility period |

Preserve `buntpapier/style` and the shared CSS architecture unless the owner adopts a compatibility change. A build-tool replacement, reactivity-transform migration and release publication are separate decisions. The owner decided on 2026-09-20 to keep reactivity-transform for beta. Preserve `$ref`/`$computed`; declaration/source/Pug feasibility must support that choice. The policy is settled, while tooling compatibility still needs evidence.

## Evidence and completion

The design outcome is an explicit export map and declaration/SSR contract, with consumer examples and observations sufficient to choose an approach. Compare credible export alternatives and record migration consequences before implementation.

For later delivery, verify the packed artifact from a consumer fixture: plugin registration, chosen individual imports, styles, representative props/events/slots and a Node import without browser globals. Coordinate Pug/editor checks for a selected primed view and SSR/hydration checks for application configuration. A source build alone does not establish that the published declarations resolve.

The owner accepted starting package/type feasibility early on 2026-09-19. The next-alpha declaration/`types` deliverable belongs here; it does not block unrelated contract design. [Infrastructure](../infrastructure/spec.md) runs the chosen checks in CI without taking ownership of the export or declaration design. [Beta release evidence](../beta/work/release.md) owns the final artifact/migration checklist and publication coordination. This planned quest supplies no build, publication or acceptance claim. Future durable output: the package contract and repeatable consumer verification in `design/`, plus mechanical API references where needed.
