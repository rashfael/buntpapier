import Color from 'color'
import { normal as normalBlend } from 'color-blend'

export const CLR_PRIMARY_TEXT = {LIGHT: Color('rgba(0, 0, 0, .87)'), DARK: Color('rgba(255, 255, 255, 1)')}
export const CLR_SECONDARY_TEXT = {LIGHT: Color('rgba(0, 0, 0, .54)'), DARK: Color('rgba(255, 255, 255, .7)')}
export const CLR_SECONDARY_TEXT_FALLBACK = {LIGHT: Color('rgba(0, 0, 0, .74)'), DARK: Color('rgba(255, 255, 255, .9)')}
export const CLR_DISABLED_TEXT = {LIGHT: Color('rgba(0, 0, 0, .38)'), DARK: Color('rgba(255, 255, 255, .5)')}
export const CLR_DIVIDERS = {LIGHT: Color('rgba(255, 255, 255, .63)'), DARK: Color('rgba(255, 255, 255, .63)')}

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

// returns first color with enough (>=4.5) contrast or failing that, the color with the highest contrast
// on background, alpha gets blended
export function firstReadable (colors, background = '#FFF', threshold = 4.5) {
	try {
		background = Color(background)
	} catch (e) {
		console.error('Could not parse color', e)
		background = Color('#FFF')
	}
	let best
	let bestContrast = 0
	for (let color of colors) {
		color = Color(color)
		const contrast = background.contrast(blend(background, color))
		if (contrast >= threshold) return color
		else if (contrast > bestContrast) {
			best = color
			bestContrast = contrast
		}
	}
	// console.warn('THEME COLOR HAS NOT ENOUGH CONTRAST', best.string(), 'on', background.string(), '=', bestContrast)
	return best
}
