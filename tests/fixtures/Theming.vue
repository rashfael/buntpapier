<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'

// One small consumer per themed surface case: a button for ink/weight
// derivation, a checkbox for per-subtree theming, a select for the teleported
// dropdown and a date picker for the popover surface.
const checked = $ref(true)
const selected = $ref(null)
const date = Temporal.PlainDate.from('2026-09-16')
const picked = $ref(date)
const options = ['Alpha', 'Beta', 'Gamma']
</script>
<template lang="pug">
main.c-theming-fixture
	section
		h2 Button
		bunt-button Themed action
	section
		h2 Checkbox
		bunt-checkbox(v-model="checked", label="Themed checkbox")
		output(data-testid="checkbox-value") {{ checked ? 'checked' : 'unchecked' }}
	section
		h2 Select
		bunt-select(v-model="selected", label="Themed select", :options="options")
		output(data-testid="select-value") {{ selected ?? 'empty' }}
	section
		h2 Date picker
		bunt-date-picker(v-model="picked", label="Themed date", locale="en-US", weekStartsOn="monday")
		output(data-testid="date-value") {{ picked?.toString() ?? 'empty' }}
	//- the select dropdown teleports here
	#bunt-teleport-target
</template>
