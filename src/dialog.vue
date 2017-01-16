<template lang="jade">
.bunt-dialog-container(v-if="open")
	.bunt-dialog
		slot
	.bunt-backdrop(@click="close", keyup.esc="close")
</template>
<script>
export default {
	props: {
		open: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
		}
	},
	computed: {},
	created () {},
	mounted () {
		this.$nextTick(() => {
		})
	},
	methods: {
		close () {
			this.$emit('close')
		}
	}
}
</script>
