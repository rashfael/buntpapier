<template lang="pug">
#buntpapier-demo
	h1 Buntpapier v3 Playground
	p Buntpapier v3 will allow you to control styles with css custom properties.
		br
		| These aren't simple css custom properties that just get used in the internal stylesheet though! With the magic of not being able to wait for the CSSWG to come up with a standard — and a bit of js, custom properties in buntpapier v3 will control every visual aspect of the components.
		br
		| Give it a try!
		| For example, change --button-color to see the text color change to preserve a good contrast and automatically compute hover and ripple effect colors.
		br
		| Changing --button-size will actually affect multiple other css properties at once.
	p (You can also open your browser devtools and try changing custom property values of the button directly if you don't believe me.)
	.playground
		.custom-props
			.prop
				label --button-color:
				input(type="color", v-model="buttonColor")
			.prop
				label --button-size:
				select(v-model="buttonSize")
					option(value="normal") normal
					option(value="large") large
					option(value="huge") huge
			.prop
				label --tooltip-placement:
				select(v-model="tooltipPlacement")
					option(value="top") top
					option(value="right") right
					option(value="bottom") bottom
					option(value="left") left
		.render(:style="style")
			bunt-button(tooltip="I'm a tooltip!") customize me!
</template>
<script>

export default {
	components: {},
	data () {
		return {
			buttonColor: '#5f1f93',
			buttonSize: 'normal',
			tooltipPlacement: 'bottom'
		}
	},
	computed: {
		style () {
			return {
				'--button-color': this.buttonColor,
				'--button-size': this.buttonSize,
				'--tooltip-placement': this.tooltipPlacement
			}
		}
	}
}
</script>
<style lang="stylus">
body
	font-family: Roboto
	#buntpapier-demo
		display: flex
		flex-direction: column
		align-items: center
	p
		max-width: 420px
	.playground
		display: flex
		border-radius: 4px
		border: 1px solid #aaa
		margin: 16px 4px
	.custom-props
		width: 240px
		display: flex
		flex-direction: column
		gap: 8px
		padding: 8px
		background-color: #ddd
		&::before
			align-self: flex-start
			content: 'css'
			display: block
			padding: 0 8px
			height: 24px
			background-color: #eee
			border-radius: 4px 0 4px 0
			border-bottom: 1px solid #aaa
			border-right: 1px solid #aaa
			margin: -8px
		.prop
			font-family: monospace
			display: flex
			// justify-content: space-between
			align-items: center
			label
				margin-right: 8px
			input
				appearance: none
				border: none
				background-color: transparent
	.render
		flex: auto
		display: flex
		justify-content: center
		align-items: center
		min-width: 400px
		min-height: 240px
</style>
