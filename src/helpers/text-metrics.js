const measuringCanvas = !process.server && document.createElement('canvas')

export function getTextMetrics (text, font) {
	if (process.server) return 0
	var context = measuringCanvas.getContext('2d')
	context.font = font
	return context.measureText(text || '')
}
