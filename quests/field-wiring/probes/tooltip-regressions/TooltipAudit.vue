<script setup lang="ts">
import { ref } from 'vue'
import Button from '../../src/components/button'
const clicks = ref(0)
const behindClicks = ref(0)
const submits = ref(0)
const linkClicks = ref(0)
const text = ref('Tooltip explanation')
const forced = ref(false)
const present = ref(true)
const error = ref<string>()
const placement = ref('bottom')
const fixed = ref(false)
Object.assign(window, { audit: { text, forced, present, error, placement, fixed } })
</script>
<template lang="pug">
main.c-tooltip-audit
	form(@submit.prevent="submits++")
		Button#trigger(v-if="present", :tooltip="text", :errorMessage="error", type="submit", @click="clicks++") Trigger
	button#behind(type="button", @click="behindClicks++") Behind
	button#outside(type="button") Outside
	div#plain(v-if="present", tabindex="0", v-tooltip="{text, show: forced, placement, fixed}") Plain
	a#link(href="#destination", v-tooltip="text", @click="linkClicks++") Link
	button#native(type="button", v-tooltip="text", @click="clicks++") Native
	output#counts {{ JSON.stringify({clicks, behindClicks, submits, linkClicks}) }}
</template>
<style lang="sass">
.c-tooltip-audit
	padding: 180px
	#link, #native
		position: absolute
		left: 500px
		top: 500px
		--tooltip-placement: bottom
	#native
		top: 600px
	#trigger, #plain
		--tooltip-placement: bottom
	#plain
		position: relative
		margin-top: 100px
		width: 160px
	#behind
		position: fixed
		left: 0
		top: 0
		width: 1px
		height: 1px
	#outside
		position: fixed
		left: 20px
		top: 20px
</style>
