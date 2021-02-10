<template lang="pug">
.bunt-radio(:class="{checked: isChecked}")
	input(type="radio", :name="name", :value="modelValue", :checked="isChecked", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
	.bunt-radio-circle
	label(v-if="label") {{ label }}
	label(v-else)
		slot
</template>
<script>
export default {
	name: `bunt-radio`,
	props: {
		modelValue: [Boolean, String],
		value: String,
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
	emits: ['update:modelValue'],
	data () {
		return {
			focused: false
		}
	},
	computed: {
		isChecked () {
			return this.value === this.modelValue
		}
	},
	methods: {
		onChange ($event) {
			this.$emit('update:modelValue', this.value)
			if (this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if (this.validation) this.validation.$touch()
		}
	}
}
</script>
