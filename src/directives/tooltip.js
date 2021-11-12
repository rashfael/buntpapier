// Usage
// v-tooltip="'text'" shows on hover
// v-tooltip.bottom="" control placement https://popper.js.org/popper-documentation.html#Popper.placements
// v-tooltip="{text: 'text', show: alwaysShow, placement: 'right', fixed: true}" trigger show manually, set options programatically
// v-tooltip.fixed="" use position: fixed to break free of stacking context (lags slightly when scrolling)
import { nextTick } from 'vue'
import Popper from 'popper.js'

const ANIMATION_OFFSET = 32

export default function (Vue) {
	class Tooltip {
		constructor (el, options) {
			this.el = el
			this.options = options
			// bind all the event handlers
			this.show = this.show.bind(this)
			this.hide = this.hide.bind(this)
			this.options.placement = options.placement || 'auto'

			this.el.addEventListener('mouseenter', this.show)
			this.el.addEventListener('mouseleave', this.hide)
		}

		createTooltip () {
			if (this.tooltipEl) return
			this.tooltipEl = document.createElement('div')
			this.tooltipEl.classList.add('bunt-tooltip')
			this.tooltipEl.style.position = this.options.fixed ? 'fixed' : 'absolute'
			this.tooltipEl.textContent = this.text
			this.el.appendChild(this.tooltipEl)
			this.popper = new Popper(this.el, this.tooltipEl, {
				removeOnDestroy: true,
				placement: this.options.placement,
				positionFixed: this.options.fixed,
				modifiers: {
					offset: { offset: '0, 8' },
					applyStyle: { enabled: false },
					preventOverflow: {
						boundariesElement: this.options.boundariesElement || 'scrollParent',
					},
					applyTooltipStyle: {
						enabled: true,
						fn: (data) => {
							this.positions = data.popper
							this.tooltipEl.style.transform = `translate3d(${Math.round(this.positions.left)}px, ${Math.round(this.positions.top)}px, 0)`
						},
						order: 900
					}
				}
			})
		}

		update (text, forceDisplay) {
			this.text = text
			const oldForceDisplay = this.forceDisplay
			this.forceDisplay = forceDisplay
			nextTick(() => {
				if (forceDisplay) {
					if (!oldForceDisplay) this.show()
				} else {
					if (oldForceDisplay) this.hide() // TODO instead of fast hiding, buffer text?
				}
				if (this.tooltipEl) this.tooltipEl.textContent = this.text
				if (this.popper) this.popper.update()
			})
		}

		destroyTooltip () {
			if (!this.popper) return
			this.popper.destroy()
			this.popper = null
			this.tooltipEl = null
		}

		destroy () {
			this.destroyTooltip()
			this.el.removeEventListener('mouseenter', this.show)
			this.el.removeEventListener('mouseleave', this.hide)
		}

		show () {
			if (this.displaying || !this.text) return
			this.createTooltip()
			this.displaying = true
			nextTick(() => {
				if (this.animation) {
					this.animation.reverse()
				} else {
					let animationOrigin
					if (this.options.placement.startsWith('top')) {
						animationOrigin = {
							top: Math.round(this.positions.top) + ANIMATION_OFFSET,
							left: Math.round(this.positions.left)
						}
					} else if (this.options.placement.startsWith('left')) {
						animationOrigin = {
							top: Math.round(this.positions.top),
							left: Math.round(this.positions.left) + ANIMATION_OFFSET
						}
					} else if (this.options.placement.startsWith('right')) {
						animationOrigin = {
							top: Math.round(this.positions.top),
							left: Math.round(this.positions.left) - ANIMATION_OFFSET
						}
					} else {
						animationOrigin = {
							top: Math.round(this.positions.top) - ANIMATION_OFFSET,
							left: Math.round(this.positions.left)
						}
					}
					this.animation = this.tooltipEl.animate([
						{transform: `translate3d(${animationOrigin.left}px, ${animationOrigin.top}px, 0)`, opacity: 0},
						{transform: `translate3d(${Math.round(this.positions.left)}px, ${Math.round(this.positions.top)}px, 0)`, opacity: 1}
					], {
						duration: 200,
						easing: 'ease-in-out',
					})
					this.animation.onfinish = () => {
						if (this.animation && this.animation.playbackRate < 0) { // hide finished
							this.destroyTooltip()
							this.animation = null
						}
					}
				}
			})
		}

		hide () {
			if (!this.displaying || this.forceDisplay) return
			this.displaying = false
			if (this.animation) {
				this.animation.reverse()
			}
			if (!this.text) { // hide fast
				this.destroyTooltip()
			}
			// const animationOrigin = {
			// 	top: Math.round(this.positions.top) - 52,
			// 	left: Math.round(this.positions.left)
			// }
			// this.animation = this.tooltipEl.animate([
			// 	{transform: `translate3d(${Math.round(this.positions.left)}px, ${Math.round(this.positions.top)}px, 0)`, opacity: 1},
			// 	{transform: `translate3d(${animationOrigin.left}px, ${animationOrigin.top}px, 0)`, opacity: 0}
			// ], {
			// 	duration: 2000,
			// 	easing: 'ease-in-out',
			// })
			// this.animation.onfinish = () => {
			// 	this.animation = null
			// 	this.tooltipEl.style.display = 'none'
			// }
		}
	}

	Vue.directive('tooltip', {
		mounted (el, binding, vnode) {
			let text
			if (typeof binding.value === 'string') {
				text = binding.value
			} else {
				text = binding.value.text
			}
			el.__buntpapier__tooltip = new Tooltip(el, {
				placement: binding.value.placement || Object.keys(binding.modifiers).find(mod => ['auto', 'top', 'right', 'bottom', 'left'].find(pos => mod.startsWith(pos))),
				fixed: binding.value.fixed || binding.modifiers.fixed,
				boundariesElement: binding.value.boundariesElement
			})
			el.__buntpapier__tooltip.update(text, binding.value.show)
		},

		updated (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__tooltip || binding.value === binding.oldValue) return
			let text
			if (typeof binding.value === 'string') {
				text = binding.value
			} else {
				text = binding.value.text
			}
			el.__buntpapier__tooltip.update(text, binding.value.show)
		},
		unmounted (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__tooltip) return
			el.__buntpapier__tooltip.destroy()
		}
	})
}
