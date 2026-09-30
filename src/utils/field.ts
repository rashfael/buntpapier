// Shared wiring for input, checkbox, select and both date pickers. A field is a wrapper, the control it is
// built around — a native input, or an inline calendar's named group — and an optional popup.
// These helpers route consumer attributes to the right element and track focus across the whole field.

import { onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue'
import type { Ref } from 'vue'

const contextAttributes = new Set(['lang', 'dir', 'hidden', 'inert', 'title'])

export function mergeDescriptionIds (...values: unknown[]) {
	return [...new Set(values.flatMap(value => String(value || '').split(/\s+/)).filter(Boolean))].join(' ') || undefined
}

/**
 * Distributes consumer attributes between the field wrapper, its control and the popup.
 * Returns getters for the control ID, accessible name and each element's bindings: presentation and context on the root, context on the popup, and the rest on the control.
 * `attr` reads one caller binding, for defaults a component must resolve itself.
 */
export function useFieldRouting () {
	// Call the getters during rendering: useAttrs exposes current bindings but is not reactive.
	const attrs = useAttrs()
	const generatedId = `bunt-${useId()}`
	const id = () => String(attrs.id || generatedId)
	// `label` is the component's label content, or just whether it renders any.
	const nameAttrs = (label?: string | boolean) => ({
		'aria-label': attrs['aria-label'] as string,
		'aria-labelledby': (attrs['aria-labelledby'] || (!attrs['aria-label'] && label ? `${id()}-label` : undefined)) as string
	})
	const isRoot = (name: string) => name === 'class' || name === 'style' || name.startsWith('data-') || contextAttributes.has(name)
	return {
		id,
		nameAttrs,
		attr: (name: string) => attrs[name],
		rootAttrs: () => Object.fromEntries(Object.entries(attrs).filter(([name]) => isRoot(name))),
		popupAttrs: () => Object.fromEntries(Object.entries(attrs).filter(([name]) => contextAttributes.has(name))),
		inputAttrs: (descriptionId?: string, label?: string | boolean) => ({
			...Object.fromEntries(Object.entries(attrs).filter(([name]) => !isRoot(name) && name !== 'role')),
			id: id(),
			...nameAttrs(label),
			'aria-describedby': mergeDescriptionIds(attrs['aria-describedby'], descriptionId)
		})
	}
}

interface FieldFocusOptions {
	/** Focusable content outside the root, such as a teleported dropdown. */
	popup?: Ref<HTMLElement>
	/** Moves focus back into the field when an element inside it stops being focusable. Defaults to the control. */
	repair?: () => void
}

/**
 * Tracks focus across the field's wrapper and optional popup, emitting focus and blur when focus enters or leaves the whole field.
 * Returns the focused ref, focus() for the control, contains() for membership checks, available() for the control's focusability and isProgrammatic() to identify focus events caused by focus().
 */
export function useFieldFocus (root: Ref<HTMLElement>, control: Ref<HTMLElement>, emit: (event: 'focus' | 'blur') => void, { popup, repair }: FieldFocusOptions = {}) {
	const focused = ref(false)
	let mounted = false
	let frame = 0
	let programmatic = false
	let lastInside: HTMLElement = null
	let lastInsideAncestors: HTMLElement[] = []
	const contains = (node: Node) => Boolean(node && (root.value?.contains(node) || popup?.value?.contains(node)))
	const rendered = (node: HTMLElement) => Boolean(node?.isConnected && node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden')
	const available = () => Boolean(rendered(control.value) && !root.value?.closest('[hidden], [inert]'))

	// Records where a focused element sat, so a repair can still find its surroundings after it is
	// removed. Recomputed only when focus moves, not per frame.
	function ancestorsWithin (node: HTMLElement) {
		const chain: HTMLElement[] = []
		for (let parent = node?.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
			chain.push(parent)
			if (parent === root.value) break
		}
		return chain
	}

	// CSS can hide the element that holds focus, for example a clear action suppressed through
	// --input-clear. Chromium then keeps document.activeElement on the invisible element and
	// Firefox drops focus to the body; neither fires an event naming the field, so the reconcile
	// loop repairs it while the field still owns focus.
	// Only that one element may have gone: its surroundings staying in place is what distinguishes
	// a suppressed or removed action from a dismissal. An element removed together with its
	// container takes its parent out of the document too, so fall back to the recorded ancestors. An
	// outside click closing a popup instead leaves the popover connected but unrendered, which reads
	// as the dismissal it is, and focus stays where the user put it.
	function repairFocus () {
		const active = document.activeElement as HTMLElement
		const stranded = contains(active) ? active : (!active || active === document.body ? lastInside : null)
		if (!stranded || stranded === control.value || rendered(stranded)) return
		// A removed element keeps its parent, so the live parent can be detached too. Take the
		// nearest ancestor still in the document and ask whether it is shown.
		const chain = stranded.parentElement ? [stranded.parentElement, ...lastInsideAncestors] : lastInsideAncestors
		if (!rendered(chain.find(node => node.isConnected))) return
		if (repair) repair()
		else focus()
	}

	function reconcile () {
		if (!mounted) return
		repairFocus()
		const active = document.activeElement as HTMLElement
		const next = available() && contains(active)
		if (next) {
			if (lastInside !== active) lastInsideAncestors = ancestorsWithin(active)
			lastInside = active
		} else if (active && active !== document.body) {
			lastInside = null
			lastInsideAncestors = []
		}
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
		control.value.focus(options)
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
	return { focused, focus, contains, available, isProgrammatic: () => programmatic }
}

export function preventFieldEdit (event: Event, locked: boolean) {
	if (locked) event.preventDefault()
}
