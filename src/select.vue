<template lang="jade">
.bunt-select.dropdown(:class="dropdownClasses")
	//- .dropdown-toggle.clearfix(v-el:toggle, type="button")
	//- 	span.form-control(v-if="!searchable && isValueEmpty") {{ placeholder }}
	//- 	span.selected-tag(v-for="option in valueAsArray", track-by="$index")
	//- 		| {{ getOptionLabel(option) }}
	//- 		button.close(v-if="multiple", @click="select(option)", type="button")
	//- 			span(aria-hidden="true") &times;
	// inline the input, use css from input component
	.bunt-input.dense(v-el:search-container, :class="{focused: open, 'floating-label': rawSearch.length != 0 || !isValueEmpty}")
		.label-input-container
			label(:for="name") {{label}}
			input(type="text", v-el:search, :debounce="debounce", :name="name", v-model="rawSearch", v-show="searchable",
				@keydown.delete="maybeDeleteValue",
				@keyup.esc="onEscape",
				@keydown.up.prevent="typeAheadUp",
				@keydown.down.prevent="typeAheadDown",
				@keyup.enter.prevent="typeAheadSelect",
				@blur="open = false",
				@focus="focus",
				:placeholder="searchPlaceholder")
			i.open-indicator.material-icons(v-el:open-indicator, role="presentation") arrow_drop_down
		.underline
		

	ul.bunt-select-dropdown-menu(v-el:dropdown-menu, v-show="open",  :style="{ 'max-height': maxHeight, 'width': width+'px' }", @mousedown.prevent.stop="")
		li(v-for="option in filteredOptions", track-by="$index", :class="{ active: isOptionSelected(option), highlight: $index === typeAheadPointer }", @mouseover="typeAheadPointer = $index", @mousedown.prevent.stop="select(option)")
			{{ getOptionLabel(option) }}
		li.divider(transition="fade", v-if="!filteredOptions.length")
		li.text-center(transition="fade" v-if="!filteredOptions.length")
			slot(name="no-options") Sorry, no matching options.
</template>
<style lang="stylus">
.{$prefix}-select
	position relative
	.open-indicator
		position absolute
		right -6px
		color $clr-secondary-text-light
		font-size 28px
		line-height 20px
		transition all 0.25s ease-in-out
	&.open .open-indicator
		transform rotate(180deg)
	.bunt-input input
		box-sizing border-box
		padding-right 20px
.{$prefix}-select-dropdown-menu
	card()
	border-top none
	border-radius 0 0 2px 2px
	margin 0
	padding 0
	overflow-y scroll
	overflow-x hidden
	
	li
		list-style-type none
		height 32px
		line-height 32px
		text-overflow ellipsis
		white-space nowrap
		&.highlight
			background-color $highlight-color

</style>
<script>
//nicked from sagalbot/vue-select
import pointerScroll from './mixins/pointer-scroll'
import typeAheadPointer from './mixins/type-ahead-pointer'
import Tether from 'tether'

export default {
	mixins: [pointerScroll, typeAheadPointer],

	props: {
		name: {
			type: String,
			required: true
		},
		label: String,
		/**
		 * Contains the currently selected value. Very similar to a
		 * `value` attribute on an <input>. In most cases, you'll want
		 * to set this as a two-way binding, using :value.sync. However,
		 * this will not work with Vuex, in which case you'll need to use
		 * the onChange callback property.
		 * @type {Object||String||null}
		 */
		value: {
			default: null
		},

		/**
		 * An array of strings or objects to be used as dropdown choices.
		 * If you are using an array of objects, vue-select will look for
		 * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
		 * custom label key can be set with the `optionLabel` prop.
		 * @type {Object}
		 */
		options: {
			type: Array,
			default() {
				return []
			},
		},

		/**
		 * Sets the max-height property on the dropdown list.
		 * @deprecated
		 * @type {String}
		 */
		maxHeight: {
			type: String,
			default: '400px'
		},

		/**
		 * Enable/disable filtering the options.
		 * @type {Boolean}
		 */
		searchable: {
			type: Boolean,
			default: true
		},

		/**
		 * Equivalent to the `multiple` attribute on a `<select>` input.
		 * @type {Object}
		 */
		multiple: {
			type: Boolean,
			default: false
		},

		/**
		 * Equivalent to the `placeholder` attribute on an `<input>`.
		 * @type {Object}
		 */
		placeholder: {
			type: String,
			default: ''
		},

		/**
		 * Sets a Vue transition property on the `.dropdown-menu`. vue-select
		 * does not include CSS for transitions, you'll need to add them yourself.
		 * @type {String}
		 */
		transition: {
			type: String,
			default: 'expand'
		},

		/**
		 * Tells vue-select what key to use when generating option
		 * labels when each `option` is an object.
		 * @type {String}
		 */
		optionLabel: {
			type: String,
			default: 'label'
		},

		/**
		 * Callback to generate the label text. If {option}
		 * is an object, returns option[this.optionLabel] by default.
		 * @param  {Object || String} option
		 * @return {String}
		 */
		getOptionLabel: {
			type: Function,
			default(option) {
				if (typeof option === 'object') {
					if (this.optionLabel && option[this.optionLabel]) {
						return option[this.optionLabel]
					}
				}
				return option;
			}
		},

		/**
		 * An optional callback function that is called each time the selected
		 * value(s) change. When integrating with Vuex, use this callback to trigger
		 * an action, rather than using :value.sync to retreive the selected value.
		 * @type {Function}
		 * @default {null}
		 */
		onChange: Function,

		/**
		 * Enable/disable creating options from searchInput.
		 * @type {Boolean}
		 */
		taggable: {
			type: Boolean,
			default: false
		},

		/**
		 * When true, newly created tags will be added to
		 * the options list.
		 * @type {Boolean}
		 */
		pushTags: {
			type: Boolean,
			default: false
		},

		/**
		 * User defined function for adding Options
		 * @type {Function}
		 */
		createOption: {
			type: Function,
			default: function (newOption) {
				if (typeof this.options[0] === 'object') {
					return {[this.optionLabel]: newOption}
				}
				return newOption
			}
		},

		/**
		 * When false, updating the options will not reset the select value
		 * @type {Boolean}
		 */
		resetOnOptionsChange: {
			type: Boolean,
			default: false
		},
	},

	data() {
		return {
			search: '',
			rawSearch: '',
			open: false,
			width: 0
		}
	},
	ready () {
		this.width = this.$els.searchContainer.getBoundingClientRect().width
		this._tether = new Tether({
			element: this.$els.dropdownMenu,
			target: this.$els.searchContainer,
			attachment: 'top left',
			targetAttachment: 'bottom left',
			constraints: [
				{
					to: 'window',
					attachment: 'together'
				}
			]
			// offset: '-24px 0'
		})
	},
	watch: {
		value (val, old) {
			if (this.multiple) {
				this.onChange ? this.onChange(val) : null
			} else {
				this.onChange && val !== old ? this.onChange(val) : null
			}
		},
		options () {
			if (!this.taggable && this.resetOnOptionsChange) {
				this.$set('value', this.multiple ? [] : null)
			}
		},
		multiple (val) {
			this.$set('value', val ? [] : null)
		},
		rawSearch (val) {
			if(this.open)
				this.search = val
		},
		filteredOptions () {
			this._tether.position()
		}
	},

	methods: {
		focus () {
			this.open = true
			this.$els.search.select()
			this.$nextTick(() => this._tether.position()) // delay until after dropdown is rendered
		},
		/**
		 * Select a given option.
		 * @param  {Object||String} option
		 * @return {void}
		 */
		select(option) {
			if (this.isOptionSelected(option)) {
				this.deselect(option)
			} else {
				if (this.taggable && !this.optionExists(option)) {
					option = this.createOption(option)

					if (this.pushTags) {
						this.options.push(option)
					}
				}

				if (this.multiple) {
					if (!this.value) {
						this.$set('value', [option])
					} else {
						this.value.push(option)
					}
				} else {
					this.value = option
				}
			}

			this.onAfterSelect(option)
		},

		/**
		 * De-select a given option.
		 * @param  {Object||String} option
		 * @return {void}
		 */
		deselect(option) {
			if (this.multiple) {
				let ref = -1
				this.value.forEach((val) => {
					if (val === option || typeof val === 'object' && val[this.optionLabel] === option[this.optionLabel]) {
						ref = val
					}
				})
				this.value.$remove(ref)
			} else {
				this.value = null
			}
		},

		/**
		 * Called from this.select after each selection.
		 * @param  {Object||String} option
		 * @return {void}
		 */
		onAfterSelect(option) {
			if (!this.multiple) {
				this.open = !this.open
				this.$els.search.blur()
				this.rawSearch = this.getOptionLabel(option)
			}
			this.search = ''
		},

		/**
		 * Toggle the visibility of the dropdown menu.
		 * @param  {Event} e
		 * @return {void}
		 */
		toggleDropdown(e) {
			if (e.target === this.$els.openIndicator || e.target === this.$els.search || e.target === this.$els.toggle || e.target === this.$el) {
				if (this.open) {
					this.$els.search.blur() // dropdown will close on blur
				} else {
					this.open = true
					this.$els.search.focus()
				}
			}
		},

		/**
		 * Check if the given option is currently selected.
		 * @param  {Object||String}  option
		 * @return {Boolean}         True when selected || False otherwise
		 */
		isOptionSelected(option) {
			if (this.multiple && this.value) {
				let selected = false
				this.value.forEach(opt => {
					if (typeof opt === 'object' && opt[this.optionLabel] === option[this.optionLabel]) {
						selected = true
					} else if (opt === option) {
						selected = true
					}
				})
				return selected
			}

			return this.value === option
		},

		/**
		 * If there is any text in the search input, remove it.
		 * Otherwise, blur the search input to close the dropdown.
		 * @return {[type]} [description]
		 */
		onEscape() {
			if (!this.rawSearch.length) {
				this.$els.search.blur()
			} else {
				this.rawSearch = ''
			}
		},

		/**
		 * Delete the value on Delete keypress when there is no
		 * text in the search input, & there's tags to delete
		 * @return {this.value}
		 */
		maybeDeleteValue() {
			if (!this.$els.search.value.length && this.value) {
				return this.multiple ? this.value.pop() : this.$set('value', null)
			}
		},

		/**
		 * Determine if an option exists
		 * within this.options array.
		 *
		 * @param  {Object || String} option
		 * @return {boolean}
		 */
		optionExists(option) {
			let exists = false

			this.options.forEach(opt => {
				if (typeof opt === 'object' && opt[this.optionLabel] === option) {
					exists = true
				} else if (opt === option) {
					exists = true
				}
			})

			return exists
		}
	},

	computed: {
		/**
		 * Classes to be output on .dropdown
		 * @return {Object}
		 */
		dropdownClasses() {
			return {
				open: this.open,
				searchable: this.searchable,
				loading: this.loading
			}
		},

		/**
		 * Return the placeholder string if it's set
		 * & there is no value selected.
		 * @return {String} Placeholder text
		 */
		searchPlaceholder() {
			if (this.isValueEmpty && this.placeholder) {
				return this.placeholder;
			}
		},

		/**
		 * The currently displayed options, filtered
		 * by the search elements value. If tagging
		 * true, the search text will be prepended
		 * if it doesn't already exist.
		 *
		 * @return {array}
		 */
		filteredOptions() {
			let options = this.$options.filters.filterBy(this.options, this.search)
			if (this.taggable && this.search.length && !this.optionExists(this.search)) {
				options.unshift(this.search)
			}
			return options
		},

		/**
		 * Check if there aren't any options selected.
		 * @return {Boolean}
		 */
		isValueEmpty() {
			if (this.value) {
				if (typeof this.value === 'object') {
					return !Object.keys(this.value).length
				}
				return !this.value.length
			}

			return true;
		},

		/**
		 * Return the current value in array format.
		 * @return {Array}
		 */
		valueAsArray() {
			if (this.multiple) {
				return this.value
			} else if (this.value) {
				return [this.value]
			}

			return []
		}
	}

}
</script>
