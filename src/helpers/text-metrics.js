const measuringCanvas = document.createElement('canvas')

export function getTextMetrics (text, font) {
	var context = measuringCanvas.getContext('2d')
	context.font = font
	return context.measureText(text || '')
}
