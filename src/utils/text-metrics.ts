const measuringCanvas = (typeof window !== 'undefined') && document.createElement('canvas')

export function getTextMetrics (text, font) {
	if (typeof window === 'undefined') return 0
	const context = measuringCanvas.getContext('2d')
	context.font = font
	return context.measureText(text || '')
}
