<template lang="jade">
button.bunt-button(:type="type", :disabled="disabled || loading", ref="button", @mouseenter="showTooltip = true", @mouseleave="showTooltip = false")
	.bunt-button-content(:class="{ 'invisible': loading }")
		i.bunt-icon.material-icons(v-if="icon", v-html="icon")
		.bunt-button-text
			slot
				span(v-text="text")
	progress-circular(v-show="loading", size="small")
	ripple-ink(v-if!="!noInk && !disabled")
	tooltip(v-if="tooltip", :show="showTooltip") {{ tooltip }}
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
import ProgressCircular from './progress-circular'
import Tooltip from './tooltip'
export default {
	name: `${consts.prefix}-button`,
	components: { ProgressCircular, Tooltip },
	props: {
		text: String,
		icon: String,
		tooltip: String,
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
	data () {
		return {
			showTooltip: false
		}
	},
	computed: {
	},

	mixins: [
		// HasDropdown,
		RippleInk
	],

	methods: {
	}
}
</script>
