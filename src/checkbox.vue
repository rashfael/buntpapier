<template lang="pug">
.bunt-checkbox(:class="{checked: value}")
	input(type="checkbox", :name="name", :checked="value", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
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
			if (this.validation) this.validation.$touch()
		},
		onBlur () {
			this.focused = false
			if (this.validation) this.validation.$touch()
		}
	}
}
</script>
