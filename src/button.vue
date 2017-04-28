<template lang="jade">
button.bunt-button(:type="type", :disabled="disabled || loading || showSuccess", ref="button", @mouseenter="userShowTooltip = true", @mouseleave="userShowTooltip = false", :class="{error: errorMessage, success: showSuccess}")
	.bunt-button-content(:class="{invisible: loading || errorMessage || showSuccess }")
		i.bunt-icon.material-icons(v-if="icon", v-html="icon")
		.bunt-button-text
			slot
				span(v-text="text")
	progress-circular(v-show="loading", size="small")
	i.bunt-icon.material-icons.error(v-if="errorMessage") replay
	i.bunt-icon.material-icons.success(v-if="showSuccess") done
	ripple-ink(v-if!="!noInk && !disabled")
	tooltip(:show="showTooltip") {{ _tooltip }}
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
import ProgressCircular from './progress-circular'
import Tooltip from './tooltip'
export default {
	name: `${consts.prefix}-button`,
	components: { ProgressCircular, Tooltip },
	props: {
		text: String,
		icon: String,
		tooltip: String,
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
			default: 'button'
		},
		errorMessage: String,
		successAfterLoading: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			userShowTooltip: false,
			_loading: false,
			showSuccess: false
		}
	},
	computed: {
		showTooltip () {
			return (this.tooltip && this.userShowTooltip && !this.showSuccess && !this.loading) || !!this.errorMessage
		},
		_tooltip () {
			return this.errorMessage ? this.errorMessage : this.tooltip 
		}
	},
	watch: {
		loading: 'loadingChanged'
	},
	mixins: [
		// HasDropdown,
		RippleInk
	],

	methods: {
		loadingChanged (value) {
			if (value)
				this._loading = value
			else {
				this._loading = value
				this.showSuccess = true
				setTimeout(() => {
					this.showSuccess = false
				}, 3000)
			}
		}
	}
}
</script>
