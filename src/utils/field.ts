// Shared wiring for input and select: a field combines a wrapper, a native input and an optional popup into one control.
// These helpers route consumer attributes to the right element and track focus across the whole field.

import { onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue'
import type { Ref } from 'vue'

const contextAttributes = new Set(['lang', 'dir', 'hidden', 'inert', 'title'])

export function mergeDescriptionIds (...values: unknown[]) {
	return [...new Set(values.flatMap(value => String(value || '').split(/\s+/)).filter(Boolean))].join(' ') || undefined
}

/**
 * Distributes consumer attributes between the field wrapper, native input and popup.
 * Returns getters for the input ID, accessible name and each element's bindings: presentation and context on the root, context on the popup, and input attributes and listeners on the input.
 */
export function useFieldRouting () {
	// Call the getters during rendering: useAttrs exposes current bindings but is not reactive.
	const attrs = useAttrs()
	const id = () => String(attrs.id || `bunt-${useId()}`)
	const nameAttrs = (label?: string) => ({
		'aria-label': attrs['aria-label'],
		'aria-labelledby': attrs['aria-labelledby'] || (!attrs['aria-label'] && label ? `${id()}-label` : undefined)
	})
	const isRoot = (name: string) => name === 'class' || name === 'style' || name.startsWith('data-') || contextAttributes.has(name)
	return {
		id,
		nameAttrs,
		rootAttrs: () => Object.fromEntries(Object.entries(attrs).filter(([name]) => isRoot(name))),
		popupAttrs: () => Object.fromEntries(Object.entries(attrs).filter(([name]) => contextAttributes.has(name))),
		inputAttrs: (descriptionId?: string, label?: string) => ({
			...Object.fromEntries(Object.entries(attrs).filter(([name]) => !isRoot(name) && name !== 'role')),
			id: id(),
			...nameAttrs(label),
			'aria-describedby': mergeDescriptionIds(attrs['aria-describedby'], descriptionId)
		})
	}
}

/**
 * Tracks focus across the field's wrapper and optional popup, emitting focus and blur when focus enters or leaves the whole control.
 * Returns the focused ref, focus() for the native input, contains() for membership checks and isProgrammatic() to identify focus events caused by focus().
 */
export function useFieldFocus (root: Ref<HTMLElement>, input: Ref<HTMLInputElement>, emit: (event: 'focus' | 'blur') => void, popup?: Ref<HTMLElement>) {
	const focused = ref(false)
	let mounted = false
	let frame = 0
	let programmatic = false
	const contains = (node: Node) => Boolean(node && (root.value?.contains(node) || popup?.value?.contains(node)))
	const available = () => Boolean(input.value?.isConnected && !root.value?.closest('[hidden], [inert]') && input.value.getClientRects().length && getComputedStyle(input.value).visibility !== 'hidden')

	function reconcile () {
		if (!mounted) return
		const next = available() && contains(document.activeElement)
		if (focused.value !== next) {
			focused.value = next
			emit(next ? 'focus' : 'blur')
		}
		cancelAnimationFrame(frame)
		// Hidden or inert fields can lose availability without a focus event.
		if (next) frame = requestAnimationFrame(reconcile)
	}
	function onFocusOut () {
		// Wait for focus to reach its next target before deciding whether it left the field.
		queueMicrotask(reconcile)
	}
	function focus (options?: FocusOptions) {
		if (!mounted || !available()) return
		programmatic = true
		input.value.focus(options)
		programmatic = false
	}
	onMounted(() => {
		mounted = true
		document.addEventListener('focusin', reconcile)
		document.addEventListener('focusout', onFocusOut)
		reconcile()
	})
	onBeforeUnmount(() => {
		mounted = false
		cancelAnimationFrame(frame)
		document.removeEventListener('focusin', reconcile)
		document.removeEventListener('focusout', onFocusOut)
	})
	return { focused, focus, contains, isProgrammatic: () => programmatic }
}

export function preventFieldEdit (event: Event, locked: boolean) {
	if (locked) event.preventDefault()
}
