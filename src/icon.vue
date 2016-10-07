<template lang="jade">
	i.bunt-icon.material-icons(v-html="icon")
</template>
<script>
import consts from './_constants'

export default {
	name: `${consts.prefix}-icon`,
	props: {
		icon: {
			type: String,
			required: true
		}
	}
}
</script>
