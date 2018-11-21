<template lang="jade">
#buntpapier
	#hero
		h1 buntpapier

	#content
		h2 Inputs
		form
			bunt-input(name="an-input", label="ein lustiges Eingabefeld", v-model="text", hint="mit einem lustigen Hinweis")
			bunt-input(name="disabled-input", label="this is disabled", :disabled="true", value="a disabled value", hint="with a hint")
			bunt-input(name="an-input", label="Passwort!", type="password", v-model="password")
			bunt-input(name="an-input", placeholder="I am a placeholder, not a label", v-model="text", icon="search")
			bunt-select(name="a-select", label="Select something", v-model="selection", :options="['Delicious Pizza', 'All The Kebab', 'Burrrrrrito!', 'Noodles, Peking Duck', 'McKingC', 'Linsa mit Spätzle und Saita', 'Ice, Ice, Baby', 'Egg and bacon', 'Egg, sausage and bacon', 'Egg and Spam', 'Egg, bacon and Spam', 'Egg, bacon, sausage and Spam', 'Spam, bacon, sausage and Spam', 'Spam, egg, Spam, Spam, bacon and Spam', 'Spam, Spam, Spam, egg and Spam', 'Spam, Spam, Spam, Spam, Spam, Spam, baked beans, Spam, Spam, Spam and Spam', 'Lobster Thermidor aux crevettes with a Mornay sauce, garnished with truffle pâté, brandy and a fried egg on top, and Spam.']")
			p {{ selection }}
			bunt-select.complex-select(name="complex-select", label="complex select", v-model="activeComplexOption", :options="complexOptions", option-label="name")
				template(slot-scope="{ option }")
					.name {{ option.name }}
					.id(:style="{'background-color': option.color}") {{ option.id }}
			bunt-switch(name="a name", label="turn me oooon", v-model="turnOn")
			bunt-checkbox(name="a name", label="check it out", v-model="turnOn")
		h2 Validation!
		form
			bunt-input(name="name", label="enter a name", v-model="name", :validation="$v.name")
			bunt-select(name="a-select", label="Select something", v-model="validSelection", :options="['Okay']", :validation="$v.validSelection", :disabled="true")
		h2 Buttons
		bunt-button.button-default(@click.prevent="") CLICK ME
		bunt-button.button-primary(@click.prevent="", tooltip="with a tooltip") BUTTON
		bunt-button.button-default(@click.prevent="", icon="add") add
		bunt-button.button-primary(@click.prevent="", icon="add") BUTTON
		bunt-button.button-clear(@click.prevent="", style="clear") CLICK ME
		bunt-button.button-clear-primary(@click.prevent="", style="clear", icon="add") ADD
		bunt-button.button-primary(@click.prevent="", :loading="true") NEVER! EVER!
		bunt-button.button-primary(@click.prevent="", error-message="something bad happenend") NEVER! EVER!
		bunt-button.button-primary(@click.prevent="loadAsync", :loading="asyncLoading") async action
		bunt-button.button-primary(@click.prevent="loadAsync", :loading="asyncLoading", :error-message="asyncError") async action
		.unbreakable-button
			bunt-button.button-primary() You can't break me!
		bunt-button.button-primary(@click="alert('WHY')", :disabled="true", tooltip="with a tooltip") disabled
		h3 large button
		bunt-button.button-large I AM LARGE
		h3 huge button
		bunt-button.button-huge(tooltip="SO HUGE") I AM HUGE
		h2 Icon Buttons
		.icon-buttons-flat
			bunt-icon-button(@click.prevent="", tooltip="add") add
			bunt-icon-button(@click.prevent="", tooltip="remove", tooltip-placement="top") remove
		.icon-buttons-clear
			bunt-icon-button(@click.prevent="", tooltip="add") add
			bunt-icon-button(@click.prevent="", tooltip="remove", :tooltip-fixed="true") remove
			bunt-icon-button(@click.prevent="alert('WHY')", :disabled="true", tooltip="remove", :tooltip-fixed="true") remove
		h2 Button-style Links
		bunt-link-button(:to="{name: 'derp'}") click me
		bunt-link-button.link-button-colored(:to="{name: 'derp'}") click me

		h2 Loading Indicators
		.progress-circular
			bunt-progress-circular(size="tiny")
			bunt-progress-circular(size="small")
			bunt-progress-circular(size="normal")
			bunt-progress-circular(size="big")
			bunt-progress-circular(size="huge")

		h2 Dialogs
		.dialog
			bunt-button(@click="dialogOpen = true") Open dialog
			bunt-dialog(:open="dialogOpen", @close="dialogOpen = false")
				h2 MUH DIALOG
		h2 Popover
		.popover
			bunt-icon-button.popover-icon-button(ref="popoverButton", @click.prevent="") add
			bunt-popover(target="popoverButton")
				h1 POPOVER

		h2 Tooltips on any element
		.hoverable(v-tooltip.fixed="'HORRAY'") HOVER ME
		.hoverable(v-tooltip.top="'HORRAY'") UP TOP
		.hoverable(v-tooltip.left="'HORRAY'") LEFT
		.hoverable(v-tooltip.right="'HORRAY'") RIGHT

		h2 Tabs

		bunt-tabs.tabs-default(:active-tab="selectedTab")
			bunt-tab(header="Tab 1", id="Tab 1", @selected="selectedTab = 'Tab 1'")
			bunt-tab(header="Tab 2", id="Tab 2", @selected="selectedTab = 'Tab 2'", v-if="activateTab")
			bunt-tab(header="A longer Tab Heading", id="longer Heading" @selected="selectedTab = 'longer Heading'")
			p Selected Tab: {{ selectedTab }}

		bunt-tabs.tabs-default(:activeTab="1")
			bunt-tab(header="Tab 1")
			bunt-tab(header="Tab 2")
			bunt-tab(header="A longer Tab Heading")

		bunt-tabs.tabs-default(:active-tab="'three'")
			bunt-tab(header="Tab 1", id="one")
				h1 I AM A TAB
			bunt-tab(header="Tab 2", id="two")
				h1 I AM ANOTHER TAB
			bunt-tab(header="A longer Tab Heading", id="three")

		bunt-tabs.tabs-default
			bunt-tab(header="Tab 1", id="one")
				h1 I AM A TAB
			bunt-tab(header="Tab 2", id="two")
				h1 I AM ANOTHER TAB
			bunt-tab(header="A longer Tab Heading", id="three")

		bunt-tabs.tabs-default(:activeTab="1")
			bunt-tab(header="Tab 1")
			bunt-tab(header="A dynamic heading", v-if="activateTab")
			bunt-tab(header="Tab 2")

		bunt-switch(name="tabswitch", label="toogle tab", v-model="activateTab")

		div.scrollbar(v-scrollbar.x.y="")
			div
				div.scrolling-content
				div.scrolling-content
</template>
<script>
import '@mdi/font/css/materialdesignicons.css'
import './styles/style.styl'

import { required, email } from '../src/vuelidate/validators'

export default {
	components: {},
	replace: false,
	data () {
		return {
			text: '',
			password: '',
			name: '',
			turnOn: false,
			complexOptions: [
				{id: 1, name: 'One', color: 'red'},
				{id: 2, name: 'Two', color: 'blue'},
				{id: 3, name: 'Three', color: 'green'},
				{id: 5, name: 'Five', color: 'orange'},
			],
			asyncLoading: false,
			asyncError: null,
			activeComplexOption: 2,
			selectedTab: '',
			selection: null,
			validSelection: null,
			dialogOpen: false,
			activateTab: false
		}
	},
	validations: {
		name: {
			required: required('a man needs a name'),
			email: email('not a valid mail')
		},
		validSelection: {
			required: required('I SAID SELECT SOMETHING')
		}
	},
	methods: {
		loadAsync () {
			this.asyncLoading = true
			this.asyncError = null
			setTimeout(() => {
				this.asyncLoading = false
				this.asyncError = "DERP"
			}, 3000)
		}
	}
}
</script>button
<style lang="stylus">
@import 'styles/style.styl'
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
#content
	card()
	padding 2rem
	width 720px
	box-sizing border-box
.button-default
	button-style()
.button-primary
	button-style(color: $clr-primary)
.button-clear
	button-style(style: 'clear')
.button-clear-primary
		button-style(style: 'clear', color: $clr-primary)
.unbreakable-button
	display: flex
	width: 100px
	margin: 32px 0
.button-large
	button-style(size: 'large')
.button-huge
	button-style(size: 'huge')
.popover-icon-button
	icon-button-style($clr-primary, 'clear')
.complex-select
	ul li
		display: flex
		justify-content: space-between
		.id
			width: 120px
			text-align: right
			padding: 0 8px
			color: $clr-secondary-text-dark
.icon-buttons-flat button
	icon-button-style()
.icon-buttons-clear
	overflow: hidden
	background-color $clr-primary
	button
		icon-button-style($clr-primary-text-dark, 'clear')
.bunt-link-button
	margin: 0 4px
.link-button-colored
	link-button-style(color: $clr-primary)
.hoverable
	width: 100px
	border: 1px solid black
	padding: 8px
.tabs-default
	tabs-style()

.scrollbar
	height: 400px
	width: 600px
	.scrolling-content
		height: 900px
		width: 1000px
		background: radial-gradient(rgba(219,255,0,1) 0%, rgba(255,177,0,1) 12%, rgba(255,0,0,1) 21%, rgba(0,0,255,1) 33%, rgba(181,255,0,1) 56%, rgba(0,255,65,1) 66%, rgba(255,0,0,1) 85%, rgba(0,212,255,1) 100%)
</style>
