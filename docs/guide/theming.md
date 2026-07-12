# Theming & Dark Mode

buntpapier is themed entirely through CSS custom properties — including light/dark mode. There is no theme object, no JavaScript configuration, and switching themes at runtime is just changing a CSS value.

::: warning Browser support
The theming system uses [`contrast-color()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color), [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) and [relative color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors). It requires **Chrome 147+, Firefox 146+ or Safari 26+** (Baseline newly available, April 2026). Older browsers fail silently — there is no graceful degradation.
:::

## One token to know: `--clr-surface`

`--clr-surface` is the background color your components sit on. Everything else — text, labels, outlines, dividers, hover fills — is derived from it automatically:

```css
:root {
	--clr-surface: light-dark(#fff, #121212); /* the default */
}
```

buntpapier picks a readable ink (black or white) for the surface via `contrast-color()`, then builds the usual emphasis levels from it. You don't set text colors per theme — they follow the surface.

## Derived tokens you can use

The derived tokens are public for *reading* — use them in your own styles and they'll always match the local surface:

| token | derived as | use for |
| --- | --- | --- |
| `--clr-text` | 87% ink | body text |
| `--clr-text-secondary` | 60% ink | secondary text, labels |
| `--clr-text-disabled` | 38% ink | disabled text |
| `--clr-divider` | 12% ink | hairlines, borders |
| `--clr-fill-hover` | 8% ink | hover backgrounds |
| `--clr-fill-disabled` | 8% ink | disabled fills |
| `--clr-on-primary` | black/white vs `--clr-primary` | text on accent fills |

```css
.my-card-meta {
	color: var(--clr-text-secondary);
	border-top: 1px solid var(--clr-divider);
}
```

These replace the static `--clr-*-text-light` / `--clr-*-text-dark` tokens from earlier versions (still defined, but deprecated).

Don't *set* the derived tokens — they are re-derived on every element, so an override only affects the element it's set on. To change them, set `--clr-surface` or `--clr-ink`.

## Enabling dark mode

Dark mode is keyed on the standard [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) property — which also flips native form controls, scrollbars and system colors for free:

```css
/* always dark */
:root { color-scheme: dark; }

/* follow the OS preference */
:root { color-scheme: light dark; }

/* class-based toggle (this documentation works this way) */
html.dark { color-scheme: dark; }
```

buntpapier defaults to `color-scheme: light` (in a cascade layer, so any of the above wins) — upgrading apps don't suddenly turn dark.

## Per-subtree theming

Both `color-scheme` and `--clr-surface` work on any element, not just `:root`. Components inside the subtree re-derive everything:

<div style="display: flex; gap: 16px; margin: 16px 0;">
	<div style="flex: 1; padding: 16px; border-radius: 8px; color-scheme: light; background: var(--clr-surface); border: 1px solid var(--clr-divider);">
		<bunt-checkbox style="margin-bottom: 8px;" label="light card"></bunt-checkbox>
		<bunt-button>button</bunt-button>
	</div>
	<div style="flex: 1; padding: 16px; border-radius: 8px; color-scheme: dark; background: var(--clr-surface); border: 1px solid var(--clr-divider);">
		<bunt-checkbox style="margin-bottom: 8px;" label="dark card"></bunt-checkbox>
		<bunt-button>button</bunt-button>
	</div>
</div>

```html
<div style="color-scheme: dark; background: var(--clr-surface)">
	<!-- everything in here renders dark -->
	<bunt-checkbox label="dark card"></bunt-checkbox>
	<bunt-button>button</bunt-button>
</div>
```

::: tip Runtime switching
The CSS-derived colors update instantly when `color-scheme` or `--clr-surface` changes. The small JavaScript contrast guard (see below) re-runs automatically when the theme flips on `<html>`/`<body>` or the OS preference changes; for theme toggles deeper in the tree, call the exported `refreshComputedStyles()` after switching, or set `--bunt-will-change: all` on the subtree.
:::

## Custom surface colors

`--clr-surface` accepts any opaque color, not just white/black — brand-tinted panels work out of the box:

```css
.sidebar {
	--clr-surface: #1a2b3c;
	color-scheme: dark; /* so accents pick their dark-scheme side */
	background: var(--clr-surface);
}
```

The ink is chosen by `contrast-color()`, which uses WCAG 2 contrast math — on mid-tone surfaces it tends to prefer white where black might look better. If you disagree with its pick, override the ink directly:

```css
.mid-tone-panel {
	--clr-surface: #7a8288;
	--clr-ink: #000; /* force black-derived text/dividers/fills */
}
```

## Accent colors

The semantic accents are `light-dark()` pairs — a stronger tone on light surfaces, a lighter tone on dark ones:

```css
:root {
	--clr-primary: light-dark(var(--clr-blue), var(--clr-blue-300)); /* the default */
}
```

Brand colors rarely work on both schemes (a deep purple text-button is invisible on dark). Supply a pair:

```css
:root {
	--clr-primary: light-dark(#330072, #b794f6);
}
```

If you only have one brand color, the exported `deriveDarkVariant()` helper builds the dark side for you (lifts the lightness into a dark-scheme-friendly range, keeps the hue):

```js
import { deriveDarkVariant } from 'buntpapier'

document.documentElement.style.setProperty(
	'--clr-primary',
	`light-dark(#330072, ${deriveDarkVariant('#330072')})`
)
```

The theme picker in this documentation's navbar does exactly this — pick a light color and watch the derived dark variant, or override it explicitly.

### The contrast guard

Where an accent is used *as ink* (text- and outlined-weight buttons, outlined checkboxes), buntpapier additionally contrast-checks it against the resolved surface at runtime. If it falls below 3:1 (WCAG 1.4.11), the lightness is shifted until it reads — your `#330072` text-button stays legible on dark even if you forget the pair. Explicit values (`--button-text-color`) always win over the guard.

## Raised surfaces

Menus and popovers (select dropdown, date-picker) render on a *raised* surface — slightly lighter than the base surface in dark mode, white-on-white (plus shadow) in light mode. It derives automatically; pin it for custom skins via:

```css
:root {
	--clr-surface-raised: #2a2a35;
}
```

## Caveats

- **Surfaces must be opaque flat colors** — `transparent`, gradients or alpha colors break the ink derivation (it falls back to white).
- **Avoid theme-flash**: set `color-scheme` in CSS that's present at first paint, not from JavaScript after mount.
- **Teleported overlays** (the select dropdown) follow the theme context of their *trigger*, which buntpapier forwards automatically.
- **Forced colors mode** (Windows high contrast) overrides color properties at the UA level — buntpapier doesn't fight it.
- **Printing** defaults back to `color-scheme: light`; explicitly dark surfaces are your responsibility.
