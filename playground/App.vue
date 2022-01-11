<template lang="pug">
#buntpapier-demo(:style="style")
	h1 Buntpapier v3 Playground
	p Buntpapier v3 will allow you to control styles with css custom properties.
		br
		| These aren't simple css custom properties that just get used in the internal stylesheet though! With the magic of not being able to wait for the CSSWG to come up with a standard and a bit of js, custom properties in buntpapier v3 will control every visual aspect of the components.
		br
		| Give it a try!
		| For example, change --button-color to see the text color change to preserve a good contrast and automatically compute hover and ripple effect colors.
		br
		| Changing --button-size will actually affect multiple other css properties at once.
	p (You can also open your browser devtools and try changing custom property values of the button if you don't believe me.)
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
	bunt-button Klick Mich!
</template>
<script>

export default {
	components: {},
	data () {
		return {
			buttonColor: '#5f1f93',
			buttonSize: 'normal'
		}
	},
	computed: {
		style () {
			return {
				'--button-color': this.buttonColor,
				'--button-size': this.buttonSize
			}
		}
	}
}
</script>
<style lang="stylus">
body
	display: flex
	flex-direction: column
	align-items: center
	font-family: Roboto
	p
		max-width: 520px
	.custom-props
		width: 240px
		display: flex
		flex-direction: column
		gap: 8px
		margin: 16px
		padding: 8px
		background-color: #ddd
		border-radius: 4px
		border: 1px solid #aaa
		.prop
			font-family: monospace
			display: flex
			// justify-content: space-between
			align-items: center
			input
				appearance: none
				border: none
				background-color: transparent
</style>
