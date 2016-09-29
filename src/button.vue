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
