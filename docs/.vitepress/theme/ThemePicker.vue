<script>
// module scope — survives remounts, keeps persistence/migration one-shot
import { ref, watchEffect } from 'vue'
import { deriveDarkVariant } from '../../../src/utils/colors'

const lightRef = ref('#9c27b0')
const darkRef = ref('') // '' = auto (derived from the light pick)

if (!import.meta.env.SSR) {
	try {
		const stored = JSON.parse(localStorage.primaryColor)
		if (stored.light) lightRef.value = stored.light
		darkRef.value = stored.dark || ''
	} catch (e) {
		// migrate the legacy plain-string format (hex picks only)
		if (localStorage.primaryColor?.startsWith('#')) lightRef.value = localStorage.primaryColor
	}

	watchEffect(() => {
		const applied = darkRef.value || deriveDarkVariant(lightRef.value)
		localStorage.primaryColor = JSON.stringify({ light: lightRef.value, dark: darkRef.value })
		document.documentElement.style.setProperty('--clr-primary', `light-dark(${lightRef.value}, ${applied})`)
	})
}
</script>
<script setup>
const PRESETS = ['#098643', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722']

let light = $(lightRef)
let dark = $(darkRef)

const appliedDark = $computed(() => dark || deriveDarkVariant(light))
const declaration = $computed(() => `--clr-primary: light-dark(${light}, ${appliedDark})`)

function copyDeclaration () {
	navigator.clipboard.writeText(declaration)
}
</script>
<template lang="pug">
.c-bunt-theme-picker
	button.trigger(popovertarget="bunt-theme-picker-popover", title="customize --clr-primary")
		.duotone(:style="{'--light-color': light, '--dark-color': appliedDark}")
	//- popover (auto) provides esc + click-outside light dismiss natively
	#bunt-theme-picker-popover.picker-popover(popover="")
		.row
			label.swatch-input(:style="{'--swatch-color': light}")
				input(type="color", v-model="light", list="presetColors")
			span light
			datalist#presetColors
				option(v-for="preset of PRESETS", :key="preset") {{ preset }}
		.row
			label.swatch-input(:class="{auto: !dark}", :style="{'--swatch-color': appliedDark}")
				input(type="color", :value="appliedDark", @input="dark = $event.target.value")
			span dark
			button.reset(v-if="dark", @click="dark = ''", title="re-derive from the light color") auto
			span.auto-hint(v-else) (auto)
		.declaration
			code {{ declaration }}
			button.copy(@click="copyDeclaration") copy
</template>
<style lang="stylus">
.c-bunt-theme-picker
	position: relative
	margin-left: 12px
	anchor-scope: unquote('--theme-picker')

	.trigger
		anchor-name: unquote('--theme-picker')
		display: flex
		align-items: center
		cursor: pointer
		background: none
		border: none
		padding: 0

		// accent pair fills the center, thick white/black scheme ring around
		// it — both cut along the same diagonal (bottom-left → top-right);
		// outline instead of border so the hairline doesn't bleed into the
		// gradient edge
		.duotone
			position: relative
			width: 32px
			height: 32px
			border-radius: 50%
			outline: 1px solid var(--vp-c-divider)
			background: linear-gradient(135deg, #fff 50%, #121212 50%)
			&::after
				content: ''
				position: absolute
				inset: 5px
				border-radius: 50%
				background: linear-gradient(135deg, var(--light-color) 50%, var(--dark-color) 50%)

	.picker-popover
		// anchored below the trigger, right edges aligned
		position: fixed
		position-anchor: unquote('--theme-picker')
		inset: auto
		top: anchor(bottom)
		right: anchor(right)
		margin: 8px 0 0
		flex-direction: column
		gap: 8px
		padding: 12px
		background: var(--vp-c-bg-elv)
		border: 1px solid var(--vp-c-divider)
		border-radius: 8px
		box-shadow: var(--vp-shadow-3)
		font-size: 13px
		color: var(--vp-c-text-1)
		// only set display when open — a bare `display: flex` would override
		// the UA's `[popover] { display: none }`
		&:popover-open
			display: flex
		.row
			display: flex
			align-items: center
			gap: 8px
		label.swatch-input
			position: relative
			display: block
			flex: none
			width: 24px
			height: 24px
			border-radius: 50%
			background-color: var(--swatch-color)
			border: 1px solid var(--vp-c-divider)
			cursor: pointer
			&.auto
				border: 1px dashed var(--vp-c-text-2)
			input
				// invisibly cover the swatch so the native color dialog
				// anchors here instead of the viewport corner
				position: absolute
				inset: 0
				width: 100%
				height: 100%
				opacity: 0
				cursor: pointer
		.auto-hint
			color: var(--vp-c-text-2)
		button.reset, button.copy
			cursor: pointer
			border: 1px solid var(--vp-c-divider)
			background: var(--vp-c-bg)
			color: var(--vp-c-text-2)
			border-radius: 4px
			padding: 0 6px
			font-size: 11px
		.declaration
			display: flex
			gap: 8px
			align-items: center
			code
				font-size: 11px
				white-space: nowrap
</style>
