// TODOs
// - better disabled styling

import { h as createElement, ref, watch, withDirectives, resolveComponent, mergeProps, DirectiveArguments, ConcreteComponent, watchEffect } from 'vue'
import Color from 'color'
import tooltipDirective from '../directives/tooltip'
import { useComputedStyle } from '../computedStyle'
import { firstReadable, CLR_PRIMARY_TEXT } from '../utils/colors'
import { getIconClass } from '../utils/icon'
import ProgressCircular from './progress-circular.vue'

export default {
	name: 'BuntButton',
	props: {
		text: String,
		icon: String,
		loading: {
			type: [Boolean, String], // true | false | 'auto'
			default: undefined
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
		to: [String, Object],
		onClick: Function,
	},
	// emits: ['click'],
	setup (props, { attrs, slots, expose }) {
		const {
			text,
			icon,
			disabled,
			type,
			error,
			successAfterLoading,
			tooltip,
			tooltipPlacement,
			tooltipFixed,
			tooltipOptions,
			// router-link props
			to
		} = $(props)
		const el = ref()

		const { classes, style, customProps: { iconPlacement } } = useComputedStyle(el, {
			'--button-shape': 'shape',
			'--button-weight': 'weight',
			'--button-size': 'size',
			'--_button-color': 'color',
			'--_button-color-error': 'errorColor',
			'--_button-color-success': 'successColor',
			'--button-text-color': 'textColor',
			'--icon-placement': 'iconPlacement'
		}, ({ shape, weight, size, color, errorColor, successColor, textColor, iconPlacement }) => {
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

			if (iconPlacement) classes.push(`bunt-button--icon-placement-${iconPlacement}`)

			return { style, classes }
		})

		const tooltipText = $computed(() => {
			return errorMessage ?? tooltip
		})

		const iconClass = $computed(() => {
			return getIconClass(icon)
		})

		let loading = $ref()
		watchEffect(() => {
			if (props.loading !== undefined && props.loading !== 'auto') loading = props.loading
		})
		let errorMessage = $ref()
		watchEffect(() => {
			if (props.errorMessage !== undefined) errorMessage = props.errorMessage
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
			if (disabled || loading || showSuccess) return
			const ret = props.onClick?.(event)
			// if loading mode is 'auto' and onClick is a promise, set loading and error
			if (props.loading === 'auto' && ret && typeof ret.then === 'function') {
				loading = true
				errorMessage = null
				ret.catch((err) => {
					errorMessage = err.message || err
				}).finally(() => {
					loading = false
				})
			}
		}

		// TODO make this conditial for docs?
		expose({
			el
		})

		return () => {
			const textContent = slots.default?.() ?? text
			const hasContent =
				(typeof textContent === 'string' && textContent.length > 0) ||
				(Array.isArray(textContent) && textContent.length > 0 && textContent.some(vnode => vnode.children))
			const iconNode = slots.icon?.() ?? (
				iconClass && createElement('i', {
					class: ['bunt-icon', 'mdi', iconClass]
				})
			)
			function getRootClasses () {
				return [
					'bunt-button',
					...classes,
					{
						disabled,
						loading,
						error: errorMessage || error,
						success: showSuccess,
						'with-icon': !!iconNode,
						'icon-only': !hasContent && !!iconNode,
					}
				]
			}
			const content = [
				createElement('div', {
					class: 'bunt-button-content'
				}, [
					iconNode,
					hasContent && createElement('div', {
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

			const tooltip: DirectiveArguments = [[
				tooltipDirective,
				tooltipOptions || { text: tooltipText, show: !!errorMessage, fixed: tooltipFixed }
			]]

			if (to) {
				return createElement(resolveComponent('router-link') as ConcreteComponent, {
					custom: true,
					to,
				}, {
					default ({ href, navigate, isActive, isExactActive }) {
						return withDirectives(
							createElement('a', mergeProps({
								ref: el,
								href,
								class: [
									...getRootClasses(),
									{
										'router-link-active': isActive,
										'router-link-exact-active': isExactActive
									}
								],
								style,
								ariaDisabled: disabled,
								onClick (event) {
									if (disabled) return
									navigate(event)
									onClick(event)
								}
							}, attrs), content),
							tooltip)
					}
				})
			}
			return withDirectives(
				createElement('button', {
					ref: el,
					class: getRootClasses(),
					style,
					ariaDisabled: disabled,
					type,
					onClick
				}, content),
				tooltip)
		}
	}
}
