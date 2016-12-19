<template lang="jade">
transition(name="bunt-tooltip")
	.bunt-tooltip(v-show="show", tabindex="-1", ref="tooltip", :class="['tooltip-position-'+position]")
		slot
</template>
<script>
import consts from './_constants'

export default {
	name: `${consts.prefix}-tooltip`,
	props: {
		show: Boolean
	},
	data () {
		return {
			position: 'bottom' // 'top', 'bottom'
		}
	},
	watch: {
		show (val) {
			if(val) this.computePosition()
		}
	},
	methods: {
		computePosition () {
			let rect = this.$parent.$el.getBoundingClientRect()
			let offsetBottom = window.innerHeight - rect.bottom
			this.position = offsetBottom >= 32 ? 'bottom' : 'top'
		}
	}
}
</script>
