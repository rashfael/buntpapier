<template  lang="jade">
button.bunt-button(:class="styleClasses", :type="type", :disabled="disabled || loading", v-el:button)
	.bunt-button-content(:class="{ 'invisible': loading }")
		i.bunt-icon.material-icons(v-if="icon") {{{ icon }}}
		//- quake-icon.quake-button-icon(:class="{ 'position-right': iconRight }", :icon="icon", v-if="showIcon")
		.bunt-button-text
			slot
				span(v-text="text")
		//- quake-icon.quake-button-dropdown-icon(icon="&#xe5c5;", v-if="!iconRight && showDropdownIcon && (hasDropdownMenu || hasPopover)")
	//- quake-progress-circular.quake-button-spinner(:color="spinnerColor", :size="18", :stroke="4.5", disable-transition, v-show="loading")
	ripple-ink(v-if="!noInk && !disabled", :trigger="$els.button")

	//- quake-popover(:trigger="$els.button", :open-on="openDropdownOn", :dropdown-position="dropdownPosition"
	//- 	v-if="hasPopover")
	//- 	slot(name="popover")
</template>
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
		style: {
			type: String,
			default: 'normal', // 'normal' or 'clear'
			coerce(style) {
				return `${consts.prefix}-button-${style}`
			}
		},
		color: {
			type: String,
			default: 'default', // one of $clr-names
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
		type: {
			type: String,
			default: 'submit'
		}
	},

	computed: {
		styleClasses() {
			let classes = [this.style, this.color]

			if (this.raised) {
				classes.push(`${consts.prefix}-button-raised`)
			}

			if (this.hasDropdownMenu || this.hasPopover) {
				classes.push('has-dropdown')
			}

			return classes
		},

		spinnerColor() {
			if (this.color === 'color-default' || this.type === 'quake-button-clear') {
				return 'black';
			}

			return 'white';
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
