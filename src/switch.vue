<template lang="pug">
.bunt-switch(:class="{checked: modelValue}")
	input(type="checkbox", :name="name", :checked="modelValue", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
	.bunt-switch-track
		.bunt-switch-thumb
	label {{ label }}
</template>
<script>
export default {
	name: `bunt-switch`,
	components: {},
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
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
	methods: {
		onChange ($event) {
			this.$emit('update:modelValue', $event.target.checked)
			if (this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if (this.validation) this.validation.$touch()
		}
	}
}
</script>
