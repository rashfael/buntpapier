<script setup lang="ts">
import Checkbox from '../../src/components/checkbox.vue'
</script>
<template lang="pug">
main
	h1 Server rendered checkboxes
	Checkbox(label="First", :modelValue="true", aria-describedby="note")
	Checkbox
		template(#label) Second
	Checkbox(disabled) Third
	p#note Checkbox note
</template>
