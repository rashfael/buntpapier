<template lang="jade">
button.bunt-button(:class="styleClasses", :type="type", :disabled="disabled || loading", ref="button")
	.bunt-button-content(:class="{ 'invisible': loading }")
		i.bunt-icon.material-icons(v-if="icon", v-html="icon")
		//- quake-icon.quake-button-icon(:class="{ 'position-right': iconRight }", :icon="icon", v-if="showIcon")
		.bunt-button-text
			slot
				span(v-text="text")
		//- quake-icon.quake-button-dropdown-icon(icon="&#xe5c5;", v-if="!iconRight && showDropdownIcon && (hasDropdownMenu || hasPopover)")
	//- quake-progress-circular.quake-button-spinner(:color="spinnerColor", :size="18", :stroke="4.5", disable-transition, v-show="loading")
	ripple-ink(v-if!="!noInk && !disabled")

	//- quake-popover(:trigger="$els.button", :open-on="openDropdownOn", :dropdown-position="dropdownPosition"
	//- 	v-if="hasPopover")
	//- 	slot(name="popover")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
export default {
	name: `${consts.prefix}-button`,
	props: {
		style: {
			type: String,
			default: 'normal' // 'normal' or 'clear'
		},
		color: {
			type: String,
			default: 'default' // one of $clr-names
		},
		raised: {
			type: Boolean,
			default: false
		},
		text: String,
		icon: String,
		iconRight: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		showDropdownIcon: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'button'
		}
	},

	computed: {
		styleClasses() {
			let classes = [`${consts.prefix}-button-${this.style}`, `color-${this.color}`]

			if (this.raised) {
				classes.push(`${consts.prefix}-button-raised`)
			}

			if (this.hasDropdownMenu || this.hasPopover) {
				classes.push('has-dropdown')
			}

			return classes
		},

		spinnerColor() {
			if (this.color === 'color-default' || this.style === 'clear') {
				return 'black';
			}

			return 'white';
		}
	},

	// components: {
	// 	QuakeIcon,
	// 	QuakeMenu,
	// 	QuakePopover,
	// 	QuakeProgressCircular
	// },

	mixins: [
		// HasDropdown,
		RippleInk
	],

	// directives: {
	// 	disabled
	// }
}
</script>
