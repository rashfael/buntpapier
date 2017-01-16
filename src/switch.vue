<template lang="jade">
.bunt-switch(:class="{checked: value}")
	input(type="checkbox", :name="name", :checked="value", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
	.bunt-switch-track
		.bunt-switch-thumb
	label {{ label }}
</template>
<script>
import consts from './_constants'

export default {
	name: `${consts.prefix}-switch`,
	props: {
		value: {
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
	components: {},
	data () {
		return {
			focused: false
		}
	},
	computed: {},
	created () {},
	mounted () {
		this.$nextTick(() => {
		})
	},
	methods: {
		onChange ($event) {
			this.$emit('input', $event.target.checked)
			if(this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if(this.validation) this.validation.$touch()
		}
	}
}
</script>
