<template lang="jade">
.bunt-input.dense(:class!="{focused: focused, 'floating-label': value !== null && value.length != 0, invalid: invalid}")
	.label-input-container
		label(:for="name") {{label}}
		input(:type="type", :name="name", :value="value", :disabled="disabled", :readonly="readonly", @input="onInput($event)", @focus="focused = true", @blur="onBlur")
	.underline
	.hint {{ hintText }}
</template>
<script>
import consts from './_constants'

export default {
	name: `${consts.prefix}-input`,
	props: {
		type: {
			type: String,
			default: 'text'
		},
		id: String,
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
		validation: Object // vuelidate result
	},
	data: function () {
		return {
			focused: false
		}
	},
	computed: {
		invalid () {
			return this.validation && this.validation.$error
		},
		hintText () {
			return this.invalid ? this.validation.$messages.join() : this.hint
		}
	},
	ready: function () {},
	attached: function () {},
	methods: {
		onInput ($event) {
			this.$emit('input', $event.target.value)
			if(this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if(this.validation) this.validation.$touch()
		}
	}
}
</script>
