<template lang="pug">
.bunt-tab(:id="id", role="tabpanel", tabindex="0")
	slot
</template>
<script>
export default {
	name: `bunt-tab`,
	props: {
		header: String,
		icon: String,
		disabled: {
			type: Boolean,
			default: false
		},
		id: String
	},
	watch: {
		// TODO reimplement?
		active (val) {
			if (val) {
				this.$emit('selected', this.id)
			} else {
				this.$emit('deselected', this.id)
			}
		}
	}
}
</script>
