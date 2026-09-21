<script setup lang="ts">
import Input from '../../src/components/input.vue'
import Select from '../../src/components/select.vue'
</script>
<template lang="pug">
main
	h1 Server rendered fields
	Input(label="First", hint="First hint", modelValue="One")
	Input(label="Second", modelValue="Two")
	Select(label="Third", hint="Third hint", :options="['One', 'Two']", modelValue="One")
	Select(label="Fourth", :options="['One', 'Two']", modelValue="Two")
	#bunt-teleport-target
</template>
