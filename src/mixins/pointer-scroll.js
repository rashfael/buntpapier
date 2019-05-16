export default {
	watch: {
		typeAheadPointer () {
			this.maybeAdjustScroll()
		}
	},

	methods: {
		/**
     * Adjust the scroll position of the dropdown list
     * if the current pointer is outside of the
     * overflow bounds.
     * @returns {*}
     */
		maybeAdjustScroll () {
			if (!this.$refs.dropdownMenu) return
			let pixelsToPointerTop = this.pixelsToPointerTop()
			let pixelsToPointerBottom = this.pixelsToPointerBottom()

			if (pixelsToPointerTop <= this.viewport().top) {
				return this.scrollTo(pixelsToPointerTop)
			} else if (pixelsToPointerBottom >= this.viewport().bottom) {
				return this.scrollTo(this.viewport().top + this.pointerHeight())
			}
		},

		/**
     * The distance in pixels from the top of the dropdown
     * list to the top of the current pointer element.
     * @returns {number}
     */
		pixelsToPointerTop () {
			let pixelsToPointerTop = 0
			let elements = this.$refs.dropdownMenu.children
			for (let i = 0; i < this.typeAheadPointer; i++) {
				pixelsToPointerTop += elements[i] ? elements[i].offsetHeight : 0
			}
			return pixelsToPointerTop
		},

		/**
     * The distance in pixels from the top of the dropdown
     * list to the bottom of the current pointer element.
     * @returns {*}
     */
		pixelsToPointerBottom () {
			return this.pixelsToPointerTop() + this.pointerHeight()
		},

		/**
     * The offsetHeight of the current pointer element.
     * @returns {number}
     */
		pointerHeight () {
			let element = this.$refs.dropdownMenu.children[this.typeAheadPointer]
			return element ? element.offsetHeight : 0
		},

		/**
     * The currently viewable portion of the dropdownMenu.
     * @returns {{top: (string|*|number), bottom: *}}
     */
		viewport () {
			return {
				top: this.$refs.dropdownMenu.scrollTop,
				bottom: this.$refs.dropdownMenu.offsetHeight + this.$refs.dropdownMenu.scrollTop
			}
		},

		/**
     * Scroll the dropdownMenu to a given position.
     * @param position
     * @returns {*}
     */
		scrollTo (position) {
			return this.$refs.dropdownMenu.scrollTop = position
		},
	}
}
