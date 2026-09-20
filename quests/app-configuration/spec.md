---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: propose application configuration, update and override examples
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Initialization and strings

Define application-scoped reactive locale and string configuration, including local overrides, disposal and SSR consistency. Own the configuration and dictionary contracts; an application translation engine remains outside this scope.

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

## Required contract and evidence

Inherited: configuration belongs to each Vue application. Initialization establishes a locale default; later changes and per-component overrides are reactive. Built-in strings remain a dictionary concern. The broader native i18n idea remains parked.

Specify initialization options, the update interface, fallback and override precedence, locale/strings interaction, server-rendering defaults and hydration consistency. Include disposal and two Vue applications with different settings. The current plugin only registers components and directives.

Done when callers have a concrete initialization/update example, local overrides, two-app isolation and server-rendering behavior, with a dictionary contract for built-in and validation messages. This does not select an application translation engine.

## Questions and dependencies

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| app-defaults | How does an application initialize and update its defaults? | decide, prototype | Preserve the existing ordinary-component authoring model |
| override-precedence | How do component overrides, dictionaries and locale fallbacks combine? | decide, prototype | Built-in component messages; validation message keys follow the forms error model |
| ssr-defaults | What defaults remain consistent between server rendering and hydration? | decide, prototype | Coordinate package SSR imports with the packaging quest |
| app-isolation | How do two Vue applications and disposed scopes remain isolated? | prototype | Concrete configuration API candidate |

The general mechanism and built-in component messages can be designed while forms remain deferred. Validation message keys are a later dependency, not a reason to invent an error model here. Packaging owns exported entry points; this quest owns runtime configuration semantics.

## Dictionary delivery and service boundary

Beta requires English defaults and a complete German dictionary for built-in strings. Preserve the candidate keys `close`, `clear`, `open`, `loading`, `success`, `error`, `nothingFound`, `resultsAvailable(n)`, `selected`, `previousMonth`, `nextMonth`, `openCalendar`, `chooseDate`, `chooseDateRange`, `week`, `weekNumber(n)`, `required`, `optional`, `increment`, `decrement`, `showPassword`, `hidePassword` and `dismiss`; validate the exact key/argument contract against component consumers. Functions for plurals, `app.use(Buntpapier, { strings })`, `useStrings()` and a partial component `strings` override remain API candidates until this quest decides their precedence and reactivity. Validation keys follow the forms error model.

The owner accepted the beta review's boundary on 2026-09-19: [infrastructure](../infrastructure/spec.md) owns announcement host creation, installation, isolation, repeated messages and disposal. This quest supplies app-scoped configuration and dictionary lookup; consumers own announcement policy. Coordinate individual-import behavior and multiple-app/SSR cases with infrastructure and packaging. Picker delivery owns locale-sensitive parsing and how an in-progress edit responds to changed configuration.

Future durable output: initialization/update examples and the dictionary contract in `design/`, with evidence for reactivity, two-app isolation, local overrides, disposal and SSR/hydration.
