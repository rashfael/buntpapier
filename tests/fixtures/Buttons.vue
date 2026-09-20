<script setup lang="ts">
// Native-button consumer for the keyboard, semantics and accessibility cases.
// Plain <button>s before and after the group give Tab somewhere to come from
// and go to; the outputs make activation observable without reading internals.
const activations = $ref(0)
let asyncCompletions = $ref(0)

async function runAsync () {
	await new Promise(resolve => setTimeout(resolve, 50))
	asyncCompletions++
}
</script>
<template lang="pug">
main.c-button-fixture
	h1 Button consumer
	button.c-plain(type="button") Before buttons
	.c-actions(role="group", aria-label="Actions")
		bunt-button(@click="activations++") Enabled action
		bunt-button(disabled, @click="activations++") Disabled action
		bunt-button(loading="auto", @click="runAsync") Async action
	button.c-plain(type="button") After buttons
	p
		| activations:
		output(data-testid="activations") {{ activations }}
	p
		| async completions:
		output(data-testid="async-completions") {{ asyncCompletions }}
</template>
<style lang="sass">
.c-button-fixture
	display: flex
	flex-direction: column
	align-items: flex-start
	gap: 16px
	.c-actions
		display: flex
		gap: 16px
</style>
