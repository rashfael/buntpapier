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
<style lang="stylus">
.{$prefix}-icon
	font-size 24px
	width @font-size
	height @font-size
	line-height @font-size
	display inline-block
	cursor inherit
</style>
