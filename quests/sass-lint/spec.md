---
status: planned
parent: ../beta/spec.md
active: []
activity: explore
next: when selected or when the revisit condition holds, rerun the probe against current sass-parser and stylelint releases
waiting_on: owner-selection
profile: research and probe on 2026-09-22 by Claude Code (Opus 5.5); no linting setup started
---

# Sass linting

Nothing can lint buntpapier's indented Sass today. Stylelint's only working `.sass` parser sees about a sixth of our declarations, and the Sass team's own parser isn't ready to stand in for PostCSS yet. Linting is shelved until that changes; the indented syntax stays.

## Authority and boundary

The question came up on 2026-09-22 while setting up linting in a consumer app that follows the same Sass conventions. After reading the results below, the owner said "I really want to keep indented syntax, oh well. lets shelve it for later" and asked for this writeup. Recording it is authorized. Adding a style linter, changing the build or switching syntax is not.

The [Sass conventions](../../AGENTS.md#sass-conventions) stay as they are: indented syntax, never SCSS. This quest adds no beta gate.

## Findings (2026-09-22)

Checked with stylelint 17.15.0, postcss-sass 0.5.0, sass-parser 0.4.56, postcss-html 2.0.0, sugarss 5.0.1 and Dart Sass 1.105.0. The [probe](probe/) reruns every observation here.

### Parsers

Stylelint handles non-CSS syntaxes through a PostCSS `customSyntax`. For indented Sass there are three candidates:

| Parser | State | On indented Sass |
|---|---|---|
| [postcss-sass](https://github.com/AleshaOleg/postcss-sass) | Last release June 2022, built on gonzales-pe (also last released June 2022). Stylelint maintainers call it unmaintained and point people to SCSS ([#7128](https://github.com/stylelint/stylelint/issues/7128), [#7216](https://github.com/stylelint/stylelint/issues/7216)). | Silently drops `@layer` blocks, `@forward`, `@each`, `@container`, `@keyframes` and `=mixin`/`+include`, including the rules inside them. Mangles `math.div(4px, 2)` into `mathdiv4px, 2)`. One empty rule fails the whole file. Prints braces back, so `--fix` rewrites the syntax; a [2022 report](https://github.com/stylelint/stylelint/issues/6325) had it deleting `+mixin` lines. |
| [sass-parser](https://github.com/sass/dart-sass/tree/main/pkg/sass-parser) | By the Sass team, in the dart-sass repo, released with Dart Sass (0.4.56 on 2026-09-22). The README still says not suitable for production and no raws support. | Parses every construct above, except percentage keyframe selectors like `100%` (fails in SCSS too). Inside stylelint it throws `Not yet implemented` from `Declaration.important` on the first duplicate-property check. Normalizes values before rules see them: `#fff` becomes `#ffffff`, `red` becomes `#ff0000`, quotes become double quotes. Prints CSS with braces. |
| [sugarss](https://github.com/postcss/sugarss) | Maintained. | Not Sass. Folds `+mixin`, `@include` and `@extend` lines into the next selector. |

So postcss-sass is the only one that runs, and it works on plain nested rules. On a synthetic fixture it found hex and named colors, an invalid hex, duplicate and unknown properties, all with correct lines.

### buntpapier's own styles

Every file in `src/styles` wraps its rules in `@layer buntpapier.*`, which is exactly what postcss-sass drops:

| File | Declarations (sass-parser) | Seen by postcss-sass |
|---|---|---|
| `colors.sass` | 290 | 0 |
| `derived.sass` | 25 | 0 |
| `index.sass` | 5 | 5 |
| `reset.sass` | 1 | 0 |
| `scrollbars.sass` | 42 | 42 |
| `components/button.sass` | 124 | 5 |
| `components/checkbox.sass` | 48 | 46 |
| `components/date-picker.sass` | 181 | 15 |
| `components/input.sass` | 94 | 0 |
| `components/progress-circular.sass` | parse error on `100%` | 0 |
| `components/ripple-ink.sass` | 27 | 27 |
| `components/tooltip.sass` | 17 | 0 |

That's 140 of at least 854 declarations. **Stylelint with postcss-sass reports no warnings on the whole tree**, including `color-no-hex` over a palette file with 290 hex colors.

### Other tools

- [sass-lint](https://github.com/sasstools/sass-lint) has been unmaintained since 2017, according to its own README.
- [Biome](https://biomejs.dev/internals/language-support/) is working on SCSS parsing and formatting, has no SCSS linting planned, and doesn't list indented Sass.
- [@eslint/css](https://github.com/eslint/css) is plain CSS only.
- [Prettier](https://github.com/prettier/prettier) formats CSS, SCSS and Less, not indented Sass.

The community's answer is SCSS. Stylelint maintainers say it outright, and in the [long-running dart-sass request](https://github.com/sass/dart-sass/issues/88) for an official parser, one user wrote in June 2026 that they left Sass over the missing tooling.

## What works without a Sass linter

- The Sass compiler already fails the build on syntax errors, and it warns about empty selectors and deprecations such as global built-ins (`map-get`). The Sass `fatalDeprecations` option turns those warnings into errors. Not tried in buntpapier's Vite config.
- For SFCs, `vue/block-lang` (`{ style: { lang: 'sass' } }`) and `vue/enforce-style-attribute` from the eslint-plugin-vue we already have can enforce the style block language and forbid `scoped` or `module`.
- Stylelint could run as a PostCSS plugin on the compiled CSS, where plain CSS support is complete, but warnings would point into compiled output rather than the `.sass` source. Not tried.

## Revisit when

Rerun the probe when sass-parser drops its production warning or stylelint lists it as a supported syntax. It's good enough once `npm run lint` finishes with sass-parser, reports the fixture's original values (`#fff`, `red`), and `npm run corpus` parses every file. Switching to SCSS would settle it immediately; the owner declined that on 2026-09-22.

## Questions for when this is selected

| Shortname | Question | Type | Blocked by |
|---|---|---|---|
| `parser-readiness` | Does current sass-parser get through stylelint's rules on the probe and corpus with unnormalized values? | research | sass-parser releases |
| `rule-set` | Which rules to enable: no literal colors in components, unknown properties, duplicates, anything stylistic? | decide | `parser-readiness` |
| `compiler-gate` | Should Sass deprecations fail the build in the meantime? | decide | nothing; independent of the parser |
| `upstream-report` | Report the percentage keyframe selector failure and the missing `Declaration.important` to dart-sass? | unblock | owner authorization for an external write |

## Probe

[probe/](probe/) holds pinned versions, two synthetic fixtures and three scripts. From `quests/sass-lint/probe`, run `npm install`, then:

- `npm run constructs`: per-construct parse check for both parsers, with the compiler as the reference for valid input.
- `npm run lint`: stylelint with five semantic rules on the fixtures, once per parser.
- `npm run corpus`: declarations each parser finds in `src/`, then stylelint with postcss-sass over the same files.
