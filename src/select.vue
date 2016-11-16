<template lang="jade">
.bunt-select.dropdown(:class="dropdownClasses")
	// inline the input, use css from input component
	.bunt-input.dense(ref="searchContainer", :class="{focused: open, 'floating-label': rawSearch.length != 0 || !isValueEmpty}")
		.label-input-container
			label(:for="name") {{label}}
			input(type="text", ref="search", :name="name", v-model="rawSearch", v-show="searchable",
				@keydown.delete="maybeDeleteValue",
				@keyup.esc="onEscape",
				@keydown.up.prevent="typeAheadUp",
				@keydown.down.prevent="typeAheadDown",
				@keyup.enter.prevent="typeAheadSelect",
				@blur="open = false",
				@focus="focus",
				:placeholder="searchPlaceholder")
			i.open-indicator.material-icons(ref="openIndicator", role="presentation") arrow_drop_down
		.underline
		

	ul.bunt-select-dropdown-menu(ref="dropdownMenu", v-show="open",  :style="{ 'max-height': maxHeight, 'width': width+'px' }", @mousedown.prevent.stop="")
		li(v-for="option, index in filteredOptions", track-by="$index", :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }", @mouseover="typeAheadPointer = index", @mousedown.prevent.stop="select(option)")
			{{ getOptionLabel(option) }}
		li.divider(transition="fade", v-if="!filteredOptions.length")
		li.text-center(transition="fade" v-if="!filteredOptions.length")
			slot(name="no-options") Sorry, no matching options.
</template>
<script>
//nicked from sagalbot/vue-select
import pointerScroll from './mixins/pointer-scroll'
import typeAheadPointer from './mixins/type-ahead-pointer'
import Tether from 'tether'
import fuzzysearch from 'fuzzysearch'
import consts from './_constants'

export default {
	name: `${consts.prefix}-select`,
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
				return option
			}
		},
		
		optionValue: {
			type: String,
			default: 'id'
		},
		
		getOptionValue: {
			type: Function, 
			default(option) {
				if (typeof option === 'object') {
					if (this.optionValue && option[this.optionValue]) {
						return option[this.optionValue]
					}
				}
				return option
			}
		},
		
		findOptionByValue: {
			type: Function, 
			default(value) {
				const findFunc = (option) => {
					
					if (typeof option === 'object' && this.optionValue)
						return option[this.optionValue] === value
					return option === value
				}
				
				return this.options.find(findFunc)
			}
		}
	},

	data() {
		return {
			search: '',
			rawSearch: '',
			open: false,
			width: 0
		}
	},
	mounted () {
		this.width = this.$refs.searchContainer.getBoundingClientRect().width
		this._tether = new Tether({
			element: this.$refs.dropdownMenu,
			target: this.$refs.searchContainer,
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
		this.selectValue(this.value)
	},
	watch: {
		value (value) {
			this.selectValue(value)
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
			this.$refs.search.select()
			this.$nextTick(() => this._tether.position()) // delay until after dropdown is rendered
		},
		selectValue(value) {
			const option = this.findOptionByValue(value)
			this.rawSearch = this.getOptionLabel(option) || ''
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
				this.$emit('input', this.getOptionValue(option))
			}

			this.onAfterSelect(option)
		},

		/**
		 * De-select a given option.
		 * @param  {Object||String} option
		 * @return {void}
		 */
		deselect(option) {
			this.$emit('input', null)
		},

		/**
		 * Called from this.select after each selection.
		 * @param  {Object||String} option
		 * @return {void}
		 */
		onAfterSelect(option) {
			this.open = !this.open
			this.$refs.search.blur()
			this.rawSearch = this.getOptionLabel(option) || ''
		},

		/**
		 * Toggle the visibility of the dropdown menu.
		 * @param  {Event} e
		 * @return {void}
		 */
		toggleDropdown(e) {
			if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
				if (this.open) {
					this.$refs.search.blur() // dropdown will close on blur
				} else {
					this.open = true
					this.$refs.search.focus()
				}
			}
		},

		/**
		 * Check if the given option is currently selected.
		 * @param  {Object||String}  option
		 * @return {Boolean}         True when selected || False otherwise
		 */
		isOptionSelected(option) {
			return this.value === option
		},

		/**
		 * If there is any text in the search input, remove it.
		 * Otherwise, blur the search input to close the dropdown.
		 * @return {[type]} [description]
		 */
		onEscape() {
			if (!this.rawSearch.length) {
				this.$refs.search.blur()
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
			if (!this.$refs.search.value.length && this.value) {
				this.$emit('input', null)
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
			let options = this.search.length !== 0
				? this.options.filter((option) => fuzzysearch(this.search.toLowerCase(), this.getOptionLabel(option).toLowerCase()))
				: this.options.slice()
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
		}
	}

}
</script>
