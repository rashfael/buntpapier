<script setup>
import { watchEffect } from 'vue'
let primaryColor = $ref('')
if (!import.meta.env.SSR) {
	primaryColor = localStorage.primaryColor || 'var(--clr-purple)'

	watchEffect(() => {
		localStorage.primaryColor = primaryColor
		document.documentElement.style.setProperty('--clr-primary', primaryColor)
	})
}
</script>
<template lang="pug">
.c-bunt-theme-picker
	label
		input(type="color", v-model="primaryColor", list="presetColors")
		datalist#presetColors
			option #098643
			option #f44336
			option #e91e63
			option #9c27b0
			option #673ab7
			option #3f51b5
			option #2196f3
			option #03a9f4
			option #00bcd4
			option #009688
			option #4caf50
			option #8bc34a
			option #cddc39
			option #ffeb3b
			option #ffc107
			option #ff9800
			option #ff5722
</template>
<style lang="stylus">
.c-bunt-theme-picker
	label
		display: block
		height: 32px
		width: @height
		background-color: var(--clr-primary)
		border-radius: 50%
		margin-left: 16px
	input
		visibility: hidden
		width: 64px
		height: 36px
</style>
