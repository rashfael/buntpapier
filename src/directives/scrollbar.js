import ResizeObserver from 'resize-observer-polyfill'

// TODO throttling

// partially nicked from https://github.com/DominikSerafin/vuebar/blob/development/vuebar.js
const IS_WEBKIT = 'WebkitAppearance' in document.documentElement.style

class Scrollbars {
	constructor (Vue, el, binding, vnode) {
		// bind all the event handlers
		this.onScroll = this.onScroll.bind(this)
		this.onDocumentMousemove = this.onDocumentMousemove.bind(this)
		this.onDocumentMouseup = this.onDocumentMouseup.bind(this)
		this.onThumbMousedownX = this.onThumbMousedown.bind(this, 'x')
		this.onThumbMousedownY = this.onThumbMousedown.bind(this, 'y')
		this.onResize = this.onResize.bind(this)
		this.el = el
		this.innerEl = el.firstElementChild
		this.el.classList.add('v-scrollbar')
		if (!IS_WEBKIT) {
			this.el.classList.add('v-scrollbar-non-webkit')
		}
		this.innerEl.classList.add('v-scrollbar-inner')

		this.createRail('x')
		this.createRail('y')

		this.computeDimensions()
		this.computeThumbPositions()
		this.update()

		this.innerEl.addEventListener('scroll', this.onScroll)
		// observe all the changes and recompute
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

	createRail (dimension) {
		const railEl = document.createElement('div')
		railEl.classList.add(`v-scrollbar-rail-${dimension}`)

		const thumbEl = document.createElement('div')
		thumbEl.classList.add('v-scrollbar-thumb')

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
		this.x.thumbEl.removeEventListener('mousedown', this.onThumbMousedownX)
		this.y.thumbEl.removeEventListener('mousedown', this.onThumbMousedownY)
	}

	update () {
		this.updateThumb('x')
		this.updateThumb('y')
	}

	// EVENTS
	onScroll (event) {
		this.computeThumbPositions()
		this.update()
	}

	onThumbMousedown (dimension, event) {
		this.dragging = dimension
		this.draggingOffset = event[`offset${dimension.toUpperCase()}`]
		this.el.style.userSelect = 'none'
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
		this.dragging = null
		this.el.style.userSelect = ''
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
		inserted (el, binding, vnode) {
			el.__buntpapier__scrollbar = new Scrollbars(Vue, el, binding, vnode)
		},
		componentUpdated (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__scrollbar) return
			el.__buntpapier__scrollbar.update()
		},
		unbind (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__scrollbar) return
			el.__buntpapier__scrollbar.destroy()
		}
	})
}
