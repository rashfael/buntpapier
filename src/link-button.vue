<template lang="pug">
router-link.bunt-link-button(:to="to")
	slot
	ripple-ink
</template>
<script>
import RippleInk from './mixins/ripple-ink'

export default {
	name: `bunt-link-button`,
	components: {},
	mixins: [
		RippleInk
	],
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
	methods: {
	}
}
</script>
