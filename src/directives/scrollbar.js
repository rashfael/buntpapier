// TODO look at this https://developers.google.com/web/updates/2017/03/custom-scrollbar

// usage
//
// `v-scrollbar` | `v-scrollbar.x.y` : scrolling both axis
// `v-scrollbar.x` | `v-scrollbar.y' : scrolling one axis`
// CAUTION: in pug, you need to use `v-scrollbar.x=''` (empty value)

import ResizeObserver from 'resize-observer-polyfill'

// TODO throttling

class Scrollbars {
	constructor (el, options) {
		this.options = options
		// bind all the event handlers
		this.onScroll = this.onScroll.bind(this)
		this.onDocumentMousemove = this.onDocumentMousemove.bind(this)
		this.onDocumentMouseup = this.onDocumentMouseup.bind(this)
		this.onThumbMousedownX = this.onThumbMousedown.bind(this, 'x')
		this.onThumbMousedownY = this.onThumbMousedown.bind(this, 'y')
		this.onResize = this.onResize.bind(this)
		this.el = el
		this.railsParent = options.railsParent || this.el
		this.refreshStyling()
		if (options.scrollX)
			this.createRail('x')
		if (options.scrollY)
			this.createRail('y')

		if (!options.manualCompute) {
			this.computeDimensions()
			this.computeThumbPositions()
			this.update()
		}
		this.el.addEventListener('scroll', this.onScroll)
		// observe all the changes and recompute
		if (!options.manualUpdate) {
			this.resizeObserver = new ResizeObserver(this.onResize)
			this.resizeObserver.observe(this.el)
			for (const el of this.el.children) {
				this.resizeObserver.observe(el)
			}
			this.mutationObserver = new MutationObserver((records) => {
				for (const record of records) {
					for (const addedNode of record.addedNodes) {
						if (addedNode.nodeType !== Node.ELEMENT_NODE) continue
						this.resizeObserver.observe(addedNode)
					}
					for (const removedNode of record.removedNodes) {
						if (removedNode.nodeType !== Node.ELEMENT_NODE) continue
						this.resizeObserver.unobserve(removedNode)
					}
				}
				this.onResize()
			})
			this.mutationObserver.observe(this.el, {
				childList: true
			})
		}
	}

	createRail (dimension) {
		const railWrapperEl = document.createElement('div')
		railWrapperEl.classList.add(`bunt-scrollbar-rail-wrapper-${dimension}`)
		const railEl = document.createElement('div')
		railEl.classList.add(`bunt-scrollbar-rail-${dimension}`)
		const thumbEl = document.createElement('div')
		thumbEl.classList.add('bunt-scrollbar-thumb')
		railWrapperEl.appendChild(railEl)
		railEl.appendChild(thumbEl)
		this.railsParent.appendChild(railWrapperEl)
		thumbEl.addEventListener('mousedown', this[`onThumbMousedown${dimension.toUpperCase()}`])
		this[dimension] = {
			railEl,
			thumbEl
		}
	}

	destroy () {
		this.resizeObserver?.disconnect()
		this.mutationObserver?.disconnect()
		document.removeEventListener('mousemove', this.onDocumentMousemove)
		document.removeEventListener('mouseup', this.onDocumentMouseup, {capture: true})
		this.el.removeEventListener('scroll', this.onScroll)
		this.x?.thumbEl.removeEventListener('mousedown', this.onThumbMousedownX)
		this.y?.thumbEl.removeEventListener('mousedown', this.onThumbMousedownY)
	}

	refreshStyling () {
		this.el.classList.add('bunt-scrollbar')
	}

	update () {
		this.updateThumb('x')
		this.updateThumb('y')
	}

	// EVENTS
	onScroll (event) {
		if (this.options.onScroll) {
			this.options.onScroll(event)
		}
		this.computeThumbPositions()
		this.update()
	}

	onThumbMousedown (dimension, event) {
		event.stopPropagation()
		if (this.options._preventMousedown) {
			event.preventDefault()
		}
		this.dragging = dimension
		this.draggingOffset = event[`offset${dimension.toUpperCase()}`]
		this.el.style.userSelect = 'none'
		document.body.style['-moz-user-select'] = 'none'
		this[dimension].railEl.classList.add('active')
		document.addEventListener('mousemove', this.onDocumentMousemove)
		document.addEventListener('mouseup', this.onDocumentMouseup, {capture: true})
	}

	onDocumentMousemove (event) {
		if (this.dragging === 'x') {
			const maxX = this.el.clientWidth - this.x.thumbLength
			const newPosition = event.clientX - this.el.getBoundingClientRect().left - this.draggingOffset
			this.x.thumbPosition = Math.min(Math.max(0, newPosition), maxX)
			this.el.scrollLeft = this.x.thumbPosition / maxX * (this.el.scrollWidth - this.el.clientWidth)
		}

		if (this.dragging === 'y') {
			const maxY = this.el.clientHeight - this.y.thumbLength
			const newPosition = event.clientY - this.el.getBoundingClientRect().top - this.draggingOffset
			this.y.thumbPosition = Math.min(Math.max(0, newPosition), maxY)
			this.el.scrollTop = this.y.thumbPosition / maxY * (this.el.scrollHeight - this.el.clientHeight)
		}
		this.updateThumb(this.dragging)
	}

	onDocumentMouseup (event) {
		this[this.dragging].railEl.classList.remove('active')
		this.dragging = null
		this.el.style.userSelect = ''
		document.body.style['-moz-user-select'] = ''
		document.removeEventListener('mousemove', this.onDocumentMousemove)
		document.removeEventListener('mouseup', this.onDocumentMouseup, {capture: true})
	}

	onResize (entries) {
		// TODO for performance, use values reported by the observer?
		this.computeDimensions()
		this.computeThumbPositions()
		this.update()
	}

	// COMPUTATIONS

	computeDimensions () {
		if (this.x) {
			this.x.railLength = this.el.clientWidth
			this.x.visibleRatio = this.el.clientWidth / this.el.scrollWidth
			this.x.thumbLength = this.el.clientWidth * this.x.visibleRatio
		}
		if (this.y) {
			this.y.railLength = this.el.clientHeight
			this.y.visibleRatio = this.el.clientHeight / this.el.scrollHeight
			this.y.thumbLength = this.el.clientHeight * this.y.visibleRatio
		}
	}

	computeThumbPositions () {
		if (this.x) {
			this.x.thumbPosition = this.el.scrollLeft / (this.el.scrollWidth - this.el.clientWidth) * (this.el.clientWidth - this.x.thumbLength)
		}
		if (this.y) {
			this.y.thumbPosition = this.el.scrollTop / (this.el.scrollHeight - this.el.clientHeight) * (this.el.clientHeight - this.y.thumbLength)
		}
	}

	updateThumb (dimension) {
		const state = this[dimension]
		if (!state) return
		if (state.visibleRatio >= 1) {
			state.thumbEl.style.display = 'none'
		} else {
			state.thumbEl.style.display = null
			if (dimension === 'x') {
				state.railEl.style.width = state.railLength + 'px'
				state.thumbEl.style.width = state.thumbLength + 'px'
				state.thumbEl.style.left = state.thumbPosition + 'px'
			} else if (dimension === 'y') {
				state.railEl.style.height = state.railLength + 'px'
				state.thumbEl.style.height = state.thumbLength + 'px'
				state.thumbEl.style.top = state.thumbPosition + 'px'
			}
		}
	}
}

export default function (Vue) {
	Vue.directive('scrollbar', {
		mounted (el, binding, vnode) {
			el.__buntpapier__scrollbar = new Scrollbars(el, {
				scrollX: binding.modifiers.x,
				scrollY: binding.modifiers.y,
				_preventMousedown: binding.value?._preventMousedown
			})
			el.__buntpapier__scrollbar.refreshStyling()
			el.__buntpapier__scrollbar.update()
		},
		updated (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__scrollbar) {
				el.__buntpapier__scrollbar = new Scrollbars(el, {
					scrollX: binding.modifiers.x,
					scrollY: binding.modifiers.y
				})
			} else {
				el.__buntpapier__scrollbar.refreshStyling()
				el.__buntpapier__scrollbar.update()
			}
		},
		beforeUnmount (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__scrollbar) return
			el.__buntpapier__scrollbar.destroy()
		}
	})
}

export { Scrollbars }
