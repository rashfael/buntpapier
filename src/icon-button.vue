<template lang="jade">
button.bunt-icon-button(:class="styleClasses", :type="type", :disabled="disabled", ref="button", @mouseenter="showTooltip = true", @mouseleave="showTooltip = false")
	i.bunt-icon.material-icons
		slot			
	ripple-ink(v-if!="!noInk && !disabled")
	tooltip(v-if="tooltip", :show="showTooltip") {{ tooltip }}
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
import Tooltip from './tooltip'

export default {
	name: `${consts.prefix}-icon-button`,
	components: { Tooltip },
	props: {
		tooltip: String,
		color: {
			type: String,
			default: 'default' // one of $clr-names
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
		styleClasses() {
			let classes = [`color-${this.color}`]
			return classes
		}
	},
	mixins: [
		RippleInk
	]
}
</script>
