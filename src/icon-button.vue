<template lang="jade">
button.bunt-icon-button(:class="styleClasses", :type="type", :disabled="disabled", ref="button")
	i.bunt-icon.material-icons
		slot			
	ripple-ink(v-if!="!noInk && !disabled")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
export default {
	name: `${consts.prefix}-icon-button`,
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
