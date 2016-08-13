<template lang="jade">
h1 COAT
form
	coat-input(name="an-input", label="MEIN INPuut")
</template>
<script>
import './styles/style.styl'
export default {
	el: '#app',
	components: {},
	replace: false
}
</script>
<style lang="stylus">
@import '~_ui'
#app
	margin 5rem auto
	padding 2rem
	width 45rem
	card()
form
	width 45rem
</style>
