<template lang="jade">
.bunt-input.dense(:class="{focused: focused, 'floating-label': value.length != 0}")
	.label-input-container
		label(:for="name") {{label}}
		input(:type="type", :name="name", :value="value", :disabled="disabled", :readonly="readonly", @input="$emit('input', $event.target.value)", @focus="focused = true", @blur="focused = false")
	.underline
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
	},
	data: function () {
		return {
			focused: false
		}
	},
	computed: {},
	ready: function () {},
	attached: function () {},
	methods: {
	}
}
</script>
