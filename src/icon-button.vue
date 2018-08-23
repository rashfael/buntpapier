<template lang="jade">
button.bunt-icon-button(:class="styleClasses", :type="type", :disabled="disabled", ref="button", @click="$emit('click', $event)", v-tooltip="{text: tooltip, placement: tooltipPlacement, fixed: tooltipFixed}")
	i.bunt-icon.mdi(:class="[iconClass()]")
	ripple-ink(v-if!="!noInk && !disabled")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
import iconHelper from './helpers/icon'

export default {
	name: `${consts.prefix}-icon-button`,
	mixins: [
		RippleInk
	],
	props: {
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
		},
		tooltip: String,
		tooltipPlacement: {
			type: String,
			default: 'bottom'
		},
		tooltipFixed: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			showTooltip: false
		}
	},
	computed: {
		styleClasses () {
			let classes = [`color-${this.color}`]
			return classes
		}
	},
	methods: {
		iconClass () {
			return iconHelper.getClass(this.$slots.default[0].text)
		}
	},
}
</script>
