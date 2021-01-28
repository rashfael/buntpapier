<template lang="pug">
.bunt-checkbox(:class="{checked: modelValue}")
	input(type="checkbox", :name="name", :checked="modelValue", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
	.bunt-checkbox-box
	label(v-if="label") {{ label }}
	label(v-else)
		slot
</template>
<script>

export default {
	name: `bunt-checkbox`,
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
