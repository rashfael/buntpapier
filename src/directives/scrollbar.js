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
		this.updateThumb('x')
		this.updateThumb('y')

		this.innerEl.addEventListener('scroll', this.onScroll)
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

	// EVENTS
	onScroll (event) {
		this.computeThumbPositions()
		this.updateThumb('x')
		this.updateThumb('y')
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
		if (dimension === 'x') {
			state.thumbEl.style.width = state.thumbLength + 'px'
			state.thumbEl.style.left = state.thumbPosition + 'px'
		}
		if (dimension === 'y') {
			state.thumbEl.style.height = state.thumbLength + 'px'
			state.thumbEl.style.top = state.thumbPosition + 'px'
		}
	}
}

export default function (Vue) {
	Vue.directive('scrollbar', {
		inserted (el, binding, vnode) {
			new Scrollbars(Vue, el, binding, vnode)
		},
		componentUpdated (el, binding, vnode, oldVnode) {

		},
		unbind (el, binding, vnode, oldVnode) {

		}
	})
}
