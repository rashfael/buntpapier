import { h as createElement, ref, reactive, toRef, computed, onMounted, onBeforeUpdate, onBeforeUnmount, nextTick, watch, provide, withDirectives, resolveComponent } from 'vue'
import Color from 'color'
import tooltipDirective from '../directives/tooltip.js'
import { useComputedStyle } from '../computedStyle.js'
import { firstReadable, CLR_PRIMARY_TEXT } from '../utils/colors.js'
import { getIconClass } from '../utils/icon.js'
import ProgressCircular from './progress-circular.vue'

export default {
	name: 'BuntButton',
	props: {
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
		tooltipOptions: Object,
		to: [String, Object]
	},
	emits: ['click'],
	setup (props, { attrs, slots, expose, emit }) {
		const {
			text,
			icon,
			loading,
			disabled,
			type,
			error,
			errorMessage,
			successAfterLoading,
			tooltip,
			tooltipPlacement,
			tooltipFixed,
			tooltipOptions,
			// router-link props
			to
		} = $(props)
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

			if (shape) classes.push(`bunt-button--shape-${shape}`)
			if (weight) classes.push(`bunt-button--weight-${weight}`)
			if (size) classes.push(`bunt-button--size-${size}`)
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

		const tooltipText = $computed(() => {
			return errorMessage ?? tooltip
		})

		const iconClass = $computed(() => {
			return getIconClass(icon)
		})

		let showSuccess = $ref(false)
		let successTimeout

		watch(() => loading, (value) => {
			if (value) {
				showSuccess = false
				if (successTimeout)
					clearTimeout(successTimeout)
			} else {
				if (errorMessage || error) return
				showSuccess = true
				successTimeout = setTimeout(() => {
					showSuccess = false
				}, 3000)
			}
		})

		watch(() => error || errorMessage, (value) => {
			if (value !== null) {
				showSuccess = false
			}
		})

		function onClick (event) {
			if (disabled || loading || showSuccess.value) return
			emit('click', event)
		}

		// TODO make this conditial for docs?
		expose({
			el
		})

		return () => {
			const textContent = slots.default?.() ?? text
			const rootClasses = [
				'bunt-button',
				...classes,
				{
					disabled,
					loading,
					error: errorMessage || error,
					success: showSuccess
				}
			]
			const content = [
				createElement('div', {
					class: 'bunt-button-content'
				}, [
					iconClass && createElement('i', {
						class: ['bunt-icon', 'mdi', iconClass]
					}),
					textContent && createElement('div', {
						class: 'bunt-button-text'
					}, textContent)
				])
			]

			if (loading) {
				content.push(createElement(ProgressCircular, {
					size: 'small'
				}))
			} else if (errorMessage || error) {
				content.push(createElement('i', {
					class: ['bunt-icon', 'error', 'mdi', 'mdi-replay']
				}))
			} else if (showSuccess) {
				content.push(createElement('i', {
					class: ['bunt-icon', 'success', 'mdi', 'mdi-check']
				}))
			}

			const tooltip = [[
				tooltipDirective,
				tooltipOptions || { text: tooltipText, show: !!errorMessage, fixed: tooltipFixed }
			]]

			if (to) {
				return createElement(resolveComponent('router-link'), {
					custom: true,
					to,
				}, {
					default ({ href, navigate }) {
						return withDirectives(
							createElement('a', {
								ref: el,
								...attrs,
								href,
								class: rootClasses,
								style,
								ariaDisabled: disabled,
								onClick (event) {
									if (disabled) return
									navigate(event)
									onClick(event)
								}
							}, content),
							tooltip)
					}
				})
			}
			return withDirectives(
				createElement('button', {
					ref: el,
					class: rootClasses,
					style,
					ariaDisabled: disabled,
					type,
					onClick
				}, content),
				tooltip)
		}
	}
}
