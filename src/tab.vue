<template lang="pug">
</template>
<script>
// this actually does nothing and will never actually get instantiated
export default {
	name: `bunt-tab`,
	props: {
		header: [String, Object],
		icon: String,
		disabled: {
			type: Boolean,
			default: false
		},
		id: String
	},
	emits: ['selected', 'deselected']
}
</script>
