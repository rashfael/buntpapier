// Re-runs registered useComputedStyle instances when the theme context changes
// (color-scheme / theme class toggles on <html>/<body>, OS scheme preference).
// Subtree-local theme toggles are invisible to these observers — call the
// exported refreshComputedStyles() manually for those, or set
// `--bunt-will-change: all` on the subtree for per-frame recomputation.

const callbacks = new Set<() => void>()
let started = false

function start () {
	if (started || import.meta.env.SSR) return
	started = true
	const observer = new MutationObserver(refreshComputedStyles)
	for (const el of [document.documentElement, document.body]) {
		observer.observe(el, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
	}
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshComputedStyles)
}

export function onThemeChange (callback) {
	start()
	callbacks.add(callback)
	return () => callbacks.delete(callback)
}

export function refreshComputedStyles () {
	for (const callback of callbacks) {
		callback()
	}
}
