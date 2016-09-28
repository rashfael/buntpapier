<template lang="jade">
.bunt-input.dense(:class="{focused: focused, 'floating-label': value.length != 0}")
	.label-input-container
		label(:for="name") {{label}}
		input(:type="type", :name="name", v-model="value", :disabled="disabled", :readonly="readonly", @focus="focused = true", @blur="focused = false")
	.underline
</template>
<style lang="stylus">

.{$prefix}-input
	display flex
	flex-direction column
	height 72px
	padding-top 16px

	.label-input-container
		position relative
	input
		border none
		outline none
		font-family $font-stack
		font-size 16px
		font-weight 400
		width 100%
		padding 0
	label
	/*line-height 24px*/
		position absolute
		top 0
		left 0
		right 0
		font-size 16px
		font-weight 400
		pointer-events none
		color $clr-secondary-text-light
		transition transform 0.25s, width 0.25s
		transform-origin left top
		/*line-height 24px*/
	.underline
		position relative
		padding-top 8px
		&:before, &:after
			content ''
			position absolute
			bottom 0
			left 0
			right 0
			background-color $clr-dividers-light
			height 1px
		&:after
			background-color $clr-primary
			height 2px
			transform-origin center center
			transform scale3d(0,1,1)
			transition transform .25s

	&.focused
		.underline:after
			transform none

		&.floating-label
			label
				color $clr-primary

	&.floating-label
		label
			transform translateY(-75%) scale(0.75)
			width 133%

	&.dense
		height 27px
		margin-bottom 33px
		padding-top 12px
		/*input
			font-size 13px*/
		label
			padding-bottom 4px

</style>
<script>
import consts from './_constants'

export default {
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
			default: '',
			twoWay: true
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
