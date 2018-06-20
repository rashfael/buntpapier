<template lang="jade">
	i.bunt-icon.mdi(:class="[iconClass]")
</template>
<script>
import consts from './_constants'
import iconHelper from 'helpers/icon'

export default {
	name: `${consts.prefix}-icon`,
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
