// usage
//
// `v-scrollbar` | `v-scrollbar.x.y` : scrolling both axis
// `v-scrollbar.x` | `v-scrollbar.y' : scrolling one axis`
// CAUTION: in jade, you need to use `v-scrollbar.x=''` (empty value)

import ResizeObserver from 'resize-observer-polyfill'

// TODO throttling

// partially nicked from https://github.com/DominikSerafin/vuebar/blob/development/vuebar.js
const IS_WEBKIT = 'WebkitAppearance' in document.documentElement.style

function getScrollbarWidth () {
	const outer = document.createElement('div')
	outer.style.visibility = 'hidden'
	outer.style.width = '100px'
	outer.style.overflow = 'scroll'
	const inner = document.createElement('div')
	inner.style.width = '100%'
	outer.appendChild(inner)
	document.body.appendChild(outer)
	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
	outer.parentNode.removeChild(outer)
	return scrollbarWidth
}

const SCROLLBAR_WIDTH = IS_WEBKIT ? 0 : getScrollbarWidth()

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
		this.innerEl = el.firstElementChild
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

		this.innerEl.addEventListener('scroll', this.onScroll)
		// observe all the changes and recompute
		if (!options.manualUpdate) {
			this.resizeObserver = new ResizeObserver(this.onResize)
			this.resizeObserver.observe(this.el)
			for (const el of this.innerEl.children) {
				this.resizeObserver.observe(el)
			}
			this.mutationObserver = new MutationObserver((records) => {
				for (const record of records) {
					for (const addedNode of record.addedNodes) {
						this.resizeObserver.observe(addedNode)
					}
					for (const removedNode of record.removedNodes) {
						this.resizeObserver.unobserve(removedNode)
					}
				}
				this.onResize()
			})
			this.mutationObserver.observe(this.innerEl, {
				childList: true
			})
		}
	}

	createRail (dimension) {
		const railEl = document.createElement('div')
		railEl.classList.add(`bunt-scrollbar-rail-${dimension}`)

		const thumbEl = document.createElement('div')
		thumbEl.classList.add('bunt-scrollbar-thumb')

		railEl.appendChild(thumbEl)
		this.el.appendChild(railEl)
		thumbEl.addEventListener('mousedown', this[`onThumbMousedown${dimension.toUpperCase()}`])
		this[dimension] = {
			railEl,
			thumbEl
		}
	}

	destroy () {
		this.resizeObserver.disconnect()
		this.mutationObserver.disconnect()
		document.removeEventListener('mousemove', this.onDocumentMousemove)
		document.removeEventListener('mousedown', this.onDocumentMousedown)
		document.removeEventListener('mouseup', this.onDocumentMouseup)
		this.innerEl.removeEventListener('scroll', this.onScroll)
		this.x?.thumbEl.removeEventListener('mousedown', this.onThumbMousedownX)
		this.y?.thumbEl.removeEventListener('mousedown', this.onThumbMousedownY)
	}

	refreshStyling () {
		this.el.classList.add('bunt-scrollbar')
		if (!IS_WEBKIT) {
			this.el.classList.add('bunt-scrollbar-non-webkit')
			this.innerEl.style.width = `calc(100% + ${SCROLLBAR_WIDTH}px)`
			this.innerEl.style.height = `calc(100% + ${SCROLLBAR_WIDTH}px)`
		}
		this.innerEl.classList.add('bunt-scrollbar-inner')
	}

	update () {
		this.updateThumb('x')
		this.updateThumb('y')
	}

	// EVENTS
	onScroll (event) {
		if (this.options.onScroll) {
			this.options.onScroll(event)
		} else {
			this.computeThumbPositions()
			this.update()
		}
	}

	onThumbMousedown (dimension, event) {
		this.dragging = dimension
		this.draggingOffset = event[`offset${dimension.toUpperCase()}`]
		if (IS_WEBKIT) {
			this.el.style.userSelect = 'none'
		} else {
			document.body.style['-moz-user-select'] = 'none'
		}
		this[dimension].railEl.classList.add('active')
		document.addEventListener('mousemove', this.onDocumentMousemove)
		document.addEventListener('mouseup', this.onDocumentMouseup)
	}

	onDocumentMousemove (event) {
		if (this.dragging === 'x') {
			const maxX = this.innerEl.clientWidth - this.x.thumbLength
			const newPosition = event.clientX - this.el.getBoundingClientRect().left - this.draggingOffset
			this.x.thumbPosition = Math.min(Math.max(0, newPosition), maxX)
			this.innerEl.scrollLeft = this.x.thumbPosition / maxX * (this.innerEl.scrollWidth - this.innerEl.clientWidth)
		}

		if (this.dragging === 'y') {
			const maxY = this.innerEl.clientHeight - this.y.thumbLength
			const newPosition = event.clientY - this.el.getBoundingClientRect().top - this.draggingOffset
			this.y.thumbPosition = Math.min(Math.max(0, newPosition), maxY)
			this.innerEl.scrollTop = this.y.thumbPosition / maxY * (this.innerEl.scrollHeight - this.innerEl.clientHeight)
		}
		this.updateThumb(this.dragging)
	}

	onDocumentMouseup (event) {
		this[this.dragging].railEl.classList.remove('active')
		this.dragging = null
		if (IS_WEBKIT) {
			this.el.style.userSelect = ''
		} else {
			document.body.style['-moz-user-select'] = ''
		}
		document.removeEventListener('mousemove', this.onDocumentMousemove)
		document.removeEventListener('mouseup', this.onDocumentMouseup)
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
			this.x.visibleRatio = this.innerEl.clientWidth / this.innerEl.scrollWidth
			this.x.thumbLength = this.innerEl.clientWidth * this.x.visibleRatio
		}
		if (this.y) {
			this.y.visibleRatio = this.innerEl.clientHeight / this.innerEl.scrollHeight
			this.y.thumbLength = this.innerEl.clientHeight * this.y.visibleRatio
		}
	}

	computeThumbPositions () {
		if (this.x) {
			this.x.thumbPosition = this.innerEl.scrollLeft / (this.innerEl.scrollWidth - this.innerEl.clientWidth) * (this.innerEl.clientWidth - this.x.thumbLength)
		}
		if (this.y) {
			this.y.thumbPosition = this.innerEl.scrollTop / (this.innerEl.scrollHeight - this.innerEl.clientHeight) * (this.innerEl.clientHeight - this.y.thumbLength)
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
				state.thumbEl.style.width = state.thumbLength + 'px'
				state.thumbEl.style.left = state.thumbPosition + 'px'
			} else if (dimension === 'y') {
				state.thumbEl.style.height = state.thumbLength + 'px'
				state.thumbEl.style.top = state.thumbPosition + 'px'
			}
		}
	}
}

export default function (Vue) {
	Vue.directive('scrollbar', {
		bind (el, binding, vnode) {
			el.__buntpapier__scrollbar = new Scrollbars(el, {
				scrollX: binding.modifiers.x,
				scrollY: binding.modifiers.y
			})
		},
		inserted (el) {
			if (!el.__buntpapier__scrollbar) return
			el.__buntpapier__scrollbar.refreshStyling()
			el.__buntpapier__scrollbar.update()
		},
		componentUpdated (el, binding, vnode, oldVnode) {
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
		unbind (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__scrollbar) return
			el.__buntpapier__scrollbar.destroy()
		}
	})
}

export { IS_WEBKIT, SCROLLBAR_WIDTH, Scrollbars }
