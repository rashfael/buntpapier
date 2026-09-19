# Accessibility acceptance

The library targets WCAG 2.2 AA and native HTML or a named WAI-ARIA APG interaction pattern per component. These are acceptance requirements, not a statement that the current alpha meets them or that a host application conforms.

## Acceptance criteria

This is the internal acceptance checklist for interactive components. Public component pages record their evidence; public narrative guidance remains human-authored.

1. Named APG pattern, or "native element, no pattern needed", in the docs.
2. Native element first. A custom role only where no native element gives the semantics.
3. Name, role, value: every perceivable state is exposed (`aria-expanded`, `aria-selected`, `aria-checked`, `aria-invalid`, `aria-busy`, `aria-valuenow`). Icon-only controls have a name.
4. Full keyboard table implemented and documented, including Home, End and typeahead where the pattern lists them.
5. Focus visible through the shared focus ring token. Focus returns to the invoker on close and never drops to `<body>`.
6. Pointer targets at least 24 by 24 CSS px including compact sizes (2.5.8). Exceptions documented.
7. Contrast: 4.5:1 for text, 3:1 for boundaries and state indicators (1.4.3, 1.4.11), measured on the default light and dark surfaces and one nested surface.
8. `prefers-reduced-motion` and `forced-colors: active` handled.
9. All built-in strings come from the dictionary.
10. Tests: axe with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; an aria snapshot per state; a keyboard test per pattern row; all three engines.
11. One manual screen reader pass recorded on the docs page with versions and date. Minimum: NVDA + Firefox, VoiceOver + Safari. JAWS when a licence is around.
12. Docs page has an Accessibility section: pattern, roles, keyboard table, strings, known limitations, last manual test.

Documentation distinguishes implemented, automatically checked, manually verified on named combinations, and experimental. "Accessible" is not a badge.
