<template  lang="jade">
button.bunt-button(:class="styleClasses", :type="buttonType", :disabled="disabled || loading", v-el:button)
	.bunt-button-content(:class="{ 'invisible': loading }")
		//- quake-icon.quake-button-icon(:class="{ 'position-right': iconRight }", :icon="icon", v-if="showIcon")
		.bunt-button-text
			slot
				span(v-text="text")
		//- quake-icon.quake-button-dropdown-icon(icon="&#xe5c5;", v-if="!iconRight && showDropdownIcon && (hasDropdownMenu || hasPopover)")
	//- quake-progress-circular.quake-button-spinner(:color="spinnerColor", :size="18", :stroke="4.5", disable-transition, v-show="loading")
	ripple-ink(v-if="!hideRippleInk && !disabled", :trigger="$els.button")

	//- quake-menu.quake-button-dropdown-menu(:trigger="$els.button", :options="menuOptions"
	//- 	:show-icons="showMenuIcons", :show-secondary-text="showMenuSecondaryText"
	//- 	:open-on="openDropdownOn", @option-selected="menuOptionSelect"
	//- 	:dropdown-position="dropdownPosition", v-if="hasDropdownMenu"
	//- )
	//-
	//- quake-popover(:trigger="$els.button", :open-on="openDropdownOn", :dropdown-position="dropdownPosition"
	//- 	v-if="hasPopover")
	//- 	slot(name="popover")
</template>
<style lang="stylus">
.{$prefix}-button
	font-size 14px
	text-transform uppercase
	font-weight 500
	line-height 1.71em
	letter-spacing 0.02em

	background none
	overflow hidden
	outline none
	border none

	position relative
	display inline-flex
	align-items center
	justify-content center
	cursor default

	border-radius 2px
	padding 8px 16px
	min-width 80px
	height 40px

	&::-moz-focus-inner
		border 0

	&.autofocus:focus,
	body[modality="keyboard"] &:focus
		outline-style solid

	&[disabled]
		opacity 0.6

	&:not([disabled])
		cursor pointer

.{$prefix}-button-raised
	box-shadow 0 0 2px alpha(black, 0.12), 0 2px 2px alpha(black, 0.2)
	transition box-shadow 0.1s

	&.autofocus:focus,
	body[modality="keyboard"] &:focus
		outline none
		box-shadow 0 0 5px alpha(black, 0.22), 0 3px 6px alpha(black, 0.3)

.{$prefix}-button-normal
	&.autofocus:focus,
	body[modality="keyboard"] &:focus
		outline-width 2px
		outline-offset 2px

	&.color-primary,
	&.color-accent,
	&.color-success,
	&.color-warning,
	&.color-danger
		color $clr-white

		.{$prefix}-ripple-ink .ripple.held
			opacity: 0.7

	&.color-default
		color $clr-primary-text-light
		background-color $clr-grey-200

		&:hover:not([disabled]),
		&.dropdown-open
			background-color darken($clr-grey-200, 7.5%)

		&.autofocus:focus,
		body[modality="keyboard"] &:focus
			background-color darken($clr-grey-200, 15%)
			outline-color darken($clr-grey-200, 30%)

		.quake-ripple-ink .ripple.held
			opacity 0.2

		.quake-button-icon,
		.quake-button-dropdown-icon
			color $clr-secondary-text-light

	/*&.color-primary
		background-color $md-brand-primary

		&:hover:not([disabled]),
		&.dropdown-open
			background-color darken($md-brand-primary, 15%)

		&.autofocus:focus,
		body[modality="keyboard"] &:focus
			background-color darken($md-brand-primary, 20%)
			outline-color darken($md-brand-primary, 20%)

	&.color-accent
		background-color $md-brand-accent

		&:hover:not([disabled]),
		&.dropdown-open
			background-color darken($md-brand-accent, 15%)

		&.autofocus:focus,
		body[modality="keyboard"] &:focus
			background-color darken($md-brand-accent, 20%)
			outline-color darken($md-brand-accent, 20%)

	&.color-success
		background-color $md-green

		&:hover:not([disabled]),
		&.dropdown-open
			background-color darken($md-green, 15%)

		&.autofocus:focus,
		body[modality="keyboard"] &:focus
			background-color darken($md-green, 20%)
			outline-color darken($md-green, 20%)

	&.color-warning
		background-color $md-orange

		&:hover:not([disabled]),
		&.dropdown-open
			background-color darken($md-orange, 15%)

		&.autofocus:focus,
		body[modality="keyboard"] &:focus
			background-color darken($md-orange, 20%)
			outline-color darken($md-orange, 20%)

	&.color-danger
		background-color $md-red

		&:hover:not([disabled]),
		&.dropdown-open
			background-color darken($md-red, 15%)

		&.autofocus:focus,
		body[modality="keyboard"] &:focus
			background-color darken($md-red, 20%)
			outline-color:darken($md-red, 20%)*/
</style>
<script>
// import QuakeIcon from './icon'
// import QuakeMenu from './menu'
// import QuakePopover from './popover'
// import QuakeProgressCircular from './progress-circular'
//
// import disabled from './directives/disabled'
//
// import HasDropdown from './mixins/HasDropdown'
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
export default {
	name: `${consts.prefix}-button`,

	props: {
		type: {
			type: String,
			default: 'normal', // 'normal' or 'flat'
			coerce(type) {
				return `${consts.prefix}-button-${type}`
			}
		},
		color: {
			type: String,
			default: 'default', // 'default', 'primary', 'accent', 'success', 'warning', or 'danger'
			coerce(color) {
				return 'color-' + color;
			}
		},
		raised: {
			type: Boolean,
			default: false
		},
		text: String,
		icon: String,
		iconRight: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		showDropdownIcon: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		buttonType: {
			type: String,
			default: 'submit'
		}
	},

	computed: {
		styleClasses() {
			let classes = [this.type, this.color];

			if (this.raised) {
				classes.push(`${consts.prefix}-button-raised`);
			}

			if (this.hasDropdownMenu || this.hasPopover) {
				classes.push('has-dropdown');
			}

			return classes;
		},

		spinnerColor() {
			if (this.color === 'color-default' || this.type === 'quake-button-flat') {
				return 'black';
			}

			return 'white';
		},

		showIcon() {
			return Boolean(this.icon);
		}
	},

	// components: {
	// 	QuakeIcon,
	// 	QuakeMenu,
	// 	QuakePopover,
	// 	QuakeProgressCircular
	// },

	mixins: [
		// HasDropdown,
		RippleInk
	],

	// directives: {
	// 	disabled
	// }
};
</script>
