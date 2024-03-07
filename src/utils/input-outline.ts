import { h as createElement, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { getTextMetrics } from './text-metrics'

export function useInputOutline (labelRef: Ref<string>, radiusRef: Ref<number>, openSides: { top?: Ref<boolean>, bottom?: Ref<boolean>, left?: Ref<boolean>, right?: Ref<boolean> } = {}) {
	const label = $(labelRef)
	const radius = $(radiusRef)
	// const openBottom = $(openBottomRef)
	let outlineStroke = $ref(null)
	let outline = $ref(null)

	const floatingLabelWidth = $computed(() => {
		return label ? getTextMetrics(label, '12px \'Roboto\', "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif').width + 8 : 0
	})

	function updateOutline () {
		const { width, height } = outline.getBoundingClientRect()
		const cornerWidth = radius + 1
		const openOffset = radius === 0 ? 0 : 2
		outlineStroke = `M ${cornerWidth} 1`
		if (openSides.top?.value) {
			outlineStroke += `m 0 ${-openOffset}
				h ${width - 0.5 - cornerWidth}
				v ${height / 2}
			`
		} else {
			outlineStroke += `h ${width - 2 * cornerWidth}
				a ${radius} ${radius} 0 0 1 ${radius} ${radius}`
		}
		if (openSides.bottom?.value) {
			outlineStroke += `v ${height - openOffset}
				h ${-width + 2}
				v ${-height + openOffset}`
		} else {
			outlineStroke += `v ${height - 2 * cornerWidth}
				a ${radius} ${radius} 0 0 1 ${-radius} ${radius}
				h ${-width + 2 * cornerWidth}
				a ${radius} ${radius} 0 0 1 ${-radius} ${-radius}
				v ${-height + 2 * cornerWidth}`
		}
		outlineStroke += `a ${radius} ${radius} 0 0 1 ${radius} ${-radius}`
	}

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
		floatingLabelWidth
	}
}
