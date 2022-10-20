<script setup>
// TODO
// - label animation WITH icon should go sideways, hint with icon should be on same height as input
// - apply name and other attrs to input el
import { ref, reactive, computed, onMounted } from 'vue'
import { getIconClass } from '../utils/icon.js'
import { useInputOutline } from '../utils/input-outline'
const {
	type,
	name,
	label,
	placeholder,
	modelValue,
	disabled,
	readonly,
	icon,
	iconRight,
	hint,
	hintIsHtml,
	validation
} = defineProps({
	type: {
		type: String,
		default: 'text'
	},
	label: String,
	placeholder: String,
	modelValue: {
		type: [String, Number],
		default: ''
	},
	disabled: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	},
	icon: String,
	iconRight: {
		type: Boolean,
		default: false
	},
	hint: String,
	validation: Object // vuelidate result
})
const emit = defineEmits(['update:modelValue'])

let focused = $ref(false)

const iconClass = computed(() => {
	return getIconClass(icon)
})

const invalid = computed(() => {
	return validation && validation.$error
})

const hintText = computed(() => {
	if (invalid.value && validation.$error) {
		const errorMessages = validation.$errors.map(error => error.$message)
		return errorMessages.filter(Boolean).join()
	}
	return hint
})

const floatingLabel = computed(() => {
	return Boolean(placeholder || modelValue || modelValue === 0)
})

function onInput ($event) {
	emit('update:modelValue', $event.target.value)
	if (validation) validation.$touch()
}

function onBlur () {
	focused = false
	if (validation) validation.$touch()
}

const { Outline, updateOutline } = useInputOutline($$(label))

</script>
<template lang="pug">
.bunt-input(:class!="{focused, 'floating-label': floatingLabel, invalid, disabled: disabled, 'with-icon': icon}", v-resize-observer="updateOutline")
	.label-input-container
		.icon.mdi(v-if="icon", :class="[iconClass]")
		label
			span {{ label }}
			input(:type="type", :value="modelValue", :disabled="disabled", :readonly="readonly", @input="onInput($event)", @focus="focused = true", @blur="onBlur", :placeholder="placeholder")
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		Outline
	.hint(v-if="hintIsHtml", v-html="hintText")
	.hint(v-else) {{ hintText }}
</template>
<style lang="stylus">
</style>
