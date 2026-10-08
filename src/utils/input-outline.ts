import { h as createElement, onMounted, nextTick, watch } from 'vue'
import type { Ref, TemplateRef } from 'vue'

const LABEL_GAP_PADDING = 8

// TODO negate openSides

export function useInputOutline ({ label: labelRef, radius: radiusRef, openSides = {} }: { label: TemplateRef<HTMLElement>, radius: Ref<number>, openSides?: { top?: Ref<boolean>, bottom?: Ref<boolean>, left?: Ref<boolean>, right?: Ref<boolean> } }) {
	const radius = $(radiusRef)
	let outlineStroke = $ref(null)
	let outline = $ref(null)
	let floatingLabelWidth = $ref(0)

	// gap size is computed by measuring the DOM label
	function measureLabel ([entry]: ResizeObserverEntry[]) {
		const label = entry.target
		if (!label.textContent) {
			floatingLabelWidth = 0
			return
		}
		const width = entry.borderBoxSize[0].inlineSize
		// a hidden label (display: none, like the select's while open) reports 0; keep the last gap
		if (!width) return
		const scale = parseFloat(getComputedStyle(label).getPropertyValue('--_label-scale')) || 1
		floatingLabelWidth = width * scale + LABEL_GAP_PADDING
	}

	watch(labelRef, (label, _previous, onCleanup) => {
		if (!label) return
		const observer = new ResizeObserver(measureLabel)
		observer.observe(label)
		onCleanup(() => observer.disconnect())
	})

	function updateOutline () {
		if (!outline) return
		const { width, height } = outline.getBoundingClientRect()
		// the path is drawn inset by 1px (cornerWidth = r + 1), so the corner arcs must fit within half the inset box. clamp the radius accordingly — without this a true pill (radius ≈ height/2) makes the straight sides go negative, so the path doubles back and the stroke draws twice at the left/right midpoints (visible as two brighter dots, especially in dark mode).
		const r = Math.max(0, Math.min(radius, (height - 2) / 2, (width - 2) / 2))
		const cornerWidth = r + 1
		const openOffset = r === 0 ? 0 : 2
		outlineStroke = `M ${cornerWidth} 1`
		if (openSides.top?.value) {
			outlineStroke += `m 0 ${-openOffset}
				h ${width - 0.5 - cornerWidth}
				v ${height / 2}
			`
		} else {
			outlineStroke += `h ${width - 2 * cornerWidth}
				a ${r} ${r} 0 0 1 ${r} ${r}`
		}
		if (openSides.bottom?.value) {
			outlineStroke += `v ${height - openOffset}
				h ${-width + 2}
				v ${-height + openOffset}`
		} else {
			outlineStroke += `v ${height - 2 * cornerWidth}
				a ${r} ${r} 0 0 1 ${-r} ${r}
				h ${-width + 2 * cornerWidth}
				a ${r} ${r} 0 0 1 ${-r} ${-r}
				v ${-height + 2 * cornerWidth}`
		}
		outlineStroke += `a ${r} ${r} 0 0 1 ${r} ${-r}`
	}

	watch(radiusRef, updateOutline)

	onMounted(async () => {
		await nextTick()
		updateOutline()
	})

	return {
		Outline () {
			return createElement('svg', {
				class: 'outline',
				ref: (el) => outline = el,
				style: {
					'--label-gap': floatingLabelWidth
				}
			}, [
				createElement('path', {
					d: outlineStroke
				})
			])
		},
		updateOutline,
		floatingLabelWidth: $$(floatingLabelWidth)
	}
}
