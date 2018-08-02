<!--
	TODO label animation WITH icon should go sideways, hint with icon should be on same height as input
-->
<template lang="jade">
.bunt-input(:class!="{focused, 'floating-label': value !== null && value.length != 0, invalid, disabled, 'with-icon': icon}", :style="{'--label-gap': floatingLabelWidth}")
	.label-input-container
		label(:for="name") {{label}}
		.icon.mdi(v-if="icon", :class="[iconClass]")
		input(:type="type", :name="name", :value="value", :disabled="disabled", :readonly="readonly", @input="onInput($event)", @focus="focused = true", @blur="onBlur", :placeholder="placeholder")
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		svg.outline(ref="outline")
			path(:d="outlineStroke")
	.hint(v-if="hintIsHtml", v-html="hintText")
	.hint(v-else) {{ hintText }}
</template>
<script>
import consts from './_constants'
import iconHelper from './helpers/icon'
import inputOutline from './mixins/input-outline'

export default {
	name: `${consts.prefix}-input`,
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
		value: {
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
			if (this.invalid && this.validation.$params) {
				const errorMessages = Object.keys(this.validation.$params).map((key) => this.validation[key] ? null : this.validation.$params[key].message)
				return errorMessages.filter(Boolean).join()
			}
			return this.hint
		}
	},
	methods: {
		onInput ($event) {
			this.$emit('input', $event.target.value)
			if (this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if (this.validation) this.validation.$touch()
		}
	}
}
</script>
