<template lang="jade">
router-link.bunt-link-button(:to="to")
	slot
	ripple-ink
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
export default {
	name: `${consts.prefix}-link-button`,
	components: {},
	props: {
		to: Object
	},
	data () {
		return {
		}
	},
	computed: {
	},
	watch: {
	},
	mixins: [
		RippleInk
	],
	methods: {
	}
}
</script>
