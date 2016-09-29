<template lang="jade">
	i.bunt-icon.material-icons {{{ icon }}}
</template>
<script>
export default {
	props: {
		icon: {
			type: String,
			required: true
		}
	}
}
</script>
