import Color from 'color'
import { normal as normalBlend } from 'color-blend'

export function blend (background, foreground) {
	const { r, g, b, a } = normalBlend({
		r: background.red(),
		g: background.green(),
		b: background.blue(),
		a: background.alpha()
	}, {
		r: foreground.red(),
		g: foreground.green(),
		b: foreground.blue(),
		a: foreground.alpha()
	})
	return Color({ r, g, b, alpha: a })
}

// ── OKLCH ↔ sRGB (hand-rolled to avoid another runtime dep) ─────────────────

function srgbToLinear (channel) {
	const c = channel / 255
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function linearToSrgb (channel) {
	const c = Math.min(1, Math.max(0, channel))
	return 255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)
}

export function toOklch (color) {
	const r = srgbToLinear(color.red())
	const g = srgbToLinear(color.green())
	const b = srgbToLinear(color.blue())
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
	const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	return {
		l: L,
		c: Math.sqrt(a * a + bb * bb),
		h: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360,
		alpha: color.alpha()
	}
}

export function fromOklch (l, c, h, alpha = 1) {
	const hRad = h * Math.PI / 180
	const a = c * Math.cos(hRad)
	const b = c * Math.sin(hRad)
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
	return Color({
		r: linearToSrgb(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
		g: linearToSrgb(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
		b: linearToSrgb(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
		alpha
	})
}

// ── parsing ──────────────────────────────────────────────────────────────────

// the `color` package can't parse the modern serializations that registered
// `@property` custom properties may produce (oklch()/oklab()/color(srgb ...))
export function parseColor (value) {
	if (value instanceof Color) return value
	const str = String(value).trim()
	try {
		return Color(str)
	} catch (e) {
		const match = str.match(/^(oklch|oklab|color)\(\s*([^)]+)\)$/i)
		if (!match) throw e
		const fn = match[1].toLowerCase()
		const [channelPart, alphaPart] = match[2].split('/')
		const channels = channelPart.trim().split(/\s+/).map(parseChannel)
		const alpha = alphaPart === undefined ? 1 : parseChannel(alphaPart)
		if (fn === 'oklch') return fromOklch(channels[0], channels[1], channels[2] || 0, alpha)
		if (fn === 'oklab') {
			const c = Math.sqrt(channels[1] ** 2 + channels[2] ** 2)
			const h = (Math.atan2(channels[2], channels[1]) * 180 / Math.PI + 360) % 360
			return fromOklch(channels[0], c, h, alpha)
		}
		// color(srgb r g b)
		const [space, r, g, b] = channelPart.trim().split(/\s+/)
		if (space !== 'srgb') throw e
		return Color({ r: parseChannel(r) * 255, g: parseChannel(g) * 255, b: parseChannel(b) * 255, alpha })
	}
}

function parseChannel (raw) {
	const str = String(raw).trim()
	if (str === 'none') return 0
	if (str.endsWith('%')) return parseFloat(str) / 100
	return parseFloat(str)
}

// ── derived colors ───────────────────────────────────────────────────────────

function contrastOn (surface, foreground) {
	return surface.contrast(blend(surface, foreground))
}

// Contrast-guards an accent used as ink (text/outlined weights) against the
// surface it sits on. Returns null if the accent is already readable (so
// callers can omit the override var and let CSS fall back), otherwise steps
// the OKLCH lightness away from the surface side until it reads.
// This emulates the candidate-list/target-contrast contrast-color() deferred
// to css-color-6 (and csswg-drafts#5153, continuous lightness adjustment) —
// delete it when that ships.
export function ensureReadable (accent, surface, threshold = 3) {
	const accentColor = parseColor(accent)
	const surfaceColor = parseColor(surface)
	if (contrastOn(surfaceColor, accentColor) >= threshold) return null
	// darken on light surfaces, lighten on dark ones
	const direction = toOklch(surfaceColor).l > 0.72 ? -1 : 1
	let { l } = toOklch(accentColor)
	const { c, h } = toOklch(accentColor)
	for (let i = 0; i < 20; i++) {
		l = Math.min(1, Math.max(0, l + direction * 0.05))
		const candidate = fromOklch(l, c, h)
		if (contrastOn(surfaceColor, candidate) >= threshold) return candidate
		if (l <= 0 || l >= 1) break
	}
	return direction === 1 ? Color('#fff') : Color('#000')
}

// Derives a dark-scheme variant from a (light-scheme) accent color by lifting
// its lightness into the Material-300 neighborhood, for building light-dark()
// pairs from a single brand color:
//   --clr-primary: light-dark(#330072, ${deriveDarkVariant('#330072')})
export function deriveDarkVariant (color) {
	const { l, c, h } = toOklch(parseColor(color))
	return fromOklch(Math.max(l, 0.78), Math.min(c, 0.14), h).hex().toLowerCase()
}
