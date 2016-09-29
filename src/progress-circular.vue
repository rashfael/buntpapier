<!--  http://materializecss.com/preloader.html -->

<template lang="jade">
.bunt-progress-circular.active(:class="[size, {center: center, page: page}]")
	.spinner-layer
		.circle-clipper.left
			.circle
		.gap-patch
			.circle
		.circle-clipper.right
			.circle
</template>
<script>

export default {
	props: {
		center: {
			type: Boolean,
			default: false
		},
		page: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: "normal"
		}
	},
	data() {
		return {
		}
	},
	ready() {

	},
	beforeDestroy() {

	},
	methods: {
	}
}
</script>
