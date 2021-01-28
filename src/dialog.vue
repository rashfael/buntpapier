<template lang="pug">
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
	emits: ['close'],
	mounted () {
		this.$nextTick(() => {
			document.body.appendChild(this.$el)
		})
	},
	beforeUnmount () {
		if (this.$el.parentNode === document.body) {
			document.body.removeChild(this.$el)
		}
	},
	methods: {
		close () {
			this.$emit('close')
		}
	}
}
</script>
