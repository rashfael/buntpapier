<!--
	TODO label animation WITH icon should go sideways, hint with icon should be on same height as input
-->
<template lang="pug">
.bunt-input(:class!="{focused, 'floating-label': floatingLabel, invalid, disabled, 'with-icon': icon}", :style="{'--label-gap': floatingLabelWidth}", v-resize-observer="generateOutline")
	.label-input-container
		label(:for="name") {{label}}
		.icon.mdi(v-if="icon", :class="[iconClass]")
		input(ref="input", :type="type", :name="name", :value="modelValue", :disabled="disabled", :readonly="readonly", @input="onInput($event)", @focus="focused = true", @blur="onBlur", :placeholder="placeholder")
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		svg.outline(ref="outline")
			path(:d="outlineStroke")
	.hint(v-if="hintIsHtml", v-html="hintText")
	.hint(v-else) {{ hintText }}
</template>
<script>
import iconHelper from './helpers/icon'
import inputOutline from './mixins/input-outline'

export default {
	name: `bunt-input`,
	mixins: [inputOutline],
	props: {
		type: {
			type: String,
			default: 'text'
		},
		name: {
			type: String,
			required: true
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
		hintIsHtml: {
			type: Boolean,
			default: false
		},
		validation: Object // vuelidate result
	},
	emits: ['update:modelValue'],
	data: function () {
		return {
			focused: false
		}
	},
	computed: {
		iconClass () {
			return iconHelper.getClass(this.icon)
		},
		invalid () {
			return this.validation && this.validation.$error
		},
		hintText () {
			if (this.invalid && this.validation.$errors) {
				const errorMessages = this.validation.$errors.map(error => error.$message)
				return errorMessages.filter(Boolean).join()
			}
			return this.hint
		},
		floatingLabel () {
			return Boolean(this.placeholder || this.modelValue || this.modelValue === 0)
		}
	},
	methods: {
		onInput ($event) {
			this.$emit('update:modelValue', $event.target.value)
			if (this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if (this.validation) this.validation.$touch()
		}
	}
}
</script>
