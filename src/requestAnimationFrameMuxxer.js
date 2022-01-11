const handlers = []

function callHandlers () {
	for (const handler of handlers) {
		handler()
	}
	requestAnimationFrame(callHandlers)
}

callHandlers()

export function registerHandler (handler) {
	handlers.push(handler)
}

export function unregisterHandler (handler) {
	const index = handlers.indexOf(handler)
	if (index !== -1) {
		handlers.splice(index, 1)
	}
}
