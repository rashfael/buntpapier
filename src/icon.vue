<template lang="pug">
i.bunt-icon.mdi(:class="[iconClass]")
</template>
<script>
import iconHelper from './helpers/icon'

export default {
	name: `bunt-icon`,
	props: {
		icon: {
			type: String,
			required: true
		}
	},
	computed: {
		iconClass () {
			return iconHelper.getClass(this.icon)
		}
	}
}
</script>
