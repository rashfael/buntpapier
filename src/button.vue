<template lang="jade">
button.bunt-button(:type="type", :disabled="disabled || loading", ref="button")
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
