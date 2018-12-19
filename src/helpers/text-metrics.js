const measuringCanvas = process.client && document.createElement('canvas')

export function getTextMetrics (text, font) {
	if (!process.client) return 0
	var context = measuringCanvas.getContext('2d')
	context.font = font
	return context.measureText(text || '')
}
