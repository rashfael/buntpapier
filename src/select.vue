<template lang="pug">
.bunt-select.dropdown(:class="dropdownClasses", v-resize-observer="generateOutline")
	// inline the input, use css from input component
	.bunt-input.dense(ref="searchContainer", :class="{focused: open, 'floating-label': rawSearch.length != 0 || !isValueEmpty, invalid, disabled}", :style="{'--label-gap': floatingLabelWidth}")
		.label-input-container
			label(:for="name") {{label}}
			.icon.mdi(v-if="icon", :class="[iconClass]")
			input(type="text", ref="search", :name="name", v-model="rawSearch", :disabled="disabled",
				@keydown.delete="maybeDeleteValue",
				@keyup.esc="onEscape",
				@keydown.up.prevent="typeAheadUp",
				@keydown.down.prevent="typeAheadDown",
				@keyup.enter.prevent="typeAheadSelect",
				@blur="blur",
				@focus="focus",
				:placeholder="searchPlaceholder",
				autocomplete="off")
			i.open-indicator.mdi.mdi-menu-down(ref="openIndicator", role="presentation", @mousedown.prevent.stop="", @click.prevent.stop="toggleDropdown")
			svg.outline(ref="outline")
				path(:d="outlineStroke")
		.hint(v-if="hintIsHtml", v-html="hintText")
		.hint(v-else) {{ hintText }}

	component(v-if="open", :is="usePortals ? 'portal' : 'div'", to="bunt-overlays")
		.bunt-select-dropdown-menu(ref="dropdownMenu", :class="[dropdownClass]", :style="{ 'max-height': maxHeight, 'width': width+'px' }", @mousedown.prevent.stop="")
			slot(name="result-header")
			.scrollable-menu(v-scrollbar.y="")
				ul
					li(v-for="option, index in filteredOptions", :key="index", :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }", @mouseover="typeAheadPointer = index", @click.prevent.stop="select(option)")
						slot(:option="option")
							| {{ getOptionLabel(option) }}
					li.divider(transition="fade", v-if="!filteredOptions.length")
					li.text-center(transition="fade" v-if="!filteredOptions.length")
						slot(name="no-options") Sorry, no matching options.
</template>
<script>
// nicked from sagalbot/vue-select
import pointerScroll from './mixins/pointer-scroll'
import inputOutline from './mixins/input-outline'
import typeAheadPointer from './mixins/type-ahead-pointer'
import Popper from 'popper.js'
import fuzzysearch from 'fuzzysearch'
import iconHelper from './helpers/icon'

export default {
	name: `bunt-select`,
	mixins: [inputOutline, pointerScroll, typeAheadPointer],

	props: {
		name: {
			type: String,
			required: true
		},
		label: String,
		value: {
			type: [String, Object, Number],
			default: null
		},
		icon: String,
		/**
		 * An array of strings or objects to be used as dropdown choices.
		 * If you are using an array of objects, vue-select will look for
		 * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
		 * custom label key can be set with the `optionLabel` prop.
		 * @type {Object}
		 */
		options: {
			type: Array,
			default () {
				return []
			},
		},
		placeholder: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		maxHeight: {
			type: String,
			default: '400px'
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
		 * @param  {(string|Object)} option
		 * @return {String}
		 */
		getOptionLabel: {
			type: Function,
			default (option) {
				if (typeof option === 'object') {
					if (this.optionLabel !== undefined && option[this.optionLabel] !== undefined) {
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
			default (option) {
				if (typeof option === 'object') {
					if (this.optionValue !== undefined && option[this.optionValue] !== undefined) {
						return option[this.optionValue]
					}
				}
				return option
			}
		},
		findOptionByValue: {
			type: Function,
			default (value) {
				const findFunc = (option) => {
					if (typeof option === 'object' && this.optionValue)
						return option[this.optionValue] === value
					return option === value
				}

				return this.options.find(findFunc)
			}
		},
		hint: String,
		hintIsHtml: {
			type: Boolean,
			default: false
		},
		validation: Object, // vuelidate result
		dropdownClass: String
	},
	data () {
		return {
			search: '',
			rawSearch: '',
			open: false,
			width: 0,
			usePortals: this.$root.$options.components.Portal !== undefined && this.$root.$options.components.PortalTarget !== undefined
		}
	},
	computed: {
		/**
		 * Classes to be output on .dropdown
		 * @return {Object}
		 */
		dropdownClasses () {
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
		searchPlaceholder () {
			if (this.isValueEmpty && this.placeholder) {
				return this.placeholder
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
		filteredOptions () {
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
		isValueEmpty () {
			if (this.value) {
				if (typeof this.value === 'object') {
					return !Object.keys(this.value).length
				}
				return !this.value.length
			}

			return true
		},
		iconClass () {
			return iconHelper.getClass(this.icon)
		},
		invalid () {
			return this.validation && this.validation.$error
		},
		hintText () {
			if (this.invalid && this.validation.$params) {
				const errorMessages = Object.keys(this.validation.$params).map((key) => this.validation[key] ? null : this.validation.$params[key].message)
				return errorMessages.filter(Boolean).join()
			}
			return this.hint
		}
	},
	watch: {
		value (value) {
			this.selectValue(value)
		},
		rawSearch (val) {
			if (this.open)
				this.search = val
		},
		filteredOptions () {
			this._popper?.scheduleUpdate()
		}
	},
	mounted () {
		this.selectValue(this.value)
	},
	beforeDestroy () {
		this._popper?.destroy()
	},

	methods: {
		focus () {
			this.open = true
			this.search = ''
			this.$refs.search.select()
			this.width = this.$refs.searchContainer.getBoundingClientRect().width
			this.$nextTick(() => {
				this._popper = new Popper(this.$refs.search, this.$refs.dropdownMenu, {
					placement: 'bottom',
					positionFixed: true
				})
			})
		},
		blur () {
			this.open = false
			this.$nextTick(() => this._popper?.destroy())
			if (this.validation) this.validation.$touch()
			this.$emit('blur')
		},
		selectValue (value) {
			const option = this.findOptionByValue(value)
			this.rawSearch = this.getOptionLabel(option) || ''
		},
		/**
		 * Select a given option.
		 * @param  {(string|Object)} option
		 * @return {void}
		 */
		select (option) {
			if (this.isOptionSelected(option)) {
				this.deselect(option)
			} else {
				this.$emit('input', this.getOptionValue(option))
			}

			this.onAfterSelect(option)
		},

		/**
		 * De-select a given option.
		 * @param  {(string|Object)} option
		 * @return {void}
		 */
		deselect (option) {
			this.$emit('input', null)
		},

		/**
		 * Called from this.select after each selection.
		 * @param  {(string|Object)} option
		 * @return {void}
		 */
		onAfterSelect (option) {
			this.$refs.search.blur()
			this.rawSearch = this.getOptionLabel(option) || ''
		},

		/**
		 * Toggle the visibility of the dropdown menu.
		 * @param  {Event} e
		 * @return {void}
		 */
		toggleDropdown (e) {
			if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
				if (!this.open) {
					this.$refs.search.focus()
				} else {
					this.$refs.search.blur()
				}
			}
		},

		/**
		 * Check if the given option is currently selected.
		 * @param  {(string|Object)}  option
		 * @return {Boolean}         True when selected || False otherwise
		 */
		isOptionSelected (option) {
			return this.value === option
		},

		/**
		 * If there is any text in the search input, remove it.
		 * Otherwise, blur the search input to close the dropdown.
		 * @return {[type]} [description]
		 */
		onEscape () {
			if (!this.rawSearch.length) {
				this.$refs.search.blur()
			} else {
				this.deselect()
				this.rawSearch = ''
			}
		},

		/**
		 * Delete the value on Delete keypress when there is no
		 * text in the search input, & there's tags to delete
		 * @return {this.value}
		 */
		maybeDeleteValue () {
			if (!this.$refs.search.value.length && this.value) {
				this.$emit('input', null)
			}
		},

		/**
		 * Determine if an option exists
		 * within this.options array.
		 *
		 * @param  {(string|Object)} option
		 * @return {boolean}
		 */
		optionExists (option) {
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

}
</script>
