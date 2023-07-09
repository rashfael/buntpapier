<script setup lang="ts">
// TODO
// - take array as value
// - custom true/false values
// - validation
// - indeterminate
// - disabled + readonly styling
import { useComputedStyle } from '../computedStyle'

const {
	modelValue,
	name,
	label,
	disabled,
	readonly
} = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	name: String,
	label: String,
	disabled: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:modelValue'])

let focused = $ref(false)

const onChange = ($event) => {
	emit('update:modelValue', $event.target.checked)
	// if (this.validation) this.validation.$touch()
}

const onBlur = () => {
	focused = false
}

// const { classes, style}
</script>
<template lang="pug">
.bunt-checkbox(:class="{checked: modelValue}")
	input(type="checkbox", :name="name", :checked="modelValue", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
	.bunt-checkbox-box
	label(v-if="label") {{ label }}
	label(v-else)
		slot
</template>
<style lang="stylus">
</style>
