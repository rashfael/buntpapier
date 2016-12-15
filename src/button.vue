<template lang="jade">
button.bunt-button(:type="type", :disabled="disabled || loading", ref="button")
	.bunt-button-content(:class="{ 'invisible': loading }")
		i.bunt-icon.material-icons(v-if="icon", v-html="icon")
		.bunt-button-text
			slot
				span(v-text="text")
	progress-circular(v-show="loading", size="small")
	ripple-ink(v-if!="!noInk && !disabled")

	//- quake-popover(:trigger="$els.button", :open-on="openDropdownOn", :dropdown-position="dropdownPosition"
	//- 	v-if="hasPopover")
	//- 	slot(name="popover")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
import ProgressCircular from './progress-circular'
export default {
	name: `${consts.prefix}-button`,
	components: { ProgressCircular },
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

	mixins: [
		// HasDropdown,
		RippleInk
	],

	// directives: {
	// 	disabled
	// }
}
</script>
