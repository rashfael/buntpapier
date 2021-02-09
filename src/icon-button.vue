<template lang="pug">
button.bunt-icon-button(:class="{disabled}", :type="type", :aria-disabled="disabled", ref="button", @click="onClick", v-tooltip="tooltipOptions || {text: tooltip, placement: tooltipPlacement, fixed: tooltipFixed}")
	i.bunt-icon.mdi(v-if="iconClass()", :class="[iconClass()]")
	slot(v-else)
	ripple-ink(v-if="!disabled")
</template>
<script>
import { Text } from 'vue'
import RippleInk from './mixins/ripple-ink'
import iconHelper from './helpers/icon'

export default {
	name: `bunt-icon-button`,
	mixins: [
		RippleInk
	],
	props: {
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
	emits: ['click'],
	data () {
		return {
			showTooltip: false
		}
	},
	methods: {
		iconClass () {
			const slotNode = this.$slots.default()[0]
			// HACK can't find the symbol exported in vue
			if (slotNode?.type === Text) return iconHelper.getClass(slotNode.children)
			return
		},
		onClick (event) {
			if (this.disabled) return
			this.$emit('click', event)
		}
	},
}
</script>
