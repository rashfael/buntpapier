<template lang="jade">
#buntpapier
	#hero
		h1 buntpapier

	form
		bunt-input(name="an-input", label="ein lustiges Eingabefeld", v-model="text")
		bunt-input(name="an-input", label="Passwort!", type="password", v-model="password")
		bunt-select(name="a-select", label="Select something", :options="['Delicious Pizza', 'All The Kebab', 'Burrrrrrito!', 'Noodles, Peking Duck', 'McKingC', 'Linsa mit Spätzle und Saita', 'Ice, Ice, Baby', 'Egg and bacon', 'Egg, sausage and bacon', 'Egg and Spam', 'Egg, bacon and Spam', 'Egg, bacon, sausage and Spam', 'Spam, bacon, sausage and Spam', 'Spam, egg, Spam, Spam, bacon and Spam', 'Spam, Spam, Spam, egg and Spam', 'Spam, Spam, Spam, Spam, Spam, Spam, baked beans, Spam, Spam, Spam and Spam', 'Lobster Thermidor aux crevettes with a Mornay sauce, garnished with truffle pâté, brandy and a fried egg on top, and Spam.']")

		bunt-button(@click.native.prevent="") CLICK ME
		bunt-button(@click.native.prevent="", color="primary") BUTTON
		bunt-button(@click.native.prevent="", icon="add") add
		bunt-button(@click.native.prevent="", color="primary", icon="add") BUTTON
		bunt-button(@click.native.prevent="", style="clear") CLICK ME
		bunt-button(@click.native.prevent="", style="clear", color="primary", icon="add") ADD
		.progress-circular
			bunt-progress-circular(size="tiny")
			bunt-progress-circular(size="small")
			bunt-progress-circular(size="normal")
			bunt-progress-circular(size="big")
			bunt-progress-circular(size="huge")
		
</template>
<script>
import './styles/style.styl'
export default {
	el: '#app',
	components: {},
	replace: false,
	data () {
		return {
			text: '',
			password: ''
		}
	}
}
</script>
<style lang="stylus">
stripe(colors, angle, width)
	$grad = 'repeating-linear-gradient(' + angle 
	for $clr, $i in colors
		$grad += ',' + $clr + ' ' + $i*width + ',' + $clr + ' ' + ($i + 1)*width
	$grad += ')'
	return $grad

#buntpapier
	margin 0 auto 10rem
	width 720px
#hero
	card()
	position relative
	padding 0
	width 719px
	height 62px
	margin 0 0 1rem 0
	color $clr-white
	gradclrs = $clr-red $clr-pink $clr-purple $clr-deep-purple $clr-indigo $clr-blue $clr-light-blue $clr-cyan $clr-teal $clr-green $clr-light-green $clr-lime $clr-yellow $clr-amber $clr-orange $clr-deep-orange //$clr-brown $clr-grey $clr-blue-grey
	
	h1
		font-family 'Roboto Mono'
		position relative
		line-height 60px
		font-weight 200
		font-size 36px
		letter-spacing 2.25px
		margin 0 0 0 2px
		z-index 100
	&:before
		content ''
		display block
		position absolute
		left 0
		right 0
		top 0
		bottom 0
		background-image unquote(stripe(gradclrs, 90deg, 24px))
		background-size 100% 100%
		background-repeat no-repeat
		opacity 0.7
		
	&:after
		content ''
		display block
		position absolute
		left 0
		right 0
		top 0
		height 24px
		background-image unquote(stripe(gradclrs, 90deg, 24px))
		background-size 100% 100%
		background-repeat no-repeat
form
	card()
	padding 2rem
	width 720px
	box-sizing border-box
</style>
