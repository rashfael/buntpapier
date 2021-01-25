<template lang="pug">
.bunt-progress-circular.active(:class="[size, {'progress-center': center, 'progress-page': page}]")
	svg(viewBox="25 25 50 50")
		circle(cx="50", cy="50", r="20")
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
			default: 'normal'
		}
	},
	data () {
		return {
		}
	},
	created () {
	},
	beforeUnmount () {

	},
	methods: {
	}
}
</script>
