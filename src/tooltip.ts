import { onScopeDispose, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { createPopper } from '@popperjs/core'
import type { Boundary, Placement } from '@popperjs/core'
import { mergeDescriptionIds } from './utils/field'

export interface TooltipOptions {
	text?: string
	show?: boolean
	placement?: Placement
	fixed?: boolean
	boundariesElement?: Boundary
}

export type TooltipContent = string | TooltipOptions | null | undefined

type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>

/**
 * Owns a tooltip in the current Vue scope; control receives focus events and the accessible description.
 * Accepts refs or getters for reactive content and elements. Control defaults to the anchor.
 * Returns an optional early-stop function; scope disposal stops the tooltip automatically.
 */
export function useTooltip (anchor: ElementSource, content: MaybeRefOrGetter<TooltipContent>, control: ElementSource = anchor) {
	let instance: Tooltip | undefined
	const stopWatching = watch(() => {
		const value = toValue(content)
		return { anchor: toValue(anchor), control: toValue(control), options: typeof value === 'string' ? { text: value } : { ...value } }
	}, ({ anchor, control, options }) => {
		if (instance && (instance.el !== anchor || instance.target !== control)) {
			instance.destroy()
			instance = undefined
		}
		if (!anchor || !control) return
		if (instance) instance.update(options)
		else instance = new Tooltip(anchor, control, options)
	}, { immediate: true, flush: 'post' })
	function stop () {
		stopWatching()
		instance?.destroy()
		instance = undefined
	}
	onScopeDispose(stop)
	return stop
}

const ANIMATION_OFFSET = 32
const ANIMATION_DURATION = 200

let nextTooltipId = 0

class Tooltip {
	el: HTMLElement
	target: HTMLElement
	options: TooltipOptions
	tooltipEl?: HTMLElement
	popper?: ReturnType<typeof createPopper>
	observer: MutationObserver
	id: string
	hovered = false
	keyboardFocused = false
	pointerDown = false
	dismissed = false
	disposed = false
	displaying = false
	positions?: { x: number, y: number }
	placement = 'bottom'
	animation?: Animation
	forced: boolean
	text: unknown
	pointerTimer?: ReturnType<typeof setTimeout>

	constructor (el: HTMLElement, target: HTMLElement, options: TooltipOptions) {
		this.el = el
		this.target = target
		this.id = `${this.target.id || `bunt-tooltip-${++nextTooltipId}`}-description`
		this.options = options
		this.forced = !!options.show
		this.text = options.text
		el.addEventListener('mouseenter', this.enter)
		el.addEventListener('mouseleave', this.leave)
		el.addEventListener('pointerdown', this.onPointerDown, true)
		this.target.addEventListener('focus', this.onFocus)
		this.target.addEventListener('blur', this.onBlur)
		this.target.addEventListener('click', this.onActivate)
		document.addEventListener('pointerup', this.onPointerEnd)
		document.addEventListener('pointercancel', this.onPointerEnd)
		document.addEventListener('keydown', this.onKeydown)
		this.observer = new MutationObserver(() => this.describe())
		this.observer.observe(this.target, { attributes: true, attributeFilter: ['aria-describedby'] })
		this.refresh()
	}

	enter = () => {
		this.hovered = true
		this.dismissed = false
		this.refresh()
	}

	leave = () => {
		this.hovered = false
		this.refresh()
	}

	onPointerDown = () => {
		clearTimeout(this.pointerTimer)
		this.pointerDown = true
		this.keyboardFocused = false
	}

	onPointerEnd = () => {
		clearTimeout(this.pointerTimer)
		this.pointerTimer = setTimeout(() => {
			this.pointerDown = false
		})
	}

	onFocus = () => {
		this.keyboardFocused = !this.pointerDown
		if (this.keyboardFocused) this.dismissed = false
		this.refresh()
	}

	onBlur = () => {
		this.keyboardFocused = false
		this.refresh()
	}

	onActivate = () => {
		if (this.options.show) return
		this.dismissed = true
		this.refresh()
	}

	onKeydown = (event: KeyboardEvent) => {
		this.pointerDown = false
		if (event.key !== 'Escape' || !this.displaying) return
		this.dismissed = true
		this.refresh()
	}

	describe () {
		const current = this.target.getAttribute('aria-describedby')
		const others = (current || '').split(/\s+/).filter(id => id !== this.id)
		const next = mergeDescriptionIds(...others, this.displaying ? this.id : undefined)
		if ((current || undefined) === next) return
		if (next) this.target.setAttribute('aria-describedby', next)
		else this.target.removeAttribute('aria-describedby')
	}

	refresh () {
		if (this.disposed) return
		const shouldDisplay = this.options.text && !this.dismissed && (this.options.show || this.hovered || this.keyboardFocused)
		if (!shouldDisplay) {
			this.hide(!this.options.text)
			return
		}
		this.show()
	}

	show () {
		if (!this.tooltipEl) this.create()
		this.tooltipEl.textContent = this.options.text
		this.tooltipEl.removeAttribute('aria-hidden')
		this.displaying = true
		this.describe()
		if (this.animation?.playbackRate < 0) this.animation.reverse()
		this.positionAndAnimate(this.tooltipEl)
	}

	create () {
		const tooltip = document.createElement('div')
		this.tooltipEl = tooltip
		tooltip.className = 'bunt-tooltip'
		tooltip.id = this.id
		tooltip.setAttribute('role', 'tooltip')
		tooltip.style.position = this.options.fixed ? 'fixed' : 'absolute'
		this.el.appendChild(tooltip)
		const placement = getComputedStyle(this.el).getPropertyValue('--tooltip-placement').trim() as Placement || this.options.placement || 'auto'
		this.popper = createPopper(this.el, tooltip, {
			placement,
			strategy: this.options.fixed ? 'fixed' : 'absolute',
			modifiers: [
				{ name: 'offset', options: { offset: [0, 8] } },
				{ name: 'preventOverflow', options: { boundary: this.options.boundariesElement || 'clippingParents' } },
				{ name: 'applyStyles', enabled: false },
				{
					name: 'applyTooltipStyle',
					enabled: true,
					phase: 'write',
					fn: ({ state }) => {
						if (!this.tooltipEl) return
						this.positions = state.modifiersData.popperOffsets
						this.placement = state.placement
						this.tooltipEl.style.transform = `translate3d(${Math.round(this.positions.x)}px, ${Math.round(this.positions.y)}px, 0)`
					}
				}
			]
		})
	}

	async positionAndAnimate (tooltip: HTMLElement) {
		if (!this.popper) return
		await this.popper.update()
		if (!this.displaying) {
			this.destroyTooltip()
			return
		}
		if (this.animation) return
		if (this.disposed || this.tooltipEl !== tooltip || !this.positions) return
		const destination = { top: Math.round(this.positions.y), left: Math.round(this.positions.x) }
		const origin = { ...destination }
		if (this.placement.startsWith('top')) origin.top += ANIMATION_OFFSET
		else if (this.placement.startsWith('left')) origin.left += ANIMATION_OFFSET
		else if (this.placement.startsWith('right')) origin.left -= ANIMATION_OFFSET
		else origin.top -= ANIMATION_OFFSET
		const animation = tooltip.animate([
			{ transform: `translate3d(${origin.left}px, ${origin.top}px, 0)`, opacity: 0 },
			{ transform: `translate3d(${destination.left}px, ${destination.top}px, 0)`, opacity: 1 }
		], {
			duration: ANIMATION_DURATION,
			easing: 'ease-in-out'
		})
		this.animation = animation
		animation.onfinish = () => {
			if (this.animation !== animation || this.displaying) return
			this.destroyTooltip()
		}
	}

	update (options: TooltipOptions) {
		this.options = options
		if (options.show && (!this.forced || options.text !== this.text)) this.dismissed = false
		this.forced = !!options.show
		this.text = options.text
		this.refresh()
	}

	hide (fast = false) {
		if (!this.tooltipEl) return
		this.displaying = false
		this.tooltipEl.setAttribute('aria-hidden', 'true')
		this.describe()
		if (fast) {
			this.destroyTooltip()
			return
		}
		if (this.animation && this.animation.playbackRate >= 0) this.animation.reverse()
	}

	destroyTooltip () {
		this.displaying = false
		this.animation?.cancel()
		this.popper?.destroy()
		this.tooltipEl?.remove()
		this.animation = undefined
		this.popper = undefined
		this.tooltipEl = undefined
		this.positions = undefined
	}

	destroy () {
		this.disposed = true
		clearTimeout(this.pointerTimer)
		this.displaying = false
		this.observer.disconnect()
		this.describe()
		this.destroyTooltip()
		this.el.removeEventListener('mouseenter', this.enter)
		this.el.removeEventListener('mouseleave', this.leave)
		this.el.removeEventListener('pointerdown', this.onPointerDown, true)
		this.target.removeEventListener('focus', this.onFocus)
		this.target.removeEventListener('blur', this.onBlur)
		this.target.removeEventListener('click', this.onActivate)
		document.removeEventListener('pointerup', this.onPointerEnd)
		document.removeEventListener('pointercancel', this.onPointerEnd)
		document.removeEventListener('keydown', this.onKeydown)
	}
}
