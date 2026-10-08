<script setup lang="ts">
import Input from '../../src/components/input.vue'
import Select from '../../src/components/select.vue'
let label = $ref('Field label')
let value = $ref('a')
const options = [{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]
</script>
<template lang="pug">
main.c-field-outlines
	h1 Field outlines
	button#relabel(@click="label = label ? '' : 'Field label'") Toggle label
	button#rename(@click="label = 'A considerably longer field label'") Long label
	div(data-testid="normal")
		Input(:label="label")
	div(data-testid="compact", style="--input-size: compact")
		Input(:label="label")
	div(data-testid="select")
		Select(v-model="value", :options="options", :label="label")
	#bunt-teleport-target
</template>
<style lang="sass">
.c-field-outlines
	width: 320px
</style>
