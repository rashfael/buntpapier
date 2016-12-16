<template lang="jade">
transition(name="bunt-tooltip")
	.bunt-tooltip(v-show="show", tabindex="-1", ref="tooltip")
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
		}
	},
	mounted() {
	}
}
</script>
