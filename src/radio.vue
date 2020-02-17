<template lang="pug">
.bunt-radio(:class="{checked: isChecked}")
	input(type="radio", :name="name", :value="value", :checked="isChecked", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
	.bunt-radio-circle
	label(v-if="label") {{ label }}
	label(v-else)
		slot
</template>
<script>

export default {
	name: `bunt-radio`,
	model: {
		prop: 'checked',
		event: 'change'
	},
	props: {
		checked: null,
		value: null,
		name: {
			type: String,
			required: true
		},
		label: String,
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
	},
	data () {
		return {
			focused: false
		}
	},
	computed: {
		isChecked () {
			return this.checked === this.value
		}
	},
	methods: {
		onChange ($event) {
			this.$emit('change', this.value)
			if (this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if (this.validation) this.validation.$touch()
		}
	}
}
</script>
