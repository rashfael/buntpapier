const measuringCanvas = (typeof window !== 'undefined') && document.createElement('canvas')

export function getTextMetrics (text, font) {
	if (typeof window === 'undefined') return 0
	var context = measuringCanvas.getContext('2d')
	context.font = font
	return context.measureText(text || '')
}
