<script>
export default {
	name: 'BuntButton'
}
</script>
<script setup>
import { ref, computed, watch, useSlots } from 'vue'
import Color from 'color'
import { useComputedStyle } from '../computedStyle.js'
import { firstReadable, CLR_PRIMARY_TEXT } from '../utils/colors.js'
import { getIconClass } from '../utils/icon.js'
import ProgressCircular from './progress-circular.vue'

const props = defineProps({
	text: String,
	icon: String,
	loading: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		default: 'button'
	},
	error: Boolean,
	errorMessage: String,
	successAfterLoading: {
		type: Boolean,
		default: true
	},
	tooltip: String,
	tooltipPlacement: {
		type: String,
		default: 'bottom'
	},
	tooltipFixed: {
		type: Boolean,
		default: false
	},
	tooltipOptions: Object
})
const emit = defineEmits(['click'])
const slots = useSlots()

const el = ref()

const { classes, style } = useComputedStyle(el, {
	'--button-shape': 'shape',
	'--button-weight': 'weight',
	'--button-size': 'size',
	'--_button-color': 'color',
	'--_button-color-error': 'errorColor',
	'--_button-color-success': 'successColor',
	'--button-text-color': 'textColor',
}, ({ shape, weight, size, color, errorColor, successColor, textColor }) => {
	const style = {}
	const classes = []

	if (shape) {
		classes.push(`bunt-button--shape-${shape}`)
	}

	if (weight) {
		classes.push(`bunt-button--weight-${weight}`)
	}

	if (size) {
		classes.push(`bunt-button--size-${size}`)
	}
	if (color) {
		style['--_button-text-color'] = textColor || firstReadable([CLR_PRIMARY_TEXT.DARK, CLR_PRIMARY_TEXT.LIGHT], color, 3)
		let bgColor
		try {
			bgColor = Color(color).hsl()
		} catch (e) {
			console.error('Could not parse color', e)
			bgColor = Color('#FFF').hsl()
		}
		style['--_button-bg-h'] = bgColor.hue()
		style['--_button-bg-s'] = bgColor.saturationl() + '%'
		style['--_button-bg-l'] = bgColor.lightness() + '%'
	}
	// TODO might be overkill to compute the defaults all the time
	if (errorColor) {
		style['--_button-text-color-error'] = firstReadable([CLR_PRIMARY_TEXT.DARK, CLR_PRIMARY_TEXT.LIGHT], errorColor, 3)
		let bgColor
		try {
			bgColor = Color(errorColor).hsl()
		} catch (e) {
			console.error('Could not parse color', e)
			bgColor = Color('#FFF').hsl()
		}
		style['--_button-bg-error-h'] = bgColor.hue()
		style['--_button-bg-error-s'] = bgColor.saturationl() + '%'
		style['--_button-bg-error-l'] = bgColor.lightness() + '%'
	}
	if (successColor) {
		style['--_button-text-color-success'] = firstReadable([CLR_PRIMARY_TEXT.DARK, CLR_PRIMARY_TEXT.LIGHT], successColor, 3)
		let bgColor
		try {
			bgColor = Color(successColor).hsl()
		} catch (e) {
			console.error('Could not parse color', e)
			bgColor = Color('#FFF').hsl()
		}
		style['--_button-bg-success-h'] = bgColor.hue()
		style['--_button-bg-success-s'] = bgColor.saturationl() + '%'
		style['--_button-bg-success-l'] = bgColor.lightness() + '%'
	}

	return { style, classes }
})

const tooltipText = computed(() => {
	return props.errorMessage ?? props.tooltip
})

const iconClass = computed(() => {
	return getIconClass(props.icon)
})

const showSuccess = ref(false)
let successTimeout

watch(() => props.loading, (value) => {
	if (value) {
		showSuccess.value = false
		if (successTimeout)
			clearTimeout(successTimeout)
	} else {
		if (props.errorMessage || props.error) return
		showSuccess.value = true
		successTimeout = setTimeout(() => {
			showSuccess.value = false
		}, 3000)
	}
})

watch(() => props.error || props.errorMessage, (value) => {
	if (value !== null) {
		showSuccess.value = false
	}
})

function onClick (event) {
	if (props.disabled || props.loading || showSuccess.value) return
	emit('click', event)
}

// TODO make this conditial for docs?
defineExpose({
	el
})

</script>
<template lang="pug">
button.bunt-button(ref="el", :type="props.type", :class="[...classes, {disabled: props.disabled, loading: props.loading, error: props.errorMessage || props.error, success: showSuccess}]", :aria-disabled="disabled", v-tooltip="tooltipOptions || {text: tooltipText, show: !!props.errorMessage, fixed: props.tooltipFixed}", @click="onClick")
	.bunt-button-content
		i.bunt-icon.mdi(v-if="iconClass", :class="[iconClass]")
		.bunt-button-text
			slot
				span {{ props.text }}
	ProgressCircular(v-if="loading", size="small")
	i.bunt-icon.mdi.mdi-replay.error(v-if="errorMessage || error")
	i.bunt-icon.mdi.mdi-check.success(v-if="showSuccess")
</template>
