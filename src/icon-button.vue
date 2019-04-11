<template lang="pug">
button.bunt-icon-button(:class="[`color-${this.color}`, {disabled}]", :type="type", :aria-disabled="disabled", ref="button", @click="onClick", v-tooltip="tooltipOptions || {text: tooltip, placement: tooltipPlacement, fixed: tooltipFixed}")
	i.bunt-icon.mdi(:class="[iconClass()]")
	ripple-ink(v-if!="!noInk && !disabled")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import iconHelper from './helpers/icon'

export default {
	name: `bunt-icon-button`,
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
		},
		tooltipOptions: Object
	},
	data () {
		return {
			showTooltip: false
		}
	},
	methods: {
		iconClass () {
			return iconHelper.getClass(this.$slots.default[0].text)
		},
		onClick (event) {
			if (this.disabled) return
			this.$emit('click', event)
		}
	},
}
</script>
