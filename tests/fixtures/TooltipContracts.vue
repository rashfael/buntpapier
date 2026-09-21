<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useTooltip } from '../../src'

const anchor = useTemplateRef<HTMLElement>('anchor')
const control = useTemplateRef<HTMLInputElement>('control')
const composed = ref({ text: 'Composed explanation', show: false })
const hasControl = $ref(true)
const hasAnchor = $ref(true)
const stopTooltip = useTooltip(anchor, composed, control)

const buttonClicks = $ref(0)
const submits = $ref(0)
const linkClicks = $ref(0)
const behindClicks = $ref(0)
const errorMessage = $ref<string | null>(null)
const ordinaryText = $ref('Ordinary explanation')
const present = $ref(true)
const renders = $ref(0)
</script>
<template lang="pug">
main.c-tooltip-contracts
	h1 Tooltip contracts
	button#before(type="button") Before
	form(@submit.prevent="submits++")
		bunt-button#submit-trigger(v-if="present", type="submit", :tooltip="ordinaryText", @click="buttonClicks++") Submit action
	button#native-trigger(v-if="present", v-tooltip="ordinaryText", type="button", aria-describedby="existing-description", @click="buttonClicks++") Native action
	a#link-trigger(v-if="present", v-tooltip="ordinaryText", href="#destination", @click="linkClicks++") Destination
	bunt-button#error-trigger(:tooltip="ordinaryText", :error-message="errorMessage") Error action
	button#behind(type="button", @click="behindClicks++") Behind tooltip
	button#rerender(type="button", @click="renders++") Rerender {{ renders }}
	button#change-text(type="button", @click="ordinaryText = 'Changed explanation'") Change explanation
	button#set-error(type="button", @click="errorMessage = 'Failed action'") Set error
	button#change-error(type="button", @click="errorMessage = 'Changed failure'") Change error
	button#clear-error(type="button", @click="errorMessage = null") Clear error
	button#remove(type="button", @click="present = false") Remove triggers

	section#composed-anchor(v-if="hasAnchor", ref="anchor")
		input#composed-control(v-if="hasControl", ref="control", aria-label="Composed control", aria-describedby="existing-description")
	span#existing-description Existing description
	button#composed-change(type="button", @click="composed.text = 'Updated explanation'; composed.show = true") Update composed tooltip
	button#composed-toggle-control(type="button", @click="hasControl = !hasControl") Toggle composed control
	button#composed-toggle-anchor(type="button", @click="hasAnchor = !hasAnchor") Toggle composed anchor
	button#composed-stop(type="button", @click="stopTooltip()") Stop composed tooltip
	output#counts {{ JSON.stringify({ buttonClicks, submits, linkClicks, behindClicks }) }}
</template>
<style lang="sass">
.c-tooltip-contracts
	padding: 160px
	#submit-trigger, #native-trigger, #link-trigger, #error-trigger
		display: block
		width: max-content
		margin: 32px 0
		--tooltip-placement: bottom
	#behind
		position: fixed
		left: 0
		top: 0
		z-index: 1
</style>
